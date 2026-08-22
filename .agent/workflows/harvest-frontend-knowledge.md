---
artifact_type: protocol
activation_tier: reference
status: Active
consumed_by:
  - file: .agent/workflows/aos-session-close.md
    at: "Step 1 Gate 8 (FKL Harvest & Promotion Check)"
  - file: .agent/workflows/debug-frontend.md
    at: "Phase 5: Retrospective"
  - file: .agent/workflows/external-ui-redesign.md
    at: "Phase 5: Sandbox Exit Gate"
  - file: .agent/workflows/mobile-ui-engineering.md
    at: "Phase 4: Session-Close Harvest"
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
description: Frontend Knowledge Harvest & Registration - Harvest and classify frontend layout, styling, and behavioral insights into the FKL.
---

# /harvest-frontend-knowledge — Frontend Knowledge Harvest & Registration

**Purpose**: A universal harvest and registration gate executed at session close or after a major frontend iteration. It detects newly discovered visual, styling, responsive, layout, or behavioral insights, classifies them using the FKL-001 taxonomy, routes incident/pattern/standards rules downstream, and registers design/architectural/workflow types inline with FKL Item Headers to prevent knowledge drift.

---

## 🧭 Workflow Phase Overview

```
                        ┌──────────────────────────────┐
                        │ Phase 1: Discovery (Q1-Q5)  │
                        └──────────────┬───────────────┘
                                       ▼
                        ┌──────────────────────────────┐
                        │    Phase 2: Classification   │
                        └──────────────┬───────────────┘
                                       ▼
                        ┌──────────────────────────────┐
                        │   Phase 3: Routing Branch    │
                        └──────┬────────────────┬──────┘
                               │                │
            ┌──────────────────┴───┐            │
            │ Downstream Exits     │            │ [Design Invariant,
            │ - Case Study (WT-06) │            │  Architectural Learning,
            │ - Defect Pattern     │            │  Workflow Improvement]
            │ - Methodology (PACT) │            ▼
            │ - Standards Rule     │     ┌──────────────┴──────────────┐
            └──────────────────────┘     │   Phase 4: Registration     │
                                         └──────────────┬──────────────┘
                                                        ▼
                                         ┌──────────────┴──────────────┐
                                         │  Phase 5: Header Stamping   │
                                         └──────────────┬──────────────┘
                                                        ▼
                                         ┌──────────────┴──────────────┐
                                         │  Phase 6: Hub & SSOT Sync   │
                                         └──────────────┬──────────────┘
                                                        ▼
                                         ┌──────────────┴──────────────┐
                                         │ Phase 7: Promotion Evaluation│
                                         └──────────────┬──────────────┘
                                                        ▼
                                         ┌──────────────┴──────────────┐
                                         │  Phase 7.5: AGV-001 Check   │
                                         └──────────────┬──────────────┘
                                                        ▼
                                         ┌──────────────┴──────────────┐
                                         │    Phase 8: Validation      │
                                         └─────────────────────────────┘
```

---

## Phase 0 — Triage Gate (Run This First)

**Before doing anything else**, answer both questions below. If either fast-exit condition is met, stop immediately.

### 0.1 — Grep Test

> Is the root cause of the discovery findable in ≤ 2 grep commands by any agent starting from zero context?

If **YES** → The fix is self-evident from the codebase. **Do not harvest.** Write a 1-line comment in the component instead, then exit this workflow.

```
Example: "button needs .button-theme-primary to get the branded gradient" — discoverable with:
  grep -n "button-theme-primary" src/styles/theme-utilities.css
This takes 3 seconds. A 25-tool-call harvest for this is negative ROI.
(`themes-enhanced.css` and the pre-INC-063 opt-out model this example used to cite are retired —
TASK-218 M2.5 / INC-063. Current files: theme-tokens.css + theme-utilities.css.)
```

**Already-captured patterns — do not re-harvest:**
- **CSS Bridge Specificity** (Tailwind responsive class doing nothing, grid not multi-column): Already captured in `.agent/patterns/css-bridge-specificity-management.md` (VALIDATED, 4 instances). Check `node tools/query-cli/cli.cjs --frontend "responsive class no-op bridge"` — if it returns INC-002/INC-022, the pattern is already institutionalized. Exit this workflow, consume the existing pattern instead.
- **Theme Button Opt-out**: Already captured in `.agent/patterns/theme-button-opt-out-contract.md`. Check `.agent/patterns/README.md` index before filing a new harvest for any theme-scope CSS conflict.

### 0.2 — Recurrence Risk

> Is this symptom deceptively non-obvious — i.e. the bug hid in a **different file or layer** than any reasonable first guess would target, AND it is plausible that the same trap recurs across ≥2 component classes?

If **NO** → Exit. If **YES** → Proceed to Phase 1.

### 0.3 — Budget Cap

> Will registering this discovery cost more tool calls than the original fix did?

If **YES** → Exit. Write a 2-line comment in the affected component. Move on.

---

## Phase 1 — Discovery Assessment

### 1.0 — Session Scope (fill in before answering Q1–Q5)

**An agent invoked without session scope will harvest the wrong thing.** Fill in both fields from the invoking context before proceeding. Do not leave blank.

```
Session scope:   [what work this harvest covers — e.g. "FKOM-002 workflow implementation"]
Working commits: [branch + commit range — e.g. "eur-001/m6-ingestion, commits since HEAD~4"]
```

All five discovery questions below are answered relative to this scope only. If something happened in a prior session or a different branch, it is out of scope for this harvest.

---

### 1.1 — Five Discovery Questions

At the end of a session involving any frontend (UI/UX, CSS, JS layout, state subscription, viewport) changes, review the following five discovery questions.

**If the answer to ALL five questions is "No" within the declared scope — skip the harvest and exit.**

```
Did the session produce or identify any of the following?

1. [Q1 — Root Cause]: A new root cause for a defect, layout regression, or rendering anomaly?
2. [Q2 — Reusable Fix]: A reusable fix that resolves similar symptoms across multiple component classes? (If the fix standardizes a shared UI primitive across the codebase, apply `.agent/patterns/ui-primitive-codebase-wide-standardization.md` audit protocol before declaring complete.)
3. [Q3 — Reusable Design Invariant]: A reusable constraint for layout, themes, scroll, sticky, or visual hierarchy?
4. [Q4 — Reusable Process/Methodology]: A repeatable diagnostic pathway, verification check, or E2E validation gate?
5. [Q5 — Architectural Learning]: A system-level constraint or architectural discovery regarding layer interaction?
```

---

## Phase 2 — Classification

For each "Yes" response from Phase 1, generate a **Harvest Record** containing the following fields:

```yaml
discovery_intent: "Brief explanation of the discovery"
symptom_observed: "What visual behavior or logic error occurred"
resolution_applied: "How it was fixed or structured"
fkl_type: "One of the 7 types below (from ADR-015)"
source_reference:
  - "The file and line numbers where the discovery happened"
  - "The active WT-XX (Work Type) trigger code"
```

### FKL-001 Taxonomy Mapping Guide (ADR-015)

Use the rules below to select the exact `fkl_type`:

| Discovery Characteristics | FKL Type | Primary Target File/Path |
| :--- | :--- | :--- |
| Bug history, case study, post-mortem, or incident-specific mapping | **Case Study** | `docs/incidents/INC-XXX.md` |
| Mapped visual or layout failure mode of a component. Test: if it applies only to this component → Defect Pattern; if it generalizes → Design Invariant. | **Defect Pattern** | `docs/ssot/testing-hub/DEBUGGING_HANDBOOK.md` |
| Styling, scroll, or layout rule that generalizes across component classes | **Design Invariant** | `docs/ssot/ui-design/spokes/<spoke>.md` |
| Enforceable, lintable, or mechanically checkable code constraint | **Standards Rule** | `standards-catalog.json` |
| Repeatable diagnostic sequence or research/verification playbook | **Investigation Methodology** | `.agent/patterns/<name>.md` |
| Factual discovery of layer mechanics or binding architectural constraints | **Architectural Learning** | `docs/adr/ADR-XXX.md` or Architecture Hub |
| Improvement to a development or agent workflow file | **Workflow Improvement** | `.agent/workflows/<name>.md` |

---

## Phase 3 — Routing Branch

Based on the classified `fkl_type`, branch to the correct exit workflow or continue inline:

### Exits for Incident, Pattern, and Standards types:
- **Case Study / Defect Pattern** → Route directly to `/post-incident-governance`. Perform Phase 1 capture in `docs/incidents/INC-XXX.md`. (Abbreviated path for single-surface fixes; full audit path for multi-surface/systemic issues).
- **Investigation Methodology** → Route directly to `/capture-pattern` to archive the process playbook under `.agent/patterns/` with a PACT-001 contract.
- **Standards Rule** → Route directly to `/register-standard` to add the rule to `standards-catalog.json`.

### Inline continuation for Design Invariant, Architectural Learning, and Workflow Improvement types:
- **If `fkl_type` is `DesignInvariant`, `ArchitecturalLearning`, or `WorkflowImprovement`** → Proceed directly to **Phase 4 (Knowledge Registration)** below.

---

## Phase 4 — Knowledge Registration

*Note: This phase applies inline for Design Invariant, Architectural Learning, and Workflow Improvement types.*

### Step 4.1: Confirm Target Document
Identify the canonical markdown document where the discovery will be written (e.g. `docs/ssot/ui-design/spokes/COMPONENTS.md` for a cockpit scorecard layout invariant, or `.agent/workflows/debug-frontend.md` for a debugging workflow improvement).

### Step 4.2: Assign FKL Identifier
Generate an ID in the format: `FKL-<PREFIX>-<NNN>`

Find the prefix matching the `fkl_type`:
- Design Invariant → `DI` (e.g., `FKL-DI-008`)
- Architectural Learning → `AL` (e.g., `FKL-AL-005`)
- Workflow Improvement → `WI` (e.g., `FKL-WI-003`)

*Grep check*: Before assigning `NNN`, search the target folder/hub to find the next sequential number:
```powershell
# Search for existing FKL IDs to prevent collisions
Select-String -Path "docs/**/*.md", ".agent/**/*.md" -Pattern "fkl_id: FKL-<PREFIX>"
```

---

## Phase 5 — Header Stamping

Construct and write the canonical FKL Item Header YAML block directly to the target document.

### YAML Schema (Hub Part 9 compliant)
```yaml
---
fkl_id: FKL-<PREFIX>-<NNN>        # Prefix matches Step 4.2
fkl_type: <Type>                  # DesignInvariant | ArchitecturalLearning | WorkflowImprovement
source:                           # Where did this discovery come from?
  - docs/incidents/INC-015        # Link to the Case Study (if promoted)
  - WT-02                         # WT work type code
promoted_from: ""                 # Lineage (if promoted)
applies_to:                       # Affected component classes
  - TaskCard
  - StagingGrid
workflow_activation:              # Work types that should load this item
  - WT-02
  - WT-06
promotion_status: Active          # Active | Superseded | Retired
superseded_by: ""                 # Link to replacement item if retired
content_ref: docs/ssot/ui-design/spokes/RESPONSIVE-DESIGN.md
---
```

### Stamping Location Rules:
1. **For new standalone files**: Place the YAML block at the very top of the file as standard markdown frontmatter.
2. **For appended sections in existing files**: Wrap the YAML block in a collapsed HTML details element directly above the content section:
   ```html
   <details>
   <summary>🔑 FKL Item Header (FKL-DI-008)</summary>

   ```yaml
   ---
   fkl_id: FKL-DI-008
   ...
   ---
   ```
   </details>
   ```

---

## Phase 6 — Hub & SSOT Sync

Verify that the Frontend Knowledge Hub (`FRONTEND-KNOWLEDGE-HUB.md`) reflects the new item:

1. Under **Part 4 (Knowledge Catalog)**, insert a row mapping the new FKL item to its canonical location and consulted phases.
2. Under **Part 2 (Work-Type Catalog)**, ensure that all `WT-XX` types listed in the item's `workflow_activation` metadata have the new item added to their `Required Retrieval Profile` and `Knowledge Sources`.
3. If this update changes multiple documents or impacts other system hubs:
   - Invoke **`/ssot-reconciliation cascade`** (Cascade Mode) to propagate the changes across `DOCUMENTATION-INDEX.md` and `CLAUDE.md`.

### 6.5 — Discoverability Self-Check (DISC-001)

> **Must pass before the fast-path exit is allowed.** A registered item that is not discoverable without grep is effectively invisible to future agents.

Answer all three questions. All must be YES:

- [ ] **SSOT → Source (1-hop)**: Does the FKL item header's `content_ref` or the spoke section body name the exact source file (and ideally line) where the custom utility/breakpoint/token is defined?
- [ ] **Source → SSOT (back-link)**: Does the source file contain a comment pointing back to this SSOT entry? Format: `/* FKL-<ID> SSOT: docs/ssot/... § "<section>" */`
- [ ] **Zero-grep reachability**: Starting from `AGENTS.md → GEMINI.md → FKL Hub → spoke`, can an agent reach both the rule and its implementation in ≤3 navigation steps, with **no grep required**?

If any answer is NO — add the missing link **before** proceeding. Do not invoke the fast-path exit until all three are YES.

> [!NOTE]
> **Origin of this check**: The `cockpit-grid-2` breakpoint (1400px) was registered in session 260626 and was only discoverable by grep — the SSOT had no entry and the CSS had no back-link. DISC-001 prevents recurrence of this "invisible threshold" failure mode.

### ⚡ Fast-Path Exit (Doc-Only Items)

> If the item is `DesignInvariant` or `WorkflowImprovement` AND the change touched **only markdown files** (no code, no `standards-catalog.json`, no Firestore rules) — **skip Phases 7 and 8 entirely.** Hub sync above is sufficient. Governance wiring and sg:scan are for code changes, not doc edits.

---

## Phase 7 — Promotion Evaluation

Every registered item is evaluated against the promotion ladder:

```
Case Study (docs/incidents/)
    ↓  Trigger: Same symptom in ≥2 distinct incidents
Handbook Quick-Reference (DEBUGGING_HANDBOOK.md)
    ↓  Trigger: Rule generalizes beyond a single component
Design Invariant (ui-design/spokes/*.md)
    ↓  Trigger: Rule is mechanically verifiable (lintable or grep-checkable)
Standards Rule (standards-catalog.json + .claude/sg-rules/)
```

1. **Case Study promotion check**: If a Case Study symptom has occurred ≥2 times, promote it: copy the entry to the Handbook Quick-Reference table, assign a new FKL ID (`FKL-DP-NNN`), and run this workflow again to stamp the header.
2. **Handbook to Spoke promotion check**: If a Handbook entry generalizes beyond a single component class, extract it: move the rule to the appropriate Spoke file, assign a new FKL ID (`FKL-DI-NNN`), stamp the header, and mark the legacy DP entry as `Superseded`.

---

## Phase 7.5 — Architecture Promotion Governance (AGV-001)

Run this check whenever the harvested knowledge proposes, discovers, or touches any of the following:
* Shared Component / Reusable Primitive
* Custom Hook / Utility Extraction
* Service Layer / Provider / Registry
* Design System Primitive / Extension Point

### Step 7.5.1 — Consumer Inventory
Determine the active consumers referencing this pattern/component:
```text
Consumer Count: [number]
Production Consumers:
- ...
Experimental/Admin Consumers:
- ...
```

### Step 7.5.2 — Promotion Threshold Check
Evaluate the count against the architecture promotion ladder:
* **Level 0 (Local Implementation)**: Consumer Count = 1. Keep implementation local. Document standards only; do not create a shared primitive/component.
* **Level 1 (Shared Primitive Candidate)**: Consumer Count >= 2. A shared primitive is candidate for extraction.
* **Level 2 (Governed Capability Candidate)**: Consumer Count >= 4 with cross-feature/cross-team usage. Centralized framework capability candidate.

### Step 7.5.3 — Escape Hatch Classification
Determine if the slot is framework-owned or consumer-owned:
```text
Framework Capability OR Escape Hatch

Framework Owns: ...
Consumer Owns: ...
```

### Step 7.5.4 — Counterfactual Test
If the proposed abstraction is NOT created:
* **What concrete problem remains unsolved?**
* *Rule*: If the answer is "None" (e.g., resolved surgically via layout classes), the abstraction fails validation. Default to Level 0 (Local).

---

## Phase 8 — Validation Gate

Before staging and committing the changes:

- [ ] **Authority Drift Check**: Verify that the registered knowledge does not contradict any existing ADR, standard, or spoke invariant. If a contradiction is detected, invoke **`/ssot-reconciliation`** (Conflict Mode) to resolve it.
- [ ] **AGV-001 Audit Check**: Ensure Phase 7.5 evaluation was recorded if an abstraction was proposed, enforcing the Level 0 local-default rule for single consumers.
- [ ] Run `npm run verify:governance-wiring` to verify all back-links.
- [ ] If a `guarded` standard was added during promotion, run `npm run sg:check` and confirm AST tests pass.
- [ ] Working tree is clean and ready for phased commits.
