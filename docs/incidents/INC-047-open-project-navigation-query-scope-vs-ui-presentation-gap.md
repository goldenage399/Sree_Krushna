# Incident Report: INC-047 — "Open Project" Fix Verified Query Scope, Not UI Presentation

## Incident Summary

While fixing the "Open Project" button on the Projects Overview page (`CrossProjectDashboard.jsx`) to satisfy the requirement "show all tasks for this project, for all users" (not the clicking user's own tasks), the first fix landed on `TeamOversightPage.jsx`'s existing "Team Oversight" tab and was reported complete. The user then pointed out the requirement still wasn't met — there was no way to actually see a flat list of all project tasks. The underlying Firestore query (`buildScopedTaskQuery`) *was* already correctly project-wide-scoped for admin roles; the mistake was treating "the query returns the right data" as equivalent to "the requirement is satisfied," without checking that the consuming UI (`TeamOversightPage`'s "Profile Queues" view) actually rendered that data as a flat, browsable task list. It renders position/profile cards instead — a user has to drill into each profile individually to see its tasks.

- **Affected Components**: `src/pages/CrossProjectDashboard.jsx` (`handleProjectNavigation`), `src/pages/TeamOversightPage.jsx` (existing "Profile Queues" tab)
- **Symptom**: A fix was reported as complete based on verifying the Firestore query scope (`buildScopedTaskQuery` role-gated to project-wide for admins) without separately verifying the rendered UI actually presented that data in the form the requirement asked for (a flat, all-tasks list).
- **Fix**: No code was reverted — a new "All Tasks" tab / shared `TaskCockpitView` component was built as a follow-up (separate work) to actually render `tasksList` as a flat, filterable task list. This incident is about the verification gap in the first attempt, not a data-correctness bug.

---

## Root Cause Analysis

`TeamOversightPage.jsx`'s `tasksQuery` (`buildScopedTaskQuery(freshUserCtx)` + project filter) was already correct — for level ≤2 (admin) roles it returns every task in the project regardless of assignee. This is genuinely reusable, correctly-scoped data. The mistake was inferring UI correctness from data correctness: because the *query* satisfied "all tasks, all users," it was assumed the *page* the query fed also satisfied "show all tasks, all users" — without separately reading the JSX that consumes `tasksList` (`mainView === 'queues'` renders `visibleProfiles.map(profile => <ProfileCardWrapper .../>)`, a profile-centric grid, in both `viewMode === 'grid'` and `viewMode === 'list'`). No branch of that render path iterates `tasksList` directly as a flat list of `TaskCard`s. The two claims — "the data is right" and "the UI shows the data the way the requirement asked for" — are independent and both need direct verification.

---

## Architectural Surface Mapping

1. **UI Surface**: The bug is entirely here. `TeamOversightPage`'s only pre-existing task-list rendering was profile-centric (`ProfileCardWrapper` / `ProfileListRowWrapper`), not a flat `TaskCard` grid. No amount of query correctness fixes that; a new render path was required.
2. **Data Surface**: N/A — no schema, index, or rules change was needed or made. `buildScopedTaskQuery` was already correct.
3. **Reactive Surface**: N/A — no incorrect state/hook was involved in the incident itself (state/hooks were added later, as the fix, not the cause).
4. **Service Surface**: N/A — no service/Cloud Function involved.
5. **Module Surface**: N/A — no route or dependency-structure change caused this.
6. **Governance Surface**: The verification gap itself is the governance-relevant finding — see Corrective Actions.

*Single-surface incident (UI Surface only) → Abbreviated Path per `.agent/workflows/post-incident-governance.md` Decision Node 1.*

---

## Corrective Actions & Resolution

1. Read the actual JSX render path (`mainView === 'queues'` block in `TeamOversightPage.jsx`) rather than only the data hook, confirming it was profile-card-based, not a flat task list.
2. Built `TaskCockpitView.jsx` (shared with `MyTasksPage.jsx`) and wired it to the already-correct `tasksList` via a new "All Tasks" tab, so the existing correct data now has a render path that actually satisfies the flat-list requirement.
3. Captured the corrective process as a reusable anti-pattern: `.agent/patterns/scoped-query-ui-presentation-gap.md` (via `/capture-pattern`), so future sessions check the render path, not just the query, before reporting a "show X" requirement satisfied.

---

## Prevention

No new code-level invariant (`standards-catalog.json` entry / ADR) was warranted — per Phase 2 of `post-incident-governance.md`, this is a process/verification-habit gap, not a systemic architectural pattern violation (no missing wrapper, guard, or deployment-order rule). The corrective process is captured as `.agent/patterns/scoped-query-ui-presentation-gap.md` instead, consumed by `post-incident-governance.md` and `debug-frontend.md`.
