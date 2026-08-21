---
pattern: P66-P67-collection-ownership
activation_tier: reference            # reference | routed | guarded  (PACT-001)
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: "npm run preflight"           # executable enforcement (P68) + ESLint no-direct-collection-read
portability: repo-specific           # Firestore collection ownership is webapp-firebase specific
canonical_source: task-dashboard
porting_effort: medium
---

# P66 & P67 Pattern Catalog: Collection Ownership Contract

This document formalizes patterns `P66` (Divergent Fetch Strategy Prevention) and `P67` (Session-Layer Entity Fragmentation Prevention) as part of the Single Source of Truth (SSOT) collection governance contract.

---

## 1. Pattern Overview

### P66: Divergent Fetch Strategy Prevention
* **Definition**: A situation where different UI components or pages subscribe to or read the same data collection using inconsistent strategies (e.g., mixing real-time live subscriptions with static one-shot queries or inconsistent TTL caches).
* **Consequence**: The client session displays diverging, inconsistent states for the same resource concurrently, leading to visual mismatch and user confusion.

### P67: Session-Layer Entity Fragmentation Prevention
* **Definition**: A situation where client-side mutations or state updates fail to invalidate passive caches or trigger updates in independent components that read the same collection.
* **Consequence**: Stale entity states exist side-by-side with newly mutated entities within the same session.

---

## 2. Severity Rating (5 Dimensions)

| Dimension | Severity Rating | Description |
| :--- | :--- | :--- |
| **Data Integrity** | `CRITICAL (5/5)` | Stale caches or competing streams cause users to write state based on out-of-date records, causing silent database corruption. |
| **UX & Visual Consistency** | `HIGH (4/5)` | Different parts of the screen display conflicting values for the same field (e.g., active task status). |
| **Network & Database Overhead** | `MEDIUM (3/5)` | Inefficient, duplicate live listeners and cache misses increase Firestore read/query billing. |
| **Developer Cognitive Load** | `HIGH (4/5)` | Debugging silent sync issues becomes extremely difficult without a deterministic data-flow boundary. |
| **Maintainability Debt** | `HIGH (4/5)` | Adding new pages or widgets results in custom, ad-hoc datastore fetch logic, eroding architectural standards. |

---

## 3. Resolved Architectural Model (4 Layers)

To prevent `P66` and `P67`, all shared mutable collections must adhere to a strict **4-Layer Data Architecture**:

```
Layer 1: Datastore ────────► Remote database (Firestore / API)
Layer 2: Dedup Registry ───► Deduplicated query listener / subscription pool
Layer 3: Collection Owner ─► Context / Hook that owns all reads (Enforces P66)
Layer 4: Mutation Contract ─► Write success invalidates Layer 3/Caches (Enforces P67)
```

---

## 4. Confirmed Non-Issues Ledger

Below is the audited ledger of multi-collection contexts that have been verified as benign and safe under the ownership contract:

### A. ProjectContext
* **Target Collection(s)**: `projects`, `users`
* **Classification**: `INFERRED`
* **Evidence Link**: [ProjectContext.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/contexts/ProjectContext.jsx#L25-L29)
* **Reasoning**: Operates exclusively at the document level scoped strictly by known IDs (`doc(db, 'projects', projectId)` and `doc(db, 'users', userId)`). Establishes single-document subscriptions via the `useDocument` hook rather than collection-level live queries. It does not perform collection queries or compete with collection-level fetch strategies.

### B. TaskCreationContext
* **Target Collection(s)**: `projects`, `profiles`
* **Classification**: `INFERRED`
* **Evidence Link**: [TaskCreationContext.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/contexts/TaskCreationContext.jsx#L1278-L1279)
* **Reasoning**: Performs one-shot `getDoc` calls on individual project and profile documents scoped by known IDs. The reference to `collection(db, 'projects')` at line 1278 is exclusively passed to a `doc()` helper to fetch a specific document. No collection-level queries or listeners are executed.

### C. AuthContext
* **Target Collection(s)**: `users`, `profiles`
* **Classification**: `INFERRED`
* **Evidence Link**: [AuthContext.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/contexts/AuthContext.jsx#L65-L66)
* **Reasoning**: Retrieves single-document references (`users/{currentUser.uid}` and `profiles/{data.profileId}`) during authentication initialization and user claims synchronization. No live collection listeners or multi-document query boundaries are established.

### D. ProfileContext
* **Target Collection(s)**: `profiles`
* **Classification**: `INFERRED`
* **Evidence Link**: [ProfileContext.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/contexts/ProfileContext.jsx#L53) → [ProfileService.js](file:///d:/GitHub_Repo/Task-Dashboard/src/services/ProfileService.js#L57) → [ProfileUserMappingService.js](file:///d:/GitHub_Repo/Task-Dashboard/src/services/ProfileUserMappingService.js)
* **Reasoning**: Read confirmed as document-level via delegation chain: `ProfileContext` → `ProfileService.js:57` → `ProfileUserMappingService.getUserProfile(userId)`. Direct Firestore call is managed in `ProfileUserMappingService`, not `ProfileService`. The signature takes a known `userId`, meaning collection queries would be anomalous, classifying this read as `INFERRED` pending direct mapping layer inspection.
