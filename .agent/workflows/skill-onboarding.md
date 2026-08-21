---
description: Onboard external skills into the project's skill ecosystem
---

# /skill-onboarding Workflow

## When to Use

- Installing skills from external repos (e.g., `npx skills add`)
- Creating new custom skills
- Integrating third-party skills with existing project infrastructure

## Pre-Flight Check

Before onboarding, answer:

1. **Does this skill overlap with existing skills?** Check `.agent/skills/` first
2. **Does this skill reference other skills?** If yes, those must exist first
3. **Is there a workflow that should invoke this skill?**

---

## Phase 1: Installation & Location

### Step 0: Find the Skill (Optional)

If you don't know the exact package name:

- **Use the skill:** "Use `find-skills` to look for X"
- **Use the CLI:** `npx skills find "query"`

### Step 1: Install the Skill

```powershell
npx skills add <repo-url> --skill <skill-name>
```

### Step 2: Verify Installation Location

**Expected:** `.agent/skills/<skill-name>/SKILL.md`

**Common Issue:** Some installers use `.agents/skills/` (with 's')

**Fix if wrong location:**

```powershell
# Copy to correct location
robocopy ".agents\skills\<skill-name>" ".agent\skills\<skill-name>" /E

# Remove old location
Remove-Item -Path ".agents" -Recurse -Force
```

---

## Phase 2: Integration Check

### Step 3: Read the Skill

```
view_file .agent/skills/<skill-name>/SKILL.md
```

**Check for:**

- [ ] Does it reference other skills? (e.g., `superpowers:executing-plans`)
- [ ] Do those skills exist in `.agent/skills/`?
- [ ] Is the output path appropriate for this project?

### Step 3.5: Source Verification Gate (mandatory for ported skills)

> If the skill was ported from another repo (PIO, Capsicum, external), every concrete claim
> must be verified against **this** repo's live source before the skill participates in any
> review. See `.agent/patterns/skill-source-verification-gate.md` for the full checklist.

**Minimum checks before trusting a ported skill:**
- [ ] CSS variable / token names exist in `src/styles/tokens/` or `src/styles/tailwind-semantic-bridge.css`
- [ ] Every `docs/` path referenced exists in this repo's actual tree
- [ ] Any config file named (tailwind, vite, etc.) is confirmed as the one the tool actually loads
- [ ] "Known facts" about components (memo, prop forwarding, defaults) verified at live source lines

### Step 4: Adapt Output Paths (if needed)

Update the skill's default output location to match project conventions:

| Skill Type | Output Path                                   |
| ---------- | --------------------------------------------- |
| Plans      | `enhancement-notes/PIO-XXX/` or `docs/plans/` |
| Tests      | `backend/src/99_TestScripts_*.js`             |
| Docs       | `docs/` or module SSOT folders                |

---

## Phase 3: Activation Wiring

### Step 5: Create Invocation Workflow (Optional but Recommended)

Create `.agent/workflows/<skill-name>.md`:

```markdown
---
description: <when to use this skill>
---

# /<skill-name> Workflow

## Steps

1. Check prerequisites
2. Read `.agent/skills/<skill-name>/SKILL.md`
3. Follow skill instructions
4. Offer execution handoff
```

### Step 6: Add GEMINI.md Auto-Activation Entry

**Context-Based Triggers table:**

```markdown
| **<When to use>** | [<skill-name>.md](.agent/workflows/<skill-name>.md) ← **<Why>** |
```

**Skills Auto-Activation table (appropriate phase):**

```markdown
| **<Trigger action>** | `<skill-name>` | <Why> |
```

---

## Phase 3.5: Quality Standards (for New/Edited Skills)

> Adapted from `writing-skills` skill — TDD for documentation.

### SKILL.md Structure

```yaml
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions]. No workflow summary.
---
```

**Key Rules:**

- **Description = When to Use, NOT What It Does**. Summarizing workflow in description causes agents to skip reading the skill.
- **Max 1024 chars** in frontmatter
- Start description with "Use when..."

### The Iron Law

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

Before deploying a new skill:

1. Run a pressure scenario WITHOUT the skill → document baseline behavior
2. Write skill addressing those specific failures
3. Re-run scenario WITH skill → verify compliance

### Checklist Before Committing Skill

- [ ] Description starts with "Use when..." (no workflow summary)
- [ ] Core pattern shown with before/after
- [ ] Common mistakes section included
- [ ] Tested with at least one scenario

---

## Phase 4: Verification

### Step 7: Test Invocation

1. Say "use /<skill-name>" or describe the trigger action
2. Verify skill is read and followed
3. Verify output goes to correct location

### Step 8: Document in Skills List

Verify the skill appears in the ephemeral skills list shown at conversation start.

---

## Checklist Summary

- [ ] Skill in `.agent/skills/` (not `.agents/`)
- [ ] Referenced skills exist
- [ ] Output paths adapted to project conventions
- [ ] Invocation workflow created (if needed)
- [ ] GEMINI.md auto-activation entries added
- [ ] **Quality** — Description starts with "Use when..." (no workflow summary)
- [ ] **Quality** — Tested with at least one scenario
- [ ] Tested invocation works
