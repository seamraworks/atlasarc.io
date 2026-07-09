---
title: Find cyclic package dependencies
slug: find-cycles
seo_title: Find Cyclic Package Dependencies in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to detect, inspect, and understand cyclic package dependencies in Java, Kotlin, and TypeScript projects without leaving IntelliJ IDEA.
problem: |
  Have you ever tried to refactor a package and realised, three imports deep, that you couldn't touch it without also touching the package that depended on it, which depended on the one you started with? That's a cycle. It started with one "convenient" import added under deadline pressure. It ends with two (or ten) packages that can never be understood, compiled, or refactored in isolation.
why_it_matters: |
  Cycles don't announce themselves. They accumulate. A domain package picks up a single reference to a persistence helper. The persistence helper already imports a shared model. The shared model, well, now it imports the domain. No single developer added a cycle on purpose. But one day you try to extract the domain layer into its own module and discover it drags half the codebase with it. Finding cycles early, and tracking which direction they cross architectural layers, is the difference between a refactor that takes a day and one that takes a quarter.
lens: the Topology Graph with the Cycles section enabled
steps:
  - heading: Open the Topology Graph.
    body: Run AtlasArc from the Tools menu (or the AtlasArc toolbar icon) to open the package dependency graph. Every package in your project appears as a node; directed edges show usage dependencies.
  - heading: Enable the Cycles section.
    body: Open "Cycles" in the left sidebar and enable the cycles-only filter for the graph. Packages involved in cycles are highlighted immediately. Each node's header shows its cycle-group number so you can see at a glance which packages share a cycle.
  - heading: Inspect each cycle group.
    body: Click any highlighted package to select its cycle group. The sidebar shows all members of the group, the depth of the cycle path, and the dependency edges that form it. Use the cycle-group navigator to step through groups one at a time.
  - heading: Classify each cycle.
    body: "Not all cycles need the same response. For each group, decide what it is: a real design problem that crosses an architectural boundary (service to persistence, domain to infrastructure), a known and intentional exception that the team has already accepted, tracked debt that needs a ticket before it can be addressed, or local noise that is out of scope for the current investigation. That classification drives what you do next."
  - heading: Act on the classification.
    body: "For design problems: refactor the dependency relationship. Click any cycle participant to navigate directly to the class in the IDE, then invert the dependency, extract a shared interface, or move the code to the right layer. For intentional exceptions and tracked debt: add a source annotation at the declaration. The annotation keeps the dependency structurally visible but removes it from cycle problem detection. The reason and an optional ticket reference travel with the code into code review. For out-of-scope noise during the current investigation: right-click the package in the graph and add a Safe Haven. AtlasArc suppresses that package's cycle participation for your current workspace so you can focus on the cycles that actually matter right now, without committing anything to the codebase."
metrics:
  - cyclic-dependencies
interpretation: |
  Not every cycle is a crisis. Two sibling packages in the same layer that reference each other are often a minor refactor. Extract a shared interface, invert one dependency, done. The cycles that matter are the ones that cross layers: domain to infrastructure, service to persistence. Those mean someone is importing in the wrong direction, and the architectural promise of those layers, isolation and replaceability, has already been broken. Start there. The cycle-group count in the metrics bar gives you a single number to put in your next team retrospective.
export_note: |
  Use Export → PNG to capture the current graph with cycle groups highlighted. The export respects all active filters, so you can zoom into the affected area and export just that region for a code-review discussion or architecture decision record.
related_metrics:
  - cyclic-dependencies
related_docs:
  - getting-started
related_workflows:
  - cycle-tangle-reduction
  - audit-individual-cycle-groups
  - audit-a-module-boundary
---

Body content is not used for structured pages — section content lives in the
front-matter fields above and is rendered through the workflow-page template.
