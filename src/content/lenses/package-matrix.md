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

<h2 id="reading-the-matrix">Reading the Matrix</h2>

The thing the matrix makes obvious that the graph often obscures is *directionality*. Dependencies above the diagonal flow one way; dependencies below it flow the other way. If you see significant cells both above and below the diagonal for the same pair of packages, those two packages are mutually dependent. That is either a cycle or a tightly coupled relationship worth breaking up.

Cross-layer coupling shows up clearly here too. Use Set as Root when you want to inspect the inside of one package subtree. For boundary work, use **Pin subject · Matrix** from a package menu instead: AtlasArc keeps the package or subsystem as the subject, derives its boundary neighbours, and anchors the subject row and column so incoming and outgoing traffic stay easy to read. Neighbour-to-neighbour cells remain visible as dimmed context, which helps you see whether the surrounding area is tangled without confusing it with subject-boundary traffic.

<h2 id="boundary-matrix">Boundary Matrix</h2>

Boundary Matrix is a pinned-subject read. The subject row shows outgoing references from the pinned package or subsystem. The subject column shows incoming references from its neighbours. Cells between neighbours stay visible as lower-priority context, so you can tell whether the surrounding area is also tangled without mistaking that traffic for the subject boundary itself.

Use Boundary Matrix when a package or subsystem owns the question: "who crosses this boundary, in which direction, and how much?" Use Set as Root when the question is simply "what is inside this subtree?"

<h2 id="cycle-matrix">Cycle Matrix</h2>

Cycle Matrix keeps one detected cycle group in view while preserving enough surrounding structural context to read the loop. It is useful after the graph has identified a cycle group and you need the exact directional relationships in table form.

Cycles Only can also filter the Matrix to cycle-participating packages and dependencies. That is a triage filter across the visible model. Cycle Matrix is the persistent one-group posture.

The structural breadcrumb above the Matrix follows the current anchor. In an ordinary rooted view, a breadcrumb hop updates Current Focus. In a pinned boundary read, the same hop moves the subject pin to that ancestor so you can widen the audit without rebuilding the view.

If you want to take the data somewhere else, the Export menu includes a TSV export of the full matrix. Drop it into a spreadsheet, sort by dependency count, and you have a prioritised list of the tightest couplings in your project.
