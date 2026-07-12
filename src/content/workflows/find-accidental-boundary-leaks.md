---
title: Find accidental boundary leaks
slug: find-accidental-boundary-leaks
seo_title: Find Accidental Package Boundary Leaks in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to detect where implementation packages are reachable from outside their intended module boundary — before the leaks become a refactoring problem.
problem: |
  You set up a module with a clean public API package. The internal implementation packages were supposed to stay internal. Three months later, you discover that six external packages are importing the internal helpers directly. Nobody made a deliberate choice to expose them. One developer found the shortcut, and others followed. The module boundary exists in the original design, but not in the actual code.
why_it_matters: |
  Leaks like this start small. One internal class imported by one external caller is a fixable problem. Twenty external callers importing twelve internal classes is a refactoring project that will take multiple sprints and require coordination across teams. The longer a leak stays unchecked, the more callers build on the internal package, and the harder it becomes to change the internals without breaking something external. Catching leaks early is the difference between a one-commit fix and a migration.
lens: the Package Matrix
steps:
  - heading: Open the module boundary.
    body: Right-click the module root package and choose Pin subject · Matrix. This keeps the module as the subject while preserving the outside callers and dependencies you need for a leak check.
  - heading: Read the Package Matrix around the subject.
    body: The subject subtree appears with its boundary neighbours as rows and columns. External callers show up as neighbour rows with cells pointing into internal package columns.
  - heading: Look for internal packages with external callers.
    body: Scan for cells where a row from outside the module boundary has a dependency on an internal implementation package. These are the leaks. The number in the cell is how many references the external caller has made to the internal package.
  - heading: Click into each leak cell.
    body: Click the cell to see which specific classes the external caller is importing. This tells you which internal API is being used and how entrenched the dependency is.
  - heading: Prioritise by caller count.
    body: Internal packages with one external caller are usually a quick fix. Packages with five or more external callers will require coordination. Start with the smallest leaks and track the larger ones as planned refactoring work.
interpretation: |
  The key signal is whether callers are using the internal package as if it is a stable API. High reference counts suggest callers are building on the implementation details, not accidentally importing one class. Low reference counts suggest an opportunistic shortcut that is easier to redirect. For every leak, the fix options are: restrict access at the module boundary, move the needed functionality to the public API package, or extract a shared library if multiple modules legitimately need the type. The choice depends on how intentional the dependency is.
export_note: |
  Export the Package Matrix as TSV and filter to the internal package columns to get a ranked list of all external callers. This is useful for tracking work across sprints or communicating the scope of the problem to other teams.
metrics:
  - fan-in-fan-out
related_metrics:
  - fan-in-fan-out
related_docs:
  - lenses
related_workflows:
  - review-package-boundaries
  - leaky-internals
  - find-suspicious-dependents
  - audit-a-module-boundary
---

Body content is not used for structured pages — section content lives in the
front-matter fields above and is rendered through the workflow-page template.
