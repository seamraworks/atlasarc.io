---
title: Complex code with weak coverage
slug: complex-code-weak-coverage
seo_title: Find Complex Code Without Enough Test Coverage | AtlasArc Workflow
seo_description: Use AtlasArc Hotspots and coverage data to find large, complex packages whose branch paths are not protected by tests.
problem: |
  A complex package can look manageable in isolation, and a coverage report can look acceptable in aggregate. The risk appears when those two facts overlap: code with many decision paths, weak branch coverage, and enough size that changing it is not a local edit. That is where refactoring starts to feel unsafe.
why_it_matters: |
  Cyclomatic complexity is a proxy for how many independent paths the code can take. Branch coverage shows whether tests exercise those decisions. A package with high CC max and low branch coverage is complex in a specific way: the test suite is not protecting its decision paths. Those packages need characterization tests before cleanup, splitting, or behavior changes. Galaxy is useful when you need to see whether several weak spots form a larger connected cluster.
lens: Hotspots with the CC vs Coverage preset
steps:
  - heading: Make coverage and complexity available.
    body: For Java or Kotlin, build the project and load a JaCoCo XML report. For TypeScript, generate the dependency graph with compatible ESLint/SonarJS SARIF complexity data, analyze that source, then load LCOV with branch records. AtlasArc keeps missing evidence unavailable rather than treating it as zero.
  - heading: Open Hotspots and select CC vs Coverage.
    body: Switch to Hotspots. Choose the CC vs Coverage preset. The X axis is CC max, the Y axis is branch coverage, bubble size is lines of code, and colour is CC max.
  - heading: Find high-complexity, low-coverage packages.
    body: Look for large bubbles with high CC max and weak branch coverage. These are packages where untested decision paths are concentrated in code that is large enough to deserve deliberate test investment.
  - heading: Use Galaxy only when the map is too crowded.
    body: If the flat map produces too many similar candidates, switch to Galaxy Maintenance abyss. Depth lets well-covered packages recede, while routes show whether weakly-covered complex packages are structurally close to each other.
  - heading: Prioritize by size and architectural importance.
    body: Use bubble size to avoid spending the first pass on tiny packages. If two packages have similar complexity and coverage, start with the larger one or the one that is also important in the graph workflows.
  - heading: Add characterization tests before refactoring.
    body: Open the package or class details, inspect the worst CC max contributors, and add tests around current behavior before simplifying the complex code.
interpretation: |
  The riskiest bubbles are not simply the most complex or the least covered. They are the packages where high cyclomatic complexity and weak branch coverage coincide. High CC with strong branch coverage may still be hard to read, but the safety net is better. Low coverage on simple leaf code is less urgent. High CC, weak branch coverage, and large size is the combination that should move to the top of the testing backlog. Galaxy can add context when several of those bubbles are difficult to separate visually.
export_note: |
  Export the Hotspots view as PNG after selecting CC vs Coverage. The image gives the team a clear testing target list for refactoring planning: large, complex packages with low branch coverage. Export Galaxy only when the route context helps explain a connected testing liability.
metrics:
  - cyclomatic-complexity
  - line-branch-coverage
  - lines-of-code
related_metrics:
  - cyclomatic-complexity
  - line-branch-coverage
  - lines-of-code
related_docs:
  - lenses
related_workflows:
  - complexity-hotspots
  - manual-coverage-heatmap-review
  - hard-to-change-packages
---

Body content is not used for structured pages - section content lives in the
front-matter fields above and is rendered through the workflow-page template.
