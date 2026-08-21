---
description: Comprehensive plan review template to compress multi-round feedback into a single-pass structured review
rrm001_profile: plan-feasibility
---

# Feature Plan Review Workflow

Use this workflow when reviewing plans for new features. This consolidates technical, product, and operational perspectives into one comprehensive pass.

## Entry Condition

Before invoking this workflow, you MUST ensure that system discovery and architectural evaluation have been performed under **SDP-001 §6** (specifically establishing the Problem-Space Boundary and reviewing the capability spectrum of the affected components).

## When to Use

- Before starting any significant feature development
- When user says "review this plan" or "is this feature ready?"
- After initial planning, before execution

---

## Quick Review Checklist (5-min scan)

Run through this first to identify major gaps:

### ✅ Requirements

- [ ] Problem statement clear?
- [ ] Success metrics defined?
- [ ] Out-of-scope explicitly listed?

### ✅ Technical

- [ ] Architecture documented?
- [ ] Data model defined?
- [ ] Risks identified with mitigations?

### ✅ Execution

- [ ] Work phased (MVP → Enhancement)?
- [ ] Effort estimated with confidence levels?
- [ ] Dependencies mapped?

### ✅ Quality

- [ ] Testing strategy documented?
- [ ] Launch criteria defined?
- [ ] Rollback plan in place?

### ✅ Sign-off

- [ ] Stakeholders identified?
- [ ] Outstanding questions resolved?

---

## Full Review Template

### Section 1: Problem & Requirements

```markdown
**Problem Statement**

- What problem does this solve?
- Who are the users?
- What's the business impact?

**Success Metrics**

- [ ] Metric 1: [target]
- [ ] Metric 2: [target]

**Acceptance Criteria**

1. [Testable criterion]
2. [Testable criterion]

**Out of Scope**

- [Item explicitly NOT included]
```

### Section 2: Technical Architecture

```markdown
**Components**

- Component A: [responsibility]
- Component B: [responsibility]

**Data Flow**
[How data moves through system]

**Technology Choices**

- Frontend: React + Vite
- Backend: Firebase (Firestore, Auth, Functions)
- State: React Context + Custom Hooks

**Risk Assessment**
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | High/Med/Low | [Strategy] |
```

### Section 3: Scope & Phasing

```markdown
**Phase 1 (MVP)**

- [ ] Workstream A: [X hours]
  - Task 1.1
  - Task 1.2
- [ ] Workstream B: [X hours]

**Phase 2 (Enhancement)**

- [ ] Performance optimization
- [ ] UI/UX refinements

**Dependencies**

- [Blocking dependency 1]
- [Blocking dependency 2]
```

### Section 4: Data & API

```markdown
**Firestore Collections**

- Collection A: [document structure]
- Collection B: [document structure]

**Firebase Functions (if any)**

- functionName: [purpose]

**Validation Rules**

- [Field]: [rule]
```

### Section 5: Testing Strategy

```markdown
**Test Approach**

- Manual: [key scenarios]
- Automated: [if applicable]
- Sample Data: [scenarios to use]

**Launch Criteria**

- [ ] All critical tests passing
- [ ] No console errors
- [ ] Documentation complete
- [ ] Sample data scenarios work
```

### Section 6: Effort Estimate

| Phase         | Hours   | Confidence | Buffer   |
| ------------- | ------- | ---------- | -------- |
| Phase 1 (MVP) | [X]     | 80%        | +[Y]     |
| Phase 2       | [X]     | 60%        | +[Y]     |
| **Total**     | **[X]** |            | **+[Y]** |

---

## Multi-Perspective Feedback

Instead of multiple review rounds, evaluate from all angles:

### Technical Review

- [ ] Architecture sound for scale?
- [ ] Dependencies identified?
- [ ] Risks mitigated?
- [ ] Patterns consistent with codebase?

### Product Review

- [ ] Solves the core problem?
- [ ] Success metrics measurable?
- [ ] Scope appropriate?
- [ ] UX considered?

### The 5 Lenses Check (Feasibility & Impact)

*(Note: This planning-stage check is complementary to the ideation-stage Gear 2 check in the enhancement scaffolder. While Gear 2 decides whether to build a feature at the ideation gate, this check evaluates if the proposed implementation design itself is sound before execution.)*

- [ ] **User Experience (UX)**: Does this design improve, maintain, or degrade user interaction?
- [ ] **Workflow Efficiency**: Does the proposed flow save steps or introduce friction?
- [ ] **Complexity & Cognitive Load**: What is the maintenance burden or learning curve of this solution?
- [ ] **Performance Implications**: Does it impact load times, memory, or API quota consumption?
- [ ] **Implementation Practicality**: Is it realistic given the existing codebase constraints?

---

## P18 Integration Chain Trace (Mandatory Gate)

Ensure the planned implementation explicitly traces the full integration chain before approval:
- **UI Trigger**: The interactive component and event starting the flow (e.g. `onClick` on component).
- **Hook Layer**: The custom React hook capturing/mediating the trigger (e.g. `useTasks()`).
- **Service/Logic Layer**: The business logic coordinator service mapping inputs to storage.
- **Storage/DB Layer**: The Firestore collection or Cloud Function mutated/queried.
- **Response Flow**: The return shape returned to the hook layer and rendered in the UI.

- [ ] **P18 Compliance**: Every component in this flow from UI to Database has been mapped, and at least one integration-level scenario is defined to verify the full chain end-to-end.

---

## As-Is Baseline Audit (Blocking Pre-Gate — P04/P31)

> [!CAUTION]
> **A plan is structurally invalid without this section.** This gate must be completed and its output physically present BEFORE the Decision Gate is evaluated. Self-certification ("I checked") does not satisfy this gate — the table must be populated.

**What to produce**: For every component, hook, or service the plan proposes to create or modify, the reviewer must have physically read the source file(s) of the parent component AND its imported children, and must assert what already exists:

```markdown
## As-Is Baseline Audit — [Feature/Component in Scope]

| File | Lines Inspected | Relevant Existing Logic | Status |
|------|----------------|------------------------|--------|
| `ComponentName.jsx` | L{start}-{end} | [What already exists] | LIVE / ABSENT |
| `HookName.js` | L{start}-{end} | [State or function] | LIVE / ABSENT |

### Capability Existence Check
- Proposed: [Enhancement #N — description]
- Verdict: ALREADY IMPLEMENTED → DROP | NOT FOUND → PROCEED | PARTIALLY IMPLEMENTED → EXTEND ONLY
```

**Mandate**: Every row in the table must cite a specific file and line range. A row with "n/a" or no line citation is invalid.

---

## Zero-Trust Claim Verification (Blocking Pre-Gate — Helpful Inference Trap Prevention)

> [!CAUTION]
> **A plan that cites functions, CSS classes, or state selectors from memory or inference is invalid.** The "Helpful Inference Trap" is the failure mode where plausible-sounding claims pass unchallenged because they match clean patterns — then break at execution because the actual code differs. This gate catches it before a single line is written.

**What to verify**: For every specific element the plan proposes to call, extend, or depend on, the reviewer must have physically read the file and confirm it exists at the cited location:

| Element Type | Verification Required | Invalid Citation |
|---|---|---|
| **Function / method name** | File path + line number where it is defined | "should exist in useTaskCreation" |
| **CSS class selector** | File path + line where class is declared | "likely `.compact-section-wrapper`" |
| **Context property / state field** | File path + line in context definition | "probably in TaskCreationContext" |
| **Prop name on shared component** | File path + line in component's prop signature | "CompactSectionItem accepts a prop" |
| **E2E selector / data-testid** | File path + line in JSX where it is rendered | "the test should find it" |

**Self-certification is prohibited.** Each row must cite `file:line`. A plan citing "inferred", "plausible", "probably", or "should exist" without a line citation fails this gate.

**Scope Segregation Check** (same gate):
- [ ] Are **core requirements** and **optional enhancements** in separate, independently rollback-able phases?
- [ ] Could Phase 1 ship and be reverted without touching Phase 2 code?
- [ ] Does any single execution block mix "must have" and "nice to have" deliverables?

If optional features share an execution block with core features: **split them before proceeding.**

---

## Decision Gate

Before approving to proceed:

- [ ] All sections completed
- [ ] No outstanding blockers
- [ ] Confidence ≥80%
- [ ] Timeline includes 15-20% buffer
- [ ] **As-Is Baseline Audit table is present with at least one populated row per proposed enhancement**
- [ ] **Zero-Trust Claim Verification table is present — every function, CSS class, context property, and E2E selector cited in the plan has a file:line citation**
- [ ] **Scope Segregation confirmed — core and optional deliverables are in separate phases with independent rollback paths**
- [ ] **Shared Component Contract documented — if any shared component (>1 consumer) is modified, its new/changed props are explicitly listed with before/after signatures**
- [ ] **VG/DN structure present — every implementation step in this plan ends with a 🔍 Validation Gate (max 2 binary checks; non-binary checks labeled `[human-review]`) and a 🚦 Decision Node (Pass path, Fail (1st) path with specific rollback, Fail (2nd) path with user escalation). Steps with only prose "verify that…" language fail this gate.**

**Decision**: ☐ Approved to proceed | ☐ Needs revision

---

## Post-Review Actions

1. Create enhancement file: `docs/enhancements/ENH-XXX-name.md`
2. Update tracker if applicable
3. Follow AOS Phase A before starting work

---

## Integration Notes

This workflow integrates with:

- `/implementation-plan-template` - Use for creating the plan document
- `/change-impact-analysis` - For assessing risk of changes
- `/aos-session` - Follow AOS when executing

---

_Ported from Task-Dashboard: 2025-12-30_
