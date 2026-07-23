/**
 * AtlasArc website build pipeline.
 *
 * Static site renderer for AtlasArc.io.
 *
 * Workspace-level architecture/content notes may exist outside this repository
 * when checked out inside a larger Seamra Works workspace.
 *  - Handlebars (used directly, NOT gulp-handlebars) for the decorator/layout pattern
 *  - Front-matter Markdown -> structured workflow/metric pages
 *  - manifest/site.json + manifest/nav.json are the single source of truth
 *    (nav, prefetch links, and sitemap.xml are all derived from them)
 *  - LESS -> shared chrome stylesheets plus route-sized CSS chunks
 *  - TypeScript -> native ESM (tsc, no bundler)
 *  - Pagefind static search index (non-fatal if the binary is unavailable)
 */
import gulp from 'gulp';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import Handlebars from 'handlebars';
import matter from 'gray-matter';
import { marked } from 'marked';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const MANIFEST = path.join(__dirname, 'manifest');
const SITE_BASE = 'https://atlasarc.io';
const PUBLIC_STYLE_CHUNKS = ['main', 'home', 'product', 'features', 'catalog', 'compare', 'pricing', 'docs'];
const PUBLIC_STYLE_HREFS = [...PUBLIC_STYLE_CHUNKS.map(cssHref), '/pagefind/pagefind-ui.css'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function readSiteConfig() {
  const site = readJSON(path.join(MANIFEST, 'site.json'));
  configureAnalytics(site);
  return site;
}

function configureAnalytics(site) {
  const raw = site.analytics || {};
  const mode = String(process.env.ATLASARC_ANALYTICS || '').toLowerCase();
  const explicitDomain = process.env.ATLASARC_ANALYTICS_DOMAIN || process.env.PLAUSIBLE_DOMAIN || '';
  const explicitScriptId = process.env.ATLASARC_ANALYTICS_SCRIPT_ID || process.env.PLAUSIBLE_SCRIPT_ID || '';

  if (mode === '0' || mode === 'false') {
    delete site.analytics;
    return;
  }

  const enabled = mode === '1' || explicitDomain !== '' || explicitScriptId !== '';
  const provider = process.env.ATLASARC_ANALYTICS_PROVIDER || raw.provider;
  const domain = explicitDomain || raw.domain;
  const scriptId = explicitScriptId || raw.scriptId;

  if (enabled && (!provider || !domain)) {
    throw new Error('[analytics] ATLASARC_ANALYTICS is enabled, but provider/domain is incomplete.');
  }

  if (enabled && provider === 'plausible' && !scriptId) {
    throw new Error('[analytics] Plausible analytics is enabled, but scriptId is incomplete.');
  }

  if (scriptId && !/^[A-Za-z0-9_-]+$/.test(scriptId)) {
    throw new Error('[analytics] Plausible scriptId may only contain letters, numbers, underscores, or dashes.');
  }

  if (!enabled || !provider || !domain) {
    delete site.analytics;
    return;
  }

  site.analytics = { provider, domain, scriptId };
}

function plausibleScriptSrc(analytics) {
  return `https://plausible.io/js/pa-${analytics.scriptId}.js`;
}

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function writeDist(relPath, contents) {
  const out = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const body = relPath.endsWith('.html') ? openExternalAnchorsInNewTabs(contents) : contents;
  fs.writeFileSync(out, body);
}

function openExternalAnchorsInNewTabs(html) {
  return String(html).replace(/<a\b([^>]*?)\bhref=(["'])(https?:\/\/[^"']+)\2([^>]*)>/gi, (match, before, quote, href, after) => {
    if (!isExternalHref(href)) return match;

    let tag = `<a${before}href=${quote}${href}${quote}${after}>`;
    if (/\btarget=(["']).*?\1/i.test(tag)) {
      tag = tag.replace(/\btarget=(["']).*?\1/i, 'target="_blank"');
    } else {
      tag = tag.replace(/>$/, ' target="_blank">');
    }

    if (/\brel=(["']).*?\1/i.test(tag)) {
      tag = tag.replace(/\brel=(["'])(.*?)\1/i, (_rel, _q, value) => {
        const values = new Set(String(value).split(/\s+/).filter(Boolean));
        values.add('noopener');
        values.add('noreferrer');
        return `rel="${[...values].join(' ')}"`;
      });
    } else {
      tag = tag.replace(/>$/, ' rel="noopener noreferrer">');
    }
    return tag;
  });
}

function isExternalHref(href) {
  try {
    return new URL(href).origin !== SITE_BASE;
  } catch {
    return false;
  }
}

function cssHref(chunk) {
  return `/assets/${chunk}.css`;
}

function unique(values) {
  return [...new Set(values)];
}

function styleContext(chunks, extraStyleHrefs = []) {
  const styleHrefs = unique([...chunks.map(cssHref), ...extraStyleHrefs]);
  const loaded = new Set(styleHrefs);
  return {
    styleHrefs,
    prefetchStyleHrefs: PUBLIC_STYLE_HREFS.filter((href) => !loaded.has(href)),
  };
}

function marketingStyleChunks(entry) {
  const chunks = ['main'];
  switch (entry.src) {
    case 'index.hbs':
      chunks.push('home', 'catalog');
      break;
    case 'product.hbs':
      chunks.push('product');
      break;
    case 'features.hbs':
      chunks.push('features');
      break;
    case 'lenses.hbs':
    case 'workflows.hbs':
    case 'metrics.hbs':
      chunks.push('catalog');
      break;
    case 'compare.hbs':
      chunks.push('compare');
      break;
    case 'pricing.hbs':
      chunks.push('pricing');
      break;
    case 'styleguide.hbs':
      chunks.push('home', 'features', 'catalog');
      break;
  }
  return chunks;
}

// Public URLs only — `internal` pages (e.g. the styleguide) are built but kept
// out of the sitemap and prefetch list.
function allUrls(site) {
  return [...site.marketing, ...(site.lenses || []), ...(site.languages || []), ...site.workflows, ...site.metrics, ...site.docs]
    .filter((e) => !e.internal)
    .map((e) => e.url);
}

// Resolve the beat <-> lens/metric relations declared on workflowBeats into both
// directions, so every cross-link renders from one source (the manifest):
//  - each beat gains resolved lensObjects/metricObjects (for the Features pills)
//  - each lens/metric gains a `beats` back-reference (for inverse "used in" links)
//  - site.beatsById lets hardcoded sections look a beat up by id
function enrichBeatRelations(site) {
  const lensBySlug = new Map((site.lenses || []).map((l) => [l.slug, l]));
  const metricBySlug = new Map((site.metrics || []).map((m) => [m.slug, m]));
  const beats = site.workflowBeats || [];
  site.beatsById = {};
  for (const b of beats) {
    b.lensObjects = (b.lenses || []).map((s) => lensBySlug.get(s)).filter(Boolean);
    b.metricObjects = (b.metrics || []).map((s) => metricBySlug.get(s)).filter(Boolean);
    site.beatsById[b.beat] = b;
  }
  const beatRef = (b) => ({ label: b.label, title: b.title, url: `/product/features#${b.anchor}` });
  for (const l of site.lenses || []) {
    l.beats = beats.filter((b) => (b.lenses || []).includes(l.slug)).map(beatRef);
  }
  for (const m of site.metrics || []) {
    m.beats = beats.filter((b) => (b.metrics || []).includes(m.slug)).map(beatRef);
  }
}

// Each workflow's markdown frontmatter declares `metrics: [slugs]`. Invert that into
// `metric.workflows` so a metric page can show "Which workflows it helps" — one source
// (the workflow frontmatter), both directions, no hand-authored metric->workflow lists.
function enrichMetricWorkflowRelations(site) {
  const metricToWorkflows = {};
  for (const w of site.workflows || []) {
    const mdPath = path.join(SRC, 'content', 'workflows', `${w.slug}.md`);
    if (!fs.existsSync(mdPath)) continue;
    const { data } = matter(fs.readFileSync(mdPath, 'utf8'));
    for (const ms of data.metrics || []) {
      (metricToWorkflows[ms] ||= []).push({ slug: w.slug, title: w.title, url: w.url });
    }
  }
  for (const m of site.metrics || []) {
    m.workflows = metricToWorkflows[m.slug] || [];
  }
}

// ---------------------------------------------------------------------------
// Handlebars setup — layouts + partials registered directly
// ---------------------------------------------------------------------------

function setupHandlebars(site) {
  const hb = Handlebars.create();

  hb.registerHelper('eq', (a, b) => a === b);
  hb.registerHelper('year', () => new Date().getFullYear());
  hb.registerHelper('activeClass', (target, current) => (target === current ? 'is-active' : ''));
  hb.registerHelper('sectionActiveClass', (target, current) => {
    if (target === current) return 'is-active';
    if (['/docs', '/lenses', '/metrics', '/workflows'].includes(target) && String(current).startsWith(`${target}/`)) {
      return 'is-active';
    }
    return '';
  });
  // Used by the nav parent link: fires if current URL matches the parent's own
  // href OR any item in its dropdown array (by exact match or prefix).
  hb.registerHelper('anySectionActive', (parentHref, items, current) => {
    if (current === parentHref || String(current).startsWith(`${parentHref}/`)) return 'is-active';
    if (!Array.isArray(items)) return '';
    return items.some((it) => it.href === current || String(current).startsWith(`${it.href}/`))
      ? 'is-active' : '';
  });
  hb.registerHelper('sectionOpen', (target, current) => {
    if (target === current || String(current).startsWith(`${target}/`)) return 'open';
    return '';
  });
  const labelFromSlug = (slug) =>
    String(slug)
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  hb.registerHelper('labelFromSlug', labelFromSlug);
  hb.registerHelper('workflowTitleFromSlug', (slug) => {
    const wf = (site.workflows || []).find((w) => w.slug === slug);
    return wf ? wf.title : labelFromSlug(slug);
  });
  hb.registerHelper('marketplaceHref', (placement, options) => {
    const baseHref = options?.data?.root?.nav?.cta?.href;
    if (!baseHref) return '';

    try {
      const url = new URL(String(baseHref), SITE_BASE);
      url.searchParams.set('utm_source', 'atlasarc_site');
      url.searchParams.set('utm_medium', 'referral');
      url.searchParams.set('utm_campaign', 'marketplace_cta');
      url.searchParams.set('utm_content', String(placement));
      return url.toString();
    } catch {
      return String(baseHref);
    }
  });
  hb.registerHelper('workflowsByBeat', (workflows, beat) => {
    if (!Array.isArray(workflows)) return [];
    return workflows.filter((w) => w.beat === beat);
  });
  hb.registerHelper('md', (str) => new hb.SafeString(marked.parse(str == null ? '' : String(str))));

  // Default empty slots so a page may omit any of them without a missing-partial error.
  hb.registerPartial('html-head-block', '');
  hb.registerPartial('body-block', '');
  hb.registerPartial('scripts-block', '');

  // Register every layout and partial by basename (e.g. marketing, head, nav-marketing,
  // workflow-page, metric-page). Single level of partial-block nesting: page -> layout.
  for (const dir of [path.join(SRC, 'layouts'), path.join(SRC, 'partials')]) {
    for (const file of walk(dir)) {
      if (file.endsWith('.hbs')) {
        hb.registerPartial(path.basename(file, '.hbs'), fs.readFileSync(file, 'utf8'));
      }
    }
  }
  return hb;
}

function baseContext(site, nav) {
  return { site, nav, prefetchUrls: allUrls(site) };
}

// ---------------------------------------------------------------------------
// Page renderers
// ---------------------------------------------------------------------------

function renderMarketing(hb, entry, base) {
  const tpl = hb.compile(fs.readFileSync(path.join(SRC, 'pages', entry.src), 'utf8'));
  const html = tpl({
    ...base,
    ...styleContext(marketingStyleChunks(entry)),
    page: entry,
    currentUrl: entry.url,
    chrome: 'marketing',
  });
  writeDist(entry.out, html);
}

function renderDoc(hb, entry, base) {
  const tpl = hb.compile(fs.readFileSync(path.join(SRC, 'docs', entry.src), 'utf8'));
  const html = tpl({
    ...base,
    ...styleContext(['docs'], ['/pagefind/pagefind-ui.css']),
    page: entry,
    currentUrl: entry.url,
    chrome: 'docs',
    breadcrumb: { label: 'Docs', url: '/docs' },
  });
  writeDist(entry.out, html);
}

function renderStructured(hb, entry, kind, base) {
  const mdPath = path.join(SRC, 'content', kind, `${entry.slug}.md`);
  const { data, content } = matter(fs.readFileSync(mdPath, 'utf8'));

  const isAlias = kind === 'metrics' && !!data.alias_of_slug;
  const component = kind === 'workflows' ? 'workflow-page'
    : kind === 'lenses' ? 'lens-page'
    : kind === 'languages' ? 'language-page'
    : isAlias ? 'metric-alias-page'
    : 'metric-page';

  const canonicalTag = isAlias
    ? `<link rel="canonical" href="${SITE_BASE}/metrics/${data.alias_of_slug}">\n`
    : '';

  // Wrap the structured component in the docs chrome (shared sidebar + Pagefind
  // search + breadcrumb) so all reference content is one cohesive system.
  // One level of nesting: page -> layout.
  const wrapper =
    '{{#> docs}}' +
    '{{#*inline "html-head-block"}}' +
    canonicalTag +
    '<title>{{seo_title}}</title>' +
    '<meta name="description" content="{{seo_description}}">' +
    '<meta property="og:title" content="{{seo_title}}">' +
    '<meta property="og:description" content="{{seo_description}}">' +
    '{{/inline}}' +
    `{{#*inline "body-block"}}{{> ${component}}}{{/inline}}` +
    '{{/docs}}';

  const tpl = hb.compile(wrapper);
  const html = tpl({
    ...base,
    ...styleContext(['docs'], ['/pagefind/pagefind-ui.css']),
    ...data,
    content,
    relatedBeats: entry.beats || null,
    relatedWorkflows: entry.workflows || null,
    page: { title: data.title, url: entry.url },
    currentUrl: entry.url,
    chrome: 'docs',
    breadcrumb: { label: 'Docs', url: '/docs' },
  });
  writeDist(path.join(kind, entry.slug, 'index.html'), html);
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

async function clean() {
  await fsp.rm(DIST, { recursive: true, force: true });
}

function html(cb) {
  const site = readSiteConfig();
  const nav = readJSON(path.join(MANIFEST, 'nav.json'));
  enrichBeatRelations(site);
  enrichMetricWorkflowRelations(site);
  const hb = setupHandlebars(site);
  const base = baseContext(site, nav);

  site.marketing.forEach((e) => renderMarketing(hb, e, base));
  site.lenses.forEach((e) => renderStructured(hb, e, 'lenses', base));
  (site.languages || []).forEach((e) => renderStructured(hb, e, 'languages', base));
  site.workflows.forEach((e) => renderStructured(hb, e, 'workflows', base));
  site.metrics.forEach((e) => renderStructured(hb, e, 'metrics', base));
  site.docs.forEach((e) => renderDoc(hb, e, base));
  cb();
}

function styles(cb) {
  // gulp-less emits 'error' per file; without an explicit handler a LESS
  // compile failure is swallowed and the task still exits 0 (green-but-broken).
  // Settle the task callback exactly once, failing on the first error.
  let settled = false;
  const done = (err) => {
    if (settled) return;
    settled = true;
    cb(err);
  };
  gulp
    .src([
      path.join(SRC, 'styles/main.less'),
      path.join(SRC, 'styles/home.less'),
      path.join(SRC, 'styles/product.less'),
      path.join(SRC, 'styles/features.less'),
      path.join(SRC, 'styles/catalog.less'),
      path.join(SRC, 'styles/compare.less'),
      path.join(SRC, 'styles/pricing.less'),
      path.join(SRC, 'styles/docs.less'),
      path.join(SRC, 'styles/styleguide.less'),
    ])
    .pipe(less())
    .on('error', done)
    .pipe(autoprefixer())
    .pipe(gulp.dest(path.join(DIST, 'assets')))
    .on('error', done)
    .on('end', () => done());
}

function scripts(cb) {
  // tsc both type-checks (strict gate) and emits native ESM modules.
  const result = spawnSync(process.execPath, [path.join(__dirname, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  if (result.status !== 0) return cb(new Error('tsc failed — type errors block the build.'));
  cb();
}

function assets() {
  return gulp
    .src(path.join(SRC, 'assets/**/*'), { encoding: false, allowEmpty: true })
    .pipe(gulp.dest(path.join(DIST, 'assets')));
}

function staticFiles() {
  return gulp
    .src(path.join(SRC, 'static/**/*'), { dot: true, allowEmpty: true })
    .pipe(gulp.dest(DIST));
}

function sitemap(cb) {
  const site = readSiteConfig();
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    allUrls(site)
      .map((u) => `  <url><loc>${SITE_BASE}${u}</loc></url>`)
      .join('\n') +
    '\n</urlset>\n';
  writeDist('sitemap.xml', xml);
  cb();
}

function searchIndex(cb) {
  // Pagefind crawls dist/ and writes dist/pagefind/. Non-fatal: scaffolding must
  // still produce dist/ even if the platform binary is unavailable offline.
  const result = spawnSync(process.execPath, [path.join(__dirname, 'node_modules/pagefind/lib/runner/bin.cjs'), '--site', 'dist'], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  if (result.status !== 0) {
    console.warn('[pagefind] index step skipped or failed (non-fatal in scaffolding).');
  }
  cb();
}

/** Warn (non-fatal) about any built HTML page not registered in the manifest. */
function checkManifest(cb) {
  const site = readSiteConfig();
  const workflowBeatKeys = new Set((site.workflowBeats || []).map((e) => e.beat));
  const invalidWorkflowBeats = (site.workflows || []).filter((e) => !workflowBeatKeys.has(e.beat));
  if (invalidWorkflowBeats.length) {
    cb(new Error(`[manifest] workflows missing valid beat: ${invalidWorkflowBeats.map((e) => e.slug).join(', ')}`));
    return;
  }
  // Beat -> lens/metric relations must reference real entries (catches typos).
  const lensSlugs = new Set((site.lenses || []).map((e) => e.slug));
  const metricSlugs = new Set((site.metrics || []).map((e) => e.slug));
  const badRelations = [];
  for (const b of site.workflowBeats || []) {
    for (const s of b.lenses || []) if (!lensSlugs.has(s)) badRelations.push(`beat "${b.beat}" -> unknown lens "${s}"`);
    for (const s of b.metrics || []) if (!metricSlugs.has(s)) badRelations.push(`beat "${b.beat}" -> unknown metric "${s}"`);
  }
  if (badRelations.length) {
    cb(new Error(`[manifest] beat relations reference unknown slugs:\n  ${badRelations.join('\n  ')}`));
    return;
  }
  // Workflow -> metric relations (declared in workflow frontmatter) must reference real metrics.
  const badWorkflowMetrics = [];
  for (const w of site.workflows || []) {
    const mdPath = path.join(SRC, 'content', 'workflows', `${w.slug}.md`);
    if (!fs.existsSync(mdPath)) continue;
    const { data } = matter(fs.readFileSync(mdPath, 'utf8'));
    for (const ms of data.metrics || []) {
      if (!metricSlugs.has(ms)) badWorkflowMetrics.push(`workflow "${w.slug}" -> unknown metric "${ms}"`);
    }
  }
  if (badWorkflowMetrics.length) {
    cb(new Error(`[manifest] workflow metric relations reference unknown slugs:\n  ${badWorkflowMetrics.join('\n  ')}`));
    return;
  }
  const known = new Set(
    [...site.marketing.map((e) => e.out)]
      .concat((site.lenses || []).map((e) => `lenses/${e.slug}/index.html`))
      .concat((site.languages || []).map((e) => `languages/${e.slug}/index.html`))
      .concat(site.workflows.map((e) => path.join(e.slug, 'index.html').replace(/\\/g, '/')).map((p) => `workflows/${p}`))
      .concat(site.metrics.map((e) => `metrics/${e.slug}/index.html`))
      .concat(site.docs.map((e) => e.out))
      .map((p) => p.replace(/\\/g, '/')),
  );
  for (const file of walk(DIST)) {
    if (!file.endsWith('.html')) continue;
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    if (rel.startsWith('pagefind/')) continue;
    if (rel.startsWith('_reports/')) continue;
    if (!known.has(rel)) console.warn(`[manifest] built page not in manifest: ${rel}`);
  }
  cb();
}

function expectedPublicHtmlPaths(site) {
  return new Set(
    [...site.marketing.filter((e) => !e.internal).map((e) => e.out)]
      .concat((site.lenses || []).filter((e) => !e.internal).map((e) => `lenses/${e.slug}/index.html`))
      .concat((site.languages || []).filter((e) => !e.internal).map((e) => `languages/${e.slug}/index.html`))
      .concat((site.workflows || []).filter((e) => !e.internal).map((e) => `workflows/${e.slug}/index.html`))
      .concat((site.metrics || []).filter((e) => !e.internal).map((e) => `metrics/${e.slug}/index.html`))
      .concat((site.docs || []).filter((e) => !e.internal).map((e) => e.out))
      .map((p) => p.replace(/\\/g, '/')),
  );
}

function assertAnalyticsScriptState(site, publicPaths, failures) {
  const analyticsEnabled = !!site.analytics?.domain;
  const expectedPlausibleSrc = site.analytics?.provider === 'plausible' ? plausibleScriptSrc(site.analytics) : '';
  const plausibleScriptRe = /https:\/\/plausible\.io\/js\/(?:script|pa-[A-Za-z0-9_-]+)\.js/;

  for (const file of walk(DIST)) {
    if (!file.endsWith('.html')) continue;
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    if (rel.startsWith('pagefind/') || rel.startsWith('_reports/')) continue;

    const html = fs.readFileSync(file, 'utf8');
    const hasPlausible = plausibleScriptRe.test(html);
    const hasExpectedPlausible = expectedPlausibleSrc && html.includes(expectedPlausibleSrc);
    const isPublic = publicPaths.has(rel);

    if (isPublic && analyticsEnabled && !hasExpectedPlausible) {
      failures.push(`missing Plausible script on public page: ${rel}`);
    } else if (isPublic && analyticsEnabled && !html.includes('plausible.init()')) {
      failures.push(`missing Plausible init on public page: ${rel}`);
    } else if (hasPlausible && (!analyticsEnabled || !isPublic)) {
      failures.push(`unexpected Plausible script on ${isPublic ? 'quiet-build public page' : 'non-public page'}: ${rel}`);
    }
  }
}

function assertMarketplaceLinksAreTagged(publicPaths, failures) {
  const anchorRe = /<a\b[^>]*\bhref=(["'])(.*?)\1[^>]*>/gi;
  const requiredUtm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

  for (const rel of publicPaths) {
    const file = path.join(DIST, rel);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = anchorRe.exec(html))) {
      const tag = match[0];
      const href = match[2];
      if (!href.includes('plugins.jetbrains.com')) continue;

      const missingUtm = requiredUtm.filter((param) => !href.includes(param));
      if (missingUtm.length) {
        failures.push(`Marketplace link missing UTM (${missingUtm.join(', ')}): ${rel}`);
      }
      if (!/\bdata-analytics-cta=/.test(tag)) {
        failures.push(`Marketplace link missing data-analytics-cta: ${rel}`);
      }
      if (!/\bdata-analytics-destination=(["'])jetbrains_marketplace\1/.test(tag)) {
        failures.push(`Marketplace link missing data-analytics-destination: ${rel}`);
      }
    }
  }
}

function checkAnalytics(cb) {
  const site = readSiteConfig();
  const publicPaths = expectedPublicHtmlPaths(site);
  const failures = [];

  assertAnalyticsScriptState(site, publicPaths, failures);
  assertMarketplaceLinksAreTagged(publicPaths, failures);

  if (failures.length) {
    cb(new Error(`[analytics] validation failed:\n  ${failures.join('\n  ')}`));
    return;
  }
  cb();
}

function checkStyleHints(cb) {
  const failures = [];
  const stylesheetRe = /<link\b[^>]*\brel=(["'])stylesheet\1[^>]*\bhref=(["'])(.*?)\2[^>]*>/gi;
  const prefetchStyleRe = /<link\b[^>]*\brel=(["'])prefetch\1[^>]*\bhref=(["'])(.*?)\2[^>]*\bas=(["'])style\4[^>]*>/gi;

  for (const file of walk(DIST)) {
    if (!file.endsWith('.html')) continue;
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    if (rel.startsWith('pagefind/') || rel.startsWith('_reports/')) continue;

    const html = fs.readFileSync(file, 'utf8');
    const loaded = [...html.matchAll(stylesheetRe)].map((m) => m[3]).filter((href) => href.endsWith('.css'));
    const prefetched = [...html.matchAll(prefetchStyleRe)].map((m) => m[3]);
    const available = new Set([...loaded, ...prefetched]);

    for (const href of PUBLIC_STYLE_HREFS) {
      if (!available.has(href)) failures.push(`missing CSS stylesheet/prefetch in ${rel}: ${href}`);
    }
    for (const href of loaded) {
      if (prefetched.includes(href)) failures.push(`CSS is both stylesheet and prefetch in ${rel}: ${href}`);
    }
    for (const href of available) {
      if (!href.startsWith('/')) continue;
      if (!fs.existsSync(path.join(DIST, href.replace(/^\//, '')))) {
        failures.push(`referenced CSS file does not exist for ${rel}: ${href}`);
      }
    }
  }

  if (failures.length) {
    cb(new Error(`[styles] validation failed:\n  ${failures.join('\n  ')}`));
    return;
  }
  cb();
}

// ---------------------------------------------------------------------------
// Dev server + watch
// ---------------------------------------------------------------------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

function serve(cb) {
  const basePort = Number(process.env.PORT) || 4173;
  const devHost = process.env.ATLASARC_DEV_HOST || '127.0.0.1';
  const maxAttempts = 10;

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let fp = path.join(DIST, urlPath);
    try {
      if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html');
      else if (!fs.existsSync(fp)) {
        if (fs.existsSync(`${fp}.html`)) fp = `${fp}.html`;
        else if (fs.existsSync(path.join(DIST, urlPath, 'index.html')))
          fp = path.join(DIST, urlPath, 'index.html');
      }
      const data = fs.readFileSync(fp);
      res.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end('<h1>404</h1>');
    }
  });

  // Without this handler, EADDRINUSE surfaces as an unhandled 'error' event and
  // crashes the whole dev process. Instead, walk forward to the next free port.
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && server.__port - basePort < maxAttempts - 1) {
      const next = server.__port + 1;
      console.warn(`[serve] port ${server.__port} in use, trying ${next}...`);
      server.__port = next;
      server.listen(next, devHost);
      return;
    }
    console.error(`[serve] could not start dev server: ${err.message}`);
  });

  server.on('listening', () => console.log(`AtlasArc dev -> http://${devHost}:${server.__port}`));

  server.__port = basePort;
  server.listen(basePort, devHost);
  cb();
}

function watch(cb) {
  gulp.watch(
    [path.join(SRC, '**/*.hbs'), path.join(SRC, 'content/**/*.md'), path.join(MANIFEST, '**/*.json')],
    gulp.series(html, sitemap, checkAnalytics, checkStyleHints),
  );
  gulp.watch(path.join(SRC, 'styles/**/*.less'), styles);
  gulp.watch(path.join(SRC, 'scripts/**/*.ts'), scripts);
  gulp.watch(path.join(SRC, 'assets/**/*'), assets);
  gulp.watch(path.join(SRC, 'static/**/*'), staticFiles);
  cb();
}

// ---------------------------------------------------------------------------
// Composed pipelines
// ---------------------------------------------------------------------------

const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, assets, staticFiles),
  sitemap,
  searchIndex,
  checkManifest,
  checkAnalytics,
  checkStyleHints,
);

const dev = gulp.series(build, gulp.parallel(serve, watch));

export { clean, html, styles, scripts, assets, staticFiles, sitemap, searchIndex, checkManifest, checkAnalytics, checkStyleHints, serve, watch, build, dev };
export default build;
