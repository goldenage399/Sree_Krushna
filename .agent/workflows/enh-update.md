---
description: Update enhancement tracker with current progress (DoD, phases, next steps)
---

# Enhancement Tracker Update Workflow

**Purpose**: Lock in current enhancement progress to the index file SSOT.

**When to use**:
- After completing a significant phase
- Before session handoff or context window reset
- After PIRR passes
- When discovery is made that changes scope
- When you want to checkpoint your work

---

## Step 1: Identify Enhancement Context

Ask user: "Which enhancement are you updating?" (e.g., PIO-XXX)

If user doesn't know current PIO, check:
1. Last entry in `.agent/memory/event_stream.md` (SWITCH events)
2. Open files matching `enhancement-notes/PIO-*/`
3. ACTIVE enhancements in `ENHANCEMENTS.md`

---

## Step 2: Load Enhancement Index

Pattern: `enhancement-notes/PIO-XXX-*/00_ENHANCEMENT_INDEX.md` OR `enhancement-notes/PIO-XXX_*.md`

If file doesn't exist → Alert user that enhancement may not be properly scaffolded.

---

## Step 3: Run enhancement-tracker-update Skill

Invoke the `enhancement-tracker-update` skill with the following checklist:

### 3.1. Context Switch Check
- Read `.agent/memory/event_stream.md` (last SWITCH entry)
- If context changed, log event via `memory-event-logger`

### 3.2. Update Metadata
```markdown
- **Status**: 🚨 ACTIVE / ⏳ PENDING / ✅ COMPLETED
- **Last Updated**: [Current Date & Time IST]
- **Current Phase**: [e.g., Phase 3 (Implementation)]
```

### 3.3. DoD Progress Check (MANDATORY)
1. Read the DoD table
2. Count completed criteria: `X/Y`
3. Calculate percentage: `(X/Y) * 100%`
4. Update metadata:
   ```markdown
   > **DoD Completion**: 3/5 criteria verified (60%)
   > **Last DoD Update**: [Current Date & Time IST]
   ```

**Completion Gate**:
- IF marking COMPLETED AND DoD < 100%:
  - **BLOCK** transition
  - **PROMPT** user: "DoD incomplete (X/Y). Complete remaining OR request deferral?"
  - IF deferral approved → Create "Deferred DoD Items" section

**Evidence Validation**:
- FOR EACH `[x]` criterion → CHECK evidence field is NOT empty/TBD
- IF empty → Flag as verification debt

### 3.4. Update Phase Checklist
Mark completed items `[x]`, in-progress `[/]`, pending `[ ]`

### 3.5. Document Discoveries
If new gaps/requirements/blockers found:
```markdown
## 🔍 Session Discoveries (YYYY-MM-DD)

- **Gap Found**: [description]
- **Decision**: [what was decided]
- **Blocker**: [None or description]
```

### 3.6. Update Dependencies
- Add new dependencies discovered
- Remove resolved dependencies
- Note blocking relationships

### 3.7. Capture Next Steps
```markdown
## ➡️ Next Steps

1. [Specific actionable item]
2. [Another item]
```

### 3.8. Cross-Reference Files
```markdown
## 📂 Files Modified This Session

| File | Change | Status |
|------|--------|--------|
| `Module.js` | Added function X | ✅ |
```

---

## Step 4: Validation

After update, verify:
- [ ] Index file `Last Updated` is current
- [ ] All completed work marked `[x]`
- [ ] **DoD Completion % accurate**
- [ ] **If COMPLETED, DoD = 100% OR deferred items documented**
- [ ] **Evidence fields NOT empty for `[x]` criteria**
- [ ] Discoveries section exists (if applicable)
- [ ] Next Steps section populated
- [ ] `ENHANCEMENTS.md` summary synced
- [ ] No orphan handoff files created

---

## Step 5: Confirmation Report

Provide user with:
```markdown
## ✅ Tracker Updated: PIO-XXX

- **Index File**: [file link]
- **Status**: [status]
- **Last Updated**: [timestamp]
- **Phases Completed**: [list]
- **Current Phase**: [phase]
- **DoD Completion**: X/Y (Z%)
- **Discoveries Added**: Yes/No
- **Next Steps Documented**: Yes (N items)
```

---

## Anti-Patterns to Avoid

❌ Creating new handoff file instead of updating index  
❌ Only updating `ENHANCEMENTS.md` (summary) not the index (SSOT)  
❌ Marking phases complete without sub-task detail  
❌ Not updating DoD progress  
❌ Evidence fields empty for completed criteria
