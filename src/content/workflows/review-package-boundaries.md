---
title: Review package boundaries
slug: review-package-boundaries
seo_title: Review Package Boundaries in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to inspect package boundaries, spot boundary erosion, and keep module structure clean in Java, Kotlin, and TypeScript projects.
problem: |
  You drew the layering diagram on a whiteboard a few years ago. Domain at the top, infrastructure at the bottom, clean arrows going one way. The code has been quietly ignoring that diagram ever since. Not through anyone's fault, really. A service class needed a database helper. The helper was right there. The import took three seconds. And now your domain package knows about your persistence layer.
why_it_matters: |
  Boundary erosion is invisible in the compiler. Your tests still pass. The build is green. But the layering you designed no longer exists, and you won't discover that until you try to reuse the domain logic somewhere else, or move the persistence layer to a different module, or onboard a new developer who reads the architecture diagram and then opens the code. The Package Matrix makes it visible before that moment arrives.
lens: Matrix
steps:
  - heading: Open the boundary in the Package Matrix.
    body: Right-click the package or subsystem you want to audit and choose Pin subject · Matrix. AtlasArc opens the Matrix around that subject, with its boundary neighbours visible instead of hiding the outside world behind an ordinary root scope.
  - heading: Read the subject row and column.
    body: The subject row shows outgoing traffic from the package or subsystem; the subject column shows incoming traffic from neighbours. Dense cells crossing your intended layering boundaries are the first leaks to investigate.
  - heading: Check the neighbour context.
    body: Neighbour-to-neighbour cells stay visible as quieter context. They tell you whether the area around the boundary is also tangled, without making those context cells equal to subject-boundary traffic.
metrics:
  - fan-in-fan-out
interpretation: |
  Zero boundary cells is an ideal you are unlikely to reach. That's fine. The goal is directionality and intent. If the subject mostly depends outward through expected adapter or infrastructure packages, the boundary may be healthy even with visible traffic. If inbound callers reach internal packages, or if the same neighbour has dense traffic in both directions, those packages are mutually entangled and you should investigate whether they should be merged, split, or wired through a shared interface. The cell count tells you the volume; clicking a cell shows the dependency edges behind it.
export_note: |
  Export the matrix as TSV from the Export menu. Open it in a spreadsheet to sort by dependency count, identify the most tightly-coupled pairs, and come back to it after a cleanup sprint to see whether the numbers moved.
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - find-suspicious-dependents
  - find-accidental-boundary-leaks
  - show-me-the-backbone
  - audit-a-module-boundary
---

Body content is not used for structured pages.
