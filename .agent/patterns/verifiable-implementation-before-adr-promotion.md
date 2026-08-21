---
pattern: verifiable-implementation-before-adr-promotion
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - performative adr
  - paper architecture
  - un-implemented schema
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Verifiable Implementation Before ADR Promotion

**Category**: Design Gate & Anti-Pattern Prevention  
**Applies to**: ADR Authoring, Role Activation, Architecture Council Reviews  
**Origin**: 2026-08-13 (`INC-079` / Query 1.5 in thread `260813_TestRun.md`)  
**Status**: VALIDATED  

---

## Anti-Pattern — Paper Architecture & Performative ADR Promotion

### What it is
Authoring an Architectural Decision Record (ADR) in `docs/adr/` marked as `ACCEPTED` that claims new data models (`sections[]`), service methods, or security rules are implemented when zero source code changes exist in `src/` or `firestore.rules`.

### Symptoms
1. An ADR states `Status: ACCEPTED` and describes code features as operational, but `git diff` shows no code changes.
2. The agent prints a formatted `▶ ROLE ACTIVATED` block without writing `.agent/session/mode1-output.json` or `.agent/session/mode2-output.json`.
3. Vitest unit tests for the claimed features do not exist or fail.

### Why it fails
Writing documentation that claims features exist when they do not causes severe architectural drift. Future agents and human reviewers trust the SSOT, assuming features are available when they are physically absent from the codebase.

### Correction (The Positive Pattern)
Apply strict **Artifact → Validation → Promotion (AVP)**:
1. **Draft Phase**: ADRs under design must be marked `Status: PROPOSED`.
2. **Implementation Phase**: Source code changes in `src/` and `firestore.rules` must be written and pass Vitest unit tests.
3. **Promotion Phase**: Only AFTER `npx vitest` passes and `git status` verifies the code diff may the ADR status be updated to `ACCEPTED` and registered in `docs/DOCUMENTATION-INDEX.md`.

---

## Task-Dashboard Instance
Discovered during `INC-079` when `ADR-016` was authored declaring `sections[]` and `getUnifiedDailyAgendaForUser` were `ACCEPTED` before `RecurringChecklistService.js` was edited.
