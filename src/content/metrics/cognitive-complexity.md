---
title: Cognitive complexity
slug: cognitive-complexity
seo_title: Cognitive Complexity (CogC) | Software Architecture Metrics | AtlasArc
seo_description: Cognitive complexity measures how hard code is to read, penalizing nesting and flow-breaking constructs beyond what cyclomatic complexity captures. Learn to interpret CogC in AtlasArc.
aliases:
  - CogC max
  - CogC avg
  - CogC
what_it_is: |
  Cognitive complexity measures how hard code is to read, designed to capture what cyclomatic complexity misses: nested structures, breaks in control flow, and recursive patterns. Each level of nesting adds a penalty on top of the basic increment for a branching construct. A deeply nested if-inside-while-inside-try scores much higher than three sequential if statements at the same indentation level, even if cyclomatic complexity rates them the same. AtlasArc tracks CogC max (worst method in the package or class) and CogC avg (mean across methods, class-count weighted at the package level).
why_it_matters: |
  Cyclomatic complexity counts paths; cognitive complexity captures the actual mental effort of reading the code. These can diverge significantly. A large switch statement with flat cases scores high cyclomatic complexity but moderate cognitive complexity. A set of nested loops with breaks and continues scores moderate cyclomatic complexity but very high cognitive complexity. CogC correlates more closely with the time a developer spends understanding a method before they can safely change it.
high_value_means: |
  High CogC max means the package has at least one method that is genuinely hard to read: deeply nested, heavily branched, or full of early exits and flow breaks. High CogC avg means that reading difficulty is widespread across the package, not isolated to one outlier. Either way, these are strong candidates for decomposition — extracting conditions into well-named helpers, flattening guard clauses, or replacing nested logic with polymorphism.
low_value_means: |
  Low cognitive complexity means the code is easy to follow. Functions are short, branching is shallow, and control flow is predictable. This is the most maintainable state. Low CogC alongside low cyclomatic complexity is doubly reassuring. Low CogC alongside high cyclomatic complexity means the branching is flat and parallel rather than deeply nested — a better structure even if the raw path count is high.
do_not_overinterpret: |
  Cognitive complexity is based on SonarSource's heuristic and is a better proxy for readability than cyclomatic complexity, but it is still a proxy. Some high-CogC code is intrinsically complex by nature of the problem: a state machine or parser will score high regardless of how well it is written. Read CogC alongside class count and lines of code. A single large class driving the package's CogC is a targeted problem; complexity distributed across many classes is a cultural one.
where_shown: |
  CogC max in the Hotspots bubble chart as an optional Y axis. Both CogC max and CogC avg as heatmap colour overlays on the Topology Graph, Package Matrix, and Composition view. CogC max in the Subsystems bubble chart. CogC max and CogC avg in the Metrics sidebar when any package or class is selected.
related_lenses:
  - hotspots
  - subsystems
  - topology-graph
  - package-matrix
  - composition
formula: |
  Cognitive complexity assigns a base increment for each flow-breaking construct (if, else if, else, while, for, do, switch, catch, break, continue, recursion) and additional nesting penalties for each level of nesting depth at the point where the construct appears. AtlasArc follows the SonarSource cognitive complexity specification.
---

Body content is not used for structured pages.
