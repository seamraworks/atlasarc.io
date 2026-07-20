---
title: Audit individual cycle groups
slug: audit-individual-cycle-groups
seo_title: Audit Individual Cycle Groups in IntelliJ IDEA | AtlasArc Workflow
seo_description: Use AtlasArc to step through every dependency cycle group one at a time, classify each one, and decide what to do before the sprint ends.
problem: |
  You ran the cycle finder and got 23 groups. Some are two packages. One has twelve. You need to go through them in order from easiest to hardest and make a call on each one before the sprint ends. You do not need to fix all of them. You need to know what each one is, and record a decision, so the team is not starting from zero next sprint.
why_it_matters: |
  Unexamined cycle groups compound. A team that has never classified its cycles does not know which ones are design problems and which ones are accepted technical debt. Without that classification, every cycle looks the same, and you cannot measure progress or communicate risk. Systematically auditing each group turns an undifferentiated list of warnings into a managed backlog: some resolved, some recorded as intentional, some tracked as debt, and a few genuinely deferred.
lens: the Topology Graph with the Cycles section enabled
steps:
  - heading: Open Cycles and start the navigator.
    body: Switch to the Topology Graph and open the Cycles section. Enable the cycle-only filter and use the cycle-group navigator to move to the first group. The graph highlights all packages in the group and the edges forming the cycle.
  - heading: Assess each group's structure.
    body: For each cycle group, check how many packages it involves, which architectural layers they span, and which specific edges form the loop. Cross-layer cycles (domain to infrastructure, service to persistence) are the most structurally significant.
  - heading: Classify the group.
    body: "Assign one of four classifications: design problem (the cycle crosses layers or violates an intended boundary), intentional dependency (a reviewed team decision), managed debt (a tolerated dependency with a reason and optional ticket), or out-of-scope noise (irrelevant to the current investigation)."
  - heading: Act on the classification.
    body: "For design problems: navigate to the specific edge closing the cycle and plan a refactor. For intentional dependencies or managed debt: record or review the repository governance decision on the concrete dependency and commit the governance file. For noise: add a Safe Haven to suppress it in your local workspace."
  - heading: Move to the next group.
    body: "Use the cycle-group navigator to advance. Record the decision for each group before moving. When you have processed all groups, open Cycle Governance for the repository-wide review: filter the classifications, repair stale or ambiguous records from current evidence, and then note the count of each classification as your audit output."
interpretation: |
  Groups that cross architectural layers are the highest priority to resolve. Groups within the same layer are often a clean interface extraction. Groups involving two packages are cheaper to fix than groups with five or more members. For large groups (five or more packages), look for the linchpin edges: the one or two dependencies that, if removed or inverted, would collapse the group. The largest-cycle-size metric tells you where to expect the most work before you start. Consistent progress on the design-problem groups, even one or two per sprint, is more valuable than occasional large cleanup sessions that do not change the trajectory.
export_note: |
  For a single group, export the Topology Graph as PNG with the cycle-only filter active. For a larger pass, generate an Architecture Audit Report with Cycle Triage and individual cycle-group maps enabled, so the unresolved groups and their decisions are captured in one browsable and printable packet.
metrics:
  - cyclic-dependencies
related_metrics:
  - cyclic-dependencies
related_docs:
  - lenses
related_workflows:
  - find-cycles
  - cycle-tangle-reduction
  - audit-a-module-boundary
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
