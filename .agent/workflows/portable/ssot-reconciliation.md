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

# Portable Workflow: SSOT Reconciliation — Marriage OS Adaptation

**Purpose:** Resolve architectural drift when code (`js/marriage-state.js`, UI views), documentation (`ARCHITECTURE_SPEC.md`, domain hubs), and operational reality diverge.

---

## 1. Trigger: Context Lock (Protocol #56 / P-4PPSD Phase 1)

**Action:** When an entity, ritual, timeline event, or budget discrepancy is discovered, PAUSE all code/markdown fixes. Clearly state:
1. **Observed Behavior / State**: What the code or view actually renders.
2. **Expected Specification**: What `ARCHITECTURE_SPEC.md` or the domain `HUB.md` specifies.
3. **Mismatch Point**: Where the gap is visible (entity ID format, missing field, schema divergence).

---

## 2. Marriage OS Authority Hierarchy

When resolving divergence, evaluate against the strict precedence ladder:
1. **Canonical System Specification**: [`ARCHITECTURE_SPEC.md`](file:///d:/GitHub_Repo/Sree_Krushna/ARCHITECTURE_SPEC.md) (Tier 1 Authority).
2. **Domain Hub Index**: `<Domain>/HUB.md` (Tier 2 Index).
3. **Entity Spoke Specifications**: Detailed specs (`RIT-###`, `EVT-###`, `PER-###`, `FAM-###`, `VEN-###`, `VDR-###`, `CTR-###`, `TSK-###`, `PAY-###`).
4. **State Machine & Code**: `js/marriage-state.js` & UI components.

---

## 3. The 7-Step Reconciliation Process

1. **Knowledge Scan**: Gather ALL entity definitions across markdown specs, templates, and `js/marriage-state.js`.
2. **Drift Detection**: List specific field, status, or identifier mismatches (e.g. missing `P-ENT-ID` padding, untracked vendor contract).
3. **Root Cause Archaeology**: Trace the Git history or session logs to identify why divergence occurred.
4. **Authority Resolution**: Anchor truth to `ARCHITECTURE_SPEC.md` and domain hubs. Document rationale.
5. **SSOT Hardening**: Update authoritative hub/spoke markdown documents.
6. **Redaction & Deprecation**: Mark obsolete structures as `[SUPERSEDED]` with links to the canonical entity spec.
7. **Readiness Gate**: Confirm that one unambiguous truth exists before updating application state or views.

---

## 4. Implementation Guardrail

**Rule:** Never propose a code fix to a "bug" that is actually a documentation-code schema conflict until Step 4 (Authority Resolution) is complete and approved by the user.
