# AtlasArc Website

Static marketing + docs site for AtlasArc. Built with Gulp + Handlebars + LESS +
TypeScript. No framework, no bundler, no server at runtime.

This public repository contains publishable website source only. In the Seamra
Works workspace, private website architecture notes, content plans, and launch
planning live in the parent governance repo under `../docs/website/`. Standalone
styleguide experiments live under `../design/styleguide-variants/`.

## Commands

```bash
npm install      # install dev dependencies
npm run build    # clean + compile everything into dist/
npm run dev      # build, then watch + serve at http://localhost:3000
npm run clean    # remove dist/
npm run check    # tsc type-check only (no emit)
npm run copy-style        # deterministic website copy style audit
npm run copy-style:openai # manual OpenAI-only copy review
```

### Analytics builds

Local builds are quiet by default: `npm run build` does not emit the Plausible
script unless analytics is explicitly enabled for that build.

Production build options:

```bash
ATLASARC_ANALYTICS=1 npm run build
ATLASARC_ANALYTICS_DOMAIN=atlasarc.io npm run build
ATLASARC_ANALYTICS=0 npm run build # force analytics off
```

`ATLASARC_ANALYTICS=1` uses the provider/domain declared in
`manifest/site.json`. `ATLASARC_ANALYTICS_DOMAIN` or `PLAUSIBLE_DOMAIN` can
override the domain for a deployment target. The build fails if a public
Marketplace link bypasses UTM tagging or the `data-analytics-*` CTA attributes.

## How it fits together

| Source | Becomes | Driven by |
|--------|---------|-----------|
| `src/pages/*.hbs` | Marketing pages (`marketing` chrome) | `manifest/site.json` › `marketing` |
| `src/content/workflows/*.md` | Workflow pages | `manifest/site.json` › `workflows` |
| `src/content/metrics/*.md` | Metric pages | `manifest/site.json` › `metrics` |
| `src/docs/*.hbs` | Docs pages (`docs` chrome) | `manifest/site.json` › `docs` |
| `src/styles/*.less` | Shared and route-sized CSS chunks in `dist/assets/*.css` | `gulpfile.mjs` style chunk mapping |
| `src/scripts/*.ts` | `dist/assets/scripts/*.js` (ESM) | `tsconfig.json` |

`manifest/site.json` and `manifest/nav.json` are the single source of truth.
Navigation, prefetch links, and `sitemap.xml` are all derived from them — adding a
page is a manifest edit plus a source file, never a hand-edited nav or sitemap.

CSS is split into shared chrome chunks plus a few route-sized chunks. The renderer
loads only the chunks needed by the current route and emits `rel="prefetch"
as="style"` hints for the other public CSS files, so small next-page styles can
warm in the background.

### Copy style audit

`npm run build` runs `copyStyle` before compiling the site. The deterministic pass
uses `copy-style-rules.json` to flag copy that needs review: possible AI-style tells,
generic SaaS phrasing, abstract benefit words, and em-dash density in `manifest/`
and website source copy. These are review signals, not automatic violations. It writes
the current finding set to `copy-style-findings.json`.

During the Gulp build, findings are not printed line-by-line. The JSON report is
rendered into a separate table at `dist/_reports/copy-style/index.html`, with the
same data copied to `dist/_reports/copy-style/report.json` for follow-up tooling.

That JSON is kept in sync with the content and should be committed. On every build, findings that no longer
occur in source copy are purged from the file. Current findings keep their previous
triage only when it is exactly `"ACCEPTED"`; all new or unaccepted findings are written
as `"UNKNOWN"` and fail the build. To accept a finding, set its `triage` field to
`"ACCEPTED"` in `copy-style-findings.json`. To remove a finding, fix the copy; the next
build removes that JSON row automatically.

Do not fix a failure by mechanically replacing a flagged word with a synonym, and do
not rewrite copy solely to remove a review word. A flagged word is not a defect by
itself. Accept the finding when the sentence is concrete, accurate, product-specific,
literal, and intentional. Words such as `quality` are normal in code-metric contexts;
`comprehensive` is acceptable when it literally describes breadth, such as a broad
library or documentation set.
If it is weak, fix the substance: name the AtlasArc feature, metric, workflow, or
consequence that makes the sentence true, or delete the sentence if it adds no
information. Em-dash findings are punctuation/style findings; changing punctuation
without fixing generic contrast-rhythm is not enough.

The OpenAI reviewer should follow the private voice contract in the parent
governance repo when that repo is available. In a standalone public clone, use
`copy-style-rules.json` and the existing source copy as the local fallback.

The OpenAI reviewer is a separate manual track. It does not run during
`npm run build`, it does not share `copy-style-findings.json`, and it does not
sync or purge findings against earlier runs. Each invocation writes a standalone
snapshot to `copy-style-openai-findings.json` and renders
`dist/_reports/copy-style-openai/index.html`.

Run it explicitly with:

```bash
OPENAI_API_KEY=... npm run copy-style:openai
```

By default it uses the low-cost model configured in `copy-style-rules.json`. Override
it with `COPY_STYLE_OPENAI_MODEL`.

### Adding a metric or workflow page

1. Create `src/content/{metrics,workflows}/<slug>.md` with the full front-matter
   schema (see existing files — every named section is a field).
2. Add an entry to `manifest/site.json`.

The structured-content templates (`src/partials/components/{metric,workflow}-page.hbs`)
control section order; the data file controls content. Section content lives in the
front-matter fields (rendered through `marked`); the Markdown body is unused.

### Adding a docs page

1. Create `src/docs/<slug>.hbs` decorating `{{#> docs}}`.
2. Add an entry to `manifest/site.json` › `docs` (drives the sidebar too).

## House style

The visual identity is **"engineered cartography"** — warm drafting vellum, ink
structure, a faint 24px grid, monospace technical annotations, drafting crop-ticks,
and one signal **arc** accent. Type: Fraunces (display) · Hanken Grotesk (body) ·
JetBrains Mono (technical).

- **Tokens / source of truth:** `src/styles/tokens.less` (retune the whole site here).
- **Living reference + sandbox:** **`/styleguide`** — every component, the palette,
  type, spacing, and a live sandbox that retints accent/radius/grid in real time.
  It's an `internal` manifest page: built into `dist/`, but excluded from the public
  sitemap and prefetch, and marked `noindex`.

## Build Notes

- **`_base.hbs` consolidated into `head.hbs` + `footer.hbs`.** The SAD diagram shows
  a three-level decorator (`page → marketing/docs → _base`). Handlebars inline-partial
  propagation across two `{{#>}}` levels is unreliable and untested for the new
  two-chrome split. `marketing.hbs` and
  `docs.hbs` are each complete single-level wrappers that share the `head` and `footer`
  partials. One proven level of nesting (`page → layout`); no risk of a dropped block.
- **`gulp-handlebars` not used.** It precompiles templates to JS modules for the
  browser; it does not render HTML. The `handlebars` library is used directly in
  `gulpfile.mjs` (layouts and partials registered via `registerPartial`).
- **Pagefind index is non-fatal.** If the platform binary is unavailable, the build
  warns and still produces `dist/`. Search simply won't be present until Pagefind runs.
