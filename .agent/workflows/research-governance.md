---
description: Systematic multi-document research workflow - ensures 100% document coverage, source traceability, and structured knowledge synthesis
---

# Research Governance Workflow

> **When to Use**: Multi-document research, literature reviews, comparative analysis, or any task requiring systematic synthesis from multiple sources.
> **Estimated Time**: Varies by document count (15-60 min per document + synthesis time)
> **Produces**: Consolidated report with full source traceability

---

## Pre-Flight Checklist

Before starting, verify research governance is appropriate:

- [ ] Analyzing 3+ documents?
- [ ] Need to compare/contrast across sources?
- [ ] Need source traceability for claims?
- [ ] Producing a consolidated report?

**If YES to 2+** → Use this workflow
**If NO** → Use ad-hoc reading with inline citations

---

## Phase 1: Research Initialization

**Goal**: Establish baseline and create document inventory

### 1.1 Define Research Question

```markdown
Create RESEARCH_QUESTION artifact:

- [ ] What specific question are we answering?
- [ ] What constitutes a complete answer?
- [ ] What is in/out of scope?
- [ ] FREEZE: Question cannot change mid-research
```

### 1.2 Create Document Inventory

```markdown
For EACH document:

- [ ] Assign unique ID: DOC_001, DOC_002, etc.
- [ ] Record: Title, type, source, date, length
- [ ] Note: Authority level (primary/secondary/tertiary)
- [ ] Estimate: Relevance (high/medium/low)
- [ ] FREEZE: Cannot add/remove docs after Phase 1
```

### 1.3 Create Processing Plan

```markdown
Define processing order and approach:

- [ ] Which documents to process first? (foundational → specialized)
- [ ] What reading depth for each? (deep/moderate/skim)
- [ ] Estimated time per document
- [ ] Output: PROCESSING_PLAN.md
```

### Phase 1 Checkgate

> ⛔ **BLOCKER**: Cannot proceed to Phase 2 without:
>
> - Research question documented and frozen
> - All documents inventoried with unique IDs
> - Processing plan defined

---

## Phase 2: Methodology & Framework Selection

**Goal**: Choose systematic analysis approach before processing

### 2.1 Select Research Methodology

```markdown
Choose ONE primary approach:

- [ ] Systematic Review (exhaustive, structured)
- [ ] Scoping Review (breadth, landscape mapping)
- [ ] Comparative Analysis (across sources)
- [ ] Thematic Analysis (patterns, themes)
```

### 2.2 Define Extraction Categories

```markdown
What information types to extract from each document:

- [ ] Factual claims (who, what, when, where)
- [ ] Quantitative data (numbers, statistics)
- [ ] Qualitative findings (themes, patterns)
- [ ] Methodological details (how was it done?)
- [ ] Limitations (stated or implied)
- [ ] Conflicting views (X says Y, Z says W)
```

### 2.3 Create Extraction Template

```markdown
Standardize extraction format:

## Document: [DOC_ID]

### Facts

- [DOC_001:FC_001] "Quote or finding" (Section X, Page Y)

### Quantitative

- [DOC_001:QD_001] Statistic/number (Context)

### Themes

- [DOC_001:TH_001] Theme description (Supporting evidence)

### Conflicts

- [DOC_001:CONFLICT_001] This contradicts [DOC_XXX:FC_XXX] because...
```

### Phase 2 Checkgate

> ⛔ **BLOCKER**: Cannot proceed to Phase 3 without:
>
> - Methodology selected and documented
> - Extraction categories defined
> - Template created for consistent extraction

---

## Phase 3: Systematic Document Processing

**Goal**: Process EVERY document using consistent methodology

### 3.1 For EACH Document (in Processing Plan order)

```markdown
A. Pre-Reading Scan (2-5 min)

- [ ] Read title, abstract/summary, headings
- [ ] Identify document structure
- [ ] Note key topics mentioned upfront

B. Deep Reading & Extraction

- [ ] Read full document systematically
- [ ] Apply extraction template
- [ ] Assign unique IDs to each finding: [DOC_XXX:TYPE_XXX]
- [ ] Quote verbatim with section references

C. Cross-Reference Check

- [ ] Does this confirm findings from earlier docs?
- [ ] Does this contradict earlier findings?
- [ ] Link related findings: [DOC_001:FC_001] ↔ [DOC_003:FC_008]

D. Completeness Verification

- [ ] All sections reviewed?
- [ ] All relevant facts extracted?
- [ ] Cross-references logged?
```

### 3.2 Update Knowledge Base

```markdown
After each document, update cumulative knowledge base:

- [ ] Add new findings to KNOWLEDGE_BASE.md
- [ ] Update CROSS_REFERENCE_MAP.md
- [ ] Flag new conflicts for later analysis
```

### Phase 3 Checkgate

> ⛔ **BLOCKER**: Cannot proceed to Phase 4 without:
>
> - ALL documents in inventory processed
> - Each document has extraction record
> - Cross-references tracked for all overlapping findings

---

## Phase 4: Knowledge Extraction & Mapping

**Goal**: Organize extracted information into structured knowledge map

### 4.1 Group Findings by Theme

```markdown
Create THEME_MAP:
| Theme | Finding IDs | Document Count |
|-------|-------------|----------------|
| [Theme A] | [DOC_001:FC_001], [DOC_003:QD_002] | 3 |
| [Theme B] | [DOC_002:TH_001] | 1 |
```

### 4.2 Identify Consensus vs Conflicts

```markdown
CONSENSUS (3+ documents agree):

- Finding: [Statement]
- Sources: [DOC_001], [DOC_003], [DOC_005]
- Confidence: HIGH

CONFLICT (documents disagree):

- Document A claims: X [DOC_001:FC_003]
- Document B claims: Y [DOC_004:FC_007]
- Possible explanation: [methodology difference / scope difference / time difference]
- Resolution: [Explained / Unexplained / Requires further research]
```

### 4.3 Assess Source Authority

```markdown
Rate each source:
| DOC_ID | Type | Authority | Recency | Quality |
|--------|------|-----------|---------|---------|
| DOC_001 | Peer-reviewed | HIGH | 2025 | Good methodology |
| DOC_002 | Blog post | LOW | 2024 | Opinion-based |
```

### Phase 4 Checkgate

> ⛔ **BLOCKER**: Cannot proceed to Phase 5 without:
>
> - All findings cataloged with source IDs
> - Theme map created
> - Conflicts explicitly identified and analyzed
> - Source authority assessed

---

## Phase 5: Cross-Document Synthesis

**Goal**: Integrate findings into coherent analysis

### 5.1 Thematic Synthesis

```markdown
For EACH major theme:

- What do ALL documents say about this theme?
- Agreement: Docs X, Y, Z all state...
- Disagreement: Doc A claims X, but Doc B claims Y because...
- Evolution: Earlier docs focus on A, later docs emphasize B
- Integrated statement: [Synthesis incorporating all views]
```

### 5.2 Gap Analysis

```markdown
What questions remain unanswered?

- [ ] Information gaps (topics not covered)
- [ ] Perspective gaps (missing viewpoints)
- [ ] Temporal gaps (outdated information)
- [ ] Methodological gaps (no empirical evidence)
```

### 5.3 Confidence Assessment

```markdown
For each major finding:

- HIGH: Confirmed by 3+ docs, high-authority sources
- MEDIUM: Confirmed by 1-2 docs OR some conflicting views
- LOW: Single source OR significant contradictions
```

### Phase 5 Checkgate

> ⛔ **BLOCKER**: Cannot proceed to Phase 6 without:
>
> - All themes synthesized across documents
> - Gaps explicitly documented
> - Confidence levels assigned to all major findings

---

## Phase 6: Consolidated Reporting & Verification

**Goal**: Produce final report with full traceability

### 6.1 Create Consolidated Report Structure

```markdown
# [Research Question] - Consolidated Report

## Executive Summary

- Research question: [Statement]
- Documents analyzed: [Count]
- Key findings: [3-5 bullets]
- Confidence level: [Overall assessment]

## Methodology

- Approach: [Systematic/Scoping/Comparative]
- Documents processed: [List with types]
- Extraction categories: [What was extracted]

## Findings by Theme

### Theme A

- **Finding**: [Statement]
- **Evidence**: [DOC_001:FC_001], [DOC_003:QD_002]
- **Confidence**: HIGH
- **Status**: Consensus across 4 documents

### Theme B

...

## Conflicts & Debates

- [Conflict 1 with both sides presented]
- [Resolution or acknowledgment of unresolved]

## Gaps & Limitations

- [What questions remain?]
- [What perspectives are missing?]

## Appendices

- Appendix A: Complete Finding Catalog
- Appendix B: Document Inventory
- Appendix C: Cross-Reference Map
```

### 6.2 Verification Checklist

```markdown
Before releasing report:

- [ ] 100% document coverage (all docs in inventory processed)
- [ ] 100% finding traceability (every claim has [DOC_ID:FINDING_ID])
- [ ] Quotes match original (±5% tolerance for paraphrase)
- [ ] Contradictions fairly presented (both sides shown)
- [ ] Confidence justified (supported by evidence count)
- [ ] Research question answered (directly addressed in conclusion)
```

### 6.3 Create Audit Trail

```markdown
Document the research process:

- [ ] When was each document processed?
- [ ] What methodology was applied?
- [ ] Who made what interpretations?
- [ ] Can another researcher reproduce this?
```

### Phase 6 Checkgate

> ⛔ **BLOCKER**: Report cannot be released without:
>
> - All verification checklist items passed
> - Every finding traced to source
> - Research question directly answered
> - Audit trail complete

---

## Source Citation Protocol

### Finding ID Format

```
[DOC_XXX:TYPE_YYY]
│        │
│        └─ Finding type + number (FC_001, QD_003, TH_005, CONFLICT_002)
└─ Document ID from inventory

Types:
- FC = Factual Claim
- QD = Quantitative Data
- TH = Theme/Qualitative
- MD = Methodological Detail
- LIM = Limitation
- CONFLICT = Contradiction
```

### Citation in Report

```markdown
"AI governance frameworks show significant variation across jurisdictions"
[DOC_001:FC_003, DOC_005:FC_012, DOC_008:TH_002].

Reader traces: [DOC_001:FC_003] → Appendix A → Full quote with page reference
```

---

## Guardrails

### ⛔ DO NOT proceed if:

- Documents added after Phase 1 inventory frozen
- Methodology changed after Phase 2 complete
- Documents skipped or partially processed
- Findings reported without source IDs
- Conflicts hidden or one-sided presentation

### ✅ SAFE to proceed when:

- All phase checkgates passed
- 100% document coverage verified
- Every finding has traceable source
- Conflicts explicitly documented
- Verification checklist complete

### 🔄 ITERATE if:

- New documents discovered (restart Phase 1)
- Research question needs refinement (restart Phase 1)
- Extraction template inadequate (update Phase 2, reprocess affected docs)

---

## Quick Reference: Artifacts Created

| Phase | Artifact                       | Purpose                      |
| ----- | ------------------------------ | ---------------------------- |
| 1     | `RESEARCH_QUESTION.md`         | Frozen research scope        |
| 1     | `DOCUMENT_INVENTORY.md`        | All docs with unique IDs     |
| 1     | `PROCESSING_PLAN.md`           | Order and approach           |
| 2     | `EXTRACTION_TEMPLATE.md`       | Consistent extraction format |
| 3     | `EXTRACTION_RECORD_DOC_XXX.md` | Per-document findings        |
| 3     | `KNOWLEDGE_BASE.md`            | Cumulative findings          |
| 3     | `CROSS_REFERENCE_MAP.md`       | Finding relationships        |
| 4     | `THEME_MAP.md`                 | Findings grouped by theme    |
| 4     | `CONFLICT_ANALYSIS.md`         | All contradictions           |
| 5     | `SYNTHESIS.md`                 | Integrated analysis          |
| 6     | `CONSOLIDATED_REPORT.md`       | Final output                 |
| 6     | `AUDIT_TRAIL.md`               | Research process record      |

---

## Related Workflows

| Workflow                          | When to Use                            |
| --------------------------------- | -------------------------------------- |
| `/aos-session`                    | Starting/ending research session       |
| `/ssot-reconciliation`            | Documents conflict with codebase       |
| `/complex-architecture-blueprint` | Research informs architecture decision |

---

## Example Invocation

> "I need to analyze these 15 documents about AI governance frameworks. Follow `/research-governance` to ensure I process all documents systematically and produce a consolidated report with full source traceability."
