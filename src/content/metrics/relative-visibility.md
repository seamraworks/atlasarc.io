---
title: Relative visibility
slug: relative-visibility
seo_title: Relative Visibility (RV) | Software Architecture Metrics | AtlasArc
seo_description: Relative visibility measures how much of a package's surface area is publicly exposed. Learn how to interpret it in AtlasArc for Java and Kotlin projects.
aliases:
  - RV
  - visibility
what_it_is: |
  Relative visibility measures what fraction of a package's types and members are publicly accessible. A value of 1.0 means everything is public; 0.0 means nothing is. The interesting range is everything in between: packages where visibility is higher than necessary and internal implementation details have leaked into the public surface.
why_it_matters: |
  Every public type or member is an implicit promise to callers that import it. When you refactor the internals of a package, you can freely change private and package-private types without touching anything outside. The moment something is public, changing it becomes a negotiation. Packages with unnecessarily high visibility accumulate callers over time, become harder to evolve, and harder to test in isolation. Reducing visibility is one of the cheapest architectural improvements available, and relative visibility tells you where that work is.
high_value_means: |
  High relative visibility means most of the package's types and members are publicly declared. That is appropriate for a shared API layer or a utility package designed to be widely imported. For a domain implementation or infrastructure package that should sit behind an interface, high visibility is a warning sign: the public surface area is larger than callers actually need, which means more coupling and less freedom to refactor.
low_value_means: |
  Low relative visibility means the package hides most of its internals. That is the right design for implementation packages and concrete services. For a pure API package built around interfaces, abnormally low visibility might mean abstractions are not being published. More often, low visibility is simply correct — packages that do something concrete tend to keep their types internal by design.
do_not_overinterpret: |
  Relative visibility does not tell you whether your public API is well designed, only how much of it is exposed. A package can have low visibility and still expose the wrong things. A package can have high visibility and still be a clean, intentional API boundary. Read it alongside fan-in: a high-visibility package with no dependents is a missed encapsulation opportunity; a high-visibility package with many dependents is a potential refactoring risk.
where_shown: |
  As a heatmap colour overlay on the Topology Graph, Package Matrix, and Composition view. As a bubble dimension in the Subsystems view using the Visibility Surface preset. In the Metrics sidebar when any package is selected.
related_lenses:
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
  - composition
formula: |
  RV = public elements / total elements, where elements includes types (classes, interfaces, enums, annotations, records) and their members. AtlasArc computes this via PSI type inspection across all source files in the package.
---

Body content is not used for structured pages.
