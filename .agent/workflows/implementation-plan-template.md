---
description: Template for creating comprehensive implementation plans that pass external review in 1-2 rounds
---

# Implementation Plan Review Template

Use this template when creating implementation plans for new features. Following this checklist should reduce external review rounds from 3 to 1-2.

## Pre-Flight Checklist (Before Creating Plan)

Before writing the plan, answer these questions:

### 1. Scope & Requirements

- [ ] What problem does this feature solve?
- [ ] Who are the actors (roles) involved?
- [ ] What are the success criteria?

### 2. Existing Code Research

- [ ] Which existing files will be modified?
- [ ] Are there similar patterns to reuse?
- [ ] What hooks/services need to be called?

---

## Required Sections in Every Plan

### Section 1: Problem Statement (~50 lines)

- Current behavior
- Desired behavior
- User impact

### Section 2: State Machine (if applicable) (~100 lines)

- [ ] All states defined with descriptions
- [ ] All transitions with explicit trigger conditions
- [ ] Role-based actions table (who can do what, when)

```javascript
// Template: State Transition Rules
const STATE_TRANSITIONS = {
  DRAFT_TO_PROGRESS: {
    fromState: "DRAFT",
    toState: "IN_PROGRESS",
    trigger: "User clicks 'Start Task'",
    preconditions: ["task.assignedToProfile exists"],
    automatic: false,
  },
};
```

### Section 3: Data Structure (~100 lines)

- [ ] All new fields with types and defaults
- [ ] Firestore collection/document structure
- [ ] Audit trail fields: who, when, what

```javascript
// Template: Firestore Document
{
    createdBy: 'userId',
    createdAt: Timestamp,
    updatedBy: 'userId',
    updatedAt: Timestamp,
    version: 1  // For optimistic locking
}
```

### Section 4: Permissions & Authorization (~50 lines)

- [ ] Permission check using organizational level
- [ ] Role definitions (Super Admin → Associate)
- [ ] Action restrictions by task status

```javascript
// Template: Permission Check
function canPerformAction(user, task, action) {
  const userLevel = user.organizationalLevel;
  const requiredLevel = ACTION_PERMISSIONS[action];
  return userLevel >= requiredLevel;
}
```

### Section 5: Component Structure (~100 lines)

- [ ] React components to create/modify
- [ ] Props and state definitions
- [ ] Hook dependencies

### Section 6: Testing (~50 lines)

- [ ] At least 6 test scenarios covering:
  - [ ] Happy path
  - [ ] Permission denied
  - [ ] State transitions
  - [ ] Validation errors
  - [ ] Loading states
  - [ ] Error states

---

## Step Structure (Mandatory for All Implementation Steps)

Every implementation step in this plan must follow this format. Prose-only steps that say "verify that X works" are not valid.

```markdown
### Step N: [Short imperative title]
* **File to modify**: `src/path/to/file.jsx`
* **What to change**: [One sentence — specific, not "add validation"]

**🔍 Validation Gate** (max 2 binary checks):
  1. (Binary) `<command>` → must output `<exact string>` / exit 0
  2. [human-review] `<visual or interaction check>` *(advisory — does not block)*

**🚦 Decision Node**:
  - **Pass**: Proceed to Step N+1.
  - **Fail (1st)**: `git checkout src/path/to/file.jsx` — diagnose `<specific thing to check>`, re-execute.
  - **Fail (2nd)**: Halt. Surface to user: "Step N gate failed after one retry. [Describe observed output]."
```

### Gate check classification

| Check type | Binary? | Use in gate? |
|---|---|---|
| CLI / script exit code or stdout | Yes | ✅ Gate check |
| DOM state via `data-testid` or React DevTools | Yes | ✅ Gate check |
| Visual layout / pixel appearance | No | `[human-review]` advisory |
| Multi-step UX interaction sequence | No | Split into sub-steps or advisory |

### Constraints

- Max 2 gate checks per step. If you need more, split the step.
- `Fail (1st)` must include a specific rollback command or named debug target — not "investigate".
- `Fail (2nd)` must surface to the user. No silent looping past two failures on the same gate.

### Section 7: Effort Estimate (~10 lines)

| Phase              | Hours | Notes |
| ------------------ | ----- | ----- |
| Frontend           | X     |       |
| Backend (Firebase) | X     |       |
| Testing            | X     |       |
| **Total**          | **X** |       |

---

## Self-Review Checklist (Before External Review)

### Completeness

- [ ] Does every state have entry/exit conditions?
- [ ] Is there exactly one source of truth per entity?
- [ ] Are all magic numbers/strings defined as constants?

### Error Handling

- [ ] Network failure recovery?
- [ ] Permission denied scenarios?
- [ ] Validation error feedback?

### Auditability

- [ ] Who made changes? (userId)
- [ ] When? (Timestamps)
- [ ] What changed? (field tracking)

---

## Target Metrics

| Metric                 | Target   | Actual |
| ---------------------- | -------- | ------ |
| External review rounds | 1-2      |        |
| Plan lines             | 300-500  |        |
| Test cases             | 6+       |        |
| Time to approval       | <2 hours |        |

---

_Ported from Task-Dashboard: 2025-12-30_
