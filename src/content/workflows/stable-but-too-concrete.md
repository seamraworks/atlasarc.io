---
title: Stable but too concrete
slug: stable-but-too-concrete
seo_title: Find Stable but Concrete Packages in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to identify packages that are too stable to change but too concrete to evolve, the maintenance traps hiding in plain sight.
problem: |
  There is a utility package that twenty other packages depend on. Nobody touches it. Not because it is well-designed. Because everyone is afraid of it. It has no interfaces, no abstractions, just final classes and static helpers. You cannot mock it in tests. You cannot swap it out for a different implementation. And every time you want to add a parameter to one of its methods, you have to update twenty callers.
why_it_matters: |
  Concrete packages with high fan-in are the architectural equivalent of a load-bearing wall made of glass. They hold everything up but they cannot change without shattering. The package will not tell you it is a problem. It is stable, it ships, nobody complains. The cost shows up gradually: in tests that take too long to write, in releases that take too long to coordinate, in features that should be easy but always turn into a week of cascading changes.
lens: Hotspots
steps:
  - heading: Open the Hotspots bubble chart.
    body: Switch to Hotspots. Each bubble is a package; bubble size encodes class count so you can quickly see which packages are large and which are small.
  - heading: Find the bottom-left cluster.
    body: Low instability (stable) combined with low abstractness (concrete) places a package in the Zone of Pain. Look for packages in the bottom-left area of the chart, where stable and concrete meet.
  - heading: Check fan-in in the sidebar.
    body: Click each candidate bubble to see its fan-in in the sidebar. A package that is stable, concrete, and has high fan-in is the maintenance trap you are looking for. The higher the fan-in, the more damage a design change will cause.
  - heading: Identify the surface area that callers actually use.
    body: Navigate from the package to the Package Matrix to see which callers depend on it and how many references each has. The callers with the highest reference counts are depending most heavily on the concrete implementation.
interpretation: |
  Concrete packages are not wrong by default. Application wiring, adapters, and CLI entry points are supposed to be concrete because they translate between layers and are not meant to be replaced. The problem is when a shared utility package that multiple services depend on is also concrete. Those callers are locked into the implementation details. The standard fix is extracting interfaces for the types callers actually depend on, not refactoring the internals. Once the callers depend on an interface, the concrete implementation can evolve without rippling outward.
export_note: |
  Export the Hotspots chart as PNG with the current axis configuration to document the Zone of Pain candidates for an architecture review. The bubble sizes give an immediate visual sense of which concrete stable packages are also the largest.
metrics:
  - fan-in-fan-out
  - instability-abstractness
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - zone-of-pain
  - packages-in-the-wrong-place
  - identify-hotspots
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
