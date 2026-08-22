---
pattern: complex-architecture-blueprint
origin_cap: PIOps-Arch
tier: universal
applies_to:
  - "Multi-module changes"
  - "New integrations"
  - "Schema shifts affecting 3+ files"
prereqs:
  - "Documentation Hub (Docs Hub)"
porting_effort: medium
canonical_source: GEMINI.md
last_reviewed: 2026-04-21
description: "C4-style planning, ADRs, and phased rollouts."
---

# Portable Workflow: Complex Architecture Blueprint

**Purpose:** Standardize the design of complex features to ensure long-term maintainability, clear decision-making, and safe execution.

---

## 1. Complexity Threshold (Protocol #58)

**Invoke this workflow IF 2+ of these are true:**
- Affects 2+ modules.
- Requires schema changes (adding/moving columns).
- Has cross-module data dependencies.
- Requirements are ambiguous and need clarification.

---

## 2. The Blueprint Components

1. **As-Is vs. To-Be Diagrams**: Use C4-style ASCII diagrams to show the structural shift.
2. **Gap Analysis Table**: Map exactly what exists vs. what's missing per module.
3. **ADRs (Architectural Decision Records)**:
   ```markdown
   ### ADR-[ID]: [Title]
   - **Context**: Why is this change needed?
   - **Decision**: What did we choose?
   - **Alternatives**: What did we reject and why?
   - **Consequences**: What are the trade-offs?
   ```
4. **Phased Implementation**: Break the work into independent, testable phases (max 3 days per phase).
5. **Rollback Plans**: Define a surgical rollback procedure for every phase.

---

## 3. Implementation Guardrail

**Rule:** Never start coding a "Complex" task (per Threshold) until the Blueprint artifact is created and the user has approved the ADRs and Phasing plan.
