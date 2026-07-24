---
title: Hotspots
slug: hotspots
category: Risk
summary: A metric-space lens with bubble and Galaxy views for finding packages or classes where complexity, coupling, size, coverage, and stability risk overlap.
seo_title: Hotspots Lens | AtlasArc Documentation
seo_description: Learn how to read the AtlasArc Hotspots lens, including the Galaxy view for multi-dimensional package risk and dependency routes.
related_metrics:
  - instability-abstractness
  - fan-in-fan-out
---

The Hotspots lens plots packages or classes in metric space so outliers are visible before you choose a refactoring target. It has two renderers. The map view is a two-dimensional bubble chart for direct axis comparison. The Galaxy view adds Z/depth, size, colour, and faint dependency routes so dense projects still reveal the packages that matter.

The question the lens answers is specific: which packages or classes deserve attention first? A gnarly package that nothing else uses is a local problem. A gnarly package that half your service layer depends on is a systemic one. Plotting multiple dimensions at once lets you stop guessing about where to focus refactoring effort.

In the map view, packages in the top-right quadrant, high instability and high complexity, are the ones to address first. Packages in the bottom-right, high instability and low complexity, are candidates for stabilisation through abstraction. Packages in the top-left, low instability and high complexity, are stable but heavy cores; internal decomposition is usually the right move there rather than trying to shed incoming dependencies. Packages near the centre of the chart are fine. Leave them alone.

<h2 id="galaxy-view">Galaxy View</h2>

In the Galaxy view, each star uses five metric channels: X, Y, Z/depth, size, and colour. Depth is semantic, not camera depth: rotating the chart changes the viewing angle, but it does not change which packages fade into the background. In package mode, routes overlay real dependencies between packages that are also near each other in metric space, which separates isolated metric outliers from connected risk clusters.

The preset controls switch between Complexity, Coupling, Zone Map, CC vs Coverage, Galaxy Risk horizon, Galaxy Maintenance abyss, and Custom views to emphasise different parts of the chart. The Data as CSV export gives you the raw metric table for every package if you want to sort and filter independently.

<h2 id="package-vs-class-mode">Package vs Class Mode</h2>

Double-click a package bubble or star to drill into that package, making it the Current Focus across lenses. Switch to Classes when you want points to represent classes inside that package; double-clicking a class opens its source file in the IDE. That class mode is a ranking and comparison tool, separate from the Topology Graph's contained package-internals layer. Package points also expose **Reveal package in Project View** from the context menu when you want IDE navigation without changing Current Focus.

Package mode answers "which package deserves attention?" Class mode answers "which class inside this package deserves attention?" Keep that distinction clear when using the chart for refactoring tickets: a risky package may need decomposition, while a risky class may need local simplification or characterization tests.

<h2 id="direct-vs-recursive-scope">Direct vs Recursive Scope</h2>

Direct scope plots the immediate children under the current focus. Recursive scope includes deeper descendants, which is better when a risk is buried under namespace ceremony. Direct scope is better for comparing sibling packages; recursive scope is better for finding the hidden outlier under a broad package root.

Switch scope before interpreting rank. A package that looks ordinary among direct siblings may contain a recursive class or subpackage that dominates the risk story.

<h2 id="cycles-only">Cycles Only</h2>

When Cycles Only is active in package mode, Hotspots narrows the chart to cycle-participating packages. That lets you rank cycle members by complexity, coupling, size, coverage, or stability rather than treating every cycle node as equally urgent.

Cycles Only does not change the selected metrics. It changes which packages are eligible to be plotted.

Hotspots is available in Professional and Team plans.
