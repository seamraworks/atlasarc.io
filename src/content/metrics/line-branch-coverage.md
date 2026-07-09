---
title: Line and branch coverage
slug: line-branch-coverage
seo_title: Line and Branch Coverage (JaCoCo) | Software Architecture Metrics | AtlasArc
seo_description: Line and branch coverage from a JaCoCo XML report, surfaced as architecture-level heatmaps in AtlasArc for Java and Kotlin projects.
aliases:
  - line coverage
  - branch coverage
  - JaCoCo coverage
what_it_is: |
  Line coverage is the ratio of executed source lines to total source lines in a package, measured from a JaCoCo XML report. Branch coverage is the ratio of executed control-flow branches (if, else, ternary, switch arms) to total branches. AtlasArc reads both from an external JaCoCo report and surfaces them as heatmap overlays on the architecture view, so test coverage gaps appear in architectural context rather than in an isolated coverage tool.
why_it_matters: |
  Coverage numbers in isolation are often too high-level to act on. A project-level line coverage of 70% tells you something is undertested, but not where. AtlasArc maps coverage to the package graph: a package with low line coverage and high fan-in is a load-bearing part of the architecture that isn't being exercised by the test suite. A package with high fan-out and low branch coverage has many integration points where only the happy path is tested. Coverage in architectural context is coverage you can actually act on.
high_value_means: |
  High line coverage means most executable lines in the package have been executed at least once during the test run. High branch coverage means most conditional paths have been exercised. Both are the target state. Note that high coverage does not mean the tests are good; they may assert little or test incidental behavior. Even so, it is a necessary precondition for confident refactoring.
low_value_means: |
  Low line or branch coverage means significant parts of the package are not tested. That is a refactoring risk: changing code that no test exercises means there is no automated safety net. Packages with low coverage and high instability are particularly exposed because they change often and nothing catches regressions. Packages with low coverage and high fan-in are the highest-priority gap: many callers depend on code the test suite is not validating.
do_not_overinterpret: |
  Coverage metrics require a JaCoCo report to be loaded in AtlasArc. If no report is loaded, coverage fields show no value. The metrics reflect the specific test run that produced the report. Coverage also does not measure test quality: a package can have 100 percent line coverage from a test that asserts nothing. Treat coverage as a risk indicator for untested paths, not a badge of test quality.
where_shown: |
  As heatmap colour overlays on the Topology Graph, Package Matrix, and Composition view, available in the heatmap metric selector once a JaCoCo report is loaded. In the Metrics sidebar when any package is selected, if a report has been loaded.
related_lenses:
  - topology-graph
  - package-matrix
  - composition
formula: |
  Line coverage = covered lines / total lines, where covered lines are those executed during the JaCoCo test run. Branch coverage = covered branches / total branches, where branches include both outcomes of every conditional construct. AtlasArc reads both from a JaCoCo XML report provided by the user and does not run tests itself.
---

Body content is not used for structured pages.
