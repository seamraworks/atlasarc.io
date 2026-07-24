---
title: Topology Graph
slug: topology-graph
category: Structural
summary: Every package in your project as a node, with directed edges representing usage dependencies. This is the default lens and the place to start when you need to understand structure.
seo_title: Topology Graph Lens | AtlasArc Documentation
seo_description: Learn how to read the AtlasArc Topology Graph lens for package dependencies, cycle groups, filters, heatmaps, and IDE navigation.
related_metrics:
  - cyclic-dependencies
  - fan-in-fan-out
---

The Topology Graph is the default view and the one you'll spend most of your time in. It shows every package in your project as a node, with directed edges representing usage dependencies. An arrow from A to B means code in A uses code from B.

<h2 id="reading-the-graph">Reading the graph</h2>

The graph can show a cycle overlay from the **Cycles** section in the left sidebar. Packages involved in dependency cycles are highlighted and labelled with their cycle-group number. Click any highlighted node to see the full group membership and the dependency edges that form the loop in the sidebar. Step through multiple groups using the cycle-group navigator.

Beyond cycles, you can:

- **Expand packages inline** to show subpackages without leaving the graph
- **Open one visible package/source folder into classes or files** when you need to inspect the implementation tangle inside it
- **Filter by coupling strength** to cut the visual noise on large projects and focus on the tightly coupled pairs
- **Apply heatmap colouring** to any metric from the heatmap menu, so topology and metric values share the same view rather than existing in separate panels
- **Right-click any package** to Set as Root, pin it as a structural subject in Graph or Matrix, or navigate to it directly in the IDE

Package internals stay contained. A Java or Kotlin package opens into classes; a TypeScript source folder opens into files. Same-owner edges can show local tangles, but external dependencies still connect package to package/source folder, and the other lenses keep their package/source-folder model.

<h2 id="pinned-subject-controls">Pinned Subject Controls</h2>

When a package is pinned, the graph becomes one subject-centred structural read. The toolbar adds **Direction**, **Neighbour links**, and **Mute cycles** controls so you can move between a local blast-radius picture and a cleaner ingress/egress interface without starting over. The structural breadcrumb above the graph lets you move the pin to an ancestor package when the audit needs a wider subject.

Neighbourhood is shorthand for the local blast-radius read: what this package depends on, and what depends on it. Boundary is shorthand for the perimeter read: what crosses into and out of the selected package or subsystem. They are readings of the same pinned subject, not separate graph modes.

<h2 id="cycle-view-and-cycles-only">Cycle View and Cycles Only</h2>

Cycle View keeps one detected cycle group as the current structural subject. Use it when you have selected a group from the Cycles panel and want the graph to hold that group steady while you inspect the packages and edges keeping the loop alive.

Cycles Only is broader. It filters the current view to cycle-participating packages and dependencies, which is useful when you are triaging several groups or trying to see whether the visible area is tangled at all. Cycle View is one selected group; Cycles Only is a cycle-participant filter.

<h2 id="heatmap-overlay">Heatmap Overlay</h2>

The graph can colour visible packages by a selected metric without changing the dependency structure underneath. Use heatmaps for questions like "which cycle participants are unstable?", "which backbone packages are too concrete?", or "which depended-on packages have weak coverage?"

The overlay belongs to the current visible graph. Current Focus, filters, view exclusions, Cycles Only, and pinned subject posture still decide which packages and edges are present; the heatmap adds the metric read on top.

The Topology Graph is where you go to understand structure. The other lenses are where you go to measure it.
