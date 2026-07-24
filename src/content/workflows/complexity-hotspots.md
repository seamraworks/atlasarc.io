---
title: Complexity hotspots
slug: complexity-hotspots
seo_title: Find Complexity Hotspots at the Class Level | AtlasArc Workflow
seo_description: Use AtlasArc to drill below package averages and find the specific classes and methods where reading difficulty actually concentrates.
problem: |
  The package metric looks fine. Average cyclomatic complexity of 3.2. But inside that package there is a class with a method that has cyclomatic complexity of 47, six levels of nesting, three early returns, and a comment that says "do not touch." The average is hiding the real problem. You would never know it was there if you only looked at the package-level summary.
why_it_matters: |
  Complexity averages lie. A package with 20 simple methods and one profoundly complex method has a low average but a very high maximum. The single outlier method is where bugs hide, where reviews slow down, where new developers spend hours trying to understand what should be a 15-minute context switch. Finding these outliers at the class and method level is the difference between a refactoring plan that targets the right code and one that averages its way into irrelevance.
lens: Hotspots
steps:
  - heading: Open the Hotspots bubble chart at package level.
    body: Switch to Hotspots. Each bubble represents a package. Look for packages with elevated complexity on the Y axis; these are the packages with enough internal complexity to be worth drilling into.
  - heading: Drill into the package, then switch to Classes.
    body: Double-click any package bubble to drill into that package, making it the Current Focus, then switch Item to Classes. The bubbles now represent individual classes within the package. Bubble size encodes method count; position encodes complexity.
  - heading: Identify the outlier classes.
    body: Look for class bubbles in the upper area of the chart (high complexity) that are also large (many methods). These are the classes with both broad surface area and high internal difficulty. Click any class to see its CC max, CC avg, cognitive complexity max, and cognitive complexity average in the sidebar.
  - heading: Navigate to the class in the IDE.
    body: Double-click the class bubble, or use the sidebar after selecting it, to navigate directly to the class in the IDE. Use the complexity values to identify which method is the outlier, usually the one with CC max that is far above the class average.
interpretation: |
  CC max is the signal that cuts through averages. A package with CC avg of 3 and CC max of 47 has one method that is a significant outlier. When you find it, you usually find the bug history too: it is the method that has had the most incidents, the most unrelated fixes folded in, the most "this is a special case" comments. Cognitive complexity is a better proxy for reading difficulty than cyclomatic complexity alone: a method with high CC may have many paths but be easy to follow (a long switch statement, for example), while a method with high cognitive complexity is the one that causes readers to stop and re-read multiple times. Prioritise cognitive complexity when deciding what to refactor first.
export_note: |
  Export the class-level Hotspots view as PNG. The export shows the complexity distribution at the class level, which is useful for code review planning or for communicating refactoring scope in a sprint retrospective.
metrics:
  - fan-in-fan-out
  - cyclomatic-complexity
  - cognitive-complexity
  - method-count
related_metrics:
  - fan-in-fan-out
  - cyclomatic-complexity
  - cognitive-complexity
  - method-count
related_docs:
  - lenses
related_workflows:
  - complex-code-weak-coverage
  - hard-to-change-packages
  - ticking-time-bombs
  - audit-a-subsystem
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
