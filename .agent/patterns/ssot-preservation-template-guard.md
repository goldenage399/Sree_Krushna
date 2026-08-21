---
pattern: ssot-preservation-template-guard
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "blueprint document"
  - "template output"
  - "Output only the document"
  - "update ssot"
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# SSOT Preservation & Template Invariant Protocol

**Category**: Design Gate / Anti-Pattern Prevention  
**Applies to**: Any turn updating or generating SSOT documents (`docs/ssot/`) in response to structured user prompt templates or scaffold requests  
**Origin**: 2026-08-09 — Blind prompt-template execution wiping `WORK-DECOMPOSITION-SSOT.md` (`260730_SubTasks V2.md:L5296-L5387`)  
**Status**: VALIDATED (Confirmed recurrent failure mode across 2 separate session turns)  

---

## Anti-Pattern — Blind Template Overwrite of Canonical SSOTs

### What It Is
When a user prompt includes a generic, highly structured Markdown document template (e.g. *"You are a senior product architect... Generate a VISION + BLUEPRINT document with sections 1–7... Output only the document"*), the LLM agent blindly executes `write_to_file` with `Overwrite: true` on the target SSOT document. 

This replaces the existing canonical SSOT with a generic template draft, inadvertently erasing hard-won domain facts, retractions, reading contracts, and inbound anchor links.

### Symptoms
1. **Loss of Reading Contracts & Governance Frontmatter**: Section 0 reading contracts, PACT/RFG-001 certainty tags, and anchor disclaimers disappear.
2. **Erased Retractions & Drift Corrections**: Historical corrections (e.g. §6 D1/D2/D3/D4 retractions) are wiped out, re-instating false beliefs across the repository.
3. **Speculative Calendar Dates**: Roadmap sections get filled with invented calendar dates (e.g. `2026-08-17`…`2026-09-30`) in violation of RFG-001 §2 (named triggers only).
4. **State Machine Inversion**: Generic state machines assert illegal state transitions (e.g. auto-writing `status = in_progress` on unblock) that violate strict architectural invariants (ARCH-INV-009 / TLM-009).
5. **Loss of Terminology Tables**: Domain terminology split tables (e.g. the 4-meaning "sub-task" table) are replaced by generic text.

### Why It Fails
The agent prioritizes the prompt template's formatting instructions ("Output only the document") over inspecting the target document's pre-existing governance invariants. It treats the target SSOT file as a blank scratch pad rather than a living, anchor-bearing Single Source of Truth.

---

## Positive Pattern — SSOT Preservation & Template Reconciliation Protocol

### Solution Protocol

Before writing or updating ANY existing SSOT document (`docs/ssot/`) when handling a prompt template:

#### 1. Invariant & Anchor Pre-Flight Audit
Inspect the target SSOT file and extract its mandatory structural anchors:
- **Section 0 Reading Contracts** and RFG-001 certainty tags (`✅ Built`, `🔨 Required Now`, `⏳ Recommended Soon`, `❓ Gated`, `🔭 Future Extension`, `⚠️ Correction`).
- **Retractions & Drift Corrections** (e.g., §6 D1/D2/D3/D4) that neutralize historical false claims.
- **Inbound Anchor Identifiers** linked from external documents (`docs/adr/README.md`, thread banners, ticket indexes).
- **Terminology Split Tables** and Maintenance Rules (§12).

#### 2. Synthesis over Erasure (Never Blind Overwrite)
Reconcile the requested sections into the existing SSOT framework:
- Incorporate new diagrams or overview sections **without** stripping out Section 0, terminology split tables, or retractions.
- Maintain **named triggers only** for deferred/gated roadmap items — **NEVER insert calendar dates**.
- Ensure state machine diagrams strictly reflect derived states vs stored states (ARCH-INV-009 strict 4-state lifecycle).

#### 3. Pre-Commit Verification Gate
Assert the following check before releasing the file edit:
- [ ] Section 0 Reading Contract present with RFG-001 certainty tags?
- [ ] Retractions and drift corrections (§6 D1/D2/D3/D4) intact?
- [ ] Inbound anchor links (`#6-known-drift--corrections`, `#7-phased-roadmap`) preserved?
- [ ] All roadmap items date-free (named triggers only)?
- [ ] State machines compliant with strict 4-state lifecycle (ARCH-INV-009)?

---

## Task-Dashboard Instance
- **Target File**: `docs/ssot/architecture-hub/WORK-DECOMPOSITION-SSOT.md`
- **Incident Reference**: `260730_SubTasks V2.md:L5296-L5387` (Review 5.3).
- **Evidence**: Prompt template output wiped §0, §5, §6 (D1-D4), invented `2026-08-17` dates, and asserted illegal status mutations to `in_progress`. Restored to 533-line canonical form in commit `39ec0a07`.
