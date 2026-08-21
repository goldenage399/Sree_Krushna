# Incident Report: INC-013 — Team Oversight Redesign Data Drift and Test-ID Collision

**Date**: 2026-06-17  
**Status**: RESOLVED  
**ID**: INC-013  
**Track**: EUR-001 (Team Oversight UI Redesign)

---

## 1. Executive Summary

During the implementation of Milestone 1 (M1) and Milestone 2 (M2) of the Team Oversight page redesign, the visual dashboard component was successfully rebuilt, but two significant integration defects occurred:
1. **Mock Data Drift**: The mock data in the component drifted from the canonical schema defined in `260617_TeamOversight_Foundation.md` (e.g., using `role` instead of `department`, displaying flat fields instead of the nested `commitment`/`health`/`attention` structure, and scrambling occupant assignments).
2. **Test-ID Namespace Collision**: The initial component used test-ids prefixed with `integrated-profile-selector-*` (the task wizard's namespace) rather than `team-oversight-*`, creating a namespace collision risk once the component is extracted into a shared block (`LOCK-011`).

Both issues were caught by gated milestone reviews (G1 and G2) and successfully resolved before ingestion into the codebase.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

### 1. UI Surface
- **Impact**: The layout required distinct card, drawer, and modal test-ids (`team-oversight-*`) to prevent test runner confusion. Reusing the selector's namespace would cause Playwright and Cypress to select elements on the wrong surface.
- **Correction**: Replaced all `integrated-profile-selector-*` test-ids with `team-oversight-*` test-ids.

### 2. Data Surface
- **Impact**: The initial design assumed live SLA data (`slaBreachRisk`) and occupant hours (`hoursLogged`), but the backend `WorkloadCalculationService.js` only calculates worked touches and has no SLA logic.
- **Correction**: Formalized the service gaps (`G-A` and `G-B`) in `260617_TeamOversight_Foundation.md` and added clear `// MOCK-ONLY` comments in the code to prevent downstream ingestion drift.

### 3. Reactive Surface
- **Impact**: The component's detail drawer link was wired to trigger state updates immediately instead of remaining static in early phases, but it was accepted because it was forward-compatible with M3.
- **Correction**: None required for the react state itself, but aligned with the transition to M3 drawer details.

### 4. Service Surface
- **Impact**: The public accessor for raw profile tasks (`getProfileTasks`) was marked `@private` in the calculation service, meaning drawer list rows could not load them from the active service context.
- **Correction**: Identified `G-D` gap and deferred exposing a public accessor to M6 ingestion, utilizing cached mock `tasks[]` in the interim.

### 5. Module Surface
- **Impact**: No modular dependency breaches occurred; sandbox versions are maintained in separate files (`TestViteJSX`) to prevent production regressions.
- **Correction**: None required.

### 6. Governance Surface
- **Impact**: The early design iterations flip-flopped on 3-pillar layout decisions due to chat-based sign-offs and leading questions, bypassing the written acceptance plan.
- **Correction**: Codified the **Scope Ledger / Load-Anchor** process pattern (`scope-ledger-anchor.md`) to maintain state across resets without relying on chronological transcript logs.

---

## 3. Root Cause Analysis

The root cause of the data drift and test-id namespace leakage was a failure to check the design drafts against a **fixed written acceptance plan** early enough. The initial design was signed off based on conversational approvals ("Reviewer 2" rubber-stamp) rather than checklist validation. This allowed the external designer agent to implement freehand mock variables that diverged from the production service APIs.

---

## 4. Invariants and Corrective Standards

To prevent recurrence:
1. **P55 Dual-Anchor Namespace Separation**: Shared UI components must declare their namespace prefix up front (e.g. `team-oversight-*`) and must not borrow selector namespaces from other pages.
2. **Process Pattern (Load-Anchor)**: Multi-session development tracks must use a `*_SCOPE_LEDGER.md` (capped at 1 page) to coordinate milestones and decisions, rather than reloading the chronological chat transcript.
3. **Data-Contract-First Gate**: G0 audit must define Line references for all service endpoints before any mock data is wired.

---

## 5. Verification

- **Governance Wiring**: Run `npm run verify:governance-wiring` to confirm all patterns are back-linked.
- **Code Integrity**: Run `npm run sg:scan` to verify AST rules pass.
