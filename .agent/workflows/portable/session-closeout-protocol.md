---
pattern: session-closeout-protocol
origin_cap: PIOps-Forensic
tier: universal
applies_to:
  - "Session closure"
  - "AI-to-AI handoffs"
  - "Task verification"
prereqs:
  - "Session Handoff (SHO) system"
porting_effort: low
canonical_source: GEMINI.md
last_reviewed: 2026-04-21
description: "Verification tiers and forensic artifact auditing."
---

# Portable Workflow: Forensic Session Audit (FSA)

**Purpose:** Ensure 100% context preservation and eliminate "Verification Debt" during session handoffs.

---

## 1. Verification Tiers (Protocol #60)

**Constraint:** Every completed task must be classified by its verification confidence level.

| Tier | Evidence | Status |
|------|----------|--------|
| **T1** | Automated test passed | ✅ Verified |
| **T2** | Manual verification done | ✅ Verified |
| **T3** | User confirmed via UI | 🟡 Low-Confidence |
| **T4** | **Not verified** | 🔴 **DEBT** |

**Pattern:**
- Add a `Verification Status` section to the handoff.
- List all T4 tasks as **immediate priority** for the next session.

---

## 2. The Forensic Artifact Audit

**Constraint:** No cherry-picking. You must account for the *entire* session's output.

1. **Inventory Sweep**: Run `list_dir` on the conversation brain directory. List ALL artifacts found (plans, snapshots, metadata).
2. **Identify "Patient Zero"**: Locate the exact request or document that initiated the thread.
3. **Reconstruct by Intent**: Group work into "Chapters" (Trigger → Execution → Pivots). Explain *why* things changed, not just *what* changed.

---

## 3. Implementation Guardrail

**Rule:** A session is not "Closed" until the handoff document includes:
- A complete artifact inventory.
- Verification tier classification for all work.
- Consolidated "Pending Tasks" from all chapters.
