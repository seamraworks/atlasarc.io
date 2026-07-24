---
title: Manual coverage heatmap review
slug: manual-coverage-heatmap-review
seo_title: Review Test Coverage Against Architecture in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to load a coverage report and find which load-bearing packages the test suite is not exercising, with coverage shown in architectural context.
problem: |
  The project coverage report says 74 percent. Fine. But 74 percent of what? You have no idea whether the tested 74 percent includes the packages that everything else depends on, or whether it is the leaf adapters and entry points that happen to be easy to instrument. A coverage number without architectural context is a false sense of security.
why_it_matters: |
  Coverage matters most where the code matters most. A package with 90 percent line coverage and no callers is low risk. If something breaks there, nothing else breaks with it. A package with 30 percent line coverage and 15 callers is high risk. There is code the test suite is not exercising, and 15 other packages depend on that code. The coverage number the CI server reports obscures this difference entirely. Overlaying coverage on the architecture graph surfaces the gaps that actually matter.
lens: the Topology Graph with the coverage heatmap enabled
steps:
  - heading: Load a coverage report.
    body: Load JaCoCo XML for a Java or Kotlin analysis, or LCOV after a TypeScript graph is loaded. AtlasArc associates matching coverage with the current architecture model. Use a report with branch records when you also want Branch Coverage.
  - heading: Switch to the Topology Graph.
    body: Open the Topology Graph. The graph shows your full package dependency structure.
  - heading: Enable the line coverage heatmap.
    body: Apply the line coverage heatmap overlay. Packages with low line coverage appear in the warning colour. The heatmap intensity shows coverage percentage. The more saturated, the less covered.
  - heading: Identify high-risk gaps.
    body: Look for packages that are both low-coverage (saturated warning colour) and high fan-in (many incoming arrows). These are the highest-priority coverage gaps, packages the test suite is not exercising that everything else depends on.
  - heading: Switch to branch coverage for decision coverage.
    body: Apply the branch coverage heatmap as a second pass. Branch coverage reveals whether conditional logic is tested, not only whether lines were executed. A package with decent line coverage but poor branch coverage has tested the happy path but not the error conditions.
interpretation: |
  Coverage in isolation is a poor signal. Coverage in architectural context is actionable. A package with 30 percent line coverage and fan-in of 15 means fifteen callers depend on code the test suite is not exercising. That code needs tests before any refactoring sprint because the risk of breaking callers is too high without a safety net. A package with 30 percent coverage and fan-in of 0 is a local problem you can address when you work in that area without urgency. The workflow produces a ranked list of coverage gaps by architectural risk: highest fan-in first, then coverage percentage to break ties.
export_note: |
  Export the Topology Graph as PNG with the line coverage heatmap active. The export captures the coverage distribution in the context of the dependency structure, which is far more informative than a flat coverage percentage for communication with stakeholders or planning test investment.
metrics:
  - line-branch-coverage
related_metrics:
  - line-branch-coverage
related_docs:
  - lenses
related_workflows:
  - complex-code-weak-coverage
  - identify-hotspots
  - complexity-hotspots
  - audit-a-subsystem
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
