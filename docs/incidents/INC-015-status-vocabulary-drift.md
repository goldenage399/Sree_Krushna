# Incident Report: INC-015 — Task Status Vocabulary Drift

**Date**: 2026-06-20  
**Status**: RESOLVED  
**ID**: INC-015  
**Track**: Data Integrity / Governance  
**Resolved By**: Rounds A–E Pre-Launch Hardening (Sprint 0)

---

## 1. Executive Summary

Over the course of iterative development, raw status string literals accumulated across 20+ source files in place of the canonical `TASK_STATUS.*` constants defined in `src/constants/taskStatus.js`. This included capitalized variants (`'Completed'`), hyphenated variants (`'in-progress'`), eliminated legacy values (`'assigned'`, `'on_hold'`, `'Review'`, `'Active'`, `'PENDING_ACCEPTANCE'`), and direct numeric/string comparisons against escalation state via `task.status === 'escalated'` instead of the correct `task.escalation?.isEscalated === true` flag.

The drift caused silent filter failures: `useMemo` and `Array.filter` comparisons returned empty results without throwing errors because `'Completed' !== 'completed'`. One instance in the `buildTimeline()` fallback path of `TaskDetailsModal.jsx` survived through Round B verification and was caught only on manual inspection.

No structural enforcement existed to prevent the pattern — no AST-grep rule, no lint rule, no pre-commit gate.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

### 1. UI Surface

**Impact**: ✅ AFFECTED.  
Status badge rendering used raw strings. `buildTimeline()` fallback used `task.status === 'Completed'` (capitalized), causing the fallback timeline to silently produce no milestones for legacy tasks that lacked an `events[]` array.

**Correction**: All status comparisons in UI rendering paths corrected to `TASK_STATUS.*` constants. The `buildTimeline()` fallback fixed to `TASK_STATUS.COMPLETED`.

### 2. Data Surface

**Impact**: ✅ AFFECTED.  
Firestore write paths contained `status: 'Assigned'` and `status: 'on_hold'` writes. Escalation state was read from `task.status === 'escalated'` (a deprecated write-path value) rather than `task.escalation?.isEscalated === true`. Queries filtering on non-canonical values matched no documents.

**Correction**: All write paths locked to `WRITABLE_STATUSES`. Escalation detection migrated to `task.escalation?.isEscalated` with `task.status === 'escalated'` retained as a legacy read-only fallback. TLM-009 Status Vocabulary Freeze documented in `src/constants/taskStatus.js`.

### 3. Reactive Surface

**Impact**: ✅ AFFECTED.  
`useMemo` filters in `TeamOversightPage.jsx` and `MyTasksPage.jsx` used raw status strings (`'in-progress'` vs canonical `'in_progress'`), producing empty computed arrays silently. The operational groupings (Active Work, Blocked Work, Escalated Work, Recently Completed) in Round C were built correctly from the start because they were written against `TASK_STATUS.*`.

**Correction**: All `useMemo` and `Array.filter` status comparisons updated across affected files.

### 4. Service Surface

**Impact**: ❌ NOT AFFECTED.  
No Cloud Functions or external API integrations were involved. Service-layer calls passed through correctly.

**Justification**: The drift was contained to client-side React component logic and did not propagate into Firebase Cloud Functions or authentication flows.

### 5. Module Surface

**Impact**: ❌ NOT AFFECTED.  
No package dependencies, route registrations, or file structure boundaries were affected.

**Justification**: The affected files were standard page and component modules with no new import boundaries or bundle split implications.

### 6. Governance Surface

**Impact**: ✅ AFFECTED.  
No enforcement mechanism existed to prevent raw status string usage. `TASK_STATUS` constants were defined and documented in `src/constants/taskStatus.js` with a TLM-009 reference, but no AST-grep rule, no ESLint custom rule, and no pre-commit gate enforced their use. The standard existed on paper only.

**Correction**: ARCH-INV-009 added to `CLAUDE.md` enforcement triggers. P87 added to `.agent/standards-catalog.json`. INC-015 case study logged. An AST-grep rule should be authored as follow-on work to detect `status === '...'` raw string comparisons.

---

## 3. Root Cause

**Classification**: Partial refactor that didn't update all files + missing enforcement gate.

The `TASK_STATUS` constants were created early in the project lifecycle. As the codebase grew through multiple feature sessions, developers (including AI-assisted sessions) wrote status comparisons and writes using raw string literals — the path of least resistance when not actively guided to the constants module. The absence of a lint rule or AST-grep invariant meant violations accumulated invisibly.

The escalation path (`task.status === 'escalated'`) was a specific case where a deprecated write path survived long after `task.escalation.isEscalated` became the canonical field, because both values coexisted in the data for legacy documents.

---

## 4. Resolution

**Round A** (2026-06-20): Swept 20+ files. Canonicalized all status string comparisons and write paths. Migrated escalation detection. Removed eliminated legacy status values (`assigned`, `on_hold`, `in-progress`, `Review`, `Active`, `PENDING_ACCEPTANCE`).

**Round B verification** (2026-06-20): Caught one remaining miss in `TaskDetailsModal.jsx` line 363 (`buildTimeline()` fallback used `'Completed'` not `TASK_STATUS.COMPLETED`). Fixed immediately.

---

## 5. Structural Invariant Defined

**ARCH-INV-009: Task Status Vocabulary — TASK_STATUS.* constants only (TLM-009)**

> Any comparison against `task.status` or write to `task.status` MUST use a constant from `src/constants/taskStatus.js`. Raw status string literals are prohibited. Escalation state MUST be read from `task.escalation?.isEscalated === true`; `task.status === 'escalated'` is retained only as a legacy read-only fallback for documents that predate the escalation object.

**Standard**: P87 (`.agent/standards-catalog.json`)  
**Surfaces**: Data, Reactive, UI, Governance  
**Enforcement**: CLAUDE.md ARCH-INV-009 trigger + future AST-grep rule

---

## 6. Follow-On Work

| Item | Priority | Owner |
|---|---|---|
| Author AST-grep rule: detect `status === 'string'` raw comparisons | Medium | Engineering |
| Run `npm run sg:scan` after rule is added | Low | CI |

---

## 7. Litmus Test

> *"If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"*

**Current**: PARTIAL — ARCH-INV-009 and P87 are in governance, but no automated AST-grep rule exists yet. A developer reading `CLAUDE.md` will see the constraint; a developer who skips governance will not be blocked by tooling.

**Target**: Full — AST-grep rule added to `.claude/sg-rules/` and wired into `npm run sg:scan`.
