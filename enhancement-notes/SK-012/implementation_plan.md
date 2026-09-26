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

---

## Task 3.1: `scripts/verify-pipeline-contracts.cjs` — Design Review Before Build

Per the user's explicit request ("check the design first"), the ticket's one-line Phase 3 description was checked against real code before writing anything, and corrected twice:

1. **Base64/localStorage check**: grepped both controllers — found ~30 legitimate `localStorage.setItem` calls (selections, approvals, view mode, survey answers). A naive "any localStorage write" check would have flagged all of them. Narrowed to the actual INC-099 mechanism: a literal `data:image/...;base64,` prefix, or a variable assigned from `.toDataURL(` reaching `localStorage.setItem`.
2. **Shell/fragment "dependency parity"**: read `index.html`, `shopping-fragment.html`, `cockpit-fragment.html` — confirmed fragments intentionally omit `firestore-client.js`/`auth.js` because `index.html` (the SPA parent) already loads them globally. The ticket's literal wording ("fragments must load the same modules as shells") would have failed on correct, working code. Redefined: check whether a **standalone shell** loads `firestore-client.js` when its controller calls a `window`-attached function from it (extracted via the `Object.assign(window, {...})` block in `firestore-client.js`).

Confirmed via targeted greps before writing code: `shopping_src/controller.js` calls `window.fsSetShoppingItemStatus` etc. and `shopping-registry.html` already includes `firestore-client.js` (passes); `cockpit_src/controller.js` calls no `window.fsX` function at all, so `decorator-cockpit.html` correctly has no dependency to check.

**Files:**
- Create: `scripts/verify-pipeline-contracts.cjs`
- Test: manual positive/negative injection (no existing test harness for this script class; matches the pattern used by sibling `verify:*` scripts, none of which have dedicated unit test files)

**Step 1–2 (failing check)**: `scripts/verify-pipeline-contracts.cjs` did not exist — trivially "failing" (nothing to run).

**Step 3 (implementation)**: see `scripts/verify-pipeline-contracts.cjs` for full source. Two independent checks, both narrowly scoped per the design correction above.

**Step 4 (passing check + real verification, not self-certification)**:
- Clean pass on current codebase: `node scripts/verify-pipeline-contracts.cjs` → exit 0.
- **Positive test**: appended a synthetic `localStorage.setItem('sk_synth_test', 'data:image/png;base64,...')` to `shopping_src/scripts/controller.js` (backed up first) → initial run did **not** catch it (bug: `[^;]*?` excluded the semicolon inside `data:image/png;base64,` itself, truncating the capture before the closing `)`) → fixed to `[\s\S]*?` → re-ran → caught at the correct line, exit 1 → restored from backup, re-confirmed clean.
- **Positive test 2**: stripped the `firestore-client.js` `<script>` tag from `shopping-registry.html` (backed up first) → initial run did **not** catch it (bug: bare-substring test matched an unrelated code comment mentioning "firestore-client.js") → fixed to require an actual `<script ... src="...firestore-client.js">` tag → re-ran → caught, exit 1 → restored from backup, re-confirmed clean.

**🔍 Validation Gate (VG)**:
1. (Binary) `node scripts/verify-pipeline-contracts.cjs` on unmodified codebase → exit 0.
2. (Binary) Both synthetic-violation tests → exit 1, each isolating exactly the injected defect, and file state restored byte-identical afterward (`git diff --stat` empty).

**🚦 Decision Node (DN)**: Pass — both gates hold. (No Fail path exercised; both bugs found during testing were fixed within this task before the gate was called done, not deferred.)

**Step 5 (commit)**: `af0e5f7`

## Task 3.2: Wire `package.json`, `.agent/PREFLIGHT.md`, `verify-governance-wiring.cjs`

**Files:**
- Modify: `package.json` (add `"verify:pipeline-contracts"` script entry)
- Modify: `.agent/PREFLIGHT.md` (add row R6)
- Modify: `scripts/verify-governance-wiring.cjs` (add `checkProseInvariants()`, folded into existing report/exit-code plumbing — no parallel checker)

**Step 3–4**: implemented, then verified with the same positive/negative discipline as Task 3.1 — initial run of the new prose-invariant check reported all 3 invariants missing even though Phases 1–2 had already inserted them (bug: `isReferenced()` expects pre-lowercased content per the existing `loadConsumptionFiles()` convention, but `readFile()` returns raw case, so `.includes(id.toLowerCase())` never matched an uppercase ID) → fixed with `.toLowerCase()` on the read content → re-ran → all 3 wired, exit 0. Negative test: redacted `INV-COUNCIL-GROUND-TRUTH-001` from `architecture-council.md` via `sed`, ran the check (caught it, exit 1, isolated exactly that ID), restored via `git checkout --` (file was already committed, so exact restore).

**🔍 Validation Gate (VG)**:
1. (Binary) `npm run verify:governance-wiring:all` → 198/198 artifacts wired, exit 0.
2. (Binary) Negative test on one invariant → exit 1, isolated correctly; restored cleanly (`git status --porcelain` empty for that file after restore).

**Step 5 (commit)**: `d029fb8`

## Phase 3 Completion Gate

- [x] Task 3.1 VG passed (clean pass + 2 positive tests, 2 bugs found and fixed during verification, not after)
- [x] Task 3.2 VG passed (clean pass + negative test, 1 bug found and fixed during verification)
- [x] `enhancement-notes/SK-012/00_ENHANCEMENT_INDEX.md` Phase 3 checkboxes updated to `[x]`, ticket status → `COMPLETED`
- [x] `ENHANCEMENT-MASTER-REGISTRY.md` SK-012 row → `COMPLETED`

---

## Phase 4: Re-Scoped Interception Layer

Re-opened after checking this repo's own `.claude/settings.local.json` and finding a real, already-proven `PostToolUse` hook mechanism (`impeccable`) — the exact condition `AC-DEC-2026-056` named as the re-open trigger. Scope corrected: only the two artifact-checkable pieces were built; `INV-SYSTEMIC-ABSTRACTION-001` (reasoning verification) has no observable artifact and was explicitly not attempted.

### Task 4.1: Structural checks (`checkPlanHeaderContracts`, `checkCouncilDecisionGate`)

**Files:** Modify `scripts/verify-pipeline-contracts.cjs`.

**Design corrections made before writing code** (not after): scoping the plan-header check to the plan's HEADER section only (not whole-body — avoids flagging SK-012's own plan, which discusses photo/upload context without being an intake plan); scoping both checks to new/changed files by default via `git status`, not the full historical corpus (avoids retroactively flagging `SK-011`'s pre-existing plan and `AC-DEC-2026-035` itself, which predate the rule).

**Step 4 (real verification)**:
- Ran `--all` mode first: correctly found `SK-011`'s real historical gap plus a not-yet-seen `SK-018` (a concurrent session's ticket) — confirms the heuristic works on genuine data, not just synthetic fixtures.
- **Bug caught by testing**: a synthetic new ticket folder (`enhancement-notes/SK-999-synthtest/`) was invisible to default (new-file) mode — git collapses a wholly-new untracked directory to one `?? path/` entry with no filename, so a plain filename regex against git-status lines never matches. Fixed by expanding collapsed directory entries against the known filename on disk (not `git status -uall`, which this environment's guidance says to avoid on large repos).
- Re-tested after the fix: synthetic missing-fields plan → caught in default mode; synthetic fields-present plan → not flagged; real `SK-018` → caught in default mode too (not just `--all`).

**Step 5 (commit)**: `7e8cca5`

### Task 4.2: Export `findLocalStorageBase64Violations` for hook reuse

**Files:** Modify `scripts/verify-pipeline-contracts.cjs` — guard `process.exit(run())` behind `require.main === module`, add `module.exports`.

**Step 4**: confirmed both paths work — `node scripts/verify-pipeline-contracts.cjs` (CLI) unchanged; `require('./scripts/verify-pipeline-contracts.cjs').findLocalStorageBase64Violations` returns a function.

**Step 5 (commit)**: `ce99184`

### Task 4.3: `PostToolUse` hook (`scripts/hook-pipeline-contracts-check.cjs`)

Built via the `update-config` skill's verification procedure, not freehand `settings.local.json` edits. Key facts learned before writing anything: hook stdin is `{tool_name, tool_input: {file_path}, ...}`; `decision:"block"` + `reason` in the hook's JSON stdout is the documented way to surface a finding back into the same turn for `PostToolUse`; permission-rule path syntax `Edit(**/*.js)` in the hook's own `if` field scopes it past markdown/other edits (covers Write/Edit/NotebookEdit per the schema, not just the literal "Edit" tool).

**Step 3 (pipe-test)**:
- First attempt used a `/tmp/...` path in the synthesized stdin JSON — silently produced no output. Root cause: this machine's `node` is native Windows node.exe, and a path embedded inside a JSON string (not a bash argument) never gets MSYS-translated, so `fs.readFileSync('/tmp/...')` failed and the hook's fail-open `catch` swallowed it silently. Re-tested with a repo-relative path → worked correctly, confirming the hook logic itself was fine and the first failure was a test-environment artifact, not a hook bug.
- Positive case (real `data:image/...;base64,` literal) → `decision:"block"` JSON with correct file/line/snippet.
- Negative case (a `localStorage.setItem` call identical in shape to the ~30 legitimate ones already in both controllers) → silent exit 0.

**Step 4 (JSON validation)**: no `jq` on this machine — validated with `node -e` instead (parses the file, locates the new hook block, confirms structure). Functionally equivalent for this environment.

**Step 5 (merge)**: added as a second matcher block in `.claude/settings.local.json`'s `PostToolUse` array, alongside (not replacing) the existing `impeccable` block.

**Step 6 (prove it fires — honest result, not a passed claim)**: prefixed the command with a sentinel `echo ... >> /tmp/claude-hook-check.txt`, triggered a real `Write` on a scratch `.js` file, checked the sentinel — **not found**. Per the `update-config` skill's own documented explanation for exactly this outcome: pipe-test passed and structure validated, so the settings watcher for `.claude/` likely isn't watching this file for changes made mid-session (it watches directories that had a settings file present when the session started) — reload requires the user to open `/hooks` once, or restart, neither of which this session can trigger itself. Cleaned up the sentinel prefix and scratch file regardless of the outcome, per the skill's mandatory cleanup step.

**Step 7 (commit)**: `2567259` (hook script + ticket only — `.claude/settings.local.json` is gitignored via a personal global excludesfile, matching how the pre-existing `impeccable` hook in that same file already works).

## Phase 4 Completion Gate

- [x] Task 4.1 VG passed (real positive/negative tests, one real bug caught and fixed)
- [x] Task 4.2 VG passed (both CLI and require() paths confirmed)
- [x] Task 4.3 pipe-tested and JSON-validated; live end-to-end firing **not yet confirmed** — needs a `/hooks` reload or restart from the user, explicitly flagged rather than assumed
- [x] `enhancement-notes/SK-012/00_ENHANCEMENT_INDEX.md` Phase 4 checkboxes updated, ticket status → COMPLETED (code)

## Ticket Status

**SK-012 is code-complete for all four phases.** `INV-SYSTEMIC-ABSTRACTION-001` (reasoning verification, not just artifact verification) remains explicitly out of scope — no known mechanism exists for it in this repo or the surveyed 2026 literature, and it is not silently dropped: it stays open with no forced trigger, revisited only if an actual reasoning-observation mechanism appears. One manual step (a `/hooks` reload) is needed to activate Phase 4c's hook in a running session.
