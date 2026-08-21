---
pattern: scoped-query-ui-presentation-gap
activation_tier: reference
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Scoped Query ≠ UI Presentation

**Category**: Anti-Pattern
**Applies to**: Any task where a requirement is "show/expose X" and an existing, correctly-scoped
data query or hook already produces X — before reusing an existing page/tab to satisfy it.
**Origin**: 2026-07-03 (Task-Dashboard "Open Project" navigation fix, INC-047)
**Status**: HYPOTHESIS

---

## Anti-Pattern — Verifying the Query Instead of the Render Path

### What it is

Confirming a requirement is met by tracing the *data layer* only (a Firestore query, a hook's
return value, a service call) and stopping there — without separately reading the JSX that
actually consumes that data to confirm it is rendered in the shape the requirement asked for.

### Symptoms

- A fix is reported "done" after confirming `useX()`/`buildScopedQuery(...)` returns the correct
  records, with no corresponding trace of the component tree that renders those records.
- The user (or a later session) points out the feature "still doesn't do X" even though the
  data was demonstrably correct all along.
- The actual gap turns out to be a component that groups/paginates/nests the data in a way that
  never surfaces it as the flat/aggregate view the requirement described (e.g. data grouped by
  a parent entity — profile, project, category — with no code path that flattens it back out).

### Why it fails

Data correctness and UI presentation are independent claims. A query being "role-scoped
correctly" says nothing about whether any existing render path consumes that query's full
result set in the requested shape — it may consume a subset, group it, or gate it behind
additional interaction (drill-down clicks) that defeats the "show me all of X at once" intent.
Reading only the hook/query is faster and *feels* like verification, but it verifies the wrong
layer for a presentation requirement.

### Correction

When a requirement is phrased as "show/see/list all of X":
1. Identify the data source (query/hook) — verify it returns the right records, scoped correctly.
2. **Separately**, read the actual JSX render path that consumes that data. Confirm there is a
   branch that iterates the *full* result set as a flat list/grid matching what was asked for —
   not a branch that groups by some other entity, paginates behind clicks, or only shows a
   filtered subset.
3. If no such render path exists, building one is the actual fix — reusing an existing page/tab
   that merely *has access to* the right data is not sufficient if its UI structurally can't
   present it that way.
4. State explicitly, when reporting the fix, which render path was verified to show the data —
   not just which query was verified to return it.

### Related patterns

- `.agent/patterns/data-layer-verification-first.md` — verifies data *exists* before debugging
  rules/indexes. This pattern is the presentation-layer sibling: verify data is *rendered*
  correctly, a distinct claim from "the data exists" or "the query is scoped correctly."
- `.agent/patterns/raw-evidence-before-hypothesis.md` — general "observe directly, don't infer"
  discipline; this pattern applies that discipline specifically to the query-vs-render-path gap.

### Task-Dashboard instance

INC-047: `CrossProjectDashboard.jsx`'s "Open Project" button was fixed to route to
`TeamOversightPage.jsx`'s "Team Oversight" tab because its `tasksQuery`
(`buildScopedTaskQuery`) was confirmed to return every task in the project for admin roles. The
fix was reported complete on that basis. The user then reported the requirement still wasn't
met — `TeamOversightPage`'s "Profile Queues" view renders `ProfileCardWrapper`/
`ProfileListRowWrapper` grids grouped by organizational position, in both grid and list
`viewMode`s; no branch flattens `tasksList` into a plain task grid. The data was right from the
first fix; the render path was never checked. The actual fix required building a new render
path (`TaskCockpitView.jsx`, wired to the same already-correct `tasksList`).
