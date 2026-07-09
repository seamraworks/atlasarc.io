---
title: Hard-to-change packages
slug: hard-to-change-packages
seo_title: Find Hard-to-Change Packages in IntelliJ IDEA | AtlasArc Workflow
seo_description: Use AtlasArc to identify packages where even small changes cause outsized ripple effects through the codebase — complexity meets coupling.
problem: |
  You open a ticket that says "change the return type of one method." Two hours later you have touched eleven files and broken four tests in packages you had never heard of before. You look at the package you started with, and realise: it is not a complicated class, but it has 25 incoming dependencies. The method you changed was called by things calling things. The package you changed is the structural problem. The complexity inside it is just the symptom that made it hard to find the right place to make the change.
why_it_matters: |
  The packages that slow down a team are not always the most complex ones. A complex package that nothing depends on can be refactored on its own timeline. A simple but heavily depended-on package is constrained by its callers. The genuinely hard-to-change packages are where both problems collide: high fan-in from callers who cannot be notified easily, and enough internal complexity that even finding the right place to make a change takes meaningful effort. These are the packages worth investing in before a major feature push.
lens: Hotspots
steps:
  - heading: Open Hotspots.
    body: Switch to the Hotspots bubble chart. Instability is on the X axis, complexity (cyclomatic) is on the Y axis. Bubble size encodes class count.
  - heading: Look for large bubbles in the upper-left.
    body: Packages with high complexity (upper Y range) and low instability (left X range) combine internal difficulty with external coupling. They are stable because many callers depend on them, but complex enough that changes require real understanding before touching.
  - heading: Click any candidate and check the sidebar.
    body: Click a bubble to see fan-in, cyclomatic complexity max and average, and cognitive complexity in the sidebar. Fan-in tells you how many callers will be affected by a change. Complexity max tells you how difficult the hardest method is.
  - heading: Drill into class mode.
    body: Click through to class mode inside the package to see which specific classes carry the highest complexity. Often one or two classes account for most of the complexity while the rest of the package is simple. That tells you where the work will actually be.
interpretation: |
  The risk is not high fan-in alone or high complexity alone. A complex package that nobody depends on can be refactored in isolation. A simple package with high fan-in just needs a clean API contract maintained. The hard-to-change packages are where complexity meets coupling: everything depends on them, and they are hard to understand inside. Reducing the coupling first (by introducing an interface and reducing the number of callers importing the concrete class) is usually cheaper than reducing the internal complexity first, because it limits the blast radius of future changes.
export_note: |
  Export the class-level Hotspots view as PNG to document which specific classes inside the package carry the highest complexity load. This is useful for communicating targeted refactoring scope in planning sessions.
metrics:
  - fan-in-fan-out
  - cyclomatic-complexity
related_metrics:
  - fan-in-fan-out
  - cyclomatic-complexity
related_docs:
  - lenses
related_workflows:
  - complexity-hotspots
  - ticking-time-bombs
  - zone-of-pain
  - identify-hotspots
---

Body content is not used for structured pages — section content lives in the
front-matter fields above and is rendered through the workflow-page template.
