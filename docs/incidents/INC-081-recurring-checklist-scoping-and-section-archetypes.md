# INC-081 — Recurring Checklist Global Position Pollution, Unscoped Routine Workspace, and Missing Section Archetypes

**Incident ID**: INC-081  
**Date**: 2026-08-14  
**Severity**: Medium (Architectural Scoping & Usability Gap)  
**Governing ADRs/Standards**: `ADR-001`, `ADR-015`, `ADR-029`, `P-CASE`, `P105`  
**Affected Components**: `src/pages/RecurringChecklistsPage.jsx`, `src/components/checklists/PositionRoutinesTab.jsx`, `src/components/checklists/AuditAndComplianceTab.jsx`, `src/components/checklists/TemplateEditorModal.jsx`, `src/components/checklists/checklistPresets.js`

---

## 1. Incident Summary

During operational testing of the Recurring Checklists and Positional Routines system (`/checklists`), several architectural gaps and presentation defects were identified:
1. **Global Position Profile Pollution**: The worker-facing **Position Workspace** loaded and rendered all organization profiles from Firestore indiscriminately, resulting in 30+ empty position pills on the screen for positions the current user was not assigned to.
2. **Lack of Supervisor Audit Boundary**: Super Admins and Project Admins lacked a dedicated audit console to inspect subordinate positions and past shift compliance without muddying their own personal operational workspace.
3. **Unanchored / Cross-Project Template Authoring**: Template authoring allowed creating unanchored routines with missing or unconstrained project IDs, risking cross-project boundary blur and tenant data leakage.
4. **Unlabeled Section Headings & Missing Presets**: The multi-heading section editor presented two unlabeled side-by-side inputs without guidance micro-labels or quick-insert standard presets, forcing admins to author common operational phases (Opening, Financial Audit, Closing Handover) from scratch.
5. **Firestore Status Query Casing Divergence**: Profile retrieval using hardcoded `where('status', '==', 'active')` failed on legacy/seeded documents lacking the `status` string field or using capitalized variants (`P-CASE`).

---

## 2. Root Cause Analysis

1. **Missing Separation of Concerns**: The `/checklists` page initially combined worker execution and supervisor inspection into a single un-scoped view rather than separating Worker Cockpit from Administrative Oversight.
2. **Naive Profile Fetching**: `ProfileCRUDService.getActiveProfiles()` was mapped directly to UI pills without filtering against `userData.profileAssignments` / `user.profileId`.
3. **Authoring UX Deficit**: Section inputs lacked micro-labels (`Section Heading *` vs `Shift Guidance`) and did not supply reusable industry archetypes (Opening, Closing, Financial, Safety).

---

## 3. Architectural Surface Mapping (6 Surfaces)

| Surface | Impact & Verification |
|---|---|
| **1. UI Surface** | • Upgraded `PositionRoutinesTab.jsx` with adaptive scope bar (auto-hides on single-role accounts; filters to assigned roles).<br>• Built dedicated `AuditAndComplianceTab.jsx` with Project selector, position hierarchy grid, live shift audit, and historical compliance ledger.<br>• Added explicit micro-labels and 1-click `SECTION_ARCHETYPES` in `TemplateEditorModal.jsx`. |
| **2. Data Surface** | • Enforced strict project anchoring on `checklist_templates` (`projectId` mandatory; `"all"` eliminated).<br>• Casing normalization across `projectAssignments`, `projectId`, and profile names. |
| **3. Reactive Surface** | • Memoized `activeProfileIds` derived from `userData.profileAssignments` with fallback to `userData.profileId`.<br>• Isolated tab state between `workspace` and `audit`. |
| **4. Service Surface** | • Fixed `ProfileCRUDService.getActiveProfiles()` to handle documents without explicit `status` field.<br>• Enhanced `ProfileUserMappingServiceCore.getProfilesByProject()` with case-insensitive multi-field matching (`delta`, `fcit`, `git`, `ffc`). |
| **5. Module Surface** | • Extracted `checklistPresets.js` to prevent `TemplateEditorModal.jsx` from breaching the 800-line hard ceiling (`P11`). |
| **6. Governance Surface** | • Registered Pattern: `.agent/patterns/position-routine-workspace-vs-audit-scoping.md`.<br>• Registered Standard: `P105` in `.agent/standards-catalog.json` and `GEMINI.md`.<br>• Authored canonical SSOT: `docs/ssot/architecture-hub/RECURRING-CHECKLISTS-AND-ROUTINES-SSOT.md`. |

---

## 4. Corrective Action & Verification

1. **Separation of Concerns**: Implemented user-scoped workspace in `PositionRoutinesTab.jsx` and dedicated supervisor console in `AuditAndComplianceTab.jsx`.
2. **1-Click Archetypes**: Implemented `SECTION_ARCHETYPES` (`🌅 Opening Shift`, `📊 Financial Audit`, `🔄 Mid-Shift Audit`, `🌙 Closing Handover`, `🛡️ Safety & Compliance`, `📦 Inventory Audit`).
3. **Automated Unit Tests**: Verified `18/18` passing unit tests in `RecurringChecklistService.test.js` and `OperationalRoutinesSection.test.jsx`.
4. **Preflight Scan**: `npm run preflight` returns **Exit Code 0**.
