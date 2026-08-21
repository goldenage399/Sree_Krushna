# Incident Report: INC-017 — ARCH-INV-002 Violation: ServiceRegistry.register() in Page Component

**Date**: 2026-06-20
**Status**: RESOLVED
**ID**: INC-017
**Track**: Architecture / Service Registry
**Resolved By**: Moved `BlockerWorkflowService` registration from `MyTasksPage.jsx` to `ServiceInitializer.registerBusinessServices()`. Commit `b3a61793`.

---

## 1. Executive Summary

During the EUR-002 M5.2 ingestion (commit `ca75b2fc`), `BlockerWorkflowService` was registered with `ServiceRegistry` at module scope inside `MyTasksPage.jsx` — a page component. The correct location for all service registrations is `src/services/ServiceInitializer.js` `registerBusinessServices()` method. The ARCH-INV-002 ast-grep rule did not catch the violation because the rule only scans `src/services/**` for service-to-service import statements — it does not scan `src/pages/**` or `src/components/**` for `ServiceRegistry.register()` calls.

The violation was identified as a debt item and resolved in the following session (commit `b3a61793`). The ast-grep rule must be extended to prevent recurrence.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

### 1. UI Surface

**Impact**: ✅ NOT AFFECTED.
No visual rendering, styling, or layout was impacted. The `ServiceRegistry.register()` call is at module scope and executes before component mount. The page rendered correctly.

**Justification**: `ServiceRegistry.register()` is a pure JavaScript side effect with no DOM interaction.

### 2. Data Surface

**Impact**: ✅ NOT AFFECTED.
`BlockerWorkflowService` is a write service (blockers via `syncTaskBlockers`). Its registration location does not affect the data written. Firestore writes were unaffected.

**Justification**: Service behavior is identical regardless of whether registration occurs in `MyTasksPage.jsx` or `ServiceInitializer.js`. Only the lifecycle/initialization contract changes.

### 3. Reactive Surface

**Impact**: ✅ AFFECTED (latent risk).
Module-scope `ServiceRegistry.register()` executes when the module is first imported — which is when the router lazy-loads `MyTasksPage`. If `ServiceInitializer.initialize()` has not run yet, the service would be double-registered if the user navigated to the page before the initializer ran. `ServiceRegistry.has()` guard prevented a crash but masked the architectural violation.

**Correction**: Service is now registered in `ServiceInitializer.registerBusinessServices()`, which is called once at app startup before any page components mount.

### 4. Service Surface

**Impact**: ✅ AFFECTED (primary surface).
All business service registrations belong in `ServiceInitializer.registerBusinessServices()`. Placing registration in a page component:
1. Creates registration timing dependency on router navigation
2. Violates the single-responsibility principle for `ServiceInitializer.js`
3. Makes service availability non-deterministic during early-lifecycle calls from other services
4. Hides registered services from `ServiceInitializer.getStatus()` audit

**Correction**: `BlockerWorkflowService` is now registered alongside all other business services in `ServiceInitializer.js` lines 277–284.

### 5. Module Surface

**Impact**: ✅ AFFECTED (coupling risk).
Page component (`MyTasksPage.jsx`) imported `ServiceRegistry` solely for the registration call — creating an architectural coupling (page → registry write) that should only exist in `ServiceInitializer.js`. The `ServiceRegistry` import is still required in `MyTasksPage.jsx` for `ServiceRegistry.get('BlockerWorkflowService')` inside `handleToggleBlocker`, so the import was retained.

**Correction**: The `ServiceRegistry.register()` block removed; `ServiceRegistry.get()` call retained. Module import correctly scoped.

### 6. Governance Surface

**Impact**: ✅ AFFECTED (enforcement gap).
ARCH-INV-002 ast-grep rule (`arch-inv-002-service-registry.yml`) only covers `src/services/**` and only detects `import_statement` importing from `../services/`. It does not detect:
- `ServiceRegistry.register()` calls in `src/pages/**`
- `ServiceRegistry.register()` calls in `src/components/**`

The violation passed through all gates undetected until identified manually as a debt item.

**Correction**: New ast-grep rule `arch-inv-002b-service-registration-location.yml` added (see Phase 3).

---

## 3. Root Cause

The M5.2 ingestion added `BlockerWorkflowService` read access via `ServiceRegistry.get()` in `handleToggleBlocker`. The agent writing M5.2 simultaneously added the registration (which should go in `ServiceInitializer.js`) inline in the same page component for convenience. The existing ARCH-INV-002 sg rule scope (`src/services/**`) did not fire on a page component file. No other gate caught the pattern.

**Cause classification**: Partial compliance — service was correctly consumed via `ServiceRegistry.get()`, but the registration was incorrectly placed in a page component rather than in `ServiceInitializer.js`.

---

## 4. Invariant Classification (Phase 2)

**Is this a new structural invariant?** Partially. ARCH-INV-002 already prohibits service-to-service direct imports. The prohibition on page/component-level service *registration* is an unspecified corollary that must now be made explicit.

**Extension required**: ARCH-INV-002 must be extended to explicitly state: *"Only `ServiceInitializer.registerBusinessServices()` may call `ServiceRegistry.register()`. Page components and feature components must never call `ServiceRegistry.register()`."*

**AST-grep rule gap**: The current rule only catches direct `import` statements in service files. A companion rule must catch `ServiceRegistry.register(` in `src/pages/**` and `src/components/**`.

---

## 5. SSOT Extension (Phase 3)

### New ast-grep Rule: `arch-inv-002b-service-registration-location.yml`

Created in `.claude/sg-rules/`. Scans `src/pages/**` and `src/components/**` for `ServiceRegistry.register(` calls and emits ARCH-INV-002 violation.

### ARCH-INV-002 Cache Update

`.cache/architectural-invariants.jsonl` entry for ARCH-INV-002 updated to include the registration-location corollary.

---

## 6. Coverage Audit (Phase 4)

Scan for any other `ServiceRegistry.register()` calls outside `ServiceInitializer.js`:
