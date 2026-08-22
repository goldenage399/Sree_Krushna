---
name: memory-verification-logger
description: >
  Logs verification events with tier classification (T1-T4).
  Tracks "hard proof" vs "blind trust" and surfaces verification debt.
  Use when: test runs, user confirmations, or plan completion.
---

## Goal

Ensure all completed work has an explicit verification record. Prevent "skipped tests" from becoming invisible technical debt.

---

## Triggers

| Event | Action |
|-------|--------|
| After `run_command` with test keywords | Log T1/T2 based on output |
| User sends confirmation ("works", "good") | Log T3 |
| Plan item marked complete without test | Prompt for tier, log T4 if skipped |
| Session end (via `memory-session-end`) | Audit for missing verifications |

---

## Tier Classification

| Tier | Definition | Evidence Required |
|------|------------|-------------------|
| **T1** | Automated Proof | Test command output showing PASS |
| **T2** | Manual Proof | Command ran, expected behavior observed |
| **T3** | User Confirmation | User message: "It works", "Looks good" |
| **T4** | Skipped | No verification performed → **DEBT** |

---

## Logging Procedure

### Step 1: Detect Verification Event

Check if any of these occurred:
- Test command executed (`npm test`, `TEST_*`, `verify`, `check`)
- User sent confirmation message
- Plan item being marked `[x]`

### Step 2: Classify Tier

```
Did a test command run?
├─ YES → Was output captured?
│        ├─ YES, shows PASS → T1
│        └─ YES, manual inspection → T2
└─ NO → Did user confirm?
         ├─ YES → T3
         └─ NO → T4 (DEBT) ⚠️
```

### Step 3: Append to `verifications.md`

**Format:**
```markdown
- [x] **{PIO-XXX / Task}**: {Description} — **T{N}** ({Type})
  - Evidence: {Command output / User quote / "None"}
  - Verified: {YYYY-MM-DD HH:MM}
  - Verified By: {Agent | User | Skipped}
```

### Step 4: Log to Event Stream (SDLC Flight Recorder)

**Action**: Append to `.agent/memory/event_stream.md` via `memory-event-logger`.

**Format**:
```markdown
- [YYYY-MM-DD HH:MM] **[VERIFY]** `PIO-XXX` Task: {Description} — **T{N}**
```

### Step 5: Update `verification_debt.json` (if T4)

```json
{
  "id": "PIO-XXX-TaskName",
  "task": "Task Description",
  "tier": "T4",
  "reason": "User moved to next task",
  "added": "YYYY-MM-DD",
  "blocked_until_verified": false
}
```

---

## Cross-Session Enforcement

### At Session Start (`memory-session-loader`)

```
1. Load verification_debt.json
2. If debt_items.length > 0:
   - Surface warning: "⚠️ {N} items have unverified status"
   - List items with their reasons
```

### At Session End (`memory-session-end`)

```
1. For each plan item marked [x] today:
   - Check if logged in verifications.md
   - If NOT: Prompt user → Log as T3/T4
2. Update verification_debt.json stats
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|------|
| Mark plan complete without logging | Always log verification tier |
| Assume "user moved on" = verified | Log as T4 with reason |
| Ignore T4 debt across sessions | Surface at session start |
| Log vague evidence ("tested it") | Log specific command/output |

---

## Example Entries

### T1 (Automated)
```markdown
- [x] **PIO-060**: Contract Validation — **T1** (Automated)
  - Evidence: `TEST_Contract_Accounts()` returned "Status: PASS, 0 violations"
  - Verified: 2026-01-17 23:00
  - Verified By: Agent
```

### T3 (User Confirmation)
```markdown
- [x] **PIO-055**: Entry List UI — **T3** (User Confirmation)
  - Evidence: User: "The list looks correct now"
  - Verified: 2026-01-15 20:00
  - Verified By: User
```

### T4 (Debt)
```markdown
- [ ] **PIO-071**: DAR Speedup — **T4** (Skipped)
  - Evidence: None (User moved to React migration)
  - Added: 2026-01-28
  - Verified By: Skipped
```

---

## Integration Points

| Skill | Integration |
|-------|-------------|
| `memory-session-loader` | Load debt at start, surface warnings |
| `memory-session-end` | Audit for missing verifications |
| `pirr-compliance-checklist` | Category 15: Verification Debt Check |
