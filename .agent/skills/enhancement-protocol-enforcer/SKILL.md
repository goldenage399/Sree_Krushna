---
name: enhancement-protocol-enforcer
description: >
  Hard gate before creating any enhancement ticket. Enforces the full
  Enhancement Protocol (ENHANCEMENT_PROTOCOL.md + enhancement-scaffolder SKILL.md):
  correct ID from enhancement-config.json, right folder structure, mandatory
  cluster file lean entry, DoD v1.7 matrix, and VG/DN validation gates per phase.
  Triggers on any request to "create enhancement", "log enhancement", "add to backlog",
  "put into enhancements", or when agent would otherwise write a free-form
  enhancement/ticket document without following the protocol.
---

# Enhancement Protocol Enforcer

## Why This Skill Exists

Free-form enhancement documents written outside the protocol (wrong location,
missing DoD, no VG/DN gates, no cluster entry, no registry update) are silent
failures — they look like tracked work but are invisible to the backlog system.
This skill runs as a pre-write gate every time an enhancement needs to be created.

**Announce at start:** "Running enhancement-protocol-enforcer before scaffolding."

---

## Gate Sequence (run in order, halt on any failure)

### Gate 1 — Read the protocol sources

Before writing a single file, read both:

1. `ENHANCEMENT_PROTOCOL.md` (repo root) — lifecycle rules, cluster model, prefix governance
2. `.agent/skills/enhancement-scaffolder/SKILL.md` — ID discovery, complexity path, DoD template selection

Do not proceed until both are loaded.

---

### Gate 2 — Get the next ID

Read `enhancement-config.json` (repo root).

- Extract `canonical_prefix` (e.g. `TASK`) and `next_id` (e.g. `199`).
- Format: `{canonical_prefix}-{next_id}` → e.g. `TASK-199`.
- **If `canonical_prefix` is absent: HALT.** Do not default. Surface the gap to the user.
- Increment `next_id` in `enhancement-config.json` **immediately after the user confirms** the enhancement (not before).

---

### Gate 3 — Complexity classification

Classify the enhancement before creating any file:

| Class | Criteria | Output |
|---|---|---|
| **Simple** | ≤2 days, <200 lines, <3 files, <3 phases | Standalone `.md` in `enhancement-notes/` — NO folder |
| **Complex** | >2 days OR >4 phases OR architecture changes | Folder in `enhancement-notes/{ID}-{Title}/` + `00_ENHANCEMENT_INDEX.md` |

For **Simple**: create `enhancement-notes/{ID}-{Title}.md` (no folder).  
For **Complex**: create `enhancement-notes/{ID}-{Title}/00_ENHANCEMENT_INDEX.md`.

**Never create a folder for a Simple enhancement. Never write a flat file for a Complex one.**

---

### Gate 4 — Domain cluster selection

Select the correct cluster **before writing any file**:

| Cluster | Domain | File |
|---|---|---|
| UI Quality | Theme, CSS, visual bugs, token standards, component layout | `docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md` |
| Infrastructure | Automation, tooling, CI/CD, testing, performance, caching | `docs/enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md` |
| Governance | Protocols, ADRs, documentation, agent intelligence | `docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md` |
| Business Logic | Features, workflows, user-facing behaviour, navigation | `docs/enhancements/BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md` |

If the correct cluster is ambiguous, ask the user. Do not default silently.

---

### Gate 5 — Mandatory file structure

#### For Complex enhancements, `00_ENHANCEMENT_INDEX.md` must contain all of:

```markdown
# {ID}: {Title}

## 📊 Metadata
- **Category**: FEATURE|REFACTOR|FIX|TEST|DOCS|MIGRATION
- **Priority**: HIGH|MEDIUM|LOW
- **Status**: PENDING
- **Estimate**: [e.g. 8 hours]
- **Target Release**: [e.g. v2.4.0]
- **Risk Level**: LOW|MEDIUM|HIGH

## 🔗 Dependencies
- **Depends On**: None (Foundational) OR {TASK-ID}
- **Blocks**: None OR {TASK-ID}

## 🎯 Goal
[One sentence]

## 🛡️ Risk Assessment
- **Risks**: ...
- **Mitigation**: ...

## 📜 SSOT Impact
- [Affected file or doc 1]
- [Affected file or doc 2]

## 📋 Implementation Plan
[Steps with VG/DN gates — see Gate 6]

## ✅ Definition of Done (v1.7)
[DoD table — see Gate 7]
```

**Empty `[]` in Dependencies is banned.** Always write `None (Foundational)` or an explicit ID.

---

### Gate 6 — Validation Gates and Decision Nodes per phase (MANDATORY)

Every implementation step must end with:

```markdown
**🔍 Validation Gate**:
  1. (Binary) `<runnable command>` → must return `<exact expected output>`
  2. [human-review] `<visual or UX check>` *(advisory — does not block)*

**🚦 Decision Node**:
  - **Pass**: Proceed to next step.
  - **Fail (1st)**: `<specific command or targeted action>`. Re-execute gate.
  - **Fail (2nd)**: Halt. Surface to user with observed output.
```

Rules:
- Max 2 gate checks per step. More than 2 = split the step.
- `Fail (1st)` must name a specific command — not "investigate".
- `Fail (2nd)` must always escalate to user.
- Free-form prose ("verify that X works") is not a valid gate.

---

### Gate 7 — DoD v1.7 table (MANDATORY)

Select the correct template based on complexity:

**Simple (≤2 days)** — 4 rows:

| Tier | Name | Criterion | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Static** | Lint/console clean | `npm test`, no console errors | [ ] | [Test output] |
| **T2** | **Functional** | Feature works end-to-end | Manual walkthrough or integration test | [ ] | [Link/Screenshot] |
| **T3** | **Integrated** | SSOT reconciliation complete | Docs updated in same session (AOS Phase C) | [ ] | [PIRR checklist] |
| **T4** | **Standard** | PIRR complete | Linked PIRR artifact with all categories populated | [ ] | [PIRR artifact link] |

**DoD Completion**: 0/4 criteria verified (0%)

---

**Medium Complex (3–7 days)** — 6 rows (add T2 phase checklist + T3 data chain):

| Tier | Name | Criterion | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Static** | Lint/console clean | `npm test`, no console errors | [ ] | [Test output] |
| **T2** | **Functional** | Feature works end-to-end | Manual walkthrough or integration test | [ ] | [Link/Screenshot] |
| **T2** | **Functional** | All phase exit criteria met | Phase checklists reviewed | [ ] | [Phase checklists] |
| **T3** | **Integrated** | Full data chain verified | UI → Hook → Firebase traced end-to-end | [ ] | [Test script output] |
| **T3** | **Integrated** | SSOT reconciliation complete | Docs updated in same session (AOS Phase C) | [ ] | [PIRR checklist] |
| **T4** | **Standard** | PIRR complete | Linked PIRR artifact with all categories populated | [ ] | [PIRR artifact link] |

**DoD Completion**: 0/6 criteria verified (0%)

---

### Gate 8 — Post-write registry and config updates (ALL enhancements)

After writing the enhancement file(s), in this exact order:

1. **Cluster file** — add lean entry at the top of the cluster's OVERVIEW section:
   ```
   ### **{ID}: {Title}** 📋 **PENDING**
   **Added**: {YYYY-MM-DD}
   **Status**: 📋 **PENDING**
   **Priority**: {HIGH|MEDIUM|LOW}
   **Scope**: {one-line description}
   **Documentation**: [00_ENHANCEMENT_INDEX.md]({relative path})
   ```

2. **`ENHANCEMENT-MASTER-REGISTRY.md`** — prepend to `recent_activity` string:
   ```
   "{ID} 📋 **PENDING** ({date}) - {Title} - {one-line scope}. Tracker: enhancement-notes/{folder}."
   ```
   Also increment `total_enhancements` by the number of new tickets.
   Update `last_updated` to today's date.

3. **`enhancement-config.json`** — increment `next_id` by the number of new tickets created.

---

## Common Mistakes This Skill Prevents

| Mistake | What this skill does instead |
|---|---|
| Writing enhancement files to `docs/enhancements/` | Writes detail to `enhancement-notes/`, lean entry only to cluster file |
| Free-form section prose with no gates | Enforces VG/DN block on every step |
| Missing DoD table | Gate 7 generates the correct tier template |
| Writing directly to `ENHANCEMENTS.md` | ENHANCEMENTS.md is a navigation index — never a write target |
| Using `[]` for Dependencies | Writes `None (Foundational)` or explicit IDs |
| Skipping cluster file lean entry | Gate 8 enforces lean entry before done |
| Skipping registry update | Gate 8 enforces registry + config increment before done |
| Creating a folder for a simple task | Gate 3 classifies first, then routes to flat file vs folder |
