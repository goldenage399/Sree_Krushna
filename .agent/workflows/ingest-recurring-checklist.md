# Ingest Recurring Checklist Workflow (`ingest-recurring-checklist.md`)

**Workflow Identifier**: `WFL-CHECKLIST-INGEST-001`  
**Applies to**: Ingesting any new operational manual, shift checklist, SOP, or spreadsheet into the profile-centric recurring checklist system.  
**Governing SSOT**: [`RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md`](../../docs/ssot/architecture-hub/RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md) (`SSOT-ROUTINES-001`)  
**Governing Pattern**: [`.agent/patterns/recurring-checklist-crud-playbook.md`](../patterns/recurring-checklist-crud-playbook.md)  
**Registered Standards**: `P-POS-ROUTINE` (`P105`), `P-CASE`, `P11`, `P66-P67`  

---

## 🧭 Purpose

This workflow provides a standardized, agnostic, and repeatable 4-phase procedure for translating raw business operations manuals, shift SOPs, or spreadsheet checklists into live, project-anchored, and position-scoped `checklist_templates` in Firestore.

---

## 📋 4-Phase Ingestion Lifecycle

```
Phase 1: Source Document Decomposition & Triage
   │  (Parse TSV/CSV/Doc → Filter Active vs. 'Stop' items → Extract Cadences & Links)
   ▼
Phase 2: Positional Scoping & Profile Alignment
   │  (Inspect live profiles → Enforce single-project naming → Seed vacant seats)
   ▼
Phase 3: Project-Anchored Template Authoring
   │  (Single projectId → scopeProfileIds → sections[] & items[] → required gating)
   ▼
Phase 4: 4-Gate Automated Verification
      (Worker Scoping → Supervisor Audit Console → Zero Leakage → Structural Invariants)
```

---

## 🛠️ Step-by-Step Procedure

### Phase 1: Source Document Decomposition & Triage

1. **Parse & Structure the Raw Input**:
   - Read the source document (`.tsv`, `.csv`, `.md`, or spreadsheet).
   - Identify hierarchy levels (Lvl 1 Module/Role, Lvl 2 Section/Sub-role, Lvl 3 Item).
2. **Filter Active vs. Deprecated Items**:
   - **Active Items**: Real operational verifications, shift handovers, and compliance checks.
   - **`Stop` / Deprecated Items**: Legacy manual copy-pasting, handwritten logs, or intermediate spreadsheet syncs replaced by the dashboard. Exclude these from active templates.
3. **Extract Cadences & Links**:
   - Assign cadences: `daily`, `weekly`, or `monthly`.
   - Extract reference URLs (Google Sheets, Notion, training links) to embed as markdown links in item labels or section subheadings.
   - Identify "Upload Photo" / evidence requirements to guide mandatory remarks.

---

### Phase 2: Positional Scoping & Profile Alignment

1. **Inspect Live Firestore Profiles**:
   - Run `node src/scripts/db-inspect.cjs overview` to check existing project IDs and profile IDs.
2. **Enforce Single-Project Positional Invariants**:
   - **ID Convention**: `id = <projectId>_<designation>_<NN>` (e.g. `ffc_delta_coordinator_01`).
   - **Scalar `projectId`**: Every profile MUST belong to exactly one project. A role spanning multiple projects (e.g. Area Coordinator) MUST be split into one profile per project.
   - **Position-First Naming**: Title roles by functional seat (e.g. *Delta Operations Coordinator*), never hardcoding individual person names into profile IDs.
3. **Seed Vacant vs. Occupied Profiles**:
   - **Vacant Seats** (Unassigned floor roles, pending hires):
     ```javascript
     {
       id: 'ffc_delta_service_manager_01',
       title: 'Delta Service Manager',
       name: 'Delta Service Manager',
       projectId: 'ffc_delta',
       project: 'FFC Delta',
       lvl: 4,
       designation: 'supervisor',
       department: 'Operations',
       status: 'vacant',
       currentUser: null
       // isActive is deliberately omitted for vacant seats
     }
     ```
   - **Occupied Seats**: Add profile ID to `userData.profileAssignments` with `isActive: true`.

---

### Phase 3: Project-Anchored Template Authoring

1. **Single-Project-Anchor Rule (`SSOT-ROUTINES-001 §3.1`)**:
   - Every `checklist_templates` doc MUST have exactly one concrete `projectId`.
   - Never use `projectId: 'all'`. If a routine applies across N outlets, create N distinct templates.
2. **Scope by Position Role**:
   - Set `scopeProfileIds: ['<projectId>_<designation>_<NN>']`.
3. **Multi-Heading Section Architecture (ADR-029)**:
   - Structure items into logical `sections[]` (e.g. Opening Shift, Cashier Audit, Closing Handover).
   - Reuse section archetypes from `src/components/checklists/checklistPresets.js`.
4. **Dual `sections[]` and `items[]` Synchronization**:
   - Pass both hierarchical `sections[]` and the flattened `items[]` array to guarantee compatibility across worker execution and legacy query paths.
5. **Mandatory Remark Gating on Required Items**:
   - Set `required: true` on critical compliance items. This triggers `ChecklistItemRemarkModal` upon checking, requiring non-empty evidence before committing.
   - Set `required: false` on routine/optional items for 1-click toggling.

---

### Phase 4: 4-Gate Automated Verification

Run an automated verification script (e.g. `node src/scripts/verify_operations_manual_routines.cjs`) asserting:

1. **Gate 1 — Worker Position Scoping**:
   - User assigned to Profile P sees only templates scoped to Profile P.
   - Zero unassigned profile pollution (`P-POS-ROUTINE` / `P105`).
2. **Gate 2 — Supervisor Audit & Compliance Visibility**:
   - `AuditAndComplianceTab` filtered to Project X displays all Project X templates.
3. **Gate 3 — Zero Cross-Project Tenant Leakage**:
   - Templates anchored to Project A never appear in Project B's audit console.
4. **Gate 4 — Structural Invariants & Preflight**:
   - `npm run preflight` exits with Code 0.
   - `npx vitest run` passes with 100% green tests.

---

## 📁 Standard Script Fleet for Ingestion

When ingesting a new manual, scaffold these standard scripts in `src/scripts/`:

1. `src/scripts/seed_<domain>_profiles.cjs` $\rightarrow$ Upserts positional profiles into Firestore.
2. `src/scripts/seed_<domain>_templates.cjs` $\rightarrow$ Upserts `checklist_templates` with sections and items.
3. `src/scripts/verify_<domain>_routines.cjs` $\rightarrow$ Executes the 4-gate verification suite.
