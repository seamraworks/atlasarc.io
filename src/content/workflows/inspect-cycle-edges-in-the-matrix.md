---
title: Inspect cycle edges in the matrix
slug: inspect-cycle-edges-in-the-matrix
seo_title: Inspect Cycle Edges in the Package Matrix | AtlasArc Workflow
seo_description: Use AtlasArc to inspect the directional package dependencies that close a cycle group in the Package Matrix.
problem: |
  The graph found a cycle group, but the exact edge story is still hard to read. The layout shows the loop, yet you need to know which package depends on which, in which direction, and how much traffic crosses each pair before you decide what to refactor.
why_it_matters: |
  Cycles are directional problems. A graph is excellent for discovering a loop, but the Package Matrix is often better for reading the edges that keep it alive. When the cycle group is shown as rows and columns, bidirectional pairs, heavy closing edges, and low-weight accidental imports stand out without graph layout getting in the way.
lens: the Package Matrix with Cycles Only enabled
steps:
  - heading: Start from the cycle problem graph.
    body: Open the Cycles section and enable Cycles Only so non-cycle packages and clean dependencies do not distract from the group you are inspecting.
  - heading: Open the Package Matrix.
    body: Switch to the Matrix lens. AtlasArc keeps the same cycle-focused model, but now every visible package appears as both a row and a column.
  - heading: Read direction before volume.
    body: A cell means the row package depends on the column package. Check both halves of each package pair. Cells in both directions mean mutual coupling; a single dense cell means one-way pressure; a tiny cell may be the accidental import that closes the loop.
  - heading: Select the suspicious cells.
    body: Click a cell to inspect the dependency examples behind it. Use the concrete source references to decide whether the dependency should be inverted, moved behind an interface, recorded as Intentional, or tracked as Debt. Record durable decisions on that concrete dependency in repository governance; use a Safe Haven only when the package is local noise for this investigation.
  - heading: Review durable decisions together.
    body: Open Cycle Governance from the shared toolbar after the edge-by-edge pass. Filter Intentional, Debt, or stale/invalid records; inspect the compact evidence diagram; and repair or reclassify records before committing the governance file.
  - heading: Return to the graph if shape matters again.
    body: When the matrix tells you which edge matters, switch back to the Topology Graph or Cycle View to explain the loop visually for a review, ticket, or report.
metrics:
  - cyclic-dependencies
  - fan-in-fan-out
interpretation: |
  Start with cells that close a cross-layer loop, not necessarily the largest count. A single domain-to-infrastructure import can be more architecturally significant than a heavy edge between two sibling implementation packages. If two packages have cells in both directions, decide whether they should be merged, split through a shared abstraction, or intentionally sanctioned. If one low-weight edge closes the whole group, that is often the cheapest refactor.
export_note: |
  Export the Matrix as TSV when you need a sortable list of cycle-participating package pairs. For a discussion artifact, generate an Architecture Audit Report with cycle triage sections so the matrix evidence and cycle-group context travel together.
related_metrics:
  - cyclic-dependencies
  - fan-in-fan-out
related_docs:
  - lenses
related_workflows:
  - find-cycles
  - audit-individual-cycle-groups
  - cycle-tangle-reduction
  - review-package-boundaries
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
