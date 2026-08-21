# INC-074: Self-Referential Test Mock — Regression Test Verified Its Own Mock, Not the Production Fix

**Date**: 2026-08-09
**Severity**: MEDIUM (false confidence, not a production defect — caught same-session, before merge)
**Status**: Resolved — test rewritten to exercise real code; caught by manual review, not tooling

## Summary

TASK-180 Phase P1 fixed 4 verified defects (D1–D4) in the blocker-dependency write path (`TaskUpdateService.js` / `BlockerWorkflowService.js`). The first version of its regression suite (`TaskUpdateService.blockers.test.js`, commit `9ccc1877`) imported `TaskUpdateService` on line 35 and **never called `.applyUpdate()` anywhere in any of its 4 test cases**. Instead, every test `vi.mock('../BlockerWorkflowService', ...)`'d the service under test, hand-copying the validator logic into the mock's `mockImplementation`, then asserted the mock's own re-implementation behaved as the mock's author intended. `TaskUpdateService` was imported and unused — dead weight left over from an intent ("test the real fix") the test body never fulfilled.

The suite reported **4/4 passed** truthfully — the mock was internally self-consistent — but this proved nothing about `TaskUpdateService.js:215-248` or `BlockerWorkflowService.js:291-320`, the actual files that were fixed. If either had been reverted or broken, this test would have stayed green.

Found via a "read and verify" request over the fix's commit log — not by running the tests (they passed) but by tracing whether the assertions' call chain actually reached the production functions named in the commit message.

## Root Cause

**VERIFIED**: The test author's goal was "prove D1–D4 are fixed." The chosen method — mock the collaborator service, assert the mock does the right thing — is a legitimate pattern *when testing the caller's orchestration logic in isolation from the collaborator's internals*. It stops being legitimate the moment the mock's implementation is a copy of the exact logic the ticket was created to fix: at that point the test is asserting "my copy of the fix, pasted into the mock, works," which is tautological. The test never imports or calls the one function (`TaskUpdateService.applyUpdate`) whose behavior the ticket actually changed.

**INFERRED**: This happened because the test was written in the same pass as the fix, by re-deriving "what should the data look like after the fix" and asserting that shape directly, rather than driving the assertion through the real entry point and letting the real code produce the shape.

## Architectural Surface Mapping

1. **UI Surface**: N/A.
2. **Data Surface**: N/A — no data was written; this is a test-file-only defect.
3. **Reactive Surface**: N/A.
4. **Service Surface** — **Affected** (test-only). The regression suite for `TaskUpdateService.js` / `BlockerWorkflowService.js` provided zero actual coverage of either file for one full commit.
5. **Module Surface**: N/A.
6. **Governance Surface** — **Affected**. New pattern catalogued: **P106** — "Test Mocks the Unit Under Test." No scanner exists (AST-detectable in principle — "does `vi.mock()` target a module whose real export is also directly asserted-on-by-name in the test's `describe` title or file name?" — but not built; see Preventive Guardrails).

## Fixes Applied

1. `src/services/__tests__/TaskUpdateService.blockers.test.js` rewritten (commit `7a36f066`): `BlockerWorkflowService` is no longer mocked; only true I/O boundaries are (`firebase/firestore`'s `getDocs`/`updateDoc`, `EnhancedTaskService`'s event-logging side effect). `TaskUpdateService.applyUpdate()` and the real `BlockerWorkflowService.syncTaskBlockers()` both execute inside the test; assertions read `mockUpdateDoc`'s actual call arguments — the real output of real code, not a hand-copied re-implementation.
2. `.agent/standards-catalog.json` — new entry **P106** naming the pattern.

## Escape Analysis

**VERIFIED**: No automated gate would have caught this — coverage tooling reports the mocked module's lines as "not exercised by this test," but Vitest's default coverage report is per-source-file, not per-assertion-provenance, and nothing in this repo's `npm run preflight` gate currently cross-checks "does this test file import X and never call X." Caught by a human/agent tracing the assertion → call chain by hand, which is not a repeatable check.

## Missed Signals

- `const { TaskUpdateService } = await import('../TaskUpdateService');` (line 35 of the original) was **imported and never referenced again** in the file. An unused-import lint rule would flag this in application code; test files in this repo are not linted for unused imports with the same strictness (worth checking — see Repository Scan below).
- The test file's own `describe` block title claimed to cover `TaskUpdateService`, but zero assertions touched anything returned by or dependent on calling it.

## Preventive Guardrails

- **Manual heuristic (immediate, no tooling)**: When reviewing a regression test written alongside its fix, ask: *"If I reverted the production fix right now and re-ran only this test, would it fail?"* If the answer requires mentally re-deriving what the mock does rather than pointing at a real function call, the test doesn't prove what it claims to.
- **Automatable (not built — P106 is `manualOnly: true`, same maturation path as P83/P105)**: an ESLint or AST-grep rule that flags a test file where a named service is imported and appears in `vi.mock(...)` calls, but the named export is never called as a member expression anywhere in the same file outside the mock factory.
- **Cheap partial mitigation available now**: enable `noUnusedLocals`-equivalent linting for `**/__tests__/**` — would have caught the unused `TaskUpdateService` import as a lint warning, which is a weaker but immediate signal of the same defect class.

## Repository Scan

**SPECULATIVE** (not exhaustively verified — flagged as a follow-up, not confirmed this session): a repo-wide grep for `vi.mock\(['"]\.\./(\w+)['"]` combined with a check for whether that same module's real name is ever invoked outside the mock factory in the same file would surface other instances of this pattern. Not run this session — scope was the one file under review.

## Litmus Test

> *"If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"*

Not impossible — P106 is manual-only. But it's now named: the next reviewer of a same-session fix+test pair has a specific question to ask ("does this test call the real function, or a copy of it?") instead of trusting a green checkmark at face value.

## Related

- **P106**: `.agent/standards-catalog.json` — this incident's newly catalogued pattern
- **TASK-180**: `enhancement-notes/TASK-180-Dependency-Aware-Task-Lifecycle/01_PHASE_P1_IMPLEMENTATION_PLAN.md` — the ticket whose fix this test was meant to guard
- **INC-075**: `docs/incidents/INC-075-sequential-async-mock-call-order-drift.md` — sibling test-integrity finding from the same session, different root cause (call-sequence drift, not self-reference)
