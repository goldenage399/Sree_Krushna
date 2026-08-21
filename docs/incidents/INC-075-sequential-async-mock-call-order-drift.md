# INC-075: Sequential `getDocs` Mock Consumed by the Wrong Call — Silent False-Negative After a Guard Was Added

**Date**: 2026-08-09
**Severity**: MEDIUM (test-only false negative; production behavior was never wrong, only its test coverage)
**Status**: Resolved — second `mockResolvedValueOnce` added, 7/7 tests pass, full suite 348/348

## Summary

`WorkloadCalculationService.getAttentionDataForProfiles()` makes **two sequential `getDocs` calls**: first a permission-scoping query against `users` (resolves `profileIds` → `userIds`, guarding against the same class of denied unfiltered `list` query as **INC-071/P105**), then a query against `daily_attention_reports` scoped to those `userIds`. `AttentionReportService.test.js`'s test for this function mocked `getDocs` with a single `mockResolvedValueOnce(...)` shaped like a `daily_attention_reports` result set. Vitest consumed that single queued mock on the **first** call — the `users` query — leaving the second, real call (`daily_attention_reports`) with no queued mock, so it resolved to `undefined`. `reportsSnap.forEach(...)` on `undefined` threw inside `getAttentionDataForProfiles`'s own `try/catch`, which logged `console.error('Error fetching attention data for profiles:', ...)` and returned a default/empty result — so every profile's `isReporting` silently computed `false` instead of the expected value. The test failed on an assertion (`expected false to be true`), not a crash, and the real error was buried in `stderr`, easy to miss at a glance.

Found while investigating a full-suite `npx vitest run` for collateral damage after an unrelated fix (TASK-180 Phase P1) — not something anyone was hunting for.

## Root Cause

**VERIFIED**: `WorkloadCalculationService.getAttentionDataForProfiles` gained its `users`-scoping pre-query at some point after this test was originally written (the code comment at `WorkloadCalculationService.js:79-85` explicitly documents it as a fix for the exact list-rule-denial class of bug INC-071 later named and catalogued as P105). The test was never updated to account for the function now making 2 sequential `getDocs` calls instead of 1. This is the "producer changed its call shape, the test's mock-call-count assumption silently went stale" pattern — the same failure class as INC-071 itself (a contract changed on one side, the other side's assumption wasn't updated), just manifesting in test code instead of a Firestore rule.

**INFERRED**: The bug was invisible for however long it existed because `getAttentionDataForProfiles` catches its own errors internally and degrades to a default result rather than throwing — a defensible production choice (don't crash a dashboard over one failed sub-query) that also means a test-mock mismatch degrades to a *quiet* wrong-value assertion failure instead of a loud stack trace pointing at the real cause. The actual `TypeError` was visible only in `stderr`, one level removed from the assertion failure the test runner highlighted.

## Architectural Surface Mapping

1. **UI Surface**: N/A.
2. **Data Surface**: N/A — no data written; test-only.
3. **Reactive Surface**: N/A.
4. **Service Surface** — **Affected** (test-only). `AttentionReportService.test.js`'s coverage of `getAttentionDataForProfiles` was silently broken since the `users`-scoping guard was added — meaning this function had **zero working regression coverage** for an unknown period, on a service that computes the "is this profile actively reporting" signal surfaced elsewhere (attention/workload dashboards).
5. **Module Surface**: N/A.
6. **Governance Surface** — **Affected**. New pattern catalogued: **P107** — "Sequential Mock Call-Order Drift." Related to, but distinct from, P105 (P105 is a Firestore *rules* contract; P107 is a *test mock* contract, triggered by the same class of defensive code addition).

## Fixes Applied

1. `src/services/AttentionReportService.test.js` — added a first `mockGetDocs.mockResolvedValueOnce(...)` returning `{ id: 'user_a' }` / `{ id: 'user_b' }` docs (matching the `userId` fields the second, existing mock already assumed), so the two queued mocks now line up with the two real sequential calls. Comment added explaining why 2 mocks are required.
2. `.agent/standards-catalog.json` — new entry **P107** naming the pattern.
3. Verified: `AttentionReportService.test.js` 7/7 pass; full suite 348/348 pass (was 347/348 before the fix); committed separately (`662564c0`) from the unrelated TASK-180 work that surfaced it.

## Escape Analysis

**VERIFIED**: `mockResolvedValueOnce` silently returning `undefined` once its queue is exhausted (rather than throwing "no more mocked values configured") is a Vitest/Jest default behavior, not a bug in this repo — but it means a call-count mismatch degrades gracefully into `undefined`-shaped data instead of a hard test-harness error, which is exactly the kind of silent-degradation surface this repo's own P83/P105 precedents were named to fight in production code, just recurring here in test code instead.

## Missed Signals

- The function's own inline comment (`WorkloadCalculationService.js:79-85`) *documents* the 2-call structure and *why* it exists — the information needed to keep the test in sync was sitting right next to the code, uncross-referenced from the test file.
- No assertion on `mockGetDocs.mock.calls.length` existed to catch "this function makes N calls" as an explicit, checkable contract.

## Preventive Guardrails

- **Manual heuristic (immediate)**: when a function under test makes more than one sequential call to the same mocked function, assert `mock.calls.length` explicitly, and queue exactly that many `mockResolvedValueOnce`s with a comment naming which call each one answers (applied in the fix above).
- **Automatable (not built — P107 is `manualOnly: true`, same maturation path as P83/P105)**: no generic static check reliably detects "N `await getDocs(...)` call sites in a function vs. N `mockResolvedValueOnce` calls in its test" without deep call-graph analysis; not proposing a scanner at this severity level. Re-evaluate if this pattern recurs a second time (per this repo's own P83/P105 maturation precedent: manual-only until a 2nd–3rd recurrence justifies tooling).

## Repository Scan

**SPECULATIVE** (not run this session): any other test mocking a Firestore read function used by a service function that makes 2+ sequential reads is a candidate for the same drift, particularly other consumers of the `users`-scoping guard pattern documented at INC-071. Not audited — flagged as a follow-up, not confirmed.

## Litmus Test

> *"If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"*

Not impossible — P107 is manual-only, and the underlying trigger (adding a defensive pre-query for permission-scoping) is itself a *good* pattern this repo is deliberately propagating (P105). The realistic mitigation is procedural: whenever a P105-style scoping guard is added to an existing function, its existing tests' mock-call sequencing needs a matching update pass — not an automated gate, but a checklist item.

## Related

- **P107**: `.agent/standards-catalog.json` — this incident's newly catalogued pattern
- **P105**: `.agent/standards-catalog.json` — the production-code sibling pattern (Firestore list-rule/query filter parity) whose defensive fix is what triggered this test to drift
- **INC-071**: `docs/incidents/INC-071-task-events-unfiltered-list-query-permission-denied.md` — origin of the `users`-scoping guard pattern that `WorkloadCalculationService.js` also adopted
- **INC-074**: `docs/incidents/INC-074-self-referential-test-mock-false-confidence.md` — sibling test-integrity finding from the same session, different root cause (self-reference, not call-order)
