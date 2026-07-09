---
title: Package Matrix
slug: package-matrix
category: Relational
summary: A dependency structure matrix that makes directionality and mutual coupling obvious where the graph can become visually dense.
seo_title: Package Matrix Lens | AtlasArc Documentation
seo_description: Learn how to read the AtlasArc Package Matrix lens for dependency direction, mutual coupling, boundary leaks, and matrix exports.
related_metrics:
  - fan-in-fan-out
  - cyclic-dependencies
---

The Package Matrix is a dependency structure matrix, sometimes called a DSM. Both rows and columns represent packages or source folders; each cell shows the number of usage dependencies between the row package and the column package. The diagonal stays empty at the package level: package-local class/file evidence belongs in the Topology Graph's contained internals layer, not in Matrix self-cells.

The thing the matrix makes obvious that the graph often obscures is *directionality*. Dependencies above the diagonal flow one way; dependencies below it flow the other way. If you see significant cells both above and below the diagonal for the same pair of packages, those two packages are mutually dependent. That is either a cycle or a tightly coupled relationship worth breaking up.

Cross-layer coupling shows up clearly here too. Use Set as Root when you want to inspect the inside of one package subtree. For boundary work, use **Pin subject · Boundary matrix** from a package menu instead: AtlasArc keeps the package or subsystem as the subject, derives its boundary neighbours, and anchors the subject row and column so incoming and outgoing traffic stay easy to read. Neighbour-to-neighbour cells remain visible as dimmed context, which helps you see whether the surrounding area is tangled without confusing it with subject-boundary traffic.

The structural breadcrumb above the Matrix follows the current anchor. In ordinary scoped views, a breadcrumb hop re-scopes the Matrix. In a pinned boundary read, the same hop moves the subject pin to that ancestor so you can widen the audit without rebuilding the view.

If you want to take the data somewhere else, the Export menu includes a TSV export of the full matrix. Drop it into a spreadsheet, sort by dependency count, and you have a prioritised list of the tightest couplings in your project.
