# Direct Firestore Task Write Workflow (`/task-firestore-direct-write`)

> **Context**: Use this workflow when asked to "create a task", "batch import tasks", "seed pending tasks", or "log task to dashboard" directly via script or CLI, bypassing the browser UI wizard.
> **Authority**: Enforces `firestore.rules` compliance, `PROFILE_TASK_SCHEMA` validation, and subcollection `TASK_CREATED` event logging.

---

## 🛫 Step 1: Pre-Flight Discovery & Context Resolution

Before creating any task document, resolve the exact **Project ID** and **Assignee Profile ID** from the live database.

1. **Inspect Projects & Profiles**:
   ```bash
   node src/scripts/db-inspect.cjs overview
   ```
2. **Find Target Profile**:
   - Tasks map to **organizational profiles** (e.g., `fcit_managing_director_01` or personal admin profile), **not** individual UIDs.
   - Run profile inspection:
     ```bash
     node src/scripts/db-inspect.cjs profile <profileId>
     ```
   - Verify `profileId`, `name`/`profileTitle`, `department`, `lvl`, and `projectId`.

3. **Check `firestore.rules` Requirements**:
   Confirm your payload includes mandatory security rules keys:
   - `projectId` (string, doc ID of project, e.g., `"fcit"`)
   - `originProfileId` (string, must equal `assignedTo.profileId`)
   - `createdBy.uid` (or `.userId`) matching active actor or admin level

---

## 🛠️ Step 2: Schema Payload Verification

Ensure the task document object adheres strictly to the `PROFILE_TASK_SCHEMA` ([profileTaskSchema.js](file:///d:/GitHub_Repo/Task-Dashboard/src/utils/profileTaskSchema.js)):

```js
const taskDoc = {
  title: "Task Title Here",
  description: "Detailed description of work to be performed",
  priority: "high", // 'low' | 'medium' | 'high' | 'critical'
  project: "Personal Coding Project", // Display name
  projectId: "personal_coding_project", // REQUIRED doc ID
  category: "Enhancement",
  department: "System Administration",
  status: "pending", // Canonical status: lowercase 'pending'
  tags: ["enhancement", "personal"],
  originProfileId: targetProfileId, // REQUIRED by firestore.rules
  schemaVersion: 1,
  assignedTo: {
    profileId: targetProfileId,
    profileTitle: "Super Admin",
    department: "System Administration",
    lvl: 1,
    assignedAt: new Date()
  },
  createdBy: {
    profileId: targetProfileId,
    profileTitle: "Super Admin",
    department: "System Administration",
    lvl: 1,
    uid: targetUserId
  },
  visibility: { lvl1: true, lvl2: true, lvl3: true, lvl4: true, lvl5: true },
  escalation: { isEscalated: false, currentLevel: 0, escalationPath: [], escalatedAt: null },
  createdAt: new Date(),
  lastUpdatedAt: new Date(),
  lastActivityAt: new Date()
};
```

---

## ⚡ Step 3: Write Document & Create Event Subcollection

1. **Write Document**:
   Use `firebase-admin` Firestore SDK (`db.collection('tasks').add(taskDoc)`) or Admin API script.

2. **Write Subcollection Event (ARCH-INV-012 / P92)**:
   Every task write MUST append a creation event document under `tasks/{taskId}/events`:
   ```js
   await db.collection('tasks').doc(taskId).collection('events').add({
     type: 'TASK_CREATED',
     createdAt: new Date(),
     createdBy: taskDoc.createdBy,
     meta: {
       title: taskDoc.title,
       priority: taskDoc.priority,
       assignedProfileId: targetProfileId
     }
   });
   ```

---

## 🔍 Step 4: Verification & Audit

Verify the newly created task document exists and parses cleanly:
```bash
node src/scripts/db-inspect.cjs task <newTaskId>
```

Verify:
- [ ] Task is readable by target profile permissions
- [ ] `projectId` matches active project
- [ ] `originProfileId` equals `assignedTo.profileId`
- [ ] `status` is lowercase `'pending'`

---

## 🧹 Step 5: Clean Up Scratch Scripts

Delete any temporary throwaway JS files created during the batch operation.
