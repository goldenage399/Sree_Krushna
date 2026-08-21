# Incident Report: INC-045 — Activity Dashboard Silently Drops Work-Note Text (Event Metadata Field-Name Drift)

## Incident Summary

Supervisors reviewing a user's daily activity via the Activity Dashboard (`/activity`, `ActivityShell.jsx`) could see that a task's status changed, but never what the person actually wrote or did — the work-note text was always missing, even though the identical action was fully visible (with the note) in the task's own Details view. Root cause: three independent write paths used three different metadata key names for the same semantic content ("what did the person write today"), while the sole renderer read a fourth key that no write path ever populated.

- **Affected Components**: `src/components/activity/ActivityShell.jsx`, `src/components/TaskUpdateModal.jsx`, `src/pages/AssociateDashboard.jsx`, `src/components/TaskDetailsModal.jsx`
- **Symptom**: Activity Dashboard entries show "Status Changed: pending → in_progress" with no accompanying note; Task Details shows the full note text for the identical action.
- **Fix**: Standardized on `meta.comment` across all `appendTaskEvent` write paths (including wiring it into the previously-silent status-change branch in `TaskUpdateModal.jsx`); updated `ActivityShell.jsx` and `TaskDetailsModal.jsx` to read `comment` with a defensive fallback (`remarks`/`progressNotes`) for historical data; extended `EVENT_CATEGORIES`/`getEventCategoryLabel` to include `task_updated`/`task_status_changed` (previously excluded from every category filter but "All Activities").

---

## Root Cause Analysis

`EnhancedTaskService.appendTaskEvent()` accepts a free-form `meta` object with no defined schema per event type — each call site is free to invent field names for the same semantic content. Three write paths independently chose three different names:

- `AssociateDashboard.jsx:303` — `meta.comment`
- `TaskUpdateModal.jsx:604` (no status change) — `meta.progressNotes`
- `TaskUpdateModal.jsx:580` (status changed) — no note field written at all; only `{ from, to }`

`ActivityShell.jsx:640`'s renderer checked only `event.metadata.remarks` — a key none of the three write paths ever set. The bug was invisible in Task Details (`TaskDetailsModal.jsx`) because that view sources note text from a completely different data path (the `progressUpdates` array/subcollection's `comment` field), not from the `events` subcollection's `metadata` at all — so the exact same underlying action produced two visibly divergent renderings depending on which UI displayed it.

This is a **contract-absence** bug, not a typo: nothing enforces that `meta` field names agree between writers and readers. `PRD-001` ("Canonical Task Timeline & Lifecycle Event System") is referenced by name across `TASK-197`, `CLAUDE.md`, and `.agent/PREFLIGHT.md` as if it were a governing spec, but no standalone PRD-001 document exists in the repo — only the event *coverage* half of the contract (P92/ARCH-INV-012: every write must emit an event) was ever formalized and gated. The event *shape*/field-naming half was never written down or enforced, which is exactly why three call sites could each invent their own key without any check catching the drift.

---

## Architectural Surface Mapping

1. **UI Surface**: `ActivityShell.jsx` — the note-text bullet (`event.metadata.remarks`) and its visibility gate (`hasMetadata`) never matched real data; `EVENT_CATEGORIES`/`getEventCategoryLabel` excluded `task_updated`/`task_status_changed` from every filter but "All Activities."
2. **Data Surface**: `tasks/{id}/events` subcollection documents carry inconsistent `metadata` shapes across event-producing call sites — no defined per-event-type schema.
3. **Reactive Surface**: N/A — no React state-setter collision; this is a pure data-shape mismatch between write and read, not a stale-closure or subscription issue.
4. **Service Surface**: `EnhancedTaskService.appendTaskEvent()` accepts an unvalidated free-form `meta` object; three call sites (`AssociateDashboard.jsx`, `TaskUpdateModal.jsx` ×2 branches) independently diverged on field naming for the same semantic content.
5. **Module Surface**: N/A — no new files, no route changes, no package/dependency changes.
6. **Governance Surface**: `PRD-001` is referenced throughout the governance layer (`CLAUDE.md`, `.agent/PREFLIGHT.md`, `TASK-197`) as the canonical spec for the event system, but no such document exists in the repo — only its coverage half (P92) was ever formalized. The field-naming/shape contract was never written down, so no gate could have caught this drift before it shipped.

---

## Corrective Actions & Resolution

1. **Standardized `meta.comment`** as the canonical note-text field across `AssociateDashboard.jsx:303` (already correct, no change), `TaskUpdateModal.jsx:580` (added — previously missing entirely), `TaskUpdateModal.jsx:604` (renamed from `progressNotes`).
2. **Fixed the renderer**: `ActivityShell.jsx:640` and its visibility gate `hasMetadata` (line 556) now read `comment` with `remarks`/`progressNotes` fallback so historical events (written under either legacy key) still render.
3. **Fixed the sibling consumer**: `TaskDetailsModal.jsx:570` updated to check `comment` first, `progressNotes` second — same fallback discipline.
4. **Closed the category-filter gap**: `EVENT_CATEGORIES.status` and `getEventCategoryLabel` (`ActivityShell.jsx`) extended to include `task_updated`/`task_status_changed` — previously these normalized types matched none of the category filter arrays (which expected an unprefixed `status_changed` that was never actually emitted), so they only ever appeared under "All Activities," miscategorized as "System."
5. **Registered standard `P97`** (Event Metadata Field-Name Contract) in `.agent/standards-catalog.json` — establishes `comment` as the canonical note-text key for all `appendTaskEvent` calls going forward.
6. **Captured process pattern** `.agent/patterns/event-metadata-contract-drift.md` (reference tier, wired into `post-incident-governance.md`) — check existing `appendTaskEvent` call sites' field names before adding a new one or a new metadata consumer.
7. **Verified**: `npm run build` clean, `npm run check:event-coverage` (ARCH-INV-012/P92) passes, user-confirmed fix against the originally reported screenshot scenario (2026-07-02).

---

## Prevention & Invariants

- **P97**: All `appendTaskEvent(..., meta: {...})` calls MUST use `comment` as the key for free-text note/work-description content. Do not introduce a new field name for the same semantic content at a new call site.
- Before adding a new event-metadata consumer (a renderer reading `event.metadata.X`), grep all `appendTaskEvent` call sites first to confirm the key is actually written somewhere — do not assume a field exists because it "should."
- **Known residual gap**: `PRD-001`'s field-naming/shape contract remains formally unwritten. This incident's fix (P97) covers only the specific `comment` field it exposed; a full PRD-001 spec document (defining the complete `meta` shape per event type) was judged out of scope for this fix and is not resolved here.
