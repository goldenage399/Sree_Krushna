# SK-012 Phase 1 Implementation Plan: Prompt Clarity & Planning Engine Codification

> **Governing Ticket**: `enhancement-notes/SK-012/00_ENHANCEMENT_INDEX.md`
> **Governing Decision**: `AC-DEC-2026-056` (see `User_Created/Discussion Threads/Council/260926_arch_council_institutional_governance_safeguards_hardening.md`)
> **Target Release**: v2.6.0
> **Goal**: Insert `INV-SYSTEMIC-ABSTRACTION-001` (prompt-clarity symptom-vs-systemic sensor) and `INV-DATA-TRANSIT-001` (physical storage/transit contract) as textual invariants at their council-approved anchor points, with mirror-parity and governance-wiring proof that the insertion actually landed.
> **Architecture**: Both invariants are single-bullet/single-line additions to existing, already-load-bearing sections (`meta-prompt.md` Step 1 ambiguity scan; `writing-plans/SKILL.md` §4 Plan Document Header). No new files, no new subsystems. `meta-prompt.md` is dual-mirrored (`.claude/` canonical, `.agent/` mirror) per its own `SYNC-MIRROR` contract — both copies must change in this same phase.
> **Tech Stack / Toolchain**: Markdown edits + `diff` (mirror parity) + existing `node scripts/verify-governance-wiring.cjs` (repo-native Node/CJS, zero new dependencies).

---

## Sequential Phased Definition of Done (DoD v1.7 Standard) — Full Ticket View

| Phase | Name | Status | Detail |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Prompt Clarity & Planning Engine Codification | **Detailed below** | This document |
| Phase 2 | Architecture Council Protocol Hardening | Scoped in `00_ENHANCEMENT_INDEX.md`, not detailed yet (per Scoping Boundary rule — do not pre-detail before Phase 1 passes) | — |
| Phase 3 | Automated Pipeline Contract Gate + PREFLIGHT routing + governance-wiring extension | Scoped, not detailed | — |
| Phase 4 | Behavioral automation | **Recommended Soon** — not scheduled, no tasks | — |

Per `writing-plans/SKILL.md` §3 (Scoping Boundary), only Phase 1 is decomposed into 5-step TDD tasks below.

---

## Task 1.1: Insert `INV-SYSTEMIC-ABSTRACTION-001` into Prompt Clarity Step 1

**Files:**
- Modify: `.claude/skills/prompt-clarity/meta-prompt.md:31-52` (canonical)
- Modify: `.agent/skills/prompt-clarity/meta-prompt.md` (mirror — same section, verify identical line range before editing; canonical must be edited first, mirror second, same commit)
- Test: none (Markdown content check — see Validation Gate)

**Step 1: Write failing check**
```bash
grep -n "INV-SYSTEMIC-ABSTRACTION-001" ".claude/skills/prompt-clarity/meta-prompt.md"
```
Expected: no output (exit code 1 — grep found nothing).

**Step 2: Run check to verify it fails**
Run the command above.
**🔍 Validation Gate (VG)**: (Binary) exit code is `1`.
**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 3.
- **Fail (1st)**: If exit code `0`, the invariant already exists — read the existing match before writing a duplicate; stop this task and report.
- **Fail (2nd)**: N/A (this is a pre-condition check, not a retryable build step).

**Step 3: Write minimal insertion**
Insert as a new 5th bullet in the Step 1 ambiguity-scan list (after "Goal vs. means confusion", before "**Do not flag**"):
```markdown
- **Instance vs. systemic invariant (`INV-SYSTEMIC-ABSTRACTION-001`)** — a single-entity bug report (a missing item, a price discrepancy, a broken preview) is treated as a symptom, not the scope. Before proposing a single-entity patch, ask: "is this a single data error, or a signal that an entire capability (storage, sync, intake) is unbacked?" If the answer isn't clearly "single data error," escalate to a systemic-pipeline audit before patching. (Origin: `INC-099`.)
```
Apply identically to both the canonical file and the `.agent/` mirror.

**Step 4: Run check to verify it passes**
```bash
grep -n "INV-SYSTEMIC-ABSTRACTION-001" ".claude/skills/prompt-clarity/meta-prompt.md" ".agent/skills/prompt-clarity/meta-prompt.md"
diff -rq .claude/skills/prompt-clarity .agent/skills/prompt-clarity
```
Expected: both `grep` lines match (exit `0`); `diff -rq` prints nothing (exit `0`).

**🔍 Validation Gate (VG)**:
1. (Binary) Both `grep` invocations exit `0` with one match each.
2. (Binary) `diff -rq` exits `0` with empty stdout.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 5.
- **Fail (1st)**: If `diff` reports a mismatch, re-copy the exact bullet text into whichever file is missing it, re-run.
- **Fail (2nd)**: Halt. Surface to user: "Mirror parity failed twice on `prompt-clarity/meta-prompt.md` — manual reconciliation needed."

**Step 5: Atomic Commit**
```bash
git add ".claude/skills/prompt-clarity/meta-prompt.md" ".agent/skills/prompt-clarity/meta-prompt.md"
git commit -m "feat(governance): add INV-SYSTEMIC-ABSTRACTION-001 to prompt-clarity Step 1 (SK-012 Phase 1, AC-DEC-2026-056)"
```

---

## Task 1.2: Insert `INV-DATA-TRANSIT-001` into `writing-plans/SKILL.md`

**Files:**
- Modify: `.agent/skills/writing-plans/SKILL.md:57-80` (repo-specific block, `<!-- repo-specific:sree-krushna:start -->` section only — do NOT touch the `<!-- shared:std.agent.planning-engine.core -->` block above it)
- Test: none (Markdown content check — see Validation Gate)

**Step 1: Write failing check**
```bash
grep -n "INV-DATA-TRANSIT-001" ".agent/skills/writing-plans/SKILL.md"
```
Expected: no output (exit code 1).

**Step 2: Run check to verify it fails**
Run the command above.
**🔍 Validation Gate (VG)**: (Binary) exit code is `1`.
**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 3.
- **Fail (1st)**: If exit `0`, invariant already present — stop, report, do not duplicate.

**Step 3: Write minimal insertion**
Add as a new numbered item under "Repository Extensions (Sree Krushna Marriage OS)" (after item 1 "Dynamic ID Prefix", renumbering subsequent items):
```markdown
### 2. Physical Storage & Transit Contract (`INV-DATA-TRANSIT-001`)
Every plan touching multi-device user intake (photo upload, file attach, any client-submitted media) MUST declare, in its plan header:
- **Storage Target**: the physical, durable store (Cloud Storage bucket, Firestore document field, Google Drive folder) — never "TBD".
- **Multi-Device Transit**: how a second device/session retrieves the same data.
- **Client-Storage Prohibition**: any plan storing raw binary or Base64 media in `localStorage` as its terminal (non-cache) store is disqualified and must be revised before proceeding to Phase 1 tasks. (Origin: `INC-099`.)
```
(Existing items 2–4 — SDCA Toolchain, Shared UI Primitives, Pre-Flight Governance — shift to 3–5.)

**Step 4: Run check to verify it passes**
```bash
grep -n "INV-DATA-TRANSIT-001" ".agent/skills/writing-plans/SKILL.md"
```
Expected: one match, exit `0`.

**🔍 Validation Gate (VG)**:
1. (Binary) `grep` exits `0` with exactly one match.
2. (Binary) `npm run verify:governance-wiring` exits `0` (confirms the edit didn't break existing PACT-001 wiring checks).

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 5.
- **Fail (1st)**: If `verify:governance-wiring` fails, read its output, fix the specific reported line, re-run.
- **Fail (2nd)**: Halt. Surface to user: "`verify:governance-wiring` failed twice after the `writing-plans/SKILL.md` edit — output: [paste]."

**Step 5: Atomic Commit**
```bash
git add ".agent/skills/writing-plans/SKILL.md"
git commit -m "feat(governance): add INV-DATA-TRANSIT-001 to writing-plans Repository Extensions (SK-012 Phase 1, AC-DEC-2026-056)"
```

---

## Phase 1 Completion Gate

- [x] Task 1.1 VG passed (mirror parity + presence grep) — commit `b44506c`
- [x] Task 1.2 VG passed (presence grep + `verify:governance-wiring` green) — commit `9cf1a3a`
- [x] `enhancement-notes/SK-012/00_ENHANCEMENT_INDEX.md` Phase 1 checkboxes updated to `[x]` — commit `5bba713`
- [x] No Phase 2/3 file touched in this phase (Scope Segregation, confirmed in `AC-DEC-2026-056` §5)

---

## Task 2.1: Insert `INV-COUNCIL-GROUND-TRUTH-001` Blocking Rule into `architecture-council.md`

**Files:**
- Modify: `.agent/workflows/architecture-council.md` — new subsection inserted at L221–230, immediately after `<!-- shared:std.governance.council-deliberation-protocol:end -->` (L220) and before the pre-existing "Task-Dashboard-specific elaboration of Phase 0 and Phase 3" (L222, now L232)

**Design note (resolved, not deferred)**: the plan originally said "insert into the repo-specific block below L224" — but that block is titled *Task-Dashboard*-specific, carried over un-localized by a prior `/sap-sync`. Inserting a Sree-Krushna rule there would misattribute it. Resolution: added a new, correctly-labeled **"Sree-Krushna-specific elaboration of Phase 2"** subsection instead, positioned right after the shared skeleton closes so it reads as this repo's own Phase 2 elaboration, not Task-Dashboard's Phase 0/3 one. The Task-Dashboard section itself is untouched — its localization is still a separate, deferred follow-up (see `AC-DEC-2026-056` §7).

**Step 1–2 (failing check)**: `grep -n "INV-COUNCIL-GROUND-TRUTH-001" ".agent/workflows/architecture-council.md"` → exit `1` (confirmed before edit).

**Step 3 (insertion)**: blocking rule requiring Phase 2 Synthesis to output `BLOCKED (PENDING_PIPELINE)` or `APPROVED WITH SCOPE CUT` — never an unconditional approval — whenever a proposal's data-transit path is recorded as unbacked, mocked, or an open gap. Full text: see `.agent/workflows/architecture-council.md` L222–230.

**Step 4 (passing check)**:
```
grep -n "INV-COUNCIL-GROUND-TRUTH-001" ".agent/workflows/architecture-council.md"  → 1 match, exit 0
npm run verify:governance-wiring                                                   → exit 0
```

**Step 5 (commit)**: `7eb3968`

## Phase 2 Completion Gate

- [x] Task 2.1 VG passed (presence grep + `verify:governance-wiring` green) — commit `7eb3968`
- [x] `docs/incidents/INC-099-*.md` already authored during the `AC-DEC-2026-056` council session
- [x] `enhancement-notes/SK-012/00_ENHANCEMENT_INDEX.md` Phase 2 checkboxes updated to `[x]`
- [x] No Phase 3 file touched (`scripts/verify-pipeline-contracts.cjs`, `.agent/PREFLIGHT.md`, `package.json` all untouched)
- [ ] Follow-up ticket for `architecture-council.md` roster/high-risk-surfaces localization — still not opened, still deferred

## Execution Handoff

Per `writing-plans/SKILL.md` §7: recommend **Sequential Session** execution continues into Phase 3 (`scripts/verify-pipeline-contracts.cjs`, `.agent/PREFLIGHT.md` R6, `verify-governance-wiring.cjs` extension) — 3 small, independently-testable tasks, same atomic-commit-per-task pattern as Phases 1–2.

**This plan is saved to disk. Per the Mandatory Plan Hard-Stop, Phase 3 code is not written until you give the go-ahead.**
