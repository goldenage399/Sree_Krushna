# INC-080 — TemplateEditorModal Wrong Import Path, Caught Only By Manual Bundler Run

**Incident ID**: INC-080
**Date**: 2026-08-13
**Severity**: Medium (shipped broken, would have failed at runtime for every user of the admin Recurring Checklists page)
**Governing Ticket**: TASK-246 Milestone 1
**Affected Components**: `src/components/checklists/TemplateEditorModal.jsx`, `.husky/pre-commit`

---

## Incident Summary

During TASK-246 Milestone 1 (extracting `TemplateEditorModal.jsx` out of `RecurringChecklistsPage.jsx`), the extracted file was authored with:

```js
import { CHECKLIST_CADENCE } from '../../constants/taskConstants';
```

`CHECKLIST_CADENCE` is actually exported from `src/services/RecurringChecklistService.js` — `constants/taskConstants` doesn't export it (and may not even exist at that path). The work was declared complete ("Milestone 1 Complete", governance green) before this was caught. The user ran the app and hit Vite's import-analysis error immediately.

---

## Root Cause

1. The extraction copied a call site (`CHECKLIST_CADENCE`) without verifying its actual export location — guessed a plausible-sounding constants path instead of tracing the real one.
2. **Zero test coverage exercises this file.** `grep` across `src/**/*.test.{js,jsx}` for `TemplateEditorModal` returns no hits. `RecurringChecklistService.test.js` (10/10) and `OperationalRoutinesSection.test.jsx` (6/6) — the two suites cited as "verification" — never import this component, so neither could have caught a broken import in it.
3. Vitest's module resolution does not equal a bundler's. Even with coverage, unit tests don't necessarily exercise every static `import` the way `vite build`'s full module graph walk does. The only thing that actually caught this was an ad hoc, manually-run `npx vite build` — after the user pointed out it hadn't been run.
4. **No standing gate required it.** `.husky/pre-commit` (before this incident) ran stylelint on staged CSS and `preflight:strict` — neither performs bundler-level import resolution. `preflight-gate.cjs` has zero references to `vite build`. So a broken import could reach a commit, and did.

---

## Corrective Action

Added a build gate to `.husky/pre-commit`: when staged changes touch any `src/**/*.{js,jsx,ts,tsx}` file, `npx vite build` runs before the commit is allowed to complete. A broken import now fails the commit locally, the same class of error this incident shipped.

This is a general gate (any JS/JSX/TS/TSX change), not scoped to checklist files — the root cause (test suites can pass while a component's imports are still broken) applies to any newly extracted or moved component, not just this one.

---

## Prevention Class

**Test-green ≠ build-green.** A component with no test coverage — or coverage that doesn't import it — can have a fatal error invisible to `npx vitest run`. Before declaring any extraction/refactor complete, run (or have a gate run) the actual production build, not just the unit test suite for the files that happen to be covered.
