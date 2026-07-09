---
title: Cyclomatic complexity
slug: cyclomatic-complexity
seo_title: Cyclomatic Complexity (CC) | Software Architecture Metrics | AtlasArc
seo_description: Cyclomatic complexity counts independent control-flow paths through a method. Learn how to interpret CC max and CC avg in AtlasArc for Java, Kotlin, and TypeScript projects.
aliases:
  - CC max
  - CC avg
  - CC
what_it_is: |
  Cyclomatic complexity counts the number of independent paths through a method's control flow. Each conditional branch (if, else if, while, for, catch, case, ternary) adds one to the count. A method with no branches has a cyclomatic complexity of 1. A method with five branches has a cyclomatic complexity of 6. AtlasArc tracks two variants: CC max (the worst method in the package or class) and CC avg (the mean across all scanned methods, class-count weighted at the package level).
why_it_matters: |
  Methods with high cyclomatic complexity are hard to test completely, because each independent path requires at least one test case to exercise it. They are also harder to read and modify without introducing bugs. At the package level, CC max tells you whether the package contains at least one genuinely risky method; CC avg tells you how widespread the complexity problem is. A package with low CC avg and high CC max has one outlier class, which points to a targeted refactor. A package with high CC avg has structural complexity spread throughout.
high_value_means: |
  High CC max means at least one method in the package has a large number of control-flow paths. Values above 10 are worth investigating; values above 20 are a strong signal that the method should be decomposed. High CC avg means most methods in the package carry meaningful branching complexity. Both can also indicate defensive programming patterns, heavy switch statements, or business logic encoded directly in method bodies rather than dispatched through a design pattern.
low_value_means: |
  Low CC max and CC avg mean the methods in this package are simple and straightforward. That is the target state for most packages. Utility methods, data classes, and pure functions naturally have low cyclomatic complexity. A service or business logic package with uniformly low complexity is worth examining to make sure the complexity has not been pushed elsewhere: into a caller, into a data structure, or into a deep conditional inside a test.
do_not_overinterpret: |
  Cyclomatic complexity is a method-level metric aggregated to the package level. A high package-level value does not mean the package design is wrong; it may mean the package contains one complex parser, validator, or decision engine whose complexity is inherent to the problem. Read it alongside class count and lines of code: a complex package with one large class is a different problem than a complex package with fifty medium-sized classes.
where_shown: |
  CC max in the Hotspots bubble chart as an optional Y axis. Both CC max and CC avg as heatmap colour overlays on the Topology Graph, Package Matrix, and Composition view. CC max in the Subsystems bubble chart. CC max and CC avg in the Metrics sidebar when any package or class is selected.
related_lenses:
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
  - composition
formula: |
  Cyclomatic complexity per method = number of binary decisions (if, else if, for, while, do, case, catch, ternary, &&, ||) plus 1. CC max = highest per-method value in the package or class. CC avg = mean cyclomatic complexity across all scanned methods, weighted by class count when rolled up from class level to package level.
---

Body content is not used for structured pages.
