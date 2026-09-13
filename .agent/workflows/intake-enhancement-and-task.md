<!-- shared:std.governance.task-intake-and-direct-write:start -->
# Universal Enhancement Intake & Task Direct-Write Workflow (`/intake-enhancement-and-task`)

> **Purpose**: Standardized, cross-repository workflow to take any proposal, bug discussion, or improvement thread, register it locally according to repository conventions, and seamlessly seed the task into the centralized Task Dashboard Firestore database (`pi-ops`).
> **Authority**: Governed by the Shared Alignment Protocol (SAP). Mandatory across Tier-1 and Tier-3 repositories.

---

## 🎯 When to Use
- When the user asks to:
  - *"Process this as a new enhancement and feed it to my task list"*
  - *"Create a task for this proposal in Task Dashboard"*
  - *"Intake this discussion thread into tasks"*
  - Invoke `/intake-enhancement-and-task` or `/task-firestore-direct-write`

---

## 📋 2-Phase Execution Lifecycle

```text
========================================================================================
             UNIVERSAL ENHANCEMENT INTAKE & TASK SEEDING PIPELINE
========================================================================================

  [ Input: Discussion Thread / Bug Report / Feature Proposal ]
                               │
                               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  PHASE 1: LOCAL REPOSITORY REGISTRATION                     │
  │  1. Check if repo uses an enhancement tracking system:       │
  │     • PIOperationsMgmt: `enhancement-config.json` ➔ PIO-XXX │
  │     • Task-Dashboard: `enhancement-config.json` ➔ TASK-XXX  │
  │     • Generic Repo: Create local proposal / issue note      │
  │  2. Scaffold local enhancement note + Definition of Done    │
  │  3. Register entry in local `ENHANCEMENTS.md` / Registry    │
  └────────────────────────────┬────────────────────────────────┘
                               │ (Passes Enhancement ID & Title)
                               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  PHASE 2: CENTRALIZED TASK-DASHBOARD SEEDING                │
  │  1. Auto-resolve `serviceAccountKey.prod.json`:             │
  │     • Local root OR fallback: `Task-Dashboard/` root        │
  │  2. Target Profile & Project Resolution:                    │
  │     • Project: `personal_coding`, `pe_ops`, `fcit`, etc.    │
  │     • Profile: `fcit_managing_director_01` (MD_Sir, Lvl 1)  │
  │  3. Schema Enforcement (`PROFILE_TASK_SCHEMA`):             │
  │     • `projectId`, `originProfileId`, `status: 'pending'`   │
  │  4. Firestore Admin Write + Subcollection Event:            │
  │     • Add doc to `tasks` collection                         │
  │     • Add doc to `tasks/{id}/events` (`TASK_CREATED`)       │
  │  5. Verify Write with `db-inspect.cjs task <taskId>`        │
  └─────────────────────────────────────────────────────────────┘
========================================================================================
```

---

## 🚀 Execution Steps

### Phase 1: Local Repo Registration

1. **Detect Local Enhancement System**:
   - If `enhancement-config.json` exists in repo root:
     - Read `next_id` and category mappings.
     - Create standalone/folder enhancement note in `enhancement-notes/{ID}-{Title}.md`.
     - Update local registry (`ENHANCEMENTS.md` or `ENHANCEMENT-MASTER-REGISTRY.md`).
     - Increment `next_id` in `enhancement-config.json`.
   - If repo does not use formal enhancement config:
     - Document the proposal in local `User_Created/Discussion Threads/` or `docs/proposals/`.

### Phase 2: Task-Dashboard Seeding (`pi-ops` Firestore)

1. **Resolve Firebase Admin Credentials**:
   - Check local `./serviceAccountKey.prod.json` or sibling `d:/GitHub_Repo/Task-Dashboard/serviceAccountKey.prod.json`.
2. **Execute Direct Write Script**:
   - Run a short Node.js admin script following `task-firestore-direct-write`:

```javascript
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

function getServiceAccount() {
  const candidates = [
    path.resolve('serviceAccountKey.prod.json'),
    path.resolve('../Task-Dashboard/serviceAccountKey.prod.json'),
    path.resolve('d:/GitHub_Repo/Task-Dashboard/serviceAccountKey.prod.json')
  ];
  const found = candidates.find(fs.existsSync);
  if (!found) throw new Error('serviceAccountKey.prod.json not found');
  return require(found);
}

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(getServiceAccount()) });
}
const db = admin.firestore();

async function createTask(payload) {
  const now = new Date();
  const taskDoc = {
    ...payload,
    status: 'pending',
    schemaVersion: 1,
    visibility: { lvl1: true, lvl2: true, lvl3: true, lvl4: true, lvl5: true },
    escalation: { isEscalated: false, currentLevel: 0, escalationPath: [], escalatedAt: null },
    createdAt: now,
    lastUpdatedAt: now,
    lastActivityAt: now.toISOString()
  };

  const docRef = await db.collection('tasks').add(taskDoc);
  await db.collection('tasks').doc(docRef.id).collection('events').add({
    type: 'TASK_CREATED',
    createdAt: now,
    createdBy: payload.createdBy,
    meta: {
      title: payload.title,
      priority: payload.priority,
      assignedProfileId: payload.assignedTo.profileId,
      source: 'intake-enhancement-and-task'
    }
  });

  return docRef.id;
}
```

3. **Verify with DB Inspector**:
   - Inspect created doc:
     ```bash
     node d:/GitHub_Repo/Task-Dashboard/src/scripts/db-inspect.cjs task <taskId>
     ```
   - Confirm active profile visibility for `goldenage399@gmail.com` (MD_Sir, Level 1).

---

## 🛡️ Invariants & Guardrails
- **ARCH-INV-012**: Every task creation MUST log a `TASK_CREATED` event in the `tasks/{id}/events` subcollection.
- **INV-PROFILE-ASSIGN**: Tasks MUST assign to an organizational profile (e.g., `fcit_managing_director_01`), never directly to an unlinked user UID.
- **INV-LOCATION-ISOLATION**: If the task originates in a location-specific repo (like PIO), the `projectId` or description MUST preserve the location context.
<!-- shared:std.governance.task-intake-and-direct-write:end -->
