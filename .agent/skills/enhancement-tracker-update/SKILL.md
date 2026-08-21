---
name: enhancement-tracker-update
description: >
  Update the enhancement tracker (SSOT) with current progress at session end,
  phase completion, or before handoff. Ensures seamless resumption for future work.
  Invoked automatically after PIRR passes or before context window reset.
---

# Enhancement Tracker Update Skill

## 📌 Purpose

Formalize the process of "updating the tracker with current progress" to ensure:

1. The enhancement index file is always the **Single Source of Truth (SSOT)**.
2. All work is captured: completed, pending, gaps, dependencies, next steps.
3. Future sessions can resume seamlessly without re-discovery.

---

## 🎯 Event-Driven Triggers

This skill is activated by specific events, not vague "end of session" timing.

### Automatic Triggers (Mandatory)

| Event                | When                                           | Action                                    |
| -------------------- | ---------------------------------------------- | ----------------------------------------- |
| **PIRR Passes**      | After code merge completes successfully        | Run 7-point checklist                     |
| **Phase Completion** | After marking phase `[x]` in `task.md`         | Update index file metadata + phase status |
| **Session Handoff**  | Before context window reset / user signals end | Full tracker update with Next Steps       |
| **Discovery Found**  | When new requirement/blocker is discovered     | Add to Discoveries section immediately    |

### Manual Triggers (Optional)

| Scenario                    | When to Use                              |
| --------------------------- | ---------------------------------------- |
| **Mid-Session Checkpoint**  | After completing 25%+ of a phase         |
| **External Review Request** | Before sending docs for external review  |
| **Dependency Unblocked**    | When a blocking enhancement is completed |

---

## 📋 The 7-Point Tracker Update Checklist

### 0. Check for Context Switch (SDLC Flight Recorder)

**Before updating**, check if the enhancement context has changed.

1. **Read** `.agent/memory/event_stream.md` (last SWITCH entry).
2. **If** `Current_PIO` != `Last_Logged_PIO`:
   - **Log Event**: `[SWITCH] Context: {Old_PIO} → {New_PIO} (Title)`
   - Use `memory-event-logger` skill.

### 1. Identify the Enhancement Index File

- **Pattern**: `enhancement-notes/PIO-XXX-*/00_ENHANCEMENT_INDEX.md` OR `enhancement-notes/ENHANCEMENT_PIO-XXX_*.md`
- **Rule**: One file per enhancement. This is the SSOT.
- **If missing**: Create it following `ENHANCEMENT_PROTOCOL.md`.

### 1.1. MANDATORY TRACKER CHECK (Protocol 45)

**Constraint**: You **MUST** update the specific tracker file found in Step 1 **BEFORE** touching `ENHANCEMENTS.md`.

- **Check**: Does `enhancement-notes/PIO-XXX-*.md` exist?
- **Action**: Open it and update the checklist/status based on your session progress.
- **Anti-Pattern**: Updating `ENHANCEMENTS.md` without opening the detailed tracker.

### 2. Update Metadata Section

Ensure the following fields are current:

```markdown
- **Status**: 🚨 ACTIVE / ⏳ PENDING / ✅ COMPLETED
- **Last Updated**: [Current Date & Time IST]
- **Current Phase**: [e.g., Phase 3 (Implementation)]
```

### 2.5. DoD Progress Check (MANDATORY)

**For ALL Active Enhancements**:

1. **Read** the **Definition of Done** table in the index file.
2. **Count** completed criteria: `X/Y criteria verified`
3. **Calculate** completion percentage: `(X/Y) * 100%`
4. **Update** metadata with DoD progress:

```markdown
> **DoD Completion**: 3/5 criteria verified (60%)
> **Last DoD Update**: [Current Date & Time IST]
```

**Completion Gate Enforcement**:

- **IF** status is being changed to **COMPLETED**:
  - **CHECK**: Is DoD Completion = 100%?
  - **IF NO**:
    - **BLOCK** transition to COMPLETED
    - **PROMPT** user: "DoD is incomplete (X/Y). Options:
      1. Complete remaining criteria and retry
      2. Request deferral approval (requires written justification)"
  - **IF deferral approved**:
    - Create **"Deferred DoD Items"** section:
      ```markdown
      ## 🔴 Deferred DoD Items
      
      > **User Approval**: [Date] - [Name/Reason]
      
      | # | Criterion           | Reason for Deferral              | Mitigation                |
      |---|----------------------|----------------------------------|---------------------------|
      | 4 | **Integration Tests** | External system not available   | Follow-up PIO-XXX created |
      ```
    - Document follow-up PIO ID or mitigation plan
  - **ELSE**: Keep status as ACTIVE until DoD = 100%

**Evidence Validation**:

- **FOR EACH** criterion marked `[x]`:
  - **CHECK**: Evidence field is NOT empty or "TBD"
  - **IF empty**: Flag in "Session Discoveries" as verification debt

### 3. Update Phase Checklist

For each phase:

- Mark completed items with `[x]`
- Mark in-progress items with `[/]`
- Mark pending items with `[ ]`

**Example**:

```markdown
### Phase 3: Implementation 🟡 IN PROGRESS

- [x] Create backend API
- [/] Wire frontend to API
- [ ] Add unit tests
```

### 4. Document Discoveries (Addendum)

If new information was discovered during the session:

- Add a **Discoveries** or **Session Notes** section.
- Include: gaps found, new requirements, blockers, decisions made.

**Example**:

```markdown
## 🔍 Session Discoveries (2026-01-22)

- **Gap Found**: Vendor Settlements drill-down API is missing.
- **Decision**: Reuse Ledger module's `getVendorSettlements()` API.
- **Blocker**: None.
```

### 5. Update Dependencies Section

If dependencies changed:

- Add new dependencies discovered.
- Remove resolved dependencies.
- Note any blocking relationships.

### 6. Capture Next Steps

At the end of the index file (or in a dedicated section):

```markdown
## ➡️ Next Steps

1. Implement Vendor Settlements drill-down API
2. Add refresh button for Step 3
3. Browser verification of all drill-downs
```

### 7. Cross-Reference Related Files

If implementation files were created/modified, list them:

```markdown
## 📂 Files Modified This Session

| File                         | Change               | Status |
| ---------------------------- | -------------------- | ------ |
| `AccountsMultiStepWizard.js` | Added reopenPeriod() | ✅     |
| `VarianceCalculator.js`      | Created new module   | ✅     |
```

---

## ✅ Output: Tracker Update Report

After running this skill, produce a brief confirmation:

```markdown
## ✅ Tracker Updated: PIO-XXX

- **Index File**: `enhancement-notes/PIO-XXX-Title/00_ENHANCEMENT_INDEX.md`
- **Status**: 🚨 ACTIVE - Phase X
- **Last Updated**: YYYY-MM-DD HH:MM IST
- **Phases Completed**: [list]
- **Current Phase**: [current phase description]
- **Discoveries Added**: Yes/No
- **Next Steps Documented**: Yes (N items)
```

---

## ❌ Anti-Patterns

| Anti-Pattern                                              | Why It's Wrong                           |
| --------------------------------------------------------- | ---------------------------------------- |
| Creating a new handoff file instead of updating the index | Fragments SSOT; creates orphan docs      |
| Only updating `ENHANCEMENTS.md` (global registry)         | Registry is a summary; index is the SSOT |
| Marking phases complete without sub-task detail           | Loses granularity; hinders resumption    |
| Not updating `Last Updated` timestamp                     | Stale timestamps cause confusion         |
| Running without checking index file exists                | Creates orphan updates                   |

---

## 🔗 Integration Points

## 🔗 Integration Points

### SDLC Flight Recorder (Phase 4)

- **Event**: `[SWITCH]`
- **Target**: `.agent/memory/event_stream.md`
- **Skill**: `memory-event-logger`

### AOS Integration

- **Phase C (Verification/PIRR)**: This skill is invoked after PIRR passes.
- **Session End**: Invoked as final step before user handoff.

### GEMINI Protocol #31

This skill enforces Protocol #31 (Enhancement Tracker Synchronization).

### Related Skills

- `pirr-compliance-checklist`: Run before this skill to ensure code is ready.
- `enhancement-scaffolder`: Use when creating a new enhancement.
- `ssot-domain-mapper`: Use when identifying docs to update.

---

## 🧪 Validation Checklist

After running this skill, verify:

1. [ ] Index file `Last Updated` is current date/time.
2. [ ] All completed work is marked `[x]`.
3. [ ] **DoD Completion % is accurate and up-to-date.**
4. [ ] **If marking COMPLETED, DoD = 100% OR deferred items documented.**
5. [ ] **Evidence fields are NOT empty for criteria marked `[x]`.**
6. [ ] Discoveries section exists if new info was found.
7. [ ] Next Steps section has actionable items.
8. [ ] `ENHANCEMENTS.md` (global) summary matches index status.
9. [ ] No orphan handoff files created.

---

## 📊 State Machine Invariants

This skill helps enforce the Enhancement State Machine:

```
Valid transitions: PENDING → ACTIVE → COMPLETED (only)
                   PENDING → REJECTED (only if explicitly noted)

Invariant violations (flag immediately):
  - ACTIVE without "Last Updated" > 7 days
  - ACTIVE without "Current Phase" defined
  - COMPLETED without "Completed" date
  - Phase marked [x] without sub-task checklist
```

If invariant violated → Add to Discoveries section with flag.
