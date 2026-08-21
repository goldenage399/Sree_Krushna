---
name: pin-branch
version: "1.0.0"
description: >
  Pins a cognitive branch during a long-running session by appending a structured
  entry to SESSION_BRANCH_STATE.md. Low-friction — takes <30 seconds, no folder
  creation, no ID generation. Use when you notice a new investigation that you
  cannot address immediately and cannot afford to lose.
user-invocable: true
triggers:
  - "pin this"
  - "pin branch"
  - "park this"
  - "come back to this"
  - "/pin-branch"
layer: session-orchestration
protocol: .agent/workflows/SESSION-ORCHESTRATION.md
---

# Skill: pin-branch

> Append a structured branch entry to `.agent/session/SESSION_BRANCH_STATE.md`.
> If the file doesn't exist, create it from the template first.

---

## When to Use

Use when ALL of the following are true:
1. A new investigation or sub-goal has emerged mid-session
2. You cannot address it right now (you're in the middle of something else)
3. You cannot afford to lose the context (origin, parent, resume condition)

**Do NOT use for**:
- Minor observations you'll handle in the next 2-3 tool calls
- Work that can be immediately completed inline
- Things already tracked in `ENHANCEMENTS.md`

---

## Invocation

```
/pin-branch
  title: "Short human-readable branch name"
  parent: "parent-branch-id or ROOT" (optional, defaults to ROOT)
```

Optional fields (can be filled during triage if skipped now):
```
  origin: "What triggered this — user request, discovery, observation"
  resume: "What must be true before re-entering this branch"
  blocked_by: "other-branch-id"
```

---

## Execution Steps

### Step 1 — Check for state file

Check if `.agent/session/SESSION_BRANCH_STATE.md` exists.

- **If NO**: Create it using the schema from `.agent/workflows/SESSION-ORCHESTRATION.md` §4
- **If YES**: Open and append to it

### Step 2 — Generate branch ID

Derive a kebab-case ID from the title.  
Example: "Session Orchestration Layer design" → `session-orchestration-design`

### Step 3 — Append the entry

Append this block to the `## Branches` section:

```markdown
## [branch-id]

| Field | Value |
|---|---|
| title | [title from invocation] |
| state | ACTIVE |
| parent | [parent from invocation] |
| origin | [origin from invocation] |
| timestamp | [current ISO-8601 datetime] |
| owner | [current agent/session identifier] |
| resume_condition | [resume from invocation] |
| blocked_by | [blocked_by if provided, else empty] |
```

### Step 4 — Confirm to user

Report:
```
Branch pinned: [branch-id]
State: ACTIVE
Parent: [parent]
Resume condition: [resume]
SESSION_BRANCH_STATE.md updated.
```

Then **immediately return to the interrupted work** without further ceremony.

---

## Branch State on Creation

New branches are always created with state `ACTIVE` unless `blocked_by` is provided, in which case the state is `BLOCKED`.

To change a branch state later, edit `SESSION_BRANCH_STATE.md` directly.

---

## What Happens at Session Close

At `aos-session-close` Step 5.0.5, all branches are triaged via the three-route checklist:
- RESOLVED → ABANDONED (no action)
- PARKED → SHO entry (structured pending investigation)
- PARKED (large scope) → Enhancement Protocol (TASK-XXX)

After triage, `SESSION_BRANCH_STATE.md` is deleted.

---

## Anti-Patterns

| Don't | Do instead |
|---|---|
| Pin every thought | Only pin what you can't lose |
| Leave SESSION_BRANCH_STATE.md at session close | Always triage and delete |
| Use as replacement for Enhancement Protocol | Use as pre-triage staging area |
| Create the same branch twice | Check existing entries first |
