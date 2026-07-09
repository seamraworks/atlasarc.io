---
title: Identify risky hotspots
slug: identify-hotspots
seo_title: Identify Risky Hotspots in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to find risky hotspots where complexity, coupling, volatility, and structural links overlap.
problem: |
  Imagine you have one sprint to improve the codebase before a major feature push. You open the repository, stare at 120 packages, and try to decide where to start. The most complex class? The package that keeps breaking tests? The one everyone is afraid to touch? Without a way to see coupling and complexity at the same time, you end up picking based on intuition. Sometimes you get lucky.
why_it_matters: |
  The packages that cause the most damage aren't just the complex ones. They're the complex ones that everything else depends on, that sit far from the stable-abstractions balance, or that cluster near structurally related risk. A gnarly utility package that nothing else uses is a local problem. A gnarly utility package that half your service layer depends on is a systemic one. The Hotspots map gives you the first shortlist; Galaxy helps when the map is too dense to see the larger pattern.
lens: Hotspots
steps:
  - heading: Open the Hotspots map.
    body: Switch to the Hotspots lens. Start with the Complexity preset to compare cyclomatic and cognitive complexity, sized by lines of code.
  - heading: Add the structural second pass.
    body: Use the Zone Map preset to bring instability, abstractness, and distance from the main sequence into the same investigation.
  - heading: Focus on the risky cluster.
    body: Start with the upper-right or reddest cluster, not isolated small bubbles. Click any bubble to drill into its metrics in the sidebar before choosing a refactoring target.
  - heading: Use Galaxy when the map gets crowded.
    body: If the flat map has too many plausible candidates, switch to Galaxy Risk horizon. Depth, size, colour, and dependency routes help separate lone metric outliers from structurally connected risk clusters.
metrics:
  - instability-abstractness
  - fan-in-fan-out
  - cyclomatic-complexity
interpretation: |
  High instability alone is not a problem. Leaf packages, adapters, and application wiring are naturally unstable, and that's fine as long as they stay simple. The risk signal is a package that stays prominent across several dimensions: complex enough to be expensive, volatile enough to move, depended-on enough to matter, far enough from the main sequence to look architecturally misplaced, or close enough to real dependency routes that the problem is not isolated. Packages that disappear from both the map and Galaxy view are usually lower-priority for this pass.
export_note: |
  Export the Hotspots map as PNG for the shortlist. Export the Galaxy view as a supporting planning artifact when the route network explains why a group of risky packages belongs together. The Data as CSV export gives you the raw metrics table for every package, which you can sort and filter independently of the chart.
related_metrics:
  - instability-abstractness
  - fan-in-fan-out
  - cyclomatic-complexity
related_docs:
  - lenses
related_workflows:
  - ticking-time-bombs
  - hard-to-change-packages
  - zone-of-pain
  - complexity-hotspots
---

Body content is not used for structured pages.
