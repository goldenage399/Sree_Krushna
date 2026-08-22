---
pattern: ssot-reconciliation
description: Portable workflow for resolving architectural drift when code and docs diverge.
origin_cap: PIOps-SSOT
tier: universal
applies_to:
  - "Architectural drift resolution"
  - "Conflicting documentation"
  - "Code/Doc synchronization"
prereqs:
  - "Documentation Hub (Docs Hub)"
porting_effort: low
canonical_source: GEMINI.md
last_reviewed: 2026-04-21
---

# Portable Workflow: SSOT Reconciliation

**Purpose:** Resolve architectural drift when code, documentation, and reality diverge.

---

## 1. Trigger: Context Lock (Protocol #56)

**Action:** When a conflict is discovered, PAUSE all code fixes. Clearly state:
1. **Observed Behavior**: What the code actually does.
2. **Expected Behavior**: What the doc or user claims it should do.
3. **Mismatch Point**: Where the gap is visible (logs, UI, tests).

---

## 2. The Reconciliation Steps

1. **Knowledge Scan**: Gather ALL claims from all sources (SSOTs, enhancement notes, code comments) without judgment.
2. **Drift Detection**: List specific contradictions explicitly.
3. **Root Cause Archaeology**: Trace the Git history to understand *why* the divergence happened (e.g., a partial refactor or an emergency workaround).
4. **Authority Resolution**: Make an explicit decision on which version is the "Truth." Document the rationale for rejecting alternatives.
5. **SSOT Hardening**: Update the authoritative document (e.g., `_SSOT.md`) to be unambiguous.
6. **Redaction**: Mark obsolete or conflicting documents as `[SUPERSEDED]` or `[OUTDATED]` with links to the new truth.
7. **Readiness Gate**: Confirm that one unambiguous truth exists before proceeding with code fixes.

---

## 3. Implementation Guardrail

**Rule:** Never propose a code fix to a "bug" that is actually a documentation-code conflict until Step 4 (Authority Resolution) is complete and approved by the user.
