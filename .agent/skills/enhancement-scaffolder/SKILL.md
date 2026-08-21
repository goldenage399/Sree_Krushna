---
name: enhancement-scaffolder
description: >
  Automates Protocol 6 (Enhancement Protocol) by generating IDs and folders.
  Key SSOT: `ENHANCEMENT_PROTOCOL.md` (repo root).
  Use when user asks to "start new feature", "create enhancement", or "new TASK".
  Enforces 2-day threshold rule and prevents empty/unstructured folders.
---

## Goal

Standardize how work begins. Stop "Folder Sprawl" and "Duplicate IDs".

## The Generator Protocol

### Step 1: ID Discovery and Prefix Validation

**Action**: Read `enhancement-config.json`.

1. Get `next_id` (e.g., 151).
2. Get `canonical_prefix` from `enhancement-config.json`.
   - If `canonical_prefix` is absent from the config: **HALT**. Surface this as a configuration gap — do not default to any prefix. Inform the user that `enhancement-config.json` must define `canonical_prefix` before scaffolding can proceed.
3. Format the ID as `{canonical_prefix}-{next_id}` (e.g., `TASK-151`).
4. **Collision check (mandatory, do not skip)**: `next_id` is a cached counter, not ground truth — a prior session can scaffold an enhancement and fail to bump it (see [.agent/patterns/enhancement-id-staleness-collision.md](.agent/patterns/enhancement-id-staleness-collision.md), origin: TASK-226 collision, 2026-07-30). Before using the ID, grep the whole repo for it:
   ```bash
   grep -rn "{canonical_prefix}-{next_id}" . --include="*.md" --include="*.json"
   ```
   - **No hits** → ID is genuinely free, proceed.
   - **Hits found** → the config is stale. Do NOT use this ID. Find the real next free ID by checking `enhancement-notes/` directly (`ls enhancement-notes/ | grep -oE "{canonical_prefix}-[0-9]+" | sort -t- -k2 -n -u | tail -1`), use max+1, and correct `enhancement-config.json`'s `next_id` to reflect the true state before proceeding.
4. **Prefix mismatch check**: If the user has provided an ID whose prefix does not match
   `canonical_prefix`, this is a foreign reference.

   **Prompt**: _"This ID uses prefix `{provided_prefix}` — what is the source repo for this
   reference? (e.g. `PIOperationsMgmt_Firebase`, `Capsicum`)"_

   → Wait for user to confirm `{source_repo}`.

   **On confirmation — scaffolder auto-writes the annotation**:
   - Find every occurrence of the foreign ID in the current document being authored.
   - Append `(Source: {source_repo})` immediately after each occurrence inline.
   - Do **not** instruct the user to add annotations manually. The scaffolder writes them.
   - Log the annotation action before continuing:
     > `"[Scaffolder] Annotated {foreign_id} with (Source: {source_repo}) at N occurrence(s)."`

   **Example output**:
   > `"[Scaffolder] Annotated PIO-092 with (Source: PIOperationsMgmt_Firebase) at 2 occurrence(s)."`

   Proceed to Step 2 only after the annotation log is confirmed written.
5. **CRITICAL**: Increment `next_id` in `enhancement-config.json` immediately after the user confirms the enhancement.

### Step 2: Complexity Check (Protocol 6)

**Ask**: "Is this a **Simple** task (≤2 days) or **Complex** (>2 days)?"

#### Path A: SIMPLE (Quick Win - ≤2 days)

- **Action 1**: Determine the correct Domain Cluster (see Step 2.5 below).
- **Action 2**: Create standalone file `enhancement-notes/{canonical_prefix}-{Next_ID}-{Title}.md` (NO folder)
- **Action 3**: Append **lean entry** to the correct **Domain Cluster file** — NOT to `ENHANCEMENTS.md` (which is a navigation index and is never a write target)
- **Rule**: Standalone .md file contains full details; cluster entry is metadata only

**Rationale**: Keeps `ENHANCEMENTS.md` as a navigation index (read-only for agents), delegates detail to tracked files, and routes entries to the correct domain cluster for token-efficient agent loading.

#### Path B: COMPLEX (Module/Refactor - >2 days)

- **Action 1**: Determine the correct Domain Cluster (see Step 2.5 below).
- **Action 2**: Append **lean entry** to the correct **Domain Cluster file** — NOT to `ENHANCEMENTS.md`
- **Action 3**: Create folder `enhancement-notes/{canonical_prefix}-{Next_ID}-{Title}/`
- **Action 4**: Create `00_ENHANCEMENT_INDEX.md` inside that folder with full metadata

### Step 2.5: Domain Cluster Selection (MANDATORY before writing any entry)

**Prompt the user** to select the correct cluster:

> Which domain cluster does this enhancement belong to?
> 1. **UI Quality** — Theme system, accessibility, CSS, visual bugs → [UI-QUALITY-ENHANCEMENT-CLUSTER.md](docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md)
> 2. **Infrastructure** — Automation, tooling, CI/CD, testing, performance → [INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md](docs/enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md)
> 3. **Governance** — Protocols, ADRs, documentation, agent intelligence → [GOVERNANCE-ENHANCEMENT-CLUSTER.md](docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md)
> 4. **Business Logic** — Features, workflows, user-facing behaviour → [BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md](docs/enhancements/BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md)

Write the lean entry to the selected cluster file. Update the Master Registry (`ENHANCEMENT-MASTER-REGISTRY.md`) metadata block to reflect the new entry.

### Step 2.7: Definition of Ready — Trade-Off & Dependency Checklist (MANDATORY)

Before creating any folder or writing to any cluster file, confirm the enhancement has passed a basic trade-off and dependency check.

**Prompt the user** (or self-assess if the enhancement is agent-initiated):

> Before we scaffold this, has the proposal been evaluated through these lenses?
>
> 1. **Dependency Lookup**: Have you searched `ENHANCEMENT-MASTER-REGISTRY.md` and the Domain Clusters for keywords related to this feature to identify overlaps and dependent tasks?
> 2. **User value**: What benefit does this deliver to users?
> 3. **Drawbacks / unintended consequences**: What could go wrong or get worse?
> 4. **Efficiency impact**: Does this improve or reduce user workflow speed?
> 5. **System complexity**: How much complexity does this add to the codebase?
> 6. **Implementation considerations**: Any technical constraints or dependencies?
> 7. **Performance risks**: Any concerns for larger datasets or graph-heavy views?
> 8. **Hidden assumptions**: What is being assumed that hasn't been validated?
> 9. **Net justification**: After all trade-offs, is this enhancement still warranted?
>
> If fewer than 6 of 9 items can be answered, use **Template 2 (Gear 2)** from `User_Created/Docs/PROMPT-LIBRARY.md` to complete the analysis before proceeding.

**Gate rule**: If the user says "skip" or the enhancement is trivially simple (≤ 2 hours, single-file change), this check may be deferred and logged as a note in the lean entry. For all other enhancements, it must be answered before Step 3.

> **Gate mapping**: This Gear 2 check is the **ideation gate** ("should we build this at all?"). The downstream **execution gate** is the [5 Lenses Check in plan-review](../workflows/plan-review.md#the-5-lenses-check-feasibility--impact) ("is this specific plan sound before we execute?"). Same five dimensions, different stage — do not consolidate.

---

### Step 3: Scaffold Content

For **Complex** enhancements, write this mandatory frontmatter into `00_ENHANCEMENT_INDEX.md`:

```markdown
# {canonical_prefix}-XXX: [Title]

## 📊 Metadata

- **Category**: FEATURE|REFACTOR|FIX|TEST|DOCS|MIGRATION
- **Priority**: HIGH|MEDIUM|LOW
- **Status**: PENDING
- **Estimate**: [e.g. 16 hours]
- **Target Release**: [e.g. v2.3.0]
- **Risk Level**: LOW|MEDIUM|HIGH

## 🔗 Dependencies

- **Depends On**: None (Foundational)  # Must specify dependent Task ID(s) or "None (Foundational)". Empty [] arrays are banned.
- **Blocks**: None (Foundational)      # Must specify blocked Task ID(s) or "None (Foundational)". Empty [] arrays are banned.

## 🎯 Goal

[One sentence description]

## 🛡️ Risk Assessment

- **Risks**: [e.g. Data loss]
- **Mitigation**: [e.g. Backup before run]

## 📜 SSOT Impact

- [Link to affected SSOT 1]
- [Link to affected SSOT 2]

## 🔍 Open Discoveries

*(Added 2026-07-29, TASK-222 precedent — scaled-down alternative to a proposed full "ADRG-001" governance layer; see TASK-222's Decision Register #16 for why the lighter version was adopted instead.)*

Every architectural issue discovered **during** this enhancement's implementation — not part of the original scope, but surfaced along the way — gets exactly one disposition before the enhancement can close. No row may be left blank at PIRR time (pirr-compliance-checklist Cat 14 checks this).

| ID | Discovery | Severity | Owner | Disposition | Evidence | Linked Task |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| D-001 | [what was found] | Low/Medium/High | [domain] | Resolved / Accepted / Deferred Investigation / Rejected | [file/session evidence] | [TASK-XXX or —] |

- **Resolved**: fixed within this enhancement.
- **Accepted**: intentionally left as-is, rationale required in the Evidence column.
- **Deferred Investigation**: a new investigation task is required in the Linked Task column — this enhancement cannot close with "Deferred Investigation" and an empty Linked Task cell.
- **Rejected**: determined not to be an actual issue — evidence for *why* required in the Evidence column, not just an assertion.

If this enhancement discovered nothing outside its original scope, write "None discovered this session" rather than leaving the table out — an absent section reads as "not checked," not as "nothing found."

## 📋 Implementation Plan

Each step below must follow the VG/DN format. Replace the placeholder blocks with specifics before executing.

### Step 1: [Short imperative title]
* **File to modify**: `src/path/to/file.jsx`
* **What to change**: [One sentence — specific]

**🔍 Validation Gate** (max 2 binary checks):
  1. (Binary) `<command>` → must output `<exact string>` / exit 0
  2. [human-review] `<visual/interaction check>` *(advisory — does not block)*

**🚦 Decision Node**:
  - **Pass**: Proceed to Step 2.
  - **Fail (1st)**: `git checkout src/path/to/file.jsx` — check `<specific thing>`, re-execute gate.
  - **Fail (2nd)**: Halt. Surface to user with observed output.

### Step 2: [Short imperative title]
*(repeat VG/DN block for each step)*
```

### Step 3.5: DoD Template Selection (MANDATORY — v1.7 Standard)

**CRITICAL**: Every enhancement MUST have a DoD table using the **4-Tier Verification Matrix** (v1.7). Template selection based on complexity:

#### SIMPLE Enhancement (≤2 days)

Add this DoD section to the enhancement file:

```markdown
## ✅ Definition of Done (v1.7)

> **Constraint**: ALL criteria must be verified before marking COMPLETED.

| Tier | Name | Criterion | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Static** | Lint/console clean | `npm test`, no console errors | [ ] | [Test output] |
| **T2** | **Functional** | Feature works end-to-end | Manual walkthrough or integration test | [ ] | [Link/Screenshot] |
| **T3** | **Integrated** | SSOT reconciliation complete | Docs updated in same session (AOS Phase C) | [ ] | [PIRR checklist] |
| **T4** | **Standard** | PIRR complete | Linked PIRR artifact with all categories populated — placeholder links do not satisfy T4. Key categories: SSOT reconciliation, navigation integrity, cross-repo reference validation, deprecation audit, standards propagation confirmation. | [ ] | [PIRR artifact link] |

**DoD Completion**: 0/4 criteria verified (0%)
```

#### MEDIUM COMPLEX Enhancement (3–7 days)

Add this DoD section to `00_ENHANCEMENT_INDEX.md`:

```markdown
## ✅ Definition of Done (v1.7)

> **Constraint**: ALL criteria must be verified before marking COMPLETED.

| Tier | Name | Criterion | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Static** | Lint/console clean | `npm test`, no console errors | [ ] | [Test output] |
| **T2** | **Functional** | Feature works end-to-end | Manual walkthrough or integration test | [ ] | [Link/Screenshot] |
| **T2** | **Functional** | All phase exit criteria met | Phase checklists reviewed | [ ] | [Phase checklists] |
| **T3** | **Integrated** | Full data chain verified | UI → Hook → Firebase traced end-to-end | [ ] | [Test script output] |
| **T3** | **Integrated** | SSOT reconciliation complete | Docs updated in same session (AOS Phase C) | [ ] | [PIRR checklist] |
| **T4** | **Standard** | PIRR complete | Linked PIRR artifact with all categories populated — placeholder links do not satisfy T4. Key categories: SSOT reconciliation, navigation integrity, cross-repo reference validation, deprecation audit, standards propagation confirmation. | [ ] | [PIRR artifact link] |

**DoD Completion**: 0/6 criteria verified (0%)
```

#### LARGE COMPLEX Enhancement (2+ weeks)

Add this DoD section to `00_ENHANCEMENT_INDEX.md`:

```markdown
## ✅ Definition of Done (v1.7)

> **Constraint**: ALL criteria must be verified before marking COMPLETED.

| Tier | Name | Criterion | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Static** | Lint/console clean | `npm test`, no console errors | [ ] | [Test output] |
| **T2** | **Functional** | Feature works end-to-end | Manual walkthrough or integration test | [ ] | [Link/Screenshot] |
| **T2** | **Functional** | All phase exit criteria met | Phase checklists reviewed | [ ] | [Phase checklists] |
| **T2** | **Functional** | Service layer map updated | `SERVICE_LAYER_MAP.md` updated | [ ] | [File link] |
| **T3** | **Integrated** | Full data chain verified | UI → Hook → Firebase traced end-to-end | [ ] | [Test script output] |
| **T3** | **Integrated** | SSOT reconciliation complete | Docs updated in same session (AOS Phase C) | [ ] | [PIRR checklist] |
| **T3** | **Integrated** | External architecture review | External review approved | [ ] | [Review comments] |
| **T3** | **Integrated** | Rollback plan verified | Rollback tested or documented | [ ] | [Rollback procedure] |
| **T4** | **Standard** | PIRR complete | Linked PIRR artifact with all categories populated — placeholder links do not satisfy T4. Key categories: SSOT reconciliation, navigation integrity, cross-repo reference validation, deprecation audit, standards propagation confirmation. | [ ] | [PIRR artifact link] |

**DoD Completion**: 0/9 criteria verified (0%)
```

### Step 4: Customization Reminder

After generating the DoD table, remind the user:

> ✅ **DoD table generated (v1.7)**. Review the criteria and customize as needed for your specific enhancement.
>
> **Verification Tier Reference**:
>
> - **T1 (Static)**: Machine-verifiable — syntax, lint, console clean
> - **T2 (Functional)**: Manual check with clear pass/fail — features work, phases exit cleanly
> - **T3 (Integrated)**: End-to-end verification — data chain, external review, rollback tested
> - **T4 (Standard)**: PIRR artifact linked with all categories populated. A placeholder link does not satisfy T4.

## ❌ Example Violation

**User**: "Start a new task for 'Button Color Fix'."

**Agent (Bad)**: Creates `enhancement-notes/TASK-070-Button-Color/` (Overkill!) and writes to `ENHANCEMENTS.md` (wrong target!)

**This skill Intercepts**: "Wait. A button color fix is < 2 days. I will log `TASK-070` as a SIMPLE entry in the **UI Quality Cluster**, not in `ENHANCEMENTS.md` (which is a navigation index)."

## 🔄 Lifecycle Awareness (Protocol 45)

**CRITICAL**: Once this enhancement is scaffolded, all future status updates **MUST** follow the **Tracker-First** rule:

1. Update detailed tracker file FIRST (`enhancement-notes/{canonical_prefix}-XXX-*.md`)
2. THEN sync summary to the **Domain Cluster file** that holds this enhancement's lean entry

## ➡️ What's Next? (Automatic Trigger)

After scaffolding, you MUST immediately:

1. **Invoke `ssot-domain-mapper` skill**:
   - _Goal_: Identify which documents need updating based on the new feature title.
   - _Input_: The feature title and description.
   - _Output_: A list of affected SSOTs to populate the "SSOT Impact" section.

2. **Review DoD criteria** → Customize for your specific enhancement

- **`protocol-enforcer-pre-code`** → Run the 6 planning checks
- **`ssot-domain-mapper`** → Fill in the "SSOT Impact" section
