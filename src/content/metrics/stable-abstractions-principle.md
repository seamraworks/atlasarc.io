---
title: Stable abstractions principle
slug: stable-abstractions-principle
seo_title: Stable Abstractions Principle | Software Architecture Metrics | AtlasArc
seo_description: The stable abstractions principle says that stable packages should be abstract, and unstable packages can be concrete. It underpins the instability–abstractness metric.
alias_of_slug: instability-abstractness
alias_of_title: Instability and abstractness
what_it_is: |
  The stable abstractions principle, formulated by Robert Martin, holds that a package's level of abstraction should match its stability. If many things depend on a package, it had better be abstract — otherwise every consumer is coupled to its implementation details. If a package is free to change (low fan-in), concreteness is fine. AtlasArc's instability and abstractness metrics are a direct measurement of how well your packages honour this principle.
related_lenses:
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
  - composition
---
