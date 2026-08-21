---
pattern: recurring-checklist-crud-playbook
activation_tier: reference
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Recurring Checklist CRUD Playbook

**Category**: Process Pattern / Methodology
**Applies to**: Any create/update/delete on `checklist_templates`, `checklist_instances`, or item-level state (check/uncheck, remark, attribution) in the Recurring Checklists & Positional Routines system (`SSOT-ROUTINES-001`, ADR-029).
**Origin**: 2026-08-20 — Operations Manual ingestion proposal review (`260820_Operations_Manual_Ingestion_Proposal.md`). Consolidates 6+ separate re-derivations from the same session (item attribution gap, mandatory-remark gating, P81 modal registration, `projectId`/'all' elimination) that each cost a fresh investigation.
**Status**: HYPOTHESIS (compiled from this session's evidence; not yet reused in a second distinct session)

---

## Pattern — Order of Operations by CRUD Target

### Problem
Recurring-checklist work spans 4 write surfaces (`RecurringChecklistsPage.jsx`, `MyDayPage.jsx`/`OperationalRoutinesSection.jsx`, `PositionWorkspacePage.jsx`/`PositionRoutinesTab.jsx`, `TemplateEditorModal.jsx`) and 2 collections with duplicated-but-must-agree fields (`sections[]` vs flattened `items[]`). Each new touch (add a template field, add a new modal, change scoping) has historically required re-discovering which files need parallel edits, in what order — from scratch, by grep — because the SSOT documents the schema (what) but not the procedure (how to change it safely).

### Why it happens
The SSOT (`RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md`) is a reference doc, not a runbook — it says what the shape of a `ChecklistTemplate` is, not what order to touch things in or which of the 3 worker surfaces you'll forget if you're not told to check all 3. Two prior sessions (INC-081-adjacent item-attribution gap; the mandatory-remark rollout) each independently re-derived "there are 3 toggle handlers, not 1" the hard way.

### Solution — checklist by operation type

**A. Authoring/editing a template (`checklist_templates`)**
1. Anchor to exactly **one** concrete `projectId` — never `'all'`. This is a ratified rule (SSOT §3.1): *"The generic `'all'` option is eliminated to prevent cross-project tenant data leakage."* If content needs to reach positions across multiple projects, author **one template per project**, not one template spanning several — there is no multi-project field and adding one would reopen a decision already closed.
2. Scope via `scopeProfileIds` (position IDs), not just the project anchor — an empty array means visible to *every* position in the org, which is almost never the intent for an outlet-specific routine.
3. **The position itself must also be single-project.** Every live profile doc follows `id = <projectId>_<designation>_<NN>` with a **scalar** `projectId` — none use the `projectAssignments[]` array `ProfileUserMappingService.core.js` falls back to; that path is unused in practice (checked all 30 live profiles, 2026-08-20). A role covering multiple outlets needs one profile **per outlet**, not one shared cross-project profile with an invented prefix — a `restaurant_ops_coordinator_01`-style ID (no such project exists) is the exact failure mode this step exists to catch.
4. Write both `sections[]` (hierarchical, ADR-029) and the flattened `items[]` mirror. `RecurringChecklistService.createTemplate`/`updateTemplate` derive one from the other automatically if you pass either — don't hand-write only one and skip the call.
5. Reuse a `SECTION_ARCHETYPES` preset from `checklistPresets.js` before hand-authoring section headings/guidance text — 6 presets (Opening, Financial Audit, Mid-Shift, Closing, Safety, Inventory) already cover the common shift patterns this domain needs.
6. Verify visibility with **two independent gates**, both must pass: (a) the target profile's own `projectId` equals the template's `projectId` — this is what populates the position picker in `AuditAndComplianceTab.jsx`, not the template, and per step 3 it's always a single scalar match, never a multi-project lookup; (b) `scopeProfileIds` includes that profile ID. Checking only one and assuming the template "should" show up is the failure mode.
7. For a genuinely unoccupied seat, use the repo's real vacant-position convention (`vacant_position_001`): `status: "vacant"`, `currentUser: null` — not an `active`/`isActive` flag, which every occupied profile also sets `true` regardless of vacancy.

**B. Instance generation (read-or-create for a period)**
Follow `.agent/patterns/lazy-periodic-instance-generation.md` in full — do not restate it here. Core rule: never write a background/cron pre-generation job (Spark plan has no Cloud Scheduler); every read path converges on `RecurringChecklistService.getOrCreateInstance()`.

**C. Item-level mutation (check/uncheck)**
1. A toggle handler change must be applied to **all 3** worker surfaces in the same pass — `RecurringChecklistsPage.jsx`, `MyDayPage.jsx`/`OperationalRoutinesSection.jsx`, `PositionWorkspacePage.jsx`/`PositionRoutinesTab.jsx`. Editing one and assuming the others inherit it is the exact gap that shipped `checked`-only writes with no `checkedAt`/`checkedBy` for an unknown number of sprints.
2. `checkedAt`/`checkedBy` are written on every check, nulled on uncheck (SSOT §5a).
3. If `item.required === true`, the check must be intercepted by `ChecklistItemRemarkModal` before it commits — mandatory remark gated on the **per-item** `required` flag, never made universal (Council 260819 AMENDMENT explicitly rejected universal enforcement as a fatigue-trap that degrades into placeholder text).
4. `remark` is preserved on uncheck — only `checkedAt`/`checkedBy` null out. Don't wipe evidence on a correction.

**D. Adding a new modal/UI element inside this system**
New root `id`/`data-testid` on a modal → it must be registered in the P81 layout catalog *before* commit, or preflight fails. Follow `.agent/patterns/p81-id-registration-process.md`; rebuild with `npm run cache:build:layout` after adding the CSS stub.

**E. Before calling any checklist CRUD change done**
- [ ] `npm run preflight` — covers P11 (file size), `P-CASE` (case-insensitive status/project queries), `P105`/`P-POS-ROUTINE` (workspace/audit isolation).
- [ ] `RecurringChecklistService.test.js` and `OperationalRoutinesSection.test.jsx` still pass.
- [ ] If the schema/contract changed, `RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md` §5 is updated in the same change — don't let the SSOT drift from the code it documents.

### Failure Mode
Skipping step A.1 (single concrete `projectId`) reopens a tenant-leakage decision the SSOT already closed — a template shows up under every project's audit console forever, not just the ones it's relevant to. Skipping C.1 (all 3 surfaces) ships attribution/remark logic that silently works from one entry point and silently doesn't from the other two — the exact shape of the 2026-08-19 gap this pattern was compiled from.

### Task-Dashboard instance
- Single-project-anchor rule: [RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md §3.1](../../docs/ssot/architecture-hub/RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md), enforced nowhere in code today (no automated guard rejects `projectId: 'all'` on write) — the rule is currently procedural/documentary only.
- 3-surface toggle handler requirement: `RecurringChecklistsPage.jsx`, `MyDayPage.jsx`, `PositionWorkspacePage.jsx` (all three extended in the same 2026-08-19 session after the gap was found — see `RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md` §5a).
- Project-anchor vs. audit-console visibility gates: `AuditAndComplianceTab.jsx` (`matchProj`/`matchPos`, lines ~122-125) and `ProfileUserMappingService.core.js` (`getProfilesByProject` — the scalar `profile.projectId` fallback is the one live data actually hits; its `projectAssignments[]` branch is unused by any of the 30 live profiles, checked 2026-08-20).
- Naming-convention violation caught in review: `260820_Operations_Manual_Ingestion_Proposal.md` §6.0 — `restaurant_ops_coordinator_01` and `pe_ops_auditor_01` both used a project prefix that didn't match the position's actual (multi-)project scope; corrected to one profile per project.
