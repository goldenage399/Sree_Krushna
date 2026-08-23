# SK-004: Firestore Cross-Device Sync for Change Requests & Task Status

- **Cluster**: `[INFRA]`
- **Status**: `IMPLEMENTED` (pending `firebase deploy --only firestore:rules` + Firestore API enable — see §6)
- **Owner**: goldenage399
- **Depends On**: None (Foundational)
- **Target Release**: v1.0.0

> **Correction after implementation**: this doc originally targeted `intake-engine.js`'s
> `dispatchChangeRequest`/schema (`sourceType`, `PROPOSED`/`MERGED` statuses). Reading
> `app.js` closely during implementation found that file is **dead code** — `app.js`
> defines its own complete, later-loaded `dispatchChangeRequest`/`approveChangeRequest`/
> `rejectChangeRequest`/`renderIntakeLedger`, each re-exported onto `window.*`, which
> silently shadows `intake-engine.js`'s exports (script load order: intake-engine.js
> then app.js — last writer to `window.x` wins). The actual live schema uses
> `intentType`/`targetEvent`/`Pending_Review`/`Approved_Merged`/`Withdrawn`, not what
> was drafted below. All code in §3/§4/§5 has been corrected to match; `intake-engine.js`
> itself was left untouched (still dead/shadowed — flagged, not fixed; out of scope).

## 🎯 Purpose

Today `change_requests` (intake-engine.js) and task status overlays (app.js) live only in `localStorage` — per-browser, per-device. When Sree submits a Change Request from another location, it's stamped and shown to her, then stranded: nobody else's browser ever sees it, and the `CR-###` id is minted from a local array length, so two devices can independently mint the same id.

This migrates both to Firestore (already declared in `firebase.json`/`firestore.rules`, never actually wired to a client) behind the existing Firebase Auth allow-list, so a write from any of the 3 authorized devices is visible on all of them in real time.

## 🚧 Explicitly Out of Scope (do not build unrequested)

- `scripts/triage-requests.cjs` CLI still reads `scratch/change_requests_queue.json` — untouched. Follow-up if the CLI needs to see live cloud data.
- Static task metadata (title, stage, lead, `depends_on`, `unlocks`) stays in git-tracked `marriage-state.js` — Firestore only holds the *mutable* overlay (status/done/checklist), exactly what today's `localStorage` overlay already holds.
- No Cloud Functions, no custom claims, no role tiers — 3 hardcoded allow-listed emails in rules, same set as `allowed_users.js`.
- No strict status state-machine validation (e.g. rejecting `PROPOSED → MERGED` skipping a review step) — enum-only validation. Flag as a `ponytail:` upgrade path if abuse ever becomes a real concern; not needed for a 3-person trusted household app.
- Firestore **Standard** edition, default database — **not** Enterprise. This app is low-volume document CRUD + a couple of `onSnapshot` listeners; Enterprise mode buys MongoDB-compat/analytics features this app will never use.

## 1. Provisioning

Firestore API has never been enabled on `sree-krushna-forever` (confirmed via `firestore:databases:list` → 403 `PERMISSION_DENIED`, API disabled). Steps:

1. Enable the API once: visit the console link from the CLI error, or `gcloud services enable firestore.googleapis.com --project=sree-krushna-forever`.
2. `firebase.json` already has the minimal `{ "firestore": { "rules": "firestore.rules" } }` block — no changes needed there. The **default** Standard-edition database is created automatically on first `firebase deploy --only firestore:rules` — no manual `firestore:databases:create` required.
3. No `firestore.indexes.json` needed yet — every planned read is either a whole-collection `onSnapshot` (no query) or an in-memory `.filter()` after fetch. Add one later only if a compound `where()+orderBy()` query is introduced.

## 2. Schema

| Collection | Doc ID | Fields |
|---|---|---|
| `change_requests` | `"CR-004"` style (unchanged format) | `title` str ≤200, `targetDomain` enum(VISION/VENDORS/RITUALS/CUSTODY/TASKS/OPERATIONS), `intentType` enum(PROPOSE_TASK/ADJUST_RITUAL/NOMINATE_VENDOR/PROPOSE_ASSET/DROP_INSPIRATION), `submitter` str ≤80 (display name), `submitterEmail` str (= auth email), `targetEvent` str ≤60, `submittedAt` ISO string, `status` enum(`Pending_Review`\|`Approved_Merged`\|`Withdrawn`), `payload` map (keys ⊆ rawNotes/category/mediaUrl/platform/suggestedOwner), `mergedAt`/`mergedBy`/`withdrawnAt`/`withdrawnBy` optional |
| `task_status` | task's canonical id (`"TSK-001"`, `"RIT-005"`, …) — matches `marriage-state.js` | `status` enum(`Planned`\|`In-Progress`\|`Completed`), `done` bool, `checklist` list\<bool\> ≤30, `updatedBy` str (= auth email), `updatedAt` timestamp |
| `counters` | `"change_requests"` (singleton) | `seq` number — minted via transaction, kills the cross-device id-collision bug |

Field names/enums above match the **live** dispatcher in `app.js` (`intentType`/`targetEvent`/`Pending_Review` etc.), not `intake-engine.js`'s dead-code shape.

## 3. Security Rules

Implemented in full at [firestore.rules](../../firestore.rules) (repo root) — not duplicated here to avoid drift. Summary: `isAllowedUser()` gates every collection to the 3 emails in `allowed_users.js`; `change_requests` create/update are schema-validated via `isValidChangeRequest()` with immutable-field protection on update, delete is hard-denied (audit trail); `task_status` accepts EITHER of two shapes (`isValidTaskStatusOverlay` — status/done/checklist/unlocks for a task with a canonical or already-adopted source, OR `isValidAdhocTask` — a full task record including title/event/owner/priority/track/dependency_type/depends_on/unlocks for a task with no canonical entry); `counters/{counterId}` (both `change_requests` and `tasks`) only accepts exactly `previous seq + 1`; a default-deny catch-all closes everything else. Deployed twice — once for the base schema, again after the ad-hoc-task extension — both compiled and released clean.

> Prototype rules, reviewed against the standard attack checklist (ownership hijack, schema pollution, resource exhaustion, immutable-field tampering, counter replay) — no open read/write paths remain. Still, review before treating this as final.

## 4. Client Bridge

Implemented at [public/js/modules/firestore-client.js](../../public/js/modules/firestore-client.js). `type="module"`, loaded in `index.html` right after `auth.js` (same `getApps()`-guarded init pattern auth.js already uses). Exposes `window.fsDispatchChangeRequest`, `fsUpdateChangeRequestStatus`, `fsListenChangeRequests`, `fsSetTaskStatus`, `fsCreateAdhocTask`, `fsListenTaskStatus` — plain classic scripts (`app.js`, `intake-engine.js`) call these directly, no module rewrite needed. Uses Firestore's built-in `persistentLocalCache` (IndexedDB) for offline support instead of hand-rolled localStorage sync. `change_requests.submittedAt` is written as a plain ISO string (not `serverTimestamp()`) because existing render code calls `.split('T')` on it — `task_status.updatedAt` uses real `serverTimestamp()`/`request.time` since it's a new field with no legacy dependency. Id minting (`CR-###`/`TSK-###`) is shared through one `mintId(counterName, prefix)` helper, transaction-based against `counters/{name}` — kills the classic two-devices-mint-the-same-id bug for both change requests and ad-hoc tasks.

**Load-order note**: `type="module"` scripts execute after all classic scripts but before `DOMContentLoaded`. `app.js`'s top-level listener registration (`fsListenChangeRequests`/`fsListenTaskStatus`) is wrapped in a `document.addEventListener('DOMContentLoaded', …)` for this reason — calling `window.fsListenTaskStatus` directly at top-level would silently no-op on first load (function doesn't exist yet at that point in script execution).

## 5. What Actually Changed in `app.js`

`intake-engine.js` was **left untouched** — confirmed dead/shadowed code (see correction note above), not worth touching for this enhancement.

All real state lived in `app.js`'s own `SPEC-ARCH-INTENT-DISPATCH-001` block, which had **two live bugs** independent of Firestore, both fixed as a side effect of this rewrite (root-caused, not patched around):
- `approveChangeRequest`/`rejectChangeRequest` referenced `STORAGE_KEYS.CHANGE_REQUESTS` — `STORAGE_KEYS` is never declared in `app.js` (it's `intake-engine.js`-local). Every Approve/Reject click threw a `ReferenceError`, silently swallowed by the surrounding `catch` — status changes never actually persisted.
- `approveChangeRequest`'s TASKS-domain branch called `renderTaskTable()`, which doesn't exist (the real function is `renderTasks()`) — an uncaught throw that aborted the rest of the approval flow for that domain.

Changes:
- `changeRequestsList` seed/hydrate + `saveChangeRequests()` → replaced with `window.fsListenChangeRequests(...)` wired on `DOMContentLoaded`; `renderIntakeLedger()` re-renders on every snapshot.
- `dispatchChangeRequest()` → `async`, delegates id-minting + persistence to `window.fsDispatchChangeRequest(...)`; the VISION-domain `ideasList` mirror side effect is preserved unchanged (stays localStorage, out of scope).
- `approveChangeRequest()` / `rejectChangeRequest()` → persistence swapped for `window.fsUpdateChangeRequestStatus(cr.requestId, {...})`; both bugs above fixed inline.
- `withdrawIdea()`'s change-request status sync → same `fsUpdateChangeRequestStatus` swap.
- Task hydrate block → `currentTasks` still seeds from canonical `MARRIAGE_STATE.tasks`; the `localStorage`-based overlay merge is replaced with `window.fsListenTaskStatus(...)` wired on `DOMContentLoaded`.
- `saveMasterTasks()` → now takes an optional task argument and does a per-task `fsSetTaskStatus` write (was a whole-array `localStorage.setItem`). Its call inside `renderTasks()` (a read path, fired on every render — including the one `fsListenTaskStatus`'s own callback triggers) was **removed**, not converted — converting it would have caused an infinite write→snapshot→render→write loop. The 3 genuine mutation points (`toggleConsoleChecklist`, `setTaskStatus`, `toggleMasterTask`) already call it themselves with the changed task.

**Gap closed (was "known gap, not built" above)**: a concurrent session had already added a predecessor picker to the intake modal (`#idea-predecessor`, `submitIdea()`'s `payload.dependsOn`) and wired real `depends_on`/reciprocal-`unlocks` values into the new task object — but only in-memory, no persistence path for that structural data. Closed by:
- `fsCreateAdhocTask(task)` (new, firestore-client.js) — mints a real id via `counters/tasks` (same atomic-transaction fix as `CR-###`) and writes the **full** task record (title/event/owner/priority/track/dependency_type/depends_on/unlocks/checklist) in one `setDoc`, since this task has no git-tracked source to read metadata from later.
- `approveChangeRequest()` → `async`, calls `fsCreateAdhocTask` instead of the old local-only `generateNextTaskId()` (removed, now dead — its only caller). The reciprocal `predTask.unlocks.push(...)` loop now also persists via `fsSetTaskStatus(predId, {status, done, unlocks})` — a merge write that stays valid whether the predecessor is canonical or itself an ad-hoc task.
- `fsListenTaskStatus`'s callback (app.js) gained a second pass: any cloud doc whose id isn't in `currentTasks` yet, and that carries a `title` field (the ad-hoc-shape discriminator), gets adopted as a full new task — this is what makes the ad-hoc task actually appear on other devices, not just its edges.
- `saveMasterTasks()` now sends full `{text,done}` checklist objects (was bools) — an ad-hoc task's checklist text has nowhere else to live, so bools-only would have destroyed it on the next status toggle.
- `firestore.rules`' `task_status` now validates **either** `isValidTaskStatusOverlay` (status/done/checklist/unlocks — existing shape, `unlocks` added as optional) **or** `isValidAdhocTask` (the full record above). `counters/change_requests` generalized to `counters/{counterId}` to cover the new `counters/tasks` singleton too.

Redeployed (`firebase deploy --only firestore:rules`) — compiled and released clean both times.

## 6. Rollout & Verification

1. ✅ **Done**: Firestore API enabled, default Standard database provisioned, rules deployed — twice (base schema, then the ad-hoc-task extension). Both compiled with zero errors.
2. **Still open**: manual 2-browser smoke test — submit a CR in Browser A, confirm it appears in Browser B within ~1s without refresh; toggle a task's status in A, confirm B updates live; approve a TASKS-domain CR with a predecessor picked, confirm the new task **and** the predecessor's updated Unlocks badge both show up on B.
3. `firebase emulators:start --only firestore` + the Emulator UI to sanity-check the rules reject an unauthenticated write and a schema-polluted document — not yet run.
4. The old `sree_krushna_change_requests_v1` / `sree_krushna_master_tasks_v6` localStorage keys are no longer written to by this flow — nothing further to clean up there.

## 7. Deploy Commands

```bash
firebase deploy --only firestore:rules
firebase deploy --only hosting
```
