---
title: Method count
slug: method-count
seo_title: Method Count | Software Architecture Metrics | AtlasArc
seo_description: Method count measures the number of methods on a class — a class-level size and responsibility indicator surfaced in Hotspots and Composition views.
aliases:
  - methods
what_it_is: |
  Method count is the number of methods declared on a class. It is the class-level equivalent of lines of code for responsibility assessment: a class with one method and a class with sixty methods are very different things to reason about, regardless of how many lines each method contains. AtlasArc surfaces method count in the class-level bubble view inside Hotspots and Composition when you drill down past the package level.
why_it_matters: |
  The single responsibility principle says a class should do one thing. Method count is a quick smell test for how well that principle is holding. Classes with very high method counts have usually accumulated responsibilities over time. The higher the count, the more likely the class is doing several distinct things that could be separated and tested independently. Method count is also a rough proxy for cognitive load: reading a forty-method class to understand what it does takes longer than reading a ten-method class.
high_value_means: |
  High method count is a strong indicator that the class has multiple responsibilities and is a candidate for decomposition. It also means any method on the class interacts with a large surface area of other methods and private state, which raises the chance of hidden side effects during refactoring. Classes with high method count and high fan-in are the highest-priority candidates for interface extraction and decomposition.
low_value_means: |
  Low method count means the class is small and focused. Utility classes, value objects, and single-responsibility services naturally have few methods. A class with very few methods and high cyclomatic complexity per method has the opposite problem: not too many methods, but the logic is concentrated. That is sometimes appropriate, but worth checking.
do_not_overinterpret: |
  Method count is meaningful at the class level where it is shown, not as a rolled-up package aggregate. A package with many small focused classes will show a large total method count at the package level while each individual class is perfectly reasonable. Always interpret method count in the class view inside Hotspots or Composition, not as a summary statistic for the package as a whole.
where_shown: |
  As bubble size in the Hotspots class-level view when drilling past the package level. As a size dimension in the Composition class-level view. In the Metrics sidebar when a class node is selected.
related_lenses:
  - hotspots
  - composition
formula: |
  Method count = number of declared methods on the class, including private, package-private, protected, and public methods. Static and instance methods both count. Constructors are excluded. AtlasArc counts via PSI method inspection on each scanned source file.
---

Body content is not used for structured pages.
