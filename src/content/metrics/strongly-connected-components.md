---
title: Strongly connected components (SCCs)
slug: strongly-connected-components
seo_title: Strongly Connected Components (SCCs) | Software Architecture Metrics | AtlasArc
seo_description: Strongly connected components (SCCs) are groups of packages where every package can reach every other through dependency paths. The formal term for cyclic dependency clusters.
alias_of_slug: cyclic-dependencies
alias_of_title: Cyclic dependencies
what_it_is: |
  A strongly connected component is a maximal group of packages in which every package can reach every other via directed dependency paths. In practical terms, an SCC with more than one member is a cycle: the packages are mutually entangled. Graph theory uses the term SCC; architects usually say "dependency cycle". AtlasArc detects and visualises these clusters as part of the cyclic dependencies metric.
related_lenses:
  - topology-graph
  - package-matrix
  - subsystems
  - hotspots
---
