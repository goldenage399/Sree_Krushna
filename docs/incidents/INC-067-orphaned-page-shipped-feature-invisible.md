# INC-067 — Orphaned Page: TASK-222 WS-1 Shipped Invisible, PIRR Signed Off on an Unmounted Route

**Date**: 2026-07-29
**Severity**: HIGH (the shipped feature — Today's Agenda + Grouped view, TASK-222 WS-1 — was completely unreachable by any real user; 321/321 unit tests, a clean `sg:scan`, and a passed PIRR all reported success)
**Status**: RESOLVED (feature ported to the live page; a new preflight gate closes the class of gap)
**Found during**: Product owner asked "where do I actually see this" and manually tried to locate the feature in the running app

**Affected Components**: `src/pages/AssociateDashboard.jsx` (dead file, never rendered), `src/App.jsx` (routing), `src/pages/MyTasksPage.jsx` (the actual live page), TASK-222's council ruling, PRD, architecture doc, and PIRR (all cited the wrong file as the "host page" without checking)

---

## Summary

TASK-222's Architecture Council ruling ([260728_arch_council_kanban_execution_workflow.md](../../User_Created/Discussion%20Threads/Council/260728_arch_council_kanban_execution_workflow.md)) named `AssociateDashboard.jsx` "the locked host page" for the new Today's Agenda / Grouped execution view, on the evidence that it was the only consumer of a `'kanban'` display-mode preference string (`useViewPreferences.js`). WS-1 was implemented entirely inside that file. Unit tests passed (321/321). `npm run sg:scan` was clean. PIRR's T3 criterion ("Full data chain verified: UI → Hook → Firebase traced end-to-end") was checked off, citing `AssociateDashboard.jsx` as evidence.

None of this caught the actual defect: `AssociateDashboard.jsx` is imported once in `App.jsx` and **never rendered as JSX anywhere in the codebase** (`grep -rn "<AssociateDashboard" src/` → zero matches). The real route users land on, `/associate` (and the actually-nav-linked `/my-tasks`), renders `<MyTasksPage />` — a completely different file, using a different architecture generation (hook-based, `useMyTasks`) versus `AssociateDashboard.jsx`'s direct-Firestore-call pattern.

The feature was correct, tested, and governance-approved — and invisible. It was found only because the product owner asked to see it running and manually checked routes.

## Root Cause

Every verification step in this initiative checked *code correctness*, never *reachability*:

1. The Architecture Council's File Placement Auditor accepted "consumes a preference string" as evidence of being the host page — it never checked whether the file is actually mounted at a route.
2. `architecture-council.md`'s own Phase 3 gate already said "run `npm run dev` and confirm the feature/change functions as expected in the browser" — this was not executed during implementation.
3. PIRR's T3 "full data chain verified" checkbox was satisfied by reading the code path (JSX → hook → Firestore), not by loading the actual page.
4. No automated check in this repo's governance (PREFLIGHT, `sg:scan`, the component-relationship map) verifies page-route reachability. Running the CLAUDE.md-advertised "mandatory" component map (`npm run query -- --component AssociateDashboard`) would not have caught this either — it returned "No matches found" for `AssociateDashboard` **and** for `MyTasksPage`, meaning the map doesn't index page-level reachability at all (confirmed stale/limited in scope, generated 2026-07-16).
5. Three overlapping routes existed for the same concern (`/associate`, `/my-tasks`, both → `MyTasksPage`, plus the dead `AssociateDashboard.jsx`), making it easy to mistake "a plausibly-named file exists" for "a page is live."

This is the same underlying failure class as the ast-grep guard and fabricated council claim caught earlier in this same initiative (`Council_Ledger.md`, 2026-07-29 PROCESS-CORRECTION rows) — a claim of completeness that was never tested against reality — recurring one layer higher: this time it wasn't a validation rule that silently didn't work, it was the entire feature's existence in the running app.

## Fix

1. Ported WS-1 (Today's Agenda tab, Grouped execution view) into `MyTasksPage.jsx`, the page actually live at `/associate` and `/my-tasks`. Refactored `useTodayAgenda.js` to export a pure `filterTodayAgenda()` function so the port doesn't open a second, redundant Firestore listener alongside `MyTasksPage`'s existing `useMyTasks` subscription.
2. Verified via Vite's transformed-module fetch (no compile error), ESLint (clean), 321/321 unit tests (still passing), and `sg:scan` (clean) — plus, this time, an explicit statement that none of these substitute for loading the actual page.
3. Built `scripts/check-page-reachability.cjs` — every `src/pages/*.jsx` file must appear as a rendered JSX element (`<ComponentName`) somewhere in `src/`, not just be imported. Tested against the known-bad case (correctly flags `AssociateDashboard.jsx`) and iterated once after an initial false-positive (`ProjectAnalyticsPage.jsx`/`ProjectSettingsPage.jsx` are legitimately rendered in a nested `ProjectLayoutWrapper.jsx`, not `App.jsx` — the script was widened to search all of `src/`, not just the top-level router file).
4. Wired as `npm run check:page-reachability`, documented as PREFLIGHT row **R37**.
5. Added a blocking PIRR category (Cat 16b) stating explicitly that T3 "full data chain verified" cannot be checked off from code-reading alone for page-level changes.
6. Added an evidence requirement to `architecture-council.md`'s File Placement Auditor: a "host page" claim must cite the actual `<Route>` JSX, not an import or preference-string reference.

## Additional Finding (not yet triaged — logged, not resolved)

Running the new gate against the full codebase found **4 more pre-existing orphaned pages**, unrelated to TASK-222: `Dashboard.jsx`, `AdvancedProfileManagement.jsx`, `ErrorDashboardPage.jsx`, `VendorManagementDashboard.jsx`. None were investigated as part of this incident — each needs its own check (wire up, formally retire per URP-001, or delete) before being closed. Logged as an open Discovery, not resolved here, to avoid scope creep into an unrelated cleanup pass.

## Lessons

- **A claim of "the host page" is a reachability claim, not a naming claim.** Evidence must cite the route, not a consumer of an unrelated preference.
- **Text-based process steps that get skipped don't get less skippable by being reworded.** `architecture-council.md`'s Phase 3 browser-check instruction already existed and was still bypassed — the fix that actually holds is an automated, scriptable gate, not a clearer sentence.
- **A "mandatory" tool that returns silence is not a clean bill of health.** The component map returning "No matches" for both the orphaned page and a known-live page should have been treated as "this tool doesn't cover this question," not "nothing to worry about here."
- **When multiple routes plausibly serve the same purpose, that redundancy is itself a signal worth investigating**, not background noise to route around.
