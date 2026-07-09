---
title: Dependency cycles
slug: dependency-cycles
seo_title: Dependency Cycles | Software Architecture Metrics | AtlasArc
seo_description: Dependency cycles are loops in the package dependency graph where following imports eventually leads back to the starting package. Alternative name for cyclic dependencies.
alias_of_slug: cyclic-dependencies
alias_of_title: Cyclic dependencies
what_it_is: |
  A dependency cycle is a loop in the package graph: follow the imports and you eventually arrive back where you started. The packages inside the loop cannot be meaningfully separated — build order becomes ambiguous, refactoring affects everything in the loop, and independent deployment becomes impossible. AtlasArc identifies and visualises dependency cycles as part of the cyclic dependencies metric.
related_lenses:
  - topology-graph
  - package-matrix
  - subsystems
  - hotspots
---
