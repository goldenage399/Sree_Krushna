---
pattern: subcollection-write-cache-atomicity
activation_tier: reference
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Pattern: Subcollection Write Must Atomically Stamp Parent Cache

**Category**: Design Gate
**Applies to**: Any service method that writes to a Firestore subcollection that has a corresponding parent document cache/denormalized field
**Origin**: 2026-06-26 � INC-029, `EnhancedTaskService.appendTaskProgressUpdate` never wrote `task.latestUpdate`
**Status**: HYPOTHESIS (one confirmed instance; promote to VALIDATED on second occurrence)

---

## Pattern

### Problem

A service method writes a document to a Firestore subcollection (e.g. `/tasks/{id}/progressUpdates`)
but does not update the corresponding cache field on the parent document (e.g. `task.latestUpdate`).
The parent cache field is architecturally intended to provide O(1) reads at list/dashboard views
without an extra query, but because the write path never stamps it, every task shows the UI
fallback as if no data exists.

The bug is **silent**: no error is thrown, the subcollection write succeeds, and the field simply
remains `undefined` on the parent doc.

### Why it happens

The subcollection and cache field are implemented at different times:
1. The subcollection write is implemented first (data layer).
2. The cache field on the parent is planned as a "read optimisation" but treated as a follow-up.
3. The UI is built to read the cache field and renders a fallback when it is absent.
4. No gate exists to enforce the write contract.

Because the subcollection write works correctly and the UI handles `undefined` gracefully,
no automated test fails and no error surfaces until a human observes the fallback text.

### Solution

**In the service method**, after the subcollection write, always also update the parent document's
cache field using the same `txn` (batch/transaction) when one is provided:

```js
// Derive a minimal cache object � only the fields the UI needs for the preview
const cacheFields = {
  description: update.description || '',
  timestamp: update.timestamp || null,
  updatedBy: update.updatedBy || null,
};

const parentRef = doc(db, 'tasks', taskId);

if (txn) {
  txn.set(doc(subCol), fullDoc);
  txn.update(parentRef, { latestUpdate: cacheFields }); // ? atomically stamp cache
} else {
  await addDoc(subCol, fullDoc);
  await updateDoc(parentRef, { latestUpdate: cacheFields }); // ? stamp cache
}
```

**Design rule**: The service method that owns the subcollection write also owns the cache stamp.
Do not leave the cache stamp responsibility to the caller.

### Failure Mode

If the cache stamp is added to the caller (e.g., inside a React component's submit handler)
instead of inside the service method, future callers will miss it. The service method is the
single authoritative write path; the cache must be stamped there.

### Task-Dashboard instance

`src/services/EnhancedTaskService.js` � `appendTaskProgressUpdate` (line 910).
Wrote to `/tasks/{taskId}/progressUpdates` subcollection.
Never updated `task.latestUpdate` on the parent doc.
`TaskDetailsModal` accordion header read `task.latestUpdate` and showed fallback text for every task.
Fixed in INC-029 (2026-06-26).

---

## Anti-Pattern � Variant Blindness in Multi-Path Components

### What it is

A React component has multiple render paths guarded by a `variant` prop (e.g. `variant === 'cockpit'`).
A structural change (new UI pattern, lazy load, conditional section) is applied to only one render path.
The other path continues to use the old behaviour.

### Symptoms

- User reports "no change" after a code edit
- The change is visible in one context (e.g. a detail page) but not in another (e.g. a cockpit/admin view)
- `git diff` confirms the edit was made, but the user-visible path is the other variant

### Why it fails

The second variant is not visible at the call site � it is guarded by a prop that the reviewing
agent does not check. The agent edits the first `return (...)` block and assumes the component has
only one render path.

### Correction

Before applying any structural change to a component:

```bash
# Check how many return statements exist and whether variant guards are present
grep -n "variant\|return (" src/components/ComponentName.jsx | head -30
```

If multiple return paths exist, each structural change must be applied to all paths that are
semantically equivalent, or documented as intentionally different.

### Task-Dashboard instance

`src/components/TaskDetailsModal.jsx` � `variant === 'cockpit'` guard at L584 (2026-06-26 line count).
Accordion change applied to default variant at first, cockpit variant still rendered eager timeline.
Corrected in same session (INC-029 follow-up).
