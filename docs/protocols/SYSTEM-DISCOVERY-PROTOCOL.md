# 🛡️ System Discovery & Architectural Evaluation Protocol

**Protocol ID**: SDP-001
**Aliases**: System Discovery Protocol (SDP-001)
**Status**: Production Active
**Last Updated**: 2026-06-17
**Parent Document**: [CLAUDE.md](../../CLAUDE.md)

---

## 🎯 Protocol Overview

**Purpose**: Prevent duplicate solutions, repeated documentation, enforce problem-space boundaries, and ensure architectural proposals are evaluated against the full capability spectrum.

**Scope**: Applies to ALL suggestions in the following domains:
- Architecture decisions and structural changes
- UI/UX enhancements and component modifications
- Automation scripts and workflow pipelines
- Documentation creation and enhancement tracking
- Any feature that could be tied to existing registry, cluster, or enhancement

---

## 🛡️ System Discovery Guardrail

### **Mandatory First Step**

Before suggesting ANY new solution, you MUST:

1. **Discovery First** - Execute `proto-system-discovery`
2. **Decision Flow**:
   - If existing enhancement exists → **Update it** (use `proto-updateEnhancement`)
   - If related work exists → **Link and extend** existing documentation
   - If nothing exists → **Propose new** only after proving no relevant matches found
3. **Transparency** - Must explicitly show discovery results and action rationale

---

## 🚨 Mandatory Discovery Sequence

### **Before Suggesting ANY New Systems, Tools, or Tracking**

```yaml
mandatory_discovery_sequence:
  step_0_cache_check:
    action: "Query .cache/research-map.json for related research"
    protocol: "URC-001 Phase 2"
    reference: "docs/protocols/UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md"

  step_0b_diagnostic_check:
    action: "Check .cache/diagnostic-map.json for component diagnostics"
    protocol: "UDGD-001"
    reference: "docs/protocols/UNIVERSAL-DOM-GEOMETRY-DIAGNOSTICS-PROTOCOL.md"

  step_0c_cache_override:
    condition: "If cache hit with ≥0.75 confidence"
    action: "Reuse findings, skip expensive discovery"
    benefit: "85-95% token savings"

  step_1:
    action: "Execute proto-system-discovery for relevant domain"
    condition: "Only if cache miss"

  step_2:
    action: "Check enhancement registry"
    target: "ENHANCEMENT-MASTER-REGISTRY.md"
    coverage: "136+ enhancements across 4 clusters"

  step_3:
    action: "Search relevant cluster docs"
    targets:
      - "UI-QUALITY-ENHANCEMENT-CLUSTER.md"
      - "GOVERNANCE-ENHANCEMENT-CLUSTER.md"
      - "INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md"
      - "BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md"

  step_4:
    action: "Verify existing ENH-XXX enhancement IDs"
    method: "Search for enhancement identifiers"

  step_5:
    action: "ONLY THEN suggest solutions using existing systems"
    requirement: "Must demonstrate discovery was performed"
```

---

## 🔬 §6 — Capability-Spectrum Check (Contracts / Schemas / LOCKs)

**Added**: 2026-06-17 · **Origin**: ADR-012 failure-mode analysis + Queries 1.9/2.0 refinements (`260617_Th2_TaskLifeCycle.md`)

Steps 1–5 prevent *duplication* — they answer **"does a solution already exist?"**. They do **not** answer **"does the proposed design cover the full capability spectrum of its domain?"**. These are orthogonal axes. A proposal can pass discovery (no prior art to reuse) and still be silently narrowed to the immediate use case. §6 closes that axis.

**Why Steps 1–5 do not surface this:** existence-of-prior-art and coverage-of-capability are different questions. Discovery confirms you are not rebuilding an existing system; it never forces you to enumerate the full set of cases a *new contract* must serve. The blocker-contract incident converged on a task-to-task model because the implementation/data layer was reviewed but the domain-taxonomy layer (`BLOCKING_TYPES.js`, 21 types / 7 categories) was not — and nothing in Steps 1–5 required it.

### §6.0 — Trigger: reviews are not cleanly separable from proposals (outcome-based)
An architectural review rarely ends at observation; it evolves into options and a recommendation. Applicability MUST NOT depend on how the work was initially classified, nor on the **artifact type** alone — because scope narrows *during* the review, before any artifact exists. A review has entered **solution space** the moment it is expected to — or begins to — produce any of:
- a recommended implementation path
- a schema / data-contract recommendation
- a registry **LOCK** proposal
- an **ADR** recommendation
- a roadmap adjustment
- a deprecation recommendation
- a migration strategy
- a future-state architectural direction

Two compliant modes:
1. Run §6 from the **start** of any architectural review, **or**
2. Explicitly **reclassify** and invoke §6 the instant the work enters solution space (per the list above).

Lightweight diagnosis producing none of those outcomes does not require §6 — but the obligation attaches **automatically** the instant it does. A discussion may not begin as diagnosis, drift into architecture, and thereby bypass the check. Self-classifying a contract proposal as "review" or "just analysis" MUST NOT disable this gate.

### §6.1 — FIRST establish the evaluation boundary (problem space before solution)
Entering solution space (§6.0) is distinct from **establishing the evaluation boundary**. The blocker incident failed not merely because it entered solution space, but because the **scope narrowed before the full problem space was established** — task-to-task was treated as the boundary until `BLOCKING_TYPES.js` expanded it to all blocker categories, at which point the recommendation changed materially.

Therefore, **before** any schema, contract, LOCK, abstraction, or architectural recommendation is proposed, the reviewer MUST first establish and **document a Problem-Space Boundary**:
- **What capability spectrum is being evaluated?**
- **What source of truth defines that spectrum?**
- **Which artifacts were used to determine it?** (files, registries, constants, taxonomies, ADRs, architecture plans, roadmap)
- **What known categories are intentionally IN scope?**
- **What known categories are intentionally OUT of scope** (with rationale)?

The first question is **not** "What is the right solution?" — it is **"What is the complete problem space this solution must serve?"** Only after the boundary is established and documented may the recommendation be evaluated against it.

### §6.2 — Artifacts that MUST be reviewed to set the boundary
- Domain **constants / enums / taxonomies** (`src/constants/*`) — the authoritative capability list.
- Existing **schemas** (`firestore.rules`, `DEFAULT_*` shapes, type files).
- **Registries** (`COMPONENT_REGISTRY.md`, enhancement registry) and existing **LOCKs**.
- Relevant **ADRs** (canonical-field / contract precedents).
- **Roadmap / milestone** docs (future categories and delivery phases).
- Existing **domain service interfaces**.

### §6.3 — Verification (performed, not assumed)
The proposing artifact (ADR / LOCK) MUST contain BOTH:
1. a **Problem-Space Boundary** statement (§6.1) — spectrum, source of truth, in-scope, out-of-scope; and
2. a **Capability Coverage table** that cites the taxonomy **source file** and enumerates **every category** from it, showing how the proposed contract represents it — or marks it explicitly out-of-scope with rationale.

**A contract LOCK missing either the boundary statement or the coverage table is INVALID and must be re-done.** A reviewer verifies by checking the table against the cited source file. This makes "performed vs assumed" objectively checkable: the boundary + table (citing the source) are the proof.

### §6.4 — Artifact Selection (which artifact(s) does this review produce?)
A single architectural review may produce **more than one** artifact. Evaluate **each concern independently**:

| Concern produced | Artifact | Home |
|---|---|---|
| A decision + rationale (why chosen / why deferred) | **ADR** | `docs/adr/` |
| A locked data/field/schema contract | **LOCK inside the ADR** (ADR-010/012 precedent) | `docs/adr/` |
| A process/protocol lesson | **Protocol amendment** | `docs/protocols/` |
| Forward work — Simple (≤2d, single system) | Enhancement standalone file (Path A) + cluster entry | `enhancement-notes/` |
| Forward work — Complex (**any** of: >2d · cross-cutting · ≥2 consuming systems · ≥2 future milestones · high institutional-memory need) | **Full workstream** (folder + `00_ENHANCEMENT_INDEX.md` + cluster entry + registry pointer, Path B) | `enhancement-notes/` |
| Pure awareness (no rationale, no work, no cross-system impact) | Registry line only | registry |

**Escalation rule:** a *registry-line-only* is valid **only** when there is no rationale to preserve **and** no deferred work **and** no cross-cutting impact **and** no institutional-memory need. If **any** is present, escalate to the matching substantive artifact. Defaulting to "a registry line" or "bury it in the ADR" without running this check is the failure §6.4 exists to prevent. Worked example: this review produced an ADR (ADR-012), a protocol amendment (this §6), **and** a Complex workstream (TASK-180) — three concerns, three artifacts.

Once the problem-space boundary statement, capability coverage table, and artifact selections under §6 are documented, the discovery and evaluation phase is complete. The agent MUST transition directly to the plan review phase governed by `.agent/workflows/plan-review.md` to perform the multi-perspective review of the implementation plan prior to execution.

### Governance rule
No ADR, schema, data contract, service abstraction, or registry LOCK is **complete** until §6 has been performed and both its Problem-Space Boundary statement and Capability Coverage table are present. Reference example: `docs/adr/ADR-012-blocker-dependency-contract.md`.

---

## 🎯 Discovery Domains

### **UI Architecture**
**Action**: Search UI-QUALITY-ENHANCEMENT-CLUSTER.md for existing UI work
**Coverage**: 53+ UI/UX enhancements
**Reference**: [UI-QUALITY-ENHANCEMENT-CLUSTER.md](../enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md)

### **Automation**
**Action**: Search INFRASTRUCTURE cluster for existing automation
**Coverage**: 42+ infrastructure enhancements
**Reference**: [INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md](../enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md)

### **Governance**
**Action**: Search GOVERNANCE cluster for process improvements
**Coverage**: 22+ governance enhancements
**Reference**: [GOVERNANCE-ENHANCEMENT-CLUSTER.md](../enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md)

### **Documentation**
**Action**: Search 579+ docs for existing solutions
**Tools**: HOW-TO-FIND-THINGS.md discovery guide
**Reference**: [HOW-TO-FIND-THINGS.md](../HOW-TO-FIND-THINGS.md)

---

## 🚫 Forbidden Suggestions

**DO NOT suggest creating**:

- ❌ New task tracking systems (enhancement registry exists with 136+ items)
- ❌ New project management tools (proto-governance intelligence exists)
- ❌ Manual enhancement lists (intelligent auto-routing available)
- ❌ Basic approaches when sophisticated systems exist
- ❌ New documentation without checking existing enhancement coverage

---

## ✅ Available Systems You Must Use

### **Enhancement Registry**
**Capability**: 136+ enhancements across 4 clusters with intelligent routing
**Access**: ENHANCEMENT-MASTER-REGISTRY.md
**Commands**: `node scripts/enhancement-pipeline-cli.cjs status --detailed`

### **Proto Governance**
**Capability**: Natural language governance with auto-classification
**Access**: PROTO-GOVERNANCE-INTELLIGENCE-SYSTEM.md
**Commands**: proto-addEnhancement, proto-updateEnhancement, proto-system-discovery

### **Proto Commands**
**Capability**: Intelligent enhancement management
**Available**: proto-addEnhancement, proto-updateEnhancement, proto-system-discovery
**Reference**: [PROTO-GOVERNANCE-COMPLETE-MANUAL.md](./PROTO-GOVERNANCE-COMPLETE-MANUAL.md)

### **Testing Infrastructure & Live Data Inspection**
**Capability**: Comprehensive screenshot, validation systems, and live database inspection workflows (P53)
**Coverage**: GAP-TEST-002, authenticated testing, visual regression detection, and `pi-ops` live data auditing
**References**: 
- [SCREENSHOT-TESTING-MASTER-GUIDE.md](../testing/SCREENSHOT-TESTING-MASTER-GUIDE.md)
- [db-inspect.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/db-inspect.md) — Live DB inspection workflow

### **Documentation System**
**Capability**: 579+ docs with user/agent navigation
**Access**: HOW-TO-FIND-THINGS.md
**Reference**: [HOW-TO-FIND-THINGS.md](../HOW-TO-FIND-THINGS.md)

### **Persistent Diagnostic Cache**
**Capability**: 92-99% token reduction for layout/CSS analysis
**Access**: .cache/diagnostic-map.json
**Reference**: [diagnostic-cache-quick-reference.md](../claude-navigation/diagnostic-cache-quick-reference.md)

---

## ⚡ Automatic Triggers

### **When User Asks**
- "what's pending"
- "what tasks"
- "organize work"
- "track progress"

**Required Action**: Execute proto-system-discovery FIRST, use existing systems

### **Before Suggestions**
- UI changes
- Automation
- Architecture
- Documentation creation
- Live production data audit or query verification

**Required Action**: Execute proto-system-discovery FIRST, check [db-inspect.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/db-inspect.md) to reuse existing inspection tools

### **Forbidden Action**
Suggest creating duplicate systems or custom inspection scripts without discovery proof

---

## 🛠️ Proto-System-Discovery Command Specification

### **Command Syntax**
```bash
proto-system-discovery <query>
```

### **Execution Steps**

1. **Enhancement Registry Search**
   - Search `ENHANCEMENT-MASTER-REGISTRY.md` for matches to `<query>`
   - Check all 136+ enhancements

2. **Cluster Document Search**
   - Search relevant cluster docs:
     - `UI-QUALITY-ENHANCEMENT-CLUSTER.md` for UI/UX work
     - `GOVERNANCE-ENHANCEMENT-CLUSTER.md` for process improvements
     - `INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md` for automation/tooling
     - `BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md` for business logic

3. **Enhancement ID Search**
   - Search for related `ENH-XXX` enhancement IDs
   - Check cross-references

4. **Documentation & Script Search**
   - Check 579+ existing docs and `src/scripts/` (e.g. `db-inspect.cjs` via [db-inspect.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/workflows/db-inspect.md)) for overlapping solutions
   - Use HOW-TO-FIND-THINGS.md for navigation

### **Output Format**

```yaml
discovery_results:
  exact_matches:
    - "ENH-UI-012: TaskCreationPage UX Enhancement"
    - "ENH-INFRA-035: Repository Knowledge Structure Enhancement"

  partial_matches:
    - "ENH-UI-014: TaskCreationPage Accessibility Crisis"
    - "ENH-INFRA-043: Universal Research Knowledge Cache"

  related_docs:
    - "docs/architecture/PROFILE-PROJECT-ASSIGNMENT-ARCHITECTURE.md"
    - "docs/protocols/PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md"
    - ".agent/workflows/db-inspect.md"

  no_matches: "Confirmed - no existing solutions found for [specific query]"

recommended_action:
  type: "update|extend|create_new"
  target: "ENH-UI-012|existing_doc_path|new_enhancement"
  rationale: "Clear explanation of why this action path was chosen"
```

---

## 🎯 Success Pattern

```
proto-system-discovery
  → Check existing systems
  → Use available tools
  → Leverage intelligence
  → Don't reinvent
```

---

## 🚨 Compliance Requirements

### **Mandatory Compliance**
This guardrail is **mandatory**. Any suggestion bypassing discovery is invalid and must be re-executed through this protocol.

### **Discovery Proof Required**
Any suggestion without `proto-system-discovery` results is **INVALID** and must be re-executed.

### **Transparency Requirement**
Must explicitly show discovery results and action rationale to user.

---

## 🔄 Session Initialization Reminder

### **At Start of ANY Governance/Enhancement/Task Tracking/Data Audit Discussion**

```yaml
🛡️ PROTOCOL REMINDER - CHECK EXISTING SYSTEMS FIRST:
  enhancement_registry: "136 enhancements tracked with intelligent auto-routing"
  proto_governance: "Natural language governance intelligence active"
  testing_infrastructure: "Comprehensive screenshot, validation, and live db-inspect systems operational"
  documentation_system: "579+ docs with intelligent navigation available"
  persistent_diagnostic_cache: ".cache/diagnostic-map.json - Load for layout/CSS work (92-99% token savings)"

mandatory_before_suggestions:
  - "Check: node scripts/enhancement-pipeline-cli.cjs status --detailed"
  - "Read: CLAUDE.md for available proto-commands and systems"
  - "Use: Existing tools and scripts before suggesting new ones"
  - "Inspect: Run db-inspect workflow if evaluating live Firestore states"
  - "Apply: Proto-governance intelligence for complex tasks"
  - "Load: .cache/diagnostic-map.json before any diagnostic analysis work"
```

---

## 🧭 Discovery-First Workflow

### **Phase 1 Complete: 2025-11-03**

**Before searching, creating, or suggesting anything:**

### **Step 1: Start with Discovery Guide**

**Primary Entry**: `docs/HOW-TO-FIND-THINGS.md`

**Use Cases**:
- Finding documentation (579+ docs)
- Discovering automation (314 scripts)
- Locating protocols/architecture
- Understanding system organization

**Decision Trees**:
- "I want to fix a bug" → bug-fix decision tree
- "I want to build a feature" → feature development path
- "I need a script" → scripts/README.md
- "I need architecture context" → domain-specific indexes
- "I need live prod data checks" → db-inspect.md workflow

### **Step 2: Check Scripts Before Creating**

**Catalog**: `scripts/README.md`

**Checklist**:
- Does automation already exist? (314 scripts cataloged)
- Is there an NPM alias? (84 commands)
- Can existing script be adapted?
- What's the pattern category (CLI/Plugin/Config)?

**Prevents**: Duplicate automation, script sprawl, maintenance burden

### **Step 3: Apply JSDoc Templates**

**Guide**: `docs/development-guidelines/JSDOC-TEMPLATE-GUIDE.md`

**Triggers**:
- Creating new service/component/hook
- Significant file modification
- Adding architecture/protocol references

**Snippets**:
- `jsdoc-service` → Service files
- `jsdoc-component` → React components
- `jsdoc-hook` → Custom hooks
- `jsdoc-util` → Utility modules
- `jsdoc-script` → Automation scripts

**Strengthens**: Code→docs bidirectional linkage

---

## ⚠️ Enforcement Rules

### **Rule 1: Discovery Before Documentation**
Use HOW-TO-FIND-THINGS.md BEFORE suggesting new documentation

### **Rule 2: Discovery Before Automation**
Check scripts/README.md BEFORE creating new automation

### **Rule 3: JSDoc When Editing**
Apply JSDoc templates WHEN editing src/ files

---

## 🔗 Integration Points

### **Auto-triggered**
Before suggestions in governed domains (UI, architecture, automation, documentation, live data state verification)

### **Links to**
- `proto-updateEnhancement` command
- `proto-addEnhancement` command
- Enhancement registry system
- Live DB inspection script fleet (`db-inspect.md`)

### **Enforces Transparency**
Shows discovery results to user before proceeding

### **Prevents Duplication**
Through systematic existing system verification

---

## 📊 Success Metrics

**Token Efficiency**: 85-95% savings through cache-first discovery
**Time Savings**: 60-80 hours/year prevented duplicate work
**System Utilization**: 100% leverage of existing 136+ enhancements
**Discovery Coverage**: 579+ docs, 314 scripts, 136 enhancements

---

## 🔗 Related Documentation

### **Parent Documents**
- [CLAUDE.md](../../CLAUDE.md) - Main project navigation hub
- [PROTO-GOVERNANCE-INTELLIGENCE-SYSTEM.md](./PROTO-GOVERNANCE-INTELLIGENCE-SYSTEM.md) - Governance intelligence

### **Discovery Tools**
- [HOW-TO-FIND-THINGS.md](../HOW-TO-FIND-THINGS.md) - Unified discovery guide
- [scripts/README.md](../../scripts/README.md) - Complete automation catalog

### **Enhancement System**
- [ENHANCEMENT-MASTER-REGISTRY.md](../../ENHANCEMENT-MASTER-REGISTRY.md) - Central registry
- [UI-QUALITY-ENHANCEMENT-CLUSTER.md](../enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md) - UI cluster
- [INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md](../enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md) - Infrastructure cluster
- [GOVERNANCE-ENHANCEMENT-CLUSTER.md](../enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md) - Governance cluster

### **Cache Systems**
- [UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md](./UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md) - Research cache (URC-001)
- [diagnostic-cache-quick-reference.md](../claude-navigation/diagnostic-cache-quick-reference.md) - Diagnostic cache

### **Command Reference**
- [PROTO-GOVERNANCE-COMPLETE-MANUAL.md](./PROTO-GOVERNANCE-COMPLETE-MANUAL.md) - Complete proto-command guide
- [auto-enforcement-rules.md](../claude-navigation/auto-enforcement-rules.md) - All enforcement rules
- [db-inspect.md](../workflows/db-inspect.md) - DB live data inspection workflow
