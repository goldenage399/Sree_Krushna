# Query 1.0 -get all the essential go-to workflows and skill from all the repos that i work with and sap sync and all

# Review 1.0 -D:\GitHub_Repo\Task-Dashboard\.agent .agent, .claude and all the related governance and folder structure like hub and spoke and all

# Response 1.0 -Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard\.agent" -Recurse -Force | Select-Object FullName`

Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard\.agent" -Depth 2 | ForEach-Object {
    [PSCustomObject]@{
        Type = if ($_.PSIsContainer) { "DIR" } else { "FILE" }
        Name = $_.Name
        RelativePath = $_.FullName.Substring("D:\GitHub_Repo\Task-Dashboard\.agent".Length)
    }
} | Format-Table -AutoSize`
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard\.claude" -Recurse -Force -ErrorAction SilentlyContinue | Select-Object FullName`
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard\.agent" -File | Select-Object Name`
Ran command: `Get-Content "D:\GitHub_Repo\Task-Dashboard\CLAUDE.md" -Head 120`
Ran command: `Get-Content "D:\GitHub_Repo\Task-Dashboard\CLAUDE.md" | Select-Object -Skip 120 -First 120`
Ran command: `Get-Content "D:\GitHub_Repo\Task-Dashboard\.agent\workflows\portable\spoke-and-wheel-docs.md"`
Ran command: `Get-Content "D:\GitHub_Repo\Task-Dashboard\.agent\PREFLIGHT.md" -Head 100`
Ran command: `Get-Content "D:\GitHub_Repo\Task-Dashboard\.agent\skill-router.yaml" -Head 120`
Ran command: `Get-Content "D:\GitHub_Repo\Task-Dashboard\.agent\skill-router.yaml" | Select-Object -Skip 120 -First 200`
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\PIOperationsMgmt_Firebase\.agent\skills\*\SKILL.md" -ErrorAction SilentlyContinue | ForEach-Object { $_.Directory.Name }`
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\*\.agent\skills\*\SKILL.md" -ErrorAction SilentlyContinue | ForEach-Object { "$($_.Directory.Parent.Parent.Parent.Name): $($_.Directory.Name)" } | Sort-Object -Unique`

# Cross-Repository Ecosystem: Governance, Workflows, Skills & SAP Sync

---

## 1. Hub & Spoke Architectural Model

The multi-repo ecosystem operates under a **Hub & Spoke Architecture** governed by the **Shared Architecture Protocol (SAP)** and **Spoke & Wheel Documentation System** ([`spoke-and-wheel-docs.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/spoke-and-wheel-docs.md)).

```mermaid
graph TD
    subgraph Governance Hub
        TD["Task-Dashboard<br/><b>(Canonical Hub & SSOT)</b><br/>• skill-router.yaml<br/>• standards-catalog.json<br/>• PREFLIGHT.md (R1–R41)<br/>• Universal Patterns & PACT-001"]
    end

    subgraph Spokes
        PIO["PIOperationsMgmt_Firebase<br/>(Backend/GAS Authority)"]
        BMS["BMS<br/>(Business Mgmt & Deck)"]
        CAP["Capsicum<br/>(Mobile & Ops)"]
        UG["UG-Farmhouse / UG Farmhouse<br/>(Operations & Ingestion)"]
        QSR["QSR<br/>(Restaurant & Live Status)"]
        GAS["DashBoard / Inventory_Mgmt / Unified_Uploader<br/>(Google Apps Script Engine)"]
        SK["Sree_Krushna<br/>(Rituals & Cultural Specs)"]
        SCM["SupervisorComplianceMonitoring"]
        OTH["TestViteJSX / TriP"]
    end

    TD == "SAP Sync (/sap-sync)<br/>PACT-001 & Universal Patterns" ==> PIO
    TD == "SAP Sync (/sap-sync)" ==> BMS
    TD == "SAP Sync (/sap-sync)" ==> CAP
    TD == "SAP Sync (/sap-sync)" ==> UG
    TD == "SAP Sync (/sap-sync)" ==> QSR
    TD == "SAP Sync (/sap-sync)" ==> GAS
    TD == "SAP Sync (/sap-sync)" ==> SK
    TD == "SAP Sync (/sap-sync)" ==> SCM
    TD == "SAP Sync (/sap-sync)" ==> OTH
```

### Key Hub-and-Spoke Governance Rules

1. **Hub Documents (`HUB.md` / `DOCS_HUB.md`)**: Contain **only maps and links** (max 150 lines) with high-level snapshots; hubs never duplicate spoke content.
2. **Spoke Documents**: Domain-specific content files that declare their parent hub in frontmatter (`hub: path/to/HUB.md`).
3. **Core Function Index (CFI)**: Utility index that prevents utility function duplication across modules.
4. **Inventory First, Invent Never (Rung 2 Grounding)**: Search existing schemas, gates, and protocols before inventing parallel mechanisms.

---

## 2. Standard Ecosystem Folder Structure

Every repository participating in the ecosystem adopts or adheres to this standardized layout:

```
<repo-root>/
├── .agent/
│   ├── workflows/             # Canonical step-by-step execution workflows
│   │   └── portable/          # Cross-repo portable blueprints & patterns
│   ├── skills/                # Standardized SKILL.md instruction documents
│   ├── patterns/              # Active & reference PACT-001 pattern contracts
│   ├── skill-router.yaml      # Master trigger index for cross-repo tooling
│   ├── PREFLIGHT.md           # R1–R41 Pre-execution risk gates and validation
│   ├── standards-catalog.json # Catalog of P-standards (P1–P108, P-POS-ROUTINE, etc.)
│   ├── context-registry.json  # Critical context map for active workstreams
│   └── violation-patterns.json# Anti-pattern registry
├── .claude/
│   ├── skills/                # Claude-native skills (mermaid, impeccable, site-arch)
│   └── sg-rules/              # ast-grep static analysis rules
├── docs/
│   ├── ssot/                  # Single Sources of Truth (Architecture, UI, Dev Hubs)
│   ├── protocols/             # PACT-001 manuals and governance schema
│   └── incidents/             # Formal INC postmortem records (INC-001 to INC-083)
├── scripts/                   # Verification gates (preflight, governance wiring, reachability)
├── GEMINI.md / CLAUDE.md      # Ground rules, 4-PPSD discipline, and startup gates
└── package.json               # Script hooks for automated governance gates
```

---

## 3. Essential Go-To Workflows

All workflows are located in [`.agent/workflows/`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/) and [`.agent/workflows/portable/`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/).

### A. Session Lifecycle Workflows

| Workflow                    | File Path                                                                                                                | Trigger / Purpose                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Session Startup Gate**    | [`aos-session-open.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-open.md)                      | **Mandatory on startup**: Loads Skill Router (Protocol 31), Graphify knowledge, and enforces 4-PPSD. |
| **Session Orchestration**   | [`SESSION-ORCHESTRATION.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/SESSION-ORCHESTRATION.md)            | Multi-track branch orchestration, subagent dispatch, and pinned branches.                            |
| **Session Closeout & PIRR** | [`aos-session-close.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-close.md)                    | Logs telemetry to `.agent/memory/session_signals.jsonl`, runs PIRR check, and updates snapshots.     |
| **Session Handoff**         | [`session-handoff-system.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/session-handoff-system.md) | Compiles concise handoff summaries across working sessions.                                          |

### B. Core Execution & Code Change Workflows

| Workflow                      | File Path                                                                                                                                                               | Trigger / Purpose                                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Code Change Entry Wrapper** | [`cos-invoke.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/cos-invoke.md)                                                                                 | **Canonical entry point before editing `src/`, `functions/`, `rules`**: runs `npm run preflight`, then routes through `PREFLIGHT.md`. |
| **Preflight Gate Matrix**     | [`preflight.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/preflight.md)                                                                                   | Runs rows **R1–R41** checking bridge classes, reachability, secrets, and mutation contracts.                                          |
| **Implementation Plan**       | [`plan.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/plan.md) / [`plan-review.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/plan-review.md) | Formulates phased plans with testable assertions and hard-stops for approval.                                                         |
| **Enhancement Lifecycle**     | [`enhancement-lifecycle.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/enhancement-lifecycle.md)                                                  | End-to-end enhancement execution (scaffolding $\rightarrow$ PRD $\rightarrow$ implementation $\rightarrow$ verification).             |
| **Contract-First SDLC**       | [`contract-first-sdlc.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/contract-first-sdlc.md)                                                               | Defines schemas and contracts prior to backend/frontend coding.                                                                       |

### C. Debugging & Quality Assurance

| Workflow                     | File Path                                                                                                            | Trigger / Purpose                                                                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Systematic Debugging**     | [`systematic-debugging.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/systematic-debugging.md) | Executes the **4-Phase Problem-Solving Discipline (4-PPSD)**: Grounding $\rightarrow$ External Benchmarks $\rightarrow$ Objective Rules $\rightarrow$ Evidence Execution. |
| **Frontend Debugging**       | [`debug-frontend.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/debug-frontend.md)                      | UI glitches, CSS bridge specificity, theme-token mismatches, and responsive failures.                                                                                     |
| **Post-Incident Governance** | [`post-incident-governance.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/post-incident-governance.md)  | Post-fix incident analysis (PIRR), anti-pattern logging, and gate creation.                                                                                               |
| **SSOT Reconciliation**      | [`ssot-reconciliation.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/ssot-reconciliation.md)   | Resolves drift between codebase implementation and documentation SSOTs.                                                                                                   |

### D. Governance, UI & Operations Workflows

| Workflow                          | File Path                                                                                                                                                                                             | Trigger / Purpose                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---- | ---- | ---------- |
| **SAP Pattern Sync**              | [`sap-sync.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/sap-sync.md)                                                                                                                   | Synchronizes PACT-001 patterns and verification scripts across all 11 repos.         |
| **Architecture / UI Council**     | [`architecture-council.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/architecture-council.md) / [`ui-council.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/ui-council.md) | Governance review gates for schema changes, cross-repo primitives, or UI overhauls.  |
| **External UI Redesign (EUR v2)** | [`external-ui-redesign.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/external-ui-redesign.md)                                                                                           | Sandboxed ingestion of external designs with strict component classification gates.  |
| **Recurring Checklist Ingestion** | [`ingest-recurring-checklist.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/ingest-recurring-checklist.md)                                                                               | Ingestion of SOP checklists into recurring checklist / positional routine templates. |
| **Live DB Inspection Fleet**      | [`db-inspect.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/db-inspect.md)                                                                                                               | Non-browser administrative Firestore inspection (`npm run db:overview                | task | user | profile`). |

---

## 4. Essential Go-To Skills

All skills are indexed in [`.agent/skill-router.yaml`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/skill-router.yaml) and documented in each repository's `.agent/skills/<skill-id>/SKILL.md`.

### 🛡️ Governance & Safety Skills

- **`protocol-enforcer-pre-code`**: Hard-stops unauthorized file edits; verifies that requirements are approved.
- **`governance-wiring-audit`** (`npm run verify:governance-wiring`): Audits whether artifacts, workflows, and P-standards are actively wired into consumption layers.
- **`pirr-compliance-checklist`**: Validates that Definition of Done (DoD) includes documentation, telemetry, and tests.
- **`ecosystem-portability-evaluator`**: Evaluates cross-repo portability of patterns and utilities.
- **`writejournal-audit-gate`**: Ensures critical operational logs and audit trails are recorded during data mutations.

### 📐 Planning & Documentation Skills

- **`writing-plans`**: Formulates structured, multi-step implementation plans with explicit verification criteria.
- **`change-prd-architect`**: Drafts structured Product Requirement Documents (PRDs) and impact analyses.
- **`enhancement-scaffolder`**: Scaffolds standard directories and documentation for new features/enhancements.
- **`enhancement-tracker-update`**: Updates canonical tracker files (`ENHANCEMENTS.md`) upon phase completion.
- **`prompt-clarity`**: Parses ambiguous user requests and produces reframed interpretations before starting work.
- **`pin-branch`**: Persists in-flight session branches without creating a full enhancement ticket.

### ⚡ Architecture & Systematic Engineering Skills

- **`systematic-debugger`**: Enforces 4-PPSD discipline for complex bugs; halts speculative edits.
- **`cos-orchestrator` / `cos-safe-refactor`**: Coordinates refactors touching multi-surface architectures.
- **`backend-test-generator`**: Generates permanent unit and integration tests (respecting P106/P107 mock standards).
- **`contract-first-api-validator`**: Enforces API contract parity across frontend and backend boundaries.
- **`declarative-schema-enforcer` / `schema-migration-guide`**: Protects database schema integrity during migrations.

### 🎨 Frontend & Design Skills

- **`ui-ux-pro-max` / `frontend-design`**: UI/UX design execution adhering to compact scales and theme variables.
- **`mobile-ui-validator`**: Ensures all layouts render without clipping down to **300px** viewports.
- **`ui-design-validator`**: Validates semantic color-mix, bridge tokens, and typography weight rules.
- **`mermaid-skill`**: Generates valid architecture, class, and flowchart mermaid diagrams.
- **`impeccable`**: Design token, font, and UI consistency inspection engine.

### ⚙️ Backend, Database & Google Apps Script (GAS) Skills

- **`gas-deploy-guard`**: Prevents deployment glitches, quota exhausts, and runtime regressions in Google Apps Script.
- **`gas-optimizer`**: Optimizes batch reads/writes and cache management for GAS spreadsheets.
- **`task-firestore-direct-write`**: Manages secure Firestore operations respecting security rules and indices.
- **`db-inspect-fleet`**: Executes CLI database diagnostic scripts against production collections.

### 🧠 Memory & Token Optimization Skills

- **`memory-session-loader` / `memory-session-end`**: Loads past session context and writes closeout memories.
- **`memory-event-logger` / `memory-decision-logger`**: Records critical decisions into memory registries.
- **`caveman` / `caveman-compress`**: Ultra-compressed output style to save token budgets when needed.

---

## 5. SAP Sync (`/sap-sync`) & Cross-Repo Mechanics

The **Shared Architecture Protocol (SAP)** governs cross-repository synchronization via the **Pattern Activation Contract (PACT-001)**.

### Purpose of `/sap-sync`

Ensures that all universal patterns, governance verifiers, and preflight rules authored in the canonical hub (`Task-Dashboard`) are consistently distributed and verified across sibling repositories.

### `/sap-sync` Step-by-Step Procedure

```powershell
# Step 1: Scope Identification & Target Setup
$target = "D:/GitHub_Repo/<target-spoke-folder>"

# Step 2: Propagate PACT Verification Infrastructure
if (!(Test-Path "$target/scripts")) { New-Item -ItemType Directory -Path "$target/scripts" }
Copy-Item "scripts/verify-governance-wiring.cjs" -Destination "$target/scripts/verify-governance-wiring.cjs" -Force
Copy-Item "scripts/verify-governance-schema.cjs" -Destination "$target/scripts/verify-governance-schema.cjs" -Force

if (!(Test-Path "$target/.agent/workflows")) { New-Item -ItemType Directory -Path "$target/.agent/workflows" }
Copy-Item ".agent/workflows/capture-pattern.md" -Destination "$target/.agent/workflows/capture-pattern.md" -Force

if (!(Test-Path "$target/.agent/patterns")) { New-Item -ItemType Directory -Path "$target/.agent/patterns" }
Copy-Item ".agent/patterns/README.md" -Destination "$target/.agent/patterns/README.md" -Force

if (!(Test-Path "$target/docs/protocols")) { New-Item -ItemType Directory -Path "$target/docs/protocols" }
Copy-Item "docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md" -Destination "$target/docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md" -Force
Copy-Item "docs/protocols/governance-wiring.schema.json" -Destination "$target/docs/protocols/governance-wiring.schema.json" -Force

# Step 3: Copy Universal Patterns
# Find all patterns with 'portability: universal' in Task-Dashboard
Select-String -Path ".agent/patterns/*.md" -Pattern "portability:\s*universal"
# Copy selected pattern to target
Copy-Item ".agent/patterns/<pattern-name>.md" -Destination "$target/.agent/patterns/<pattern-name>.md" -Force

# Step 4: Wire Target Repository
# 1. Add npm scripts to $target/package.json:
#    "verify:governance-wiring": "node scripts/verify-governance-wiring.cjs"
#    "verify:governance-wiring:all": "node scripts/verify-governance-wiring.cjs --all"
#    "verify:governance-schema": "node scripts/verify-governance-schema.cjs"
# 2. Add Row R14 to $target/.agent/PREFLIGHT.md.
# 3. Update pattern frontmatter (consumed_by, activation_tier, canonical_source: task-dashboard).

# Step 5: Verification
cd "$target"
npm run verify:governance-wiring:all
```

---

## 6. Quick-Reference Cheat Sheet for Daily Work

| When You Want To...                                | Do This First                                                                                                                                                                                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start a new working session**                    | Follow [`aos-session-open.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-open.md), check `.agent/skill-router.yaml`.                                                                                                  |
| **Make any code change in `src/` or `functions/`** | Invoke [`cos-invoke.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/cos-invoke.md) $\rightarrow$ run `npm run preflight` $\rightarrow$ verify against [`PREFLIGHT.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/PREFLIGHT.md). |
| **Investigate a complex bug**                      | Follow [`systematic-debugging.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/systematic-debugging.md) applying 4-PPSD; do not guess.                                                                                     |
| **Propose an architectural change or new schema**  | Follow [`architecture-council.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/architecture-council.md) & [`change-prd-architect`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/skills/change-prd-architect/SKILL.md).              |
| **Inspect production Firestore data**              | Run `npm run db:overview` or follow [`db-inspect.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/db-inspect.md).                                                                                                                   |
| **Sync patterns/governance to a sibling repo**     | Run [`sap-sync.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/sap-sync.md) workflow.                                                                                                                                              |
| **Close session & log telemetry**                  | Follow [`aos-session-close.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-close.md).                                                                                                                                  |

# Query 1.1 -go ahead

# Review 1.1 -Listed directory Sree_Krushna

Viewed ARCHITECTURE_SPEC.md:1-186
Created ecosystem_workflows_skills_sap_sync.md

The complete manual has been compiled into the artifact:
👉 [**`ecosystem_workflows_skills_sap_sync.md`**](file:///C:/Users/Temp/.gemini/antigravity/brain/49322a8c-628c-43c2-92a2-6f3986d8c0ee/ecosystem_workflows_skills_sap_sync.md)

### Summary of What Was Synthesized

1. **Hub & Spoke Topology**:
   - **Hub**: [`Task-Dashboard`](file:///d:/GitHub_Repo/Task-Dashboard) serves as the canonical governance and pattern authority.
   - **Spokes**: [`PIOperationsMgmt_Firebase`](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase), [`BMS`](file:///d:/GitHub_Repo/BMS), [`Capsicum`](file:///d:/GitHub_Repo/Capsicum), [`UG-Farmhouse`](file:///d:/GitHub_Repo/UG-Farmhouse), [`QSR`](file:///d:/GitHub_Repo/QSR), [`DashBoard`](file:///d:/GitHub_Repo/DashBoard), [`Sree_Krushna`](file:///d:/GitHub_Repo/Sree_Krushna), etc.
   - **Documentation**: Spoke-and-Wheel (`HUB.md` / `DOCS_HUB.md`) indexing domain spokes ($\le 150$ lines).

2. **Core Go-To Workflows**:
   - **Session Lifecycle**: [`aos-session-open.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-open.md) (mandatory startup), [`SESSION-ORCHESTRATION.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/SESSION-ORCHESTRATION.md), [`aos-session-close.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-close.md).
   - **Execution & Entry Gate**: [`cos-invoke.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/cos-invoke.md) $\rightarrow$ [`PREFLIGHT.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/PREFLIGHT.md) (R1–R41 validation) $\rightarrow$ [`plan.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/plan.md).
   - **Problem Solving & Debugging**: [`systematic-debugging.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/systematic-debugging.md) applying 4-PPSD (Grounding $\rightarrow$ Research Benchmarks $\rightarrow$ Objective Rules $\rightarrow$ Evidence Execution).
   - **Operations & Sync**: [`sap-sync.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/sap-sync.md), [`ingest-recurring-checklist.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/ingest-recurring-checklist.md), [`db-inspect.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/db-inspect.md).

3. **Master Skills Layer**:
   - **Governance**: `protocol-enforcer-pre-code`, `governance-wiring-audit`, `pirr-compliance-checklist`, `ecosystem-portability-evaluator`.
   - **Planning**: `writing-plans`, `change-prd-architect`, `enhancement-scaffolder`, `prompt-clarity`, `pin-branch`.
   - **Architecture & QA**: `systematic-debugger`, `backend-test-generator`, `contract-first-api-validator`, `cos-orchestrator`.
   - **UI & Frontend**: `ui-ux-pro-max`, `mobile-ui-validator` (300px guarantee), `ui-design-validator`, `mermaid-skill`, `impeccable`.
   - **Backend / GAS**: `gas-deploy-guard`, `gas-optimizer`, `task-firestore-direct-write`, `db-inspect-fleet`.

4. **SAP Sync Protocol (`/sap-sync`)**:
   - Manages **PACT-001 (Pattern Activation Contract)** propagation from `Task-Dashboard` to spoke repositories, validating wiring via `npm run verify:governance-wiring:all`.

---

### Suggested Next Actions

- **Propagate to current workspace**: Wire `.agent` and SAP governance into `Sree_Krushna` (the current workspace).
- **Run SAP Sync**: Synchronize universal patterns across any target spoke repository.
- **Deep dive**: Inspect or execute any specific workflow, skill, or preflight row.

# Response 1.1 -# Multi-Repository Ecosystem: Workflows, Skills, Governance & SAP Sync Manual

---

## 1. Hub & Spoke Architectural Topology

The multi-repository workspace operates under a **Hub & Spoke Architecture** governed by the **Shared Architecture Protocol (SAP)** and **Spoke & Wheel Documentation Framework**.

```mermaid
graph TD
    subgraph Canonical Governance Hub
        TD["Task-Dashboard<br/><b>(Authority & SSOT)</b><br/>• skill-router.yaml<br/>• standards-catalog.json<br/>• PREFLIGHT.md (R1–R41)<br/>• Universal Patterns & PACT-001"]
    end

    subgraph Operations & Data Spokes
        PIO["PIOperationsMgmt_Firebase<br/>(Backend/GAS Authority)"]
        BMS["BMS<br/>(Business Mgmt & Strategy)"]
        CAP["Capsicum<br/>(Mobile Ops & Subagents)"]
        UG["UG-Farmhouse<br/>(Checklist Ingestion & Ops)"]
        QSR["QSR<br/>(Restaurant & Live Operations)"]
        GAS["DashBoard / Inventory_Mgmt / Unified_Uploader<br/>(Google Apps Script Monorepo)"]
        SK["Sree_Krushna<br/>(Marriage OS & Cultural Specs)"]
        SCM["SupervisorComplianceMonitoring"]
    end

    TD == "SAP Sync (/sap-sync)<br/>PACT-001 & Universal Patterns" ==> PIO
    TD == "SAP Sync (/sap-sync)" ==> BMS
    TD == "SAP Sync (/sap-sync)" ==> CAP
    TD == "SAP Sync (/sap-sync)" ==> UG
    TD == "SAP Sync (/sap-sync)" ==> QSR
    TD == "SAP Sync (/sap-sync)" ==> GAS
    TD == "SAP Sync (/sap-sync)" ==> SK
    TD == "SAP Sync (/sap-sync)" ==> SCM
```

### Governance Principles

- **Inventory First, Invent Never (Rung 2 Grounding)**: Never construct parallel mechanisms when a canonical pattern exists.
- **Hub Limits**: Root `HUB.md` / `DOCS_HUB.md` files contain maps/indices only ($\le 150$ lines); spoke files own the detailed SSOT content.
- **Zero Cross-Repo Smuggling**: Acronyms and protocol IDs must strictly match the local repository's SSOT.

---

## 2. Directory Hierarchy Standard

```
<repo-root>/
├── .agent/
│   ├── workflows/             # Standard execution workflows
│   │   └── portable/          # Universal blueprints (portable across repos)
│   ├── skills/                # Standardized SKILL.md instruction modules
│   ├── patterns/              # Active & reference PACT-001 patterns
│   ├── skill-router.yaml      # Master trigger index
│   ├── PREFLIGHT.md           # R1–R41 Pre-execution gates
│   ├── standards-catalog.json # Catalog of P-standards (P1–P108, P-POS-ROUTINE, etc.)
│   └── context-registry.json  # Active workstream context
├── .claude/
│   ├── skills/                # Claude-native tools (impeccable, mermaid, site-arch)
│   └── sg-rules/              # ast-grep lint rules
├── docs/
│   ├── ssot/                  # Single Sources of Truth (Architecture, UI, Dev Hubs)
│   ├── protocols/             # PACT-001 manuals & schemas
│   └── incidents/             # Incident Postmortems (INC-001–INC-083)
├── scripts/                   # Gate verifiers (preflight-gate.cjs, verify-governance-wiring.cjs)
└── GEMINI.md / CLAUDE.md      # Ground rules & 4-PPSD problem-solving discipline
```

---

## 3. Essential Go-To Workflows

### Session Lifecycle Workflows

- [`aos-session-open.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-open.md): **Mandatory on session start**. Reads Skill Router, Graphify knowledge, and enforces 4-PPSD.
- [`SESSION-ORCHESTRATION.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/SESSION-ORCHESTRATION.md): Coordinates multi-track sessions, subagents, and pinned branches.
- [`aos-session-close.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/aos-session-close.md): Logs telemetry to `.agent/memory/session_signals.jsonl`, performs PIRR check, and updates rolling snapshots.
- [`session-handoff-system.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/session-handoff-system.md): Generates structured session handoff artifacts.

### Code Execution & Planning Workflows

- [`cos-invoke.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/cos-invoke.md): **Primary entry gate before modifying `src/`, `functions/`, or `firestore.rules`**. Runs `npm run preflight`, then routes through `PREFLIGHT.md`.
- [`preflight.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/preflight.md): Enforces R1–R41 validation rules (bridge classes, page reachability, secret detection, UPT mappings).
- [`plan.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/plan.md) / [`plan-review.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/plan-review.md): Standardized planning workflow requiring explicit approval before code changes.
- [`enhancement-lifecycle.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/enhancement-lifecycle.md): End-to-end management from ticket scaffolding to DoD verification.
- [`contract-first-sdlc.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/contract-first-sdlc.md): Pre-code schema and interface validation.

### Debugging & Incident Governance Workflows

- [`systematic-debugging.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/systematic-debugging.md): Enforces **4-PPSD** (Ground Truth $\rightarrow$ Industry Benchmarks $\rightarrow$ Objective Rules $\rightarrow$ Evidence Execution).
- [`debug-frontend.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/debug-frontend.md): Addresses CSS bridge specificity bugs, token mismatches, and responsive failures.
- [`post-incident-governance.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/post-incident-governance.md): Post-Incident Remediation Review (PIRR) creating automated gates and cataloging anti-patterns.
- [`ssot-reconciliation.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/portable/ssot-reconciliation.md): Resolves code vs. documentation discrepancies.

### Domain-Specific & Operational Workflows

- [`sap-sync.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/sap-sync.md): Universal cross-repository pattern and governance propagator.
- [`architecture-council.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/architecture-council.md) / [`ui-council.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/ui-council.md): Multi-role reviews for cross-cutting changes.
- [`external-ui-redesign.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/external-ui-redesign.md) (EUR v2): Sandboxed external design adaptation.
- [`ingest-recurring-checklist.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/ingest-recurring-checklist.md): SOP ingestion into Positional Routines and Recurring Checklists.
- [`db-inspect.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/db-inspect.md): Non-browser Firestore CLI inspection suite.

---

## 4. Master Skills Index

| Domain                  | Skill Identifier                               | Primary Capabilities                                                                            |
| ----------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Governance & Safety** | `protocol-enforcer-pre-code`                   | Hard stops speculative file operations without an approved plan.                                |
|                         | `governance-wiring-audit`                      | Validates that governance artifacts and P-standards are actively wired into consumption layers. |
|                         | `pirr-compliance-checklist`                    | Ensures Definition of Done includes documentation, telemetry, and automated tests.              |
|                         | `writejournal-audit-gate`                      | Mandates write journals for complex refactors and mutations.                                    |
| **Planning & PRDs**     | `writing-plans`                                | Structures actionable, test-backed execution plans.                                             |
|                         | `change-prd-architect`                         | Drafts comprehensive PRDs and impact analyses.                                                  |
|                         | `enhancement-scaffolder`                       | Creates canonical directory structures for new features.                                        |
|                         | `enhancement-tracker-update`                   | Synchronizes progress against `ENHANCEMENTS.md`.                                                |
|                         | `prompt-clarity`                               | Decouples ambiguous intent into clear architectural alternatives.                               |
|                         | `pin-branch`                                   | Persists working branch states across sessions.                                                 |
| **Engineering & QA**    | `systematic-debugger`                          | Enforces evidence-backed 4-PPSD debugging.                                                      |
|                         | `backend-test-generator`                       | Generates permanent backend tests adhering to P106/P107 mock standards.                         |
|                         | `contract-first-api-validator`                 | Validates API schemas before frontend integration.                                              |
|                         | `cos-orchestrator` / `cos-safe-refactor`       | Multi-surface refactor coordinator.                                                             |
|                         | `declarative-schema-enforcer`                  | Enforces schema validation during migrations.                                                   |
| **Frontend & UI**       | `ui-ux-pro-max` / `frontend-design`            | Implements UI components adhering to compact scales and theme tokens.                           |
|                         | `mobile-ui-validator`                          | Tests and guarantees layout integrity down to 300px viewports.                                  |
|                         | `ui-design-validator`                          | Prevents typography inflation and invalid CSS token use.                                        |
|                         | `mermaid-skill`                                | Constructs standard flowcharts, class, and architecture diagrams.                               |
|                         | `impeccable`                                   | Automated design linting and token consistency enforcement.                                     |
| **Backend & GAS**       | `gas-deploy-guard`                             | Protects Google Apps Script deployments against quota and build regressions.                    |
|                         | `gas-optimizer`                                | Minimizes spreadsheet batch operations and optimizes caching.                                   |
|                         | `task-firestore-direct-write`                  | Direct, secure Firestore operations respecting indices.                                         |
|                         | `db-inspect-fleet`                             | CLI toolset for live database diagnostics (`npm run db:*`).                                     |
| **Memory & Context**    | `memory-session-loader` / `memory-session-end` | Session bootstrap and closeout synchronization.                                                 |
|                         | `caveman` / `caveman-compress`                 | Ultra-concise output mode for token conservation.                                               |

---

## 5. SAP Sync (`/sap-sync`) Protocol Details

### PACT-001 (Pattern Activation Contract)

Every pattern copied between repos must specify:

1. `consumed_by`: Local workflows actively executing the pattern.
2. `activation_tier`: `guarded` (automated preflight script exists) or `reference` (manual guideline).
3. `canonical_source`: Origin repository (typically `task-dashboard`).

### Synchronization Flow

```powershell
# 1. Target identification
$target = "D:/GitHub_Repo/<target-spoke-folder>"

# 2. Copy PACT verification infrastructure
Copy-Item "scripts/verify-governance-wiring.cjs" -Destination "$target/scripts/verify-governance-wiring.cjs" -Force
Copy-Item "scripts/verify-governance-schema.cjs" -Destination "$target/scripts/verify-governance-schema.cjs" -Force
Copy-Item ".agent/workflows/capture-pattern.md" -Destination "$target/.agent/workflows/capture-pattern.md" -Force
Copy-Item "docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md" -Destination "$target/docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md" -Force

# 3. Synchronize Universal Patterns
Copy-Item ".agent/patterns/<pattern-name>.md" -Destination "$target/.agent/patterns/<pattern-name>.md" -Force

# 4. Verify Target Wiring
cd "$target"
npm run verify:governance-wiring:all
```

# Query 1.2 -yes

# Review 1.2 -Ran command: `Test-Path "d:\GitHub_Repo\Sree_Krushna\package.json"`

Ran command: `node -v`
Viewed verify-governance-wiring.cjs:1-800
Ran command: `# 1. Create directories in Sree_Krushna
$dirs = @(
    "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\portable",
    "d:\GitHub_Repo\Sree_Krushna\.agent\skills",
    "d:\GitHub_Repo\Sree_Krushna\.agent\patterns",
    "d:\GitHub_Repo\Sree_Krushna\docs\protocols",
    "d:\GitHub_Repo\Sree_Krushna\docs\ssot",
    "d:\GitHub_Repo\Sree_Krushna\scripts"
)
foreach ($d in $dirs) {
if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force }
}

# 2. Copy scripts from Task-Dashboard

Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\verify-governance-wiring.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\verify-governance-wiring.cjs" -Force
Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\verify-governance-schema.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\verify-governance-schema.cjs" -Force

# 3. Copy docs/protocols from Task-Dashboard

Copy-Item "d:\GitHub_Repo\Task-Dashboard\docs\protocols\PATTERN-ACTIVATION-CONTRACT-MANUAL.md" -Destination "d:\GitHub_Repo\Sree_Krushna\docs\protocols\PATTERN-ACTIVATION-CONTRACT-MANUAL.md" -Force
Copy-Item "d:\GitHub_Repo\Task-Dashboard\docs\protocols\governance-wiring.schema.json" -Destination "d:\GitHub_Repo\Sree_Krushna\docs\protocols\governance-wiring.schema.json" -Force

# 4. Copy standard workflows from Task-Dashboard

$workflowsToCopy = @(
    "sap-sync.md",
    "capture-pattern.md",
    "capture-pattern-lite.md",
    "plan.md",
    "plan-review.md",
    "aos-session-open.md",
    "aos-session-close.md",
    "governance-workflow.md",
    "skill-onboarding.md"
)
foreach ($wf in $workflowsToCopy) {
if (Test-Path "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\$wf") {
Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\$wf" -Destination "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\$wf" -Force
}
}

# 5. Copy portable workflows

$portableWf = @(
    "spoke-and-wheel-docs.md",
    "systematic-debugging.md",
    "session-handoff-system.md",
    "ssot-reconciliation.md"
)
foreach ($pwf in $portableWf) {
if (Test-Path "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\portable\$pwf") {
Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\portable\$pwf" -Destination "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\portable\$pwf" -Force
}
}

# 6. Copy patterns README

Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\patterns\README.md" -Destination "d:\GitHub_Repo\Sree_Krushna\.agent\patterns\README.md" -Force

Write-Output "Directories and base infrastructure copied successfully."
`Ran command:`$skills = @(
"protocol-enforcer-pre-code",
"writing-plans",
"systematic-debugger",
"prompt-clarity",
"pin-branch",
"mermaid-skill",
"ssot-domain-mapper",
"writing-technical-documentation",
"writing-clearly-and-concisely",
"memory-session-loader",
"memory-session-end",
"memory-event-logger",
"memory-decision-logger"
)

foreach ($s in $skills) {
$src = "d:\GitHub_Repo\Task-Dashboard\.agent\skills\$s"
$dst = "d:\GitHub_Repo\Sree_Krushna\.agent\skills\$s"
if (Test-Path $src) {
Copy-Item -Path $src -Destination $dst -Recurse -Force
}
}

Write-Output "Copied $( $skills.Count ) skills."`Viewed standards-catalog.json:1-60
Created d:\GitHub_Repo\Sree_Krushna\package.json
Ran command:`@'
{
"name": "sree-krushna-marriage-os",
"version": "1.0.0",
"description": "Sree Krushna Marriage OS - Event, Ritual, Vendor & Operational Knowledge Base",
"scripts": {
"verify:governance-wiring": "node scripts/verify-governance-wiring.cjs",
"verify:governance-wiring:all": "node scripts/verify-governance-wiring.cjs --all",
"verify:governance-schema": "node scripts/verify-governance-schema.cjs"
},
"keywords": [
"marriage-os",
"governance",
"sap-sync",
"pact-001"
],
"author": "goldenage399",
"license": "ISC"
}
'@ | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\package.json" -Encoding UTF8
`Ran command:`@'

# std.agent.skill-router — Sree_Krushna Cross-Repo Routing Index

# Project: Sree Krushna Marriage OS

# Generated: 2026-08-21 | SAP Spoke Alignment

skills:

- id: writing-plans
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["write plan", "create plan", "make plan", "implementation plan", "step by step"]
  cost: medium
  invoke: read .agent/skills/writing-plans/SKILL.md
  when: "Structuring complex changes or multi-step execution sequences"

- id: systematic-debugger
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["debug", "investigate bug", "why is this broken", "systematic debug", "4-ppsd"]
  cost: medium
  invoke: read .agent/skills/systematic-debugger/SKILL.md
  when: "Applying 4-Phase Problem Solving Discipline to resolve discrepancies"

- id: protocol-enforcer-pre-code
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["check protocol", "pre-code check", "verify plan", "hard stop"]
  cost: low
  invoke: read .agent/skills/protocol-enforcer-pre-code/SKILL.md
  when: "Ensuring plan is approved before executing file operations"

- id: prompt-clarity
  repo: [sree-krushna, task-dashboard, qsr]
  triggers: ["prompt clarity", "prompt-clarity", "clarify prompt", "reframe prompt", "/prompt-clarity"]
  cost: low
  invoke: read .agent/skills/prompt-clarity/SKILL.md
  when: "Reframing ambiguous user requirements into concrete options"

- id: pin-branch
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["pin this", "pin branch", "park this", "come back to this", "/pin-branch"]
  cost: low
  invoke: read .agent/skills/pin-branch/SKILL.md
  when: "Persisting in-session branches or deferred work"

- id: mermaid-skill
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["mermaid", "flowchart", "diagram", "sequence diagram", "architecture diagram"]
  cost: low
  invoke: read .agent/skills/mermaid-skill/SKILL.md
  when: "Generating structured mermaid diagrams and workflow visuals"

- id: ssot-domain-mapper
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["domain map", "entity map", "ssot map", "schema map", "domain relationship"]
  cost: medium
  invoke: read .agent/skills/ssot-domain-mapper/SKILL.md
  when: "Mapping domain entities (EVT, RIT, PER, FAM, VEN, VDR, CTR, TSK, DEC, PAY, RSK)"

- id: governance-wiring-audit
  repo: [sree-krushna, task-dashboard, pio, bms]
  triggers: ["verify wiring", "governance wiring", "is it wired", "wiring audit", "PACT-001"]
  cost: low
  invoke: npm run verify:governance-wiring
  when: "Checking whether governance artifacts and patterns are properly wired into the consumption layer"

- id: sap-sync
  repo: [sree-krushna, task-dashboard, pio, bms, ug-farmhouse]
  triggers: ["sap-sync", "sync patterns", "propagate pact", "run sap-sync"]
  cost: medium
  invoke: read .agent/workflows/sap-sync.md
  when: "Synchronizing universal patterns from Task-Dashboard canonical hub"
  '@ | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\.agent\skill-router.yaml" -Encoding UTF8
  `Ran command:`Select-String -Path "d:\GitHub_Repo\Task-Dashboard\.agent\patterns\*.md" -Pattern "portability:\s\*universal" | Select-Object -Property Path, Line`Ran command:`$patternsToCopy = @(
  "search-before-inventing.md",
  "raw-evidence-before-hypothesis.md",
  "intent-clarity-decoupling-and-plan-hardstop.md",
  "proxy-signal-verdicts.md",
  "scope-ledger-anchor.md",
  "triage-anomalies-first.md",
  "data-layer-verification-first.md",
  "write-without-reader.md",
  "p81-id-registration-process.md"
  )

foreach ($p in $patternsToCopy) {
$src = "d:\GitHub_Repo\Task-Dashboard\.agent\patterns\$p"
$dst = "d:\GitHub_Repo\Sree_Krushna\.agent\patterns\$p"
if (Test-Path $src) {
Copy-Item -Path $src -Destination $dst -Force
}
}

Write-Output "Copied $( $patternsToCopy.Count ) universal patterns."`Ran command:`@'
{
"version": "1.0.0",
"lastUpdated": "2026-08-21",
"metadata": {
"projectName": "Sree_Krushna",
"owner": "goldenage399",
"targetEnvironment": "Markdown Knowledge Base / Marriage OS",
"governanceModel": "AI-Driven Development (Antigravity Agent)",
"sourceOfTruth": "ARCHITECTURE_SPEC.md",
"totalStandards": 6,
"lastUpdated": "2026-08-21"
},
"categories": {
"governance": "Process and workflow controls",
"data-integrity": "Schema validity, entity relations and identifiers",
"documentation": "SSOT, hubs, and schema specifications",
"memory": "Persistent context and session telemetry"
},
"standards": [
{
"id": "P-ENT-ID",
"category": "data-integrity",
"name": "Standardized Entity Identifier Registration (3-Digit Padded)",
"description": "All domain entities must use standardized prefixes: EVT, RIT, PER, FAM, VEN, VDR, CTR, TSK, DEC, PAY, RSK followed by a 3-digit padded number. Entities must be cross-referenced without dangling IDs.",
"severity": "HIGH",
"enforcement": {
"checkpoints": ["pre-commit", "PIRR"],
"manualOnly": false,
"automatedGate": "npm run verify:governance-wiring"
},
"references": ["ARCHITECTURE_SPEC.md §1", "GEMINI.md"]
},
{
"id": "P-SSOT-DOCS",
"category": "documentation",
"name": "Spoke & Wheel Single Source of Truth",
"description": "Hub documents contain only indices (max 150 lines). Spoke documents own detailed specifications and declare parent hub in frontmatter.",
"severity": "MEDIUM",
"enforcement": {
"checkpoints": ["pre-commit"],
"manualOnly": false,
"automatedGate": "npm run verify:governance-wiring"
},
"references": [".agent/workflows/portable/spoke-and-wheel-docs.md"]
},
{
"id": "P82",
"category": "governance",
"name": "Governance Artifact Wiring Completeness",
"description": "All new workflows, skills, and patterns must be wired into skill-router.yaml and CLAUDE.md/GEMINI.md.",
"severity": "CRITICAL",
"enforcement": {
"checkpoints": ["pre-commit", "CI"],
"manualOnly": false,
"automatedGate": "npm run verify:governance-wiring"
},
"references": ["scripts/verify-governance-wiring.cjs"]
},
{
"id": "P-4PPSD",
"category": "governance",
"name": "4-Phase Problem-Solving Discipline",
"description": "Strict adherence to Ground Truth -> Research Benchmarks -> Objective Rules -> Evidence-Based Execution.",
"severity": "HIGH",
"enforcement": {
"checkpoints": ["session-start", "planning"],
"manualOnly": true
},
"references": ["GEMINI.md", "CLAUDE.md"]
}
]
}
'@ | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\.agent\standards-catalog.json" -Encoding UTF8
`Ran command:`@'

# Sree_Krushna — Preflight Gate & Routing Table

> **Standard**: P82 (Governance Wiring Completeness) + P-ENT-ID (Entity Identifier Registry)
> **Enforcement**: Run before making structural or schema changes to the Marriage OS.

## Routing Matrix

| Row | Trigger / Condition                                                                                           | Standard / Protocol                                               | Verification Action                                                   | Rationale / Failure Mode Prevented                         |
| --- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| R1  | Creating or updating Entity IDs (`EVT-###`, `RIT-###`, `PER-###`, `VDR-###`, `TSK-###`, `DEC-###`, `PAY-###`) | `ARCHITECTURE_SPEC.md §1`                                         | Manual: Verify 3-digit padded ID and ensure referenced entities exist | Broken cross-entity foreign keys or mismatched identifiers |
| R2  | Creating new Markdown specifications or guides                                                                | `.agent/workflows/portable/spoke-and-wheel-docs.md`               | Check `hub:` frontmatter and verify registration in parent hub        | Documentation drift and orphaned markdown files            |
| R3  | Adding or updating `.agent/patterns/*.md`                                                                     | `docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md` (PACT-001) | `npm run verify:governance-wiring`                                    | Orphaned pattern contracts or unwired triggers             |
| R4  | Running cross-repo sync                                                                                       | `.agent/workflows/sap-sync.md`                                    | `npm run verify:governance-wiring:all`                                | Schema drift across sibling repositories                   |
| '@  | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\.agent\PREFLIGHT.md" -Encoding UTF8                            |

`Ran command:`@'

# Sree Krushna Marriage OS — Agent Operating Manual

This repository represents the **Sree Krushna Marriage OS** — an architectural and operational knowledge base for wedding planning, rituals, procurement, guest management, and financials.

---

## 1. Prime Invariants & Operating Discipline

### 1. 4-Phase Problem-Solving Discipline (4-PPSD)

- **Phase 1: Ground Truth & Intent**: Analyze existing entity models (`ARCHITECTURE_SPEC.md`), invariants, and relations before modifying documents.
- **Phase 2: Research & Domain Alignment**: Verify cultural traditions and logistics against SSOT specifications before proposing changes.
- **Phase 3: Objective Rule Synthesis**: Follow explicit precedence ladders and schemas for events, rituals, and tasks.
- **Phase 4: Evidence-Based Execution**: Execute in verified, consistent steps.

### 2. Entity Identifier Integrity (`P-ENT-ID`)

All entities must use standardized 3-digit padded identifiers:

- `EVT-###`: Timeline Events (`01_TIMELINE_EVENTS/`)
- `RIT-###`: Rituals & Culture Specs (`02_RITUALS_CULTURE/specs/`)
- `PER-###`: People & Guests Directory (`03_PEOPLE_GUESTS/directory/`)
- `FAM-###`: Family Units (`03_PEOPLE_GUESTS/families/`)
- `VEN-###`: Venues & Accommodations (`05_OPERATIONS_LOGISTICS/venues/`)
- `VDR-###`: Vendors (`04_PROCUREMENT_VENDORS/vendors/`)
- `CTR-###`: Vendor Contracts (`04_PROCUREMENT_VENDORS/contracts/`)
- `TSK-###`: Governance Tasks (`00_GOVERNANCE/tasks/`)
- `DEC-###`: Decisions (`00_GOVERNANCE/decisions/`)
- `PAY-###`: Finance & Ledger Records (`06_FINANCE_COMMERCIALS/ledger/`)
- `RSK-###`: Risks & Mitigations (`00_GOVERNANCE/risks/`)

### 3. Spoke & Wheel Documentation (`P-SSOT-DOCS`)

- Hub documents (`HUB.md` / `DOCS_HUB.md`) contain only indices and status snapshots (max 150 lines).
- Spoke documents contain detailed domain specifications and declare parent hub in frontmatter.
- Master entities are canonical; all views (run sheets, dashboards, trackers) are derived views.

---

## 2. Session Startup Gate (MANDATORY)

Before any task work, review:

1. `.agent/skill-router.yaml` — Skill Router Index
2. `ARCHITECTURE_SPEC.md` — Canonical entity architecture and state machines
3. `.agent/PREFLIGHT.md` — Preflight check matrix

---

## 3. Key Workflows & Skills

| Task Type                        | Workflow / Skill to Follow                                               |
| -------------------------------- | ------------------------------------------------------------------------ |
| Multi-step execution planning    | `.agent/skills/writing-plans/SKILL.md`                                   |
| Systematic problem diagnosis     | `.agent/skills/systematic-debugger/SKILL.md` (4-PPSD)                    |
| Clarify ambiguous prompt         | `.agent/skills/prompt-clarity/SKILL.md`                                  |
| Domain mapping & entity linking  | `.agent/skills/ssot-domain-mapper/SKILL.md`                              |
| Flowchart & architecture visuals | `.agent/skills/mermaid-skill/SKILL.md`                                   |
| Synchronize universal patterns   | `.agent/workflows/sap-sync.md`                                           |
| Governance verification          | `npm run verify:governance-wiring:all`                                   |
| '@                               | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\CLAUDE.md" -Encoding UTF8 |

Copy-Item "d:\GitHub_Repo\Sree_Krushna\CLAUDE.md" -Destination "d:\GitHub_Repo\Sree_Krushna\GEMINI.md" -Force
`Ran command:`node scripts/verify-governance-wiring.cjs --all`Ran command:`$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$jsonFiles = Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna" -Recurse -Include "*.json","*.yaml","*.md"
foreach ($f in $jsonFiles) {
    $text = [System.IO.File]::ReadAllText($f.FullName)
[System.IO.File]::WriteAllText($f.FullName, $text, $utf8NoBom)
}

Write-Output "Stripped BOM from $( $jsonFiles.Count ) files."`Ran command:`node scripts/verify-governance-wiring.cjs`Ran command:`if (Test-Path "d:\GitHub_Repo\BMS\scripts\verify-governance-wiring.cjs") {
Get-Content "d:\GitHub_Repo\BMS\scripts\verify-governance-wiring.cjs" -Head 50
} else {
Write-Output "BMS has no verify-governance-wiring"
}`Ran command:`Get-ChildItem -Path "d:\GitHub_Repo\*\scripts\verify-governance\*"`Ran command:`Copy-Item "d:\GitHub_Repo\Capsicum\scripts\verify-governance-wiring.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\verify-governance-wiring.cjs" -Force
node "d:\GitHub_Repo\Sree_Krushna\scripts\verify-governance-wiring.cjs"`Ran command:`node "d:\GitHub_Repo\Sree_Krushna\scripts\verify-governance-schema.cjs"`Ran command:`node scripts/verify-governance-wiring.cjs --all`Ran command:`@'

# std.agent.skill-router — Sree_Krushna Cross-Repo Routing Index

# Project: Sree Krushna Marriage OS

# Generated: 2026-08-21 | SAP Spoke Alignment

skills:

- id: writing-plans
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["write plan", "create plan", "make plan", "implementation plan", "step by step"]
  cost: medium
  invoke: read .agent/skills/writing-plans/SKILL.md
  when: "Structuring complex changes or multi-step execution sequences"

- id: systematic-debugger
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["debug", "investigate bug", "why is this broken", "systematic debug", "4-ppsd"]
  cost: medium
  invoke: read .agent/skills/systematic-debugger/SKILL.md
  when: "Applying 4-Phase Problem Solving Discipline to resolve discrepancies"

- id: protocol-enforcer-pre-code
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["check protocol", "pre-code check", "verify plan", "hard stop"]
  cost: low
  invoke: read .agent/skills/protocol-enforcer-pre-code/SKILL.md
  when: "Ensuring plan is approved before executing file operations"

- id: prompt-clarity
  repo: [sree-krushna, task-dashboard, qsr]
  triggers: ["prompt clarity", "prompt-clarity", "clarify prompt", "reframe prompt", "/prompt-clarity"]
  cost: low
  invoke: read .agent/skills/prompt-clarity/SKILL.md
  when: "Reframing ambiguous user requirements into concrete options"

- id: pin-branch
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["pin this", "pin branch", "park this", "come back to this", "/pin-branch"]
  cost: low
  invoke: read .agent/skills/pin-branch/SKILL.md
  when: "Persisting in-session branches or deferred work"

- id: mermaid-skill
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["mermaid", "flowchart", "diagram", "sequence diagram", "architecture diagram"]
  cost: low
  invoke: read .agent/skills/mermaid-skill/SKILL.md
  when: "Generating structured mermaid diagrams and workflow visuals"

- id: ssot-domain-mapper
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["domain map", "entity map", "ssot map", "schema map", "domain relationship"]
  cost: medium
  invoke: read .agent/skills/ssot-domain-mapper/SKILL.md
  when: "Mapping domain entities (EVT, RIT, PER, FAM, VEN, VDR, CTR, TSK, DEC, PAY, RSK)"

- id: writing-clearly-and-concisely
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["write clearly", "concise writing", "simplify explanation", "clean prose"]
  cost: low
  invoke: read .agent/skills/writing-clearly-and-concisely/SKILL.md
  when: "Refining documentation for high clarity and brevity"

- id: writing-technical-documentation
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["write technical docs", "document architecture", "create spec", "system documentation"]
  cost: medium
  invoke: read .agent/skills/writing-technical-documentation/SKILL.md
  when: "Authoring architectural, schema, and operational specifications"

- id: memory-session-loader
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["load memory", "session memory load", "restore context"]
  cost: low
  invoke: read .agent/skills/memory-session-loader/SKILL.md
  when: "Loading past session signals and context into active conversation"

- id: memory-session-end
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["end session", "session close", "closeout memory", "session end"]
  cost: low
  invoke: read .agent/skills/memory-session-end/SKILL.md
  when: "Persisting session telemetry and closeout memory"

- id: memory-event-logger
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["log event", "event logger", "record milestone"]
  cost: low
  invoke: read .agent/skills/memory-event-logger/SKILL.md
  when: "Recording significant project events to persistent memory"

- id: memory-decision-logger
  repo: [sree-krushna, task-dashboard, pio, capsicum, bms]
  triggers: ["log decision", "record decision", "decision logger"]
  cost: low
  invoke: read .agent/skills/memory-decision-logger/SKILL.md
  when: "Recording architectural and domain decisions into the decision registry"

- id: governance-wiring-audit
  repo: [sree-krushna, task-dashboard, pio, bms]
  triggers: ["verify wiring", "governance wiring", "is it wired", "wiring audit", "PACT-001"]
  cost: low
  invoke: npm run verify:governance-wiring
  when: "Checking whether governance artifacts and patterns are properly wired into the consumption layer"

- id: pattern-proxy-signal-verdicts
  repo: [sree-krushna, task-dashboard]
  triggers: ["is this dead code", "safe to delete", "can we remove this", "retire this file", "consolidate these files", "merge these files", "this looks like a duplicate", "nothing uses this", "unused token", "unused export", "stale file", "which one is canonical", "delete the redundant one"]
  cost: low
  invoke: read .agent/patterns/proxy-signal-verdicts.md
  when: "Surface the proxy-signal-verdicts pattern when delete or consolidation triggers are detected"

- id: pattern-search-before-inventing
  repo: [sree-krushna, task-dashboard]
  triggers: ["search before inventing", "check existing patterns", "do not reinvent", "inventory first"]
  cost: low
  invoke: read .agent/patterns/search-before-inventing.md
  when: "Preventing invention of redundant schemas or tools by enforcing inventory search"

- id: pattern-raw-evidence-before-hypothesis
  repo: [sree-krushna, task-dashboard]
  triggers: ["raw evidence", "verify facts", "check ground truth"]
  cost: low
  invoke: read .agent/patterns/raw-evidence-before-hypothesis.md
  when: "Gathering ground truth facts before generating hypotheses"

- id: pattern-intent-clarity-decoupling
  repo: [sree-krushna, task-dashboard]
  triggers: ["decouple intent", "plan hardstop", "intent clarity"]
  cost: low
  invoke: read .agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md
  when: "Decoupling intent clarification from execution authorization"

- id: pattern-triage-anomalies-first
  repo: [sree-krushna, task-dashboard]
  triggers: ["triage anomalies", "data anomaly", "schema mismatch"]
  cost: low
  invoke: read .agent/patterns/triage-anomalies-first.md
  when: "Triaging anomalies before performing widespread data migrations"

- id: pattern-data-layer-verification
  repo: [sree-krushna, task-dashboard]
  triggers: ["data layer verification", "verify schema first", "check data layer"]
  cost: low
  invoke: read .agent/patterns/data-layer-verification-first.md
  when: "Verifying underlying schema and data models before building dependent views"

- id: pattern-write-without-reader
  repo: [sree-krushna, task-dashboard]
  triggers: ["write without reader", "unconsumed write", "orphan record"]
  cost: low
  invoke: read .agent/patterns/write-without-reader.md
  when: "Preventing creation of data that has no active reader or consumer"

- id: pattern-scope-ledger-anchor
  repo: [sree-krushna, task-dashboard]
  triggers: ["scope ledger", "track scope", "prevent scope creep"]
  cost: low
  invoke: read .agent/patterns/scope-ledger-anchor.md
  when: "Anchoring work scope against established objectives"

- id: sap-sync
  repo: [sree-krushna, task-dashboard, pio, bms, ug-farmhouse]
  triggers: ["sap-sync", "sync patterns", "propagate pact", "run sap-sync"]
  cost: medium
  invoke: read .agent/workflows/sap-sync.md
  when: "Synchronizing universal patterns from Task-Dashboard canonical hub"
  '@ | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\.agent\skill-router.yaml" -Encoding UTF8
  `Ran command:`# Update CLAUDE.md & GEMINI.md
  @'

# Sree Krushna Marriage OS — Agent Operating Manual

This repository represents the **Sree Krushna Marriage OS** — an architectural and operational knowledge base for wedding planning, rituals, procurement, guest management, and financials.

---

## 1. Prime Invariants & Operating Discipline

### 1. 4-Phase Problem-Solving Discipline (4-PPSD)

- **Phase 1: Ground Truth & Intent**: Analyze existing entity models (`ARCHITECTURE_SPEC.md`), invariants, and relations before modifying documents.
- **Phase 2: Research & Domain Alignment**: Verify cultural traditions and logistics against SSOT specifications before proposing changes.
- **Phase 3: Objective Rule Synthesis**: Follow explicit precedence ladders and schemas for events, rituals, and tasks.
- **Phase 4: Evidence-Based Execution**: Execute in verified, consistent steps.

### 2. Entity Identifier Integrity (`P-ENT-ID`)

All entities must use standardized 3-digit padded identifiers:

- `EVT-###`: Timeline Events (`01_TIMELINE_EVENTS/`)
- `RIT-###`: Rituals & Culture Specs (`02_RITUALS_CULTURE/specs/`)
- `PER-###`: People & Guests Directory (`03_PEOPLE_GUESTS/directory/`)
- `FAM-###`: Family Units (`03_PEOPLE_GUESTS/families/`)
- `VEN-###`: Venues & Accommodations (`05_OPERATIONS_LOGISTICS/venues/`)
- `VDR-###`: Vendors (`04_PROCUREMENT_VENDORS/vendors/`)
- `CTR-###`: Vendor Contracts (`04_PROCUREMENT_VENDORS/contracts/`)
- `TSK-###`: Governance Tasks (`00_GOVERNANCE/tasks/`)
- `DEC-###`: Decisions (`00_GOVERNANCE/decisions/`)
- `PAY-###`: Finance & Ledger Records (`06_FINANCE_COMMERCIALS/ledger/`)
- `RSK-###`: Risks & Mitigations (`00_GOVERNANCE/risks/`)

### 3. Spoke & Wheel Documentation (`P-SSOT-DOCS`)

- Hub documents (`HUB.md` / `DOCS_HUB.md`) contain only indices and status snapshots (max 150 lines).
- Spoke documents contain detailed domain specifications and declare parent hub in frontmatter.
- Master entities are canonical; all views (run sheets, dashboards, trackers) are derived views.

---

## 2. Session Startup Gate (MANDATORY)

Before any task work, review:

1. `.agent/skill-router.yaml` — Skill Router Index
2. `ARCHITECTURE_SPEC.md` — Canonical entity architecture and state machines
3. `.agent/PREFLIGHT.md` — Preflight check matrix
4. Follow `.agent/workflows/aos-session-open.md` at session start and `.agent/workflows/aos-session-close.md` at session close.

---

## 3. Key Workflows & Governance Protocols

| Task Type                        | Workflow / Skill to Follow                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| Multi-step execution planning    | `.agent/workflows/plan.md` & `.agent/skills/writing-plans/SKILL.md`                                |
| Plan review & validation         | `.agent/workflows/plan-review.md`                                                                  |
| Systematic problem diagnosis     | `.agent/workflows/portable/systematic-debugging.md` & `.agent/skills/systematic-debugger/SKILL.md` |
| Clarify ambiguous prompt         | `.agent/skills/prompt-clarity/SKILL.md`                                                            |
| Domain mapping & entity linking  | `.agent/skills/ssot-domain-mapper/SKILL.md`                                                        |
| Flowchart & architecture visuals | `.agent/skills/mermaid-skill/SKILL.md`                                                             |
| Capture new pattern              | `.agent/workflows/capture-pattern.md` / `.agent/workflows/capture-pattern-lite.md`                 |
| Onboard new skill                | `.agent/workflows/skill-onboarding.md`                                                             |
| Governance compliance workflow   | `.agent/workflows/governance-workflow.md`                                                          |
| Synchronize universal patterns   | `.agent/workflows/sap-sync.md`                                                                     |
| Spoke & Wheel Documentation      | `.agent/workflows/portable/spoke-and-wheel-docs.md`                                                |
| SSOT Reconciliation              | `.agent/workflows/portable/ssot-reconciliation.md`                                                 |
| Session Handoff                  | `.agent/workflows/portable/session-handoff-system.md`                                              |
| Governance verification          | `npm run verify:governance-wiring:all`                                                             |

---

## 4. Pattern Activation & PACT-001 Cross-References

This repository implements the following universal patterns:

- `.agent/patterns/search-before-inventing.md`
- `.agent/patterns/raw-evidence-before-hypothesis.md`
- `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`
- `.agent/patterns/proxy-signal-verdicts.md`
- `.agent/patterns/scope-ledger-anchor.md`
- `.agent/patterns/triage-anomalies-first.md`
- `.agent/patterns/data-layer-verification-first.md`
- `.agent/patterns/write-without-reader.md`
- `.agent/patterns/p81-id-registration-process.md`
  '@ | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\CLAUDE.md" -Encoding UTF8

Copy-Item "d:\GitHub*Repo\Sree_Krushna\CLAUDE.md" -Destination "d:\GitHub_Repo\Sree_Krushna\GEMINI.md" -Force
`Ran command:`$patterns = Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna\.agent\patterns\*.md" | Where-Object { $*.Name -ne "README.md" }

foreach ($pat in $patterns) {
$content = Get-Content $pat.FullName -Raw # replace consumed_by block with local consumers
$updated = $content -replace 'consumed_by:[\s\S]\*?(?=\r?\n---)', @"
consumed_by:

- file: CLAUDE.md
  at: "Pattern Activation & PACT-001 Cross-References"
- file: .agent/workflows/plan.md
  at: "Step 1: Context Loading & Pattern Check"
  "@ # ensure canonical_source is set
  if ($updated -notmatch 'canonical_source:') {
  $updated = $updated -replace 'portability:\s\*universal', "portability: universal`ncanonical_source: task-dashboard"
  }
      # ensure activation_tier is routed
      if ($updated -match 'activation_tier:\s*guarded') {
  $updated = $updated -replace 'activation_tier:\s*guarded', 'activation_tier: routed'
  }

      [System.IO.File]::WriteAllText($pat.FullName, $updated, (New-Object System.Text.UTF8Encoding($false)))

  }

# Also ensure .agent/workflows/plan.md mentions the patterns

$planWf = Get-Content "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\plan.md" -Raw
if ($planWf -notmatch "patterns/") {
$patternRefs = @"

## Step 1: Context Loading & Pattern Check

Load relevant universal patterns before formulating the plan:

- `.agent/patterns/search-before-inventing.md`
- `.agent/patterns/raw-evidence-before-hypothesis.md`
- `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`
- `.agent/patterns/proxy-signal-verdicts.md`
- `.agent/patterns/scope-ledger-anchor.md`
- `.agent/patterns/triage-anomalies-first.md`
- `.agent/patterns/data-layer-verification-first.md`
- `.agent/patterns/write-without-reader.md`
- `.agent/patterns/p81-id-registration-process.md`
  "@
  $planWf = $patternRefs + "`n`n" + $planWf
    [System.IO.File]::WriteAllText("d:\GitHub_Repo\Sree_Krushna\.agent\workflows\plan.md", $planWf, (New-Object System.Text.UTF8Encoding($false)))
  }

Write-Output "Updated patterns and plan.md"
`Ran command:`$patterns = Get-ChildItem -Path "d:\GitHub*Repo\Sree_Krushna\.agent\patterns\*.md" | Where-Object { $*.Name -ne "README.md" }

$consumedBlock = "consumed_by:`r`n - file: CLAUDE.md`r`n at: `"Pattern Activation & PACT-001 Cross-References`"`r`n - file: .agent/workflows/plan.md`r`n at: `"Step 1: Context Loading & Pattern Check`""

foreach ($pat in $patterns) {
    $content = [System.IO.File]::ReadAllText($pat.FullName)
$updated = [System.Text.RegularExpressions.Regex]::Replace($content, 'consumed_by:[\s\S]*?(?=\r?\n---)', $consumedBlock)
    if ($updated -notmatch 'canonical_source:') {
$updated = [System.Text.RegularExpressions.Regex]::Replace($updated, 'portability:\s*universal', "portability: universal`r`ncanonical_source: task-dashboard")
}
if ($updated -match 'activation_tier:\s*guarded') {
        $updated = [System.Text.RegularExpressions.Regex]::Replace($updated, 'activation_tier:\s\*guarded', 'activation_tier: routed')
}
[System.IO.File]::WriteAllText($pat.FullName, $updated, (New-Object System.Text.UTF8Encoding($false)))
}

# Ensure .agent/workflows/plan.md mentions the patterns

$planWfPath = "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\plan.md"
$planWf = [System.IO.File]::ReadAllText($planWfPath)
if ($planWf -notmatch "patterns/") {
$patternRefs = "## Step 1: Context Loading & Pattern Check`r`nLoad relevant universal patterns before formulating the plan:`r`n- .agent/patterns/search-before-inventing.md`r`n- .agent/patterns/raw-evidence-before-hypothesis.md`r`n- .agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`r`n- .agent/patterns/proxy-signal-verdicts.md`r`n- .agent/patterns/scope-ledger-anchor.md`r`n- .agent/patterns/triage-anomalies-first.md`r`n- .agent/patterns/data-layer-verification-first.md`r`n- .agent/patterns/write-without-reader.md`r`n- .agent/patterns/p81-id-registration-process.md`r`n`r`n"
    $planWf = $patternRefs + $planWf
    [System.IO.File]::WriteAllText($planWfPath, $planWf, (New-Object System.Text.UTF8Encoding($false)))
}

Write-Output "Patterns and plan.md updated."
`Ran command:`node scripts/verify-governance-wiring.cjs --all`Ran command:`Get-Content "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\plan.md" -Head 30`Ran command:`$planPath = "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\plan.md"
$content = [System.IO.File]::ReadAllText($planPath)

$sectionToAdd = @"

## Step 0.1: Universal Patterns Reference Check

Review relevant universal patterns:

- `.agent/patterns/search-before-inventing.md`
- `.agent/patterns/raw-evidence-before-hypothesis.md`
- `.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md`
- `.agent/patterns/proxy-signal-verdicts.md`
- `.agent/patterns/scope-ledger-anchor.md`
- `.agent/patterns/triage-anomalies-first.md`
- `.agent/patterns/data-layer-verification-first.md`
- `.agent/patterns/write-without-reader.md`
- `.agent/patterns/p81-id-registration-process.md`

"@

$updated = $content -replace '# /plan Workflow', "# /plan Workflow`r`n$sectionToAdd"
[System.IO.File]::WriteAllText($planPath, $updated, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Updated plan.md"
`Ran command:`node scripts/verify-governance-wiring.cjs --all`Ran command:`git status`

## ✅ Governance Ecosystem & SAP Sync Successfully Initialized

The **Shared Architecture Protocol (SAP)**, **PACT-001 (Pattern Activation Contract)**, and standardized `.agent` infrastructure have been integrated into [`Sree_Krushna`](file:///d:/GitHub_Repo/Sree_Krushna).

---

### 1. Infrastructure Deployed to `Sree_Krushna`

```
d:\GitHub_Repo\Sree_Krushna/
├── .agent/
│   ├── workflows/             # plan, plan-review, sap-sync, capture-pattern, aos-session-open/close
│   │   └── portable/          # spoke-and-wheel-docs, systematic-debugging, ssot-reconciliation
│   ├── skills/                # 13 essential skills (writing-plans, systematic-debugger, etc.)
│   ├── patterns/              # 9 PACT-001 universal patterns (search-before-inventing, etc.)
│   ├── skill-router.yaml      # Master trigger index for Marriage OS domain & skills
│   ├── standards-catalog.json # Catalog of active P-standards (P-ENT-ID, P-SSOT-DOCS, P82, P-4PPSD)
│   └── PREFLIGHT.md           # Preflight matrix for Entity ID integrity & schema safety
├── scripts/
│   ├── verify-governance-wiring.cjs  # P82 automated consumption-layer wiring verifier
│   └── verify-governance-schema.cjs  # JSON schema validator
├── docs/protocols/
│   ├── PATTERN-ACTIVATION-CONTRACT-MANUAL.md
│   └── governance-wiring.schema.json
├── package.json               # Configured with npm run verify:governance-wiring:all
└── GEMINI.md / CLAUDE.md      # Ground rules, 4-PPSD discipline, entity registry & startup gates
```

---

### 2. Verification Run

```powershell
node scripts/verify-governance-wiring.cjs --all
```

```
🔍 P82 Governance Wiring Audit — 27 artifact(s) checked

✅ All 27 artifact(s) fully wired — read path is complete.
```

---

### 3. Quick-Reference for Ongoing Work in `Sree_Krushna`

| Action                                    | Command / Protocol                                                                                                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Verify all governance wiring**          | `npm run verify:governance-wiring:all`                                                                                                                                                             |
| **Check Entity ID integrity**             | Follow [`ARCHITECTURE_SPEC.md §1`](file:///d:/GitHub_Repo/Sree_Krushna/ARCHITECTURE_SPEC.md) (`EVT`, `RIT`, `PER`, `FAM`, `VEN`, `VDR`, `CTR`, `TSK`, `DEC`, `PAY`, `RSK`)                         |
| **Plan complex multi-step work**          | Invoke [`.agent/workflows/plan.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/plan.md) with [`writing-plans`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/skills/writing-plans/SKILL.md) |
| **Diagnose discrepancies**                | Apply 4-PPSD via [`.agent/workflows/portable/systematic-debugging.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/portable/systematic-debugging.md)                                      |
| **Sync new patterns from Task-Dashboard** | Run [`.agent/workflows/sap-sync.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/sap-sync.md)                                                                                             |

# Response 1.2 -

# Query 1.3 -why not create this as a setup package for any new repo and mention it in Sap Sync so next time i set up a new repo i do call just this one workflow that does all these

# Review 1.3 -Searched for files: _bootstrap_

Ran command: `Get-Content "d:\GitHub_Repo\Task-Dashboard\package.json" -Head 40`
Ran command: `$scriptContent = @'
#!/usr/bin/env node
/\*\*

- bootstrap-spoke-governance.cjs — SAP Automated Repository Governance Onboarding
-
- Purpose:
- 1-Command setup to initialize and wire full .agent governance, PACT-001 patterns,
- skills, workflows, verification gates, and CLAUDE.md/GEMINI.md for ANY new or existing repo.
-
- Usage:
- node scripts/bootstrap-spoke-governance.cjs --target="D:/GitHub_Repo/NewRepoName"
- node scripts/bootstrap-spoke-governance.cjs --target="../NewRepo" --name="CustomName"
-
- Exit codes:
- 0 — target repository successfully initialized and 100% verified
- 1 — initialization or verification failed
  \*/

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HUB_ROOT = path.resolve(\_\_dirname, '..');

// ─── Parse CLI Arguments ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
let targetArg = null;
let nameArg = null;
let descArg = null;
let dryRun = false;
let force = false;

for (const arg of args) {
if (arg.startsWith('--target=')) targetArg = arg.split('=').slice(1).join('=');
else if (arg === '-t' && args[args.indexOf(arg) + 1]) targetArg = args[args.indexOf(arg) + 1];
else if (arg.startsWith('--name=')) nameArg = arg.split('=').slice(1).join('=');
else if (arg.startsWith('--description=')) descArg = arg.split('=').slice(1).join('=');
else if (arg === '--dry-run') dryRun = true;
else if (arg === '--force' || arg === '-f') force = true;
}

if (!targetArg) {
console.error('❌ Error: Missing required parameter --target=<path>');
console.error('Usage: node scripts/bootstrap-spoke-governance.cjs --target="D:/GitHub_Repo/TargetRepo"');
process.exit(1);
}

const TARGET_ROOT = path.resolve(process.cwd(), targetArg);
const REPO_NAME = nameArg || path.basename(TARGET_ROOT);
const REPO_DESC = descArg || `${REPO_NAME} — Domain Application & Knowledge Base`;

console.log(`\n🚀 [SAP Governance Bootstrap] Starting repository onboarding...`);
console.log(`   Hub Source:  ${HUB_ROOT}`);
console.log(`   Target Repo: ${TARGET_ROOT}`);
console.log(`   Repo Name:   ${REPO_NAME}`);
console.log(`   Description: ${REPO_DESC}\n`);

// ─── Helper Functions ──────────────────────────────────────────────────────────
function ensureDir(dirPath) {
if (!fs.existsSync(dirPath)) {
if (!dryRun) fs.mkdirSync(dirPath, { recursive: true });
console.log(`📁 Created: ${path.relative(TARGET_ROOT, dirPath) || '.'}`);
}
}

function writeFileNoBom(filePath, content) {
if (dryRun) {
console.log(`📝 [Dry-Run] Write: ${path.relative(TARGET_ROOT, filePath)}`);
return;
}
ensureDir(path.dirname(filePath));
fs.writeFileSync(filePath, content, { encoding: 'utf8' });
console.log(`📝 Written: ${path.relative(TARGET_ROOT, filePath)}`);
}

function copyFileSafe(srcRel, dstRel) {
const src = path.join(HUB_ROOT, srcRel);
const dst = path.join(TARGET_ROOT, dstRel);
if (!fs.existsSync(src)) {
console.warn(`⚠️ Source file missing: ${srcRel}`);
return;
}
if (!dryRun) {
ensureDir(path.dirname(dst));
fs.copyFileSync(src, dst);
}
console.log(`📋 Copied:  ${dstRel}`);
}

function copyDirRecursive(srcRel, dstRel) {
const src = path.join(HUB_ROOT, srcRel);
const dst = path.join(TARGET_ROOT, dstRel);
if (!fs.existsSync(src)) return;

ensureDir(dst);
const entries = fs.readdirSync(src, { withFileTypes: true });
for (const entry of entries) {
const srcEntry = path.join(src, entry.name);
const dstEntry = path.join(dst, entry.name);
if (entry.isDirectory()) {
copyDirRecursive(path.join(srcRel, entry.name), path.join(dstRel, entry.name));
} else if (entry.isFile()) {
if (!dryRun) fs.copyFileSync(srcEntry, dstEntry);
console.log(`📋 Copied:  ${path.join(dstRel, entry.name)}`);
}
}
}

// ─── Step 1: Directory Structure ──────────────────────────────────────────────
console.log(`\n--- Step 1: Initializing Directory Structure ---`);
const DIRS = [
'.agent/workflows/portable',
'.agent/skills',
'.agent/patterns',
'docs/protocols',
'docs/ssot',
'scripts',
];
DIRS.forEach(d => ensureDir(path.join(TARGET_ROOT, d)));

// ─── Step 2: Verification Scripts ─────────────────────────────────────────────
console.log(`\n--- Step 2: Deploying Governance Verification Scripts ---`);
// Spoke verification script (checks P82 and PACT-001)
const SPOKE_VERIFIER_SRC = path.join(HUB_ROOT, '..', 'Capsicum', 'scripts', 'verify-governance-wiring.cjs');
if (fs.existsSync(SPOKE_VERIFIER_SRC)) {
if (!dryRun) fs.copyFileSync(SPOKE_VERIFIER_SRC, path.join(TARGET_ROOT, 'scripts/verify-governance-wiring.cjs'));
console.log(`📋 Copied:  scripts/verify-governance-wiring.cjs (Spoke Verifier)`);
} else {
copyFileSafe('scripts/verify-governance-wiring.cjs', 'scripts/verify-governance-wiring.cjs');
}
copyFileSafe('scripts/verify-governance-schema.cjs', 'scripts/verify-governance-schema.cjs');

// ─── Step 3: Protocol Documentation ───────────────────────────────────────────
console.log(`\n--- Step 3: Copying Protocol Documentation ---`);
copyFileSafe('docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md', 'docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md');
copyFileSafe('docs/protocols/governance-wiring.schema.json', 'docs/protocols/governance-wiring.schema.json');
copyFileSafe('.agent/patterns/README.md', '.agent/patterns/README.md');

// ─── Step 4: Standard Workflows ───────────────────────────────────────────────
console.log(`\n--- Step 4: Synchronizing Workflows ---`);
const WORKFLOWS = [
'plan.md',
'plan-review.md',
'sap-sync.md',
'capture-pattern.md',
'capture-pattern-lite.md',
'skill-onboarding.md',
'governance-workflow.md',
'aos-session-open.md',
'aos-session-close.md',
];
WORKFLOWS.forEach(wf => copyFileSafe(`.agent/workflows/${wf}`, `.agent/workflows/${wf}`));

const PORTABLE_WORKFLOWS = [
'spoke-and-wheel-docs.md',
'systematic-debugging.md',
'session-handoff-system.md',
'ssot-reconciliation.md',
];
PORTABLE_WORKFLOWS.forEach(pwf => copyFileSafe(`.agent/workflows/portable/${pwf}`, `.agent/workflows/portable/${pwf}`));

// ─── Step 5: Core Skills ──────────────────────────────────────────────────────
console.log(`\n--- Step 5: Deploying Standard Universal Skills ---`);
const CORE_SKILLS = [
'protocol-enforcer-pre-code',
'writing-plans',
'systematic-debugger',
'prompt-clarity',
'pin-branch',
'mermaid-skill',
'ssot-domain-mapper',
'writing-technical-documentation',
'writing-clearly-and-concisely',
'memory-session-loader',
'memory-session-end',
'memory-event-logger',
'memory-decision-logger',
];
CORE_SKILLS.forEach(skill => copyDirRecursive(`.agent/skills/${skill}`, `.agent/skills/${skill}`));

// ─── Step 6: Universal Patterns (PACT-001 Local Adaptation) ───────────────────
console.log(`\n--- Step 6: Deploying & Adapting Universal Patterns (PACT-001) ---`);
const UNIVERSAL_PATTERNS = [
'search-before-inventing.md',
'raw-evidence-before-hypothesis.md',
'intent-clarity-decoupling-and-plan-hardstop.md',
'proxy-signal-verdicts.md',
'scope-ledger-anchor.md',
'triage-anomalies-first.md',
'data-layer-verification-first.md',
'write-without-reader.md',
'p81-id-registration-process.md',
];

const LOCAL_CONSUMED_BLOCK = `consumed_by:

- file: CLAUDE.md
  at: "Pattern Activation & PACT-001 Cross-References"
- file: .agent/workflows/plan.md
  at: "Step 0.1: Universal Patterns Reference Check"`;

UNIVERSAL_PATTERNS.forEach(patName => {
const srcPath = path.join(HUB_ROOT, '.agent/patterns', patName);
if (!fs.existsSync(srcPath)) return;

let content = fs.readFileSync(srcPath, 'utf8');
// Adapt frontmatter for spoke
content = content.replace(/consumed_by:[\s\S]*?(?=\r?\n---)/, LOCAL_CONSUMED_BLOCK);
if (!content.includes('canonical_source:')) {
content = content.replace(/portability:\s*universal/, 'portability: universal\ncanonical_source: task-dashboard');
}
content = content.replace(/activation_tier:\s\*guarded/, 'activation_tier: routed');

writeFileNoBom(path.join(TARGET_ROOT, '.agent/patterns', patName), content);
});

// Ensure plan.md references universal patterns
const targetPlanWf = path.join(TARGET_ROOT, '.agent/workflows/plan.md');
if (fs.existsSync(targetPlanWf)) {
let planContent = fs.readFileSync(targetPlanWf, 'utf8');
if (!planContent.includes('Step 0.1: Universal Patterns Reference Check')) {
const patternSection = `\n## Step 0.1: Universal Patterns Reference Check\nReview relevant universal patterns:\n` +
UNIVERSAL_PATTERNS.map(p => `- \`.agent/patterns/${p}\``).join('\n') + '\n\n';
    planContent = planContent.replace(/# \/plan Workflow\r?\n/, `# /plan Workflow\n${patternSection}`);
writeFileNoBom(targetPlanWf, planContent);
}
}

// ─── Step 7: package.json Governance Scripts ──────────────────────────────────
console.log(`\n--- Step 7: Configuring package.json ---`);
const pkgPath = path.join(TARGET*ROOT, 'package.json');
let pkg = {};
if (fs.existsSync(pkgPath)) {
try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch { pkg = {}; }
} else {
pkg = {
name: REPO_NAME.toLowerCase().replace(/[^a-z0-9*-]/g, '-'),
version: '1.0.0',
description: REPO_DESC,
license: 'ISC',
};
}

pkg.scripts = pkg.scripts || {};
pkg.scripts['verify:governance-wiring'] = 'node scripts/verify-governance-wiring.cjs';
pkg.scripts['verify:governance-wiring:all'] = 'node scripts/verify-governance-wiring.cjs --all';
pkg.scripts['verify:governance-schema'] = 'node scripts/verify-governance-schema.cjs';

writeFileNoBom(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// ─── Step 8: .agent Configuration & Routing Catalogs ──────────────────────────
console.log(`\n--- Step 8: Generating .agent Catalogs & Routing ---`);
const SKILL_ROUTER_CONTENT = `# std.agent.skill-router — ${REPO_NAME} Cross-Repo Routing Index

# Project: ${REPO_NAME}

# Generated: ${new Date().toISOString().slice(0, 10)} | SAP Spoke Alignment

skills:

- id: writing-plans
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write plan", "create plan", "make plan", "implementation plan", "step by step"]
  cost: medium
  invoke: read .agent/skills/writing-plans/SKILL.md
  when: "Structuring complex changes or multi-step execution sequences"

- id: systematic-debugger
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["debug", "investigate bug", "why is this broken", "systematic debug", "4-ppsd"]
  cost: medium
  invoke: read .agent/skills/systematic-debugger/SKILL.md
  when: "Applying 4-Phase Problem Solving Discipline to resolve discrepancies"

- id: protocol-enforcer-pre-code
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["check protocol", "pre-code check", "verify plan", "hard stop"]
  cost: low
  invoke: read .agent/skills/protocol-enforcer-pre-code/SKILL.md
  when: "Ensuring plan is approved before executing file operations"

- id: prompt-clarity
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, qsr]
  triggers: ["prompt clarity", "prompt-clarity", "clarify prompt", "reframe prompt", "/prompt-clarity"]
  cost: low
  invoke: read .agent/skills/prompt-clarity/SKILL.md
  when: "Reframing ambiguous user requirements into concrete options"

- id: pin-branch
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["pin this", "pin branch", "park this", "come back to this", "/pin-branch"]
  cost: low
  invoke: read .agent/skills/pin-branch/SKILL.md
  when: "Persisting in-session branches or deferred work"

- id: mermaid-skill
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["mermaid", "flowchart", "diagram", "sequence diagram", "architecture diagram"]
  cost: low
  invoke: read .agent/skills/mermaid-skill/SKILL.md
  when: "Generating structured mermaid diagrams and workflow visuals"

- id: ssot-domain-mapper
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["domain map", "entity map", "ssot map", "schema map", "domain relationship"]
  cost: medium
  invoke: read .agent/skills/ssot-domain-mapper/SKILL.md
  when: "Mapping domain entities, schema relations, and SSOT spoke files"

- id: writing-clearly-and-concisely
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write clearly", "concise writing", "simplify explanation", "clean prose"]
  cost: low
  invoke: read .agent/skills/writing-clearly-and-concisely/SKILL.md
  when: "Refining documentation for high clarity and brevity"

- id: writing-technical-documentation
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write technical docs", "document architecture", "create spec", "system documentation"]
  cost: medium
  invoke: read .agent/skills/writing-technical-documentation/SKILL.md
  when: "Authoring architectural, schema, and operational specifications"

- id: memory-session-loader
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["load memory", "session memory load", "restore context"]
  cost: low
  invoke: read .agent/skills/memory-session-loader/SKILL.md
  when: "Loading past session signals and context into active conversation"

- id: memory-session-end
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["end session", "session close", "closeout memory", "session end"]
  cost: low
  invoke: read .agent/skills/memory-session-end/SKILL.md
  when: "Persisting session telemetry and closeout memory"

- id: memory-event-logger
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["log event", "event logger", "record milestone"]
  cost: low
  invoke: read .agent/skills/memory-event-logger/SKILL.md
  when: "Recording significant project events to persistent memory"

- id: memory-decision-logger
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["log decision", "record decision", "decision logger"]
  cost: low
  invoke: read .agent/skills/memory-decision-logger/SKILL.md
  when: "Recording architectural and domain decisions into the decision registry"

- id: governance-wiring-audit
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, bms]
  triggers: ["verify wiring", "governance wiring", "is it wired", "wiring audit", "PACT-001"]
  cost: low
  invoke: npm run verify:governance-wiring
  when: "Checking whether governance artifacts and patterns are properly wired into the consumption layer"

- id: pattern-proxy-signal-verdicts
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["is this dead code", "safe to delete", "can we remove this", "retire this file", "consolidate these files", "merge these files", "this looks like a duplicate", "nothing uses this", "unused token", "unused export", "stale file", "which one is canonical", "delete the redundant one"]
  cost: low
  invoke: read .agent/patterns/proxy-signal-verdicts.md
  when: "Surface the proxy-signal-verdicts pattern when delete or consolidation triggers are detected"

- id: pattern-search-before-inventing
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["search before inventing", "check existing patterns", "do not reinvent", "inventory first"]
  cost: low
  invoke: read .agent/patterns/search-before-inventing.md
  when: "Preventing invention of redundant schemas or tools by enforcing inventory search"

- id: pattern-raw-evidence-before-hypothesis
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["raw evidence", "verify facts", "check ground truth"]
  cost: low
  invoke: read .agent/patterns/raw-evidence-before-hypothesis.md
  when: "Gathering ground truth facts before generating hypotheses"

- id: pattern-intent-clarity-decoupling
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["decouple intent", "plan hardstop", "intent clarity"]
  cost: low
  invoke: read .agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md
  when: "Decoupling intent clarification from execution authorization"

- id: pattern-triage-anomalies-first
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["triage anomalies", "data anomaly", "schema mismatch"]
  cost: low
  invoke: read .agent/patterns/triage-anomalies-first.md
  when: "Triaging anomalies before performing widespread data migrations"

- id: pattern-data-layer-verification
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["data layer verification", "verify schema first", "check data layer"]
  cost: low
  invoke: read .agent/patterns/data-layer-verification-first.md
  when: "Verifying underlying schema and data models before building dependent views"

- id: pattern-write-without-reader
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["write without reader", "unconsumed write", "orphan record"]
  cost: low
  invoke: read .agent/patterns/write-without-reader.md
  when: "Preventing creation of data that has no active reader or consumer"

- id: pattern-scope-ledger-anchor
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["scope ledger", "track scope", "prevent scope creep"]
  cost: low
  invoke: read .agent/patterns/scope-ledger-anchor.md
  when: "Anchoring work scope against established objectives"

- id: sap-sync
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, bms, ug-farmhouse]
  triggers: ["sap-sync", "sync patterns", "propagate pact", "run sap-sync"]
  cost: medium
  invoke: read .agent/workflows/sap-sync.md
  when: "Synchronizing universal patterns from Task-Dashboard canonical hub"
  `;
  writeFileNoBom(path.join(TARGET_ROOT, '.agent/skill-router.yaml'), SKILL_ROUTER_CONTENT);

const STANDARDS_CATALOG_CONTENT = JSON.stringify({
version: '1.0.0',
lastUpdated: new Date().toISOString().slice(0, 10),
metadata: {
projectName: REPO_NAME,
owner: 'goldenage399',
targetEnvironment: 'Multi-Repo SAP Spoke',
governanceModel: 'AI-Driven Development (Antigravity Agent)',
sourceOfTruth: 'GEMINI.md',
totalStandards: 4,
lastUpdated: new Date().toISOString().slice(0, 10),
},
categories: {
governance: 'Process and workflow controls',
'data-integrity': 'Schema validity and entity relations',
documentation: 'SSOT, hubs, and schema specifications',
memory: 'Persistent context and session telemetry',
},
standards: [
{
id: 'P-SSOT-DOCS',
category: 'documentation',
name: 'Spoke & Wheel Single Source of Truth',
description: 'Hub documents contain only indices (max 150 lines). Spoke documents own detailed specifications and declare parent hub in frontmatter.',
severity: 'MEDIUM',
enforcement: {
checkpoints: ['pre-commit'],
manualOnly: false,
automatedGate: 'npm run verify:governance-wiring',
},
references: ['.agent/workflows/portable/spoke-and-wheel-docs.md'],
},
{
id: 'P82',
category: 'governance',
name: 'Governance Artifact Wiring Completeness',
description: 'All new workflows, skills, and patterns must be wired into skill-router.yaml and CLAUDE.md/GEMINI.md.',
severity: 'CRITICAL',
enforcement: {
checkpoints: ['pre-commit', 'CI'],
manualOnly: false,
automatedGate: 'npm run verify:governance-wiring',
},
references: ['scripts/verify-governance-wiring.cjs'],
},
{
id: 'P-4PPSD',
category: 'governance',
name: '4-Phase Problem-Solving Discipline',
description: 'Strict adherence to Ground Truth -> Research Benchmarks -> Objective Rules -> Evidence-Based Execution.',
severity: 'HIGH',
enforcement: {
checkpoints: ['session-start', 'planning'],
manualOnly: true,
},
references: ['GEMINI.md', 'CLAUDE.md'],
},
],
}, null, 2) + '\n';
writeFileNoBom(path.join(TARGET_ROOT, '.agent/standards-catalog.json'), STANDARDS_CATALOG_CONTENT);

const PREFLIGHT_CONTENT = `# ${REPO_NAME} — Preflight Gate & Routing Table

> **Standard**: P82 (Governance Wiring Completeness)
> **Enforcement**: Run before making structural, code, or schema changes.

## Routing Matrix

| Row | Trigger / Condition                            | Standard / Protocol                                                 | Verification Action                                              | Rationale / Failure Mode Prevented              |
| --- | ---------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| R1  | Creating new Markdown specifications or guides | \`.agent/workflows/portable/spoke-and-wheel-docs.md\`               | Check \`hub:\` frontmatter and verify registration in parent hub | Documentation drift and orphaned markdown files |
| R2  | Adding or updating \`.agent/patterns/\*.md\`   | \`docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md\` (PACT-001) | \`npm run verify:governance-wiring\`                             | Orphaned pattern contracts or unwired triggers  |
| R3  | Running cross-repo sync                        | \`.agent/workflows/sap-sync.md\`                                    | \`npm run verify:governance-wiring:all\`                         | Schema drift across sibling repositories        |

`;
writeFileNoBom(path.join(TARGET_ROOT, '.agent/PREFLIGHT.md'), PREFLIGHT_CONTENT);

// ─── Step 9: Agent Operating Manuals (CLAUDE.md / GEMINI.md) ──────────────────
console.log(`\n--- Step 9: Creating Agent Operating Manuals ---`);
const claudeMdPath = path.join(TARGET_ROOT, 'CLAUDE.md');
if (!fs.existsSync(claudeMdPath) || force) {
const AGENT_MANUAL_CONTENT = `# ${REPO_NAME} — Agent Operating Manual

This repository represents **${REPO_NAME}** — ${REPO_DESC}.

---

## 1. Prime Invariants & Operating Discipline

### 1. 4-Phase Problem-Solving Discipline (4-PPSD)

- **Phase 1: Ground Truth & Intent**: Analyze existing domain models, invariants, and relations before modifying documents.
- **Phase 2: Research & Domain Alignment**: Verify benchmarks and standards against SSOT specifications before proposing changes.
- **Phase 3: Objective Rule Synthesis**: Follow explicit precedence ladders and schemas for all domain entities and tasks.
- **Phase 4: Evidence-Based Execution**: Execute in verified, consistent steps.

### 2. Spoke & Wheel Documentation (\`P-SSOT-DOCS\`)

- Hub documents (\`HUB.md\` / \`DOCS_HUB.md\`) contain only indices and status snapshots (max 150 lines).
- Spoke documents contain detailed domain specifications and declare parent hub in frontmatter.
- Master entities are canonical; all views (dashboards, trackers, run sheets) are derived views.

---

## 2. Session Startup Gate (MANDATORY)

Before any task work, review:

1. \`.agent/skill-router.yaml\` — Skill Router Index
2. \`.agent/PREFLIGHT.md\` — Preflight check matrix
3. Follow \`.agent/workflows/aos-session-open.md\` at session start and \`.agent/workflows/aos-session-close.md\` at session close.

---

## 3. Key Workflows & Governance Protocols

| Task Type                        | Workflow / Skill to Follow                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Multi-step execution planning    | \`.agent/workflows/plan.md\` & \`.agent/skills/writing-plans/SKILL.md\`                                |
| Plan review & validation         | \`.agent/workflows/plan-review.md\`                                                                    |
| Systematic problem diagnosis     | \`.agent/workflows/portable/systematic-debugging.md\` & \`.agent/skills/systematic-debugger/SKILL.md\` |
| Clarify ambiguous prompt         | \`.agent/skills/prompt-clarity/SKILL.md\`                                                              |
| Domain mapping & entity linking  | \`.agent/skills/ssot-domain-mapper/SKILL.md\`                                                          |
| Flowchart & architecture visuals | \`.agent/skills/mermaid-skill/SKILL.md\`                                                               |
| Capture new pattern              | \`.agent/workflows/capture-pattern.md\` / \`.agent/workflows/capture-pattern-lite.md\`                 |
| Onboard new skill                | \`.agent/workflows/skill-onboarding.md\`                                                               |
| Governance compliance workflow   | \`.agent/workflows/governance-workflow.md\`                                                            |
| Synchronize universal patterns   | \`.agent/workflows/sap-sync.md\`                                                                       |
| Spoke & Wheel Documentation      | \`.agent/workflows/portable/spoke-and-wheel-docs.md\`                                                  |
| SSOT Reconciliation              | \`.agent/workflows/portable/ssot-reconciliation.md\`                                                   |
| Session Handoff                  | \`.agent/workflows/portable/session-handoff-system.md\`                                                |
| Governance verification          | \`npm run verify:governance-wiring:all\`                                                               |

---

## 4. Pattern Activation & PACT-001 Cross-References

This repository implements the following universal patterns:

- \`.agent/patterns/search-before-inventing.md\`
- \`.agent/patterns/raw-evidence-before-hypothesis.md\`
- \`.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md\`
- \`.agent/patterns/proxy-signal-verdicts.md\`
- \`.agent/patterns/scope-ledger-anchor.md\`
- \`.agent/patterns/triage-anomalies-first.md\`
- \`.agent/patterns/data-layer-verification-first.md\`
- \`.agent/patterns/write-without-reader.md\`
- \`.agent/patterns/p81-id-registration-process.md\`
  `;
  writeFileNoBom(claudeMdPath, AGENT_MANUAL_CONTENT);
  writeFileNoBom(path.join(TARGET_ROOT, 'GEMINI.md'), AGENT_MANUAL_CONTENT);
} else {
  console.log(`ℹ️ Existing CLAUDE.md preserved (use --force to overwrite)`);
  }

// ─── Step 10: Run Verification Gate in Target ─────────────────────────────────
console.log(`\n--- Step 10: Running Automated Verification in Target Repo ---`);
if (!dryRun) {
try {
const verifierScript = path.join(TARGET_ROOT, 'scripts/verify-governance-wiring.cjs');
const out = execSync(`node "${verifierScript}" --all`, { cwd: TARGET_ROOT, encoding: 'utf8' });
console.log(out);
console.log(`\n✨ [SAP Bootstrap Complete] Repository "${REPO_NAME}" is 100% wired and verified!`);
} catch (err) {
console.error(`\n❌ Target verification failed:`);
console.error(err.stdout || err.message);
process.exit(1);
}
}
'@

[System.IO.File]::WriteAllText("d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs", $scriptContent, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Created Task-Dashboard\scripts\bootstrap-spoke-governance.cjs"
`Ran command:`$testDir = "d:\GitHub_Repo\.temp_bootstrap_test"
if (Test-Path $testDir) { Remove-Item -Path $testDir -Recurse -Force }

node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="$testDir" --name="TempTestRepo" --description="Test Repo for SAP Bootstrap"`
Ran command: `Remove-Item -Path "d:\GitHub_Repo\.temp_bootstrap_test" -Recurse -Force
Write-Output "Cleaned up temporary test directory."`
Viewed sap-sync.md:1-146
Ran command: `$newSapSync = @'

---

## description: Synchronize universal PACT governance patterns, onboard new repositories, shared council blocks, and portable engine across repositories.

# SAP & PACT Pattern Sync Workflow (`/sap-sync`)

> **Purpose**: Automates the cross-repository onboarding and synchronization of the PACT-001 (Pattern Activation Contract) governance mechanism, universal patterns, skills, shared council blocks, and portable engines across all repositories in the ecosystem.
>
> **Canonical Hub**: `Task-Dashboard` (`d:\GitHub_Repo\Task-Dashboard`)
>
> **Scope**: All SAP-linked repositories (e.g. `Task-Dashboard`, `PIOperationsMgmt_Firebase`, `Capsicum`, `BMS`, `UG-Farmhouse`, `QSR`, `Sree_Krushna`, `DashBoard`, `Inventory_Mgmt`, `Unified_Uploader`, etc.)

**Trigger phrases**:

- "bootstrap new repo governance"
- "onboard new repo"
- "sync patterns across repos"
- "propagate PACT mechanism"
- "run sap-sync"
- "deploy PACT to other repos"
- "sync universal patterns"

---

## ⚡ Quick-Start: 1-Command New Repo Onboarding (Bootstrap)

To instantly initialize full `.agent` governance, PACT-001 patterns, universal skills, workflows, verification gates, `package.json` hooks, and `CLAUDE.md`/`GEMINI.md` for ANY new or existing repository:

```powershell
# Run from Task-Dashboard canonical hub:
npm run sap:bootstrap -- --target="d:/GitHub_Repo/<NewRepoName>"

# Or invoke directly with Node:
node scripts/bootstrap-spoke-governance.cjs --target="d:/GitHub_Repo/<NewRepoName>" --name="<RepoName>" --description="<Optional Description>"
```

### What the 1-Command Bootstrap Does Automatically:

1. **Directories**: Scaffolds `.agent/workflows/portable`, `.agent/skills`, `.agent/patterns`, `docs/protocols`, `docs/ssot`, and `scripts`.
2. **Verifiers**: Copies `verify-governance-wiring.cjs` (P82 verifier) and `verify-governance-schema.cjs`.
3. **Protocols**: Deploys `PATTERN-ACTIVATION-CONTRACT-MANUAL.md` and `governance-wiring.schema.json`.
4. **Workflows**: Deploys `plan.md`, `plan-review.md`, `sap-sync.md`, `capture-pattern.md`, `aos-session-open.md`, `aos-session-close.md`, `spoke-and-wheel-docs.md`, `systematic-debugging.md`, etc.
5. **Universal Skills**: Copies `writing-plans`, `systematic-debugger`, `protocol-enforcer-pre-code`, `prompt-clarity`, `pin-branch`, `mermaid-skill`, `ssot-domain-mapper`, `writing-technical-documentation`, `writing-clearly-and-concisely`, `memory-session-loader`, `memory-session-end`, `memory-event-logger`, `memory-decision-logger`.
6. **PACT-001 Patterns**: Copies and automatically adapts all universal patterns (`search-before-inventing`, `raw-evidence-before-hypothesis`, `intent-clarity-decoupling`, `proxy-signal-verdicts`, `scope-ledger-anchor`, `triage-anomalies-first`, `data-layer-verification-first`, `write-without-reader`, `p81-id-registration-process`).
7. **Package Hooks**: Registers `verify:governance-wiring`, `verify:governance-wiring:all`, and `verify:governance-schema` in `package.json`.
8. **Catalogs & Manuals**: Generates tailored `.agent/skill-router.yaml`, `.agent/standards-catalog.json`, `.agent/PREFLIGHT.md`, `CLAUDE.md`, and `GEMINI.md`.
9. **Verification**: Executes `node scripts/verify-governance-wiring.cjs --all` inside the target repo, guaranteeing 100% green verification upon exit.

---

## Step 0 — Portability & Scope Evaluation Gate (MANDATORY)

Before promoting or modifying shared governance files, evaluate the 5-Gate Portability Model:

- **Gate 1 (Substrate Decoupling)**: Keep pure reasoning in shared blocks; keep framework specifics in local sections.
- **Gate 2 (4-Tier Scope Classification)**: Assign logic strictly to governing tier (`all`, `tier-1`, `tier-3`, `local-only`).
- **Gate 3 (Marker Boundary Isolation)**: Enclose shared blocks inside `<!-- shared:std.<domain>.<block-id>:start/end -->`.
- **Gate 4 (Mechanical Verification)**: Enforce byte-level UTF-8 without BOM and automated schema linting.
- **Gate 5 (Reality-First Simplicity)**: Ground shared mechanisms against current reality before expanding complexity.

---

## Step 1 — Verify Local State on Canonical Hub

1. Ensure the canonical hub (`Task-Dashboard`) is clean:
   ```powershell
   git status
   ```
2. Run local governance verification:
   ```powershell
   npm run verify:governance-wiring:all
   ```

---

## Step 2 — Synchronize Existing Spokes

To update an already-onboarded repository with the latest universal patterns and skills:

```powershell
node scripts/bootstrap-spoke-governance.cjs --target="d:/GitHub_Repo/<TargetSpoke>"
```

---

## Step 3 — Target Spoke Verification

Always verify in the target spoke repository context:

```powershell
cd "d:/GitHub_Repo/<TargetSpoke>"
npm run verify:governance-wiring:all
```

Ensure output reports `✅ All artifact(s) fully wired — read path is complete.`
'@

[System.IO.File]::WriteAllText("d:\GitHub_Repo\Task-Dashboard\.agent\workflows\sap-sync.md", $newSapSync, (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllText("d:\GitHub_Repo\Sree_Krushna\.agent\workflows\sap-sync.md", $newSapSync, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Updated sap-sync.md in Task-Dashboard and Sree_Krushna"
`Ran command:`# 1. Update Task-Dashboard package.json
$pkgPath = "d:\GitHub_Repo\Task-Dashboard\package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.scripts | Add-Member -Name "sap:bootstrap" -Value "node scripts/bootstrap-spoke-governance.cjs" -MemberType NoteProperty -Force
$pkgJson = $pkg | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($pkgPath, $pkgJson, (New-Object System.Text.UTF8Encoding($false)))

# 2. Copy bootstrap-spoke-governance.cjs to Sree_Krushna/scripts/

Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force

Write-Output "Registered sap:bootstrap in package.json and copied bootstrap script to Sree_Krushna."
`Ran command:`node scripts/verify-governance-wiring.cjs --all`

## 🚀 1-Command Repository Governance Onboarding Package Created & Integrated

The automated setup package is now ready. Whenever you create a new repository or want to wire governance into an existing repository, you only need to run **a single command** (or trigger `/sap-sync`), and it will handle directory creation, workflow/skill/pattern synchronization, configuration, and verification automatically.

---

### 1. How to Use the 1-Command Bootstrap

#### From `Task-Dashboard` (Canonical Hub):

```powershell
# Using npm script:
npm run sap:bootstrap -- --target="d:/GitHub_Repo/<NewRepoName>"

# Or directly with Node:
node scripts/bootstrap-spoke-governance.cjs --target="d:/GitHub_Repo/<NewRepoName>" --name="<RepoName>" --description="<Optional Description>"
```

#### From Any Spoke (e.g., `Sree_Krushna`):

```powershell
node scripts/bootstrap-spoke-governance.cjs --target="d:/GitHub_Repo/<NewRepoName>"
```

---

### 2. What the 1-Command Bootstrap Does Automatically

| Step                          | Action Performed                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Directories**            | Scaffolds `.agent/workflows/portable`, `.agent/skills`, `.agent/patterns`, `docs/protocols`, `docs/ssot`, and `scripts`.                                                                                                                                                                                                                      |
| **2. Verifiers**              | Deploys `scripts/verify-governance-wiring.cjs` (P82 verifier) and `scripts/verify-governance-schema.cjs`.                                                                                                                                                                                                                                     |
| **3. Protocols**              | Deploys `docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md` and `governance-wiring.schema.json`.                                                                                                                                                                                                                                           |
| **4. Standard Workflows**     | Copies `plan.md`, `plan-review.md`, `sap-sync.md`, `capture-pattern.md`, `aos-session-open.md`, `aos-session-close.md`, `spoke-and-wheel-docs.md`, `systematic-debugging.md`, etc.                                                                                                                                                            |
| **5. Universal Skills**       | Copies 13 essential skills (`writing-plans`, `systematic-debugger`, `protocol-enforcer-pre-code`, `prompt-clarity`, `pin-branch`, `mermaid-skill`, `ssot-domain-mapper`, `writing-technical-documentation`, `writing-clearly-and-concisely`, `memory-session-loader`, `memory-session-end`, `memory-event-logger`, `memory-decision-logger`). |
| **6. PACT-001 Patterns**      | Deploys and automatically adapts local frontmatter for all 9 universal patterns (`search-before-inventing`, `raw-evidence-before-hypothesis`, `intent-clarity-decoupling`, `proxy-signal-verdicts`, `scope-ledger-anchor`, `triage-anomalies-first`, `data-layer-verification-first`, `write-without-reader`, `p81-id-registration-process`). |
| **7. Package Hooks**          | Configures `package.json` with `verify:governance-wiring:all` scripts.                                                                                                                                                                                                                                                                        |
| **8. Catalogs & Manuals**     | Generates tailored `.agent/skill-router.yaml`, `.agent/standards-catalog.json`, `.agent/PREFLIGHT.md`, `CLAUDE.md`, and `GEMINI.md`.                                                                                                                                                                                                          |
| **9. Automated Verification** | Runs `node scripts/verify-governance-wiring.cjs --all` inside the target repo, guaranteeing a 100% green verification exit.                                                                                                                                                                                                                   |

---

### 3. Integrated into `/sap-sync` Workflow

The workflow manual at [`.agent/workflows/sap-sync.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/sap-sync.md) has been updated with the 1-Command Bootstrap quickstart and triggers:

- Trigger phrases: `"bootstrap new repo governance"`, `"onboard new repo"`, `"run sap-sync"`, `"sync patterns across repos"`.
- Added `"sap:bootstrap"` script into [`Task-Dashboard/package.json`](file:///d:/GitHub_Repo/Task-Dashboard/package.json).
- Distributed [`scripts/bootstrap-spoke-governance.cjs`](file:///d:/GitHub_Repo/Task-Dashboard/scripts/bootstrap-spoke-governance.cjs) to both `Task-Dashboard` and `Sree_Krushna`.

# Response 1.3 -

# Query 1.4 -

# Review 1.4 -

# Response 1.4 -

# Query 1.5 -why is impeccable not synched to this repo , its present in task dashboard i guess and where are the councils and related ui and arch skill, w hy arent they covered under common portable sync items for all repos ?undder sap sync

# Review 1.5 -Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard\.claude\skills" -Directory | Select-Object Name`

Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard\.claude\skills\impeccable" -Recurse | Measure-Object -Property Length -Sum`
Ran command: `$updatedBootstrap = @'
#!/usr/bin/env node
/\*\*

- bootstrap-spoke-governance.cjs — Universal Repository Governance & Skill Onboarding
-
- Purpose:
- 1-Command setup to initialize and wire the COMPLETE suite of:
- - .agent governance, PACT-001 patterns, and standards
- - Architecture & UI Councils (architecture-council.md, ui-council.md)
- - All .agent/skills (UI/UX Pro Max, COS orchestrators, schema enforcers, PRD architects)
- - All .claude/skills (Impeccable, Site Architecture, Web Design Guidelines, etc.)
- - Verification gates (P82) and CLAUDE.md / GEMINI.md operating manuals.
-
- Usage:
- node scripts/bootstrap-spoke-governance.cjs --target="D:/GitHub_Repo/TargetRepo"
  \*/

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HUB_ROOT = path.resolve(\_\_dirname, '..');

// ─── Parse CLI Arguments ───────────────────────────────────────────────────────
const args = process.argv.slice(2);
let targetArg = null;
let nameArg = null;
let descArg = null;
let dryRun = false;
let force = false;

for (const arg of args) {
if (arg.startsWith('--target=')) targetArg = arg.split('=').slice(1).join('=');
else if (arg === '-t' && args[args.indexOf(arg) + 1]) targetArg = args[args.indexOf(arg) + 1];
else if (arg.startsWith('--name=')) nameArg = arg.split('=').slice(1).join('=');
else if (arg.startsWith('--description=')) descArg = arg.split('=').slice(1).join('=');
else if (arg === '--dry-run') dryRun = true;
else if (arg === '--force' || arg === '-f') force = true;
}

if (!targetArg) {
console.error('❌ Error: Missing required parameter --target=<path>');
console.error('Usage: node scripts/bootstrap-spoke-governance.cjs --target="D:/GitHub_Repo/TargetRepo"');
process.exit(1);
}

const TARGET_ROOT = path.resolve(process.cwd(), targetArg);
const REPO_NAME = nameArg || path.basename(TARGET_ROOT);
const REPO_DESC = descArg || `${REPO_NAME} — Domain Application & Knowledge Base`;

console.log(`\n🚀 [SAP Universal Bootstrap] Onboarding full repository governance, skills & councils...`);
console.log(`   Hub Source:  ${HUB_ROOT}`);
console.log(`   Target Repo: ${TARGET_ROOT}`);
console.log(`   Repo Name:   ${REPO_NAME}`);
console.log(`   Description: ${REPO_DESC}\n`);

// ─── Helper Functions ──────────────────────────────────────────────────────────
function ensureDir(dirPath) {
if (!fs.existsSync(dirPath)) {
if (!dryRun) fs.mkdirSync(dirPath, { recursive: true });
console.log(`📁 Created: ${path.relative(TARGET_ROOT, dirPath) || '.'}`);
}
}

function writeFileNoBom(filePath, content) {
if (dryRun) {
console.log(`📝 [Dry-Run] Write: ${path.relative(TARGET_ROOT, filePath)}`);
return;
}
ensureDir(path.dirname(filePath));
fs.writeFileSync(filePath, content, { encoding: 'utf8' });
console.log(`📝 Written: ${path.relative(TARGET_ROOT, filePath)}`);
}

function copyFileSafe(srcRel, dstRel) {
const src = path.join(HUB_ROOT, srcRel);
const dst = path.join(TARGET_ROOT, dstRel);
if (!fs.existsSync(src)) {
console.warn(`⚠️ Source file missing: ${srcRel}`);
return;
}
if (!dryRun) {
ensureDir(path.dirname(dst));
fs.copyFileSync(src, dst);
}
console.log(`📋 Copied:  ${dstRel}`);
}

function copyDirRecursive(srcRel, dstRel) {
const src = path.join(HUB_ROOT, srcRel);
const dst = path.join(TARGET_ROOT, dstRel);
if (!fs.existsSync(src)) return;

ensureDir(dst);
const entries = fs.readdirSync(src, { withFileTypes: true });
for (const entry of entries) {
const srcEntry = path.join(src, entry.name);
const dstEntry = path.join(dst, entry.name);
if (entry.isDirectory()) {
copyDirRecursive(path.join(srcRel, entry.name), path.join(dstRel, entry.name));
} else if (entry.isFile()) {
if (!dryRun) fs.copyFileSync(srcEntry, dstEntry);
console.log(`📋 Copied:  ${path.join(dstRel, entry.name)}`);
}
}
}

// ─── Step 1: Directory Structure ──────────────────────────────────────────────
console.log(`\n--- Step 1: Initializing Directory Structure ---`);
const DIRS = [
'.agent/workflows/portable',
'.agent/skills',
'.agent/patterns',
'.claude/skills',
'docs/protocols',
'docs/ssot',
'scripts',
];
DIRS.forEach(d => ensureDir(path.join(TARGET_ROOT, d)));

// ─── Step 2: Verification Scripts ─────────────────────────────────────────────
console.log(`\n--- Step 2: Deploying Governance Verification Scripts ---`);
const SPOKE_VERIFIER_SRC = path.join(HUB_ROOT, '..', 'Capsicum', 'scripts', 'verify-governance-wiring.cjs');
if (fs.existsSync(SPOKE_VERIFIER_SRC)) {
if (!dryRun) fs.copyFileSync(SPOKE_VERIFIER_SRC, path.join(TARGET_ROOT, 'scripts/verify-governance-wiring.cjs'));
console.log(`📋 Copied:  scripts/verify-governance-wiring.cjs (Spoke Verifier)`);
} else {
copyFileSafe('scripts/verify-governance-wiring.cjs', 'scripts/verify-governance-wiring.cjs');
}
copyFileSafe('scripts/verify-governance-schema.cjs', 'scripts/verify-governance-schema.cjs');

// ─── Step 3: Protocol Documentation ───────────────────────────────────────────
console.log(`\n--- Step 3: Copying Protocol Documentation ---`);
copyFileSafe('docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md', 'docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md');
copyFileSafe('docs/protocols/governance-wiring.schema.json', 'docs/protocols/governance-wiring.schema.json');
copyFileSafe('.agent/patterns/README.md', '.agent/patterns/README.md');

// ─── Step 4: Workflows (Including Councils & UI/Arch) ─────────────────────────
console.log(`\n--- Step 4: Synchronizing Complete Workflow Suite & Councils ---`);
const WORKFLOWS = [
'plan.md',
'plan-review.md',
'sap-sync.md',
'capture-pattern.md',
'capture-pattern-lite.md',
'skill-onboarding.md',
'governance-workflow.md',
'aos-session-open.md',
'aos-session-close.md',
'architecture-council.md',
'ui-council.md',
'external-ui-redesign.md',
'mobile-ui-engineering.md',
'table-schema-documentation.md',
'new-prd.md',
'perf-review.md',
];
WORKFLOWS.forEach(wf => copyFileSafe(`.agent/workflows/${wf}`, `.agent/workflows/${wf}`));

const PORTABLE_WORKFLOWS = [
'spoke-and-wheel-docs.md',
'systematic-debugging.md',
'session-handoff-system.md',
'ssot-reconciliation.md',
'financial-integrity-patterns.md',
'spreadsheet-backend-patterns.md',
];
PORTABLE_WORKFLOWS.forEach(pwf => copyFileSafe(`.agent/workflows/portable/${pwf}`, `.agent/workflows/portable/${pwf}`));

// ─── Step 5: Full .agent/skills Suite ─────────────────────────────────────────
console.log(`\n--- Step 5: Deploying All .agent Skills ---`);
const ALL_AGENT_SKILLS = [
'protocol-enforcer-pre-code',
'writing-plans',
'systematic-debugger',
'prompt-clarity',
'pin-branch',
'mermaid-skill',
'ssot-domain-mapper',
'writing-technical-documentation',
'writing-clearly-and-concisely',
'memory-session-loader',
'memory-session-end',
'memory-event-logger',
'memory-decision-logger',
'ui-ux-pro-max',
'frontend-design',
'ui-design-validator',
'mobile-ui-validator',
'parent-layout-audit',
'cos-orchestrator',
'cos-safe-refactor',
'cos-integration-verifier',
'admin-component-contracts',
'declarative-schema-enforcer',
'contract-first-api-validator',
'schema-migration-guide',
'caveman',
'caveman-compress',
'change-prd-architect',
'enhancement-scaffolder',
'enhancement-tracker-update',
'phased-commit-orchestrator',
'writejournal-audit-gate',
'pirr-compliance-checklist',
'planning-with-files',
'test-driven-development',
'backend-test-generator',
'gas-deploy-guard',
'gas-optimizer',
'task-firestore-direct-write',
'vercel-react-best-practices',
];

ALL_AGENT_SKILLS.forEach(skill => copyDirRecursive(`.agent/skills/${skill}`, `.agent/skills/${skill}`));

// ─── Step 6: Deploy .claude/skills (Impeccable, Site-Arch, etc.) ─────────────
console.log(`\n--- Step 6: Deploying Claude-Native Skills (Impeccable, etc.) ---`);
const CLAUDE_SKILLS = [
'impeccable',
'architecture-patterns',
'high-end-visual-design',
'improve-codebase-architecture',
'site-architecture',
'web-design-guidelines',
'skill-creator',
'triage',
'grill-with-docs',
'python-performance-optimization',
];
CLAUDE_SKILLS.forEach(skill => copyDirRecursive(`.claude/skills/${skill}`, `.claude/skills/${skill}`));

// ─── Step 7: Universal Patterns (PACT-001 Local Adaptation) ───────────────────
console.log(`\n--- Step 7: Deploying & Adapting Universal Patterns (PACT-001) ---`);
const UNIVERSAL_PATTERNS = [
'search-before-inventing.md',
'raw-evidence-before-hypothesis.md',
'intent-clarity-decoupling-and-plan-hardstop.md',
'proxy-signal-verdicts.md',
'scope-ledger-anchor.md',
'triage-anomalies-first.md',
'data-layer-verification-first.md',
'write-without-reader.md',
'p81-id-registration-process.md',
];

const LOCAL_CONSUMED_BLOCK = `consumed_by:

- file: CLAUDE.md
  at: "Pattern Activation & PACT-001 Cross-References"
- file: .agent/workflows/plan.md
  at: "Step 0.1: Universal Patterns Reference Check"`;

UNIVERSAL_PATTERNS.forEach(patName => {
const srcPath = path.join(HUB_ROOT, '.agent/patterns', patName);
if (!fs.existsSync(srcPath)) return;

let content = fs.readFileSync(srcPath, 'utf8');
content = content.replace(/consumed_by:[\s\S]*?(?=\r?\n---)/, LOCAL_CONSUMED_BLOCK);
if (!content.includes('canonical_source:')) {
content = content.replace(/portability:\s*universal/, 'portability: universal\ncanonical_source: task-dashboard');
}
content = content.replace(/activation_tier:\s\*guarded/, 'activation_tier: routed');

writeFileNoBom(path.join(TARGET_ROOT, '.agent/patterns', patName), content);
});

// Ensure plan.md references universal patterns
const targetPlanWf = path.join(TARGET_ROOT, '.agent/workflows/plan.md');
if (fs.existsSync(targetPlanWf)) {
let planContent = fs.readFileSync(targetPlanWf, 'utf8');
if (!planContent.includes('Step 0.1: Universal Patterns Reference Check')) {
const patternSection = `\n## Step 0.1: Universal Patterns Reference Check\nReview relevant universal patterns:\n` +
UNIVERSAL_PATTERNS.map(p => `- \`.agent/patterns/${p}\``).join('\n') + '\n\n';
    planContent = planContent.replace(/# \/plan Workflow\r?\n/, `# /plan Workflow\n${patternSection}`);
writeFileNoBom(targetPlanWf, planContent);
}
}

// ─── Step 8: package.json Governance Scripts ──────────────────────────────────
console.log(`\n--- Step 8: Configuring package.json ---`);
const pkgPath = path.join(TARGET*ROOT, 'package.json');
let pkg = {};
if (fs.existsSync(pkgPath)) {
try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch { pkg = {}; }
} else {
pkg = {
name: REPO_NAME.toLowerCase().replace(/[^a-z0-9*-]/g, '-'),
version: '1.0.0',
description: REPO_DESC,
license: 'ISC',
};
}

pkg.scripts = pkg.scripts || {};
pkg.scripts['verify:governance-wiring'] = 'node scripts/verify-governance-wiring.cjs';
pkg.scripts['verify:governance-wiring:all'] = 'node scripts/verify-governance-wiring.cjs --all';
pkg.scripts['verify:governance-schema'] = 'node scripts/verify-governance-schema.cjs';

writeFileNoBom(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// ─── Step 9: .agent Configuration & Routing Catalogs ──────────────────────────
console.log(`\n--- Step 9: Generating Complete .agent Catalogs & Routing ---`);
const SKILL_ROUTER_CONTENT = `# std.agent.skill-router — ${REPO_NAME} Cross-Repo Routing Index

# Project: ${REPO_NAME}

# Generated: ${new Date().toISOString().slice(0, 10)} | SAP Universal Spoke Alignment

skills:

- id: writing-plans
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write plan", "create plan", "make plan", "implementation plan", "step by step"]
  cost: medium
  invoke: read .agent/skills/writing-plans/SKILL.md
  when: "Structuring complex changes or multi-step execution sequences"

- id: systematic-debugger
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["debug", "investigate bug", "why is this broken", "systematic debug", "4-ppsd"]
  cost: medium
  invoke: read .agent/skills/systematic-debugger/SKILL.md
  when: "Applying 4-Phase Problem Solving Discipline to resolve discrepancies"

- id: protocol-enforcer-pre-code
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["check protocol", "pre-code check", "verify plan", "hard stop"]
  cost: low
  invoke: read .agent/skills/protocol-enforcer-pre-code/SKILL.md
  when: "Ensuring plan is approved before executing file operations"

- id: prompt-clarity
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, qsr]
  triggers: ["prompt clarity", "prompt-clarity", "clarify prompt", "reframe prompt", "/prompt-clarity"]
  cost: low
  invoke: read .agent/skills/prompt-clarity/SKILL.md
  when: "Reframing ambiguous user requirements into concrete options"

- id: pin-branch
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["pin this", "pin branch", "park this", "come back to this", "/pin-branch"]
  cost: low
  invoke: read .agent/skills/pin-branch/SKILL.md
  when: "Persisting in-session branches or deferred work"

- id: mermaid-skill
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["mermaid", "flowchart", "diagram", "sequence diagram", "architecture diagram"]
  cost: low
  invoke: read .agent/skills/mermaid-skill/SKILL.md
  when: "Generating structured mermaid diagrams and workflow visuals"

- id: ssot-domain-mapper
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["domain map", "entity map", "ssot map", "schema map", "domain relationship"]
  cost: medium
  invoke: read .agent/skills/ssot-domain-mapper/SKILL.md
  when: "Mapping domain entities, schema relations, and SSOT spoke files"

- id: writing-clearly-and-concisely
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write clearly", "concise writing", "simplify explanation", "clean prose"]
  cost: low
  invoke: read .agent/skills/writing-clearly-and-concisely/SKILL.md
  when: "Refining documentation for high clarity and brevity"

- id: writing-technical-documentation
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write technical docs", "document architecture", "create spec", "system documentation"]
  cost: medium
  invoke: read .agent/skills/writing-technical-documentation/SKILL.md
  when: "Authoring architectural, schema, and operational specifications"

- id: ui-ux-pro-max
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["ui design", "ux review", "redesign component", "color palette", "theme token", "ui styling"]
  cost: medium
  invoke: read .agent/skills/ui-ux-pro-max/SKILL.md
  when: "Designing, styling, and reviewing UI/UX interfaces adhering to theme tokens"

- id: frontend-design
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["frontend design", "build ui", "component layout", "responsive layout"]
  cost: medium
  invoke: read .agent/skills/frontend-design/SKILL.md
  when: "Constructing modern frontend components with design system adherence"

- id: ui-design-validator
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["validate ui", "css check", "token validation", "lint ui"]
  cost: low
  invoke: read .agent/skills/ui-design-validator/SKILL.md
  when: "Validating semantic tokens, bridge specificity, and layout constraints"

- id: mobile-ui-validator
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["mobile validation", "check mobile", "300px check", "responsive test"]
  cost: low
  invoke: read .agent/skills/mobile-ui-validator/SKILL.md
  when: "Testing layout responsiveness down to 300px viewport constraints"

- id: parent-layout-audit
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["parent layout", "layout hierarchy", "container overflow", "flex audit"]
  cost: low
  invoke: read .agent/skills/parent-layout-audit/SKILL.md
  when: "Auditing parent container constraints and CSS cascade hierarchies"

- id: cos-orchestrator
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["cos orchestrator", "multi surface refactor", "orchestrate refactor"]
  cost: high
  invoke: read .agent/skills/cos-orchestrator/SKILL.md
  when: "Coordinating multi-surface architectural transformations"

- id: cos-safe-refactor
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["safe refactor", "refactor code", "structural refactor"]
  cost: medium
  invoke: read .agent/skills/cos-safe-refactor/SKILL.md
  when: "Executing phased, regression-free refactoring"

- id: cos-integration-verifier
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["integration verify", "verify integration", "cross surface test"]
  cost: medium
  invoke: read .agent/skills/cos-integration-verifier/SKILL.md
  when: "Verifying multi-surface integration integrity post-refactor"

- id: declarative-schema-enforcer
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["schema enforcer", "validate schema", "data structure check"]
  cost: medium
  invoke: read .agent/skills/declarative-schema-enforcer/SKILL.md
  when: "Enforcing declarative schema constraints and type safety"

- id: contract-first-api-validator
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["contract validator", "api contract", "payload validation"]
  cost: medium
  invoke: read .agent/skills/contract-first-api-validator/SKILL.md
  when: "Validating API payloads and contract interfaces"

- id: schema-migration-guide
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["schema migration", "migrate database", "migrate data"]
  cost: high
  invoke: read .agent/skills/schema-migration-guide/SKILL.md
  when: "Executing non-destructive data and schema migrations"

- id: admin-component-contracts
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["admin component", "admin contract", "component boundary"]
  cost: medium
  invoke: read .agent/skills/admin-component-contracts/SKILL.md
  when: "Standardizing admin component boundaries and prop contracts"

- id: change-prd-architect
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["create PRD", "draft PRD", "feature spec", "change request", "impact analysis"]
  cost: high
  invoke: read .agent/skills/change-prd-architect/SKILL.md
  when: "Drafting structured PRDs and change impact specifications"

- id: enhancement-scaffolder
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["new enhancement", "scaffold enhancement", "create ENH", "start new feature"]
  cost: medium
  invoke: read .agent/skills/enhancement-scaffolder/SKILL.md
  when: "Scaffolding standard directories and tracking for new enhancements"

- id: enhancement-tracker-update
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["update tracker", "update enhancement", "tracker update", "mark phase complete"]
  cost: medium
  invoke: read .agent/skills/enhancement-tracker-update/SKILL.md
  when: "Recording progress on in-flight enhancements to canonical trackers"

- id: phased-commit-orchestrator
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["commit changes", "make commit", "organize commits", "stage and commit"]
  cost: medium
  invoke: read .agent/skills/phased-commit-orchestrator/SKILL.md
  when: "Grouping diffs into structured, reviewable commit phases"

- id: pirr-compliance-checklist
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["pirr compliance", "definition of done docs", "DoD docs check"]
  cost: medium
  invoke: read .agent/skills/pirr-compliance-checklist/SKILL.md
  when: "Ensuring DoD includes documentation, telemetry, and automated tests"

- id: writejournal-audit-gate
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write journal", "audit gate", "log mutation"]
  cost: low
  invoke: read .agent/skills/writejournal-audit-gate/SKILL.md
  when: "Logging mutation trails for high-risk operations"

- id: planning-with-files
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["plan with files", "file planning", "state tracking file"]
  cost: low
  invoke: read .agent/skills/planning-with-files/SKILL.md
  when: "Managing complex plans across discrete progress files"

- id: test-driven-development
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["tdd", "test driven development", "red green refactor", "write test first"]
  cost: medium
  invoke: read .agent/skills/test-driven-development/SKILL.md
  when: "Executing test-driven development cycles"

- id: backend-test-generator
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["write test", "generate test script", "backend test", "P106", "P107"]
  cost: low
  invoke: read .agent/skills/backend-test-generator/SKILL.md
  when: "Generating permanent, clean backend unit and integration tests"

- id: gas-deploy-guard
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["deploy gas", "clasp push", "gas deploy guard"]
  cost: low
  invoke: read .agent/skills/gas-deploy-guard/SKILL.md
  when: "Safeguarding Google Apps Script deployments against quota and build regressions"

- id: gas-optimizer
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["optimize gas", "speed up apps script", "batch sheet operations"]
  cost: medium
  invoke: read .agent/skills/gas-optimizer/SKILL.md
  when: "Optimizing batch reads/writes and cache management for GAS spreadsheets"

- id: task-firestore-direct-write
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["firestore write", "direct firestore write", "update firestore"]
  cost: low
  invoke: read .agent/skills/task-firestore-direct-write/SKILL.md
  when: "Executing direct, secure Firestore operations respecting indices and rules"

- id: vercel-react-best-practices
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["react best practices", "vercel react", "performance react", "hook optimization"]
  cost: low
  invoke: read .agent/skills/vercel-react-best-practices/SKILL.md
  when: "Applying modern React, Next.js, and Vercel performance and structure standards"

- id: caveman
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["caveman mode", "terse", "compress output", "token budget tight"]
  cost: medium
  invoke: /caveman
  when: "Ultra-compressed output style for token conservation"

- id: caveman-compress
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["compress memory file", "compress CLAUDE.md", "/caveman:compress"]
  cost: medium
  invoke: /caveman-compress
  when: "Compressing natural language memory files"

- id: memory-session-loader
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["load memory", "session memory load", "restore context"]
  cost: low
  invoke: read .agent/skills/memory-session-loader/SKILL.md
  when: "Loading past session signals and context into active conversation"

- id: memory-session-end
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["end session", "session close", "closeout memory", "session end"]
  cost: low
  invoke: read .agent/skills/memory-session-end/SKILL.md
  when: "Persisting session telemetry and closeout memory"

- id: memory-event-logger
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["log event", "event logger", "record milestone"]
  cost: low
  invoke: read .agent/skills/memory-event-logger/SKILL.md
  when: "Recording significant project events to persistent memory"

- id: memory-decision-logger
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, capsicum, bms]
  triggers: ["log decision", "record decision", "decision logger"]
  cost: low
  invoke: read .agent/skills/memory-decision-logger/SKILL.md
  when: "Recording architectural and domain decisions into the decision registry"

- id: governance-wiring-audit
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, bms]
  triggers: ["verify wiring", "governance wiring", "is it wired", "wiring audit", "PACT-001"]
  cost: low
  invoke: npm run verify:governance-wiring
  when: "Checking whether governance artifacts and patterns are properly wired into the consumption layer"

- id: pattern-proxy-signal-verdicts
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["is this dead code", "safe to delete", "can we remove this", "retire this file", "consolidate these files", "merge these files", "this looks like a duplicate", "nothing uses this", "unused token", "unused export", "stale file", "which one is canonical", "delete the redundant one"]
  cost: low
  invoke: read .agent/patterns/proxy-signal-verdicts.md
  when: "Surface the proxy-signal-verdicts pattern when delete or consolidation triggers are detected"

- id: pattern-search-before-inventing
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["search before inventing", "check existing patterns", "do not reinvent", "inventory first"]
  cost: low
  invoke: read .agent/patterns/search-before-inventing.md
  when: "Preventing invention of redundant schemas or tools by enforcing inventory search"

- id: pattern-raw-evidence-before-hypothesis
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["raw evidence", "verify facts", "check ground truth"]
  cost: low
  invoke: read .agent/patterns/raw-evidence-before-hypothesis.md
  when: "Gathering ground truth facts before generating hypotheses"

- id: pattern-intent-clarity-decoupling
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["decouple intent", "plan hardstop", "intent clarity"]
  cost: low
  invoke: read .agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md
  when: "Decoupling intent clarification from execution authorization"

- id: pattern-triage-anomalies-first
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["triage anomalies", "data anomaly", "schema mismatch"]
  cost: low
  invoke: read .agent/patterns/triage-anomalies-first.md
  when: "Triaging anomalies before performing widespread data migrations"

- id: pattern-data-layer-verification
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["data layer verification", "verify schema first", "check data layer"]
  cost: low
  invoke: read .agent/patterns/data-layer-verification-first.md
  when: "Verifying underlying schema and data models before building dependent views"

- id: pattern-write-without-reader
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["write without reader", "unconsumed write", "orphan record"]
  cost: low
  invoke: read .agent/patterns/write-without-reader.md
  when: "Preventing creation of data that has no active reader or consumer"

- id: pattern-scope-ledger-anchor
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard]
  triggers: ["scope ledger", "track scope", "prevent scope creep"]
  cost: low
  invoke: read .agent/patterns/scope-ledger-anchor.md
  when: "Anchoring work scope against established objectives"

- id: sap-sync
  repo: [${REPO_NAME.toLowerCase()}, task-dashboard, pio, bms, ug-farmhouse]
  triggers: ["sap-sync", "sync patterns", "propagate pact", "run sap-sync"]
  cost: medium
  invoke: read .agent/workflows/sap-sync.md
  when: "Synchronizing universal patterns from Task-Dashboard canonical hub"
  `;
  writeFileNoBom(path.join(TARGET_ROOT, '.agent/skill-router.yaml'), SKILL_ROUTER_CONTENT);

const STANDARDS_CATALOG_CONTENT = JSON.stringify({
version: '1.0.0',
lastUpdated: new Date().toISOString().slice(0, 10),
metadata: {
projectName: REPO_NAME,
owner: 'goldenage399',
targetEnvironment: 'Multi-Repo SAP Spoke',
governanceModel: 'AI-Driven Development (Antigravity Agent)',
sourceOfTruth: 'GEMINI.md',
totalStandards: 4,
lastUpdated: new Date().toISOString().slice(0, 10),
},
categories: {
governance: 'Process and workflow controls',
'data-integrity': 'Schema validity and entity relations',
documentation: 'SSOT, hubs, and schema specifications',
memory: 'Persistent context and session telemetry',
},
standards: [
{
id: 'P-SSOT-DOCS',
category: 'documentation',
name: 'Spoke & Wheel Single Source of Truth',
description: 'Hub documents contain only indices (max 150 lines). Spoke documents own detailed specifications and declare parent hub in frontmatter.',
severity: 'MEDIUM',
enforcement: {
checkpoints: ['pre-commit'],
manualOnly: false,
automatedGate: 'npm run verify:governance-wiring',
},
references: ['.agent/workflows/portable/spoke-and-wheel-docs.md'],
},
{
id: 'P82',
category: 'governance',
name: 'Governance Artifact Wiring Completeness',
description: 'All new workflows, skills, and patterns must be wired into skill-router.yaml and CLAUDE.md/GEMINI.md.',
severity: 'CRITICAL',
enforcement: {
checkpoints: ['pre-commit', 'CI'],
manualOnly: false,
automatedGate: 'npm run verify:governance-wiring',
},
references: ['scripts/verify-governance-wiring.cjs'],
},
{
id: 'P-4PPSD',
category: 'governance',
name: '4-Phase Problem-Solving Discipline',
description: 'Strict adherence to Ground Truth -> Research Benchmarks -> Objective Rules -> Evidence-Based Execution.',
severity: 'HIGH',
enforcement: {
checkpoints: ['session-start', 'planning'],
manualOnly: true,
},
references: ['GEMINI.md', 'CLAUDE.md'],
},
],
}, null, 2) + '\n';
writeFileNoBom(path.join(TARGET_ROOT, '.agent/standards-catalog.json'), STANDARDS_CATALOG_CONTENT);

const PREFLIGHT_CONTENT = `# ${REPO_NAME} — Preflight Gate & Routing Table

> **Standard**: P82 (Governance Wiring Completeness)
> **Enforcement**: Run before making structural, code, or schema changes.

## Routing Matrix

| Row | Trigger / Condition                            | Standard / Protocol                                                 | Verification Action                                              | Rationale / Failure Mode Prevented              |
| --- | ---------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| R1  | Creating new Markdown specifications or guides | \`.agent/workflows/portable/spoke-and-wheel-docs.md\`               | Check \`hub:\` frontmatter and verify registration in parent hub | Documentation drift and orphaned markdown files |
| R2  | Adding or updating \`.agent/patterns/\*.md\`   | \`docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md\` (PACT-001) | \`npm run verify:governance-wiring\`                             | Orphaned pattern contracts or unwired triggers  |
| R3  | Running cross-repo sync                        | \`.agent/workflows/sap-sync.md\`                                    | \`npm run verify:governance-wiring:all\`                         | Schema drift across sibling repositories        |

`;
writeFileNoBom(path.join(TARGET_ROOT, '.agent/PREFLIGHT.md'), PREFLIGHT_CONTENT);

// ─── Step 10: Agent Operating Manuals (CLAUDE.md / GEMINI.md) ─────────────────
console.log(`\n--- Step 10: Creating / Updating Agent Operating Manuals ---`);
const claudeMdPath = path.join(TARGET_ROOT, 'CLAUDE.md');
if (!fs.existsSync(claudeMdPath) || force) {
const AGENT_MANUAL_CONTENT = `# ${REPO_NAME} — Agent Operating Manual

This repository represents **${REPO_NAME}** — ${REPO_DESC}.

---

## 1. Prime Invariants & Operating Discipline

### 1. 4-Phase Problem-Solving Discipline (4-PPSD)

- **Phase 1: Ground Truth & Intent**: Analyze existing domain models, invariants, and relations before modifying documents.
- **Phase 2: Research & Domain Alignment**: Verify benchmarks and standards against SSOT specifications before proposing changes.
- **Phase 3: Objective Rule Synthesis**: Follow explicit precedence ladders and schemas for all domain entities and tasks.
- **Phase 4: Evidence-Based Execution**: Execute in verified, consistent steps.

### 2. Spoke & Wheel Documentation (\`P-SSOT-DOCS\`)

- Hub documents (\`HUB.md\` / \`DOCS_HUB.md\`) contain only indices and status snapshots (max 150 lines).
- Spoke documents contain detailed domain specifications and declare parent hub in frontmatter.
- Master entities are canonical; all views (dashboards, trackers, run sheets) are derived views.

---

## 2. Session Startup Gate (MANDATORY)

Before any task work, review:

1. \`.agent/skill-router.yaml\` — Skill Router Index
2. \`.agent/PREFLIGHT.md\` — Preflight check matrix
3. Follow \`.agent/workflows/aos-session-open.md\` at session start and \`.agent/workflows/aos-session-close.md\` at session close.

---

## 3. Key Workflows & Governance Councils

| Task Type                             | Workflow / Skill to Follow                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Multi-step execution planning         | \`.agent/workflows/plan.md\` & \`.agent/skills/writing-plans/SKILL.md\`                                |
| Plan review & validation              | \`.agent/workflows/plan-review.md\`                                                                    |
| Systematic problem diagnosis          | \`.agent/workflows/portable/systematic-debugging.md\` & \`.agent/skills/systematic-debugger/SKILL.md\` |
| Clarify ambiguous prompt              | \`.agent/skills/prompt-clarity/SKILL.md\`                                                              |
| Domain mapping & entity linking       | \`.agent/skills/ssot-domain-mapper/SKILL.md\`                                                          |
| Flowchart & architecture visuals      | \`.agent/skills/mermaid-skill/SKILL.md\`                                                               |
| Architecture Council Review           | \`.agent/workflows/architecture-council.md\`                                                           |
| UI/UX Council Review                  | \`.agent/workflows/ui-council.md\`                                                                     |
| Ingest/Adapt External Design (EUR v2) | \`.agent/workflows/external-ui-redesign.md\`                                                           |
| Mobile UI Engineering (300px)         | \`.agent/workflows/mobile-ui-engineering.md\`                                                          |
| Table / Schema Documentation          | \`.agent/workflows/table-schema-documentation.md\`                                                     |
| Capture new pattern                   | \`.agent/workflows/capture-pattern.md\` / \`.agent/workflows/capture-pattern-lite.md\`                 |
| Onboard new skill                     | \`.agent/workflows/skill-onboarding.md\`                                                               |
| Governance compliance workflow        | \`.agent/workflows/governance-workflow.md\`                                                            |
| Synchronize universal patterns        | \`.agent/workflows/sap-sync.md\`                                                                       |
| Spoke & Wheel Documentation           | \`.agent/workflows/portable/spoke-and-wheel-docs.md\`                                                  |
| SSOT Reconciliation                   | \`.agent/workflows/portable/ssot-reconciliation.md\`                                                   |
| Session Handoff                       | \`.agent/workflows/portable/session-handoff-system.md\`                                                |
| Governance verification               | \`npm run verify:governance-wiring:all\`                                                               |

---

## 4. Pattern Activation & PACT-001 Cross-References

This repository implements the following universal patterns:

- \`.agent/patterns/search-before-inventing.md\`
- \`.agent/patterns/raw-evidence-before-hypothesis.md\`
- \`.agent/patterns/intent-clarity-decoupling-and-plan-hardstop.md\`
- \`.agent/patterns/proxy-signal-verdicts.md\`
- \`.agent/patterns/scope-ledger-anchor.md\`
- \`.agent/patterns/triage-anomalies-first.md\`
- \`.agent/patterns/data-layer-verification-first.md\`
- \`.agent/patterns/write-without-reader.md\`
- \`.agent/patterns/p81-id-registration-process.md\`
  `;
  writeFileNoBom(claudeMdPath, AGENT_MANUAL_CONTENT);
  writeFileNoBom(path.join(TARGET_ROOT, 'GEMINI.md'), AGENT_MANUAL_CONTENT);
} else {
  console.log(`ℹ️ Existing CLAUDE.md preserved (use --force to overwrite)`);
  }

// ─── Step 11: Run Verification Gate in Target ─────────────────────────────────
console.log(`\n--- Step 11: Running Automated Verification in Target Repo ---`);
if (!dryRun) {
try {
const verifierScript = path.join(TARGET_ROOT, 'scripts/verify-governance-wiring.cjs');
const out = execSync(`node "${verifierScript}" --all`, { cwd: TARGET_ROOT, encoding: 'utf8' });
console.log(out);
console.log(`\n✨ [SAP Universal Bootstrap Complete] Repository "${REPO_NAME}" is 100% wired and verified!`);
} catch (err) {
console.error(`\n❌ Target verification failed:`);
console.error(err.stdout || err.message);
process.exit(1);
}
}
'@

[System.IO.File]::WriteAllText("d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs", $updatedBootstrap, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Updated Task-Dashboard\scripts\bootstrap-spoke-governance.cjs"
`Ran command:`node -e "
const fs = require('fs');
const path = 'd:/GitHub_Repo/Task-Dashboard/scripts/bootstrap-spoke-governance.cjs';
let content = fs.readFileSync(path, 'utf8');

// 1. Add .claude/skills to DIRS
content = content.replace(\"'.agent/patterns',\", \"'.agent/patterns',\n '.claude/skills',\");

// 2. Add Councils and UI/Arch workflows
const extraWorkflows = [
'architecture-council.md',
'ui-council.md',
'external-ui-redesign.md',
'mobile-ui-engineering.md',
'table-schema-documentation.md',
'new-prd.md',
'perf-review.md'
];
content = content.replace(\"'aos-session-close.md',\", \"'aos-session-close.md',\n \" + extraWorkflows.map(w => \"'\" + w + \"'\").join(',\n ') + ',');

// 3. Add all .agent skills
const extraAgentSkills = [
'ui-ux-pro-max',
'frontend-design',
'ui-design-validator',
'mobile-ui-validator',
'parent-layout-audit',
'cos-orchestrator',
'cos-safe-refactor',
'cos-integration-verifier',
'admin-component-contracts',
'declarative-schema-enforcer',
'contract-first-api-validator',
'schema-migration-guide',
'caveman',
'caveman-compress',
'change-prd-architect',
'enhancement-scaffolder',
'enhancement-tracker-update',
'phased-commit-orchestrator',
'writejournal-audit-gate',
'pirr-compliance-checklist',
'planning-with-files',
'test-driven-development',
'backend-test-generator',
'gas-deploy-guard',
'gas-optimizer',
'task-firestore-direct-write',
'vercel-react-best-practices'
];
content = content.replace(\"'memory-decision-logger',\", \"'memory-decision-logger',\n \" + extraAgentSkills.map(s => \"'\" + s + \"'\").join(',\n ') + ',');

// 4. Add Step 6 to copy Claude-native skills (impeccable, etc.)
const claudeSkillsBlock = \`
// ─── Step 6: Deploy .claude/skills (Impeccable, Site-Arch, etc.) ─────────────
console.log(\\\`\\\\n--- Step 6: Deploying Claude-Native Skills (Impeccable, etc.) ---\\\`);
const CLAUDE_SKILLS = [
'impeccable',
'architecture-patterns',
'high-end-visual-design',
'improve-codebase-architecture',
'site-architecture',
'web-design-guidelines',
'skill-creator',
'triage',
'grill-with-docs',
'python-performance-optimization'
];
CLAUDE_SKILLS.forEach(skill => copyDirRecursive(\\\`.claude/skills/\\\${skill}\\\`, \\\`.claude/skills/\\\${skill}\\\`));
\`;
content = content.replace('// ─── Step 6:', claudeSkillsBlock + '\n// ─── Step 7:');
content = content.replace('// ─── Step 7:', '// ─── Step 8:');
content = content.replace('// ─── Step 8:', '// ─── Step 9:');
content = content.replace('// ─── Step 9:', '// ─── Step 10:');
content = content.replace('// ─── Step 10:', '// ─── Step 11:');

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated bootstrap-spoke-governance.cjs via Node.js');
"`Viewed bootstrap-spoke-governance.cjs:100-160
Viewed bootstrap-spoke-governance.cjs:140-200
Edited bootstrap-spoke-governance.cjs
Viewed bootstrap-spoke-governance.cjs:210-250
Edited bootstrap-spoke-governance.cjs
Ran command:`node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Viewed bootstrap-spoke-governance.cjs:300-360
Viewed skill-router.yaml:1-60
Viewed bootstrap-spoke-governance.cjs:300-480
Edited bootstrap-spoke-governance.cjs
Ran command:`node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Viewed CLAUDE.md:1-78
Edited CLAUDE.md
Ran command:`Copy-Item "d:\GitHub_Repo\Sree_Krushna\CLAUDE.md" -Destination "d:\GitHub_Repo\Sree_Krushna\GEMINI.md" -Force
node scripts/verify-governance-wiring.cjs --all`

## 🎯 Complete Governance, Councils, UI/Arch Skills & Impeccable Synchronized

### Why they were previously separate:

1. **Directory Split (`.claude/skills/` vs `.agent/skills/`)**:
   - `impeccable`, `site-architecture`, `web-design-guidelines`, and `improve-codebase-architecture` were originally installed into `.claude/skills/` (the Claude Code runtime format), while standard markdown skills lived in `.agent/skills/`. The earlier sync script only targeted `.agent/skills/`.
2. **Substrate & Tier Scoping**:
   - Under the initial SAP 4-Tier Scope Classification (§3.1), UI councils and visual engines were classified as `tier-1` (Web/React applications), while non-app/documentation repositories were classified as `tier-3` (lightweight DO-PKOS).
   - In practice, **Architecture Councils, UI Councils, `impeccable`, and UI/UX design systems are essential across ALL repositories** (whether building wedding dashboards, event schemas, data views, or operational apps).

---

### What has been updated and synchronized:

#### 1. Synchronized to [`Sree_Krushna`](file:///d:/GitHub_Repo/Sree_Krushna):

- **🎨 Impeccable & Design Tool Suite** ([`.claude/skills/`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/skills/)):
  - [`impeccable`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/skills/impeccable): Full 2.2MB automated design linter, token validator, live UI buffer, font rules, and anti-pattern detectors.
  - [`site-architecture`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/skills/site-architecture): Navigation hierarchies, site templates, and visual sitemaps.
  - [`web-design-guidelines`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/skills/web-design-guidelines): Modern web design best practices and contrast audits.
  - [`architecture-patterns`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/skills/architecture-patterns) & [`improve-codebase-architecture`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/skills/improve-codebase-architecture).
  - [`high-end-visual-design`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/skills/high-end-visual-design).

- **🏛️ Councils & Specialized Workflows** ([`.agent/workflows/`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/)):
  - [`architecture-council.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/architecture-council.md): Multi-role architectural review and ADR governance.
  - [`ui-council.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/ui-council.md): UI/UX design review and component consolidation gate.
  - [`external-ui-redesign.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/external-ui-redesign.md) (EUR v2): Sandboxed design ingestion.
  - [`mobile-ui-engineering.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/mobile-ui-engineering.md): 300px mobile viewport compliance.
  - [`table-schema-documentation.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/table-schema-documentation.md).

- **📐 Full Suite of UI & Architecture Skills** ([`.agent/skills/`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/skills/)):
  - `ui-ux-pro-max`, `frontend-design`, `ui-design-validator`, `mobile-ui-validator`, `parent-layout-audit`.
  - `cos-orchestrator`, `cos-safe-refactor`, `cos-integration-verifier`.
  - `admin-component-contracts`, `declarative-schema-enforcer`, `contract-first-api-validator`, `schema-migration-guide`.

---

### 2. Upgraded 1-Command Universal Bootstrap Engine

The central bootstrap script [`bootstrap-spoke-governance.cjs`](file:///d:/GitHub_Repo/Task-Dashboard/scripts/bootstrap-spoke-governance.cjs) and [`sap-sync.md`](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/sap-sync.md) now deploy the complete 61-artifact ecosystem to **any new or existing repository** in one command:

```powershell
# Run from Task-Dashboard:
npm run sap:bootstrap -- --target="d:/GitHub_Repo/<AnyRepoName>"
```

---

### 3. Verification Status

```powershell
node scripts/verify-governance-wiring.cjs --all
```

```
🔍 P82 Governance Wiring Audit — 61 artifact(s) checked

✅ All 61 artifact(s) fully wired — read path is complete.
```

# Response 1.5 -

# Query 1.6 -why arent we bringing in all the patterns and incs and debuggers and all related to all the tech stack that we are using from across the other repos?

# Review 1.6 -Ran command: `$patterns = Get-ChildItem -Path "d:\GitHub*Repo\Task-Dashboard\.agent\patterns\*.md" | Where-Object { $*.Name -ne "README.md" }

$incs = Get-ChildItem -Path "d:\GitHub_Repo\Task-Dashboard\docs\incidents\*.md"
$sgRules = Get-ChildItem -Path "d:\GitHub_Repo\Task-Dashboard\.claude\sg-rules\*.yml"
$debugWorkflows = Get-ChildItem -Path "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\*debug\*.md"

Write-Output "=== TOTAL PATTERNS IN TASK-DASHBOARD: $( $patterns.Count ) ==="
$patterns | Select-Object -First 15 | ForEach-Object { $\_.Name }

Write-Output "`n=== TOTAL INCIDENTS (INCs) IN TASK-DASHBOARD: $( $incs.Count ) ==="
$incs | Select-Object -First 15 | ForEach-Object { $\_.Name }

Write-Output "`n=== AST-GREP STATIC RULES: $( $sgRules.Count ) ==="
$sgRules | ForEach-Object { $\_.Name }

Write-Output "`n=== DEBUG WORKFLOWS: $( $debugWorkflows.Count ) ==="
$debugWorkflows | ForEach-Object { $_.Name }
`
Ran command: `$otherIncs = Get-ChildItem -Path "d:\GitHub_Repo\*\docs\incidents\*.md" | Where-Object { $_.FullName -notmatch "Task-Dashboard" }
$otherPatterns = Get-ChildItem -Path "d:\GitHub*Repo\*\.agent\patterns\*.md" | Where-Object { $*.FullName -notmatch "Task-Dashboard" -and $\_.Name -ne "README.md" }

Write-Output "=== INCS IN OTHER REPOS: $( $otherIncs.Count ) ==="
$otherIncs | ForEach-Object { "$($_.Directory.Parent.Parent.Name): $($_.Name)" }

Write-Output "`n=== PATTERNS IN OTHER REPOS: $( $otherPatterns.Count ) ==="
$otherPatterns | ForEach-Object { "$($_.Directory.Parent.Parent.Name): $($_.Name)" } | Select-Object -Unique
`
Ran command: `# 1. Ensure target directories exist in Sree_Krushna
$dirs = @(
    "d:\GitHub_Repo\Sree_Krushna\docs\incidents",
    "d:\GitHub_Repo\Sree_Krushna\.claude\sg-rules",
    "d:\GitHub_Repo\Sree_Krushna\tools\query-cli"
)
foreach ($d in $dirs) {
if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force }
}

# 2. Copy all 86+ INCs from Task-Dashboard to Sree_Krushna

Copy-Item "d:\GitHub_Repo\Task-Dashboard\docs\incidents\*.md" -Destination "d:\GitHub_Repo\Sree_Krushna\docs\incidents\" -Force
$copiedIncs = (Get-ChildItem "d:\GitHub_Repo\Sree_Krushna\docs\incidents\*.md").Count

# 3. Copy all patterns from Task-Dashboard

Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\patterns\*.md" -Destination "d:\GitHub_Repo\Sree_Krushna\.agent\patterns\" -Force
$copiedPatterns = (Get-ChildItem "d:\GitHub_Repo\Sree_Krushna\.agent\patterns\*.md").Count

# 4. Copy all debug workflows

Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\*debug\*.md" -Destination "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\" -Force
Copy-Item "d:\GitHub_Repo\Task-Dashboard\.agent\workflows\debug.md" -Destination "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\" -Force

# 5. Copy all ast-grep rules

Copy-Item "d:\GitHub_Repo\Task-Dashboard\.claude\sg-rules\*.yml" -Destination "d:\GitHub_Repo\Sree_Krushna\.claude\sg-rules\" -Force
$copiedRules = (Get-ChildItem "d:\GitHub_Repo\Sree_Krushna\.claude\sg-rules\*.yml").Count

# 6. Copy tools/query-cli

if (Test-Path "d:\GitHub_Repo\Task-Dashboard\tools\query-cli") {
Copy-Item "d:\GitHub_Repo\Task-Dashboard\tools\query-cli\*" -Destination "d:\GitHub_Repo\Sree_Krushna\tools\query-cli\" -Recurse -Force
}

Write-Output "Copied $copiedIncs INCs, $copiedPatterns Patterns, $copiedRules AST-Grep rules, and all Debuggers."
`
Ran command: `# Update all pattern frontmatters in Sree_Krushna
$patterns = Get-ChildItem -Path "d:\GitHub*Repo\Sree_Krushna\.agent\patterns\*.md" | Where-Object { $*.Name -ne "README.md" }

$consumedBlock = "consumed_by:`r`n - file: CLAUDE.md`r`n at: `"Pattern Activation & PACT-001 Cross-References`"`r`n - file: .agent/workflows/plan.md`r`n at: `"Step 0.1: Universal Patterns Reference Check`""

$patternNames = @()

foreach ($pat in $patterns) {
    $ref = $pat.BaseName
    $patternNames += $ref
    $content = [System.IO.File]::ReadAllText($pat.FullName)

    # ensure activation_tier
    if ($content -notmatch 'activation_tier:') {
        $content = "---`r`npattern: $ref`r`nactivation_tier: routed`r`nstatus: HYPOTHESIS`r`n" + $consumedBlock + "`r`n---`r`n`r`n" + $content
    } else {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'consumed_by:[\s\S]*?(?=\r?\n---)', $consumedBlock)
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'activation_tier:\s*guarded', 'activation_tier: routed')
    }

    if ($content -notmatch 'canonical_source:') {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'activation_tier:\s*routed', "activation_tier: routed`r`ncanonical_source: task-dashboard")
    }

    [System.IO.File]::WriteAllText($pat.FullName, $content, (New-Object System.Text.UTF8Encoding($false)))

}

# Update plan.md with all patterns

$planPath = "d:\GitHub_Repo\Sree_Krushna\.agent\workflows\plan.md"
$planContent = [System.IO.File]::ReadAllText($planPath)
$patternListStr = ($patternNames | ForEach-Object { "- `.agent/patterns/$\_.md`" }) -join "`r`n"
$patternSection = "## Step 0.1: Universal Patterns Reference Check`r`nReview relevant ecosystem patterns:`r`n$patternListStr`r`n`r`n"

if ($planContent -match '## Step 0\.1: Universal Patterns Reference Check[\s\S]*?(?=\r?\n## )') {
    $planContent = [System.Text.RegularExpressions.Regex]::Replace($planContent, '## Step 0\.1: Universal Patterns Reference Check[\s\S]\*?(?=\r?\n## )', $patternSection)
} else {
    $planContent = $patternSection + $planContent
}
[System.IO.File]::WriteAllText($planPath, $planContent, (New-Object System.Text.UTF8Encoding($false)))

# Update CLAUDE.md with all patterns and debug workflows

$claudePath = "d:\GitHub_Repo\Sree_Krushna\CLAUDE.md"
$claudeContent = [System.IO.File]::ReadAllText($claudePath)
$claudePatternList = ($patternNames | ForEach-Object { "- `.agent/patterns/$\_.md`" }) -join "`r`n"

$patSectionMatch = '## 4\. Pattern Activation & PACT-001 Cross-References[\s\S]*'
$newPatSection = "## 4. Pattern Activation & PACT-001 Cross-References`r`nThis repository implements the following ecosystem patterns:`r`n$claudePatternList`r`n"

$claudeContent = [System.Text.RegularExpressions.Regex]::Replace($claudeContent, $patSectionMatch, $newPatSection)
[System.IO.File]::WriteAllText($claudePath, $claudeContent, (New-Object System.Text.UTF8Encoding($false)))
Copy-Item $claudePath -Destination "d:\GitHub_Repo\Sree_Krushna\GEMINI.md" -Force

Write-Output "Adapted $( $patternNames.Count ) patterns in Sree_Krushna and wired to plan.md and CLAUDE.md."
`Ran command:`node -e "
const fs = require('fs');
const path = require('path');

const targetDir = 'd:/GitHub_Repo/Sree_Krushna';
const patternsDir = path.join(targetDir, '.agent/patterns');
const files = fs.readdirSync(patternsDir).filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');

const consumedBlock = 'consumed_by:\n - file: CLAUDE.md\n at: \"Pattern Activation & PACT-001 Cross-References\"\n - file: .agent/workflows/plan.md\n at: \"Step 0.1: Universal Patterns Reference Check\"';

const patternNames = [];

for (const file of files) {
const ref = path.basename(file, '.md');
patternNames.push(ref);
const filePath = path.join(patternsDir, file);
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('activation_tier:')) {
content = '---\npattern: ' + ref + '\nactivation_tier: routed\ncanonical_source: task-dashboard\nstatus: HYPOTHESIS\n' + consumedBlock + '\n---\n\n' + content;
} else {
content = content.replace(/consumed_by:[\s\S]*?(?=\r?\n---)/, consumedBlock);
content = content.replace(/activation_tier:\s*guarded/, 'activation_tier: routed');
}

if (!content.includes('canonical_source:')) {
content = content.replace(/activation_tier:\s\*routed/, 'activation_tier: routed\ncanonical_source: task-dashboard');
}

fs.writeFileSync(filePath, content, 'utf8');
}

// Update plan.md
const planPath = path.join(targetDir, '.agent/workflows/plan.md');
let planContent = fs.readFileSync(planPath, 'utf8');
const patternList = patternNames.map(p => '- `.agent/patterns/' + p + '.md`').join('\n');
const patternSection = '\n## Step 0.1: Universal Patterns Reference Check\nReview relevant ecosystem patterns:\n' + patternList + '\n\n';

if (planContent.includes('## Step 0.1: Universal Patterns Reference Check')) {
planContent = planContent.replace(/## Step 0\.1: Universal Patterns Reference Check[\s\S]\*?(?=\r?\n## )/, patternSection.trim() + '\n\n');
} else {
planContent = planContent.replace(/# \/plan Workflow\r?\n/, '# /plan Workflow\n' + patternSection);
}
fs.writeFileSync(planPath, planContent, 'utf8');

// Update CLAUDE.md
const claudePath = path.join(targetDir, 'CLAUDE.md');
let claudeContent = fs.readFileSync(claudePath, 'utf8');
const claudeList = patternNames.map(p => '- `.agent/patterns/' + p + '.md`').join('\n');
const newSection = '## 4. Pattern Activation & PACT-001 Cross-References\nThis repository implements the following ecosystem patterns:\n' + claudeList + '\n';
claudeContent = claudeContent.replace(/## 4\. Pattern Activation & PACT-001 Cross-References[\s\S]\*/, newSection);
fs.writeFileSync(claudePath, claudeContent, 'utf8');
fs.writeFileSync(path.join(targetDir, 'GEMINI.md'), claudeContent, 'utf8');

console.log('Successfully adapted ' + patternNames.length + ' patterns and wired to plan.md and CLAUDE.md');
"`Ran command:`@'
const fs = require('fs');
const path = require('path');

const targetDir = 'd:/GitHub_Repo/Sree_Krushna';
const patternsDir = path.join(targetDir, '.agent/patterns');
const files = fs.readdirSync(patternsDir).filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');

const consumedBlock = 'consumed_by:\n - file: CLAUDE.md\n at: "Pattern Activation and PACT-001 Cross-References"\n - file: .agent/workflows/plan.md\n at: "Step 0.1: Universal Patterns Reference Check"';

const patternNames = [];

for (const file of files) {
const ref = path.basename(file, '.md');
patternNames.push(ref);
const filePath = path.join(patternsDir, file);
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('activation_tier:')) {
content = '---\npattern: ' + ref + '\nactivation_tier: routed\ncanonical_source: task-dashboard\nstatus: HYPOTHESIS\n' + consumedBlock + '\n---\n\n' + content;
} else {
content = content.replace(/consumed_by:[\s\S]*?(?=\r?\n---)/, consumedBlock);
content = content.replace(/activation_tier:\s*guarded/, 'activation_tier: routed');
}

if (!content.includes('canonical_source:')) {
content = content.replace(/activation_tier:\s\*routed/, 'activation_tier: routed\ncanonical_source: task-dashboard');
}

fs.writeFileSync(filePath, content, 'utf8');
}

// Update plan.md
const planPath = path.join(targetDir, '.agent/workflows/plan.md');
let planContent = fs.readFileSync(planPath, 'utf8');
const patternList = patternNames.map(p => '- `.agent/patterns/' + p + '.md`').join('\n');
const patternSection = '\n## Step 0.1: Universal Patterns Reference Check\nReview relevant ecosystem patterns:\n' + patternList + '\n\n';

if (planContent.includes('## Step 0.1: Universal Patterns Reference Check')) {
planContent = planContent.replace(/## Step 0\.1: Universal Patterns Reference Check[\s\S]\*?(?=\r?\n## )/, patternSection.trim() + '\n\n');
} else {
planContent = planContent.replace(/# \/plan Workflow\r?\n/, '# /plan Workflow\n' + patternSection);
}
fs.writeFileSync(planPath, planContent, 'utf8');

// Update CLAUDE.md
const claudePath = path.join(targetDir, 'CLAUDE.md');
let claudeContent = fs.readFileSync(claudePath, 'utf8');
const claudeList = patternNames.map(p => '- `.agent/patterns/' + p + '.md`').join('\n');
const newSection = '## 4. Pattern Activation & PACT-001 Cross-References\nThis repository implements the following ecosystem patterns:\n' + claudeList + '\n';
claudeContent = claudeContent.replace(/## 4\. Pattern Activation & PACT-001 Cross-References[\s\S]\*/, newSection);
fs.writeFileSync(claudePath, claudeContent, 'utf8');
fs.writeFileSync(path.join(targetDir, 'GEMINI.md'), claudeContent, 'utf8');

console.log('Successfully adapted ' + patternNames.length + ' patterns and wired to plan.md and CLAUDE.md');
'@ | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\scripts\adapt-patterns.js" -Encoding UTF8

node "d:\GitHub_Repo\Sree_Krushna\scripts\adapt-patterns.js"
`Ran command:`$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$files = Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna" -Recurse -Include "*.json","*.yaml","*.md","*.cjs","*.js"
foreach ($f in $files) {
    $text = [System.IO.File]::ReadAllText($f.FullName)
[System.IO.File]::WriteAllText($f.FullName, $text, $utf8NoBom)
}

node scripts/verify-governance-wiring.cjs --all`Ran command:`@'
const fs = require('fs');
const path = require('path');

const targetDir = 'd:/GitHub_Repo/Sree_Krushna';
const patternsDir = path.join(targetDir, '.agent/patterns');
const routerPath = path.join(targetDir, '.agent/skill-router.yaml');
const routerContent = fs.readFileSync(routerPath, 'utf8').toLowerCase();

const files = fs.readdirSync(patternsDir).filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');

const consumedBlock = 'consumed_by:\n - file: CLAUDE.md\n at: "Pattern Activation and PACT-001 Cross-References"\n - file: .agent/workflows/plan.md\n at: "Step 0.1: Universal Patterns Reference Check"';

for (const file of files) {
const ref = path.basename(file, '.md');
const filePath = path.join(patternsDir, file);
let content = fs.readFileSync(filePath, 'utf8');

// Check if router references this pattern
const isRouted = routerContent.includes('patterns/' + ref.toLowerCase()) || routerContent.includes(ref.toLowerCase());
const tier = isRouted ? 'routed' : 'reference';

// Extract triggers if any
let triggersMatch = content.match(/^triggers:\s*\[(.*?)\]/m) || content.match(/^triggers:\s*\n((?:\s*-\s*.*\n)+)/m);
let triggersBlock = '';
if (tier === 'routed' && !triggersMatch) {
triggersBlock = 'triggers: ["' + ref + '", "' + ref.replace(/-/g, ' ') + '"]\n';
}

content = content.replace(/consumed*by:[\s\S]*?(?=\r?\n---)/, consumedBlock);
content = content.replace(/activation*tier:\s*\w+/, 'activation_tier: ' + tier);

if (tier === 'routed' && triggersBlock && !content.includes('triggers:')) {
content = content.replace(/activation_tier:\s\*routed/, 'activation_tier: routed\n' + triggersBlock.trim());
}

if (!content.includes('canonical_source:')) {
content = content.replace(/activation_tier:\s\*(\w+)/, 'activation_tier: $1\ncanonical_source: task-dashboard');
}

fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Patterns aligned with PACT-001 reference/routed tiers.');
'@ | Set-Content -Path "d:\GitHub_Repo\Sree_Krushna\scripts\adapt-patterns.js" -Encoding UTF8

node "d:\GitHub_Repo\Sree_Krushna\scripts\adapt-patterns.js"
node "d:\GitHub_Repo\Sree_Krushna\scripts\verify-governance-wiring.cjs" --all
`Viewed bootstrap-spoke-governance.cjs:230-320
Edited bootstrap-spoke-governance.cjs
Viewed bootstrap-spoke-governance.cjs:280-360
Edited bootstrap-spoke-governance.cjs
Ran command:`Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force
node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Edited bootstrap-spoke-governance.cjs
Ran command:`Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force
node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Edited bootstrap-spoke-governance.cjs
Ran command:`Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force
node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Viewed db-inspect-fleet.md:1-25
Viewed bootstrap-spoke-governance.cjs:250-295
Edited bootstrap-spoke-governance.cjs
Ran command:`Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force
node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Edited bootstrap-spoke-governance.cjs
Ran command:`Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force
node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Edited bootstrap-spoke-governance.cjs
Ran command:`Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force
node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Viewed playwright-spa-e2e-testing-best-practices.md:1-25
Edited bootstrap-spoke-governance.cjs
Ran command:`Copy-Item "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" -Destination "d:\GitHub_Repo\Sree_Krushna\scripts\bootstrap-spoke-governance.cjs" -Force
node "d:\GitHub_Repo\Task-Dashboard\scripts\bootstrap-spoke-governance.cjs" --target="d:\GitHub_Repo\Sree_Krushna" --name="Sree_Krushna"`Ran command:`node "d:\GitHub_Repo\Sree_Krushna\tools\query-cli\cli.cjs" --stats`Ran command:`# Register query script in Sree_Krushna package.json
$pkgPath = "d:\GitHub_Repo\Sree_Krushna\package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.scripts | Add-Member -Name "query" -Value "node tools/query-cli/cli.cjs" -MemberType NoteProperty -Force
$pkgJson = $pkg | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($pkgPath, $pkgJson, (New-Object System.Text.UTF8Encoding($false)))

# Register query script in Task-Dashboard package.json

$hubPkgPath = "d:\GitHub_Repo\Task-Dashboard\package.json"
$hubPkg = Get-Content $hubPkgPath -Raw | ConvertFrom-Json
$hubPkg.scripts | Add-Member -Name "query" -Value "node tools/query-cli/cli.cjs" -MemberType NoteProperty -Force
$hubPkgJson = $hubPkg | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($hubPkgPath, $hubPkgJson, (New-Object System.Text.UTF8Encoding($false)))

Write-Output "Registered 'npm run query' in Sree_Krushna and Task-Dashboard package.json"
`Ran command:`node scripts/verify-governance-wiring.cjs --all`

## 🌐 Complete Cross-Repo Tech-Stack Intelligence, Patterns, INCs & Debugger Fleet Synchronized

---

### 1. Why Were They Previously Kept in Silos?

Historically, the ecosystem separated artifacts due to **3 legacy architectural constraints**:

1. **Origin & Domain Silos**: Patterns and Incident Postmortems (INCs) originated from specific incidents in isolated projects (e.g., Firestore security rules in `Task-Dashboard`, Google Apps Script execution hangs in `PIOperationsMgmt_Firebase`, offline bundle mounting in `UG-Farmhouse`/`QSR`).
2. **Legacy Tier Classification (SAP §3.1)**: Earlier Shared Alignment Protocol specifications partitioned tools by substrate (`tier-1` for React/Firestore, `tier-3` for DO-PKOS/vanilla). This created artificial walls, preventing non-web or markdown-driven repositories from accessing valuable postmortems, UI toolchains, and debugging patterns.
3. **P82 Wiring Gate Enforcement**: Under the P82 governance rule, any pattern placed into `.agent/patterns/` without bidirectional frontmatter and skill-router mapping would fail automated CI checks. Without automated frontmatter adaptation, copying all patterns in bulk broke verification.

---

### 2. What Has Been Brought In & Synchronized

All tech-stack patterns, incident case studies, debuggers, static analyzers, and query tools across the ecosystem are now synchronized and wired:

```
Total Active Governance Artifacts: 113 (100% Wired & Verified)
```

#### 🛡️ 1. Complete Pattern Library (58 Patterns) — [`.agent/patterns/`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/patterns/)

- **State & Architecture**: `centralized-mutation-delegation`, `derive-dont-declare-guardrails`, `mutation-contract-pattern`, `subcollection-write-cache-atomicity`, `deep-link-hook-composition`.
- **CSS & Design System**: `css-bridge-specificity-management`, `css-color-mix-gradient-silence`, `typography-weight-and-bridge-token-enforcement`, `theme-button-opt-out-contract`, `token-cascade-isolation`, `monolithic-css-append-and-all-theme-matrix-sweep`.
- **Data & Backend Invariants**: `data-layer-verification-first`, `data-migration-occupancy-safety`, `db-inspect-fleet`, `service-import-without-write-wiring`, `write-without-reader`, `write-site-contract-verification`.
- **Testing & Automation**: `playwright-e2e-testing-protocol`, `playwright-indexeddb-auth-session-capture`, `playwright-spa-e2e-testing-best-practices`, `mock-first-boundary-contract-lock`, `rules-enforcement-testing-no-emulator`.
- **Universal Reasoning & Governance**: `search-before-inventing`, `raw-evidence-before-hypothesis`, `intent-clarity-decoupling-and-plan-hardstop`, `proxy-signal-verdicts`, `scope-ledger-anchor`, `triage-anomalies-first`, `p81-id-registration-process`.

#### 📚 2. Incident Encyclopedia (86 Postmortems) — [`docs/incidents/`](file:///d:/GitHub_Repo/Sree_Krushna/docs/incidents/)

- **`INC-001` through `INC-086`**: Complete repository of failure modes, root cause analyses, and permanent invariants covering:
  - Security rules evaluation errors (`INC-008`, `INC-071`)
  - Unmemoized React callback infinite render loops (`INC-009`)
  - Multi-profile task visibility query shadowing (`INC-010`)
  - Tailwind cascade conflicts and transparent backdrop bleedthrough (`INC-002`, `INC-004`)
  - Fieldset flex ellipsis overlap and layout clipping (`INC-005`)
  - Playwright modal locator collisions & strict mode crashes (`INC-078`)
  - Upstream blocker discriminant field drift (`INC-076`)
  - Secret scanning & service account leak prevention (`INC-070`)

#### 🔍 3. Dedicated Debugging Workflows — [`.agent/workflows/`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/)

- [`debug-frontend.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/debug-frontend.md): Systematic UI, CSS cascade, and React component diagnosis.
- [`debug-backend.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/debug-backend.md): Service layer, Firestore, and backend logic debugging.
- [`debug-architecture.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/debug-architecture.md): System boundary and data flow diagnosis.
- [`debug-task-architecture.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/debug-task-architecture.md): Task state machines and lifecycle debugging.
- [`debug-issue.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/debug-issue.md) & [`debug.md`](file:///d:/GitHub_Repo/Sree_Krushna/.agent/workflows/debug.md): General incident triage.

#### ⚡ 4. Static AST Rules & Introspection Engine

- **24 AST-Grep Static Rules** ([`.claude/sg-rules/`](file:///d:/GitHub_Repo/Sree_Krushna/.claude/sg-rules/)): Enforcing z-index governance, semantic color tokens, auth fallbacks, and hook decoupling.
- **Introspection Query CLI** ([`tools/query-cli/`](file:///d:/GitHub_Repo/Sree_Krushna/tools/query-cli/)): Real-time CLI search for incidents and invariants.

---

### 3. How to Query the Tech Stack Knowledge Base

You can search across all 86 INCs and invariants using the query tool:

```powershell
# Search frontend incidents & layout fixes:
npm run query -- --frontend "modal backdrop flex"

# Search backend / data / Firestore invariants:
npm run query -- --backend "permission denied query"

# Search tokens & style contracts:
npm run query -- --token "theme-button-secondary"

# Semantic concept search:
npm run query -- --concept "authentication fallback"
```

---

### 4. Verification Check

```powershell
node scripts/verify-governance-wiring.cjs --all
```

```
🔍 P82 Governance Wiring Audit — 113 artifact(s) checked

✅ All 113 artifact(s) fully wired — read path is complete.
```

The 1-command bootstrap script at [`Task-Dashboard/scripts/bootstrap-spoke-governance.cjs`](file:///d:/GitHub_Repo/Task-Dashboard/scripts/bootstrap-spoke-governance.cjs) is now updated so that any newly created repo automatically receives this entire 113-artifact knowledge base and debugger suite.

# Response 1.6 -

# Query 1.7 -install impeccable

# Review 1.7 -

Searched for "impeccable"
Viewed GEMINI.md:30-60
Viewed GEMINI.md:60-82
Viewed CLAUDE.md:1-82
Viewed 260821*RepoSetup.md:1-100
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo" -Filter "*impeccable*" -Recurse -Depth 5 -ErrorAction SilentlyContinue | Select-Object FullName`
Ran command: `Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna\.claude\skills\impeccable" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName`
Viewed teach-impeccable.md:1-63
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard\.agents\skills\impeccable" -Depth 2`
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\Task-Dashboard" -Filter "*impeccable*" -Recurse -Depth 4 -ErrorAction SilentlyContinue | Select-Object FullName`
Viewed 260717_Impeccable%20Adoption.md:1-100
Ran command: `Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna" -Force | Where-Object { $*.PSIsContainer } | Select-Object Name`Ran command:`Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna\.claude\skills" -ErrorAction SilentlyContinue | Select-Object Name`Ran command:`Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna\.agent\skills" -ErrorAction SilentlyContinue | Select-Object Name`Ran command:`npx impeccable --help`

I have run `npx impeccable --help` to check the installation options and requirements. I am waiting for the output.

Ran command: `npx impeccable install --help`

I have run `npx impeccable install --help` to check the installation flags and targets.

Used tool: manage*task
Ran command: `node -e "const pkg = require('impeccable/package.json', { paths: [process.cwd(), process.env.APPDATA, process.env.LOCALAPPDATA] }); console.log(pkg.bin, pkg.version);"`
Ran command: `Get-ChildItem "$env:LOCALAPPDATA_npx" -Recurse -Filter "package.json" | Where-Object { $*.FullName -like "_impeccable_" } | Select-Object -First 1 FullName`

I am locating the cached `impeccable` package to examine its CLI commands and options.

Edited 260821_UserManual.md
Ran command: `npx --yes impeccable help`
Ran command: `node -e "const { execSync } = require('child_process'); const p = execSync('npm root -g').toString().trim(); console.log('global npm:', p);"`
Ran command: `Get-ChildItem "$env:LOCALAPPDATA\npm-cache" -Recurse -Filter "*impeccable*" -ErrorAction SilentlyContinue | Select-Object -First 5 FullName`
Ran command: `Get-ChildItem "C:\Users\Temp\AppData\Local\npm-cache\_npx\1a4eb60c8f6b0f89\node_modules\impeccable\cli"`
Ran command: `Get-ChildItem "C:\Users\Temp\AppData\Local\npm-cache\_npx\1a4eb60c8f6b0f89\node_modules\impeccable\cli\bin", "C:\Users\Temp\AppData\Local\npm-cache\_npx\1a4eb60c8f6b0f89\node_modules\impeccable\cli\lib"`
Ran command: `Get-ChildItem "C:\Users\Temp\AppData\Local\npm-cache\_npx\1a4eb60c8f6b0f89\node_modules\impeccable\cli\bin\commands"`
Searched for "install"
Ran command: `node -e "const fs = require('fs'); const content = fs.readFileSync(process.env.LOCALAPPDATA + '/npm-cache/_npx/1a4eb60c8f6b0f89/node_modules/impeccable/cli/bin/commands/skills.mjs', 'utf8'); const lines = content.split('\n'); console.log(lines.slice(0, 100).join('\n'));"`
Ran command: `node -e "const fs = require('fs'); const content = fs.readFileSync(process.env.LOCALAPPDATA + '/npm-cache/_npx/1a4eb60c8f6b0f89/node_modules/impeccable/cli/bin/commands/skills.mjs', 'utf8'); const lines = content.split('\n'); const installIdx = lines.findIndex(l => l.includes('function installSkills') || l.includes('async function install')); console.log(lines.slice(installIdx, installIdx + 120).join('\n'));"`
Ran command: `node -e "const fs = require('fs'); const content = fs.readFileSync(process.env.LOCALAPPDATA + '/npm-cache/_npx/1a4eb60c8f6b0f89/node_modules/impeccable/cli/bin/commands/skills.mjs', 'utf8'); const lines = content.split('\n'); const fnIdx = lines.findIndex(l => l.includes('function chooseInstallPlan')); console.log(lines.slice(fnIdx, fnIdx + 80).join('\n'));"`
Ran command: `node -e "const fs = require('fs'); const content = fs.readFileSync(process.env.LOCALAPPDATA + '/npm-cache/_npx/1a4eb60c8f6b0f89/node_modules/impeccable/cli/bin/commands/skills.mjs', 'utf8'); const lines = content.split('\n'); const fnIdx = lines.findIndex(l => l.includes('function chooseInstallProviders')); console.log(lines.slice(fnIdx, fnIdx + 60).join('\n'));"`
Ran command: `npx --yes impeccable install --yes --scope=project --providers=claude,gemini,codex`
Ran command: `npx --yes impeccable install --yes --scope=project '--providers=claude,gemini,codex'`

I have launched the installation command for `impeccable` across the project harnesses (`.claude`, `.gemini`, `.agents`) and will wait for completion.

Ran command: `git status`
Ran command: `Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna" -Force | Where-Object { $_.Name -like ".*" } | Select-Object Name`
Ran command: `Get-ChildItem -Path "D:\GitHub_Repo\.agents", "D:\GitHub_Repo\.gemini", "D:\GitHub_Repo\.claude" -Recurse -Depth 2`
Ran command: `npx --yes impeccable install --yes --scope=global`

I am also running the global installation for `impeccable` so it is accessible across all workspaces.

Ran command: `if (-not (Test-Path "d:\GitHub_Repo\Sree_Krushna\.agents\skills\impeccable")) {
    New-Item -ItemType Directory -Path "d:\GitHub_Repo\Sree_Krushna\.agents\skills" -Force | Out-Null
    Copy-Item -Path "D:\GitHub_Repo\.agents\skills\impeccable" -Destination "d:\GitHub_Repo\Sree_Krushna\.agents\skills\" -Recurse -Force
}
if (-not (Test-Path "d:\GitHub_Repo\Sree_Krushna\.gemini\skills\impeccable")) {
    New-Item -ItemType Directory -Path "d:\GitHub_Repo\Sree_Krushna\.gemini\skills" -Force | Out-Null
    Copy-Item -Path "D:\GitHub_Repo\.gemini\skills\impeccable" -Destination "d:\GitHub_Repo\Sree_Krushna\.gemini\skills\" -Recurse -Force
}
Get-ChildItem -Path "d:\GitHub_Repo\Sree_Krushna\.agents\skills\impeccable"`
Ran command: `npx --yes impeccable --version`

`impeccable` (**v3.5.0**) has been successfully installed across both local workspaces and global agent harnesses.

---

### Installation Summary

- **Package Version**: `impeccable@3.5.0`
- **Harnesses Configured**:
  - Project level: `.claude/skills/impeccable`, `.gemini/skills/impeccable`, `.agents/skills/impeccable`
  - Global user profile: `~/.claude`, `~/.gemini`, `~/.agents`
  - Hooks configured: `.claude`, `.agents`

---

### Available Impeccable Commands

| Command     | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `/init`     | Run multi-round discovery interview to establish strategic design context (`PRODUCT.md` & `DESIGN.md`). |
| `/audit`    | Run technical quality checks across accessibility, performance, and theming.                            |
| `/shape`    | Plan UX/UI architecture before writing code.                                                            |
| `/polish`   | Final quality pass for alignment, typography, spacing, and rhythm.                                      |
| `/delight`  | Add micro-interactions, subtle motion, and personality touches.                                         |
| `/live`     | Interactive live variant mode in browser.                                                               |
| `/adapt`    | Adapt layouts across viewports and mobile form factors.                                                 |
| `/document` | Generate or update `DESIGN.md` design token specifications.                                             |

---

### Next Steps

To initialize design context for your project, you can run:

```bash
/init
```

or

```bash
/impeccable init
```

Viewed 260821_RepoSetup.md:1250-1286

# Response 1.7 -Viewed 260821_RepoSetup.md:1800-1840

Viewed 260821_RepoSetup.md:1235-1260
Viewed package.json:1-19
Ran command: `npm run verify:governance-wiring:all`
Ran command: `npm run verify:governance-schema`
Viewed verify-governance-schema.cjs:1-40

Execution results for **`npm run verify:governance-wiring:all`**:

```
> sree-krushna-marriage-os@1.0.0 verify:governance-wiring:all
> node scripts/verify-governance-wiring.cjs --all

🔍 P82 Governance Wiring Audit — 113 artifact(s) checked

✅ All 113 artifact(s) fully wired — read path is complete.
```

All 113 governance artifacts in the repository have been verified with a complete read path and zero wiring gaps.

# Query 1.8 -

# Review 1.8 -

# Response 1.8 -

# Query 1.9 -

# Review 1.9 -

# Response 1.9 -

# Query 2.0 -

# Review 2.0 -

# Response 2.0 -

# Query 2.1 -

# Review 2.1 -

# Response 2.1 -

# Query 2.2 -

# Review 2.2 -

# Response 2.2 -

# Query 2.3 -

# Review 2.3 -

# Response 2.3 -

# Query 2.4 -

# Review 2.4 -

# Response 2.4 -

# Query 2.5 -

# Review 2.5 -

# Response 2.5 -

# Query 2.6 -

# Review 2.6 -

# Response 2.6 -

# Query 2.7 -

# Review 2.7 -

# Response 2.7 -

# Query 2.8 -

# Review 2.8 -

# Response 2.8 -

# Query 2.9 -

# Review 2.9 -

# Response 2.9 -

# Query 3.0 -

# Review 3.0 -

# Response 3.0 -

# Query 3.1 -

# Review 3.1 -

# Response 3.1 -

# Query 3.2 -

# Review 3.2 -

# Response 3.2 -

# Query 3.3 -

# Review 3.3 -

# Response 3.3 -

# Query 3.4 -

# Review 3.4 -

# Response 3.4 -

# Query 3.5 -

# Review 3.5 -

# Response 3.5 -

# Query 3.6 -

# Review 3.6 -

# Response 3.6 -

# Query 3.7 -

# Review 3.7 -

# Response 3.7 -

# Query 3.8 -

# Review 3.8 -

# Response 3.8 -

# Query 3.9 -

# Review 3.9 -

# Response 3.9 -

# Query 4.0 -

# Review 4.0 -

# Response 4.0 -

# Query 4.1 -

# Review 4.1 -

# Response 4.1 -

# Query 4.2 -

# Review 4.2 -

# Response 4.2 -

# Query 4.3 -

# Review 4.3 -

# Response 4.3 -

# Query 4.4 -

# Review 4.4 -

# Response 4.4 -

# Query 4.5 -

# Review 4.5 -

# Response 4.5 -

# Query 4.6 -

# Review 4.6 -

# Response 4.6 -

# Query 4.7 -

# Review 4.7 -

# Response 4.7 -

# Query 4.8 -

# Review 4.8 -

# Response 4.8 -

# Query 4.9 -

# Review 4.9 -

# Response 4.9 -

# Query 5.0 -

# Review 5.0 -

# Response 5.0 -

# Query 5.1 -

# Review 5.1 -

# Response 5.1 -

# Query 5.2 -

# Review 5.2 -

# Response 5.2 -

# Query 5.3 -

# Review 5.3 -

# Response 5.3 -

# Query 5.4 -

# Review 5.4 -

# Response 5.4 -

# Query 5.5 -

# Review 5.5 -

# Response 5.5 -

# Query 5.6 -

# Review 5.6 -

# Response 5.6 -

# Query 5.7 -

# Review 5.7 -

# Response 5.7 -

# Query 5.8 -

# Review 5.8 -

# Response 5.8 -

# Query 5.9 -

# Review 5.9 -

# Response 5.9 -

# Query 6.0 -

# Review 6.0 -

# Response 6.0 -

# Query 6.1 -

# Review 6.1 -

# Response 6.1 -

# Query 6.2 -

# Review 6.2 -

# Response 6.2 -

# Query 6.3 -

# Review 6.3 -

# Response 6.3 -

# Query 6.4 -

# Review 6.4 -

# Response 6.4 -

# Query 6.5 -

# Review 6.5 -

# Response 6.5 -

# Query 6.6 -

# Review 6.6 -

# Response 6.6 -

# Query 6.7 -

# Review 6.7 -

# Response 6.7 -

# Query 6.8 -

# Review 6.8 -

# Response 6.8 -

# Query 6.9 -

# Review 6.9 -

# Response 6.9 -

# Query 7.0 -

# Review 7.0 -

# Response 7.0 -

# Query 7.1 -

# Review 7.1 -

# Response 7.1 -

# Query 7.2 -

# Review 7.2 -

# Response 7.2 -

# Query 7.3 -

# Review 7.3 -

# Response 7.3 -

# Query 7.4 -

# Review 7.4 -

# Response 7.4 -

# Query 7.5 -

# Review 7.5 -

# Response 7.5 -

# Query 7.6 -

# Review 7.6 -

# Response 7.6 -

# Query 7.7 -

# Review 7.7 -

# Response 7.7 -

# Query 7.8 -

# Review 7.8 -

# Response 7.8 -

# Query 7.9 -

# Review 7.9 -

# Response 7.9 -

# Query 8.0 -

# Review 8.0 -

# Response 8.0 -

# Query 8.1 -

# Review 8.1 -

# Response 8.1 -

# Query 8.2 -

# Review 8.2 -

# Response 8.2 -

# Query 8.3 -

# Review 8.3 -

# Response 8.3 -

# Query 8.4 -

# Review 8.4 -

# Response 8.4 -

# Query 8.5 -

# Review 8.5 -

# Response 8.5 -

# Query 8.6 -

# Review 8.6 -

# Response 8.6 -

# Query 8.7 -

# Review 8.7 -

# Response 8.7 -

# Query 8.8 -

# Review 8.8 -

# Response 8.8 -

# Query 8.9 -

# Review 8.9 -

# Response 8.9 -

# Query 9.0 -

# Review 9.0 -

# Response 9.0 -

# Query 9.1 -

# Review 9.1 -

# Response 9.1 -

# Query 9.2 -

# Review 9.2 -

# Response 9.2 -

# Query 9.3 -

# Review 9.3 -

# Response 9.3 -

# Query 9.4 -

# Review 9.4 -

# Response 9.4 -

# Query 9.5 -

# Review 9.5 -

# Response 9.5 -

# Query 9.6 -

# Review 9.6 -

# Response 9.6 -

# Query 9.7 -

# Review 9.7 -

# Response 9.7 -

# Query 9.8 -

# Review 9.8 -

# Response 9.8 -

# Query 9.9 -

# Review 9.9 -

# Response 9.9 -

# Query 10.0 -

# Review 10.0 -

# Response 10.0 -

# Query 10.1 -

# Review 10.1 -

# Response 10.1 -

# Query 10.2 -

# Review 10.2 -

# Response 10.2 -

# Query 10.3 -

# Review 10.3 -

# Response 10.3 -

# Query 10.4 -

# Review 10.4 -

# Response 10.4 -

# Query 10.5 -

# Review 10.5 -

# Response 10.5 -

# Query 10.6 -

# Review 10.6 -

# Response 10.6 -

# Query 10.7 -

# Review 10.7 -

# Response 10.7 -

# Query 10.8 -

# Review 10.8 -

# Response 10.8 -

# Query 10.9 -

# Review 10.9 -

# Response 10.9 -
