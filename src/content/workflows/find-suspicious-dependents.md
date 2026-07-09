---
title: Find suspicious dependents
slug: find-suspicious-dependents
seo_title: Find Suspicious Package Dependents in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to spot packages that are importing things they have no business touching, such as the wrong layer, wrong module, or wrong abstraction level.
problem: |
  You are tracing a bug and you notice it: a service class is importing a repository helper. Or a UI component is referencing a domain entity directly. The compiler does not complain. The tests still pass. But something is wrong: a package in one layer is reaching into a layer it should not know about. You want to see how widespread this is before you decide how alarmed to be.
why_it_matters: |
  Cross-layer dependencies are how architectural rules collapse. One convenient import becomes a pattern. The pattern becomes an expectation. A year later, the "service layer" is directly importing six infrastructure packages and the architectural boundary exists only in the original design document. Finding suspicious callers when there are still just a handful of them is much cheaper than finding them after the pattern has spread.
lens: the Package Matrix
steps:
  - heading: Open the Package Matrix.
    body: Switch to the Package Matrix. Each cell represents a dependency from the row package to the column package. The number inside the cell is the reference count.
  - heading: Select the package you are investigating.
    body: Find the target package, the one being imported in suspicious places. Its column shows all packages that depend on it. Scan down that column for cells that represent callers from unexpected layers.
  - heading: Click into any suspicious cell.
    body: Click a cell to see the specific dependency edges it represents. The panel shows which classes in the caller package are importing which classes in the target package, and how many references each one makes.
  - heading: Assess the pattern.
    body: Check whether the suspicious callers are concentrated in one package or spread across many. A single package with a high reference count is usually one developer's shortcut. Multiple callers with low reference counts usually means a pattern has already spread team-wide.
interpretation: |
  One cross-layer dependency is a warning. Two or three suggest a pattern. Many cells lit up along the same boundary pair means the boundary has already eroded and what you are looking at is a refactoring project, not a single fix. When you find a cell with a very high reference count in a single caller, navigate from the cell to the IDE to find the specific class responsible. When the reference count is low but spread across many callers, the fix is structural: you need to make the imported package's internals less accessible, not track down individual import statements.
export_note: |
  Export the Package Matrix as TSV to get the full dependency count table. Open it in a spreadsheet, filter to the target package's column, and sort by reference count to rank the callers. This gives you a prioritised list for code review.
metrics:
  - fan-in-fan-out
related_metrics:
  - fan-in-fan-out
related_docs:
  - lenses
related_workflows:
  - review-package-boundaries
  - find-accidental-boundary-leaks
  - leaky-internals
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
