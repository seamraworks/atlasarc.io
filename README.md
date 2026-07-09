# AtlasArc Website

Static marketing + docs site for AtlasArc. Built with Gulp + Handlebars + LESS +
TypeScript. No framework, no bundler, no server at runtime.

This public repository contains publishable website source. When this checkout
sits inside a larger Seamra Works workspace, supporting planning material may
live outside this repository; review the workspace-level notes before broad
content or structure changes.

## Commands

```bash
npm install      # install dev dependencies
npm run build    # clean + compile everything into dist/
npm run dev      # build, then watch + serve at http://localhost:3000
npm run clean    # remove dist/
npm run check    # tsc type-check only (no emit)
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

### Publication review

The website build compiles source and validates manifest, analytics, and style
hints. When this checkout sits inside a larger workspace, run any
workspace-level publication checks before committing copy changes.

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
