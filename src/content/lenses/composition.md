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

Double-click any region to drill into that subtree. Right-click to navigate to the package in the IDE. Switching between treemap, sunburst, and circle pack changes how you read the same hierarchy.

<h2 id="treemap">Treemap</h2>

Treemap is the proportional read. Rectangles make it easy to compare how much code mass lives in one branch versus another. Use it when the question is "which area is largest?" or "where would a focused reduction move the most code?"

Depth modes change how much hierarchy is visible at once. Direct shows the nearest children. Adaptive finds a useful frontier through the package tree. Full System keeps more recursive detail on screen, which can be dense but useful for export or a careful review.

<h2 id="sunburst">Sunburst</h2>

Sunburst is the depth read. Inner arcs are closer to the current root; outer arcs are deeper descendants. It is good for seeing branch shape and nested structure when rectangular area alone makes the hierarchy hard to follow.

Double-click an arc to set focus. Click the centre or empty area to select the current root. Use it when you need to explain how a subsystem is nested before discussing how large it is.

<h2 id="circle-pack">Circle Pack</h2>

Circle Pack is the organic hierarchy read. Nested circles make containment easy to perceive, especially when you are scanning for clusters rather than comparing exact area. It supports zoom and pan when the hierarchy is visually crowded.

Use Circle Pack as a second read when Treemap feels too rectilinear or Sunburst makes sibling comparison awkward. It is still a Composition renderer, not a dependency graph.

<h2 id="composition-heatmaps">Composition heatmaps</h2>

Composition can layer a heatmap on top of containment. Size still shows mass. Colour shows the selected metric: instability, complexity, coverage, fan-in, fan-out, visibility, or another available signal. That combination answers "where is the code, and which of those areas carries pressure?"

When no heatmap is active, colour describes hierarchy depth rather than risk. If the banner says Heatmap, the colour is metric-driven; otherwise it is structural tint.
