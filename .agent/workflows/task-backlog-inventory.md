---
description: Reusable workflow to audit, filter, prioritize, and topologically sequence all pending tasks, gaps, technical debt, and incident follow-ups into a canonical inventory document.
triggers:
  - "/task-backlog-inventory"
  - "audit pending tasks"
  - "build task inventory"
  - "inventory backlog"
  - "topological task sequence"
  - "task backlog inventory"
---

# Task Backlog Audit & Inventory Workflow (`/task-backlog-inventory`)

Use this workflow to conduct a periodic, systematic audit of all pending enhancement tasks, architectural gaps, technical debt items, and incident follow-ups across the repository.

---

## 🎯 Objectives

1. **Comprehensive Extraction**: Audit all tracking surfaces (`ENHANCEMENTS.md`, `enhancement-notes/`, `docs/IMPLEMENTATION_GAPS.md`, `TECHNICAL_DEBT.md`, `.agent/technical-debt.md`, and `docs/incidents/`).
2. **Rigorous Triage**: Filter out completed/superseded work and separate meta/governance-only documentation items from actionable coding tasks.
3. **Topological Sequencing**: Map strict technical dependencies and categorize tasks into 4 Urgency Tiers (Tier 0 to Tier 3).
4. **Canonical Publishing**: Generate a structured Markdown inventory artifact under `User_Created/Discussion Threads/Direct_TaskWrite/{YYMMDD}_Pending Enhancement Tasks Inventory.md`.

---

## 📋 Execution Protocol

### Step 1: Multi-Surface Audit

Systematically inspect the following sources in order:

1. **Main Enhancement Registry**: [`ENHANCEMENTS.md`](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase/ENHANCEMENTS.md) — Inspect `PENDING` and `ACTIVE` sections.
2. **Enhancement Notes**: List [`enhancement-notes/`](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase/enhancement-notes) and inspect `00_PHASE_TRACKING_INDEX.md` or individual `00_ENHANCEMENT_INDEX.md` files.
3. **Implementation Gaps**: [`docs/IMPLEMENTATION_GAPS.md`](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase/docs/IMPLEMENTATION_GAPS.md) — Check Open/In-Progress `GAP-xxx` items.
4. **Technical Debt**: [`TECHNICAL_DEBT.md`](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase/docs/TECHNICAL_DEBT.md) & [`.agent/technical-debt.md`](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/technical-debt.md) — Check active `FF-xxx`, `INV-xxx`, and `DEBT-xxx` violations.
5. **Incidents**: List [`docs/incidents/`](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase/docs/incidents) — Extract unaddressed follow-up items and newly established structural invariants.

---

### Step 2: Triage & Classification

Classify each discovered item:

* ❌ **Exclude**: Completed, superseded, or rejected tasks.
* 📋 **Governance-Only**: Pure documentation/meta governance tasks (keep tracked in Markdown governance files; do not seed into project execution backlogs).
* 🟢 **Actionable Coding Tasks**: Concrete development, refactoring, security, or architectural tasks.

---

### Step 3: Dependency Mapping & Tier Assignment

Construct the topological dependency graph:

* **🔴 Tier 0: Critical Production Fixes & Hard Blockers**
  - Security vulnerabilities, live production errors, unhandled timeouts, missing router endpoints.
* **🟠 Tier 1: Core Module Enhancements & Data Aggregation**
  - High-value user features, data aggregator column population, multi-module integrations.
* **🟡 Tier 2: Governance, Artifact Synchronization & Testing Instrumentation**
  - E2E DOM instrumentation (P55), contract wiring (PACT-001/GAWC), automated verification scripts.
* **🟢 Tier 3: UX Polish, Performance & Secondary Refactoring**
  - Card detail tweaks, code deduplication, non-blocking STUB implementations, deferred React migrations.

Generate a **Mermaid DAG diagram** (`graph TD`) visualizing prerequisites and downstream dependencies.

---

### Step 4: Canonical Inventory Document Publishing

Create or overwrite the inventory file at:
`User_Created/Discussion Threads/Direct_TaskWrite/{YYMMDD}_Pending Enhancement Tasks Inventory.md`

#### Mandatory Structure:
1. **Title & Date Header**
2. **Executive Summary & Audit Scope**
3. **Topological Dependency Graph (Mermaid)**
4. **Sequenced Backlog Tables (Tier 0 to Tier 3)**:
   - Sequence # | Task ID | Category | Title & Scope | Primary Target Files / Scope
5. **Summary Statistics** (Total count per Tier)
6. **Recommended Next Steps**

---

### Step 5: Optional Direct Firestore Task Seeding

If requested by the user, invoke the direct task write workflow (`/task-firestore-direct-write`) to seed or update the actionable Tier 0–3 tasks into the live Task Dashboard / Firestore under the target project profile.
