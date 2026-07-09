---
title: Efferent coupling (Ce)
slug: efferent-coupling
seo_title: Efferent Coupling (Ce) | Software Architecture Metrics | AtlasArc
seo_description: Efferent coupling (Ce) measures how many packages a given package depends on. It is the formal term for fan-out in package architecture analysis.
alias_of_slug: fan-in-fan-out
alias_of_title: Fan-in and fan-out
what_it_is: |
  Efferent coupling, denoted Ce, counts how many packages outside a given package it depends on. It is the formal term for what AtlasArc calls fan-out. A high Ce means this package imports many others — any of them changing may force this package to change too.
related_lenses:
  - topology-graph
  - package-matrix
  - hotspots
  - composition
---
