---
title: Cycle / tangle reduction
slug: cycle-tangle-reduction
seo_title: Reduce Dependency Cycle Tangles Over Time | AtlasArc Workflow
seo_description: Use AtlasArc to work through a backlog of dependency cycles methodically across sprints, tracking progress as the problem graph shrinks.
problem: |
  The first time you ran the cycle finder on the legacy codebase, it showed 47 groups. You cannot fix 47 things this sprint. Some of them you should not fix at all: they are intentional, out of scope, or known debt the team has accepted. But you need a plan, and you need a way to know whether next sprint the number went up or down.
why_it_matters: |
  Cycle counts are not a metric you can improve in a single day. They are a trend line. A team that is methodically reducing cycles by even five per sprint is on a better trajectory than a team that occasionally does a large cleanup and then lets the count drift back up. The value of tracking cycle-group count as a sprint health metric is that it makes the trend visible: you can tell at a glance whether the codebase is getting better or worse, and the classification work you do in each session prevents re-treading the same ground.
lens: the Topology Graph with the Cycles section enabled
steps:
  - heading: Open Cycles in the sidebar.
    body: Switch to the Topology Graph and open the Cycles section. The panel shows the total cycle-group count. Note this number at the start of the session; it is your baseline for the sprint.
  - heading: Step through each group using the navigator.
    body: Use the cycle-group navigator to step through groups one at a time. For each group, the graph highlights the packages involved and the specific edges forming the cycle.
  - heading: Classify the group.
    body: "For each cycle group, decide what it is: a real design problem that crosses an architectural boundary; an intentional dependency the team has recorded in repository governance; managed debt that needs a reason and optional ticket; or noise that is out of scope for this investigation."
  - heading: Act on the classification.
    body: For design problems, identify the specific edge that closes the cycle and refactor it. For intentional exceptions or managed debt, record a cycle decision on the concrete dependency, verify the plain-English acceptance summary, and commit the updated governance file with the code. For out-of-scope noise, add a Safe Haven to suppress it in your local workspace without committing anything to the codebase.
  - heading: Record the end-of-session count.
    body: When you have processed all groups, note the revised cycle-group count. The delta between start and end is your sprint contribution. Track this across sprints to see the trend.
interpretation: |
  The metric that matters is trajectory, not the initial count. A codebase going from 47 to 39 to 31 over three sprints is on a sustainable path. A codebase going from 47 to 51 is accumulating cycles faster than the team is fixing them. When the count is stable but not improving, it usually means the team is fixing cycles at the same rate new ones are introduced. The fix is a short team conversation about what dependencies are being added in code review, not a bigger refactoring session. The cycle-group count is the north-star metric for this workflow: watch the trend, not the number.
export_note: |
  Generate an Architecture Audit Report at the end of a tangle-reduction session with Cycle Triage selected. The report records the current state of the problem graph, the cycle-group count, and the group list, which makes it useful for retrospective documentation or sprint reviews.
metrics:
  - cyclic-dependencies
  - instability-abstractness
related_metrics:
  - cyclic-dependencies
  - instability-abstractness
related_docs:
  - lenses
related_workflows:
  - find-cycles
  - audit-individual-cycle-groups
  - hard-to-change-packages
---

Body content is not used for structured pages; section content lives in the
front-matter fields above and is rendered through the workflow-page template.
