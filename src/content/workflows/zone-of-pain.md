---
title: Zone of Pain
slug: zone-of-pain
seo_title: Investigate the Zone of Pain in Your Codebase | AtlasArc Workflow
seo_description: Use AtlasArc to find packages that are maximally stable and maximally concrete, load-bearing, hard to change, and getting riskier with every new caller.
problem: |
  There is a package in your codebase that nobody has touched in two years. Not because it is good. Because everyone is afraid of it. It has 30 incoming dependencies, zero interfaces, and no tests to tell you whether you broke something. Every time a feature touches anything near it, the developer adds a comment in the ticket saying "avoid changing X." That package is in the Zone of Pain.
why_it_matters: |
  The Zone of Pain is the architectural danger zone for load-bearing concrete packages. They are stable in the worst way: nobody can afford to change them. Every new caller that imports such a package adds to the accumulated cost of the day when it finally needs to change. The longer a package sits in the Zone of Pain without gaining abstraction, the more expensive that day becomes. Identifying these packages early and adding abstraction while the caller count is still manageable is much cheaper than trying to do it after the count reaches 40 or 60.
lens: Hotspots
steps:
  - heading: Open Hotspots.
    body: Switch to the Hotspots bubble chart. The X axis is instability, the Y axis is cyclomatic complexity. Colour intensity shows distance from the main sequence.
  - heading: Look for the bottom-left cluster.
    body: Packages with low instability (stable) and low abstractness (concrete) are in the Zone of Pain. In Hotspots, these appear in the bottom-left quadrant as stable packages that are also low complexity on the Y axis but are flagged by distance-from-main-sequence colour.
  - heading: Click each candidate and check the sidebar.
    body: "Click a bubble to see its fan-in, instability, abstractness, and distance from main sequence in the sidebar. A package with distance near 1.0 in the Zone of Pain is at maximum architectural stress: completely stable and completely concrete."
  - heading: Rank by fan-in.
    body: Among Zone of Pain candidates, the ones with the highest fan-in are the most urgent. Those are the packages where a design change would ripple through the most callers.
interpretation: |
  Distance from main sequence is the key indicator here. A package with D close to 1.0 in the Zone of Pain is as far as possible from the ideal balance between stability and abstraction. The remedy is usually not to reduce coupling. Callers are already committed, and telling twenty packages to stop depending on something is a coordination problem, not a code change. The fix is to introduce abstraction for the surface area callers actually use. Add an interface for the types that most callers depend on. Leave the concrete implementation alone for now. Once callers depend on the interface, the concrete package can evolve without breaking everyone simultaneously.
export_note: |
  Export the Hotspots chart as PNG with distance-from-main-sequence as the colour encoding. This gives a clear visual showing which packages in the Zone of Pain have the worst fit to the stable abstractions principle, and is useful for architecture risk documentation.
metrics:
  - fan-in-fan-out
  - instability-abstractness
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - stable-but-too-concrete
  - identify-hotspots
  - packages-in-the-wrong-place
  - hard-to-change-packages
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
