---
title: Distance from the main sequence (D)
slug: distance-from-main-sequence
seo_title: Distance from the Main Sequence (D) | Software Architecture Metrics | AtlasArc
seo_description: Distance from the main sequence (D) measures how far a package deviates from the ideal balance between stability and abstractness. Alternative name for the instability–abstractness metric.
alias_of_slug: instability-abstractness
alias_of_title: Instability and abstractness
what_it_is: |
  Distance from the main sequence, denoted D, quantifies how far a package sits from the ideal diagonal between pure instability and pure abstractness. Robert Martin defined this in his work on package design principles. A package on the main sequence is as abstract as it is stable: abstract enough to extend where many things depend on it, concrete enough to change freely where few do. A high D value means it has drifted toward one of the two failure zones, the Zone of Pain (stable but concrete) or the Zone of Uselessness (abstract but unused).
related_lenses:
  - hotspots
  - topology-graph
  - package-matrix
  - composition
---
