---
title: Class count
slug: class-count
seo_title: Class Count (Types) | Software Architecture Metrics | AtlasArc
seo_description: Class count measures the number of declared types in a package, the primary code-mass metric for structural size. Learn how to interpret it in AtlasArc.
aliases:
  - types
  - type count
what_it_is: |
  Class count is the number of declared types in a package: classes, interfaces, enums, annotations, and records. It is the most direct measure of a package's structural mass. A package with one class and a package with fifty classes are very different things to read, reason about, and refactor, even when other metrics look similar.
why_it_matters: |
  Class count correlates with cognitive load. Packages that have grown large without deliberate decomposition tend to accumulate responsibilities alongside their types. When you are trying to extract a module, move a service, or understand an unfamiliar codebase, class count is the fastest way to identify which packages will take an afternoon versus which will take a week.
high_value_means: |
  High class count means the package is structurally large. That may be appropriate for a domain model, a comprehensive utility library, or generated code. It may also mean the package was never decomposed and is holding multiple responsibilities by accident. Compare with fan-in: a large package with high fan-in is a shared foundation many others depend on; a large package with low fan-in may have grown without a clear design reason.
low_value_means: |
  Low class count means the package is small and focused: a few types with a clear, narrow purpose. That is often the right shape. Utility classes, single-responsibility services, and integration adapters naturally have low class counts. A low class count alongside high cyclomatic complexity or coupling is a flag: the types are few but individually complicated.
do_not_overinterpret: |
  Class count is a size metric, not a quality metric. A highly focused, well-abstracted package with thirty types is better than a package with one class that has three hundred methods. Use class count to orient yourself and to identify where decomposition conversations are worth having, not to grade package quality directly.
where_shown: |
  As bubble area in the Composition view (treemap, sunburst, and circle pack) where area encodes class count by default. As a size dimension in the Hotspots and Subsystems views. As a heatmap overlay option on the Topology Graph and Package Matrix. In the Metrics sidebar when any package is selected.
related_lenses:
  - composition
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
formula: |
  Class count = number of top-level and nested declared types in the package's source files, including classes, interfaces, enums, annotations, and records. Anonymous inner types are excluded. AtlasArc counts via PSI type inspection of the project source model.
---

Body content is not used for structured pages.
