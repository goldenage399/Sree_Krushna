---
description: Unified session start workflow - Risk-Driven Conditional Model (Memory Load, Discovery, Governance Toggle)
---

# AOS Session Start Workflow

> **Purpose**: Single canonical workflow for starting work sessions. Combines Memory Load (A0.5), Discovery (A1), and Governance Toggle (A2). Operates as a **risk-driven conditional model** — not all steps are mandatory for every session.

---

## When to Use

- ✅ Start of any new work session
- ✅ Resuming after context window reset
- ✅ Picking up from a previous handoff
- ✅ When user invokes `/aos-session-start`

---

## Conditional Routing Model

Two steps are **always required**. All others are gated on explicit triggers to minimize unnecessary overhead for simple tasks.

| Step | Status | Trigger Condition |
|------|--------|-------------------|
| **Step 1: Memory Load** | 🟢 **UNCONDITIONAL** | Always run — restores decisions, plans, and verification debt |
| **Step 0.2: INC-XXX Incident Scan** | 🟢 **UNCONDITIONAL** | Always run — targeted keyword scan only, not a full file dump |
| **Step 0: Skill Router** | 🟡 **CONDITIONAL** | Task requires cross-repository dispatch or involves unfamiliar tools |
| **Step 0.1: Graphify** | 🟡 **CONDITIONAL** | Task touches P11 files (>600 lines, god-nodes) or files in `src/contexts/` |
| **Step 0.3: Standards Catalog** | 🟡 **CONDITIONAL** | Domain keywords detected in task description |
| **Step 2: Handoff Read** | 🟡 **CONDITIONAL** | Prior unfinished tasks exist OR `SESSION_BRANCH_STATE.md` has pinned branches |

> [!NOTE]
> **Interactive Routing**: For live intent routing within a session, invoke the `cos-orchestrator` skill.
> **Session State**: `SESSION_STATE` is initialized at session open and tracked via `.agent/session/SESSION_GOVERNANCE_STATE.json`.

---

## The 5-Step Startup Protocol

<!-- shared:std.skill-router.session-protocol:start -->
### Step 0: Skill Router Load (CONDITIONAL — Protocol 31)

> **🟡 Trigger**: Only when the task requires cross-repository dispatch or involves unfamiliar tools not visible in the local `.agent/` directory.
> **Duration**: ~1 min | **Skill**: `skill-router`

Load the Unified Skill Router to establish cross-repository tool discovery.

1. **Read `skill-router.yaml`** — the source of truth for all workflows and skills.
2. **Identify core hubs** — note which skills are "God Nodes" (high connectivity).
3. **Internalize routing logic** — understand which keywords trigger which workflows.

**Token Budget**: ~200 tokens.

**Goal**: Ensure the agent starts with full awareness of all available specialized tools and workflows across the entire ecosystem.

- Which workflows are canonical for this task (via `related_workflows` field)
- Which related skills to proactively suggest (via `related_skills` field)
- Cross-repo tools that would otherwise be invisible to you (e.g. Capsicum's 40+ workflows, PIO's 37 skills)

> [!IMPORTANT]
> Do not skip this step. Any routing decision made before loading the router is made with incomplete information.
<!-- shared:std.skill-router.session-protocol:end -->

---

<!-- shared:std.knowledge-graph.session-protocol:start -->
### Step 0.1: Graphify Knowledge Load (CONDITIONAL — Graphify Governance)

> **🟡 Trigger**: Only when: (a) task touches P11 files (>600 lines, god-nodes), (b) files in `src/contexts/`, or (c) bug description includes CSS layout investigation keywords: `grid`, `columns`, `responsive`, `multi-column`, `flex`, `viewport`, `max-width`, `layout constraint`. For doc-only, styling token changes, or single-file non-layout fixes, skip.
> **Duration**: ~1 min | **Skill**: `graphify`

Ground reasoning in the master architectural knowledge graph:

> **Not tracked in git** (2026-08-08 — was 6,452 files, 97% perpetually dirty; the `.gitignore` rule for it had silently never worked due to a UTF-16 encoding defect, now fixed). Missing on a fresh clone → regenerate: `python scratch/finalize_graph.py`.

1. **Read `graphify-out/GRAPH_REPORT.md`** — for god nodes and community structure.
2. **Read `graphify-out/graph.json`** — for precise node/edge relationships.
3. **Analyze Knowledge Gaps** — check for isolated nodes or "Thin Communities" before assuming documentation completeness.
4. **Layout Catalog Check** — If layout/CSS has changed, consult `dist/layout-catalog.json` (layout-catalog) to verify constraint mapping.

**Goal**: Eliminate "cold-start architectural blindness" by synchronizing with the repository's semantic graph.

> [!CAUTION]
> **NEVER** fall back to blind `grep` searches if the graph exists. Use the community hubs in `graphify-out/GRAPH_REPORT.md` to identify the correct starting points.
<!-- shared:std.knowledge-graph.session-protocol:end -->

---

<!-- shared:std.governance.ai-instruction-gate:start -->
### Step 0.2: AI Instruction Gate — INC-XXX Incident Scan (UNCONDITIONAL — Protocol 60.1)

> **🟢 Always run.** Scan only — do NOT dump full file content.
> **Duration**: ~1 min

Before starting any non-trivial task, scan the repo's AI instruction files for `INC-XXX` entries matching the current task description:

1. **Scan `GEMINI.md`** for `INC-XXX` entries — look only for incident codes that match task keywords.
2. **Scan `CLAUDE.md`** for `INC-XXX` entries — check active protocols and invariants relevant to the task.

**Goal**: Surface documented incidents and protocols that apply to the current task. Re-deriving settled knowledge is a waste; these files encode it.

**What to look for:**
- `INC-XXX` entries — documented bugs with known root causes and fixes that match the task domain
- Any `ADR-XXX` references relevant to the module in scope

> [!IMPORTANT]
> **Narrow scope**: Scan for `INC-XXX` keywords matching the task description only. Do NOT dump the full contents of `GEMINI.md` or `CLAUDE.md` into context — that defeats TEP-001 token efficiency. Filter, do not dump.

> [!CAUTION]
> **Never skip this step for investigations or bug fixes.** The pattern you are about to "discover" may already be documented as an incident. INC-003, for example, documents the exact plural profile linkage bug — reading it first would have made a multi-turn diagnosis a one-turn fix.
<!-- shared:std.governance.ai-instruction-gate:end -->

---

<!-- shared:std.catalog.session-load-protocol:start -->

### Step 0.3: Standards Catalog Load (CONDITIONAL — Catalog Discovery Protocol)

> **🟡 Trigger**: Only when domain keywords are detected in the task description: `auth`, `firebase`, `ui`, `modal`, `form`, `routing`, `css`, `tag`, `profile`, `p83`, `p84`, `p89`, `p-pcp`, `p-isg`. Skip for pure governance or doc-only tasks.
> **Duration**: ~1 min | **Source**: `.agent/standards-catalog.json` (or `.agent/pks-catalog.json` in Capsicum)

Ground enforcement context before any task work begins:

1. **Run standard lookup**: Query the standards registry to search for rules matching this task:
   `node scripts/query-standard.cjs --keyword "<task-keywords>"` or `node scripts/query-standard.cjs --surface <surface>`
2. **Read `.agent/standards-catalog.json`** — (or `.agent/pks-catalog.json` in Capsicum)
3. **Detect task domain** — from the user's stated task, identify 1-3 domain keywords (e.g., `auth`, `firebase`, `ui`, `modal`, `form`, `routing`, `css`, `tag`, `profile`)
4. **Filter applicable standards** — scan standard `name` and `checkpoints` fields for keyword matches against detected domain
5. **Surface top matches** — list up to 5 standards, severity `error` first, then `warning`; include severity, checkpoint count, and `canonicalId` if non-null
6. **Cross-reference protocol-router** — for any matched entry with a `canonicalId`, note the canonical name from `Capsicum/.agent/protocol-router.yaml` if accessible

**Output format:**

> Standards active for this task:
>
> - **[P##]** Standard Name — severity: `error` | checkpoints: N | canonicalId: `sap.x.y`
> - ...
>
> _(If no matches: "No domain-specific standards detected — general protocols apply.")_

**Token Budget**: ~150 tokens for scan and surfacing. Do not load the full catalog into context — filter only.

**Goal**: Eliminate the gap where agents begin implementation unaware of active enforcement standards for the task domain. A 1-minute catalog scan prevents the same violation class from recurring.

> [!IMPORTANT]
> Filter, do not dump. Full-catalog load defeats TEP-001 token efficiency. Surface only matching entries; drop the rest.

<!-- shared:std.catalog.session-load-protocol:end -->

---

### Step 1: Memory Context Load (UNCONDITIONAL — Protocol #38)

> **🟢 Always run.** Load prior session context before any task work begins.
> **Duration**: ~1 min | **Skill**: `memory-session-loader`

Load persistent memory from prior sessions:

```powershell
# Quick check if memory exists
Test-Path ".agent\memory\file_reads.md"
```

**Actions:**
1. Read `.agent/memory/file_reads.md` — last 10 entries
2. Read `.agent/memory/decisions.md` — last 5 entries
3. Read `.agent/memory/plans.md` — check for active tasks
4. **Read `.agent/memory/verification_debt.json`** — check for T4 debt ⚠️
5. **Read `docs/SYSTEM_CLARITY_SNAPSHOT.md`** — §2 (Active Workstreams) + §5 (Next Actions) only.
   Token budget: ~100 tokens. Gives instant orientation on where the project currently stands.
   *Skip if: this is a clean new task with no prior context.*
6. **Read Claude auto-memory index** — `C:\Users\Temp\.claude\projects\d--GitHub-Repo-PIOperationsMgmt-Firebase\memory\MEMORY.md`
   Scan for user preferences, feedback rules, and project facts relevant to the current task.
   *(Two memory systems exist: `.agent/memory/` = agent-authored session state; Claude auto-memory = cross-session user preferences, feedback, and project-level facts. Both must be read for full context.)*

**Token Budget:** Max ~400 tokens for memory context (increased to cover both memory systems).

> [!WARNING]
> If **Verification Debt** exists (T4 items), apply the threshold rule:
> - **1–2 T4 items**: Surface warning and continue — "⚠️ {N} unverified items. Resolve before session close."
> - **≥3 T4 items**: **BLOCK new `src/` implementation work.** Before writing any code, resolve at least one T4 item to T1/T2/T3.
>
> **T4 Resolution procedure**: Read `.agent/memory/verification_debt.json` → pick oldest open item → run its associated verification command → update tier in `.agent/memory/verifications.md` → remove the entry from `verification_debt.json`. If the item cannot be verified (environment unavailable, test infra broken), document justification and mark as `ACCEPTED-RISK` in `verifications.md` instead of leaving it as T4.

> [!TIP]
> Skip if `.agent\memory\` folder doesn't exist (first-time setup).

---

### Step 2: Session Handoff Selection (CONDITIONAL)

> **🟡 Trigger**: Only when prior unfinished tasks exist OR `.agent/session/SESSION_BRANCH_STATE.md` contains pinned branches from previous sessions. Skip for clean new-task starts with no prior context.
> **Duration**: ~2 min

Identify the starting point for this session:

> **Shortcut**: Read `docs/SESSION_HANDOFF/INDEX.md` — the `Latest SHO` pointer at the top resolves the selection without a directory scan.
>
> **Scope Ledger**: For multi-session milestone-gated tracks, check for a living scope ledger (e.g. `*SCOPE_LEDGER.md`) in the active thread folder. It acts as the primary resume anchor, bypassing chat history. See [.agent/patterns/scope-ledger-anchor.md](../../.agent/patterns/scope-ledger-anchor.md) for context.

```powershell
# Fallback: list top 3 most recent handoffs if INDEX.md is missing
Get-ChildItem "docs\SESSION_HANDOFF\SHO_*.md" | Sort-Object LastWriteTime -Descending | Select-Object -First 3 | Format-Table Name, LastWriteTime
```

**Actions:**
1. **Read `docs/SESSION_HANDOFF/INDEX.md`** — use the Latest SHO pointer directly.
2. **Present Options** (if INDEX.md is missing): List the 3 most recent handoff files found.
3. **Ask User**:
   > "Found these recent handoffs. Which one should I load context from?
   > 1. [Latest File Name]
   > 2. [Second File Name]
   > 3. [Third File Name]
   > 4. Skip Handoff (Clean start for new requirement)"
3. **Execute**:
   - If User picks 1-3: Read that specific file and note pending tasks.
   - If User picks 4: Skip to Step 3.

---

### Step 3: Discovery (A1)

> **Duration**: ~3 min

Understand the task context:

> [!IMPORTANT]
> **SSOT-First (MANDATORY before any source file reads)**
> If a module is in scope, read its SSOT docs BEFORE opening any source files:
> 1. Module SSOT hub (e.g., `docs/{Module}_Module_SSOT/HUB.md`) — orientation
> 2. `CONTRACT.json` — exact API parameter signatures
> 3. `DATA_FLOW_MAP.md` — full UI → API → Storage chain
> 4. `SERVICE_LAYER_MAP.md` — file-level responsibilities
>
> For complex investigations, run `/context-bootstrap <module>` — full 5-phase ICAP pipeline.
> Code-reading is for **verification only**, not initial discovery.

> [!TIP]
> **Triage Anomalies First**
> If the task involves fixing database schema drift or data anomalies, see [.agent/patterns/triage-anomalies-first.md](../../.agent/patterns/triage-anomalies-first.md) to triage the population size and verify with the user before building migration tools.

1. **Read `graphify-out/GRAPH_REPORT.md`** — locate relevant communities and "God Nodes"
2. **Read DOCUMENTATION-INDEX.md** — locate relevant domains
3. **Read ARCHITECTURE_*.md** — for impacted domain
4. **Check GUARDRAILS_Development_Checklist.md** — pre-implementation checks
5. **If new module**: Follow `/new-module-creation` workflow

**For Specific Task Types:**

| Task Type | Additional Reading |
|-----------|-------------------|
| **Complex module investigation** | Run `/context-bootstrap <module>` — full ICAP pipeline |
| Backend/API | `CORE_FUNCTION_INDEX.md`, `SHEET_SCHEMAS.md` |
| Frontend/UI | `FRONTEND_PATTERNS.md`, `UI_DESIGN_SYSTEM.md` |
| Schema Change | `docs/{Module}_Module_SSOT/CONTRACT.json` |
| Debugging | Run `/debug` workflow instead |

---

### Step 4: Architecture Control Point (A0)

> **Duration**: ~2 min | **Gate**: MANDATORY for code changes

Before writing any code, verify contracts:

#### Data Model Check
- [ ] `docs/{Module}_Module_SSOT/DATA_FLOW_MAP.md` — defines where fields go?
- [ ] `docs/{Module}_Module_SSOT/CONTRACT.json` — includes new fields/actions?
- [ ] Schema location (Sheet/Column) explicitly defined?

#### Architecture Check
- [ ] `CORE_FUNCTION_INDEX.md` — existing patterns to reuse?
- [ ] `02_Router.js` touched? → Requires `CONTRACT.json` update
- [ ] `MODULE_CONFIG.yaml` up to date?

> [!WARNING]
> **STOP if contracts are missing.** Define contracts before proceeding.

---

### Step 5: Governance Toggle (A2 — PIO-069)

> **Duration**: ~1 min

Assess complexity and suggest governance mode:

```powershell
# Check current governance state
python -m governance.cli status
```

**Decision Tree:**

```
Is this task...
├── Multi-file (3+ files)? → SUGGEST: enable governance
├── Cross-module work? → SUGGEST: enable governance
├── Financial data/calculations? → SUGGEST: enable governance
├── Schema/data model change? → SUGGEST: enable governance
├── Complex debugging (2+ hours)? → SUGGEST: enable governance
└── Simple edit/docs/styling? → SUGGEST: disable governance
```

**Prompt User:**

> "This task involves [X files / cross-module / financial data].
> Governance is currently [ENABLED/DISABLED].
> Should I [enable/disable] governance for this task?"

---

### Step 5.5: Orchestrator Invocation Gate (CONDITIONAL — Implementation Tasks)

> **🟡 Trigger**: Any task that creates, modifies, or deletes files under `src/`, `functions/`, or `firestore.rules`. Does NOT apply to documentation-only, governance-only (`.agent/`), or configuration-only changes.
> **Duration**: <1 min

**Hard invocation — read and execute this file now**:

> **`.agent/workflows/cos-invoke.md`**

Do not rely on trigger phrases or skill pattern matching. Read the file at that path and follow every step in it. This is the only reliable way to guarantee orchestration fires.

The workflow (thin entry since the **2026-06-10 COS demotion** — no Flow-1 interrogation, no MODE state machine on the default path):
1. **Mechanical risk scan** — `npm run preflight` (P11 line thresholds, P68 Firestore-collection safeguard, P-SVC service/hook surface)
2. **PREFLIGHT routing lookup** — match the task against `.agent/PREFLIGHT.md` rows R1–R22; read each matched row's "Read FIRST" doc *before* opening target code
3. **Proceed** on the default path, **or escalate** to `.agent/skills/cos-orchestrator/SKILL.md` (deep MODE machine) **only** for ≥3-surface tasks, an active `INC-XXX`, or a god-node refactor (>800 lines AND >10 consumers)

> [!NOTE]
> **Canonical layering (resolves the dual-"canonical" wording):** `cos-invoke.md` is the canonical **entry wrapper** for code tasks; `.agent/PREFLIGHT.md` is the canonical **routing table** it invokes as a subsystem. They are layered, not competing — entry → routing → (proceed | deep path).

> [!CAUTION]
> **Session startup is not complete for implementation tasks until `cos-invoke.md` has been read and its routing phase completed.** Skipping it makes session open an unguarded path straight to implementation, bypassing the mechanical risk scan and the PREFLIGHT routing table.

---

## Quick Reference Checklist

```markdown
## Session Start Checklist

### UNCONDITIONAL (Always Run)
- [ ] 🟢 INC-XXX incident scan complete? (`GEMINI.md` + `CLAUDE.md`, keyword match only — no full dump) (Step 0.2)
- [ ] 🟢 Memory files loaded? (decisions, plans, verification debt) (Step 1)
- [ ] 🟢 Verification debt surfaced? ⚠️ (Step 1)

### CONDITIONAL (Run Only If Triggered)
- [ ] 🟡 Skill Router loaded? (IF: cross-repo dispatch or unfamiliar tools) (Step 0)
- [ ] 🟡 Graphify loaded? (IF: P11 files >600 lines or `src/contexts/` touched) (Step 0.1)
- [ ] 🟡 Standards Catalog filtered for task domain? (IF: auth/firebase/ui/modal/form/routing/css/tag/profile keywords) (Step 0.3)
- [ ] 🟡 Handoff read? Pending tasks noted? (IF: prior unfinished tasks or `SESSION_BRANCH_STATE.md` exists) (Step 2)
- [ ] 🟡 `cos-invoke.md` read and executed? (IF: any `src/` / `functions/` / `firestore.rules` change planned — hard path invoke, not trigger phrase) (Step 5.5)

### Task-Conditional (Run if Applicable)
- [ ] Relevant SSOT docs identified? (Step 3)
- [ ] Contracts defined (if code change)? (Step 4)
- [ ] Complexity assessed, governance mode suggested? (Step 5)
```

---

## Fast-Path for Simple Tasks

If the task is clearly simple (docs, styling, quick fix, governance-only):

1. ✅ Run Step 0.2 (INC-XXX Scan) — always (keyword scan only)
2. ✅ Run Step 1 (Memory Load) — always
3. ⏩ Skip Steps 0, 0.1, 0.3, 2 (no risk signals, no conditional triggers)
4. ✅ Run Step 5 — suggest "disable governance" for simple tasks

---

## Integration Points

| System | Integration |
|--------|-------------|
| `.agent/skill-router.yaml` | **Step 0** — conditional load. Cross-repo skill/workflow dispatch table |
| `graphify-out/graph.json` | **Step 0.1** — conditional load. Master architectural knowledge graph |
| `.agent/standards-catalog.json` | **Step 0.3** — conditional scan. Enforcement standards filtered by task domain (pks-catalog.json in Capsicum) |
| `aos-session.md` | This workflow extracts Phase A |
| `GEMINI.md` Protocol #38 | Enforces Step 1 memory load |
| `memory-session-loader` skill | Used in Step 1 |
| `memory-verification-logger` skill | Used for debt tracking |
| `codebase-navigation.md` | Used in Step 3 |
| `governance-workflow.md` | Used in Step 5 |
| `cos-orchestrator` skill | For live intent routing within a session — invoke when mode routing is needed post-startup |
| `.agent/session/SESSION_GOVERNANCE_STATE.json` | `SESSION_STATE` is initialized at session open and serialized here throughout the session |
| `docs/SYSTEM_CLARITY_SNAPSHOT.md` | **Step 1** — conditional orientation read (§2 Active Workstreams + §5 Next Actions) |
| `.agent/workflows/capture-pattern.md` | Available any time during session when a validated process discovery emerges |

---

## Output

After completing this workflow, you will have:

1. ✅ Prior context loaded from memory
2. ✅ Pending tasks from handoff identified
3. ✅ Relevant SSOT docs reviewed
4. ✅ Contracts verified (if code change)
5. ✅ Governance mode set appropriately
6. ✅ Verification debt acknowledged (if any)
7. ✅ Applicable enforcement standards surfaced for task domain (Step 0.3)
8. ✅ Ready to begin Phase B (Coding)
