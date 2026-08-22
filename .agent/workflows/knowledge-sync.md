---
description: Knowledge Synchronization Workflow - Propagate local edits in docs/ssot/ or GEMINI.md/CLAUDE.md across every dependent file in the Task-Dashboard repository.
---

# /knowledge-sync — Knowledge Synchronization Workflow

**Purpose:** Provide a cascade pipeline when you have already modified a file directly inside `docs/ssot/`, `GEMINI.md`, `CLAUDE.md`, or `enhancement-notes/` (e.g., correcting a protocol in `GEMINI.md` or updating a design token definition in the THEME-SYSTEM SSOT). This workflow discovers every affected concept, traces its dependencies, rates impact levels, and propagates the changes to prevent knowledge base drift.

---

## Steps at a Glance

| Phase | Name                      | Goal                                                              |
|-------|---------------------------|-------------------------------------------------------------------|
| 0     | Diff Detection            | Scan git status and history diff since last update                |
| 1     | Concept Identification    | Map the modified files/lines to specific semantic concepts        |
| 2-3   | Dependency Traversal      | Walk upstream, downstream, and sideways dependencies in the graph |
| 4-5   | Impact Analysis & Plan    | Classify affected files (Required/Review/Info) and plan updates   |
| 6     | Approval Gate             | Hold proposed changes for human verification and authorization    |
| 7-9   | Evolution & Validation    | Update dependent files, re-verify links/health, and log entry     |

---

## Invocation

```
/knowledge-sync <what changed> [mode]
```
- `<what changed>` — a description of the manual edit that was already performed (e.g., `updated the escalation timeout rule in GEMINI.md Protocol P-ESC-001`).
- `[mode]` — optional, one of `full` (default) or `dry-run` (preview changes).

---

## Steps & Detailed Instructions

### Step 0: Diff Detection & Concept Identification (Phases 0-1)
1. Retrieve the last relevant commit:
   ```bash
   git log -1 --format=%H -- docs/ssot/ GEMINI.md CLAUDE.md
   ```
2. Diff the workspace against that commit to see all edits:
   ```bash
   git diff --name-only <last_commit_hash> HEAD -- docs/ssot/ GEMINI.md CLAUDE.md enhancement-notes/
   ```
3. Map these file-level modifications to semantic concepts:
   - Modifications in `docs/ssot/ui-design/` → Map to affected CSS token names, component names, or theme behaviours.
   - Modifications in `docs/ssot/architecture-hub/` → Map to the affected service, hook, or data flow pattern.
   - Modifications in `GEMINI.md`/`CLAUDE.md` → Map to the protocol ID (P01–P97, FKL-001, etc.) that was changed.

### Step 2: Semantic Dependency Traversal (Phases 2-3)
1. Search the repository for all occurrences of the modified concept names, protocol IDs, and CSS token names.
2. Walk the semantic relationships:
   - **Upstream**: Check if changing the concept affects higher-level governance docs (e.g., a CSS token change → THEME-SYSTEM.md → FRONTEND-KNOWLEDGE-HUB.md → GEMINI.md quick-reference table).
   - **Downstream**: Check if changing a concept affects implementation details (e.g., a protocol change → skill SKILL.md references → workflow trigger tables).
   - **Sideways**: Check peer relationships (e.g., a component contract change → AGENTS.md accessibility rules → related skill governance).

### Step 3: Impact Analysis & Sizing (Phases 4-5)
1. Rate the impact level for every dependent document:
   - `REQUIRED`: Inconsistent if not updated (must be updated).
   - `REVIEW`: Meaning has shifted (human review recommended).
   - `INFORMATIONAL`: Links or citations need refreshment, but semantic content is unchanged.
   - `NONE`: No action required.
2. Construct a file-by-file Update Plan showing exactly what text will change and why.

### Step 4: Approval Gate & Execution (Phases 6-7)
1. Present the Update Plan to the user.
2. Once approved, update the dependent spokes and skill files.
3. Never restate facts; always reference them by their protocol ID or concept name to prevent future drift.

### Step 5: Validation & Completion (Phases 8-9)
1. Validate link integrity across the repository (check any markdown links that reference the changed sections).
2. Log the synchronization event as a brief history entry noting what concept was updated and which files were cascaded.
3. Stage the updated files:
   ```bash
   git add docs/ssot/ GEMINI.md CLAUDE.md .agent/ .agents/
   ```

---

## Guardrails
- **Concept First**: Never simply search and replace strings. Always determine the semantic meaning of the change first and check if dependent definitions are still logical.
- **No Partial Updates**: Never leave a synchronization half-complete. Every run must fully resolve the impact graph.
- **Lineage Attributability**: Always version and log the synchronization event to preserve history.
- **No Silent SSOT Additions**: Appending new protocol entries or design token definitions is never a self-contained side effect of some other task. Any task that modifies a governance doc must explicitly check upward against dependent skill files and workflow trigger tables before that task is considered done.
