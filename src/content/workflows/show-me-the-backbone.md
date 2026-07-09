---
title: Show me the backbone
slug: show-me-the-backbone
seo_title: Show Me the Backbone of a Codebase | AtlasArc Workflow
seo_description: Use AtlasArc to identify the load-bearing packages every other part of the system depends on, the ones you need to understand before anything else.
problem: |
  You have just joined a project, or inherited a codebase you have never seen before. Someone tells you to "get familiar with the architecture." You open the project in the IDE and stare at 80 packages arranged in no particular order. You could start reading code at random. Or you could find the backbone first: the packages everything else depends on. Then work outward from there.
why_it_matters: |
  High fan-in is only the first clue. Backbone packages matter because they explain what everything downstream is leaning on. A developer who knows the backbone can make predictions: if you change this package, those are the callers you need to notify. If this package has a design flaw, those are the places it will show up. Starting anywhere else is guessing.
lens: the Topology Graph
steps:
  - heading: Open the Topology Graph.
    body: Switch to the Topology Graph. You will see the full package dependency graph with directed edges showing which packages depend on which.
  - heading: Enable the fan-in heatmap overlay.
    body: Apply the fan-in heatmap to colour each node by the number of incoming dependencies. The darkest nodes are the packages with the most callers, the candidates for backbone status.
  - heading: Click the highest fan-in packages.
    body: Click any dark node to see its full metric breakdown in the sidebar. Note instability and abstractness alongside fan-in. Genuine backbone packages are stable (low instability) and often have at least moderate abstractness.
  - heading: Look for the load-bearing concrete ones.
    body: A high fan-in package with low instability and low abstractness is in the Zone of Pain. It is the backbone of the system, but it is also entirely concrete. It cannot evolve without breaking everyone who depends on it. Mark these separately from the stable-and-abstract backbone packages.
interpretation: |
  The backbone is not a single package, it is usually a small cluster. Three to seven packages that everything else depends on, arranged in a shallow hierarchy. Healthy backbone packages are stable (instability near 0), somewhat abstract (abstractness above 0.3), and have fan-in that is clearly higher than everything around them. If the highest fan-in packages are also highly concrete, that is a Zone of Pain situation: you have found a load-bearing wall you cannot move. Those packages need abstraction added to the callers-facing surface before the team can refactor them. If the backbone packages look healthy, stable, abstract, and well-defined, then the architecture has a clean foundation and the risk sits elsewhere.
export_note: |
  Export the Topology Graph as PNG with the fan-in heatmap active to capture the backbone for an architecture review or onboarding document. The colours in the export reflect the actual fan-in distribution, so the backbone stands out immediately even without labels.
metrics:
  - fan-in-fan-out
  - instability-abstractness
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - review-package-boundaries
  - identify-hotspots
  - zone-of-pain
  - audit-a-module-boundary
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
