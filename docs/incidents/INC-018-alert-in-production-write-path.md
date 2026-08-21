# Incident Report: INC-018 — alert() Used in Production Write Path

**Date**: 2026-06-20
**Status**: RESOLVED
**ID**: INC-018
**Track**: UI / UX Standards
**Resolved By**: Replaced both `alert()` calls in `handleToggleBlocker` with `toastService.addToast({ type: 'error' })`. Commit `b3a61793`.

---

## 1. Executive Summary

During EUR-002 M5.2 ingestion (commit `ca75b2fc`), the `handleToggleBlocker` function in `MyTasksPage.jsx` was implemented with native browser `alert()` calls for error feedback. The production system uses `ToastNotificationService` (`src/services/ToastNotificationService.js`) as the canonical user-facing notification mechanism. Using `alert()` introduces a blocking modal that freezes the UI thread and breaks the application's UX contract with the user.

No enforcement mechanism existed to prevent `alert()` from being introduced. The regression was identified as a debt item and resolved in the following session (commit `b3a61793`) by importing `toastService` and replacing both calls.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

### 1. UI Surface

**Impact**: ✅ AFFECTED (primary surface).
`alert()` is a blocking browser dialog. In a React SPA with real-time Firestore subscriptions, blocking the UI thread causes:
- Firestore listener callbacks to queue
- React re-render cycle to pause
- User unable to dismiss without clicking "OK"
- No theming, no action buttons, no auto-dismiss

`ToastNotificationService.addToast({ type: 'error' })` produces a themed, non-blocking notification consistent with the rest of the application.

**Correction**: Both `alert()` calls replaced with `toastService.addToast({ message: '...', type: 'error' })`. `toastService` imported from `../services/ToastNotificationService`.

### 2. Data Surface

**Impact**: ✅ NOT AFFECTED.
`alert()` fires only on error paths after the write attempt. No Firestore write is triggered by the alert itself; error feedback only.

**Justification**: The alert is in the catch branch of `handleToggleBlocker`. Data integrity is unaffected.

### 3. Reactive Surface

**Impact**: ✅ AFFECTED (latent risk).
Blocking the JavaScript thread via `alert()` inside an `async` function pauses all pending Firestore subscription callbacks until the alert is dismissed. In a page with real-time task subscriptions, this can cause stale UI state until the user clicks OK.

**Correction**: `toastService.addToast()` is non-blocking (fires and returns). No UI thread stall.

### 4. Service Surface

**Impact**: ✅ NOT AFFECTED.
`ToastNotificationService` is a lightweight event-based service. No Cloud Functions or Firebase calls are involved in the notification path.

**Justification**: `addToast()` appends to an in-memory queue consumed by `ToastContainer`. No network I/O.

### 5. Module Surface

**Impact**: ✅ AFFECTED (minor).
`import toastService from '../services/ToastNotificationService'` added to `MyTasksPage.jsx`. One additional module import.

**Correction**: Import added at top of file alongside existing imports.

### 6. Governance Surface

**Impact**: ✅ AFFECTED (enforcement gap).
No ESLint rule prevented `alert()` from being introduced. `eslint.config.js` did not include `no-alert` or `no-restricted-globals` for `alert`. The standard "use `toastService` for all user-facing notifications" was not written anywhere in the governance layer.

**Correction**: `no-alert` ESLint rule added to `eslint.config.js`. `ToastNotificationService` usage documented as canonical standard. See Phase 3.

---

## 3. Root Cause

The M5.2 ingestion agent defaulted to the simplest available error feedback mechanism (`alert()`) without consulting the production notification standard. No ESLint rule flagged the usage. No checklist item mentioned "do not use `alert()`". The agent implementing the blocker write path was focused on functional correctness and missed UX regression.

**Cause classification**: Missing enforcement — no lint rule, no documented standard, no checklist item.

---

## 4. Invariant Classification (Phase 2)

**Is this a new structural invariant?** Yes. *Native browser dialogs (`alert()`, `confirm()`, `prompt()`) must never be used in production React components. All user-facing notifications must use `ToastNotificationService.addToast()`.*

**Does an ADR exist?** No. `ToastNotificationService` exists as a production service but is not codified as the canonical notification mechanism in any standard or ADR.

**New enforcement**: `no-alert` ESLint rule added. Standard P88 created in standards catalog.

---

## 5. SSOT Extension (Phase 3)

### ESLint Rule

Added `no-alert: 'error'` to `eslint.config.js` rules section.

### Standard P88

New entry in `.agent/standards-catalog.json`: *"P88 — No Native Browser Dialogs: Use ToastNotificationService for all user-facing error, warning, info, and success feedback."*

### CLAUDE.md

Added `ARCH-INV-010` entry under Architectural Invariants Cache: "alert()/confirm()/prompt() prohibited in React components — use ToastNotificationService."

---

## 6. Coverage Audit (Phase 4)

Run: `grep -rn "alert(\|confirm(\|prompt(" src/ --include="*.jsx" --include="*.js" --include="*.ts" --include="*.tsx"`

---

## 7. Litmus Test

> *"If a new developer writes `alert('error')` in a component tomorrow, is it architecturally impossible to commit without violating a written protocol?"*

**YES** — `no-alert: 'error'` ESLint rule will block `npm run lint` and the pre-commit hook.

> *"Is there an ADR that would have made this architecturally impossible to introduce?"*

Yes — Standard P88 now codifies `ToastNotificationService` as the canonical notification mechanism.

> *"Has the corrective process been captured in `.agent/patterns/`?"*

Not required — enforcement is now automated via ESLint. No process pattern needed.
