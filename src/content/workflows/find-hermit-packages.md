---
title: Find hermit packages
slug: find-hermit-packages
seo_title: Find Hermit (Isolated) Packages in IntelliJ IDEA | AtlasArc
seo_description: Use AtlasArc to surface isolated "hermit" packages with no dependencies in either direction, including dead code, forgotten refactors, or utilities worth promoting in Java, Kotlin, and TypeScript projects.
problem: |
  Every codebase accumulates packages nobody talks about. A helper extracted "for later" that nothing ended up importing. A module left behind when its callers were rewritten. A utility that quietly does its own thing and depends on nothing. On the dependency graph these show up as floating nodes, connected to neither side of the architecture. They are easy to miss precisely because they have no edges to draw your eye.
why_it_matters: |
  A package with no dependencies in either direction is telling you something, and it is rarely "nothing." It is dead code you are still compiling, testing, and paying maintenance tax on; or a refactor that was started and abandoned, leaving an orphan behind; or a genuinely self-contained utility that has outgrown the project and could be promoted to a shared library. All three are decisions waiting to be made, but only if you can see the package in the first place. Hermits are cheap to resolve and disproportionately confusing to leave, because every reader who stumbles on one has to work out why it exists.
lens: the Topology Graph with isolated packages shown
steps:
  - heading: Open the Topology Graph.
    body: Run AtlasArc from the Tools menu (or the AtlasArc toolbar icon) to open the package dependency graph. Every package appears as a node; directed edges show usage dependencies between them.
  - heading: Show the isolated packages.
    body: Turn the "Hide isolated" filter OFF. Most sessions keep it on to reduce noise, which is exactly why hermits stay invisible. With it off, every package with no edges floats free of the connected graph.
  - heading: Clear other filters so nothing is artificially hidden.
    body: Starting this workflow clears reference, fan, and cycle filters, pauses Exclusions and deep package roll-up, and turns Hide isolated off. It keeps your current Root, and your exclusion list remains intact for later. If you configure the view manually instead, use Reset before scoping the audit. A package can look isolated only because filtering hid its edges.
  - heading: Audit one module at a time.
    body: For a large project, right-click a module and choose Set as Root. Hermits are easier to judge in context; an isolated package inside a leaf utility module reads very differently from one stranded in your domain layer.
  - heading: Reveal the chosen subtree, not the whole project.
    body: Right-click the selected module or package folder and choose Expand completely so collapsed children cannot conceal hermit candidates. This expands only that subtree; avoid project-wide Expand All unless the whole-project audit is deliberate.
  - heading: Classify each hermit, then act.
    body: "For each floating package decide what it is. Dead code: confirm there are no reflective or configuration references, then delete it and reclaim the maintenance. A forgotten refactor: reconnect it to its intended callers, or finish removing what it replaced. A self-contained utility: consider promoting it to a shared library or internal module where its independence is a feature, not an accident. Navigate to any package in the IDE directly from its node to make the call against real code."
metrics:
  - fan-in-fan-out
interpretation: |
  Not every hermit is dead. A package that is isolated today may be a deliberately decoupled utility, a plugin loaded reflectively, or an entry point wired up by configuration the static graph cannot see, so confirm before you delete. The signal is not "isolated therefore useless"; it is "isolated therefore unexplained." Resolve the explanation: either the package earns its independence and you document why, or it does not and you remove it. A codebase with zero unexplained hermits is one where every package has a reason to exist that the next reader can reconstruct.
export_note: |
  Use Export → PNG with "Hide isolated" off to capture the full graph including the floating nodes, so a code-review or cleanup ticket shows exactly which packages are stranded and in which module.
related_metrics:
  - fan-in-fan-out
related_docs:
  - getting-started
related_workflows:
  - show-me-the-backbone
  - zone-of-uselessness
  - packages-in-the-wrong-place
---
