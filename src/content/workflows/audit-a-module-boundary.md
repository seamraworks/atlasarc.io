---
title: Audit a module boundary
slug: audit-a-module-boundary
seo_title: Audit a Module Boundary in IntelliJ IDEA | AtlasArc Workflow
seo_description: Use AtlasArc to get a thorough structural view of one module, including what flows in, what flows out, cycles inside, and how cohesive the internals are.
problem: |
  You own a module and someone asks for an architecture health report. Not "how is it going." An actual report. How many packages? How many internal cycles? What is the boundary instability? Is cohesion growing or declining? You want numbers, not impressions, and you want to be able to repeat the same check in three months to see whether things changed.
why_it_matters: |
  Module boundaries are the architectural commitments a team makes about what belongs together and how it interacts with the outside. Without periodic audits, those boundaries quietly erode: internal packages grow external callers, internal cycles accumulate, and the boundary instability shifts in ways nobody intended. Auditing on a regular cadence gives the team a feedback loop and a set of numbers to point to when making decisions about what to refactor next.
lens: Subsystems
steps:
  - heading: Set the module root as the architectural focus.
    body: Right-click the module root package in the Topology Graph and set it as Root. This scopes all lenses to the module boundary.
  - heading: Switch to Subsystems.
    body: Open the Subsystems lens. The boundary risk view shows the module's outgoing (fan-out) and incoming (fan-in) coupling at the boundary level. This tells you whether the module provides more than it consumes, or the other way around.
  - heading: Check internal tangles.
    body: Switch to the internal tangles view in Subsystems. The cycle-group count and largest cycle size for packages inside the module are your primary debt indicators. A module with zero internal cycles is well-structured at the dependency level. A module with many small cycles is accumulating them; a module with one large cycle has a structural tangle that will resist change.
  - heading: Review cohesion in the sidebar.
    body: The cohesion metric in the sidebar measures how connected the internal packages are relative to boundary packages. High cohesion means the module's packages depend on each other more than they depend on external packages, which is what you want. Declining cohesion across quarters means the module is growing outward dependencies faster than internal ones.
  - heading: Check for boundary leaks.
    body: Open the module with Pin subject · Boundary matrix. The Matrix keeps the module as the subject while showing outside boundary neighbours, so you can spot internal implementation packages with external callers. Document any leaks found; these are boundary erosion events that should appear in the health report.
interpretation: |
  A healthy module has boundary fan-in greater than fan-out (it provides more than it consumes), zero or declining internal cycles, and cohesion above 0.5. Cohesion below 0.5 means more than half of the internal dependencies cross subpackage boundaries, which usually means packages were grouped by accident rather than by design. A module with growing fan-out and declining cohesion is expanding outward faster than it is consolidating internally. That is the early signal of a module boundary that is starting to blur.
export_note: |
  Generate an Architecture Audit Report with the module set as root and the boundary evidence selected. The report records ingress, egress, internal cycle evidence, and the metrics behind the boundary review, making it easy to share the audit results with the team and compare against previous quarters.
metrics:
  - fan-in-fan-out
  - instability-abstractness
  - cyclic-dependencies
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
  - cyclic-dependencies
related_docs:
  - lenses
related_workflows:
  - audit-a-subsystem
  - review-package-boundaries
  - find-cycles
  - find-accidental-boundary-leaks
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
