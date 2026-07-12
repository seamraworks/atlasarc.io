---
title: Subsystems
slug: subsystems
category: Comparative
summary: Architectural areas compared in metric space, so you can reason about coupling, stability, and size above individual packages.
seo_title: Subsystems Lens | AtlasArc Documentation
seo_description: Learn how to use the AtlasArc Subsystems lens to compare architectural areas, boundary risk, coupling, instability, and size.
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
---

The Subsystems view compares architectural areas in metric space. Once you have defined subsystems by grouping packages, this view plots those groups against each other so you can compare coupling, instability, and size at a coarser granularity than individual packages.

If the per-package graph is too dense to reason about, this is where to go. On a large codebase with recognised domain boundaries, the Subsystems view tells you whether those boundaries are holding up structurally, or whether coupling is quietly building across them in ways that will not be obvious until someone tries to move a module.

The view uses curated presets instead of raw axis selectors. Each preset fixes the axes, size, and colour to one architectural question, so the chart reads as a decision surface rather than a generic scatter plot.

<h2 id="boundary-risk">Boundary Risk</h2>

Boundary Risk compares incoming and outgoing boundary pressure. Right means the subsystem depends more heavily outside its boundary. Up means more packages depend on it. Size follows total class count, and colour follows instability.

Use this preset when you need to decide which subsystem boundary deserves the next review. Large, red, high-right areas are usually carrying too much outward knowledge. High-up areas are depended on by many neighbours and need more caution before changes.

<h2 id="complexity-load">Complexity Load</h2>

Complexity Load compares subsystem size with the complexity concentrated under it. It is a planning view: where would refactoring, simplification, or characterization testing pay off at subsystem scale?

Use it when a package-level Hotspots view finds too many local outliers and you need to know which architectural area owns the larger change burden.

<h2 id="visibility-surface">Visibility Surface</h2>

Visibility Surface focuses on exposed API surface and abstraction. It helps separate healthy stable boundaries from implementation-heavy subsystems that leak more surface than callers should need.

Use it when the smell is not raw coupling volume but information hiding: callers can reach too much of the subsystem's internal shape.

<h2 id="internal-tangles">Internal Tangles</h2>

Internal Tangles ranks subsystems by cycle groups inside their own subtree. A subsystem can look calm from the outside while hiding a difficult internal dependency knot. This preset brings that local tangle to the surface.

Use it before a subsystem audit, module extraction, or architecture report so the team knows which areas need cycle triage before boundary cleanup.

Subsystems is available in Professional and Team plans.
