---
name: repo-task-dependency-grapher
description: Universal, repository-agnostic skill to scan, audit, topologically sort, and visualize pending tasks, technical debt, and enhancements as a dependency DAG with blast radius, effort scoring, and non-breaking incremental rollout plans.
triggers:
  - "/repo-task-dependency-grapher"
  - "map task dependencies"
  - "topological task graph"
  - "repo task dependency graph"
  - "backlog dependency dag"
  - "audit backlog dependencies"
---

# Repo-Agnostic Task Dependency Grapher Skill (`repo-task-dependency-grapher`)

<!-- shared:skill.repo-task-dependency-grapher.core:start -->

This skill provides a **universal, repository-agnostic engine** for discovering pending development tasks, mapping their hard and soft technical dependencies into a Directed Acyclic Graph (DAG), calculating implementation feasibility and timeline estimates, and generating safe, incremental rollout sequences that prevent breaking live production applications.

---

## 🎯 Architectural Principles

1. **Backlog as a Directed Acyclic Graph (DAG)**:
   - Tasks are **nodes**; technical prerequisites and architectural affinities are **edges**.
   - Circular dependencies ($A \to B \to A$) represent architectural deadlocks and are detected automatically before work commences.
2. **Topological Sequencing (Kahn's Algorithm)**:
   - Work is linearized into executable queues where all prerequisites are guaranteed complete before downstream execution begins.
   - Nodes with in-degree 0 are identified as immediately actionable ("Ready Now").
3. **Blast Radius & God-Node Weighting**:
   - Risk is not just effort; it is failure domain size. Touching a 3,000-line routing monolith carries higher risk than editing an isolated utility file.
4. **Non-Breaking Incremental Delivery**:
   - High blast radius nodes must be accompanied by preflight gates, feature flags, or additive dual-path migrations.

---

## 📋 4-Phase Execution Pipeline

### Phase 1: Multi-Source Discovery Adapter

The skill scans the repository for task entities using standard source adapters:

| Source Type | Discovery Target | Parsed Fields |
| :--- | :--- | :--- |
| **Markdown Registry** | `ENHANCEMENTS.md`, `TODO.md`, `BACKLOG.md` | Task ID, Title, Status, Category, Prerequisites |
| **Technical Debt Logs** | `TECHNICAL_DEBT.md`, `.agent/technical-debt.md` | Violation ID, Target File, Rule Broken, Severity |
| **Implementation Gaps** | `docs/IMPLEMENTATION_GAPS.md`, `docs/gaps/` | Gap ID, Component, Impact, Target Solution |
| **Incident Postmortems** | `docs/incidents/INC-*.md` | Incident ID, Invariants (`INV-*`), Unaddressed Fixes |
| **Source Annotations** | `TODO:`, `FIXME:`, `DEPRECATED:`, `STUB:` | File, Line Number, Comment Text, Author |
| **External Databases** | Firestore `tasks` collection, GitHub Issues API | Document ID, Title, Assigned Department, Status |

**Dynamic Repo Prefix & Multi-Registry Discovery (amended 2026-09-22)**: The scanner resolves the canonical enhancement prefix dynamically using system intelligence: (1) reads `enhancement-config.json` (`canonical_prefix` or `id_prefix`), (2) falls back to heuristic frequency scanning over `ENHANCEMENTS.md` / `ENHANCEMENT-MASTER-REGISTRY.md`, and (3) matches cross-repo foreign references (`\b[A-Z]{2,10}-\d+\b`). Eliminates hardcoded ticket prefixes and enables turnkey adoption across any repository without configuration friction. Packaged as `scanner.cjs` to guarantee seamless CommonJS and ESM (`type: module`) runtime interoperability.

**Zero-Gap Clustered & Note Discovery with Attribute Merging (amended 2026-09-22)**: `resolveEnhancementFiles()` replaces the old hardcoded 2-file registry list. It (1) follows Markdown links from a root registry to `docs/enhancements/*.md` or `enhancement-notes/**/*.md`, and (2) falls back to a bounded directory walk of those two folders for files nobody linked. Ingests clustered markdown headings (`### **ID: Title**`), parses full dependency keywords (`Depends On`, `Parent`, `Prerequisites`, `Dependencies`, `Blocked by`), and implements idempotent attribute merging across summary registries and detail cluster files. Eliminates false in-degree-0 "Ready Now" tasks across sharded repositories. Fully verified by `--self-test` and cross-repo dogfooding.

**Single-file consolidation (2026-09-22)**: `scanner.js` and `scanner.cjs` used to be hand-maintained duplicates in this directory (and its `.claude/` mirror). Removed `scanner.js`; `scanner.cjs` is now the only copy, matching what `package.json` (`graph:tasks`) and `.agent/skill-router.yaml` already invoked.

**Data Directionality & Write Boundary (binding, amended 2026-09-18)**: This skill is **read-only** against every source above. It never writes back to `ENHANCEMENTS.md`, any local Markdown registry, or Firestore. Findings are emitted as the Phase 4 diagram/report only; applying a finding back into a host repo's registry is a separate, explicitly-approved human or automation step outside this skill's scope. Rationale: an automated bidirectional writer was evaluated and rejected as premature complexity for an unproven, zero-invocation skill — see the amendment record cited at the bottom of this file. Firestore specifically: the `tasks` collection may be **read** for discovery; this skill must **never** write to Firestore directly — task creation always routes through `/task-firestore-direct-write`. *(Recommended Soon: a mechanical lint gate blocking any direct Firestore write call from this skill's code, triggered the first time Phase 4 is extended with any write capability.)*

---

### Phase 1.5: Static Coupling Probe — **Deferred (RFG-001 Future Extension)**

Originally scoped as a ripgrep-shortlist + ast-grep-confirm pass to augment developer-declared prerequisites with physical import/call references (catching silent coupling like the one behind INC-096). **Not implemented as of 2026-09-18** — deferred rather than built, because this skill has zero real invocations to date and the addition is new engineering surface, not a bug fix. Static import-graph analysis also only proves module-level coupling, not confirmed call-level relationships, and can miss transitive or dynamically-resolved dependencies — so even once built, it augments, never replaces, developer-declared prerequisites.

**Re-open trigger**: the first time this skill runs against a real repo and either (a) produces a verifiably wrong DAG edge/verdict traceable to a missed static-code coupling, or (b) ripgrep/ast-grep scanning is already adopted elsewhere in that repo's toolchain, lowering the reuse cost.

---

### Phase 2: Topological Graph Engine

1. **Cycle Detection & Sanity Validation**:
   - Runs Depth-First Search (DFS) or Kahn's algorithm to ensure acyclicity.
   - If a cycle is detected, emits a blocking diagnostic report highlighting the circular deadlock.
2. **In-Degree Calculation**:
   - Calculates the number of uncompleted inbound edges for every task.
   - $\text{In-Degree} = 0 \implies$ Actionable immediately.
   - $\text{In-Degree} > 0 \implies$ Blocked by upstream dependencies.
3. **Critical Path Analysis (CPM)**:
   - Computes the longest sequence of dependent tasks determining the minimum project timeline.

---

### Phase 3: Multi-Factor Risk & Feasibility Calculator

For every task node, the engine computes an **Effort & Blast Radius Score**:

$$\text{Risk Score} = E_{\text{base}} \times \left(1 + \frac{C_{\text{fanout}}}{10}\right) \times G_f \times M_{\text{tier}}$$

Where:
- $E_{\text{base}}$: Base development effort (1 = trivial tweak, 3 = standard component, 5 = multi-file feature, 8 = complex system refactor, 13 = epic rewrite).
- $C_{\text{fanout}}$: Architectural coupling / Number of downstream dependent modules consuming this component.
- $G_f$: **God-Node Multiplier**:
  - $1.0$: Normal isolated file ($<400$ lines).
  - $1.5$: Moderately large file ($400–800$ lines).
  - $2.5$: Monolith / God-Node ($>800$ lines, e.g. root monolith controllers or large orchestrators).
- $M_{\text{tier}}$: **Criticality Multiplier**:
  - $1.0$: Leaf UI component, static styling, documentation.
  - $1.5$: Core business logic, routing, data aggregation.
  - $2.0$: Financial ledger, authorization, cryptographic keys, live database schema mutations.

---

### Phase 4: Output Generation & Rollout Safeguards

**Sanitization pass (mandatory, pre-render — amended 2026-09-18)**: before any diagram or report is rendered, run a scoped redaction filter over the output text only (never over internal graph-node data used by Phase 2/3 logic). Pattern set is intentionally narrow to avoid corrupting legitimate technical content (a blanket regex over free-form Markdown produces false positives on placeholder emails, template literals, and code samples):

- API-key-shaped prefixes (e.g. `AIza`, `sk-`, `ghp_`, and similar known secret-token prefixes).
- Email addresses matching a real domain pattern (`@gmail.com`, the repo's own org domain, etc.).
- Values immediately following config keys named `apiKey`, `token`, `secret`, `password`, or `allowedUsers` in scanned source.

Matches are **tagged, not silently deleted** — replace with `[REDACTED:pattern-type]` so a reviewer can see redaction occurred rather than an unexplained gap. *(Recommended Soon: expand pattern coverage and audit false-positive rate, triggered by the first false positive or the first real sensitive string caught during dogfooding.)*

The skill produces two core artifacts:

1. **Interactive Mermaid DAG Diagram**:
   - Clustered subgraphs by Urgency Tier (Tier 0 Critical Fixes $\to$ Tier 1 Core $\to$ Tier 2 Polish $\to$ Tier 3 Secondary).
   - Distinct color palettes indicating execution readiness (Green = In-Degree 0 Ready, Amber = Upstream In-Flight, Red = Blocked).
2. **Step-by-Step Progressive Delivery Plan**:
   - For every high-risk node, defines:
     - **Verification Command**: Automated test suite, lint check, or diagnostic script.
     - **Rollback Condition**: How to immediately revert if live regressions appear.
     - **Canary Strategy**: Feature flag, read-only shadow run, or isolated staged deployment.

---

**Amendment record**: [260917_arch_council_repo_agnostic_task_dependency_grapher.md](../../../User_Created/Discussion%20Threads/Council/260917_arch_council_repo_agnostic_task_dependency_grapher.md) — Amendment 1 (2026-09-18) closed 5 gaps between this spec and the original ratification; see that file for full Phase 1/2 reasoning.

<!-- shared:skill.repo-task-dependency-grapher.core:end -->
