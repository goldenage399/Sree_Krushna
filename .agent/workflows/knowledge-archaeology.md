---
description: Knowledge Archaeology Workflow (KAE-001) - Recover every durable piece of organizational knowledge from source documents into a 15-file review package, without mutating the knowledge base. Use when onboarding new documents (session transcripts, design docs, feature specs, ADRs, meeting notes) into the Task-Dashboard's User_Created knowledge structure.
---

# /knowledge-archaeology — Knowledge Archaeology Workflow (KAE-001)

**Purpose:** The objective is NOT to summarize documents — it is to recover **every reusable piece of organizational knowledge** that could be valuable in the future, exactly once, with provenance. Assume every processed document may never be read again. Evidence extraction is one phase of this broader pipeline; the workflow only proposes — nothing enters the knowledge base without human approval via the Review Manifest.

**Manifest:** KAE-001, Version 1.0.

**Applies to**: Design decision records, session transcripts in `User_Created/Discussion Threads/`, enhancement notes, post-incident write-ups, external collaborator handoffs, and any incoming documentation that should feed the project knowledge graph.

---

## Pipeline Position

```
Source Document (transcript, spec, meeting note, ADR)
   ↓
Knowledge Archaeology (THIS WORKFLOW)             — recover everything, 15 deliverables
   ↓
Human Review                                       — reviewer marks Review_Manifest.md
   ↓
Knowledge Consolidation (/knowledge-consolidate)   — resolve duplicates/aliases/permanence into one canonical Delta
   ↓
Knowledge Intake (/knowledge-intake)               — mechanically apply the Delta
   ↓
Knowledge Registration + Sync                      — SSOT docs, enhancement notes, architecture docs updated; dependents propagated
```

---

## Mission & Core Principles

- Evidence before interpretation.
- Preserve provenance.
- Never lose information.
- Never duplicate knowledge.
- Prefer atomic artifacts.
- Human approves; agent proposes.
- Confidence is explicit.
- Unknown is acceptable; assumptions are not.

**Success criterion:** another engineer could permanently discard the original documents yet reconstruct nearly all valuable organizational knowledge from the generated artifacts alone. The objective is organizational memory preservation, not document conversion.

---

## Phases at a Glance

| Phase | Name                    | Output                                        |
|-------|-------------------------|-----------------------------------------------|
| 0     | Document Intelligence   | Document Profile                              |
| 1     | Structural Analysis     | Document Structure Map                        |
| 2     | Atomic Evidence         | Evidence items with quotes and provenance     |
| 3     | Entity Discovery        | Entity Register (new vs. merge proposals)     |
| 4     | Relationship Extraction | Relationship Graph                            |
| 5     | Timeline Recovery       | Chronological Timeline                        |
| 6     | Technical Intelligence  | Normalized technical decisions + inconsistencies |
| 7     | Decision Archaeology    | Decision Ledger                               |
| 8     | Strategic Intelligence  | Reusable strategic insights                   |
| 9     | Operational Knowledge   | Processes, SOPs, playbooks, automation candidates |
| 10    | Risk Intelligence       | Risk Register                                 |
| 11    | Knowledge Quality       | Contradictions, duplicates, gaps              |
| 12    | Knowledge Opportunities | Candidate ADRs/protocols/patterns/enhancements |
| —     | Completeness Gate       | COMPLETE / INCOMPLETE status                  |

Follow this order every time.

---

## Phase-by-Phase Instructions

### Phase 0 — Document Intelligence
For each source, determine: document type, author, stakeholders, date, purpose, scope, confidence, and relationship to the existing knowledge corpus in `User_Created/Discussion Threads/`. Handle mixed authorship using separate tracks:
- **Track A (Verified)**: First-hand authored statements (design decisions, code review notes, direct session outputs).
- **Track B (Proposed)**: Recommendations, hypotheses, or speculative ideas not yet adopted.
Propose (do not write) the Source Intelligence registration rows via the Review Manifest.
**Output:** `Document_Profile.md`

### Phase 1 — Structural Analysis
Recover the document's physical anatomy: sections, headings, tables, appendices, code blocks, diagrams, images, footnotes, and metadata. Flag anything lost in conversion as a gap.
**Output:** Document Structure Map (inside `Document_Profile.md`)

### Phase 2 — Atomic Evidence
Extract every verifiable statement. One idea = one evidence item; never merge unrelated evidence. Each item requires:
- exact quote (verbatim from the source)
- normalized statement
- source location (file, heading tree, line numbers)
- confidence (`High` / `Medium` / `Low`)
- evidence category (domain classification)
- supporting context
**Output:** `Evidence_Package.md`

### Phase 3 — Entity Discovery
Discover every identifiable entity: people, teams, components, features, services, Firestore collections, Firebase projects, repositories, protocols, processes, documents, workflows, standards, rules. Check existing SSOT docs (`docs/ssot/`) and enhancement notes first — **create only if not already known; otherwise propose a merge**.
**Output:** `Entity_Register.md`

### Phase 4 — Relationship Extraction
Recover relationships between entities and evidence (e.g., Component → Service, Hook → Firestore, Enhancement → ADR, Bug → Protocol). Use typed verbs: `supports`, `depends_on`, `contradicts`, `extends`, `supersedes`, `duplicates`, `implements`, `references`, `derived_from`, `causes`, `blocks`, `related_to`, `proposes`, `fixes`, `requires`.
**Output:** `Relationship_Map.md`

### Phase 5 — Timeline Recovery
Extract every dated event: design decisions, feature launches, bug reports, protocol additions, enhancement tickets, governance changes, PRs. Every date must become a timeline event or an intentional ignore.
**Output:** `Timeline.md`

### Phase 6 — Technical Intelligence
Recover technical decisions, performance characteristics, API contracts, Firestore schema details, CSS token changes, security rule adjustments, and cost implications. **Flag inconsistencies** for the Contradiction Register.
**Output:** `Technical_Intelligence.md`

### Phase 7 — Decision Archaeology
Recover decisions, rejections, approvals, tradeoffs, alternatives, rationale, constraints, decision makers, and status.
**Output:** `Decision_Ledger.md`

### Phase 8 — Strategic Intelligence
Recover architecture direction, feature priorities, competitive considerations, user experience philosophy, accessibility requirements, and operating principles. **Do not reduce to summaries — capture reusable insights.**
**Output:** `Strategic_Intelligence.md`

### Phase 9 — Operational Knowledge
Recover processes, workflows, SOPs, checklists, playbooks, governance, responsibilities, handoffs, approval chains, and automation opportunities.
**Output:** `Operational_Knowledge.md`

### Phase 10 — Risk Intelligence
Extract risks, assumptions, dependencies, blockers, unknowns, gaps, and mitigations, each with explicit confidence.
**Output:** `Risk_Register.md`

### Phase 11 — Knowledge Quality
Identify duplicates, conflicts, contradictions, obsolete/superseded knowledge, missing context, missing evidence, and low-confidence claims. Compare against all existing SSOT docs, enhancement notes, and protocol registries.
**Outputs:** `Contradiction_Register.md`, `Duplicate_Candidates.md`, `Knowledge_Gaps.md`

### Phase 12 — Knowledge Opportunities
Identify candidate ADRs, principles, protocols, workflows, templates, reusable patterns, new enhancement tickets, and automation. These are proposals only.
**Output:** section inside `Extraction_Report.md` (Automation & Opportunity Candidates)

---

## Mandatory Deliverables (15 files)

Write all outputs into a new folder: `User_Created/Evidence_Review_Packages/<date_source_name>/`

1. `Document_Profile.md`
2. `Evidence_Package.md`
3. `Entity_Register.md`
4. `Relationship_Map.md`
5. `Timeline.md`
6. `Technical_Intelligence.md`
7. `Decision_Ledger.md`
8. `Strategic_Intelligence.md`
9. `Operational_Knowledge.md`
10. `Risk_Register.md`
11. `Knowledge_Gaps.md`
12. `Contradiction_Register.md`
13. `Duplicate_Candidates.md`
14. `Review_Manifest.md`
15. `Extraction_Report.md`

---

## Review Manifest Requirements

Every proposed artifact in `Review_Manifest.md` must expose:

```text
ID | Type | Value | Source | Reason | Confidence | Existing Match | Recommended Action
```

With reviewer choices per item:
- `[ ] Approve`
- `[ ] Reject`
- `[ ] Merge (with existing ID)`
- `[ ] Needs Review`

**Nothing enters SSOT or enhancement notes directly.** Approved manifests are consolidated into a canonical `Knowledge_Delta.md` by `/knowledge-consolidate`, then applied by `/knowledge-intake`. (Small/simple manifests may skip straight to `/knowledge-intake`, which performs the equivalent dedup/merge logic inline.)

---

## Extraction Coverage Report

`Extraction_Report.md` must always produce these metrics: documents processed, sections, tables, code blocks, evidence items, entities, relationships, timeline events, technical records, risks, decisions, insights, patterns, contradictions, duplicates, open questions, automation candidates, coverage %, confidence %.

---

## Completeness Gate

Before marking COMPLETE, answer every question. If **any** answer is NO, Extraction Status = **INCOMPLETE** (state which and why in `Extraction_Report.md`):

1. Did every page/section get analyzed?
2. Did every table get analyzed?
3. Did every code block get inspected?
4. Did every appendix get reviewed?
5. Did every named entity get classified?
6. Did every technical decision get captured?
7. Did every date become a timeline event or intentional ignore?
8. Did every quote become evidence or rejection?
9. Did every decision get captured?
10. Did every process get recovered?
11. Did every technical detail get normalized?
12. Did every contradiction get recorded?
13. Did every reusable insight get extracted?
14. Did every duplicate get checked?
15. Did every uncertainty receive a confidence score?

---

## Guardrails

### ⛔ DO NOT:
- Auto-promote any artifact directly into `docs/ssot/` or `enhancement-notes/`. All additions stop at the review gate.
- Invent or hallucinate details. If context is missing, classify confidence as `Low` and log a Knowledge Gap.
- Merge facts with opinions, or first-hand statements (Track A) with speculative proposals (Track B).
- Summarize when you should extract — atomic artifacts only.

### ✅ SAFE to proceed when:
- The raw document is available and fully readable.
- You are ready to output all 15 deliverables and the Completeness Gate has been answered.
