# INC-069: `checklist_instances` P83 Recurrence — "Missing or insufficient permissions" on First-Ever Checklist View

**Date**: 2026-07-31
**Severity**: HIGH (per P83's own catalog severity)
**Status**: Resolved — both instances fixed, deployed, and enforcement gap closed

## Summary

An associate's first-ever visit to `/my-day` logged a console error — `FirebaseError: Missing or insufficient permissions` — immediately followed by an unrelated `MyDayCard` crash (a separate bug, not covered by this incident; see `enhancement-notes/TASK-227-.../00_ENHANCEMENT_INDEX.md`). Root cause: `firestore.rules`'s `checklist_instances` `get` rule dereferenced `resource.data.userId` for documents that may not exist yet — `RecurringChecklistService.getOrCreateInstance()` intentionally does a `getDoc()` on an instance ID before materializing it (lazy creation, the whole point of "get-or-create"). On the first call for any given user/template/period, the document doesn't exist, `resource` is `null`, and the rule throws instead of denying cleanly — Firestore surfaces this to the client as `permission-denied`.

**This is a recurrence, not a new bug class.** The exact same failure shape was already named and documented as **P83 (Firestore Rules Null-Safe Read Invariant)**, created 2026-06-11 after **INC-008** (`daily_attention_reports`, same root cause: consolidated `read` rule dereferencing `resource.data` on a document that hadn't been created yet). P83 existed in `.agent/standards-catalog.json` for 7 weeks before this recurred on a different collection.

## Root Cause of the Recurrence (not just the bug)

P83's `enforcement` block was `"manualOnly": true` with `"regex": null` in `violation-patterns.json` — a `manualCheck` string describing what to look for, with no script anywhere that actually looked for it. `.agent/PREFLIGHT.md`'s own R15 row already named P83 as the routing target for any `firestore.rules` change, but its verification column was "Check `firestore.rules` matches P83 safety guidelines" — prose, not a command. Nothing in this repo's automated checkpoints (`npm run preflight`, pre-commit, CI) ever actually scanned for this pattern. The invariant was correctly identified once and then never mechanically re-checked.

## Architectural Surface Mapping (Full 6-Surface Audit — 2+ surfaces affected)

1. **UI Surface**: N/A — no styling/layout change. The user-visible symptom (a console error on first checklist view) is a side effect of the Data Surface bug, not a UI defect itself.
2. **Data Surface** — **Affected**. `firestore.rules`: `checklist_instances` `get` rule fixed (doc-ID-based `checklistInstanceOwnerId()` helper replacing the `resource.data.userId` check, mirroring the pattern already used for `daily_attention_reports`). `checklist_templates` also found and fixed during the Phase 4 coverage audit (latent, not actively triggered — no code calls `getDoc()` on a specific template ID today, but the rule still granted unsafe `get`).
3. **Reactive Surface**: N/A — no React state/hook/context changes; the fix is entirely in `firestore.rules`.
4. **Service Surface**: N/A — `RecurringChecklistService.getOrCreateInstance()`'s own lazy-materialization pattern is correct and unchanged; the bug was in the rule that should have accommodated it, not in the service.
5. **Module Surface**: N/A — no new files, routes, or dependencies (the new script is a standalone dev-tooling addition, not a module in the app itself).
6. **Governance Surface** — **Affected**. This is the primary surface: an already-documented invariant (P83) had zero automated enforcement, which is why it could recur silently. Fixed: `scripts/check-firestore-null-safe-reads.cjs` built and wired into `npm run check:p83`, `.agent/PREFLIGHT.md` R15 strengthened to reference it, `.agent/standards-catalog.json` and `.agent/violation-patterns.json` P83 entries updated (`manualOnly: false`), `GEMINI.md` §79 updated with the enforcement command.

## Phase 4 — Coverage Audit (same-defect-shape sweep)

Ran the new `npm run check:p83` against the full `firestore.rules` file (28 `match` blocks) after fixing `checklist_instances`. Found one additional candidate: `checklist_templates`'s combined `allow get, list` rule also referenced `resource.data`. Investigated before treating as a violation (per this repo's INC-064 precedent — flag, then verify, don't assume): grepped `src/` for any `getDoc()` call targeting a specific `checklist_templates/{id}` — none exists; only `getDocs(collection(...))` (a `list` query, always safe since `list` only ever evaluates existing documents) and `updateDoc()` calls (safe — `update` only fires on existing docs). So this was a **latent landmine, not an active bug**: nothing exercises the unsafe path today, but the rule still granted `get` with a `resource.data` dependency, so any future single-document read for a not-yet-created template ID would hit the identical crash. Fixed proactively — split `get` (admin-only, no `resource.data`) from `list` (keeps existing scoping logic, safe by construction).

Re-ran `npm run check:p83` after both fixes: `✅ P83: No get/read rules reference resource.data — nothing to review.`

## Fixes Applied

1. `firestore.rules` — `checklist_instances.get` rule: `resource.data.userId == request.auth.uid` → `checklistInstanceOwnerId(instanceId) == request.auth.uid`.
2. `firestore.rules` — `checklist_templates`: split `allow get, list` into separate `get` (admin-only) and `list` (existing scoping logic, unchanged).
3. `scripts/check-firestore-null-safe-reads.cjs` — new heuristic detection script (built and run this session, not just proposed).
4. `package.json` — `check:p83` npm script.
5. `.agent/PREFLIGHT.md` R15 — verification column strengthened from prose to `npm run check:p83`.
6. `.agent/standards-catalog.json` P83 — `manualOnly: false`, script/npmCommand fields added, this incident added to `incidents[]`.
7. `.agent/violation-patterns.json` P83_FIRESTORE_RULES_NULL_SAFE — script/npmCommand fields added, manualCheck text updated to describe the review workflow around the script's output.
8. `GEMINI.md` §79 — enforcement command added.

Both `firestore.rules` fixes deployed same session (`firebase deploy --only firestore:rules`, compiled and released successfully, verbatim output captured in the conversation this incident originated from).

## Litmus Test

> *"If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"*

Not physically impossible — the detection script is a heuristic review gate (flags candidates, doesn't hard-block), consistent with Firestore rules' own structural difficulty of full static verification. But it is no longer *silently* possible: `npm run check:p83` will surface any new `get`/`read` rule that references `resource.data`, converting "nobody thought to check" into "a list exists and must be reviewed." Whether that review actually happens depends on someone running the command — the same residual risk every non-CI-wired check in this repo carries, and out of scope to solve generally in this incident.

> *"Is there an ADR that would have made this bug architecturally impossible to introduce?"*

P83 already existed as exactly this ADR-equivalent invariant. The gap wasn't a missing rule — it was a documented rule with no teeth. That's what this incident fixed.

## Related

- **P83**: `.agent/standards-catalog.json`
- **INC-008**: `docs/incidents/INC-008-daily-attention-report-security-rules-evaluation-error.md` — the original incident that created P83
- **TASK-227**: `enhancement-notes/TASK-227-My-Day-Daily-Planning-Engine/00_ENHANCEMENT_INDEX.md` — where this was first found (unrelated to that ticket's own scope)
- **TASK-230**: `enhancement-notes/TASK-230-Profiles-Collection-Per-Consumer-Query-Scoping.md` — a separate, unrelated `firestore.rules` finding from the same session
