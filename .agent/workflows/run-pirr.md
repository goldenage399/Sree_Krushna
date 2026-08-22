---
description: Run PIRR (Post-Implementation Reconciliation Review) to sync documentation with code changes
---

# Run PIRR Workflow

> ⚠️ **Deprecated** — PIRR procedure documented here is superseded.
> Canonical SSOT: `.agent/skills/pirr-compliance-checklist/SKILL.md`
> This section is retained for historical reference only.

// turbo-all

## Step 1: Generate Changes File

```powershell
cd D:\GitHub_Repo\Task-Dashboard
git diff > changes.txt
```

If no uncommitted changes, use last commit:

```powershell
git diff HEAD~1 > changes.txt
```

## Step 2: Read the Changes

Read `changes.txt` to understand what was modified.

## Step 3: Run PIRR Analysis

> ⚠️ **Deprecated** — PIRR procedure documented here is superseded.
> Canonical SSOT: `.agent/skills/pirr-compliance-checklist/SKILL.md`
> This section is retained for historical reference only.

Follow this prompt:

> Run the Agent Operating System – Phase C (PIRR).
>
> Use `changes.txt` as the ground truth for what changed.
> Use the architecture docs (GEMINI.md, AUTHENTICATION.md, TASK-MANAGEMENT.md) as reference.
>
> 1. **Detect** SSOT-worthy changes (new patterns, schema changes, significant fixes)
> 2. **Reconcile** documentation with implemented reality
> 3. **Update** affected SSOT docs and trackers
> 4. **Append** to PIRR_RECONCILIATION_LOG.md using atomic append rules

## Step 4: Check Categories

Reference [IMPACT_HINTS.md](../IMPACT_HINTS.md) for priority ordering:

1. **Architecture** - Component structure, data flow
2. **Authentication** - Permissions, roles, hierarchy
3. **Task Management** - Lifecycle, escalation, status
4. **UI/Components** - New components, patterns
5. **Testing** - New test patterns, scenarios

## Step 4.5: Update Hub READMEs (Cross-References)

When updating spoke documents (e.g., DATA_FLOW_SSOT.md), check if the parent hub README needs:

- **New "Common Questions" entries** for significant additions
- **Updated dates** in document tables
- **Updated line counts** if document grew significantly

Hub READMEs to check:

- `docs/ssot/architecture-hub/README.md`
- `docs/ssot/testing-hub/README.md`
- `docs/ssot/dev-workflow-hub/README.md`
- `docs/ssot/ui-design/UI-DESIGN-HUB.md`

## Step 4.60: Spoke README Domain Reconciliation (MANDATORY) ⭐ NEW

> **Trigger**: During every `/run-pirr` execution.

Systematically trace modified files in `changes.txt` to their respective systems folder README files under `docs/systems/` to prevent documentation omissions:

1. **Scan `changes.txt`**: Extract modified source directories (e.g., `src/contexts/`, `src/pages/`, `src/components/`, `src/services/`).
2. **Consult Registries**:
   - Check `.agent/context-registry.json` to identify active collections, entity definitions, and context owners.
   - Check `docs/DOCUMENTATION-INDEX.md` to map directories/contexts to system domains (e.g., `src/contexts/UsersContext.jsx` $\rightarrow$ `users` collection $\rightarrow$ `authentication` system domain).
3. **Locate Target Spoke README**: Resolve the path to the system module spoke README (e.g., `docs/systems/authentication/README.md` or `docs/systems/positional-profiles/README.md`).
4. **Assert & Update**:
   - Verify if new hooks, reactive listeners, schema modifications, or patterns are documented in the resolved spoke README.
   - Update the spoke README to reflect these changes before proceeding.
5. **Update Hub Tables**: Keep dates, lines, and content descriptions updated in `docs/ssot/architecture-hub/README.md` and `docs/ssot/dev-workflow-hub/README.md`.

## Step 4.75: Debugging Session Value Extraction ⭐ NEW

> **Trigger**: After ANY debugging session that took >30 minutes or involved non-obvious root cause

Ask these questions to extract maximum value:

### 4.75.1 Approaches Used

```yaml
□ What debugging METHODS did I use? (even if they didn't find the root cause)
  - Console logging patterns?
  - Direct data queries (Admin SDK, Firestore console)?
  - Payload inspection before writes?
  - Security rules audit commands?

□ For EACH method:
  - Is it documented in DEBUGGING_HANDBOOK? → If NO, add it
  - Is there a reusable script? → If YES, add to testing-hub/scripts/
```

### 4.75.2 Scripts Created

```yaml
□ Did I create any debug/test scripts during this session?
  - Move to: docs/ssot/testing-hub/scripts/
  - Create README.md if folder is new
  - Update DEBUGGING_HANDBOOK to reference them
```

### 4.75.3 Patterns Discovered

```yaml
□ Did I discover a new anti-pattern or failure mode?
- Add Case Study to DEBUGGING_HANDBOOK
- Add prevention checklist
- Update Quick Reference table if high-frequency issue

□ Did I find a new guardrail or checklist item?
- Update PRE_CHANGE_CHECKLIST.md
- Create workflow if applicable (.agent/workflows/)
```

### 4.75.4 Cross-Repo Portability

```yaml
□ Would this insight help in PI_Ops or other repos?
- Port relevant workflows/patterns
- Adapt to repo-specific conventions
```

### Step 4.80: Post-Incident Governance ⭐ NEW

> **Trigger**: If this session involved a production incident, systemic defect, or a new "always do X" rule.

Run the [Post-Incident Governance Workflow](.agent/workflows/post-incident-governance.md) to:
1.  Classify the invariant (§2.5 Gate)
2.  Update ADRs (Step 5)
3.  Promote Incident Reports (Step 6)
4.  Sync across PKS (Step 7)

---

## Step 5: Append to Log

If changes were SSOT-worthy, append to [PIRR_RECONCILIATION_LOG.md](../../docs/PIRR_RECONCILIATION_LOG.md):

```markdown
## YYYY-MM-DD | [Category]

**Trigger**: [What prompted this]
**Change**: [What was changed]
**Docs Updated**: [List of docs]
```

## Step 6: Organize Documentation into Hubs

Check if any new documentation files were created in `docs/` root that should be moved to SSOT hubs:

### Hub Classification Rules

| If file relates to...                              | Move to...                    |
| -------------------------------------------------- | ----------------------------- |
| Testing, scenarios, validation, debugging          | `docs/ssot/testing-hub/`      |
| Database schema, data flow, contexts, architecture | `docs/ssot/architecture-hub/` |
| Development workflows, components, patterns, pages | `docs/ssot/dev-workflow-hub/` |
| UI design, themes, tokens, responsive              | `docs/ssot/ui-design/`        |

### Check for Orphaned Docs

```powershell
# List docs in root that might need organization
Get-ChildItem -Path "docs" -Filter "*.md" -Depth 0 | Select-Object Name
```

### After Moving Files

1. Update links in `GEMINI.md` to point to new location
2. Update any cross-references in hub README.md files
3. Log the move in PIRR_RECONCILIATION_LOG.md

## Step 7: Regenerate CSS-to-Component Map

Update the CSS mapping index to reflect any new imports:

```powershell
npm run generate:css-map
```

This ensures the CSS-Component mapping stays current after every session.

---

## Quick Version (Copy-Paste)

```
Run PIRR. My changes are in the git diff. Update any SSOT docs that need it, organize any new docs into proper hubs, regenerate the CSS map, and append to the PIRR log.

If this session involved >30 min debugging, also run Step 4.75 to extract value (approaches, scripts, patterns).
```
