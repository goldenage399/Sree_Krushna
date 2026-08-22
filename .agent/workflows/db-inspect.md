---
description: Database Live Data Inspection Workflow - Audit and verify live Firestore states safely using the admin SDK.
---

# Database Live Data Inspection Workflow (db-inspect)

This workflow governs the usage of the Firestore Admin SDK inspect scripts (`db-inspect.cjs`, `db-verify-assignments.cjs`, etc.) to run live data inspect operations on the `pi-ops` project safely and consistently.

---

## 🧭 Decision Tree & Entry Gate

Use this workflow when you need to:
- Inspect user profile assignments or positional linkages.
- Examine a specific task document's audit logs/history.
- Run a live query simulation to check visibility rule alignment.
- Verify consistency of structural database collections (`users`, `profiles`, `projects`, `tasks`).

```
[Need Live Data?]
       │
       ▼
[Is Client-Side Query Enough?] ──(Yes)──> Use browser debugger / local prints
       │
      (No)
       ▼
[Check P53 Prerequisites] 
       │
  (All Met?) ──(No)──> STOP: Get serviceAccountKey.json / configure env
       │
     (Yes)
       ▼
[Execute Specific Inspector Script Command]
```

---

## 🔑 Phase 1: Pre-Flight Checklist (P53 Governance)

Before executing any script, ensure:
1. **Key Existence**: `serviceAccountKey.json` must be present at the workspace root directory.
2. **Key Reference**: Never write hardcoded credentials in scripts. Scripts must use the resolved credential hierarchy:
   `serviceAccountKey.prod.json` ➔ `serviceAccountKey.json` ➔ `SA_KEY` environment variable.
3. **Target Parity**: Validate your local `.env` file's project ID targets the intended database environment.

---

## 🛠️ Phase 2: Live Inspection Command Matrix

Execute commands in the terminal using the npm interface:

### 1. High-Level Summary Auditing
```powershell
# Get live database summary counts and layout configuration
npm run db:overview
```

### 2. Context Simulating & Visibility Gap Auditing
```powershell
# Simulate query constraint evaluation for a user email or UID
npm run db:simulate -- "user@example.com"
```

### 3. Target Inspection by Resource ID
Use the specific flags for targeted entity verification:
```powershell
# Inspect user record and linked assignments
npm run db:user -- "user@example.com"

# Inspect task details and field audit logs
npm run db:task -- "TASK_ID_HERE"

# Inspect profile/role definition and associated tasks
npm run db:profile -- "PROFILE_ID_HERE"

# Inspect project metrics, profiles, and associated tasks
npm run db:project -- "PROJECT_ID_HERE"
```

### 4. Search and Consistency Verification
```powershell
# Keyword search across active and archived tasks
npm run db:search -- "search-term"

# Verify 100% profile assignments ↔ task linkage matching consistency
npm run db:verify:assignments
```

---

## 🛑 Phase 3: Safety Guardrails & Restrictive Invariants

- **Write Operations**: Never perform write operations, data deletions, or modifications through inspection scripts unless explicitly instructed or running a specific audited script (e.g. `db-clean-roles.cjs`).
- **No Sync I/O Loops (Protocol #33)**: Ensure any custom script additions fetch bulk collections first, construct a map, and then match in-memory. **Never query Firestore inside a loop.**
- **No Client SDK Bypass**: Do not attempt to bypass Firestore security rules by putting service account logic inside client-facing source code (`src/`).
