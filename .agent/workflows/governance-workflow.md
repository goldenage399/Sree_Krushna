---
description: Strict SDLC Governance workflow - prevents "Helpful Inference Trap" via requirement envelopes
---

# Governance Workflow (PIO-069)

> **Trigger**: High-risk feature work in Accounts, Expense, or Ledger modules.
> **Goal**: Force agent to halt on ambiguity instead of inferring.
> **Requirement Envelope Protection**: See `.agent/patterns/ssot-preservation-template-guard.md` for the full protocol on protecting canonical SSOTs from template-driven overwrites.


---

## Overview

This workflow implements a 4-phase state machine:

```
Phase 1: ARTICULATION → Create REQUIREMENT_ENVELOPE (frozen spec)
Phase 2: PLANNING → Create IMPLEMENTATION_PLAN with RTM mapping
Phase 3: EXECUTION → Code with inline RTM citations + Discovery gates
Phase 4: VERIFICATION → Traceability audit before release
```

---

## 🔧 Python Layer Integration (Optional)

### Check if Governance is Enabled

```bash
python -m governance.cli status
```

### Toggle On/Off

```bash
python -m governance.cli enable   # Enable enforcement
python -m governance.cli disable  # Disable for development
```

### Run Governed Research

```bash
python -m governance.cli start-research "question" --docs doc1.md doc2.md
```

### Config File

Edit `governance/governance_config.json` to toggle per-module:

```json
{
  "governance_enabled": true,
  "modules": { "accounts": true, "expense": true }
}
```

---

## Phase 1: ARTICULATION (User + Agent)

### 1.1 Create Requirement Envelope

Copy template from `docs/GOVERNANCE/TEMPLATES/REQUIREMENT_ENVELOPE_TEMPLATE.md`

**Required Sections**:

- Canonical requirement statement (unambiguous)
- Given-When-Then scenarios (concrete examples)
- Explicit Boundaries: ✅Always / ⚠️Ask / 🚫Never
- SSOT references (DATA_FLOW_MAP, CORE_FUNCTION_INDEX)

### 1.2 User Sign-Off

**Gate**: User must sign off before proceeding to Phase 2.

```
Signature: ___________________
Date: ___________________
```

---

## Phase 2: PLANNING (Agent)

### 2.1 Create Implementation Plan

Copy template from `docs/GOVERNANCE/TEMPLATES/IMPLEMENTATION_PLAN_TEMPLATE.md`

**Required**:

- RTM Mapping: Each requirement sentence → code location
- External dependencies verified in SSOT
- Potential discovery gaps identified

### 2.2 User Approval

**Gate**: User must approve plan before execution.

---

## Phase 3: EXECUTION (Agent)

### 3.1 Code with RTM Citations

Every code block must have inline comment:

```javascript
// REQ-ID | SSOT_REF:Line
// Requirement: "fetch paid expenses from Input_Expense"
function getTodaysCashExpenses() { ... }
```

### 3.2 DISCOVERY PROTOCOL (Critical)

```
IF (code reality ≠ requirement):
  → STOP IMMEDIATELY
  → Create DISCOVERY_GATE_REPORT (use template)
  → Present 3 options (A: change req, B: fix docs, C: proceed)
  → WAIT for user decision
  → DO NOT INFER
```

**Template**: `docs/GOVERNANCE/TEMPLATES/DISCOVERY_GATE_TEMPLATE.md`

---

## Phase 4: VERIFICATION (Agent)

### 4.1 Traceability Audit

Copy template from `docs/GOVERNANCE/TEMPLATES/TRACEABILITY_AUDIT_TEMPLATE.md`

**Gates**:

- [ ] 100% forward traceability (all requirements implemented)
- [ ] 100% backward traceability (no orphaned code)
- [ ] All discoveries formally approved

### 4.2 Release Approval

**Gate**: Audit must pass before release.

---

## Quick Reference

| Phase           | Output                       | Gate            |
| --------------- | ---------------------------- | --------------- |
| 1. Articulation | REQUIREMENT_ENVELOPE.md      | User sign-off   |
| 2. Planning     | IMPLEMENTATION_PLAN.md + RTM | User approval   |
| 3. Execution    | Code + RTM citations         | Discovery gates |
| 4. Verification | TRACEABILITY_AUDIT.md        | 100% pass       |

---

## Decision Rules for Agent

```
IF requirement is ambiguous → STOP (do not guess)
IF SSOT documentation missing → STOP (do not proceed)
IF code ≠ requirement discovered → HALT (mid-execution gate)
IF discovery occurs → Create formal report (3 options)

ALWAYS:
• Check envelope first (before code)
• Trace code back to requirement (RTM)
• Halt before inferring

NEVER:
• Infer logic from surrounding code
• Proceed without RTM entry
• Silently resolve ambiguities
```

---

## References

- [GOVERNANCE_PROTOCOL.md](../../docs/GOVERNANCE/GOVERNANCE_PROTOCOL.md) - Full framework
- [DOCUMENTATION_HUB.md](../../docs/DOCUMENTATION_HUB.md) - Governance section
- [PIO-069 Enhancement](../../enhancement-notes/PIO-069-AgenticGovernanceFramework/00_ENHANCEMENT_INDEX.md)
