---
pattern: position-routine-workspace-vs-audit-scoping
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "position routines workspace"
  - "recurring checklist scoping"
  - "audit and compliance tab"
  - "all positions showing in workspace"
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Position Routine Workspace vs. Audit Scoping Pattern

**Category**: Architectural Scoping & UI Isolation Methodology
**Applies to**: Role-based operational routines, recurring checklists, supervisor audit consoles (`ADR-001`, `ADR-015`, `ADR-029`).
**Origin**: 2026-08-14 — Positional Routine & Recurring Checklist System Upgrade (INC-081).
**Status**: VALIDATED (Validated in `RecurringChecklistsPage.jsx`, `PositionRoutinesTab.jsx`, `AuditAndComplianceTab.jsx`, and `MyDayPage.jsx`).

---

## Pattern — Workspace vs. Audit Scoping Separation

### Problem
When building operational systems for role-based positions (e.g., Cashier, Shift Lead, Operations Coordinator, Super Admin), displaying all global organization positions or project positions on the worker's operational cockpit creates cognitive overload, empty-pill pollution, and violates accountability boundaries. Workers see 30+ position buttons they don't occupy, while supervisors lack a centralized, structured console to audit subordinate routines across shifts.

### Why it happens
A naive implementation treats a checklist or routine viewer as a single universal component with a global "Filter by Position" selector that fetches all profiles across the database without checking whether the active user actually occupies those positions.

### Solution
Enforce a hard architectural boundary between **Worker Execution** and **Administrative Oversight**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. WORKER POSITION WORKSPACE (/checklists & /my-day)                   │
├────────────────────────────────────────────────────────────────────────┤
│ • Scoped strictly to positions assigned to the active user             │
│   (userData.profileAssignments / userData.profileId).                  │
│ • Adaptive Scope Bar:                                                  │
│   - Single-position workers: Scope bar automatically hidden.           │
│   - Multi-position workers: Shows only their assigned positions.       │
│ • Zero unassigned position cards or empty pills rendered.              │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 2. ADMINISTRATIVE AUDIT & OVERSIGHT CONSOLE (Level 1–3)                │
├────────────────────────────────────────────────────────────────────────┤
│ • Dedicated administrative view for Super Admins & Project Admins.     │
│ • Project Selector: Anchor to a concrete project (no global dumps).    │
│ • Position Hierarchy Grid: Browse all subordinate roles in project.    │
│ • Live Shift Audit: Inspect active checks, required items, progress.   │
│ • Historical Compliance Ledger: Full submission audit trail & notes.   │
└────────────────────────────────────────────────────────────────────────┘
```

### Failure Mode
If this pattern is violated:
1. Operational workers get confused by unassigned position routines appearing on their screens.
2. Admins have to simulate or fake profile assignments just to audit whether subordinates completed their shift routines.
3. Templates created without concrete project anchors pollute cross-project boundaries and cause tenant data leakage.

### Task-Dashboard Instance
- [`src/pages/RecurringChecklistsPage.jsx`](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/RecurringChecklistsPage.jsx): Implements the tab switcher between `💼 Position Workspace` (worker-scoped) and `🛡️ Audit & Oversight` (Level 1–3).
- [`src/components/checklists/PositionRoutinesTab.jsx`](file:///d:/GitHub_Repo/Task-Dashboard/src/components/checklists/PositionRoutinesTab.jsx): Adaptive scope bar filtering to `activeProfileIds`.
- [`src/components/checklists/AuditAndComplianceTab.jsx`](file:///d:/GitHub_Repo/Task-Dashboard/src/components/checklists/AuditAndComplianceTab.jsx): Dedicated audit console with project dropdown, position grid, and live/historical shift review.
- [`src/components/checklists/TemplateEditorModal.jsx`](file:///d:/GitHub_Repo/Task-Dashboard/src/components/checklists/TemplateEditorModal.jsx): Project-anchored authoring with dynamic position role loading and 1-click section archetypes.
