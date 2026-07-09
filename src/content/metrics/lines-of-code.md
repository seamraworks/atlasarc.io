---
title: Lines of code
slug: lines-of-code
seo_title: Lines of Code (LOC) | Software Architecture Metrics | AtlasArc
seo_description: Lines of code measures the source line count of a package or class, the raw code-mass indicator. Learn how to use LOC in AtlasArc for Java, Kotlin, and TypeScript projects.
aliases:
  - LOC
  - lines
what_it_is: |
  Lines of code is the count of non-blank, non-comment source lines in a package, class, or subtree. It measures raw code mass. It is the least subtle metric in the set and one of the most useful for orientation. When you open an unfamiliar codebase and want to know where the weight is, LOC is the first number to look at.
why_it_matters: |
  Packages with very high LOC often carry a disproportionate share of the maintenance burden. They take longer to review, longer to build mental models of, and they accumulate bugs in corners nobody fully understands. LOC also helps contextualize other metrics: a package with high cyclomatic complexity but low LOC has concentrated complexity in a small body of code. The same complexity spread across thousands of lines is a different, wider problem.
high_value_means: |
  High LOC means the package or class is large by source volume. In some packages that is expected: a comprehensive library, a generated file, or a large domain model. In most packages, high LOC combined with high fan-in signals that the package has become a load-bearing wall. Too much depends on it and it has grown to match. Classes with individually high LOC are usually the more actionable finding.
low_value_means: |
  Low LOC means the package is small. Single-responsibility packages with a narrow scope naturally have low LOC. The exception is a package with very low LOC but high fan-in or high coupling: something small is carrying a disproportionate architectural load, which can make even minor changes unexpectedly risky.
do_not_overinterpret: |
  LOC is the crudest metric in the set and should rarely be used alone. It does not distinguish between dense, sophisticated code and sprawling, repetitive code. It does not account for generated files or test code mixed in with production code. Use LOC as a proxy for mass: where to look and roughly how much is there, not as a proxy for quality or complexity.
where_shown: |
  As an optional area-encoding dimension in the Composition view alongside class count. As a heatmap overlay on the Topology Graph, Package Matrix, and Composition view. In the Metrics sidebar when any package is selected.
related_lenses:
  - composition
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
formula: |
  LOC = non-blank, non-comment source lines in the package's source files. AtlasArc counts physical source lines via PSI scanning of the project source model. Comment lines and blank lines are excluded.
---

Body content is not used for structured pages.
