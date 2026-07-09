---
title: TypeScript
slug: typescript
category: Supported language
summary: Analyze TypeScript projects by generating a dependency graph and optional complexity file with your own toolchain, then load coverage manually when you need it.
seo_title: TypeScript Language Support | AtlasArc Documentation
seo_description: How to analyze TypeScript projects in AtlasArc with a generated dependency graph, optional ESLint/SonarJS SARIF complexity data, and manually loaded LCOV coverage.
wideContent: true
toc:
  - label: What AtlasArc understands
    href: "#what-atlasarc-understands"
  - label: Construct support
    href: "#construct-support"
  - label: Known boundaries
    href: "#known-boundaries"
  - label: Set up your project
    items:
      - label: Files to generate
        href: "#files-to-generate"
      - label: Generate the graph
        href: "#generate-the-graph"
      - label: Add complexity metrics
        href: "#add-complexity-metrics"
      - label: Workspaces
        href: "#workspaces"
      - label: Load coverage
        href: "#load-coverage"
      - label: Check before loading
        href: "#check-before-loading"
---

AtlasArc can analyze TypeScript projects when your project exports the structure that AtlasArc needs
to read. Your repository keeps control of the Node version, package manager, TypeScript compiler,
framework plugins, and test runner. AtlasArc does not install packages or run `npm` for you.

The usual flow is:

```text
dependency graph JSON
+ optional ESLint/SonarJS SARIF
-> AtlasArc
-> source-folder graph, metrics, reports, and exports

LCOV coverage
-> selected manually in AtlasArc after the graph is loaded
```

<h2 id="what-atlasarc-understands">What AtlasArc understands</h2>

AtlasArc understands TypeScript as a graph of source files and folders. It reads the files your
project imports, re-exports, loads dynamically, or references as types, then rolls those file-level
relationships up into source-folder architecture units.

Available for TypeScript:

- source-folder dependency graph;
- per-folder file internals in the [Topology Graph](/lenses/topology-graph): open a source folder to inspect its files and any import tangles inside it;
- fan-in, fan-out, instability, and cycle detection;
- source-file count and lines of code;
- cyclomatic and cognitive complexity when an ESLint/SonarJS SARIF file is available;
- line coverage after you manually load an LCOV file;
- branch coverage after you manually load an LCOV file that contains branch records.

Not available for TypeScript:

- JVM abstractness and distance from the main sequence;
- relative visibility, ARV, and GRV;
- class/member-level dependency examples;
- source write-back for accepted dependencies.

Missing optional data is shown as unavailable, not as zero. For example, if you load LCOV with line
coverage but no branch records, line coverage can be shown while branch coverage stays unavailable.

<span id="dependencies-not-constructs"></span>
<span id="mapped-code-relationships"></span>
<h2 id="construct-support">Construct support</h2>

For TypeScript, the practical question is the same as for Java and Kotlin: which constructs AtlasArc
recognizes as architecture dependencies. AtlasArc reads the generated graph your project produces,
then rolls recognized project-internal imports, re-exports, dynamic loads, and type references up
into source-folder architecture units.

The generated graph usually comes from the open source
[sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser) project. That matters
for setup, but the table below is about your code: which syntax is recognized and what boundary to
expect.

| TypeScript construct | Recognition | Notes |
|----------------------|-------------|-------|
| Static imports | Recognized | Creates a source-folder dependency edge. |
| Re-exports and barrel files | Recognized | The barrel depends on the file it re-exports. |
| Dynamic imports | Recognized | Includes lazy route/component imports written as static-string `import()`. |
| Type-only imports and exports | Recognized | Included by default because they are still source-level coupling, even when erased from runtime JavaScript. |
| CommonJS `require` | Recognized | Included when it resolves to project source. |
| AMD `define` / `require` | Recognized when configured | Useful for older JavaScript/TypeScript codebases; included when the generated graph resolves it to project source. |
| Exotic require wrappers | Recognized when configured | Included only when your graph generation is configured to recognize that wrapper and resolves the target to project source. |
| TypeScript `import = require` | Recognized | Included when it resolves to project source. |
| Triple-slash references | Recognized when resolved | Included only when they point to project source files. |
| JSDoc import references | Recognized when configured | Requires project configuration that tells dependency-cruiser to detect JSDoc imports. |
| Pre-compilation-only imports | Recognized | Included as source-level coupling, but kept distinct from runtime imports. |
| Aliases and path mapping | Recognized when configured | Covers `tsconfig.paths`, `baseUrl`, package subpath imports, webpack aliases, and workspace aliases when the generated graph resolves them to project source. |
| Workspace package imports | Recognized when resolved to source | Include them when the generated graph points at local source files rather than package names alone. |
| TSX/JSX component imports | Recognized | Normal imports are captured; JSX rendering semantics are not interpreted. |
| External npm packages and Node built-ins | Out of scope | They are environment dependencies, not project source folders in the architecture graph. |
| Unresolved imports | Not supported | Fix the project configuration or source selection before loading the graph. |

Some TypeScript constructs matter to a reader, but AtlasArc recognizes them only as the imports or
references they express:

| Construct | What AtlasArc can say |
|-----------|----------------------|
| `extends` and `implements` | The imported base or interface file is a dependency. |
| Generic constraints and type aliases | The imported type source is a dependency. |
| Decorators | The decorator module is a dependency. |
| Function and constructor calls | The imported module is a dependency; member-level call evidence is not available. |
| Angular, React, NestJS, or similar framework imports | Imported source files are dependencies; framework runtime behavior is not inferred. |

<h2 id="known-boundaries">Known boundaries</h2>

AtlasArc does not infer TypeScript dependencies from:

- Angular templates, Vue/Svelte component internals, or framework metadata that does not appear as a
  resolved source-file dependency;
- dependency injection container wiring, route strings, REST URLs, GraphQL endpoint strings, or
  plugin registry keys;
- generated clients, declaration files, mocks, stories, fixtures, or test sources unless your
  dependency graph intentionally includes them;
- external npm packages and Node built-ins as source folders;
- unresolved imports.

In a mixed Java/Kotlin and TypeScript repository, analyze server-side JVM code and TypeScript
frontends as separate sources. Java and Kotlin can share one JVM graph when they compile together.
TypeScript projects load from their generated files. Cross-language API contracts such as REST
routes, GraphQL schemas, and generated clients are architectural agreements, but they are not
ordinary Java method calls or TypeScript imports.

<h2 id="files-to-generate">Files to generate</h2>

Create these files under the TypeScript project root you want to analyze:

| File | Required | What it adds |
|------|----------|--------------|
| `.atlasarc/depgraph.json` | Yes | Source-file dependencies from dependency-cruiser. |
| `.atlasarc/eslint.sarif` | No | Cyclomatic complexity and cognitive complexity, when exported by ESLint and SonarJS. |

The dependency graph is required. SARIF enriches the graph with complexity metrics, but the project
can still load without it.

Coverage is different. Do not place an LCOV file in `.atlasarc` expecting AtlasArc to find it. Run
your tests normally, let your coverage tool produce LCOV wherever it normally does, then choose that
file from the AtlasArc coverage action after the TypeScript graph is loaded.

<div class="language-tip">
  <p class="language-tip-label">In AtlasArc</p>
  <ol>
    <li>Generate `.atlasarc/depgraph.json` with your project toolchain.</li>
    <li>Rescan sources so AtlasArc sees the updated graph file.</li>
    <li>Select the TypeScript source from the analysis source picker.</li>
    <li>Load LCOV coverage manually when you want coverage overlays.</li>
  </ol>
</div>

<h2 id="generate-the-graph">Generate the graph</h2>

Install dependency-cruiser in the TypeScript project and pin it with the rest of your dev
dependencies:

```sh
npm install --save-dev dependency-cruiser
```

With pnpm:

```sh
pnpm add --save-dev dependency-cruiser
```

Create a dependency-cruiser config at the project root:

```js
// .dependency-cruiser.cjs
module.exports = {
  // AtlasArc reads the module graph and runs its own cycle detection, so no `forbidden`
  // rules are needed here. Keep your team's own dependency-cruiser rules in a separate config.
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
    exclude: { path: ['\\.spec\\.tsx?$', '\\.test\\.tsx?$', '/dist/', '/coverage/', '/node_modules/'] },
    doNotFollow: { path: 'node_modules' },
    combinedDependencies: true,
  },
};
```

Add scripts that write AtlasArc's default graph path:

```json
{
  "scripts": {
    "atlasarc:prepare": "node -e \"require('fs').mkdirSync('.atlasarc', { recursive: true })\"",
    "atlasarc:deps": "depcruise \"src\" --include-only \"^src\" --output-type json > .atlasarc/depgraph.json"
  }
}
```

Run the graph script before loading or rescanning the TypeScript project in AtlasArc:

```sh
npm run atlasarc:prepare
npm run atlasarc:deps
```

<h2 id="add-complexity-metrics">Add complexity metrics</h2>

If you want cyclomatic and cognitive complexity, add ESLint, SonarJS, and the SARIF formatter:

```sh
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-sonarjs @microsoft/eslint-formatter-sarif
```

With pnpm:

```sh
pnpm add --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-sonarjs @microsoft/eslint-formatter-sarif
```

Use a dedicated ESLint config so your normal lint thresholds do not change:

```js
// eslint-atlasarc.config.mjs
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.atlasarc/**', '**/*.spec.*', '**/*.test.*'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin, sonarjs },
    rules: {
      // Threshold 0 makes ESLint emit a finding for *every* function, so the SARIF carries a
      // score for each one. AtlasArc reads those scores; it does not treat them as violations.
      complexity: ['warn', 0],
      'sonarjs/cognitive-complexity': ['warn', 0],
    },
  },
];
```

Then add the SARIF export:

```json
{
  "scripts": {
    "atlasarc:sarif": "eslint \"src/**/*.{ts,tsx}\" --config eslint-atlasarc.config.mjs --format @microsoft/eslint-formatter-sarif --output-file .atlasarc/eslint.sarif"
  }
}
```

Run it before rescanning when you want updated complexity metrics:

```sh
npm run atlasarc:sarif
```

<h2 id="workspaces">Workspaces</h2>

For npm, pnpm, Angular, or Nx workspaces, choose the source root you want AtlasArc to analyze and
generate one dependency graph for that root. Avoid one accidental all-repository graph unless the
whole repository is genuinely the architecture unit you want to inspect.

Examples:

| Project shape | Dependency-cruiser input |
|---------------|--------------------------|
| Single app | `src` |
| npm/pnpm workspace app | `apps/web/src` |
| Angular CLI project | `projects/admin/src` |
| Nx app | `apps/web/src` |
| Nx library | `libs/design-system/src` |

Give each analyzed root its own `.atlasarc/` directory. AtlasArc infers the project root from where
`.atlasarc/depgraph.json` lives, so the graph for `apps/web` must sit at
`apps/web/.atlasarc/depgraph.json` — not in a shared folder at the repo root. Example root-level
scripts:

```json
{
  "scripts": {
    "atlasarc:web:prepare": "node -e \"require('fs').mkdirSync('apps/web/.atlasarc', { recursive: true })\"",
    "atlasarc:web:deps": "depcruise \"apps/web/src\" --include-only \"^apps/web/src\" --output-type json > apps/web/.atlasarc/depgraph.json",
    "atlasarc:web:sarif": "eslint \"apps/web/src/**/*.{ts,tsx}\" --config eslint-atlasarc.config.mjs --format @microsoft/eslint-formatter-sarif --output-file apps/web/.atlasarc/eslint.sarif"
  }
}
```

For Angular or Nx, use the project `sourceRoot` as the dependency-cruiser input unless your team has
a better source boundary.

<h2 id="load-coverage">Load coverage</h2>

TypeScript coverage uses LCOV. It is not tied to Babel; Vitest, Jest, nyc, c8, Playwright, Angular,
and other tools can write LCOV.

Generate coverage with your normal test command. For example:

```sh
vitest run --coverage --coverage.reporter=lcov
```

After the TypeScript graph is loaded in AtlasArc, use the coverage action and select the generated
`lcov.info` or `.lcov` file. AtlasArc does not auto-detect LCOV files and does not reload them on
rescan; coverage is a manually loaded, session-scoped overlay, the same way JaCoCo coverage works for
JVM projects.

The important part is path alignment. `SF:` entries in `lcov.info` should point at the same original
TypeScript files that appear in `depgraph.json`. If coverage points at compiled JavaScript, generated
files, or paths outside the selected source root, AtlasArc cannot attach coverage to the right source
folders reliably.

<h2 id="check-before-loading">Check before loading</h2>

Before loading or rescanning the TypeScript project, check:

- `.atlasarc/depgraph.json` exists and contains a top-level `modules` array;
- `modules[].source` paths point at original TypeScript files, not generated JavaScript;
- imports through aliases are resolved the way your team expects;
- optional SARIF paths match the same source files as dependency-cruiser;
- monorepo apps and libraries are split into the analysis roots your team actually wants to review.

Before loading coverage, check:

- the LCOV file exists where your coverage tool wrote it;
- `SF:` paths point at original `.ts` or `.tsx` files;
- the LCOV paths match the TypeScript graph that is currently loaded in AtlasArc;
- branch records exist if you expect Branch Coverage to be available.

Missing SARIF does not block analysis. Missing LCOV does not affect source readiness. Missing or
invalid dependency graph JSON does.
