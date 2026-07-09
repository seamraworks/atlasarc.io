---
title: Afferent coupling (Ca)
slug: afferent-coupling
seo_title: Afferent Coupling (Ca) | Software Architecture Metrics | AtlasArc
seo_description: Afferent coupling (Ca) measures how many packages depend on a given package. It is the formal term for fan-in in package architecture analysis.
alias_of_slug: fan-in-fan-out
alias_of_title: Fan-in and fan-out
what_it_is: |
  Afferent coupling, denoted Ca, counts how many packages outside a given package depend on it. It is the formal term for what AtlasArc calls fan-in. A high Ca means many other packages are importing this one — changes to its public API ripple outward across all of them.
related_lenses:
  - topology-graph
  - package-matrix
  - hotspots
  - composition
---
