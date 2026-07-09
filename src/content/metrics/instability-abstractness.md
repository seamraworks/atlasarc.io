---
title: Instability and abstractness
slug: instability-abstractness
seo_title: Instability and Abstractness | Software Architecture Metrics | AtlasArc
seo_description: Learn how to interpret instability, abstractness, and distance from the main sequence in AtlasArc for Java and Kotlin projects.
aliases:
  - distance from the main sequence (D)
  - stable abstractions principle
  - zone of pain
  - zone of uselessness
what_it_is: |
  Instability measures how free a package is to change. A package that lots of other packages depend on is stable: changing it is expensive and risky. A package that depends on lots of others but nothing depends on it is unstable: changing it is cheap. Abstractness measures how much of the package is interface rather than implementation. The insight from Robert Martin's work on package design is that these two should balance each other. Packages that are heavily depended on should be mostly abstract, so their internals can change without forcing everyone else to change. Packages that are free to change can afford to be concrete. When they don't balance, you get problems with names.
why_it_matters: |
  The "zone of pain" is a real thing. Imagine a package that half your codebase imports. It's stable whether you like it or not. But it has no interfaces, no abstractions. Every internal detail is visible to its consumers. You can't change anything inside it without risking a ripple across the entire dependency tree. That's not a theoretical concern. It's the kind of thing that makes refactoring feel impossible and pushes developers toward copy-paste instead of reuse.
high_value_means: |
  High instability (near 1) means this package has few or no dependents and imports many others. That's typical of leaf and application-layer packages. Changes here rarely cascade outward. High abstractness (near 1) means most types are abstract, which is expected for shared interface packages but suspicious in an application layer that should be concrete. High distance (near 1) means the package is far from the ideal balance: either in the zone of pain (stable and concrete) or the zone of uselessness (abstract but with no dependents).
low_value_means: |
  Low instability (near 0) means many packages depend on this one and it depends on few. That's a maximally stable package, desirable for core domain abstractions. Low abstractness (near 0) means all types are concrete, which is fine for unstable application-layer packages but a liability for widely-depended-on packages that should be hiding their implementation details. Low distance (near 0) means the package is close to the main sequence and well-balanced.
do_not_overinterpret: |
  The main sequence is a heuristic, not a law. Utility packages are legitimately stable and concrete: they have no abstractions by design, and that's fine. Test packages are legitimately unstable and concrete. The model earns its keep for architectural-layer packages, domain, service, infrastructure, persistence, where the principle reflects real design intent. For purely technical support packages, the numbers will look alarming and mean nothing.
where_shown: |
  In the Hotspots bubble chart with instability on the X axis and distance-from-main-sequence as colour intensity. In the sidebar when any package is selected (Metrics tab, Instability / Abstractness / Distance section). As colour overlay options in the Topology Graph heatmap (Instability heatmap, Distance heatmap, Abstractness heatmap). In exported CSV data from the Subsystems lens with Boundary Risk or Complexity Load presets.
related_lenses:
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
  - composition
formula: |
  Instability I = Ce / (Ca + Ce), clamped to [0, 1]. Abstractness A = Nₐ / Nₜ where Nₐ = number of abstract types (interfaces and abstract classes) and Nₜ = total types in the package. Distance D = |A + I − 1|, clamped to [0, 1]. AtlasArc computes I and D via ArchUnit's metric API and A via PSI type inspection of the project's source model.
---

Body content is not used for structured pages.
