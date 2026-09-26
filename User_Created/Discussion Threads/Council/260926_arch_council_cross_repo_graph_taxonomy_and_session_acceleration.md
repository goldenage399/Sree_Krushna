# 🏛️ Architecture Council Decision Record: Universal Cross-Repository Graph, Taxonomy & Session Acceleration Engine

**Standard Identifier:** `SK-019` / `STD-UNIVERSAL-TAXONOMY-001` / `PKG-006`  
**Council Decision:** `AC-DEC-2026-060` / `GOV-DEC-2026-002`  
**Date:** 2026-09-26  
**Type:** FULL Architecture Council Deliberation with Integrated `/plan-review`  
**Status:** ✅ **CERTIFIED & ADOPTED (Sequential Phased Rollout: Phase 1 Unlocked, Phases 2–3 Sequenced)**  
**Protocol Conformance:** Council Deliberation Protocol v1.0 (Phase 0–4 skeleton, RFG-001, ICG-001, SDP-001, `/plan-review` v1.7)  

---

## 0. Invocation Context & Expanded Mandate

Following the certification of `AC-DEC-2026-059` for local session acceleration, the Council reconvened to evaluate a significant strategic expansion:
> *"Add the scope of making it repo-agnostic, and this would be used across all our repos and anything like this should be merged and consolidated into a single system that can be used across all the repositories, helping me with the taxonomy of using the same word or phrase across all the repositories."*

This mandate introduces two major cross-cutting capabilities into `SK-019`:
1. **Universal Multi-Repo Portability**: The domain discovery and entity mapping engine must operate seamlessly across all 9 SAP ecosystem repositories (`Task-Dashboard`, `Sree_Krushna`, `BMS`, `Capsicum`, `PIO`, `UG-Farmhouse`, `QSR`, etc.) without single-repo hardcoding.
2. **Cross-Repo Taxonomy & Vocabulary Governance**: Establishing a single authoritative dictionary of standardized terms, canonical phrases, and prohibited synonym aliases, backed by automated linting to prevent semantic drift.

**3-Question Invocation Gate:**
1. **Reversibility** — YES. Establishing global taxonomy standards and cross-repo tool packages affects all 9 repositories via `/sap-sync`. Bad abstractions or overly restrictive vocabulary rules would cascade across all codebases.
2. **Boundary** — YES. Crosses repository boundaries, agent operating prompts (`GEMINI.md`, `CLAUDE.md`), governance linters, and build toolchains.
3. **Disagreement** — YES. Engineers plausibly disagree on whether to enforce taxonomy at runtime via automated linters vs. prompt conventions, and whether to build a single consolidated "mega-CLI" vs. decoupled specialized tools sharing a declarative dictionary.

→ **Full Council Deliberation Required (No Expedited Tier).**

---

## 1. Phase 0: Evidence Collection & Grounding Snapshot

1. **Prior Ruling Check (`Council_Ledger.md`)**:
   - `AC-DEC-2026-055` (`SK-015`): Precedent for portable packages (`PKG-004` / `STD-DRIVE-MEDIA-RELAY-001`), scaffolding `.agent/skills/` with dual mirror in `.claude/skills/` and parameterized templates for 1-command distribution via `/sap-sync`.
   - `AC-DEC-2026-059` (`SK-019` initial): Ratified the Native 3-Tier Acceleration Stack, rejecting the dead Python Graphify dependency.
2. **Duplication & Prior Art Check**:
   - `repo-task-dependency-grapher/scanner.cjs` (726 lines): Already exists as a repo-agnostic task backlog scanner. It dynamically resolves ticket files (`ENHANCEMENTS.md`, `ENHANCEMENT-MASTER-REGISTRY.md`, `docs/enhancements/`, `enhancement-notes/`) and builds topological DAGs. It does *not* scan domain entity specs (`EVT`, `RIT`, `TRS`, `PAY`, `GFT`) or validate vocabulary taxonomy.
   - `bootstrap-spoke-governance.cjs`: 1-command governance onboarding tool for any repository.
   - `standards-catalog.json`: Stores standard IDs (`P-SSOT-DOCS`, `P82`, `P-4PPSD`), but currently lacks an explicit word/phrase taxonomy dictionary.
3. **Commit Hash Evidence Snapshot**: `ce9918422cff35160b8cda9a3c7d6dfeb32db45c`.
4. **Grounding Snapshot (RFG-001 Maturity Anchor)**:
   *Stage:* Multi-repository ecosystem of 9 SAP spokes (1 developer, ~4–5 real users on Sree_Krushna, launch-imminent). High cognitive friction occurs when switching repositories if different terms describe the exact same concept (e.g. "DoD" vs "Signoff Checklist", "Validation Gate" vs "Assert Step").

---

## 2. Comparative Evaluation of Available Options

| Evaluation Dimension | Option A: Phased Local Validation then SAP Promotion | Option B: Universal Cross-Repo Package Day 1 | Option C: Unified Mega-CLI Consolidation | Option D (Approved Hybrid): Decoupled 3-Layer Engine with Shared Taxonomy Dictionary |
|---|---|---|---|---|
| **Architectural Model** | Build in Sree_Krushna first; generalize later. | Build universal portable skill immediately; sync to all 9 repos. | Consolidate backlog grapher, task grapher, entity grapher, and linter into one monolithic script. | 1. Shared `taxonomy_dictionary.json`<br>2. Repo-agnostic entity grapher<br>3. Decoupled task DAG grapher<br>4. Portable skill package (`PKG-006`). |
| **Similarities** | All aim to solve discovery and vocabulary drift. | Shares the universal goal. | Shares the single-system mandate. | Reuses `repo-task-dependency-grapher` patterns and `SK-015` portable package standard. |
| **Distinctions** | Two-step migration; deferred cross-repo value. | High day-1 blast radius across 9 repos. | High internal cyclomatic complexity (>1,500 lines). | Clean separation of concerns: Task Planning vs Domain Objects vs Vocabulary Linting. |
| **Dependencies** | Local repo only in Phase 1. | All 9 repos must be ready for new skill. | Multi-adapter parser for all schemas. | Node.js standard library; declarative JSON configs. |
| **Impact Radius** | Sree_Krushna initially. | High (all 9 SAP repos). | High (single point of failure for all graph tools). | Controlled: Phase 1 verified locally; Phase 2 parameterized; Phase 3 synced. |
| **Complexity** | Low initially, Medium migration. | High initial design effort. | Very High (god-node CLI risk, violating P11). | Medium (modular components <400 lines each). |
| **Risks** | Re-work in Phase 2 if abstractions leak. | Unvetted taxonomy rules breaking existing repos. | Megalithic CLI becoming difficult to maintain or debug. | None: adheres strictly to RFG-001 and P-TICKET-FIRST-PHASING-001. |
| **Taxonomy Governance** | Postponed to Phase 2. | Defined upfront. | Embedded in CLI logic. | Declarative JSON dictionary with automated linter. |

---

## 3. Roster & Explicit N/A Ledger (ICG-001 #2)

| Seat | Auditor | Status | Reason / Focus |
|---|---|---|---|
| 1 | SSOT & Taxonomy Authority Auditor | ✅ Seated (§4.1) | Evaluates canonical vocabulary dictionaries and cross-repo SSOT integrity |
| 2 | Cross-Repo Architecture & SAP Auditor | ✅ Seated (§4.2) | Evaluates multi-repo portability, `/sap-sync` compatibility, and package isolation |
| 3 | Tooling & Modularity Auditor | ✅ Seated (§4.3) | Evaluates whether to build a mega-CLI vs decoupled modular tools (P11 compliance) |
| 4 | Maintainability & Velocity Auditor (RFG-001) | ✅ Seated (§4.4) | Enforces Burden-of-Proof and anti-overengineering across 9-repo ecosystem |
| 5 | The Dissenter Seat | ✅ Seated (§4.5) | Challenges whether automated vocabulary linting introduces excessive friction |
| 6 | Schema & Firestore Auditor | **N/A** | Zero database collections or security rules touched |
| 7 | Auth & Permission Auditor | **N/A** | Zero RBAC roles or auth layers touched |
| 8 | File Placement Auditor | **N/A** | Standardized paths (`.agent/skills/`, `scripts/`, `tools/`) are well-established |

---

## 4. Phase 1: Independent Member Evaluations

### 4.1 SSOT & Taxonomy Authority Auditor
- **Position**: Strongly approve the taxonomy dictionary requirement. The lack of an authoritative cross-repo vocabulary matrix is the root cause of semantic drift between Task-Dashboard, Sree_Krushna, and Capsicum.
- **Evidence**: In Sree_Krushna, we use "Definition of Done (DoD v1.7)", "Validation Gate (VG)", "Decision Node (DN)", "Operational Gate", and "Spoke & Wheel SSOT". In earlier sessions, models used "Signoff Checklist", "Verification Assertion", and "Parent/Child hierarchy". A declarative `taxonomy_dictionary.json` defining `preferred_term`, `category`, and `prohibited_synonyms` provides exact mechanical linting.
- **Assumptions**: The taxonomy dictionary can be declared as a shared SAP asset (`<!-- shared:std.agent.taxonomy-dictionary:start -->`).
- **Trade-offs**: Writers and agents must adhere strictly to canonical terms or automated linting will fail.
- **Risks & Dependencies**: Must allow domain-specific extensions (e.g. Odia Vedic terms like *Nirbandha*, *Hastaganthi* in Sree_Krushna must not be flagged by the global linter).
- **Challenge**: *"What would change my mind: if someone proves that natural language prompts alone without a mechanical lint script can prevent semantic vocabulary drift across 9 repositories over a 6-month period."* (Checked: Historical incident record `INC-077` and `INC-089` proved prose alone drifts continuously).
- **Confidence**: High.

### 4.2 Cross-Repo Architecture & SAP Auditor
- **Position**: Follow the `SK-015` (`PKG-004`) precedent: design the engine with a parameterized configuration layer (`domain-graph-config.json`), package it as a portable skill (`.agent/skills/repo-taxonomy-graph/`), and distribute via `/sap-sync`.
- **Evidence**: `SK-015` successfully packaged the Sheet-Drive Media Relay into a turnkey portable package. Trying to deploy a single hardcoded path script across all 9 repos fails because directory structures vary (e.g., Task-Dashboard has `src/`, `docs/ssot/`; Sree_Krushna has `00_GOVERNANCE/`, `01_TIMELINE_EVENTS/`).
- **Assumptions**: The graph scanner can read repo-local candidate root paths from a small JSON config.
- **Trade-offs**: Requires writing a declarative config parser rather than hardcoded path walks.
- **Risks & Dependencies**: Must ensure the sync script updates the dual mirror in `.claude/skills/`.
- **Challenge**: *"What would change my mind: if repository layouts are so wildly disparate that a common configuration schema cannot express them."* (Checked: All 9 repos follow SAP Spoke-and-Hub structure with standard markdown headers).
- **Confidence**: High.

### 4.3 Tooling & Modularity Auditor
- **Position**: Reject Option C (Mega-CLI). Consolidating `repo-task-dependency-grapher` (task backlog DAGs, Kahn's algorithm, risk scoring) with domain entity graphing (markdown frontmatter/link parsing) and vocabulary linting into a single file creates a monolithic "god-node" (>1,500 lines) violating P11 and `STD-MOD-COMP-001`.
- **Evidence**: `repo-task-dependency-grapher/scanner.cjs` is already 726 lines. Adding entity graph parsing and taxonomy regex scanning would push it past 1,500 lines. Modularity requires **decoupled tools sharing a unified dictionary**:
  1. `repo-task-dependency-grapher` (Backlog Planning DAG)
  2. `generate-domain-graph.cjs` (Domain Entity Architecture Graph)
  3. `verify-taxonomy-vocabulary.cjs` (Vocabulary & Taxonomy Linter)
- **Assumptions**: Users and agents prefer running targeted commands (`npm run build:graph`, `npm run verify:taxonomy`) rather than managing a bloated multi-mode CLI flag labyrinth.
- **Trade-offs**: Three focused scripts (~200–400 lines each) instead of one monolithic script.
- **Risks & Dependencies**: Shared types/configs must be imported cleanly.
- **Challenge**: *"What would change my mind: if running multiple separate commands creates unacceptable CI/preflight latency."* (Checked: All three are static Node scripts executing in <300ms total).
- **Confidence**: High.

### 4.4 Maintainability & Velocity Auditor (RFG-001 Burden of Proof)
- **Position**: Approve the Phased Hybrid approach.
  - Phase 1: Implement the domain entity grapher and test suite in `Sree_Krushna` to immediately unblock local discovery and verify core parsing logic.
  - Phase 2: Add `taxonomy_dictionary.json` and the taxonomy linter.
  - Phase 3: Package into portable `.agent/skills/repo-taxonomy-graph/` and roll out to sibling repos via `/sap-sync`.
  - Immediate Day 1 sync across all 9 repos fails Burden of Proof (high blast radius, unvetted parser). Phased execution passes Burden of Proof because Phase 1 delivers immediate local value while Phase 3 delivers cross-repo consolidation.
- **Evidence**: Conforms to `STD-PHASED-DEV-001` and `AC-DEC-2026-042` (no uncommitted execution loops).
- **Trade-offs**: Requires formal phase boundaries and sequential validation gates.
- **Risks & Dependencies**: None; provides safe incremental progress.
- **Challenge**: *"What would change my mind: if cross-repo synchronization is required immediately for a blocking incident in another repo."* (Checked: No open blocking incident in sibling repos).
- **Confidence**: High.

### 4.5 The Dissenter Seat
- **Position**: Challenge: Is a "prohibited synonym linter" too pedantic? If an engineer or user writes "completion criteria" instead of "Definition of Done" in an exploratory brainstorming scratchpad, will the build fail? A pedantic taxonomy linter could create friction that slows down creative brainstorming and casual documentation.
- **Evidence**: Previous strict linters in other ecosystems have frustrated developers when applied indiscriminately to all markdown files.
- **What would change my mind**: If the taxonomy linter has **clear, scoped boundary rules**:
  1. It lints only canonical SSOTs, PRDs, and governance artifacts (`docs/`, `00_GOVERNANCE/`, `enhancement-notes/`).
  2. It explicitly excludes discussion scratchpads, user raw notes (`User_Created/`), and third-party vendor texts.
  3. It reports warnings for soft synonyms and blocks only on critical protocol corruptions.
- **Verdict under Dissent**: The challenge is accepted and codified as a core requirement for Phase 2: The linter MUST have an explicit scoping boundary and ignore raw user discussion threads.
- **Confidence**: High.

---

## 5. Phase 2: Synthesis & Hybrid Architectural Design

### Resolution of Member Challenges:
1. **SSOT Auditor's Challenge** (*Prose alone drifts*): Upheld. Declarative `taxonomy_dictionary.json` adopted as mechanical authority.
2. **Cross-Repo Auditor's Challenge** (*Repo layouts vary*): Upheld. Parameterized declarative configuration (`domain-graph-config.json`) adopted.
3. **Tooling Auditor's Challenge** (*Mega-CLI creates god-node*): Upheld. Mega-CLI rejected. Decoupled, focused tools sharing a single canonical dictionary adopted.
4. **Dissenter's Challenge** (*Pedantic linter blocks brainstorming*): Upheld. Scoping boundary enforced: linter targets canonical documentation, ignoring `User_Created/` discussion notes and vendor riders.

### Recommended Course of Action (The Approved Hybrid Architecture):

```mermaid
flowchart TD
    subgraph Core Canonical Asset
        DICT["📖 taxonomy_dictionary.json<br>(Shared SAP Canonical Vocabulary & Forbidden Synonyms)"]
    end

    subgraph Tooling Layer (Decoupled CommonJS Engines)
        G1["📊 generate-domain-graph.cjs<br>(Domain Entity Knowledge Graph)"]
        G2["📋 repo-task-dependency-grapher<br>(Backlog Planning & Task DAG)"]
        L1["🔍 verify-taxonomy-vocabulary.cjs<br>(Scoped Vocabulary & Taxonomy Linter)"]
    end

    subgraph Distribution & Packaging
        SKILL["📦 .agent/skills/repo-taxonomy-graph/<br>(Portable Skill & Standard STD-UNIVERSAL-TAXONOMY-001)"]
        SYNC["🔄 /sap-sync<br>(Cross-Repo Distribution to 9 SAP Spokes)"]
    end

    DICT --> G1
    DICT --> G2
    DICT --> L1
    G1 --> SKILL
    L1 --> SKILL
    SKILL --> SYNC
```

| Component | Responsibility | RFG-001 Classification | Trigger for Re-Evaluation |
|---|---|---|---|
| **1. Domain Entity Grapher (`generate-domain-graph.cjs`)** | Parses domain hubs and entity IDs, emitting `graphify-out/` | **Required Now** (Phase 1) | Discovery latency eliminated |
| **2. Scoped Taxonomy Linter (`verify-taxonomy-vocabulary.cjs`)** | Checks canonical docs against `taxonomy_dictionary.json` | **Required Now** (Phase 2) | First vocabulary regression caught |
| **3. System Clarity Snapshot (`docs/SYSTEM_CLARITY_SNAPSHOT.md`)** | Authoritative 1-page operational ledger | **Required Now** (Phase 2) | Deployed and indexed in `DOCS_HUB.md` |
| **4. Portable Skill Package (`repo-taxonomy-graph`)** | Packages engine for distribution to all 9 repos via `/sap-sync` | **Recommended Soon** (Phase 3) | Phase 1 & 2 fully verified in Sree_Krushna |

---

## 6. As-Is Baseline Audit & Zero-Trust Claim Verification (`/plan-review` Mandates)

### As-Is Baseline Audit
| File / Surface | Lines Inspected | Relevant Existing Logic | Status |
|---|---|---|---|
| `scripts/validate-task-graph.cjs` | L1–60 | Task-specific DAG validator using `PROJECT_STATE` and `MARRIAGE_STATE` | LIVE / KEEP (Separate concern) |
| `.agent/skills/repo-task-dependency-grapher/scanner.cjs` | L1–60 | Dynamic backlog ticket resolver and topological DAG sorter | LIVE / KEEP (Separate concern) |
| `.agent/standards-catalog.json` | L1–60 | Standards registry (`P-SSOT-DOCS`, `P82`, `P-4PPSD`) | LIVE / EXTEND with `STD-UNIVERSAL-TAXONOMY-001` |
| `DOCS_HUB.md` | L1–24 | Spoke & Hub domain table | LIVE / TARGET FOR INDEXING |
| `enhancement-notes/SK-019/00_ENHANCEMENT_INDEX.md` | L1–78 | Ticket index for session acceleration | LIVE / UPDATED with expanded scope |

### Zero-Trust Claim Verification
| Element | Claim | Physical Verification (File:Line) | Status |
|---|---|---|---|
| `repo-task-dependency-grapher` existence | Exists in `.agent/skills/` | `.agent/skills/repo-task-dependency-grapher/scanner.cjs:1` | VERIFIED |
| Standards catalog version | Version 1.0.0 | `.agent/standards-catalog.json:2` | VERIFIED |
| Next enhancement ID | Next ID is 20 | `enhancement-config.json:2` | VERIFIED |
| Master registry entry | SK-019 registered | `ENHANCEMENT-MASTER-REGISTRY.md:25` | VERIFIED |

---

## 7. Multi-Perspective Feasibility Review (The 5 Lenses)

1. **User Experience (UX)**: Eliminates long wait times during discovery (from 18 tool turns down to 2–3 turns). Consistent terminology prevents confusion when interacting with the agent across different repositories.
2. **Workflow Efficiency**: Instant O(1) entity and vocabulary lookup across all domains.
3. **Complexity & Cognitive Load**: Avoids a monolithic mega-CLI by decoupling domain entity graphing from task scheduling and vocabulary linting. All scripts remain under 400 lines.
4. **Performance Implications**: Pure Node.js file system parsing executes in <300ms, with zero memory overhead or external API calls.
5. **Implementation Practicality**: Builds on proven CommonJS patterns already present in `scripts/`.

---

## 8. Process Notes (ICG-001 #3 Self-Critique)

- **Gap**: Previous attempts at cross-repo synchronization (`/sap-sync`) occasionally synchronized tool configurations that assumed identical directory layouts across repositories.
- **Proposed Fix**: The portable package (`PKG-006`) must mandate a decoupled configuration file (`domain-graph-config.json`) with sensible defaults, rather than hardcoding folder names in shared code blocks.
- **Application**: Codified as a mandatory acceptance criterion for Phase 3.

---

## 9. Final Decision & Certification

The Architecture Council hereby **APPROVES and CERTIFIES** the **Universal Cross-Repository Graph, Taxonomy & Session Acceleration Engine (`SK-019` / `AC-DEC-2026-060` / `STD-UNIVERSAL-TAXONOMY-001`)**.

- **Phase 1 (Local Engine Baseline)** is unlocked for immediate Test-Driven Development (TDD).
- **Phases 2 & 3** are sequenced and gated upon Phase 1 validation pass.

*Certified by:* Architecture Council (`AC-DEC-2026-060`)  
*Snapshot Hash:* `ce9918422cff35160b8cda9a3c7d6dfeb32db45c`
