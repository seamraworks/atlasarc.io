---
title: Ticking time bombs
slug: ticking-time-bombs
seo_title: Identify Structural Ticking Time Bombs in Your Codebase | AtlasArc
seo_description: Use AtlasArc to find unstable packages that are quietly accumulating callers, cheap to refactor now but expensive once they become load-bearing.
problem: |
  The package has not caused a problem yet. It is not in any bug ticket, not mentioned in any retrospective. But it has high fan-out, changes every sprint, and has recently picked up two or three callers that were not there before. Nobody is alarmed. Nobody has time to be alarmed. One day a change there will break something unexpected, and nobody will understand why, because by then nobody will remember when this package started attracting callers.
why_it_matters: |
  Structural pressure accumulates quietly. A package transitions from "unstable leaf" to "load-bearing core" without anyone making a decision. It just happens, one caller at a time. By the time the package is genuinely difficult to change, the team has normalised it. The ticking-time-bomb signal is specifically about catching packages at the inflection point: still easy to change, but already accumulating callers. Early action is cheap. Late action requires coordination.
lens: Hotspots
steps:
  - heading: Open Hotspots.
    body: Switch to the Hotspots bubble chart. Instability is on the X axis. Packages to the right have more outgoing dependencies than incoming ones, typical for leaf packages and adapters.
  - heading: Look for right-of-centre bubbles with non-trivial fan-in.
    body: The signal is instability above 0.5 (the package is still net-unstable) combined with fan-in that is larger than you would expect for a pure leaf. Click any such package to check its fan-in in the sidebar. Even 3-5 callers on an unstable package is worth tracking.
  - heading: Check how recently the callers appeared.
    body: Navigate to the package in the IDE and check its recent git history. If callers have been added in the last few sprints, the package is transitioning. If it has been steady for a year with a fixed small set of callers, it may be a stable utility that simply has balanced coupling.
  - heading: Note complexity.
    body: Click the package bubble and check cyclomatic complexity in the sidebar. High complexity on an unstable package means that when it does attract enough callers to become load-bearing, it will be hard to refactor at that point.
interpretation: |
  High instability alone is not a problem; leaf packages are supposed to be unstable, and that is fine as long as they stay simple and unconstrained. The ticking-time-bomb signal is high instability combined with a growing fan-in trend. A package that is supposed to be a leaf is starting to attract callers. As it gains more dependents, its instability will drop and it will become harder to change. The right response is usually either to formalise the package as an intentional shared utility (add an interface, write tests, stabilise the API) or to push the callers toward a different, already-stable package that does the same thing.
export_note: |
  Export the Hotspots chart as PNG with bubble size set to class count. Annotate the export with the fan-in values for the packages in the middle instability range; these are the ones most likely to be at the tipping point.
metrics:
  - fan-in-fan-out
  - instability-abstractness
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - hard-to-change-packages
  - identify-hotspots
  - zone-of-pain
  - cycle-tangle-reduction
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
