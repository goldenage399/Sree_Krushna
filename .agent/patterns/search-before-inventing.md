---
pattern: search-before-inventing
activation_tier: reference
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
canonical_source: ug-farmhouse
porting_effort: low
---

# Pattern: Search Before Inventing (Exhaustive Cross-Repo Discovery)

**ID**: `search-before-inventing`  
**Type**: Architectural & Process Governance  
**Severity**: High (prevents redundant infrastructure creation and silent divergence from existing canonical protocols)  
**Origin Incident**: UG-Farmhouse 2026-08-14 Workflow Governance Session (`260814_WorkflowUpgrades.md`, Query 2.4–2.7)

---

## The Rule

> **Before concluding that a mechanism, tool, pattern, or protocol does not exist, an agent must perform an exhaustive directory search and follow all named external-repo references at least one hop.**

Never declare a capability absent based solely on the first file inspected. If an existing script or workflow addresses a related concern, inspect adjacent workflows and follow cross-repo pointers to the canonical specification before designing net-new infrastructure.

---

## Problem & Context

When solving a cross-repo synchronization or governance problem, agents frequently:
1. Inspect the nearest local tool (e.g. `sync-portable.ps1`).
2. Observe that the tool only implements a basic subset (e.g. whole-file MD5 copy).
3. Conclude prematurely: *"The ecosystem has no mechanism for block-level sync; we must invent a new pattern."*

This premature conclusion creates:
- **Redundant mechanisms**: Re-inventing what the ecosystem already specified under a different name.
- **Protocol fragmentation**: Local conventions drift away from the central ecosystem standard.
- **Wasted architectural cycles**: Inventing custom workarounds (e.g. prefixing files with `ugf-`) instead of adopting the canonical standard.

---

## What It Looked Like (Origin Incident)

During the UG-Farmhouse 2026-08-14 governance session:
1. The agent needed to determine if block-level sync existed across repositories for council SOPs.
2. The agent checked `sync-portable.ps1`, saw it only did whole-file copies, and concluded that no block-level sync protocol existed in the ecosystem.
3. Based on that assumption, the agent proposed forking files into repo-specific names (`ugf-architecture-council.md`).
4. **The reality**: Sitting in the exact same `.agent/workflows/` directory was `sap-sync.md`, which explicitly referenced `PIOperationsMgmt_Firebase/docs/SHARED_ALIGNMENT_PROTOCOL.md` §1 defining the canonical `<!-- shared:<id>:start/end -->` shared-block mechanism.
5. The canonical standard existed all along—it was just one grep and one reference-hop away.

---

## The Solution: Exhaustive Discovery Protocol

Before proposing any new cross-repo pattern, workflow fork, or synchronization tool:

1. **Grep the Entire Directory**:
   * Search `.agent/workflows/` and `.agent/patterns/` for domain keywords (e.g. `sync`, `shared`, `protocol`, `portable`, `divergence`).
2. **Follow External Pointers 1 Hop**:
   * If any workflow references a canonical document in another repository (e.g. `SHARED_ALIGNMENT_PROTOCOL.md` in `PIOperationsMgmt_Firebase` or `Task-Dashboard`), open and inspect that document before making architectural assertions.
3. **Check Canonical Precedents**:
   * Check whether the problem is already solved on paper or in practice in sibling Tier 1/2/3 repositories before designing new local rules.

---

## Failure Modes & Anti-Patterns

| Anti-Pattern | Correct Practice |
| :--- | :--- |
| **First-File Fallacy**: Stopping search after reading the first partially-relevant file. | Grep the entire workflow directory for related concepts. |
| **Silent Forking**: Renaming or prefixing files to avoid sync collisions without checking if shared-block markers exist. | Adopt canonical shared markers (`<!-- shared:<id>:start/end -->`). |
| **Orphaned Declarations**: Creating a pattern without wiring back-links in consuming workflows. | Wire concrete reference links in all `consumed_by` workflows. |

---

## Grounding & Applicability

This pattern applies universally across all DO-PKOS and SAP-governed repositories:
* Consumed in Phase 0 of `architecture-council.md` and `ui-council.md` (Evidence Collection & Concept Collision Check).
* Consumed in Step 1 of `sap-sync.md` before proposing new synchronization pipelines.
