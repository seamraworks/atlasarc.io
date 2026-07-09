---
title: Composition
slug: composition
category: Mass
summary: A treemap, sunburst chart, or circle pack where area encodes class count. It answers where the code actually lives.
seo_title: Composition Lens | AtlasArc Documentation
seo_description: Learn how to read the AtlasArc Composition lens for package hierarchy, class-count mass, treemap, sunburst, and circle-pack views.
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
---

The Composition view shows the package hierarchy as a treemap, sunburst chart, or circle pack, where the area of each region encodes class count. It is not a dependency view. It is a mass view. It answers a different question: where does the code actually live?

This sounds simple, but it is useful before any significant refactoring work. The packages you think of as large and important sometimes turn out to hold fewer classes than a handful of small utility packages that nobody thinks about. The Composition view makes that visible at a glance.

Double-click any region to drill into that subtree. Right-click to navigate to the package in the IDE. Switching between treemap, sunburst, and circle pack is a matter of preference; the data is the same either way.
