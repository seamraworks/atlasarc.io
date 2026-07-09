#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CONFIG_PATH = path.join(ROOT, 'copy-style-rules.json');
const COPY_STYLE_TEMPLATE = path.join(ROOT, 'src', 'reports', 'copy-style.hbs');
const ANSI = {
  redBold: '\x1b[1;31m',
  reset: '\x1b[0m',
};

const TRACKS = {
  deterministic: {
    name: 'deterministic',
    reportPath: 'copy-style-findings.json',
    htmlDir: '_reports/copy-style',
    failOnUntriaged: true,
    syncWithPreviousReport: true,
    includeDeterministic: true,
    includeOpenAI: false,
  },
  openai: {
    name: 'openai',
    reportPath: 'copy-style-openai-findings.json',
    htmlDir: '_reports/copy-style-openai',
    failOnUntriaged: false,
    syncWithPreviousReport: false,
    includeDeterministic: false,
    includeOpenAI: true,
  },
};

function parseArgs(argv) {
  const args = {
    openai: null,
    reportPath: null,
    quiet: false,
    verbose: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--openai') args.openai = true;
    else if (arg === '--no-openai') args.openai = false;
    else if (arg === '--report') args.reportPath = argv[++i];
    else if (arg.startsWith('--report=')) args.reportPath = arg.slice('--report='.length);
    else if (arg === '--quiet') args.quiet = true;
    else if (arg === '--verbose') args.verbose = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/copy-style-audit.mjs [--openai|--no-openai] [--report path] [--quiet|--verbose]

Environment:
  OPENAI_API_KEY              Required for the OpenAI reviewer when --openai is used.
  COPY_STYLE_OPENAI_MODEL     Override the configured low-cost model.
`);
}

function slash(p) {
  return p.replace(/\\/g, '/');
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readJSONIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return readJSON(file);
}

async function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function phraseRegex(phrase) {
  const escaped = escapeRegExp(phrase).replace(/\s+/g, '\\s+');
  const startsWord = /^\w/.test(phrase);
  const endsWord = /\w$/.test(phrase);
  return new RegExp(`${startsWord ? '\\b' : ''}${escaped}${endsWord ? '\\b' : ''}`, 'iu');
}

function stripInlineNoise(line) {
  return line
    .replace(/{{![\s\S]*?}}/g, ' ')
    .replace(/{{[#/>]?\s*[^}]+}}/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&rarr;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function shouldSkipLine(raw, state) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('```')) {
    state.inFence = !state.inFence;
    return true;
  }
  if (state.inFence) return true;
  if (/<pre\b/i.test(raw) || /<code\b/i.test(raw)) state.inHtmlCode = true;
  if (state.inHtmlCode) {
    if (/<\/code>/i.test(raw) || /<\/pre>/i.test(raw)) state.inHtmlCode = false;
    return true;
  }
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return true;
  if (trimmed.startsWith('{{!') || trimmed.startsWith('<!--')) return true;
  return false;
}

function shouldScanJSONLine(raw) {
  return /^\s*"(description|intro|body|label|title|seo_description|subtitle|summary)"\s*:/.test(raw);
}

async function collectFiles(config) {
  const excluded = new Set((config.exclude || []).map((p) => slash(path.normalize(p))));
  const files = [];
  for (const entry of config.scan || []) {
    const dir = path.join(ROOT, entry.dir);
    const extensions = new Set(entry.extensions || []);
    for await (const file of walk(dir)) {
      const rel = slash(path.relative(ROOT, file));
      if (excluded.has(rel)) continue;
      if (extensions.has(path.extname(file))) files.push(file);
    }
  }
  return files.sort((a, b) => slash(a).localeCompare(slash(b)));
}

function addFinding(findings, perRuleCount, config, finding) {
  const key = `${finding.file}:${finding.ruleId}`;
  const max = config.maxFindingsPerRulePerFile || Number.POSITIVE_INFINITY;
  const count = perRuleCount.get(key) || 0;
  if (count >= max) return;
  perRuleCount.set(key, count + 1);
  findings.push(finding);
}

async function deterministicAudit(config, files) {
  const findings = [];
  const perRuleCount = new Map();
  const phraseRules = (config.reviewPhrases || []).map((rule) => ({
    ...rule,
    id: `phrase:${rule.phrase}`,
    regex: phraseRegex(rule.phrase),
  }));
  const patternRules = (config.warnPatterns || []).map((rule, index) => ({
    ...rule,
    id: `pattern:${index + 1}`,
    regex: new RegExp(rule.pattern, 'iu'),
  }));

  for (const file of files) {
    const rel = slash(path.relative(ROOT, file));
    const isJSON = path.extname(file) === '.json';
    const lines = (await fsp.readFile(file, 'utf8')).split(/\r?\n/);
    const state = { inFence: false, inHtmlCode: false };
    let emDashCount = 0;
    let wordCount = 0;
    let firstEmDashLine = null;
    let firstEmDashText = null;
    const emDashLines = [];

    for (let i = 0; i < lines.length; i += 1) {
      const raw = lines[i];
      if (shouldSkipLine(raw, state)) continue;
      if (isJSON && !shouldScanJSONLine(raw)) continue;
      const text = stripInlineNoise(raw);
      if (!text) continue;
      const lineWords = text.match(/\b[\p{L}\p{N}'-]+\b/gu) || [];
      const lineEmDashes = /Screenshot\s+—/iu.test(text) || lineWords.length === 0
        ? 0
        : (text.match(/—/gu) || []).length;
      if (lineEmDashes > 0 && firstEmDashLine === null) {
        firstEmDashLine = i + 1;
        firstEmDashText = text;
      }
      if (lineEmDashes > 0) {
        emDashLines.push({ line: i + 1, text });
      }
      emDashCount += lineEmDashes;
      wordCount += lineWords.length;

      for (const rule of phraseRules) {
        if (!rule.regex.test(text)) continue;
        addFinding(findings, perRuleCount, config, {
          source: 'deterministic',
          file: rel,
          line: i + 1,
          severity: rule.severity || 'medium',
          ruleId: rule.id,
          exactText: text,
          reason: `Review phrase: "${rule.phrase}". Check whether the usage is concrete, intentional, and product-specific.`,
          suggestedRewrite: null,
          needs: 'Do not rewrite solely to remove this word, and do not synonym-swap. ACCEPT if the sentence is concrete, literal, and product-specific; otherwise add the actual AtlasArc feature, workflow, metric, or consequence, or delete the sentence.',
        });
      }

      for (const rule of patternRules) {
        if (!rule.regex.test(text)) continue;
        addFinding(findings, perRuleCount, config, {
          source: 'deterministic',
          file: rel,
          line: i + 1,
          severity: rule.severity || 'low',
          ruleId: rule.id,
          exactText: text,
          reason: rule.rule,
          suggestedRewrite: null,
          needs: 'Manual review.',
        });
      }
    }

    const emDashRule = config.emDashDensity;
    if (emDashRule && emDashCount > 0 && wordCount > 0) {
      const per1000Words = (emDashCount / wordCount) * 1000;
      if (emDashCount >= (emDashRule.minCount || 1) && per1000Words > emDashRule.maxPer1000Words) {
        addFinding(findings, perRuleCount, config, {
          source: 'deterministic',
          file: rel,
          line: firstEmDashLine,
          severity: emDashRule.severity || 'low',
          ruleId: 'density:em-dash',
          exactText: firstEmDashText,
          reason: `${emDashRule.rule} Found ${emDashCount} em dash(es), about ${per1000Words.toFixed(1)} per 1000 words.`,
          suggestedRewrite: null,
          needs: 'Manual review.',
        });
        for (const emDashLine of emDashLines.slice(1)) {
          addFinding(findings, perRuleCount, config, {
            source: 'deterministic',
            file: rel,
            line: emDashLine.line,
            severity: emDashRule.severity || 'low',
            ruleId: 'density:em-dash',
            exactText: emDashLine.text,
            reason: `${emDashRule.rule} Found ${emDashCount} em dash(es), about ${per1000Words.toFixed(1)} per 1000 words.`,
            suggestedRewrite: null,
            needs: 'Manual review.',
          });
        }
      }
    }
  }
  return findings;
}

function fileTextForOpenAI(file, content) {
  const rel = slash(path.relative(ROOT, file));
  const lines = content.split(/\r?\n/);
  const state = { inFence: false, inHtmlCode: false };
  const kept = [];
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (shouldSkipLine(raw, state)) continue;
    const text = stripInlineNoise(raw);
    if (text) kept.push(`${i + 1}: ${text}`);
  }
  if (!kept.length) return '';
  return `FILE: ${rel}\n${kept.join('\n')}`;
}

async function buildOpenAIInput(files, maxChars) {
  const blocks = [];
  let used = 0;
  for (const file of files) {
    const block = fileTextForOpenAI(file, await fsp.readFile(file, 'utf8'));
    if (!block) continue;
    const next = `${block}\n\n`;
    if (used + next.length > maxChars) {
      const remaining = maxChars - used;
      if (remaining > 500) blocks.push(next.slice(0, remaining));
      break;
    }
    blocks.push(next);
    used += next.length;
  }
  return blocks.join('');
}

function outputTextFromResponse(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') chunks.push(content.text);
      if (typeof content.output_text === 'string') chunks.push(content.output_text);
    }
  }
  return chunks.join('\n').trim();
}

function openAIPrompt(sourceText) {
  return `You are auditing the website copy for AtlasArc, an IntelliJ plugin for Java, Kotlin, and TypeScript dependency and architecture visualization.

Goal:
Find copy that sounds recognizably AI-generated, generic, over-polished, or like SaaS marketing filler.

Do NOT judge whether AI wrote it.
Do NOT rewrite the whole website.
Do NOT make the tone more salesy.
Do NOT add hype.

AtlasArc voice:
- technical
- concrete
- aimed at tech-savvy developers and software architects
- casual when that helps the point land
- allowed to use small anecdotes, inflection, and "you have been here" examples
- opinionated but not grandiose
- written by someone who has actually worked through messy JVM and TypeScript architecture
- specific to Java/Kotlin bytecode analysis, TypeScript artifact analysis, IntelliJ, dependency structure, architecture boundaries, cycles, metrics, hotspots, and refactoring risk
- avoids generic SaaS phrases
- sounds like a developer talking to another developer, not like a linter or a polished enterprise brochure

Important:
Do not penalize copy just because it is conversational. Relatable examples, short setup stories, and mild informal rhythm are part of the intended voice when they make the architectural point more concrete.
Do not penalize ordinary technical vocabulary just because it appears in a review list. "Quality" is normal in code-metric contexts. "Comprehensive" is acceptable when it literally describes breadth, such as a broad library or documentation set. Flag these only when the surrounding sentence is generic or unsupported.

Flag sentences that contain:
1. Review phrases that can be AI tells in weak copy, such as "delve into", "unlock", "empower", "seamless", "robust", "comprehensive", "elevate", "transform", "game-changing", "at its core", "in today's fast-paced world", "not just X, but Y", "X isn't just Y; it's Z", "And honestly?", "Let's be real", or "The truth is". These words are review signals, not automatic violations; flag them only when the sentence needs triage.
2. AI-style rhythm: generic opening claim followed by abstract benefit, contrast framing, excessive em-dashes, abstract lists of three, repeated paragraph shapes, motivational tone without concrete product detail.
3. Specificity failures: could apply to any developer tool, lacks an AtlasArc feature, or uses broad nouns like clarity, insight, confidence, productivity, architecture, or quality without concrete support. Do not flag quality when it is used literally in code-quality or metric explanation.

Return only JSON matching the schema. Prefer deletion over polishing when the sentence adds no information.
Do not suggest a simple synonym swap. Do not rewrite just to remove a flagged word. A good fix must add specificity, name the actual AtlasArc behavior, or remove weak copy.

Website source:
${sourceText}`;
}

async function openAIAudit(config, files) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI reviewer requested, but OPENAI_API_KEY is not set.');
  }

  const model = process.env[config.openai.modelEnv] || config.openai.defaultModel;
  const sourceText = await buildOpenAIInput(files, config.openai.maxInputChars || 60000);
  if (!sourceText.trim()) return { enabled: true, model, findings: [] };

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      findings: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            file: { type: 'string' },
            line: { type: ['integer', 'null'] },
            exactSentence: { type: 'string' },
            severity: { type: 'string', enum: ['low', 'medium', 'high'] },
            reason: { type: 'string' },
            suggestedRewrite: { type: 'string' },
            needs: { type: 'string' }
          },
          required: ['file', 'line', 'exactSentence', 'severity', 'reason', 'suggestedRewrite', 'needs']
        }
      }
    },
    required: ['findings']
  };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'user',
          content: [{ type: 'input_text', text: openAIPrompt(sourceText) }]
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'atlasarc_copy_style_audit',
          strict: true,
          schema
        }
      },
      max_output_tokens: config.openai.maxOutputTokens || 5000
    })
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data.error?.message || `${response.status} ${response.statusText}`;
    throw new Error(`OpenAI reviewer failed: ${message}`);
  }

  const outputText = outputTextFromResponse(data);
  const parsed = JSON.parse(outputText);
  return {
    enabled: true,
    model,
    findings: (parsed.findings || []).map((finding) => ({
      source: 'openai',
      file: finding.file,
      line: finding.line,
      severity: finding.severity,
      ruleId: 'openai:style-review',
      exactText: finding.exactSentence,
      reason: finding.reason,
      suggestedRewrite: finding.suggestedRewrite || null,
      needs: finding.needs
    }))
  };
}

function runModeFromArgs(args) {
  return args.openai ? TRACKS.openai : TRACKS.deterministic;
}

function countBySeverity(findings) {
  const counts = { low: 0, medium: 0, high: 0 };
  for (const finding of findings) counts[finding.severity] += 1;
  return counts;
}

function sortFindings(findings) {
  return [...findings].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return Number(Boolean(a.triageAccepted)) - Number(Boolean(b.triageAccepted))
      || (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99)
      || String(a.file).localeCompare(String(b.file))
      || (a.line || 0) - (b.line || 0);
  });
}

async function renderCopyStyleHtmlReport(report, track, reportPath) {
  const findings = sortFindings(reportFindings(report));
  const tpl = Handlebars.compile(await fsp.readFile(COPY_STYLE_TEMPLATE, 'utf8'));
  const htmlDir = path.join(DIST, track.htmlDir);
  const html = tpl({
    ...report,
    findings,
    summary: countBySeverity(findings),
    reportPathRelative: slash(path.relative(ROOT, reportPath)),
    reportJsonRelative: slash(path.join(track.htmlDir, 'report.json')),
    htmlReportRelative: slash(path.join(track.htmlDir, 'index.html')),
  });
  await fsp.mkdir(htmlDir, { recursive: true });
  await fsp.writeFile(path.join(htmlDir, 'index.html'), html);
  await fsp.writeFile(path.join(htmlDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
}

function findingFingerprint(finding) {
  return [
    finding.source,
    finding.ruleId,
    finding.file,
    finding.line == null ? '' : finding.line,
    finding.exactText,
  ].join('\u001f');
}

function redBold(text) {
  return `${ANSI.redBold}${text}${ANSI.reset}`;
}

function reportFindings(report) {
  if (!report) return [];
  return [...(report.deterministic?.findings || []), ...(report.openai?.findings || [])];
}

function applyTriage(findings, previousReport, config) {
  const accepted = config.acceptedTriageValue || 'ACCEPTED';
  const unknown = config.unknownTriageValue || 'UNKNOWN';
  const previousByFingerprint = new Map();
  for (const finding of reportFindings(previousReport)) {
    previousByFingerprint.set(findingFingerprint(finding), finding);
  }

  for (const finding of findings) {
    finding.fingerprint = findingFingerprint(finding);
    const previous = previousByFingerprint.get(finding.fingerprint);
    finding.triage = previous?.triage === accepted ? accepted : unknown;
    finding.triageAccepted = finding.triage === accepted;
  }

  return {
    previousReportFound: previousReport != null,
    accepted,
    unknown,
    acceptedFindings: findings.filter((finding) => finding.triageAccepted),
    untriagedFindings: findings.filter((finding) => !finding.triageAccepted),
  };
}

function markAllFindingsUnknown(findings, config) {
  const accepted = config.acceptedTriageValue || 'ACCEPTED';
  const unknown = config.unknownTriageValue || 'UNKNOWN';
  for (const finding of findings) {
    finding.fingerprint = findingFingerprint(finding);
    finding.triage = unknown;
    finding.triageAccepted = false;
  }
  return {
    previousReportFound: false,
    accepted,
    unknown,
    acceptedFindings: [],
    untriagedFindings: findings,
    staleFindingsPurged: 0,
  };
}

function printUntriagedFindings(untriagedFindings, maxUntriagedConsoleFindings, reportPathRelative) {
  if (!untriagedFindings.length) return;
  console.error(`[copy-style] ${untriagedFindings.length} finding(s) need triage. Set triage to ACCEPTED in ${reportPathRelative}, or fix the copy so the line disappears from the report.`);
  console.error('[copy-style] Acceptance rules:');
  console.error('[copy-style] - A flagged word is not a defect by itself; do not rewrite solely to remove it.');
  console.error('[copy-style] - Do not fix by swapping in a synonym.');
  console.error('[copy-style] - ACCEPTED is valid when the usage is concrete, accurate, product-specific, literal, and intentional.');
  console.error('[copy-style] - Quality is normal in code-metric contexts; comprehensive is valid when it literally describes breadth.');
  console.error('[copy-style] - If it is generic, add the real AtlasArc feature/workflow/metric/consequence or delete the sentence.');
  console.error('[copy-style] - Em-dash findings are punctuation/style findings; do not preserve generic contrast-rhythm with different punctuation.');
  for (const finding of untriagedFindings.slice(0, maxUntriagedConsoleFindings)) {
    const line = finding.line == null ? '' : `:${finding.line}`;
    console.error(`[copy-style] TRIAGE ${finding.severity.toUpperCase()} ${finding.file}${line} ${finding.reason}`);
    console.error(`             ${redBold(finding.exactText)}`);
    if (finding.suggestedRewrite) console.error(`             rewrite: ${finding.suggestedRewrite}`);
  }
  if (untriagedFindings.length > maxUntriagedConsoleFindings) {
    console.error(`[copy-style] ${untriagedFindings.length - maxUntriagedConsoleFindings} more untriaged finding(s) omitted from console output.`);
  }
}

function printSummary(findings, reportPath, maxConsoleFindings, options = {}) {
  const counts = countBySeverity(findings);
  const acceptedCount = findings.filter((finding) => finding.triageAccepted).length;
  const untriagedCount = findings.length - acceptedCount;
  const reportPathRelative = slash(path.relative(ROOT, reportPath));
  console.log(`[copy-style] ${findings.length} finding(s): ${counts.high} high, ${counts.medium} medium, ${counts.low} low; ${acceptedCount} accepted, ${untriagedCount} need triage.`);
  if (options.quiet) {
    console.log(`[copy-style] JSON report: ${reportPathRelative}`);
    printUntriagedFindings(options.untriagedFindings || [], options.maxUntriagedConsoleFindings || 12, reportPathRelative);
    return;
  }
  for (const finding of findings.slice(0, maxConsoleFindings)) {
    const line = finding.line == null ? '' : `:${finding.line}`;
    console.log(`[copy-style] ${finding.severity.toUpperCase()} ${finding.file}${line} ${finding.reason}`);
    console.log(`             ${finding.exactText}`);
    if (finding.suggestedRewrite) console.log(`             rewrite: ${finding.suggestedRewrite}`);
  }
  if (findings.length > maxConsoleFindings) {
    console.log(`[copy-style] ${findings.length - maxConsoleFindings} more finding(s) omitted from console output.`);
  }
  console.log(`[copy-style] full report: ${reportPathRelative}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = readJSON(CONFIG_PATH);
  const track = runModeFromArgs(args);
  const files = await collectFiles(config);
  const deterministicFindings = track.includeDeterministic ? await deterministicAudit(config, files) : [];
  const openAIResult = track.includeOpenAI
    ? await openAIAudit(config, files)
    : { enabled: false, findings: [] };

  const reportPath = path.resolve(ROOT, args.reportPath || track.reportPath || config.reportPath || 'copy-style-findings.json');
  const previousReport = track.syncWithPreviousReport ? readJSONIfExists(reportPath) : null;
  const allFindings = [...deterministicFindings, ...(openAIResult.findings || [])];
  const triage = track.syncWithPreviousReport
    ? applyTriage(allFindings, previousReport, config)
    : markAllFindingsUnknown(allFindings, config);

  const report = {
    generatedAt: new Date().toISOString(),
    track: track.name,
    triage: {
      previousReportFound: triage.previousReportFound,
      acceptedValue: triage.accepted,
      unknownValue: triage.unknown,
      acceptedCount: triage.acceptedFindings.length,
      untriagedCount: triage.untriagedFindings.length,
      staleFindingsPurged: track.syncWithPreviousReport
        ? Math.max(0, reportFindings(previousReport).length - allFindings.length)
        : 0,
    },
    acceptanceRules: config.acceptanceRules || [],
    deterministic: {
      findings: deterministicFindings
    },
    openai: openAIResult,
    files: files.map((file) => slash(path.relative(ROOT, file)))
  };

  await fsp.mkdir(path.dirname(reportPath), { recursive: true });
  await fsp.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  await renderCopyStyleHtmlReport(report, track, reportPath);
  console.log(`[copy-style] HTML report: ${slash(path.join('dist', track.htmlDir, 'index.html'))}`);

  printSummary(allFindings, reportPath, config.maxConsoleFindings || 40, {
    quiet: args.quiet && !args.verbose,
    untriagedFindings: triage.untriagedFindings,
    maxUntriagedConsoleFindings: config.maxUntriagedConsoleFindings || 12,
  });

  if (track.failOnUntriaged && triage.untriagedFindings.length > 0) {
    console.error(`[copy-style] failing build because ${triage.untriagedFindings.length} current finding(s) are not triaged as ACCEPTED. The JSON report has been synchronized to current content; fixed/stale findings were removed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`[copy-style] ${err.stack || err.message}`);
  process.exit(1);
});
