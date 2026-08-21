---
pattern: mock-first-boundary-contract-lock
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Mock-First Boundary Contract Lock

**Category**: Process / Design Gate
**Applies to**: Solution design, data modeling, feature deferrals during mock development
**Origin**: 2026-06-17 session (`260617_Th2_TaskLifeCycle.md`), where task-to-task dependency enforcement was deferred, but the data contract was locked to prevent code fan-out drift.
**Status**: VALIDATED

---

## Pattern — Mock-First Boundary Contract Lock

### Problem
When developing an application mock-first, it is tempting to defer *both* the complex behavior (guards, automation, triggers) and the data model structure of a feature to a later phase. However, if the feature's display or entry fields are referenced across multiple pages under active development (e.g., Task Creation, Team Oversight, My Tasks), each page will inevitably hardcode its own speculative data representation (e.g., `dependency` singular object vs `dependencies` array vs `blockedBy` array). When the feature is eventually implemented, it requires a massive, multi-page rewrite of the read/write sites to reconcile the drifted shapes (code fan-out debt).

### Why it happens
Data migration in pre-launch is cheap (a simple delete-and-reseed), leading to the false assumption that data contract decisions can be deferred entirely. Developers forget that **code fan-out**—the replication of read/write operations against a field shape across multiple files—is expensive to refactor.

### Solution
1. **Lock the contract, defer the behavior**: If a complex capability (e.g., dependency-aware task activation) is deferred, identify the exact boundary fields the UI needs to read or write.
2. **Define a canonical schema**: Formulate a single, minimal, and future-proof schema for those fields (e.g., `blockers[]` array) and lock it in the registry (e.g., `LOCK-DATA-001` in ADR-012 / `COMPONENT_REGISTRY.md`).
3. **Build mocks against the contract**: Enforce that all active pages (Oversight, Creation, etc.) read/write only that canonical shape from day one, even if the values are stubbed or manually attested.
4. **Quarantine dead paths**: Mark any pre-existing broken or legacy services (e.g., older workflow services using deprecated schemas) as retired or quarantined to prevent accidental integration.

### Failure Mode
- **Ad-hoc schema drift**: Downstream pages are built using mismatched property names, resulting in silent runtime failures and query-shadowing bugs.
- **Premature behavior wiring**: Attempting to wire automated triggers before the target page (e.g., My Tasks completion surface) is built, creating a high maintenance burden for incomplete features.

### Task-Dashboard instance
During the dependency review (`260617_Th2_TaskLifeCycle.md`), the deciders locked the `blockers[]` contract (`LOCK-DATA-001` in `ADR-012`) to unify three competing shapes (`dependency`, `dependencies`, and `blockedBy`), while deferring the activation guards and completion triggers to a post-MVP epic (`TASK-180`), saving weeks of speculative refactoring across My Tasks and Team Oversight pages.
