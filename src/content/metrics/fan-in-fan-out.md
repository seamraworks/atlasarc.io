---
title: Fan-in and fan-out
slug: fan-in-fan-out
seo_title: Fan-in and Fan-out | Software Architecture Metrics | AtlasArc
seo_description: Learn how to interpret fan-in and fan-out package metrics in AtlasArc for Java, Kotlin, and TypeScript projects.
aliases:
  - afferent coupling (Ca)
  - efferent coupling (Ce)
what_it_is: |
  Every package has two numbers that turn out to be surprisingly informative. Fan-in is how many other packages import it. Fan-out is how many packages it imports. That's it. High fan-in means a lot of other packages are counting on you. High fan-out means you're counting on a lot of other packages. Together those two numbers tell you most of what you need to know about a package's structural role in the codebase.
why_it_matters: |
  Think about what it means to change a package with fan-in of 40. The edit happens in one package, but the risk reaches 40 others. You need to check them, update them, retest them. That one-line fix you thought would take an hour is now a Tuesday afternoon. Fan-in and fan-out don't tell you whether a change is safe, but they tell you how far the blast radius reaches before you make it.
high_value_means: |
  High fan-in means many packages depend on this one. That's natural for shared utilities, core domain types, and stable framework libraries. It also means any API change is expensive and needs to be considered carefully. High fan-out means this package imports many others. Above a certain threshold it starts to look like a god package that has taken on too many concerns, or an adapter that has grown well beyond its original purpose.
low_value_means: |
  Low fan-in means few packages depend on this one. That's expected for leaf packages like adapters and application bootstrapping. For shared utilities, low fan-in might mean the abstraction isn't being used and is worth questioning. Low fan-out means the package is self-contained, which is a natural and desirable trait for utility packages, domain primitives, and stable interfaces.
do_not_overinterpret: |
  High fan-in is not inherently bad. A well-designed API or domain model should have high fan-in, because that's the point of an abstraction. High fan-out isn't inherently bad either, for an adapter or bootstrap layer whose job is to wire things together. Read fan-in and fan-out alongside instability and the package's architectural role before drawing conclusions. A package with high fan-out and high instability is a different kind of problem than one with high fan-out and low instability.
where_shown: |
  In the sidebar when any package is selected in the Topology Graph or Package Matrix. As filter controls in the left sidebar (Min fan-in, Max fan-in, Min fan-out, Max fan-out). As axis options in the Subsystems and Hotspots bubble charts. Also available in exported CSV data from the Subsystems and Hotspots lenses.
related_lenses:
  - topology-graph
  - package-matrix
  - hotspots
  - composition
formula: |
  Fan-in (Ca) = number of classes in other packages that depend on (import) any class in this package. Fan-out (Ce) = number of classes in this package that depend on (import) classes in other packages. AtlasArc counts at the class-import level and aggregates to the package level via the PSI/ArchUnit scanner.
---

Body content is not used for structured pages.
