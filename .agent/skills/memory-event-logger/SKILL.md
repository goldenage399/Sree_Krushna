---
name: memory-event-logger
description: >
  Logs structured SDLC events to .agent/memory/event_stream.md. 
  Captures Context Switches, Test Creation, Gaps, and Verifications.
---

# Memory Event Logger Skill

## 📌 Purpose
Capture the "Flight Data" of the SDLC process—not just *state* (files/decisions), but *flow* (jumps, creations, resolutions).

## 🎯 Output Target
`.agent/memory/event_stream.md`

## 📋 API / Event Types

### 1. Context Switch `[SWITCH]`
**When**: Agent switches focus between enhancements.
**Format**:
```markdown
- [YYYY-MM-DD HH:MM] **[SWITCH]** Context: `PIO-OLD` (Title) → `PIO-NEW` (Title)
```

### 2. Test Lifecycle `[TEST]`
**When**: Agent creates or significantly updates a test file.
**Format**:
```markdown
- [YYYY-MM-DD HH:MM] **[TEST]** Created `backend/src/TEST_New.js` (Unit)
```

### 3. Gap Tracking `[GAP]`
**When**: A gap is identified or resolved.
**Format**:
```markdown
- [YYYY-MM-DD HH:MM] **[GAP]** Identified: "Missing validation logic in X"
- [YYYY-MM-DD HH:MM] **[GAP]** Resolved: "Implemented validation check"
```

### 4. Verification `[VERIFY]`
**When**: A task is verified (T1-T4).
**Format**:
```markdown
- [YYYY-MM-DD HH:MM] **[VERIFY]** `PIO-XXX` Task 1 — **T1** (Automated Pass)
```

---

## 🔧 Logging Procedure

1. **Read** `.agent/memory/event_stream.md` (last 5 lines to avoid dupes).
2. **Format** the new entry with current timestamp.
3. **Append** to the file.

---

## ❌ Anti-Patterns
- Logging every file edit (use `memory-file-logger` for that)
- Logging internal thought process (use `memory-decision-logger` for that)
- Logging verbose diffs

## ✅ Validation
- [ ] Entry appears in `event_stream.md`
- [ ] Timestamp is correct
- [ ] Tag matches `[TAG]` format
