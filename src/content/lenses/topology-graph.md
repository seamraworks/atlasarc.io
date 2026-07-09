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

The graph can show a cycle overlay from the **Cycles** section in the left sidebar. Packages involved in dependency cycles are highlighted and labelled with their cycle-group number. Click any highlighted node to see the full group membership and the dependency edges that form the loop in the sidebar. Step through multiple groups using the cycle-group navigator.

Beyond cycles, you can:

- **Expand packages inline** to show subpackages without leaving the graph
- **Open one visible package/source folder into classes or files** when you need to inspect the implementation tangle inside it
- **Filter by coupling strength** to cut the visual noise on large projects and focus on the tightly coupled pairs
- **Apply heatmap colouring** to any metric from the heatmap menu, so topology and metric values share the same view rather than existing in separate panels
- **Right-click any package** to Set as Root, Pin subject · Neighbourhood, Pin subject · Boundary, or navigate to it directly in the IDE

Package internals stay contained. A Java or Kotlin package opens into classes; a TypeScript source folder opens into files. Same-owner edges can show local tangles, but external dependencies still connect package to package/source folder, and the other lenses keep their package/source-folder model.

When a package is pinned, the graph becomes a focused neighbourhood or boundary read around that subject. The toolbar adds **Direction**, **Neighbour links**, and **Mute cycles** controls so you can switch between a local blast-radius picture and a cleaner ingress/egress interface without starting over. The structural breadcrumb above the graph lets you move the pin to an ancestor package when the audit needs a wider subject.

The Topology Graph is where you go to understand structure. The other lenses are where you go to measure it.
