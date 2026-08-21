# AGP-002 Quick Checklist ⚡

**Purpose:** Rapid compliance validation for debugging investigations
**Time:** 60 seconds total
**Use:** Before, during, and after debugging sessions

---

## 🚀 **30-Second Pre-Check**

```yaml
□ Valid trigger? (data mismatch | small results | cross-page issue)
□ Level determined? (L1: local | L2: cross-layer | L3: cross-module | L4: repo-wide)
□ Using direct tools? (Read/Grep/Glob/Bash, NOT subagents)
□ Token estimate? (<2K: auto | 2-5K: approval | >5K: alternatives)

✅ All checked → Proceed with investigation
❌ Any failed → Reconsider approach
```

---

## 🔍 **20-Second Mid-Check**

```yaml
□ Layers systematic? (UI → Context → Service → Rules → Schema → Cache)
□ User claims verified? (ACVP-001: check code, cite evidence, NEVER parrot)
□ Fallbacks tested? (alternate queries | missing fields | rules | admin SDK)
□ Limits monitored? (files <20 | depth <3 | tokens <5K)

✅ All checked → Investigation on track
⚠️ Any concerns → Show status, request guidance
```

---

## ✅ **10-Second Post-Check**

```yaml
□ Root cause table? (Layer | File | Symptom | Cause | Evidence)
□ Hypotheses eliminated? (show ❌ rejected, ✅ confirmed)
□ Patch formatted? (file:line | before/after | rationale)
□ Approval gate? (explicit options | wait for "Apply" | no auto-apply)

✅ All checked → Ready for user approval
❌ Any missing → Complete output requirements
```

---

## 🚨 **Critical Violations (Stop Immediately)**

```yaml
❌ Echoed user claim without verification → Apply ACVP-001
❌ Modified code without approval → Request explicit "Apply the patch"
❌ Exceeded 5K tokens without alternatives → Show cache options
❌ Launched subagent during investigation → Use direct tools only
❌ >20 files without justification → HALT and show options
```

---

## 📋 **One-Line Reminders**

**ACVP-001:** User says "X must be Y" → Verify from code, cite file:line, NEVER echo
**Escalation:** Local → Cross-layer → Cross-module → Repo-wide (with approvals)
**Token Budget:** <2K auto | 2-5K approval | >5K alternatives
**Safety Limits:** 20 files | 3 layers | 5K tokens
**Approval:** "Apply the patch" = proceed | "Looks good" = clarify | "Wait" = stop

---

## 🎯 **Quick Decision Tree**

```
Data mismatch detected?
  ├─ Single page? → Level 2 (cross-layer, <2K tokens)
  ├─ Multiple pages? → Level 3 (cross-module, show declaration)
  └─ System-wide? → Level 4 (offer cache alternatives)

User states architectural fact?
  ├─ Check firestore.rules, schemas, validation services
  ├─ Cite: "✅ Confirmed from file:line"
  └─ OR: "⚠️ Cannot verify, proceeding on your guidance"

Investigation exceeds 2K tokens?
  ├─ Show: 🔍 Investigation declaration + token estimate
  ├─ Request: "Proceed? (Y/n)"
  └─ If >5K: Offer cache alternatives first

Investigation complete?
  ├─ Present: Root cause table + hypotheses + patch
  ├─ Wait: Explicit approval ("Apply Option 1")
  └─ Never: Auto-apply or assume "looks good" = approval
```

---

**Full Details:** [AGP-002-ENFORCEMENT-CHECKLIST.md](./AGP-002-ENFORCEMENT-CHECKLIST.md)
**Protocol:** [AGP-002-AUTONOMOUS-DEBUGGING-PROTOCOL.md](./AGP-002-AUTONOMOUS-DEBUGGING-PROTOCOL.md)
