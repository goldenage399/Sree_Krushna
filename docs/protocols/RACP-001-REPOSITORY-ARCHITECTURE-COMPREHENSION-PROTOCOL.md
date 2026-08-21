# RACP-001 — Repository Architecture Comprehension Protocol

**Status:** Mandatory
**Applies To:** Any architectural, cross-cutting, infrastructure, design-system, runtime, governance, or multi-file implementation.

---

# Mission

The objective is **NOT** to implement the requested feature.

The objective is to ensure that the repository is sufficiently understood **before** implementation begins.

No code may be modified until the repository proves that it can explain itself.

If the repository cannot explain itself, improving repository intelligence becomes part of the deliverable.

---

# Core Principle

> **Never modify architecture that has not first been modelled.**

Implementation is Phase 2.

Repository comprehension is Phase 1.

---

# Primary Deliverable

Produce a complete **Architectural Mental Model** of the affected subsystem.

The implementation plan must emerge naturally from this model.

Never reverse the order.

---

# Risk-Based Scaling Gate

To preserve development velocity on routine modifications, this protocol scales based on the risk and blast radius of the proposed change. 

| Risk Category | Trigger Conditions | Required Sections / Actions |
| :--- | :--- | :--- |
| 🔴 **High Risk** | • Modifying security rules (`firestore.rules`) or index files.<br>• Modifying collection schemas.<br>• Adding new React contexts or Service layer integrations.<br>• Modifying components/services across 3 or more surfaces. | **FULL COMPLIANCE**:<br>Must execute all Phases (0-5), construct all graphs/matrices, and pass all 10 Validation Gates. |
| 🟡 **Medium Risk** | • Adding helper utilities or services to existing modules.<br>• Modifying hooks (`useTaskQuery`, `usePermissions`, etc.) with >2 consumers.<br>• Refactoring 2 surfaces. | **LIGHTWEIGHT COMPLIANCE**:<br>Must run Phase 0 (Assessment) and document the SSOT, owners, and validation method. Full graphs are optional. |
| 🟢 **Low Risk** | • Simple layout tweaks, typography, or localized component styling.<br>• Documentation edits.<br>• Bug fixes in leaf/non-shared utility functions. | **EXEMPT**:<br>Exempt from full RACP-001 modeling. Standard pre-flight checklist and AGP-001 pipeline apply. |

---


# Phase 0 — Repository Intelligence Assessment

Determine whether the repository can answer the following without reverse engineering.

For every question answer

- YES
- PARTIAL
- NO

Questions

1. Where is the SSOT?
2. Who owns this capability?
3. What produces it?
4. What consumes it?
5. What is generated?
6. What is runtime?
7. What is build-time?
8. What validates it?
9. What governs it?
10. What may safely modify it?

Any answer of PARTIAL or NO becomes a repository finding.

---

# Phase 1 — Architectural Reconstruction

Reconstruct the subsystem before touching code.

Produce the following.

## 1. Capability Map

Every capability involved.

Owner.

Consumers.

Dependencies.

Extension points.

Validation points.

---

## 2. Runtime Graph

How runtime values flow.

Beginning at SSOT.

Ending at runtime.

No assumptions.

---

## 3. Build Graph

Generation pipeline.

Generated artifacts.

Inputs.

Outputs.

Validation.

---

## 4. Dependency Graph

Inbound dependencies.

Outbound dependencies.

Cross-subsystem dependencies.

---

## 5. Ownership Matrix

Every artifact classified.

Allowed ownership states only

- Source
- Generated
- Runtime
- Consumer
- Configuration
- Documentation
- Validation

Exactly one owner per artifact.

---

## 6. Modification Boundary

Identify

Safe modification points.

Unsafe modification points.

Generated files.

Protected files.

---

## 7. Knowledge Inventory

Determine whether the repository already contains

- SSOT
- ADR
- Registry
- Topology
- Runtime Flow
- Ownership Map
- Validation Guide
- Capability Definition
- Extension Guide

If missing

Record deficiency.

Do not create immediately.

---

# Phase 2 — Repository Capability Assessment

For every investigation ask

Why did this investigation become necessary?

Continue until root cause is repository-level.

Classify only into

- Discoverability
- Traceability
- Ownership
- Capability Visibility
- Runtime Visibility
- Build Visibility
- Governance
- Knowledge Preservation
- Architectural Navigation

No implementation discussion.

---

# Phase 3 — Gap Normalization

Every finding must pass

Observation

↓

Repeated Observation

↓

Repository Pattern

↓

Repository Capability Gap

↓

Missing Knowledge Asset

↓

Missing Architectural Principle

↓

Governance Classification

Failure at any stage rejects the finding.

---

# Phase 4 — Architecture Readiness Review

Implementation is prohibited until every item below is complete.

✓ Runtime owner identified

✓ Build owner identified

✓ Capability owner identified

✓ SSOT identified

✓ Generated artifacts identified

✓ Runtime flow proven

✓ Dependency graph complete

✓ Ownership matrix complete

✓ Validation strategy known

✓ Modification boundary established

---

# Phase 5 — Implementation Planning

Only now may implementation planning begin.

Every proposed modification must reference

- owning capability
- owning SSOT
- validation method
- affected consumers

No orphan modifications.

---

# Validation Gates

## Gate 1 — Architecture First

No file edits before Phase 4 passes.

Failure rejects implementation.

---

## Gate 2 — Single Ownership

Every modified artifact must have one authoritative owner.

No dual ownership.

---

## Gate 3 — Runtime Traceability

Every runtime value must trace back to one source.

No ambiguity.

---

## Gate 4 — Build Traceability

Every generated artifact must identify

- source
- generator
- consumer

---

## Gate 5 — Dependency Completeness

Every dependency must be classified.

No unknown edges.

---

## Gate 6 — Knowledge Coverage

Every architectural question must resolve to one of

- Existing repository knowledge
- Missing repository knowledge

No unanswered questions.

---

## Gate 7 — Repository Independence

Replace the requested feature with

<Any Future Feature>

If the architectural findings change

Reject them.

---

## Gate 8 — Evidence Integrity

Every conclusion must cite repository evidence.

Unsupported conclusions are rejected.

---

## Gate 9 — Falsification

Attempt to disprove every architectural conclusion.

Document

Alternative explanation.

Evidence against.

Reason rejected.

---

## Gate 10 — Readiness

Implementation may begin only after Architecture Review passes unanimously.

---

# Guardrails

Never

- modify generated files
- assume ownership
- infer runtime flow
- infer build flow
- duplicate configuration
- create parallel SSOTs
- create capability ownership conflicts
- create undocumented extension points
- bypass repository validation
- rely on conversation memory where repository evidence should exist

If repository knowledge is missing

Record it.

Do not silently compensate.

---

# Definition of Done

The work is complete only when

1. The subsystem can be understood without reverse engineering.
2. Another engineer can identify the correct modification point in under five minutes.
3. Every modified artifact has a single owner.
4. Every runtime value has a traceable origin.
5. Every generated artifact has a traceable source.
6. Every capability has an identified owner.
7. Every architectural gap has been classified.
8. Every missing knowledge object has been recorded.
9. All implementation changes reference their owning capability and SSOT.
10. A future engineer can implement a similar feature without repeating this investigation.

---

# Success Metric

The repository should transition from this:

Need change
→ Search
→ Reverse engineer
→ Build mental model
→ Modify

to this:

Need change
→ Architecture Index
→ Capability
→ Owner
→ SSOT
→ Modify
→ Validate

If future engineers must repeat the original investigation, this protocol has failed.
