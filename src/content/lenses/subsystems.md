---
title: Subsystems
slug: subsystems
category: Comparative
summary: Architectural areas compared in metric space, so you can reason about coupling, stability, and size above individual packages.
seo_title: Subsystems Lens | AtlasArc Documentation
seo_description: Learn how to use the AtlasArc Subsystems lens to compare architectural areas, boundary risk, coupling, instability, and size.
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
---

The Subsystems view compares architectural areas in metric space. Once you have defined subsystems by grouping packages, this view plots those groups against each other so you can compare coupling, instability, and size at a coarser granularity than individual packages.

If the per-package graph is too dense to reason about, this is where to go. On a large codebase with recognised domain boundaries, the Subsystems view tells you whether those boundaries are holding up structurally, or whether coupling is quietly building across them in ways that will not be obvious until someone tries to move a module.

Subsystems is available in Professional and Team plans.
