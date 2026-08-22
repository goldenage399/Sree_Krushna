---
description: Prepare a standardized, un-anchored external review package (Source SSOT + Optional Explainer Context + Challenge Prompt) for independent evaluation by external reviewers or secondary AI models.
---

# External Review Package Preparation Workflow (ERP-001)

**Purpose**: Prepare a multi-artifact external review package that allows an independent reviewer (human consultant, secondary AI model, or subagent) to evaluate repository material without anchoring, confirmation bias, or modifying authoritative source files.

**Distinguish from EAC-001** (`external-architecture-consultation.md`): EAC-001 manages the end-to-end lifecycle of external consultations (briefing, exploration, scale-gating, reconciliation). ERP-001 is the **artifact generation engine** used within EAC-001 (Phase 0 / Phase 3) or standalone whenever any plan, PRD, architecture spec, or decision record requires unbiased external review.

---

## 🎯 Core Principles

1. **Un-Anchored Evaluation**: The external reviewer must be instructed to challenge, find contradictions, and evaluate evidence—never to summarize, agree, or lightly reword the proposed direction.
2. **SSOT Invariance**: Source repository artifacts must be preserved strictly unchanged. Do not rewrite or expand source files merely to make them easier for an external reviewer to digest.
3. **Explicit Grounding**: Material claims and context must be explicitly tagged by status:
   - `VERIFIED` — directly supported by source material or codebase
   - `INFERRED` — derived from provided material or logical deduction
   - `UNKNOWN` — not established by provided material
   - `SPECULATIVE` — external hypothesis without current evidence

---

## 🛠️ Step-by-Step Package Preparation

To prepare an external review package, produce **three logically separate artifacts**:

### Artifact 1 — Source Artifact(s)

Treat the target repository artifact(s) (architecture docs, plans, manifests, decision records, design specs) as authoritative SSOT.

- Preserve original files unchanged.
- Where multiple source artifacts are provided, state their relationship clearly.

### Artifact 2 — Reviewer Context / Explainer (Optional)

Determine whether an independent reviewer can meaningfully evaluate the source artifact(s) using *only* the material provided.

- **Rule**: If no additional context is materially necessary, **do not create an explainer**.
- If required context is missing, produce a separate reviewer-context explainer providing *only* the minimum necessary context:
  - Purpose and objective
  - Problem or decision being addressed
  - Relevant current-state context and codebase facts
  - Terminology required to understand source material
  - Relevant constraints, boundaries, and invariants
  - Assumptions materially affecting interpretation
  - Relevant prior decisions or dependencies
  - Specific aspects expected to be evaluated
- **Constraint**: Do not introduce facts, requirements, or scope unsupported by the provided material. Mark every contextual claim as `VERIFIED`, `INFERRED`, or `UNKNOWN`.

### Artifact 3 — External Review Prompt

Generate a separate, reusable prompt that accompanies Artifact 1 (and Artifact 2, if created).

The prompt MUST explicitly instruct the reviewer to:
1. Assess sufficiency of provided material for independent review.
2. Search for internal consistency issues, contradictions, and logical gaps.
3. Evaluate evidence supporting material claims and identify unresolved unknowns.
4. Challenge assumptions, boundaries, invariants, and dependencies.
5. Identify risks, trade-offs, and critical edge cases.
6. Evaluate whether proposed direction satisfies stated objectives and if success criteria are adequate.
7. Classify findings as:
   - `VERIFIED`
   - `INFERRED`
   - `SPECULATIVE`
   - `MISSING`
8. Categorize materiality (blocking vs non-blocking findings).
9. Refrain from:
   - Assuming undocumented conversation history
   - Inventing missing facts or introducing unrelated scope
   - Redesigning the subject merely because alternatives exist
   - Treating assertions as established facts

---

## 📋 Required Pre-Execution Checklist

Before outputting the package, explicitly verify:

- [ ] What the reviewer already knows from the source artifact(s)
- [ ] What the reviewer cannot reliably determine from source material alone
- [ ] Which missing information is genuinely required for review (justifying Artifact 2)
- [ ] Whether Artifact 3 enforces challenge-oriented, evidence-based evaluation rather than validation

---

## 🔗 Relationship to Other Workflows

| Workflow | Relationship |
|---|---|
| [external-architecture-consultation.md](external-architecture-consultation.md) (EAC-001) | **Lifecycle Master**. EAC-001 manages the consultation lifecycle; ERP-001 is the package-builder engine used during briefing and verification phases. |
| [architecture-council.md](architecture-council.md) | Can use ERP-001 packages to gather independent pre-council second opinions on major architectural proposals. |
| [plan-review.md](plan-review.md) | Use ERP-001 when a complex feature plan requires external or multi-model review prior to approval. |

---

*Origin: Query 1.0 — External Review Package Preparation (260809_NewWorkflows.md)*
