---
description: How to create architectural blueprints for complex multi-module changes - follows AVP protocol with built-in guardrails
---

# Complex Architecture Blueprint Workflow

> **When to Use**: Multi-module changes, new integrations, schema changes affecting 3+ files, or any enhancement requiring cross-cutting concerns.
> **Estimated Time**: 30-60 minutes for blueprint creation
> **Best Practices Source**: Google, ThoughtWorks, C4 Model

---

## Pre-Flight Checklist

Before starting, verify the request meets complexity threshold:

- [ ] Affects 2+ modules?
- [ ] Requires schema changes?
- [ ] Has cross-module data dependencies?
- [ ] Unclear requirements that need clarification?

**If YES to 2+** → Use this workflow
**If NO** → Use standard implementation_plan.md approach

---

## Phase A: Discovery (AOS Phase A)

### A1. Read DOCUMENTATION_HUB.md

```
Search by subject domain (not recency) to locate:
- [ ] Primary modules affected
- [ ] Related architecture docs
- [ ] Existing sheet schemas
```

### A2. Read Module Schemas

For each affected module:

```
- [ ] docs/{Module}_Module_SSOT/SHEET_SCHEMAS.md
- [ ] Identify current columns, types, required fields
- [ ] Note any existing gaps or limitations
```

### A2.5. Live Schema Validation (Firestore modules only)

> If any affected module uses Firestore, run `npm run db:overview` (and targeted `npm run db:profile -- <id>` / `npm run db:project -- <id>` as needed) to confirm live collection structure matches the documented schema **before** building the gap analysis table. Discrepancies between live data and docs must be resolved via `/ssot-reconciliation` — do not proceed to Phase B with an unresolved structural conflict. Skip this step if the module has no Firestore dependency. Prerequisite: `serviceAccountKey.json` present at workspace root (P53).

### A3. Check for Doc/Code Conflicts

> 🔄 **If discovery reveals conflicting documentation**:
> Invoke `/ssot-reconciliation` workflow before proceeding.
> Do NOT continue until a single source of truth is established.

### A4. Create Gap Analysis Table

| Module                    | What Exists | What's Missing | Impact |
| ------------------------- | ----------- | -------------- | ------ |
| (fill in for each module) |

---

## Phase B: Current & Target State (C4-Inspired)

### B1. Document As-Is State

```
For each affected component:
- [ ] Current data flow (ASCII diagram)
- [ ] Current API contracts
- [ ] Known pain points or limitations
- [ ] Operational metrics (if available)
```

### B2. Draw Target State Diagram

Use **C4 Container/Component** style:

```
┌──────────────────────────────────────────────────────┐
│                    [SYSTEM CONTEXT]                   │
│  External actors, systems, and integration points    │
└──────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Container A   │ │   Container B   │ │   Container C   │
│  (Module/API)   │ │  (Module/API)   │ │  (Module/API)   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### B3. Define API Contracts

For each new/modified API:

```javascript
// Function name and purpose
// Input parameters (with types)
// Output structure (with example values)
// Error conditions
```

### B4. Create Dependency Matrix

| Component | Depends On | Depended By |
| --------- | ---------- | ----------- |
| (fill in) |

---

## Phase C: Data Model Changes

### C1. List Schema Changes Per Module

| Module                    | Sheet | New Columns | Type | Purpose |
| ------------------------- | ----- | ----------- | ---- | ------- |
| (fill in for each change) |

### C1.5. Live Data Pre-Check (Firestore modules only)

> Before defining migration scope, run `npm run db:overview` (or `npm run db:project -- <id>` / `npm run db:profile -- <id>`) to confirm live data counts and field shapes. Migration scope estimated from documentation alone without verifying live data is a common source of structural drift. Prerequisite: `serviceAccountKey.json` present (P53).

### C2. Identify Migration Requirements

- [ ] New tables needed?
- [ ] Column additions to existing tables?
- [ ] Data backfill required?
- [ ] Run `backend-readiness.md` Phase 4A for each?

### C3. Non-Functional Requirements (NFRs)

| Requirement  | Current | Target        | How Achieved       |
| ------------ | ------- | ------------- | ------------------ |
| Latency      | ?       | <500ms        | Caching, indexing  |
| Availability | ?       | 99.9%         | Fallbacks, retries |
| Security     | ?       | Auth required | JWT validation     |

---

## Phase D: Implementation Phases

### D1. Break Into Phases

Each phase should be:

- **Deployable independently** (if possible)
- **Testable in isolation**
- **1-3 days of work max**

### D2. Define Phase Dependencies

```
Phase 1 ──► Phase 2 ──► Phase 3
   │           │
   ▼           ▼
(tests)    (tests)
```

### D3. Testing Strategy Per Phase

| Phase | Test Function | What It Validates        |
| ----- | ------------- | ------------------------ |
| 1     | `TEST_...()`  | Schema migration         |
| 2     | `TEST_...()`  | API returns correct data |

### D4. Transition & Rollback Plan

For each phase:

```
- [ ] Feature flag / gradual rollout strategy
- [ ] Rollback procedure if issues detected
- [ ] Data migration verification steps
- [ ] Cut-over checklist
```

---

## Phase E: Decision Records (ADR)

### E1. Document Key Decisions

For each non-obvious design choice:

```markdown
### ADR-001: [Decision Title]

**Status**: Proposed / Accepted / Deprecated
**Context**: Why this decision was needed
**Decision**: What we chose
**Alternatives Considered**: What we rejected
**Consequences**: Trade-offs and implications
**Date**: YYYY-MM-DD
```

### E2. Link ADRs to Blueprint

All ADRs should be referenced in the blueprint's "Design Decisions" section.

---

## Phase F: Validation Questions

### F1. Generate Clarifying Questions

Before proceeding, identify:

- [ ] Ambiguous business rules
- [ ] Default value decisions
- [ ] Edge cases
- [ ] Historical data handling

### F2. Format Questions for User

Present as numbered list with context:

```
1. **[Topic]**: [Question]?
   - If A → Implication
   - If B → Alternative implication
```

---

## Output: Blueprint Document Structure

The final blueprint artifact should contain:

```markdown
# [Feature Name] - Architectural Blueprint

> **Status**: DRAFT - Pending User Validation
> **AVP Stage**: Artifact (not yet validated)
> **Living Document**: Update with each implementation phase

## Problem Statement

[2-3 sentences on why this change is needed]

## Current State (As-Is)

[Diagram + description of existing system]

## Target State (To-Be)

[C4-style diagram showing new architecture]

## Gap Analysis

[Module-by-module comparison table]

## Data Model Changes

[Schema changes per module]

## API Contracts

[Input/Output for each new API]

## Implementation Phases

[4-5 phases with estimates + rollback plans]

## Design Decisions (ADRs)

[Links to or embedded ADRs]

## NFRs

[Latency, availability, security requirements]

## Testing Strategy

[Test functions per phase]

## Open Questions

[Numbered list requiring user input]
```

---

## Guardrails

### ⛔ DO NOT proceed to implementation if:

- Open questions remain unanswered
- User hasn't validated the blueprint
- Schema changes haven't been approved
- Doc/code conflicts detected but not resolved (invoke `/ssot-reconciliation`)

### ✅ SAFE to proceed when:

- All questions answered
- User approves blueprint
- Each phase has defined tests
- Rollback plan documented

### 🔄 ITERATE on blueprint if:

- User feedback changes requirements
- Discovery reveals new gaps
- Phasing needs adjustment

### 📝 LIVING DOCUMENT:

- Blueprint is updated after each phase completion
- ADRs are added as decisions are made
- Diagrams reflect actual implementation

---

## Example Prompt to Trigger This Workflow

> "This is a complex multi-module change. Before implementing, create an architectural blueprint following the `/complex-architecture-blueprint` workflow. Include gap analysis, API contracts, and clarifying questions."

---

## Related Workflows

| Workflow                        | When to Use                   |
| ------------------------------- | ----------------------------- |
| `/aos-session`                  | Standard Phase A discovery    |
| `/backend-readiness`            | Schema migration execution    |
| `/ssot-reconciliation`          | Doc/code conflicts detected   |
| `/implementation-plan-template` | Simpler single-module changes |
