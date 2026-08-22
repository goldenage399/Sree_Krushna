---
pattern: enhancement-lifecycle
origin_cap: CAP-035
tier: universal
applies_to:
  - "agentic AI coding projects"
  - "repos requiring rigorous feature tracking"
prereqs:
  - "Implementation registry file (e.g. ENHANCEMENTS.md)"
  - "Enhancement notes directory"
porting_effort: medium
canonical_source: ENHANCEMENT_PROTOCOL.md
last_reviewed: 2026-04-18
description: "The standard CAP/PRD/Implementation lifecycle."
---

# Portable Workflow: Enhancement Lifecycle

**Purpose:** Document planned work before starting, track progress during development, and record completed achievements with rigorous evidence. This workflow ensures project history is machine-readable and auditable.

---

## 1. Decision Tree: Simple vs Complex

- **Simple (≤ 2 days)**: Entry in `ENHANCEMENTS.md` only. Standalone note file.
- **Complex (> 2 days)**: Folder with dedicated index. Requires a **PRD Gate** if high risk or high effort.

---

## 2. The PRD Gate (Complex/High-Risk Only)

Before implementation:
1. **Define the work**: Create a Product Requirements Document (PRD).
2. **Impact Matrix**: Identify what breaks, what conflicts exist, and dependencies.
3. **Approval**: User approves the PRD before any code is touched.

---

## 3. Mandatory Implementation Sequence

1. **Scaffold**: Create the enhancement ID and tracking file/folder.
2. **Execute**: Build the feature. Update the tracking file as each requirement is met.
3. **Verify**: Every enhancement must meet its **Definition of Done (DoD)** criteria.
4. **Commit**: Reference the enhancement ID in every commit message.
5. **Close**: Move the entry to COMPLETED and record the completion date.

---

## 4. Definition of Done (DoD) Framework

Every DoD criterion must have a **Verification Tier**:

| Tier | Name | Method |
|---|---|---|
| **T1** | Automated | Machine-verifiable (tests, lint) |
| **T2** | Deterministic | Manual check with pass/fail evidence |
| **T3** | Documented | User sign-off or screenshot proof |
| **T4** | Blind Trust | No verification (mark as technical debt) |

**Relationship to Validation Gates & Decision Nodes**: DoD tiers operate at the **enhancement completion level** — they answer "is the whole enhancement done?" Validation Gates & Decision Nodes operate at the **step execution level** — they answer "can I move to the next step?" Both are required and complementary: VG/DN governs forward progress during implementation; DoD governs final sign-off. Every implementation step in the execution phase must end with a 🔍 Validation Gate + 🚦 Decision Node block before its checkbox can be marked complete.

---

## 5. Portability Gate (CAP-035)

For every complex enhancement, evaluate if the change contains a reusable pattern.
If YES, extract it into a portable workflow using the standard metadata format.

---

## Gotchas

- **Amorphous Scope**: If a task keeps growing, split it into multiple smaller enhancements.
- **Registry Drift**: If the agent forgets to update `ENHANCEMENTS.md`, implementation state is lost. Update the registry after every major milestone.
- **Orphaned Specs**: Ensure every spec in the notes folder is linked from the master registry.
