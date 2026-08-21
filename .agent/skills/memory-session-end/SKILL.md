---
name: memory-session-end
description: >
  Synchronizes memory files at session end or PIRR completion. Updates plans.md
  with current status, flushes pending entries, updates JSON timestamps.
---

# Memory Session End Skill

## 📌 Purpose

Synchronize all memory files before ending a session to:

1. Capture final task status in `plans.md`
2. Ensure all file reads were logged
3. Update JSON file timestamps
4. Prevent knowledge loss between sessions

---

## 🎯 Trigger

**When**: Any of the following events:

| Event                        | Priority                        |
| ---------------------------- | ------------------------------- |
| **PIRR Completion**          | After PIRR passes successfully  |
| **Session Handoff**          | Before user signals session end |
| **Context Window Reset**     | Before conversation ends        |
| **notify_user with handoff** | When returning control to user  |

---

## 📋 Synchronization Procedure

### Step 1: Update Plans Status

If working on a task, update `memory/plans.md`:

```markdown
# Plan: [Current Task] (YYYY-MM-DD)

- [x] Completed items
- [/] In-progress items
- [ ] Pending items
- Status: [Updated Status]
- Last Updated: [Current Timestamp]
```

### Step 1.5: Ingest `task_plan.md` (planning-with-files Integration)

If `task_plan.md` exists in the project root (created by `planning-with-files` skill):

1. **Read** `task_plan.md` to extract:
   - Task goal/title
   - Current phase status
   - Completed phases
   - Remaining phases

2. **Append summary** to `memory/plans.md`:

   ```markdown
   ## Active Micro-Plan: [Task Title] (YYYY-MM-DD)

   - **Source**: `task_plan.md` (planning-with-files)
   - **Phases**: X of Y complete
   - **Current Phase**: [Name] — [Status]
   - **Linked Files**: findings.md, progress.md
   - Last Synced: [Current Timestamp]
   ```

3. **If task complete**: Move `task_plan.md` content to "Completed Plans" section and archive/delete the file.

4. **If in-progress**: Keep the live link reference in `memory/plans.md`.

> **Note**: This prevents "Split Brain" between root-level planning files and `.agent\memory\` files.

### Step 2: ~~Verify File Reads Logged~~ (RETIRED 2026-06-10)

`file_reads.md` is retired — write-only log with no downstream reader. Do not append file reads. Skip to Step 2.5.

### Step 2.5: Verify Enhancement Record (Protocol #6)

If significant work was done (new feature/refactor):

- **Check**: Was an enhancement ID generated (PIO-XXX)?
- **If NO**: Stop. Run `enhancement-scaffolder` skill immediately.
- **If YES**: Verify `00_ENHANCEMENT_INDEX.md` is updated.
- **Why**: Prevents "Ghost Features" (code without governance record).

### Step 3: Append Session Summary

Add session summary to `decisions.md` if significant work was done:

```markdown
- [YYYY-MM-DD HH:MM] **Session End**: Brief summary of what was accomplished.
  - **Files Modified**: [list]
  - **Plans Updated**: [list]
  - **Next Session**: What to pick up
```

### Step 3.5: Audit Verification Status

For each plan item marked `[x]` this session:

1. **Check**: Is it logged in `memory/verifications.md`?
   - **If NO**: Prompt user for tier classification
   - **If YES**: Continue

2. **Classification Prompt**:

   ```
   Task: [Task Name] was marked complete.
   How was it verified?
   - T1: Automated test passed
   - T2: Manual verification done
   - T3: User confirmed "looks good"
   - T4: Not verified (adds to debt)
   ```

3. **If T4**: Update `memory/verification_debt.json`

4. **Update Stats**: Increment tier counts in JSON

### Step 4: Update JSON Timestamps

Update `_lastUpdated` in:

- `memory/file_meta.json`
- `memory/dependencies.json`

```json
{
  "_lastUpdated": "YYYY-MM-DDTHH:MM:SS+05:30"
}
```

### Step 5: Move Completed Plans

If any plans are complete, move them to `## Completed Plans` section:

```markdown
## Completed Plans

# Plan: [Title] (YYYY-MM-DD)

- [x] All tasks
- Status: ✅ COMPLETED
- Completed: [Date]
```

---

## 📊 Output Format

After synchronization, produce confirmation:

```markdown
## ✅ Memory Synchronized

- **Plans Updated**: Yes/No (N items)
- **File Reads Verified**: Yes (N logged)
- **Verification Audit**: Yes (N items classified)
  - T1: X, T2: X, T3: X, T4 (Debt): X
- **Session Summary Added**: Yes/No
- **JSON Timestamps Updated**: Yes
- **Ready for session end.**
```

---

## ❌ Anti-Patterns

| Anti-Pattern              | Why It's Wrong                        |
| ------------------------- | ------------------------------------- |
| Skipping memory sync      | Causes knowledge loss                 |
| Not updating plan status  | Next session won't know current state |
| Leaving stale timestamps  | Confuses future sessions              |
| Verbose session summaries | Keep under 50 words                   |

---

## 🔗 Integration Points

### AOS Integration

- **Phase C3**: This skill is invoked after Lessons Learned extraction.
- **Trigger**: After PIRR passes, before final handoff.

### Protocol Reference

- **Protocol #38**: Memory System Maintenance (enforces this skill).

### Related Skills

- `memory-session-loader`: Loads memory at session start
- `memory-file-logger`: Logs file reads during session
- `memory-decision-logger`: Logs decisions during session
- `memory-verification-logger`: Logs verification events with T1-T4 tiers
- `planning-with-files`: Micro-task planning subsystem (v2.11.0+)

---

## ✅ Validation Checklist

After running this skill, verify:

1. [ ] `plans.md` has current task status
2. [ ] All significant file reads are logged
3. [ ] All completed tasks have verification tier in `verifications.md`
4. [ ] `verification_debt.json` updated with stats
5. [ ] Session summary added (if applicable)
6. [ ] JSON timestamps updated
7. [ ] No orphan data in working memory

---

## 📋 Quick Sync Template

For rapid session end, use this template:

```markdown
## Session Sync [YYYY-MM-DD HH:MM]

### Files Read

- [list from session]

### Decisions Made

- [list from session]

### Task Status

- Current: [task name]
- Progress: [%]
- Next: [what to pick up]
```
