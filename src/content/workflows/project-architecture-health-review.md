---
title: Project architecture health review
slug: project-architecture-health-review
seo_title: Project Architecture Health Review | AtlasArc Workflow
seo_description: Use AtlasArc to get a project-level structural summary suitable for a team retrospective or technical debt planning session.
problem: |
  It is the quarterly architecture review. Someone asks: "Is the codebase getting better or worse?" Last quarter you shrugged and said something about technical debt. This quarter you want to show a number. Not a subjective rating from 1 to 10. A metric that reflects the actual structural state of the project, is reproducible next quarter, and is comparable to this quarter's baseline.
why_it_matters: |
  Teams that measure architecture health can have better conversations about it. "The normalised coupling value went from 1.4 to 1.6 this quarter" is a fact that leads somewhere: what decisions drove that? Was it worth it? "The codebase feels worse" does not lead anywhere useful. Project-level metrics do not tell you what to fix, but they tell you whether the cumulative effect of the team's decisions is moving in the right direction.
lens: the project stats bar and Architecture Audit Reports
steps:
  - heading: Open the project stats bar.
    body: "The project stats bar at the top of any lens view shows the project-level summary metrics: normalised coupling density and average relative visibility among others. These are the numbers you will track across quarters."
  - heading: Note the normalised coupling value.
    body: Record the normalised cumulative component dependency value from the stats bar. This metric summarises the overall dependency density of the project in a size-normalised way. A value below 1.0 indicates a relatively flat coupling structure; values above 1.5 indicate a codebase where dependencies accumulate significantly.
  - heading: Note the average visibility metric.
    body: Record the average relative visibility. This tracks how much of the codebase is publicly visible on average. Rising values across quarters indicate that packages are exposing more of their internal surface than they used to, usually a sign of accidental API surface accumulation.
  - heading: Generate an Architecture Audit Report.
    body: Generate an Architecture Audit Report with Global Architecture selected. Use the HTML report to browse the sections, and use the Printable Version when you need a PDF or meeting packet. Save the report with a date-stamped folder name so it can be compared to the previous quarter's report.
  - heading: Compare to last quarter.
    body: Open the previous quarter's report alongside the current one. Compare the normalised coupling value and average visibility. Any trend that has been moving in the same direction for two or more consecutive quarters is a signal worth discussing in the retrospective.
interpretation: |
  The normalised coupling metric summarises overall dependency density in a way that is comparable across projects and across time. A rising value over consecutive quarters means the codebase is becoming more coupled. It does not tell you which packages are the problem; that is what Hotspots and the boundary audits are for. But it tells you the net direction. The average visibility metric tracks public surface area trends: a rising average means packages are exposing more of themselves on average, which usually signals accidental leakage growing faster than intentional API surface. Both metrics taken together give you a two-dimensional health check: coupling density (are we getting more tangled?) and visibility (are we getting leakier?). A project improving on both is in good shape structurally.
export_note: |
  The Architecture Audit Report is the primary export for this workflow. It records the project baseline from the analysis model: overview metrics, governance context, cycle evidence, and the focused sections you selected. Store the HTML folder or printed PDF in the team's architectural documentation with a date stamp for longitudinal comparison.
metrics:
  - relative-visibility
related_metrics:
  - relative-visibility
related_docs:
  - lenses
related_workflows:
  - identify-hotspots
  - understand-subsystem-coupling
  - audit-a-subsystem
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
