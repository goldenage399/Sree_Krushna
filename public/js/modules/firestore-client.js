/**
 * firestore-client.js — SK-004 Firestore bridge for Sree Krushna Marriage OS.
 * type="module". Loaded after auth.js, before intake-engine.js/app.js.
 *
 * intake-engine.js and app.js are plain classic <script>s (not ES modules) —
 * same split auth.js already lives with. This module owns the Firestore SDK
 * import and exposes window.fs* functions those scripts call directly.
 */
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  initializeFirestore, persistentLocalCache,
  collection, doc, setDoc, updateDoc, runTransaction, onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const app = getApps().length ? getApps()[0] : initializeApp(window.firebaseConfig);
// persistentLocalCache = Firestore's built-in IndexedDB offline cache — replaces
// hand-rolled localStorage sync entirely, no custom offline code needed.
const db = initializeFirestore(app, { localCache: persistentLocalCache() });

// Atomically mints the next "<PREFIX>-###" id from counters/{counterName} —
// avoids the classic bug where two devices each compute id from a local
// array length and mint the same one. Shared by change_requests and
// ad-hoc task creation below.
async function mintId(counterName, prefix) {
  const counterRef = doc(db, "counters", counterName);
  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const n = snap.exists() ? snap.data().seq + 1 : 1;
    tx.set(counterRef, { seq: n });
    return n;
  });
  return prefix + "-" + String(next).padStart(3, "0");
}

// ── Change Requests (SPEC-ARCH-INTENT-DISPATCH-001) ─────────────────
// Schema matches the LIVE dispatcher in app.js (targetDomain, intentType,
// targetEvent, submitter, payload{rawNotes,category,mediaUrl,platform}) —
// NOT the older intake-engine.js shape, which is dead/shadowed code.

async function fsDispatchChangeRequest({ targetDomain, intentType, title, payload, targetEvent, submitter }) {
  const crId = await mintId("change_requests", "CR");
  const fullRecord = {
    title: title || "Untitled Change Request",
    targetDomain: targetDomain || "VISION",
    intentType: intentType || "DROP_INSPIRATION",
    submitter: submitter || window.getAuthenticatedSubmitterName(),
    submitterEmail: window.currentUser.email,
    targetEvent: targetEvent || "Master_Planning",
    // Kept as a plain ISO string (not serverTimestamp()) — existing render
    // code calls cr.submittedAt.split('T')[0] and expects a string.
    submittedAt: new Date().toISOString(),
    status: "Pending_Review",
    payload: payload || {},
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
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    callback(list);
  });
}

// ── Task Status ───────────────────────────────────────────────────
// Two shapes live in task_status/{taskId} (see firestore.rules for the
// authoritative schema):
//  - status overlay: canonical (MARRIAGE_STATE/PROJECT_STATE) or already-
//    adopted ad-hoc task — just status/done/checklist/unlocks.
//  - full ad-hoc task record: a task with no canonical entry, created via
//    Change Request graduation — carries its own static metadata since
//    there's no git-tracked source to read it from.

function fsSetTaskStatus(taskId, patch) {
  return setDoc(doc(db, "task_status", taskId), {
    ...patch,
    updatedBy: window.currentUser.email,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// Mints a real cross-device-unique id (counters/tasks transaction — same
// fix as change_requests' CR-### collision bug) and writes the full ad-hoc
// task record in one shot. Returns the complete task object (with id) so
// the caller can add it straight into its local currentTasks array.
async function fsCreateAdhocTask(task) {
  const id = await mintId("tasks", "TSK");
  const record = {
    status: task.status || "Planned",
    done: !!task.done,
    title: task.title,
    event: task.event,
    owner: task.owner,
    priority: task.priority,
    track: task.track,
    dependency_type: task.dependency_type || "standard",
    depends_on: task.depends_on || [],
    unlocks: task.unlocks || [],
    checklist: task.checklist || [],
    updatedBy: window.currentUser.email,
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, "task_status", id), record);
  return { id, ...record };
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
  fsSetTaskStatus, fsCreateAdhocTask, fsListenTaskStatus,
});
