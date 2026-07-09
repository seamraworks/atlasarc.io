---
title: Leaky internals
slug: leaky-internals
seo_title: Find Packages with Leaky Internal Visibility | AtlasArc Workflow
seo_description: Use AtlasArc to identify packages exposing far more public surface than callers need, the root cause of accidental API surface creep.
problem: |
  A service package has 40 public classes. Callers use 4 of them. The other 36 are technically accessible and some external code has already started depending on them. Every refactor of those 36 classes now has to check whether something outside the package broke. The package was never intended to be a public API, but it is acting like one.
why_it_matters: |
  Packages that expose too much of their internal surface accumulate accidental callers. Every public class that an external package discovers and uses becomes a commitment: you cannot change the class without risking a breakage outside the package. Over time, the gap between the intended API and the actual API widens, until the package's true interface is "everything public" and refactoring becomes expensive coordination work instead of an internal change.
lens: Composition
steps:
  - heading: Open Composition.
    body: Switch to the Composition lens. The treemap shows package area by code mass (LOC or class count). Colour can be set to any metric using the heatmap overlay.
  - heading: Enable the relative visibility heatmap.
    body: Apply the relative visibility heatmap overlay. Packages with high relative visibility appear in a saturated colour because they expose a large share of their internal surface as public. The intensity of the colour shows how much of the package is visible from outside.
  - heading: Click any high-visibility package.
    body: Click a tile to drill into the package. The class composition view shows which specific classes are public. Check how many callers each public class has in the sidebar. Classes with zero external callers are unnecessarily public.
  - heading: Open the package internals in Topology.
    body: Switch to the Topology Graph, find the same leaf package, and open its classes or files. The package stays the architecture unit, but the graph can now show same-package implementation edges, making local service/repository/helper tangles visible without turning those classes into peer package nodes.
  - heading: Cross-check with fan-in.
    body: Switch to the Topology Graph and check the overall fan-in for high-visibility packages. A package with high relative visibility and high fan-in is an active API surface. One with high visibility and low fan-in is a package that is exposed but not yet discovered, easier to close up now than after callers arrive.
interpretation: |
  Relative visibility above 0.8 in an implementation package means almost everything is public. For a deliberately designed public API package, that may be intentional. For an internal service, it is accidental surface area. The fix is reducing access scope: make helpers package-private, or move internal types to a dedicated private subpackage. The goal is not to make everything private, but to make the public surface intentional. Every public class should be there because callers outside the package need it, not because nobody bothered to restrict access.
export_note: |
  Export the Composition view as PNG with the relative visibility heatmap active to show which parts of the hierarchy are over-exposed. When one package needs evidence, export or capture the focused Topology Graph with that package's internals open so the team can see the local implementation tangle behind the visibility finding.
metrics:
  - fan-in-fan-out
  - relative-visibility
related_metrics:
  - fan-in-fan-out
  - relative-visibility
related_docs:
  - lenses
related_workflows:
  - find-accidental-boundary-leaks
  - find-suspicious-dependents
  - audit-a-module-boundary
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
