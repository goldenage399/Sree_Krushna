# INC-026: Per-Page PageContainer Width Drift — ProfileManagementHub vs AdminUsersPage

**Date**: 2026-06-24
**Severity**: Medium (visual inconsistency, no data loss)
**Branch**: eur-001/m6-ingestion
**Resolution**: Centralized layout registry (`src/config/pageLayouts.js`) consumed by `DashboardLayout`

---

## Symptom

`ProfileManagementHub` and `AdminUsersPage` are structurally identical (header + metric cards + table), yet `ProfileManagementHub` rendered edge-to-edge across the full `<main>` viewport while `AdminUsersPage` was centered at 72rem (`standard` width). Screenshots confirmed the width disparity; the two pages were visually inconsistent despite identical layout intent.

---

## Root Cause

`AdminUsersPage` wrapped its return in `<PageContainer width="standard">`. `ProfileManagementHub` had no `PageContainer` at all — it returned a bare `<div>` that filled the flex-1 `<main>` container. The absence of a width constraint was invisible until both pages were compared side by side.

The underlying cause is architectural: **width constraints were distributed across page components as per-page ownership**. Each page independently decided whether to apply a `PageContainer` and at what width. There was no central registry, no enforcement, and no visible gap when a page was created without one.

---

## Architectural Surface Mapping

| Surface | Affected? | Detail |
| :--- | :--- | :--- |
| **UI Surface** | ✅ YES | `ProfileManagementHub` root had no `PageContainer`; rendered fluid inside flex-1 `<main>` |
| **Data Surface** | ❌ N/A | No Firestore schema, rules, or data layer involved |
| **Reactive Surface** | ❌ N/A | No state, context, or hook interaction involved |
| **Service Surface** | ❌ N/A | No Cloud Functions, APIs, or external services involved |
| **Module Surface** | ❌ N/A | Both pages were correctly routed; routing registration was not the gap |
| **Governance Surface** | ✅ YES | No architectural rule existed requiring pages to register in a central layout authority; per-page `PageContainer` ownership was an implicit convention with no enforcement |

---

## Resolution

Introduced `src/config/pageLayouts.js` — a static route → `{ width, className, id, testId }` registry consumed once in `DashboardLayout`. DashboardLayout now wraps all `children` in a `PageContainer` sized by the registry entry. Eight page files had their outer `PageContainer` removed (replaced with Fragments). `ProfileManagementHub` required zero file changes — adding it to the registry with `width: 'standard'` was sufficient.

The full-viewport route (`/tasks/create`) was moved to a `{ bypass: true }` registry entry, eliminating the hardcoded `isFullViewportPage` conditional from `DashboardLayout`.

---

## Invariant Established

> **Layout width constraints must be declared in the layout shell registry (`pageLayouts.js`), not in the page component.** Page components must not own outer width constraints — the shell owns the constraint, the page owns its internal content.

Registered as FKL-DI-010 in `docs/ssot/ui-design/spokes/RESPONSIVE-DESIGN.md`.

---

## Files Changed

- **Created**: `src/config/pageLayouts.js` (28 route entries)
- **Modified**: `src/App.jsx` — `DashboardLayout` consumes registry, `isFullViewportPage` removed
- **Modified** (outer PageContainer removed): `AdminUsersPage.jsx`, `MyTasksPage.jsx`, `LaunchHealthPage.jsx`, `ErrorDashboardPage.jsx`, `VibrancyTestPage.jsx`, `ArchivedAccessRequestsPage.jsx`, `ArchivedUsersPage.jsx`
- **Modified** (id/testId stripped from root, inner PageContainers kept): `TeamOversightPage.jsx`
- **Unchanged**: `ProfileManagementHub.jsx` (beneficiary of registry, zero file edits)

---

## Pattern Capture

A reusable diagnostic pattern was captured from this incident:

→ `.agent/patterns/page-width-ownership.md` — "Width Ownership Diagnostic" — how to identify and resolve per-page width constraint drift

---

## Litmus Test

> *"If a new developer adds a page tomorrow without registering it, is it physically impossible for them to introduce this same drift?"*

**Not yet fully impossible** — the registry fallback is `fluid` (TASK-193 audits whether to change this to `standard`). However, the drift is now detectable and intentional: unregistered routes visibly fall back to fluid, which is diagnosable. Previously, the drift was invisible (absence of PageContainer left no signal). TASK-193 closes the remaining gap.
