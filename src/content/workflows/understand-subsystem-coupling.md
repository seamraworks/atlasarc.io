---
title: Understand subsystem coupling
slug: understand-subsystem-coupling
seo_title: Understand Subsystem Coupling in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to understand how subsystems couple to each other and where structural pressure concentrates in Java, Kotlin, and TypeScript projects.
problem: |
  At some point in every growing project, the package graph stops being readable. Two hundred nodes, edges everywhere. Zoom in and it just gets more overwhelming. The question you actually need to answer isn't "which package is tangled" anymore. It's "which part of the system is blocking the other parts." That's a subsystem question, and individual package views can't answer it.
why_it_matters: |
  A module that half the codebase depends on can't be released independently. A module that depends on everything breaks when anything changes. Those facts have direct consequences for team structure, deployment strategy, and how much parallel work is actually possible. The Subsystems view makes those structural pressures visible before they show up as missed deadlines or as a conversation nobody wants to have about why the monolith won't split.
lens: Subsystems
steps:
  - heading: Open the Subsystems view.
    body: Switch to the Subsystems lens. Packages are grouped into subsystem bubbles based on the current focus root. Each bubble represents a direct child area of the current root; size encodes the aggregate metric for that subtree.
  - heading: Inspect cross-subsystem flow.
    body: Select the "Boundary Risk" preset to plot subsystems by their boundary fan-in and fan-out. Bubbles in the upper-right have both high incoming and outgoing coupling — these are your most entangled subsystems. Hover to see the exact values.
  - heading: Drill into pressure points.
    body: Double-click any bubble to drill into that subsystem and re-scope the view to its direct children. This lets you follow the coupling pressure down into a specific area without losing context about where you are in the hierarchy.
metrics:
  - fan-in-fan-out
interpretation: |
  A subsystem with bidirectional heavy coupling to another means those two areas cannot evolve independently. That's the highest-priority structural problem at this level. A subsystem with only high fan-in is a stable shared dependency; focus on keeping its API clean rather than chasing lower coupling. A subsystem with only high fan-out is fragile; changes elsewhere ripple through it unpredictably, and splitting it or reducing its dependencies is usually the right move.
export_note: |
  Export the current view as PNG for architecture review sessions. The Subsystems CSV export gives you the raw aggregate metrics for every subsystem at the current scope level, useful for tracking coupling trends across sprints.
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - audit-a-subsystem
  - audit-a-module-boundary
  - show-me-the-backbone
---

Body content is not used for structured pages.
