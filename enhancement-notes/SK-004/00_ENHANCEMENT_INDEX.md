# SK-004: Firestore Cross-Device Sync for Change Requests & Task Status

- **Cluster**: `[INFRA]`
- **Status**: `PLANNING`
- **Owner**: goldenage399
- **Depends On**: None (Foundational)
- **Target Release**: v1.0.0

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
| `change_requests` | `"CR-004"` style (unchanged format) | `title` str ≤200, `targetDomain` enum, `sourceType` str ≤60, `submitter` str ≤80, `submitterEmail` str (= auth email), `submittedAt` timestamp, `status` enum(`PROPOSED`\|`APPROVED`\|`REJECTED`\|`MERGED`), `payload.rawNotes` str ≤4000, `mergedBy`/`withdrawnBy` str optional |
| `task_status` | task's canonical id (`"TSK-001"`, `"RIT-005"`, …) — matches `marriage-state.js` | `status` enum(`Planned`\|`In-Progress`\|`Completed`), `done` bool, `checklist` list\<bool\> ≤30, `updatedBy` str (= auth email), `updatedAt` timestamp |
| `counters` | `"change_requests"` (singleton) | `seq` number — minted via transaction, kills the cross-device id-collision bug |

## 3. Security Rules — `firestore.rules` (replaces current file)

> Prototype rules, reviewed against the standard attack checklist (ownership hijack, schema pollution, resource exhaustion, immutable-field tampering, counter replay) — no open read/write paths remain. Still, review before treating this as final.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ===============================================================
    // Assumed Data Model — SK-004 Firestore Cross-Device Sync
    // ===============================================================
    //
    // change_requests/{requestId}   e.g. "CR-004"
    //   title            string  required immutable  <= 200 chars
    //   targetDomain     string  required immutable  in [VISION,VENDORS,RITUALS,CUSTODY,GOVERNANCE]
    //   sourceType       string  required            <= 60 chars
    //   submitter        string  required            <= 80 chars (display name)
    //   submitterEmail   string  required immutable  must equal request.auth.token.email
    //   submittedAt      timestamp required immutable
    //   status           string  required            in [PROPOSED,APPROVED,REJECTED,MERGED]
    //   payload          map     required immutable  only key 'rawNotes' (string <= 4000 chars)
    //   mergedBy         string  optional            <= 80 chars
    //   withdrawnBy      string  optional            <= 80 chars
    //
    // task_status/{taskId}   e.g. "TSK-001" (matches marriage-state.js task ids)
    //   status       string    required  in [Planned, In-Progress, Completed]
    //   done         bool      required
    //   checklist    list      optional  <= 30 items, each item a bool
    //   updatedBy    string    required  must equal request.auth.token.email
    //   updatedAt    timestamp required  must equal request.time (server-set)
    //
    // counters/change_requests   singleton doc
    //   seq   number  required, each write must be exactly (previous seq + 1)
    // ===============================================================

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAllowedUser() {
      return isAuthenticated() && request.auth.token.email != null &&
        request.auth.token.email.lower() in [
          'goldenage399@gmail.com',
          'sreesubha18@gmail.com',
          'krushna.s.panda@gmail.com'
        ];
    }

    function isValidChangeRequest(d) {
      return d.keys().hasAll(['title','targetDomain','sourceType','submitter','submitterEmail','submittedAt','status','payload']) &&
        d.keys().hasOnly(['title','targetDomain','sourceType','submitter','submitterEmail','submittedAt','status','payload','mergedBy','withdrawnBy']) &&
        d.title is string && d.title.size() > 0 && d.title.size() <= 200 &&
        d.targetDomain in ['VISION','VENDORS','RITUALS','CUSTODY','GOVERNANCE'] &&
        d.sourceType is string && d.sourceType.size() <= 60 &&
        d.submitter is string && d.submitter.size() <= 80 &&
        d.submitterEmail == request.auth.token.email &&
        d.submittedAt is timestamp &&
        d.status in ['PROPOSED','APPROVED','REJECTED','MERGED'] &&
        d.payload is map && d.payload.keys().hasOnly(['rawNotes']) &&
        (!('rawNotes' in d.payload) || (d.payload.rawNotes is string && d.payload.rawNotes.size() <= 4000)) &&
        (!('mergedBy' in d) || (d.mergedBy is string && d.mergedBy.size() <= 80)) &&
        (!('withdrawnBy' in d) || (d.withdrawnBy is string && d.withdrawnBy.size() <= 80));
    }

    function changeRequestImmutableFieldsUnchanged() {
      return request.resource.data.title == resource.data.title &&
        request.resource.data.targetDomain == resource.data.targetDomain &&
        request.resource.data.submitterEmail == resource.data.submitterEmail &&
        request.resource.data.submittedAt == resource.data.submittedAt &&
        request.resource.data.payload == resource.data.payload;
    }

    match /change_requests/{requestId} {
      allow read: if isAllowedUser();
      allow create: if isAllowedUser() && isValidChangeRequest(request.resource.data);
      allow update: if isAllowedUser() && isValidChangeRequest(request.resource.data) && changeRequestImmutableFieldsUnchanged();
      allow delete: if false; // change requests are an audit trail — never deleted
    }

    function isValidTaskStatus(d) {
      return d.keys().hasAll(['status','done','updatedBy','updatedAt']) &&
        d.keys().hasOnly(['status','done','checklist','updatedBy','updatedAt']) &&
        d.status in ['Planned','In-Progress','Completed'] &&
        d.done is bool &&
        (!('checklist' in d) || (d.checklist is list && d.checklist.size() <= 30)) &&
        d.updatedBy == request.auth.token.email &&
        d.updatedAt == request.time;
    }

    match /task_status/{taskId} {
      allow read: if isAllowedUser();
      allow write: if isAllowedUser() && isValidTaskStatus(request.resource.data);
    }

    match /counters/change_requests {
      allow read: if isAllowedUser();
      allow create: if isAllowedUser() &&
        request.resource.data.keys().hasOnly(['seq']) &&
        request.resource.data.seq == 1;
      allow update: if isAllowedUser() &&
        request.resource.data.keys().hasOnly(['seq']) &&
        request.resource.data.seq == resource.data.seq + 1;
    }

    // Marriage Proposals Collection (pre-existing, unchanged)
    match /proposals/{proposalId} {
      allow create, read: if true;
      allow update, delete: if isAuthenticated();
    }

    // Default deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 4. Client Bridge — new file `public/js/modules/firestore-client.js`

`intake-engine.js` and `app.js` are plain classic `<script>`s (not ES modules) — same split `auth.js` already lives with. This new module follows the exact pattern `auth.js` uses (`getApps()` guard, `window.currentUser` bridge): it owns the Firestore SDK import and exposes a handful of `window.fs*` functions the existing scripts call directly, no rewrite of their module system needed.

Load order in `index.html`: after `auth.js`, before `intake-engine.js`/`app.js`.

```javascript
/**
 * firestore-client.js — SK-004 Firestore bridge for Sree Krushna Marriage OS.
 * type="module". Loaded after auth.js, before intake-engine.js/app.js.
 */
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  initializeFirestore, persistentLocalCache,
  collection, doc, setDoc, updateDoc, runTransaction, onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const app = getApps().length ? getApps()[0] : initializeApp(window.firebaseConfig);
// persistentLocalCache = Firestore's built-in IndexedDB offline cache — replaces
// the hand-rolled localStorage sync entirely, no custom offline code needed.
const db = initializeFirestore(app, { localCache: persistentLocalCache() });

async function fsDispatchChangeRequest(record) {
  const counterRef = doc(db, "counters", "change_requests");
  const crId = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const next = snap.exists() ? snap.data().seq + 1 : 1;
    tx.set(counterRef, { seq: next });
    return "CR-" + String(next).padStart(3, "0");
  });
  const fullRecord = {
    title: record.title || "Untitled Change Request",
    targetDomain: record.targetDomain || "VISION",
    sourceType: record.sourceType || "UNIVERSAL_INTAKE",
    submitter: record.submitter || window.getAuthenticatedSubmitterName(),
    submitterEmail: window.currentUser.email,
    submittedAt: serverTimestamp(),
    status: "PROPOSED",
    payload: record.payload || {},
  };
  await setDoc(doc(db, "change_requests", crId), fullRecord);
  return { requestId: crId, ...fullRecord };
}

function fsUpdateChangeRequestStatus(requestId, patch) {
  return updateDoc(doc(db, "change_requests", requestId), patch);
}

function fsListenChangeRequests(callback) {
  return onSnapshot(collection(db, "change_requests"), (snap) => {
    const list = snap.docs
      .map((d) => ({ requestId: d.id, ...d.data() }))
      .sort((a, b) => (b.submittedAt?.toMillis?.() || 0) - (a.submittedAt?.toMillis?.() || 0));
    callback(list);
  });
}

function fsSetTaskStatus(taskId, patch) {
  return setDoc(doc(db, "task_status", taskId), {
    ...patch,
    updatedBy: window.currentUser.email,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

function fsListenTaskStatus(callback) {
  return onSnapshot(collection(db, "task_status"), (snap) => {
    const map = {};
    snap.docs.forEach((d) => { map[d.id] = d.data(); });
    callback(map);
  });
}

Object.assign(window, {
  fsDispatchChangeRequest, fsUpdateChangeRequestStatus, fsListenChangeRequests,
  fsSetTaskStatus, fsListenTaskStatus,
});
```

## 5. Integration Diffs (apply after this manifest is reviewed — not yet applied)

**`intake-engine.js`**
- Delete the local seed array + `localStorage.getItem(STORAGE_KEYS.CHANGE_REQUESTS)` hydrate block (current lines 12–56). Replace with `let changeRequestsList = [];` and, once the DOM/auth is ready, `window.fsListenChangeRequests(list => { changeRequestsList = list; renderIntakeLedger(); });`
- `dispatchChangeRequest()` becomes `async`, body becomes `const record = await window.fsDispatchChangeRequest(request); showChangeRequestReceipt(record); return record;` — no more manual `unshift`/`localStorage.setItem`; the live listener above re-renders the ledger for every device automatically.

**`app.js`**
- Merge/withdraw handlers (~line 1553, 1603) swap `localStorage.setItem(STORAGE_KEYS.CHANGE_REQUESTS, …)` for `window.fsUpdateChangeRequestStatus(cr.requestId, { status: cr.status, mergedBy: cr.mergedBy })` (or `withdrawnBy`).
- The `stored = JSON.parse(localStorage.getItem('sree_krushna_master_tasks_v6'))` hydrate block (~lines 199–224) is replaced with a boot-time `window.fsListenTaskStatus(statusMap => { currentTasks.forEach(t => { const cloud = statusMap[t.id]; if (!cloud) return; t.status = cloud.status; t.done = cloud.done; if (cloud.checklist) t.checklist?.forEach((c, i) => c.done = !!cloud.checklist[i]); }); renderTasks(); renderStageStrip(); renderSwimlaneMatrix(); });`
- `setTaskStatus()`: after mutating `t.status`/`t.done`/`t.checklist` in memory, `saveMasterTasks()`'s `localStorage.setItem('sree_krushna_tasks_v1', …)` call is replaced with `window.fsSetTaskStatus(t.id, { status: t.status, done: t.done, checklist: (t.checklist || []).map(c => !!c.done) })`.

## 6. Rollout & Verification

1. `firebase deploy --only firestore:rules` — provisions the default Standard database + rules. Safe with zero client changes live (collections stay empty).
2. Ship `firestore-client.js` + the two integration diffs behind a manual 2-browser smoke test: submit a CR in Browser A (or Sree's phone), confirm it appears in Browser B within ~1s without refresh; toggle a task's status in A, confirm B's task table/swimlane/DAG update live.
3. `firebase emulators:start --only firestore` + the Emulator UI to sanity-check the rules reject an unauthenticated write and a schema-polluted document before deploying to prod.
4. Once confirmed stable for a few days, delete the now-dead `localStorage` write paths (`sree_krushna_change_requests_v1`, `sree_krushna_master_tasks_v6`) — keep them only as an emergency read-only fallback for one release if you want a safety net.

## 7. Deploy Commands

```bash
firebase deploy --only firestore:rules
firebase deploy --only hosting
```
