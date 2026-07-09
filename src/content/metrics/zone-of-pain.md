---
title: Zone of pain
slug: zone-of-pain
seo_title: Zone of Pain | Software Architecture Metrics | AtlasArc
seo_description: The zone of pain describes packages that are highly stable but have no abstractions — rigid, hard to change, and locked in place. Part of the instability–abstractness metric.
alias_of_slug: instability-abstractness
alias_of_title: Instability and abstractness
what_it_is: |
  The zone of pain is the corner of the stability–abstractness graph where a package is both highly stable (many things depend on it) and completely concrete (no interfaces or abstract types). It cannot change without breaking everything that imports it, and it offers nothing abstract to depend on. The name is Robert Martin's. AtlasArc surfaces packages in this zone as part of the instability and abstractness analysis.
related_lenses:
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
  - composition
---
