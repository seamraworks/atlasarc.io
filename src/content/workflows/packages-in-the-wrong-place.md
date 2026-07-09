---
title: Packages in the wrong place
slug: packages-in-the-wrong-place
seo_title: Find Packages in the Wrong Architectural Layer | AtlasArc
seo_description: Use AtlasArc to identify packages whose dependency direction contradicts their architectural role, such as domain packages that depend on infrastructure and other layering violations.
problem: |
  A package called domain.order has more outgoing dependencies than incoming ones. It depends on infrastructure packages, a messaging library, and two external services. That is not what a domain package is supposed to do. Domain packages should be the stable core. They should be depended on, not depending. But nobody named this package wrong on purpose. It started as a simple order class and grew into something that absorbed too many responsibilities over time.
why_it_matters: |
  Layering violations are how the clean architecture in the design document diverges from the actual architecture in the code. A domain package with high fan-out is importing from layers that should depend on it, not the other way around. Once this happens, you lose the main benefit of the layered design: the ability to change the infrastructure without touching the domain. Every misplaced package makes the architecture a little harder to reason about and a little harder to change.
lens: Hotspots
steps:
  - heading: Open Hotspots.
    body: Switch to the Hotspots lens. The X axis is instability. Packages toward the right (high instability) have more outgoing dependencies than incoming ones. They depend on more than they are depended on.
  - heading: Map expected instability to architectural role.
    body: Domain and core packages should be on the left (low instability, many callers, few external dependencies). Infrastructure, adapters, and application wiring should be on the right (high instability, they depend on everything else but little depends on them). Packages that are in the wrong zone for their architectural role are the ones to investigate.
  - heading: Click each candidate.
    body: Click any suspicious bubble. The sidebar shows fan-in, fan-out, and distance from the main sequence. A domain package with fan-out much greater than fan-in, and high instability, is importing from the layers that should be importing from it.
  - heading: Navigate to the package in the IDE.
    body: Right-click the node and navigate to the package in the IDE to see which specific dependencies are pulling the package into the wrong instability zone. Usually there is a small number of dependencies that account for most of the fan-out.
interpretation: |
  A package's dependency direction should match its architectural role. Domain packages should be stable and somewhat abstract. Infrastructure should be unstable and concrete. When they are reversed, someone took a shortcut. The fix is almost never to move the package to a different directory. It is to invert the dependency direction. Extract an interface in the domain package that the infrastructure package implements. Or move the dependency logic to an adapter layer that sits between them. Either way, the domain package should stop importing from infrastructure.
export_note: |
  Export the Hotspots chart as PNG with instability on the X axis. Annotate the export with the expected zones for each architectural layer to make the misplacements obvious in a design review.
metrics:
  - fan-in-fan-out
  - instability-abstractness
related_metrics:
  - fan-in-fan-out
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - stable-but-too-concrete
  - zone-of-pain
  - review-package-boundaries
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
