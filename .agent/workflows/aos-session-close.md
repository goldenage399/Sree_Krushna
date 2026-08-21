---
description: Unified session closeout workflow - Risk-Driven Conditional Model (PIRR, Memory Sync, Forensic Audit)
rrm001_profile: post-implementation
---

# AOS Session Close Workflow

> **Purpose**: Single canonical workflow for closing work sessions. Combines PIRR (C1), Memory Sync (C3), and Forensic Session Audit (FSA). Operates as a **risk-driven conditional model** — three steps always run; all others are gated on explicit triggers.

---

## When to Use

- ✅ End of any significant work session
- ✅ Before context window reset
- ✅ Before handing off to another agent/session
- ✅ When user requests `/aos-session-close`

---

## Conditional Routing Model

Three steps are **always required**. All others are gated on explicit triggers to avoid overhead for simple sessions.

| Step | Status | Trigger Condition |
|------|--------|-------------------|
| **Ghost File Scan** | 🟢 **UNCONDITIONAL** | Always run — the only gate that catches orphaned session files |
| **Step 3.5: Phased Commit** | 🟢 **UNCONDITIONAL** | Always commit before closing |
| **Step 4: Memory Sync + Tier Classification** | 🟢 **UNCONDITIONAL** | Always flush decisions, plans, reads, and assign T1-T4 |
| **Step 2: PIRR** | 🟡 **CONDITIONAL** | Only if code changes occurred (`git diff` non-empty) |
| **Step 2.5: Retirement Evaluation** | 🟡 **CONDITIONAL** | Only if component has ≥3 PIRR incident entries OR file >600 lines post-refactor |
| **Step 3.3: SAP Skill Parity** | 🟡 **CONDITIONAL** | Only if `.agent/skills/` was modified this session |
| **Step 3.4: SAP Workflow Propagation** | 🟡 **CONDITIONAL** | Only if SAP-tracked workflow files were modified |
| **Post-Incident Governance** | 🟡 **CONDITIONAL** | Only if a new systemic bug pattern was discovered (≥30 min to diagnose, non-obvious) |
| **Step 5.0.5: Branch Triage + FSA** | 🟡 **CONDITIONAL** | Only if `SESSION_BRANCH_STATE.md` exists OR session was complex |

> [!IMPORTANT]
> **Ordering constraint**: `SESSION_GOVERNANCE_STATE.json` serialization must execute **before** branch triage and FSA handoff generation (Step 5.0.5). Governance state is always serialized first.

---

## Automation Targets

The following mechanical checks produce high cognitive overhead for minimal agent benefit. They are designated as **pre-commit hook or CI automation targets** rather than inline cognitive steps. Document their location here but do not block session close on manual execution:

| Check | Automation Target | Current Status |
|-------|-------------------|----------------|
| UTF-8 encoding scan | Pre-commit hook | Pending setup |
| `npm run sg:scan` (AST invariant lint) | Pre-commit hook | `npm run sg:check` exit-codes for CI |
| `npm run verify:sg-languages` (sg-rule language↔extension integrity) | Pre-commit hook / CI | Active — fails if any rule declares a `language:` that parses none of `src/`'s extensions (prevents silently-inert rules, e.g. `language: tsx` on a `.jsx` repo). Origin: Query 1.4 Enforcement Integrity Audit, 2026-06-21 |
| `npm run scan:fkl-lifecycle` (FKL header retirement/staleness scan) | CI / Gate 8 (FKL Harvest) | Active — fails on Superseded/Retired headers with no `superseded_by`, ghost `content_ref`s, or invalid `promotion_status`. The retirement trigger for FKL knowledge. Origin: Query 1.7 Discoverability Audit Phase 6, 2026-06-21 |
| `verify-hub-integrity.ps1` | CI runner (post-push) | Pending setup |
| AST lint (`npm run sg:scan`) | Pre-commit hook | Active |

> [!NOTE]
> When these checks are automated, remove them from the cognitive step checklist below. The goal is zero manual overhead for mechanical validation.

---

## The 5-Step Closeout Protocol

### Step 1: Pre-PIRR Gates (From aos-session.md C0)

> **Duration**: ~5 min

Run the Pre-PIRR gates from `aos-session.md`:

1. **Gate 1**: Discovery Questionnaire (2 min)
2. **Gate 2**: Impact Assessment (2 min)
3. **Gate 3**: Contract Verification (if data touched)
   - See `.agent/patterns/mock-first-boundary-contract-lock.md` for guidelines on locking schemas during mock phases.
4. **Gate 4**: Documentation Verification (if data touched)
5. **Gate 5**: SSOT Conflict Detection (if docs created/modified)
   - [ ] Are there multiple docs claiming authority on the same topic?
   - [ ] Do any docs contradict each other?
   - [ ] **IF YES**: STOP. Run `/ssot-reconciliation` BEFORE PIRR
   - **Examples**: Two files documenting same API, conflicting schema definitions
6. **Gate 6**: Ghost File Scan 🟢 **UNCONDITIONAL** (2 min)
   - Run: `git status` and look for `??` (untracked) lines.
   - [ ] Are there untracked files **NOT** in `.gitignore`?
   - [ ] **IF YES**: For each untracked file, classify as: (a) **Orphaned work** → stage and commit now, (b) **Intentional temp** → confirm it is in `.gitignore`, (c) **Unknown** → STOP and investigate before closing.
   - > [!CAUTION]
   - > **Ghost Files from prior sessions are invisible to all other PIRR steps.** This is the ONLY gate that catches them. Do not rely on memory or plan files — run the command.
7. **Gate 7**: Post-Incident Triage 🟡 **CONDITIONAL** (1 min)
   - **Trigger**: Only if a new systemic bug pattern was discovered this session (took ≥30 minutes to diagnose, non-obvious root cause).
   - [ ] Did this session resolve a production incident, systemic bug, or establish a new architectural rule?
   - [ ] **IF YES**: STOP. Run `/post-incident-governance` to document the incident and formalize the ADR BEFORE proceeding to PIRR.
   - > [!IMPORTANT]
   - > **Do not rely on PIRR to document incidents.** PIRR enforces rules; Post-Incident Governance creates them.

8. **Gate 8**: FKL Harvest + Promotion Check 🟡 **CONDITIONAL** (2 min)
   - **Trigger**: Any frontend session that produced a non-incident discovery (design rule, reusable fix, process improvement, architectural discovery not covered by Gate 7).
   - [ ] Did this session surface a frontend discovery that was NOT a production incident? (e.g., a layout rule, a reusable fix, a process improvement, a factual architectural learning)
   - [ ] **IF YES**: Run `.agent/workflows/harvest-frontend-knowledge.md` to classify and route the discovery before closing.
   - [ ] **Promotion candidate check** (always run for frontend sessions): Are any Case Studies in `docs/incidents/` currently at ≥2 same-symptom threshold but not yet promoted to Handbook Quick-Reference?
   - [ ] **IF promotion candidate found**: Re-enter `harvest-frontend-knowledge.md` at Phase 4 (registration) with the promoted item — the FKL header stamping, Hub update, and drift check are all Phase 4–6 of that workflow.
   - [ ] **FKL lifecycle scan** (run if any FKL Item Header was added/edited/superseded this session): `npm run scan:fkl-lifecycle` — fails on Superseded/Retired headers missing `superseded_by`, ghost `content_ref`s, or invalid `promotion_status`. This is the retirement trigger; a Superseded header with no replacement is an incomplete retirement.
   - [ ] **Discoverability Self-Check (DISC-001)** — if this session registered any new custom CSS utility class, breakpoint, token, or threshold into docs:
     - SSOT entry names the exact source file implementing it (1-hop SSOT → Source)
     - Source file has a `/* FKL-<ID> SSOT: ... */` back-link comment (Source → SSOT)
     - An agent starting from the FKL Hub can reach both the rule and the implementation in ≤3 clicks, no grep required
     - If any of the above is missing → add it NOW before committing. See `harvest-frontend-knowledge.md § 6.5`.
   - > [!NOTE]
   - > Gate 8 runs after Gate 7. If Gate 7 triggered `/post-incident-governance`, Gate 8 still applies for any non-incident discoveries from the same session. Gates 7 and 8 are not mutually exclusive.

9. **Gate 9**: User-Acceptance Checkpoint 🟢 **UNCONDITIONAL** (2 min)
   - **Trigger**: Any work session that modifies code or styling assets in `src/`.
   - [ ] Did you obtain explicit user manual verification and approval for the visual/functional changes on the local environment?
   - [ ] **IF NO**: STOP. Present your changes to the user and request manual verification. DO NOT proceed to commit, memory sync, or session closeout.
   - > [!IMPORTANT]
   - > **User manual review is the absolute final gate.** Bypassing it or relying solely on automated testing is prohibited.

> [!WARNING]
> **Do NOT skip gates.** If any gate fails, return to EXECUTION mode.

---

### Step 2: Main PIRR Reconciliation (C1) — CONDITIONAL

> 🟡 **Trigger**: Only run if code changes occurred this session. Verify first:
> ```powershell
> git diff --name-only HEAD
> ```
> If the output is empty (no code changes), skip to Step 2.5 check, then Step 3.5.
> Note: MODE 4 drift reconciliation addenda are appended to the same PIRR log entry — do not create a new entry inside MODE 4.

> ⚠️ **Deprecated** — PIRR procedure documented here is superseded.
> Canonical SSOT: `.agent/skills/pirr-compliance-checklist/SKILL.md`
> This section is retained for historical reference only.
 
> **Duration**: ~5 min
 
Run the 20-category PIRR compliance checklist:
 
1. Open `.agent/skills/pirr-compliance-checklist/SKILL.md`
2. Walk through categories 1-20
3. Update all affected SSOT documents
4. Log reconciliation entry

**Critical Checks:**

- [ ] `CORE_FUNCTION_INDEX.md` updated for new functions?
- [ ] `SHEET_SCHEMAS.md` updated for schema changes?
- [ ] **UI / Design System / Theme changes**:
  - Are variables documented in `THEME-SYSTEM.md`?
  - Are decisions logged in `UI-DESIGN-HUB.md`?
  - Did you scan for/eliminate ad-hoc ghost classes?
- [ ] Enhancement tracker updated (`enhancement-tracker-update` skill)?
- [ ] **Hub Sync (Category 15)**:
  - Run `.agent/scripts/verify-hub-integrity.ps1`
  - Classify all docs created/modified this session:
    | Category | Rule | Example |
    |---|---|---|
    | **Core** | MUST be in hub | Schema, API contracts, data flows |
    | **Secondary** | SHOULD be in hub | Guides, troubleshooting |
    | **Excluded** | Document exclusion | Generated code, temp files |
  - [ ] All Core docs added to hub?
  - [ ] Secondary docs checked (included or justified)?
  - [ ] **Exclusions logged in session handoff?**
  - [ ] New Core docs added to `.agent/config/hub-dependencies.yaml`?

---

---

### Step 2.5: Retirement Evaluation Gate — CONDITIONAL

> 🟡 **Trigger**: Run both checks below if this session involved refactoring a component or if PIRR was triggered. Skip if no code changes occurred.

Evaluate whether the target component or file has crossed the retirement threshold. Run **both** checks:

#### Condition A — Repeated Incidents (≥3 PIRR entries)

```powershell
Select-String -Path "docs/PIRR_RECONCILIATION_LOG.md" -Pattern "COMPONENT_NAME" | Measure-Object | Select-Object -ExpandProperty Count
```

- **Threshold**: ≥3 distinct incident log occurrences.
- **If met**: Flag component for retirement immediately. Do not continue refactoring.

#### Condition B — Post-Refactor Bloat (>600 lines)

```powershell
npm run sg:scan
```

- **Threshold**: File length >600 lines after any MODE 5 refactor session completes.
- **If met**: Flag component for retirement. Incremental refactoring is not viable.

#### Escalation

If **EITHER** Condition A or B is met, output the following block and escalate to the user/orchestrator before proceeding:

```
⚠️ RETIREMENT EVALUATION TRIGGERED: [file_basename]
  - Rationale: [Failed Condition A (X incidents) / Failed Condition B (Y lines post-refactor)]
  - Action: Component locked from further iterative refactoring.
  - Escalated to: Orchestrator for deprecation blueprint planning.
```

**Do not perform further execution on the flagged component.** Proceed directly to session close (Steps 3.5 → 4 → 5).

---

### Step 3: Enhancement Record Verification (C1.5)

> **Duration**: ~2 min

If significant work was done:

1. **Check**: Was an enhancement ID generated (PIO-XXX)?
   - **If NO**: STOP. Run `enhancement-scaffolder` skill immediately.
   - **If YES**: Verify `00_ENHANCEMENT_INDEX.md` is updated.

2. Run `enhancement-tracker-update` skill to sync status.

> [!CAUTION]
> **Ghost Feature Prevention**: Never close a session with unrecorded significant work.

---

### Step 3.3: SAP Skill Router Parity Check — CONDITIONAL

> 🟡 **Trigger**: Only run if `.agent/skills/` was modified this session. Check first:
> ```powershell
> git diff --name-only HEAD -- .agent/skills/
> ```
> If no output, skip to Step 3.4.

> **Duration**: ~3 min
> **Reference**: `Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md` §6.1
> **Authority**: SAP `std.agent.skill.*` mandatory block declarations

> [!CAUTION]
> **This step cannot be skipped or deferred without an explicit ADR entry when triggered.** A gap found here means the ecosystem is in a drift state. Do NOT proceed to Step 3.5 until resolved.

#### 3.3.1 — Load Router

Open `Capsicum/.agent/skill-router.yaml`. Locate the following 6 mandatory skills:

| Skill ID | SAP Block ID |
|---|---|
| `caveman` | `std.agent.skill.caveman` |
| `caveman-compress` | `std.agent.skill.caveman-compress` |
| `change-prd-architect` | `std.agent.skill.change-prd-architect` |
| `enhancement-scaffolder` | `std.agent.skill.enhancement-scaffolder` |
| `enhancement-tracker-update` | `std.agent.skill.enhancement-tracker-update` |
| `phased-commit-orchestrator` | `std.agent.skill.phased-commit-orchestrator` |

#### 3.3.2 — Router Registration Check

For each skill above, confirm the `repo[]` array contains **all three**:

```yaml
repo: [capsicum, pio, task-dashboard]
```

- [ ] `caveman` — repo includes capsicum, pio, task-dashboard?
- [ ] `caveman-compress` — repo includes capsicum, pio, task-dashboard?
- [ ] `change-prd-architect` — repo includes capsicum, pio, task-dashboard?
- [ ] `enhancement-scaffolder` — repo includes capsicum, pio, task-dashboard?
- [ ] `enhancement-tracker-update` — repo includes capsicum, pio, task-dashboard?
- [ ] `phased-commit-orchestrator` — repo includes capsicum, pio, task-dashboard?

#### 3.3.3 — Physical Presence Check

For each SAP-linked repo, confirm each skill directory physically exists:

| Skill | Capsicum | PIO | Task-Dashboard |
|---|---|---|---|
| `caveman` | `d:/GitHub_Repo/Capsicum/.agent/skills/caveman/` | `d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/skills/caveman/` | `d:/GitHub_Repo/Task-Dashboard/.agent/skills/caveman/` |
| `caveman-compress` | `d:/GitHub_Repo/Capsicum/.agent/skills/caveman-compress/` | `d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/skills/caveman-compress/` | `d:/GitHub_Repo/Task-Dashboard/.agent/skills/caveman-compress/` |
| `change-prd-architect` | `d:/GitHub_Repo/Capsicum/.agent/skills/change-prd-architect/` | `d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/skills/change-prd-architect/` | `d:/GitHub_Repo/Task-Dashboard/.agent/skills/change-prd-architect/` |
| `enhancement-scaffolder` | `d:/GitHub_Repo/Capsicum/.agent/skills/enhancement-scaffolder/` | `d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/skills/enhancement-scaffolder/` | `d:/GitHub_Repo/Task-Dashboard/.agent/skills/enhancement-scaffolder/` |
| `enhancement-tracker-update` | `d:/GitHub_Repo/Capsicum/.agent/skills/enhancement-tracker-update/` | `d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/skills/enhancement-tracker-update/` | `d:/GitHub_Repo/Task-Dashboard/.agent/skills/enhancement-tracker-update/` |
| `phased-commit-orchestrator` | `d:/GitHub_Repo/Capsicum/.agent/skills/phased-commit-orchestrator/` | `d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/skills/phased-commit-orchestrator/` | `d:/GitHub_Repo/Task-Dashboard/.agent/skills/phased-commit-orchestrator/` |

#### 3.3.4 — Gap Resolution

If **ANY** gap is detected, **HALT immediately** and report using this format:

```
[SKILL-ID] missing from [REPO] — [physical | router | both]
```

**Resolution options (choose one):**

1. **Fix now** — Copy skill directory and/or update `repo[]` in `Capsicum/.agent/skill-router.yaml`, then run `sync-shared-blocks` workflow.
2. **Defer explicitly** — Create an ADR entry in `Capsicum/docs/ADRs/` documenting the accepted gap, affected repo, and resolution timeline. Link it here before proceeding.

#### 3.3.5 — Clearance Log

If all checks pass, post this in the session thread before proceeding to Step 3.5:

```
SAP Skill Parity: VERIFIED — [YYYY-MM-DD HH:MM UTC]
All 6 mandatory skills confirmed in: capsicum ✓ | pio ✓ | task-dashboard ✓
```

---

### Step 3.4: SAP Workflow File Propagation — CONDITIONAL

> 🟡 **Trigger**: Only run if SAP-tracked workflow files were modified this session (see §3.4.1 `git diff` check below).

> **Duration**: ~3 min
> **Authority**: `Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md` §6 (Tracked Shared Blocks table)

> [!IMPORTANT]
> Step 3.3 checks **skill** parity. This step checks **workflow file** parity. They are separate concerns. Both must be evaluated (run trigger check, skip if not triggered) before proceeding to commit.

#### 3.4.1 — Detect Modified SAP-Tracked Workflow Files

Run the following to see which workflow files changed this session:

```powershell
git diff --name-only HEAD~1 HEAD -- .agent/workflows/
```

Cross-reference the output against the SAP §6 table. Identify which rows have a `Status` of `✓ synced` and map to a file you modified.

**SAP-Tracked Workflow Files (as of 2026-05-14):**

| SAP Block ID | File(s) | Target Repos |
|---|---|---|
| `std.knowledge-graph.session-protocol` | `.agent/workflows/aos-session-open.md` | capsicum, pio |
| `std.governance.post-incident` | `.agent/workflows/post-incident-governance.md` | capsicum, pio |
| `std.governance.session-orchestration` | `.agent/workflows/SESSION-ORCHESTRATION.md` + `.agent/workflows/aos-session-close.md` | capsicum, pio |
| `std.governance.pirr-checklist` | `.agent/skills/pirr-compliance-checklist/SKILL.md` | capsicum, pio |

#### 3.4.2 — Propagate Each Modified File

For each SAP-tracked workflow file that was modified this session:

```powershell
# Propagate to Capsicum
Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\<filename>" `
          "d:\GitHub_Repo\Capsicum\.agent\workflows\<filename>" -Force

# Propagate to PIO
Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\<filename>" `
          "d:\GitHub_Repo\PIOperationsMgmt_Firebase\.agent\workflows\<filename>" -Force
```

Then commit in each target repo:

```powershell
git -C "d:\GitHub_Repo\Capsicum" add ".agent/workflows/<filename>"
git -C "d:\GitHub_Repo\Capsicum" commit -m "governance(sap-sync): propagate <filename> from Task-Dashboard

SAP block: <block-id>"

git -C "d:\GitHub_Repo\PIOperationsMgmt_Firebase" add ".agent/workflows/<filename>"
git -C "d:\GitHub_Repo\PIOperationsMgmt_Firebase" commit -m "governance(sap-sync): propagate <filename> from Task-Dashboard

SAP block: <block-id>"
```

#### 3.4.3 — Update SAP Sync Log

Add a row to `Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md` §7 Reconciliation Log:

```markdown
| YYYY-MM-DD | `<block-id>` | <description of change> | Task-Dashboard | Capsicum, PIO | ✅ SYNCED |
```

Then commit that file in Capsicum:

```powershell
git -C "d:\GitHub_Repo\Capsicum" add "docs/SHARED_ALIGNMENT_PROTOCOL.md"
git -C "d:\GitHub_Repo\Capsicum" commit -m "docs(sap): log <block-id> sync entry"
```

#### 3.4.4 — Skip Condition

If **no** SAP-tracked workflow file was modified this session, post:

```
SAP Workflow Parity: SKIPPED — no tracked workflow files modified this session.
```

And proceed directly to Step 3.5.

> [!CAUTION]
> **Do NOT skip this step speculatively.** Always run the `git diff` in 3.4.1 to confirm. Assuming nothing changed is the failure mode this step was designed to prevent.

---

### Step 3.4.5: Catalog Currency Check ⛔ NON-OPTIONAL

> **Duration**: ~2 min
> **Reference**: `.agent/standards-catalog.json` (local) |
> `Capsicum/.agent/pks-catalog.json` (canonical library)

#### 3.4.5.1 — PKS Promotion Scan

Run from the project root:

powershell
node -e "
const data = require('./.agent/standards-catalog.json');
const candidates = data.standards.filter(
  s => s.canonicalId === null && s.incidents && s.incidents.length > 0
);
if (candidates.length) {
  console.log('PKS CANDIDATES:');
  candidates.forEach(s => console.log(' ', s.id, '—', s.name));
} else {
  console.log('Catalog Currency: CLEAR');
}
"`

- **CLEAR** → post `Catalog Currency: CLEAR — no PKS promotion candidates` and proceed to Step 3.5.
- **Candidates found** → evaluate SAP worthiness for each:
    - Applies to sister repos? → flag for SAP sync to `pks-catalog.json`
    - Repo-local only? → leave `canonicalId: null`, no action needed.

### 3.4.5.2 — Freshness Check

`node -e "
const d = require('D:/GitHub_Repo/Capsicum/.agent/pks-catalog.json');
const days = Math.floor((Date.now() - new Date(d.lastUpdated)) / 86400000);
console.log('pks-catalog.json age:', days, 'days (threshold: 30)');
if (days > 30) console.log('WARNING: stale — consider catalog refresh');
"`

If stale → surface warning. Does not block session close.

---

### Step 3.5: Phased Commit Protocol — UNCONDITIONAL

> 🟢 **Always run.** All session changes must be committed before memory sync and FSA.
> **Duration**: ~3-5 min
> **Skill**: `phased-commit-orchestrator`

Ensure all changes are committed using the **Intelligent Phased Commit Method**.

1. **Invoke Skill**: Run `phased-commit-orchestrator` to analyze changes.
2. **Follow the 6-Phase Process**:
   - **Phase 0**: PIRR Checkpoint (Schema/Function/SSOT updates)
   - **Phase 1**: Discovery (`git status`)
   - **Phase 2-3**: Relationship Analysis & Mapping
   - **Phase 4**: Commit Strategy (Foundation → Feature → Docs → Polish)
   - **Phase 5**: Execution (Logical atomic commits)
   - **Phase 5.5**: Remote Sync

3. **Verify Clean Slate**: Working tree MUST be clean before proceeding to Memory Sync.

> [!CRITICAL]
> **NO "Commit All"**: Do NOT run `git add . && git commit` blindly. Use the skill to group related changes logically.
> **Why?** Creates a clear, reversible history for future forensic audits.

---

### Step 4: Memory Synchronization (C3) — UNCONDITIONAL

> 🟢 **Always run.** Flush all decisions, plans, reads, and assign verification tiers.
> **Duration**: ~2 min

Run `memory-session-end` skill:

> [!NOTE]
> **Scope Ledger**: For multi-session tracks, ensure the living scope ledger is updated alongside plans and decisions. See [.agent/patterns/scope-ledger-anchor.md](../../.agent/patterns/scope-ledger-anchor.md) for sync guidelines.

<!-- Phase 3 Handoff Schema Binding: plans.md, decisions.md, verifications.md are session-handoff
     artifacts per .agent/handoffs/session-handoff.schema.yaml. Structural change deferred to
     first cross-role transition (Phase 3 trigger). Schema fields: active_decisions, active_constraints,
     open_questions (required); branch, last_phase_completed, next_action (optional). -->
1. Update `.agent\memory\plans.md` with current task status
2. Verify key decisions are logged to `.agent\memory\decisions.md`
   *(`file_reads.md` retired 2026-06-10 — write-only log, no downstream reader; do not log file reads)*
3. **Audit Verification Tiers** — For each task marked `[x]`:
   - Is it logged in `.agent\memory\verifications.md`?
   - If NO → Prompt for tier classification (T1-T4)
   - If T4 → Update `.agent\memory\verification_debt.json`
4. Update JSON timestamps if needed

**Tier Classification:**
| Tier | Evidence |
|------|----------|
| T1 | Automated test passed |
| T2 | Manual verification done |
| T3 | User confirmed "looks good" |
| T4 | **Not verified → DEBT** ⚠️ |

**Verification:**

```powershell
# Quick check for memory updates
Get-Content "memory\plans.md" | Select-Object -Last 10
Get-Content "memory\verifications.md" | Select-Object -Last 5
```

---

### Step 4.5: Rolling Snapshot Update (CONDITIONAL)

> 🟡 **Trigger**: Run if this session changed any of:
>   - Deployed state (GAS version bumped, Firebase deployed)
>   - Active workstreams (PIO-XXX status transitioned)
>   - Architecture or stack (new module, ADR written, file added/deleted)
>   - Known issues (T4 debt opened/closed, INC-XXX opened/closed)
> **Skip** for: doc-only edits, governance-only sessions, trivial single-line fixes with no state change.
> **Duration**: ~2 min | **Workflow**: `/snapshot-update`

1. Read `docs/SYSTEM_CLARITY_SNAPSHOT.md`.
2. Identify which sections changed this session using the Evergreen / Session-Updated taxonomy (see `/snapshot-update`).
3. Apply surgical updates + stale tags (`<!-- last updated: YYMMDD -->`) — do NOT rewrite unchanged sections.
4. Apply strip-down rules: remove DONE items from §5, remove resolved issues from §4.
5. Sync §4 T4 debt mirror from `memory/verification_debt.json` if debt changed this session.
6. Archive copy to session folder:
   ```powershell
   Copy-Item "docs/SYSTEM_CLARITY_SNAPSHOT.md" -Destination "docs/SESSION_HANDOFF/" -Force
   ```

---

### Step 5: Forensic Session Audit (FSA) & Handoff

> **Duration**: ~5-10 min
> **Reference**: `.agent/templates/FSA_MASTER_PROMPT.md` (Master Prompt)

Generate comprehensive session handoff document using the **Deep Forensic** approach.

#### 5.0 Pre-Audit: Context Recovery (CRITICAL)

**Before starting the audit:**

1. Check `.gemini/antigravity/brain/{conversation-id}/` for truncated context
2. Cross-reference `.agent\memory\decisions.md` and `.agent\memory\plans.md` for recorded pivots
3. **Identify "Patient Zero":** Which document or request kicked off this thread?

> [!WARNING]
> **Break the Recency Bias:** Do NOT start from the most recent code edit. Start from the _first file read_.

#### 5.0.5 Branch Triage (Session Orchestration) — CONDITIONAL

> 🟡 **Trigger**: Only if `.agent/session/SESSION_BRANCH_STATE.md` exists OR the session was complex (multiple work threads, unresolved branches).

> [!IMPORTANT]
> **Ordering Constraint**: `SESSION_GOVERNANCE_STATE.json` serialization must complete **before** this step begins. Governance state is serialized in Step 4 (Memory Sync). Confirm Step 4 is complete before proceeding here.

> **Reference**: `.agent/workflows/SESSION-ORCHESTRATION.md` §7

**Check**: Does `.agent/session/SESSION_BRANCH_STATE.md` exist?

- **NO** → Skip this step entirely. Post: `Branch Triage: SKIPPED — SESSION_BRANCH_STATE.md not present.`
- **YES** → **Read the ENTIRE file** using `view_file` without `StartLine`/`EndLine` limits. Do NOT rely on a partial read. Confirm the total line count in the tool output matches what you process.

> [!CRITICAL]
> **FULL READ REQUIRED**: A partial file read is a triage failure. The file may contain pinned branches from previous sessions at the bottom. You MUST read all lines before triaging any entry. **Count the entries before you start.** If `view_file` truncates at 800 lines, page through the remainder.

> [!CRITICAL]
> **GATE CONDITION**: If the state file exists, you **MUST** complete this triage. Any SHO generated without triaging active branches is technically invalid as it leaves context in a volatile state.

For **each branch entry** in the file, apply exactly one route:

| Branch State | Route | Action |
|---|---|---|
| RESOLVED | → **ABANDONED** | No action. Mark as closed. |
| PARKED / BLOCKED — follow-up only | → **SHO entry** | Add to SHO §"Pending Investigations" with `origin`, `parent`, `resume_condition` fields. |
| PARKED / BLOCKED — new scope / multi-phase | → **Enhancement Protocol** | Run `enhancement-scaffolder`, get TASK-XXX ID, update `ENHANCEMENTS.md`. |

**Decision heuristic**:
- Can be resolved in <2 hours next session? → SHO entry
- Requires formal plan / multiple phases / PRD scope? → Enhancement Protocol

**After all entries are routed**:
- [ ] Confirmed total entry count before triage started?
- [ ] All RESOLVED branches marked ABANDONED?
- [ ] All PARKED/BLOCKED minor branches added to SHO §"Pending Investigations"?
- [ ] All PARKED/BLOCKED major branches promoted to Enhancement Protocol?
- [ ] `SESSION_BRANCH_STATE.md` **deleted only after** all entries above are ticked?

---

#### 5.1 Artifact Inventory (Mandatory Sweep)

**Step 1**: Run `list_dir` on `<appDataDir>/brain/<conversation-id>`.
**Step 2**: List **EVERY** file found in the inventory breakdown.

**Inventory Groups:**

- **Core Brain Artifacts**: `task.md`, `implementation_plan.md`, `walkthrough.md`
- **Snapshots**: `session_summary.md`, intermediate states
- **Forensic Data**: `.resolved` files (contain Proof of Location), `.metadata.json` (timestamps)
- **Project Artifacts**: Files created/modified in the repo

> [!CRITICAL]
> **NO CHERRY PICKING**. Do not just list the "final" documents. Mid-session snapshots and `.resolved` files contain vital forensic history (pivots, decisions). Include them all.

#### 5.2 Chronological Reconstruction (By Intent)

Segment session into **Chapters grouped by Intent**, not just time blocks:

| Chapter           | Content                                                    |
| ----------------- | ---------------------------------------------------------- |
| **The Trigger**   | What problem were we solving? What docs did we read first? |
| **The Pivot**     | Did we change plans? Why? Cite the constraint/feedback.    |
| **The Execution** | What code was written? How does it match the Blueprint?    |

> [!IMPORTANT]
> **Don't merge unrelated work.** If Frontend and Backend were touched separately, they are separate chapters.

#### 5.3 Constraint Chain

Document how earlier work informed/constrained later work:

- Decisions that shaped implementation
- External reviewer feedback incorporated
- Pivots and their rationale
- **Link each Chapter to the next (cause → effect)**

#### 5.4 Handoff Document

Create:

```
docs/SESSION_HANDOFF/SHO_YYYYMMDD_HHMM_{{Title}}.md
```

**Required Sections:**

1. Artifact Inventory & Evidence
2. Chronological Chapters (with "Patient Zero" identified)
3. Verification Status
4. Unified Pending Tasks (from ALL chapters)
5. Session Title (1 line)

#### 5.5 Self-Validation Checklist

Before submitting the SHO:

- [ ] Did I identify the "Patient Zero" document?
- [ ] Did I capture at least one "Pivot" (if any occurred)?
- [ ] Does the Pending Tasks list cover ALL chapters, not just the last one?
- [ ] Did I link each Chapter to the next (cause → effect)?

---

## Quick Reference Checklist

```markdown
## Session Close Checklist

### UNCONDITIONAL (Always Run)

- [ ] Ghost File Scan complete? (`git status` - no unexplained `??` lines) (Step 1 Gate 6)
- [ ] User-Acceptance Checkpoint complete and approved? (Step 1 Gate 9)
- [ ] All session changes committed? (phased-commit-orchestrator) (Step 3.5)
- [ ] Memory sync complete? (plans.md, decisions.md, file_reads.md updated) (Step 4)
- [ ] Verification tiers classified? (T1-T4, T4 debt logged) (Step 4)
- [ ] SESSION_GOVERNANCE_STATE.json serialized? (MUST complete before Step 5.0.5)

### CONDITIONAL (Run Only If Triggered)

- [ ] PIRR run? (IF: git diff shows code changes - open pirr-compliance-checklist/SKILL.md) (Step 2)
- [ ] Retirement Evaluation checked? (IF: PIRR triggered - run Condition A + B) (Step 2.5)
- [ ] Enhancement ID generated? (IF: significant work done - run enhancement-scaffolder) (Step 3)
- [ ] SAP Skill Parity verified? (IF: .agent/skills/ modified) (Step 3.3)
- [ ] SAP Workflow Propagation complete? (IF: SAP-tracked workflow files modified) (Step 3.4)
- [ ] Catalog Currency checked? (Step 3.4.5)
- [ ] Post-Incident Governance triggered? (IF: systemic bug >= 30 min, non-obvious) (Step 1 Gate 7)
- [ ] Rolling snapshot updated? (IF: deployed state or workstream status changed) (Step 4.5)
- [ ] Branch Triage + FSA complete? (IF: SESSION_BRANCH_STATE.md exists or complex session) (Step 5.0.5)
  - [ ] SESSION_GOVERNANCE_STATE.json serialized FIRST?
  - [ ] FULL file read confirmed (line count verified)?
  - [ ] Total entry count declared before triage started?
  - [ ] All branches triaged (ABANDONED / SHO / Enhancement)?
  - [ ] SESSION_BRANCH_STATE.md deleted only after all entries are routed?
  - [ ] Handoff document created in docs/SESSION_HANDOFF/?

### Automation Targets (Do Not Block on These)

- UTF-8 scan - pre-commit hook (pending)
- npm run sg:scan (AST invariant lint) - pre-commit hook (active via sg:check)
- verify-hub-integrity.ps1 - CI runner (pending)
```

---

## Anti-Patterns

| Anti-Pattern | Correct Approach |
| --- | --- |
| Skipping PIRR "because only small changes" | Run PIRR anyway. Small changes often hide SSOT drift. |
| Closing without enhancement ID | Run `enhancement-scaffolder` first. |
| Memory files not updated | Blocks session end per Protocol #38. |
| Handoff in chat only | Always create `docs/SESSION_HANDOFF/SHO_*.md`. |
| **Flagging a gap without tracking it** (prose-only "future work" / "propagate later") | **Convert every deferral into a tracked artifact** — do it now, raise an enhancement (PIO-XXX), or capture a pattern. *Later has no consumer.* See `.agent/patterns/no-silent-deferral.md`. |
| Merging unrelated chapters | Keep Frontend/Backend/Governance as separate chapters. |
| **Partial read of SESSION_BRANCH_STATE.md** | **Always read the full file. Verify line count. Count entries before triaging.** |
| **Skipping `git status` before commit** | **Run the Ghost File Scan (Gate 6). Untracked files from prior sessions are invisible to all other checks.** |
| **Deleting SESSION_BRANCH_STATE.md before all entries are verified** | **Tick every entry checkbox first. Delete is the final act, not a mid-triage step.** |

---

## Integration Points

| System                             | Integration                                   |
| ---------------------------------- | --------------------------------------------- |
| `aos-session.md`                   | This workflow replaces manual C0-C3 execution |
| `GEMINI.md` Protocol #38           | Enforces C3 memory sync                       |
| `GEMINI.md` Protocol #6            | Enforces C1.5 enhancement check               |
| `pirr-compliance-checklist` skill  | Used in Step 2                                |
| `enhancement-tracker-update` skill | Used in Step 3                                |
| `memory-session-end` skill         | Used in Step 4                                |
| `memory-verification-logger` skill | Used in Step 4 for tier audit                 |
| `pin-branch` skill                 | Populates SESSION_BRANCH_STATE.md during session |
| `SESSION-ORCHESTRATION.md`         | Protocol governing Step 5.0.5 branch triage   |
| `docs/SYSTEM_CLARITY_SNAPSHOT.md`  | **Step 4.5** — conditional snapshot update at session close |
| `.agent/workflows/snapshot-update.md` | **Step 4.5** — governs surgical update procedure |
| `.agent/patterns/`                 | **Step 1 Gate 7** — process patterns from Post-Incident route here via `/capture-pattern` |
| `.agent/workflows/capture-pattern.md` | **Step 1 Gate 7** — invoked when incident reveals a repeatable process failure |

---

## Output

After completing this workflow, you will have:

1. ✅ PIRR reconciliation logged
2. ✅ Enhancement tracker updated
3. ✅ Memory files synchronized
4. ✅ Verification tiers classified (no unaudited T4 debt)
5. ✅ Handoff document in `docs/SESSION_HANDOFF/`
6. ✅ Clean state for next session
