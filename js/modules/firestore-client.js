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
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

const app = getApps().length ? getApps()[0] : initializeApp(window.firebaseConfig);
// persistentLocalCache = Firestore's built-in IndexedDB offline cache — replaces
// hand-rolled localStorage sync entirely, no custom offline code needed.
const db = initializeFirestore(app, { localCache: persistentLocalCache() });
let storage = null;
try {
  storage = getStorage(app);
} catch (e) {
  console.warn("Firebase Storage initialization deferred/offline:", e);
}

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

// ── Real-Time Shopping Engine (AC-DEC-2026-028) ───────────────────
function fsSetShoppingItemStatus(itemId, patch) {
  if (!window.currentUser || !window.currentUser.email) return Promise.reject(new Error("Unauthenticated"));
  return setDoc(doc(db, "shopping_items", itemId), {
    ...patch,
    updatedBy: window.currentUser.email,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

async function fsCreateShoppingItem(item) {
  if (!window.currentUser || !window.currentUser.email) throw new Error("Unauthenticated");
  const id = await mintId("shopping_items", "TRS");
  const record = {
    id,
    title: item.title,
    category: item.category || "general",
    chapterId: item.chapterId || "chapter_general",
    role: item.role || "Wedding Sourcing",
    priceRange: item.priceRange || "",
    status: item.status || "Planned",
    store: item.store || "",
    actualPrice: item.actualPrice !== undefined ? item.actualPrice : "",
    actualStore: item.actualStore || item.store || "",
    notes: item.notes || "",
    addedBy: window.currentUser.displayName || window.currentUser.email,
    updatedBy: window.currentUser.email,
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, "shopping_items", id), record);
  return { id, ...record };
}

function fsListenShoppingItems(callback, onError) {
  return onSnapshot(collection(db, "shopping_items"), (snap) => {
    const map = {};
    snap.docs.forEach((d) => { map[d.id] = d.data(); });
    callback(map);
  }, (err) => {
    if (typeof onError === 'function') onError(err);
    else console.warn("Firestore fsListenShoppingItems error:", err);
  });
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Offscreen Canvas Image Compressor (2K High-Fidelity)
 * Downscales images to max dimension 2048px (aspect-ratio preserved)
 * and compresses to quality 0.88 JPEG/WebP.
 * Keeps payloads under 1.2MB for lightning-fast uploads without GAS timeouts.
 * 
 * @param {File|Blob|string} imageSource - File, Blob, or Data URL
 * @param {number} maxDim - Max width or height (default 2048px)
 * @param {number} quality - Compression quality (default 0.88)
 * @returns {Promise<{ dataUrl: string, width: number, height: number, sizeBytes: number }>}
 */
async function compressImage(imageSource, maxDim = 2048, quality = 0.88) {
  return new Promise((resolve, reject) => {
    let srcUrl = '';
    let isRevocable = false;

    if (typeof imageSource === 'string') {
      srcUrl = imageSource;
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      srcUrl = URL.createObjectURL(imageSource);
      isRevocable = true;
    } else {
      return reject(new Error('Invalid imageSource provided to compressImage'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isRevocable) URL.revokeObjectURL(srcUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Downscale proportionally if exceeds maxDim
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const approxBytes = Math.round((dataUrl.length * 3) / 4);

      resolve({
        dataUrl,
        width,
        height,
        sizeBytes: approxBytes
      });
    };

    img.onerror = (err) => {
      if (isRevocable) URL.revokeObjectURL(srcUrl);
      reject(new Error('Failed to load image for compression: ' + (err?.message || 'Unknown error')));
    };

    img.src = srcUrl;
  });
}

/**
 * Direct Google Drive Upload via Apps Script Webhook (Zero Blaze / 0 Billing)
 * Ratified under AC-DEC-2026-051 / AC-DEC-2026-052
 * 
 * Uses Content-Type: text/plain simple POST per PIOps api.js protocol
 * to eliminate browser CORS preflight (OPTIONS) failures.
 */
async function _uploadToDriveWebhook(base64Data, metadata = {}) {
  const webhookUrl = window.firebaseConfig?.driveUploadWebhookUrl;
  if (!webhookUrl) {
    throw new Error(
      "Google Drive Webhook URL is not configured. Please paste your deployed Apps Script URL into window.firebaseConfig.driveUploadWebhookUrl (see backend_gas/README.md)."
    );
  }

  const payload = {
    base64Data: base64Data,
    fileName: metadata.fileName || `look_${metadata.itemId || 'item'}_${Date.now()}.jpg`,
    mimeType: metadata.mimeType || 'image/jpeg',
    uploaderEmail: window.currentUser?.email || 'localhost_dev',
    itemId: metadata.itemId || '',
    lookIndex: metadata.lookIndex
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Media Relay Webhook network error: HTTP ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || `Media Relay upload failed with code: ${result.code || 'ERR_UNKNOWN'}`);
  }

  return result;
}

async function fsUploadLookPhoto(itemId, imageSource, metadata = {}) {
  if (!window.currentUser || !window.currentUser.email) {
    throw new Error("Unauthenticated: Google Sign-In with an authorized family account is required to upload candidate looks.");
  }
  if (!itemId) throw new Error("Missing itemId for candidate look upload.");
  if (!imageSource) throw new Error("No image data provided for upload.");

  // 1. High-Fidelity 2K Compression (2048px / 0.88 Quality)
  // Preserves zari weaves & jewelry detail while ensuring payload stays under 1.2MB
  let compressedDataUrl = '';
  if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
    const comp = await compressImage(imageSource, 2048, 0.88);
    compressedDataUrl = comp.dataUrl;
  } else if (imageSource instanceof Blob || imageSource instanceof File) {
    const comp = await compressImage(imageSource, 2048, 0.88);
    compressedDataUrl = comp.dataUrl;
  } else if (typeof imageSource === 'string' && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
    compressedDataUrl = imageSource;
  } else {
    throw new Error("Unsupported image source format.");
  }

  const provider = window.firebaseConfig?.storageProvider || 'drive_webhook';
  let photoUrl = '';
  let driveFileId = null;
  let storagePath = null;
  const timestamp = Date.now();
  const safeItemId = itemId.replace(/[^a-zA-Z0-9_-]/g, '_');

  // 2. Provider Strategy Dispatch (AC-DEC-2026-051 / AC-DEC-2026-052)
  if (compressedDataUrl.startsWith('http://') || compressedDataUrl.startsWith('https://')) {
    photoUrl = compressedDataUrl;
    if (window.DriveNormalizer && window.DriveNormalizer.isDriveUrl(photoUrl)) {
      driveFileId = window.DriveNormalizer.extractDriveId(photoUrl);
      photoUrl = window.DriveNormalizer.toThumbnailUrl(driveFileId, 2048);
    }
  } else if (provider === 'drive_webhook') {
    const relayResult = await _uploadToDriveWebhook(compressedDataUrl, {
      itemId: safeItemId,
      fileName: metadata.fileName || `${safeItemId}_${timestamp}.jpg`,
      mimeType: 'image/jpeg',
      lookIndex: metadata.lookIndex
    });
    driveFileId = relayResult.fileId;
    // Request 2048px resolution from Google UserContent CDN
    photoUrl = relayResult.cdnUrl || `https://lh3.googleusercontent.com/d/${driveFileId}=w2048`;
  } else if (provider === 'firebase_storage') {
    if (!storage) {
      throw new Error("Firebase Cloud Storage is not initialized on this client.");
    }
    const blob = dataUrlToBlob(compressedDataUrl);
    const rand = Math.random().toString(36).substring(2, 7);
    storagePath = `looks/${safeItemId}/${timestamp}_${rand}.jpg`;
    const fileRef = storageRef(storage, storagePath);

    const uploadResult = await uploadBytes(fileRef, blob, {
      contentType: 'image/jpeg',
      customMetadata: {
        itemId: safeItemId,
        uploadedBy: window.currentUser.email,
        uploadedAt: new Date().toISOString()
      }
    });
    photoUrl = await getDownloadURL(uploadResult.ref);
  } else {
    throw new Error(`Unknown storage provider: ${provider}`);
  }

  // 3. Compute next option index & build new option record
  const existingOptions = Array.isArray(metadata.existingOptions) ? [...metadata.existingOptions] : [];
  const maxIdx = Math.max(0, ...existingOptions.map(o => (o && typeof o.optionIndex === 'number') ? o.optionIndex : 0));
  const nextOptIndex = maxIdx + 1;

  const newOption = {
    optionIndex: nextOptIndex,
    isDefault: false,
    label: metadata.label || `Look ${nextOptIndex}`,
    src: photoUrl,
    referenceUrl: metadata.referenceUrl || (driveFileId ? `https://drive.google.com/file/d/${driveFileId}/view` : photoUrl),
    type: provider === 'drive_webhook' ? 'google_drive_upload' : (storagePath ? 'showroom_cloud_upload' : 'web_reference'),
    storageProvider: provider,
    driveFileId: driveFileId || null,
    storagePath: storagePath || null,
    store: metadata.store || '',
    priceTier: metadata.priceTier || '',
    addedAt: new Date().toISOString(),
    addedBy: window.currentUser.displayName || window.currentUser.email
  };

  // 4. Atomically persist to Firestore shopping_items/{itemId}
  const updatedOptions = [...existingOptions, newOption];
  await fsSetShoppingItemStatus(itemId, {
    options: updatedOptions,
    selectedOptionIndex: nextOptIndex
  });

  return newOption;
}

Object.assign(window, {
  fsDispatchChangeRequest, fsUpdateChangeRequestStatus, fsListenChangeRequests,
  fsSetTaskStatus, fsCreateAdhocTask, fsListenTaskStatus,
  fsSetShoppingItemStatus, fsCreateShoppingItem, fsListenShoppingItems,
  fsUploadLookPhoto, compressImage,
});
/* SSOT: docs/incidents/INC-092-dynamic-module-timing-race-and-unauthenticated-local-fallback.md — INC-092 */


