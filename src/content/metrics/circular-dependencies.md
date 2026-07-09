---
title: Circular dependencies
slug: circular-dependencies
seo_title: Circular Dependencies | Software Architecture Metrics | AtlasArc
seo_description: Circular dependencies occur when packages form a dependency loop — A depends on B, B depends on C, C depends on A. Alternative name for cyclic dependencies.
alias_of_slug: cyclic-dependencies
alias_of_title: Cyclic dependencies
what_it_is: |
  Circular dependencies are what most developers call the situation that graph theory calls a cycle: package A imports B, B imports C, and C imports A. All three are now coupled into a single blob that cannot be understood, tested, or deployed independently. AtlasArc measures and surfaces these as cyclic dependencies, with visualisation of which packages are caught in each loop.
related_lenses:
  - topology-graph
  - package-matrix
  - subsystems
  - hotspots
---
