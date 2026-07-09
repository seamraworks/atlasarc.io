---
title: Audit a subsystem
slug: audit-a-subsystem
seo_title: Audit a Subsystem's Structural Health | AtlasArc Workflow
seo_description: Use AtlasArc to get a complete structural health snapshot of one subsystem, covering size, complexity, visibility, stability, and coverage gaps in one session.
problem: |
  A team asks: "Is our subsystem getting better or worse?" You need more than instinct. You need a repeatable set of numbers you can check every quarter and compare to last time. Not because the numbers tell the whole story, but because without them the conversation degrades into opinions: "it feels cleaner," "I think the debt is coming down," "I'm not sure, we've been busy." Numbers give the conversation a starting point.
why_it_matters: |
  Structural debt in a subsystem accumulates below the level of individual code reviews. No single pull request causes a cohesion problem. No single commit adds a cycle group. The signals are trends across sprints: LOC growing faster than class count, boundary fan-out increasing each quarter, internal cycles not declining. A quarterly audit that takes 30 minutes to run is the feedback loop that tells you whether the decisions made in daily development are adding up to something better or worse.
lens: Subsystems
steps:
  - heading: Set the subsystem as the architectural focus.
    body: Right-click the subsystem root in the Topology Graph and set it as Root. This scopes all lenses to the subsystem boundary.
  - heading: Check size in the sidebar.
    body: Open the Metrics sidebar and note class count and lines of code. These are your baseline size metrics. Compare against the previous quarter if you have a record.
  - heading: Review boundary metrics in Subsystems.
    body: Switch to Subsystems and check the boundary risk view. Note boundary fan-in and fan-out. A healthy subsystem provides more than it consumes (fan-in greater than fan-out). If fan-out is rising quarter-over-quarter, the subsystem is taking on more external dependencies.
  - heading: Check complexity distribution in Hotspots.
    body: Switch to Hotspots. Look at the overall complexity distribution across packages inside the subsystem. Identify any packages with high CC max; these are the complexity concentrations worth drilling into.
  - heading: Check visibility in Composition.
    body: Switch to Composition and enable the relative visibility heatmap. Packages with high relative visibility are exposing a large share of their surface. For implementation packages, this usually means accidental API surface that has grown over time.
  - heading: Check coverage if a JaCoCo report is loaded.
    body: If a JaCoCo report has been loaded into AtlasArc, enable the coverage heatmap on the Topology Graph. Packages with low line or branch coverage and high fan-in are the highest-risk gap because the test suite is not exercising code that other packages depend on.
interpretation: |
  A healthy subsystem shows LOC and class count within the team's expected growth range, relative visibility below 0.5 for implementation packages (meaning less than half the internal surface is exposed), internal cycle count at zero or declining, and test coverage concentrated in the packages with highest fan-in. A subsystem that is growing across all size metrics, gaining boundary fan-out each quarter, adding internal cycles, and has coverage concentrated in low-fan-in packages is accruing structural debt faster than it is being paid down. The specific metrics to watch most closely are the ones that are trending, not the ones that are high. A stable high value is a known constraint. A rising value is an uncontrolled one.
export_note: |
  Generate an Architecture Audit Report with the subsystem set as root and Subject Audit selected. Use the HTML report to browse the focused evidence, and use the Printable Version when you need a PDF or meeting packet. Save the report with a date-stamped folder name. Comparing two reports from different quarters is more informative than any single-point-in-time number.
metrics:
  - instability-abstractness
  - relative-visibility
  - cyclomatic-complexity
  - cognitive-complexity
  - class-count
  - lines-of-code
  - method-count
related_metrics:
  - instability-abstractness
  - relative-visibility
  - cyclomatic-complexity
  - cognitive-complexity
  - class-count
  - lines-of-code
  - method-count
related_docs:
  - lenses
related_workflows:
  - understand-subsystem-coupling
  - audit-a-module-boundary
  - complexity-hotspots
  - manual-coverage-heatmap-review
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
