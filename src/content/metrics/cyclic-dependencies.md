---
title: Cyclic dependencies
slug: cyclic-dependencies
seo_title: Cyclic Dependencies | Software Architecture Metrics | AtlasArc
seo_description: Learn what cyclic package dependencies are, why they matter, and how to interpret them in AtlasArc for Java, Kotlin, and TypeScript projects.
aliases:
  - strongly connected components (SCCs)
  - dependency cycles
  - circular dependencies
what_it_is: |
  A cyclic dependency is a dependency loop: package A imports B, B imports C, and C imports A. None of those three packages can be understood, compiled, or extracted without bringing the others along. AtlasArc counts the number of distinct cycle groups in your project: each group is a cluster of mutually entangled packages that behave, for all practical purposes, as one.
why_it_matters: |
  Imagine you want to pull your domain layer into a shared library. Clean idea. You start extracting it and then discover it imports from your persistence layer. The persistence layer imports from your service layer. The service layer imports from domain. The extraction that was supposed to take a day now touches half the codebase, and you haven't written a single line of new code yet. That's what unchecked cycles cost. They don't cause problems the day someone adds the import. They cause problems the day you try to move anything.
high_value_means: |
  Many cycle groups detected means significant architectural entanglement. The codebase has dependency paths that loop back on themselves, indicating the package structure no longer reflects the intended design layering. The higher the count, the broader the entanglement and the harder it becomes to reason about which packages are truly independent.
low_value_means: |
  Zero is the target. A reading of zero means no package depends (directly or transitively) on another package that ultimately depends back on it. This is a necessary condition for a clean, layered architecture: packages can be understood, tested, and deployed in isolation.
do_not_overinterpret: |
  A cycle count of 3 in a project of 200 packages is not the same catastrophe as a cycle count of 3 in a project of 20. And not every cycle deserves the same urgency. Two sub-packages of the same domain model that reference each other are a much smaller problem than a cycle that reaches from domain all the way into infrastructure. Before you raise an incident, check whether the cycle crosses layer boundaries and how many packages are in the group. Some cycles are also genuinely intentional: two packages that are always deployed together and always changed together. Record those durable team decisions as Intentional repository governance so the coupling stays structurally visible and receives the same treatment in the IDE and CI. Use a Safe Haven only to set local noise aside for the current investigation.
where_shown: |
  In the Topology Graph when the Cycles section is enabled, cycle groups are highlighted and each node shows its group number. The metrics bar at the top of every graph view always shows the headline cycle-group count. The sidebar drill-down shows group membership, cycle depth, and the dependency edges forming the loop. Subsystem-level cycle presence is also reported in the Metrics panel for any selected folder node.
related_lenses:
  - topology-graph
  - package-matrix
  - subsystems
  - hotspots
formula: |
  AtlasArc uses ArchUnit's cycle detection to enumerate strongly-connected components (SCCs) in the package dependency graph. A strongly-connected component of size > 1 is a cycle group. The reported metric is the count of such groups. Cycle depth is the length of the shortest loop within each group.
---

Body content is not used for structured pages.
