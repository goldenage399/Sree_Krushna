# 🏛️ Architecture Council Decision Record: Session Acceleration Infrastructure & Discovery Protocol Review

**Standard Identifier:** `SK-019` / `P-SESSION-ACCELERATION-001`  
**Council Decision:** `AC-DEC-2026-059` / `GOV-DEC-2026-001`  
**Date:** 2026-09-26  
**Type:** FULL Architecture Council Deliberation with Integrated `/plan-review`  
**Status:** ✅ **CERTIFIED (Phase 1 scope approved for execution; Phase 2–3 sequenced)**  
**Protocol Conformance:** Council Deliberation Protocol v1.0 (Phase 0–4 skeleton, RFG-001, ICG-001, SDP-001, `/plan-review` v1.7)  

---

## 0. Invocation Context & Ground Truth Problem

During the Response 1.0 session (family ritual and gift obligation integration contract), discovering repository architecture required **18 sequential tool calls** (crawling directories, inspecting multiple templates, checking JSONL/CSV schemas, verifying ledger stubs). 

Although the repository standard `STD-PCL-001` (Domain Index Preflight) specifies three acceleration tools:
1. Root Hub Orientation (`DOCS_HUB.md`)
2. Architecture & Blast Radius Check (`graphify-out/GRAPH_REPORT.md` / `query-graph-blast-radius.cjs`)
3. Active State Alignment (`docs/SYSTEM_CLARITY_SNAPSHOT.md`)

Ground-truth inspection in Phase 0 confirmed:
- `DOCS_HUB.md` **existed** (24 lines) but was **bypassed/unconsulted**, leading to manual directory navigation.
- `graphify-out/GRAPH_REPORT.md` and `graphify-out/` **did not exist on disk** (0 results).
- `docs/SYSTEM_CLARITY_SNAPSHOT.md` **did not exist on disk** (0 results).
- `.agent/workflows/graphify.md` cited `python scratch/finalize_graph.py` and `C:\Users\TEMP\.agent\skills\graphify\SKILL.md` — **neither exists in this repository or user environment** (broken dependency path).

**3-Question Invocation Gate:**
1. **Reversibility** — YES. Establishing session startup gates and codebase indexers impacts every future agent session, memory load sequence, and preflight protocol.
2. **Boundary** — YES. Crosses Agent Governance (`GEMINI.md`, `aos-session-open.md`), System Documentation (`DOCS_HUB.md`, `SYSTEM_CLARITY_SNAPSHOT.md`), and Tooling/Scripts (`scripts/generate-domain-graph.cjs`).
3. **Disagreement** — YES. Engineers plausibly disagree on whether to install heavy semantic graph generation tools (Python-based Graphify/GraphRAG) vs. enforcing strict protocol discipline on existing markdown hubs (`DOCS_HUB.md`) vs. building a native lightweight Node.js entity scanner.

→ **Full Council Deliberation Required (No Expedited Tier).**

---

## 1. Phase 0: Evidence Collection & Grounding Snapshot

1. **Ledger Check (`Council_Ledger.md`)**: No prior ruling exists for `SK-019`, session acceleration, or domain graph generation. Highest allocated decision was `AC-DEC-2026-058` (`SK-018`). This session allocates `AC-DEC-2026-059`.
2. **Duplication Check**:
   - `scripts/` contains `validate-task-graph.cjs` (checks WBS task graph in `marriage-state.js` and `dopkos-engine.js`), but **no general domain entity graph generator**.
   - `DOCS_HUB.md` exists and contains the 7 core domain hubs (`00_GOVERNANCE` to `06_FINANCE_COMMERCIALS`).
   - `ARCHITECTURE_SPEC.md` §1 contains the canonical entity table (`EVT`, `RIT`, `PER`, `FAM`, `VEN`, `VDR`, `CTR`, `TSK`, `DEC`, `PAY`, `RSK`, `AST`, `CHG`, `GATE`, `CP`, `TRS`, `GFT`).
3. **Ground-Truth Reads**:
   - `DOCS_HUB.md` (24 lines) — valid spoke-and-hub index.
   - `.agent/workflows/graphify.md` (68 lines) — invokes missing Python scripts.
   - `.agent/workflows/aos-session-open.md` (405 lines) — Step 0.1 conditionally loads `graphify-out/GRAPH_REPORT.md` (lines 68–85), but Step 1 does not mandate reading `DOCS_HUB.md`.
   - `enhancement-config.json` — verified `next_id: 20` after incrementing for `SK-019`.
   - `ENHANCEMENT-MASTER-REGISTRY.md` — verified `SK-019` registered.
4. **Commit Hash Evidence Snapshot**: `ce9918422cff35160b8cda9a3c7d6dfeb32db45c`.
5. **Grounding Snapshot (RFG-001 Maturity Anchor)**:
   *Stage:* Pre-launch, single-family wedding operations control plane. 2 active visual web engines (Shopping Registry, Decorator Cockpit). 4–5 real active users, ~20–30 expected. 1 developer. Repository size: ~50 scripts, 9 domain hubs, document-centric SSOT.

---

## 2. Comparative Evaluation of Available Architectural Options

| Dimension | Option 1: External Python Graphify | Option 2: Pure Protocol Read Discipline | Option 3: Status Quo Ad-Hoc Discovery | Option 4 (Hybrid): Native 3-Tier Acceleration Stack |
|---|---|---|---|---|
| **Mechanism** | Python-based semantic AST & community graph builder (`scratch/finalize_graph.py`) | Markdown protocol updates to `GEMINI.md` and `aos-session-open.md` | Unstructured `grep_search`, `find_by_name`, `list_dir` | 1. Mandatory `DOCS_HUB.md` read gate<br>2. `SYSTEM_CLARITY_SNAPSHOT.md`<br>3. Native Node `generate-domain-graph.cjs` |
| **Similarities** | Aims to provide `graphify-out/GRAPH_REPORT.md` | Uses markdown SSOTs | Uses existing file system | Generates `graphify-out/GRAPH_REPORT.md` and leverages `DOCS_HUB.md` |
| **Distinctions** | Requires Python runtime, pip dependencies, git hooks | Zero code changes; pure cognitive prompt instruction | No index created; completely reactive | Native zero-dependency Node.js script leveraging existing repo conventions |
| **Dependencies** | Python, `finalize_graph.py` (missing), global skills (missing) | Agent compliance with prompts | None | Node.js standard library (`fs`, `path`) |
| **Impact Radius** | System Python, git hooks, cross-platform friction on Windows | `.agent/workflows/` and root documentation | Excessive agent tool calls, latency, token burn | `scripts/`, `graphify-out/`, `docs/`, `.agent/` |
| **Complexity** | High (foreign runtime in Node/browser project) | Low | Low initial, High operational | Low-Medium (single self-contained Node script) |
| **Risks** | Immediate failure (files missing); pipeline rot | Protocol Decoupling (`INC-077`): agent skips prose instructions | Hallucinations, missed entities, high latency (18 calls) | Output staleness if not run after large documentation changes |
| **Architectural Implication** | Introduces multi-language runtime burden | Pure documentation contract; lacks mechanical entity index | High token waste, anti-pattern for large OS knowledge base | Standardizes Sree Krushna OS as self-indexing document database |

---

## 3. Roster & Explicit N/A Ledger (ICG-001 #2)

| Seat | Auditor | Status | Reason / Focus |
|---|---|---|---|
| 1 | SSOT Authority Auditor | ✅ Seated (§4.1) | Focuses on `DOCS_HUB.md`, `ARCHITECTURE_SPEC.md`, and spoke integrity |
| 2 | Workflow & Protocol Integrity Auditor | ✅ Seated (§4.2) | Focuses on `aos-session-open.md` and `STD-PCL-001` compliance |
| 3 | Tooling & Verification Gate Auditor | ✅ Seated (§4.3) | Evaluates Node.js entity scanner vs. Python script viability |
| 4 | Maintainability & Velocity Auditor (RFG-001) | ✅ Seated (§4.4) | Enforces Burden-of-Proof and anti-bloat for 1-developer pre-launch app |
| 5 | The Dissenter Seat | ✅ Seated (§4.5) | Challenges the necessity of building new scripts when `DOCS_HUB.md` already exists |
| 6 | Schema & Firestore Auditor | **N/A** | No Firestore rules or collections are touched |
| 7 | Auth & Permission Auditor | **N/A** | No authentication or RBAC tiers are modified |
| 8 | File Placement Auditor | **N/A** | Standard file paths in `scripts/`, `docs/`, `graphify-out/` are well-established |

---

## 4. Phase 1: Independent Member Evaluations

### 4.1 SSOT Authority Auditor
- **Position**: Reject Option 1 (external Python graphify); approve the Hybrid approach. The repository is fundamentally a Markdown/YAML document repository governed by `P-SSOT-DOCS`. The domain hubs already exist; they merely lacked automated cross-entity indexing.
- **Evidence**: `DOCS_HUB.md` establishes 7 primary domains. `ARCHITECTURE_SPEC.md` defines 17 standardized entity prefixes (`EVT-###`, `RIT-###`, `TRS-###`, `PAY-###`, `GFT-###`). A script that scans frontmatter `id:` and body markdown links (`[EVT-001](...)`) provides 100% deterministic entity graphing without probabilistic NLP.
- **Assumptions**: Spoke documents consistently declare frontmatter `id:` or follow standard naming.
- **Trade-offs**: A deterministic entity scanner does not perform semantic clustering across arbitrary English text, but perfectly maps architectural relationships.
- **Risks & Dependencies**: Documents without standard frontmatter will be indexed by filename rather than entity ID.
- **Challenge**: *"What would change my mind: if someone proves that semantic vector embeddings or Python AST parsing are required to discover relationships between wedding events, rituals, and gifts."* (Checked: They are not; wedding entities are linked by standardized IDs).
- **Confidence**: High.

### 4.2 Workflow & Protocol Integrity Auditor
- **Position**: Option 2 (prose protocol alone) has already failed in practice. In the Response 1.0 session, `DOCS_HUB.md` was sitting at the root of the repository, yet the agent jumped straight to `list_dir` on multiple folders. The startup gate must make reading `DOCS_HUB.md` an explicit, mechanical step.
- **Evidence**: `aos-session-open.md` line 26 marks Step 1 (Memory Load) as UNCONDITIONAL, but Step 0.1 (Graphify) as CONDITIONAL. The startup sequence lacks an explicit instruction: *"Read DOCS_HUB.md before executing any domain discovery."*
- **Assumptions**: Adding the read order into `GEMINI.md §2` and `aos-session-open.md` will guide agent attention.
- **Trade-offs**: Slightly increases context window at session start (~50 tokens for `DOCS_HUB.md`), but saves thousands of tokens wasted on speculative directory listings.
- **Risks & Dependencies**: Must ensure `DOCS_HUB.md` stays strictly capped at <150 lines per `P-SSOT-DOCS`.
- **Challenge**: *"What would change my mind: if making DOCS_HUB.md unconditional causes prompt context bloat or interferes with simple single-file patch sessions."* (Checked: `DOCS_HUB.md` is only 24 lines, 1.5KB — zero risk of bloat).
- **Confidence**: High.

### 4.3 Tooling & Verification Gate Auditor
- **Position**: Build `scripts/generate-domain-graph.cjs` as a zero-dependency CommonJS script runnable with `node scripts/generate-domain-graph.cjs` (and wire to `npm run build:graph` / `npm run verify:graph`).
- **Evidence**: All 50 scripts in `scripts/` are CommonJS (`.cjs`) or ES modules (`.mjs`). Introducing a Python dependency chain (`pip`, `virtualenv`, `scratch/finalize_graph.py`) breaks on Windows environments without Python or where PATH is misconfigured.
- **Assumptions**: Node.js fs/path can traverse the 9 domain directories and parse YAML frontmatter in <200ms.
- **Trade-offs**: We write a bespoke 150-line Node parser rather than reusing a generic multi-language graph framework.
- **Risks & Dependencies**: Script must handle malformed YAML frontmatter gracefully without crashing.
- **Challenge**: *"What would change my mind: if a pre-existing npm package or cross-repo script already provides this exact functionality without authoring new code."* (Checked: `validate-task-graph.cjs` exists for tasks, but nothing exists for domain entities. The script is non-duplicative).
- **Confidence**: High.

### 4.4 Maintainability & Velocity Auditor (RFG-001 Burden of Proof)
- **Position**: Approve Hybrid Design with strict scope boundaries. Option 1 fails Burden of Proof (introduces dead dependencies and unneeded complexity). Option 3 fails Burden of Proof (accumulates massive interactive latency debt). The Hybrid approach passes Burden of Proof because:
  1. *Problem exists today*: 18 wasted tool calls in Response 1.0 (verified).
  2. *Existing architecture cannot evolve without this*: Agents cannot read a graph that does not exist on disk.
  3. *Net complexity goes down*: A 150-line Node script produces static markdown/json that reduces tool calls by 75%.
  4. *Deferral creates measurable debt*: Every new domain data-contract session will repeat the 18-call archaeological crawl.
- **Evidence**: `RFG-001` test criteria applied.
- **Trade-offs**: Requires maintaining one additional verification script in `scripts/`.
- **Risks & Dependencies**: Output in `graphify-out/` must be checked into git so subagents and fresh sessions don't have to regenerate it dynamically.
- **Challenge**: *"What would change my mind: if the time to build and verify this script exceeds the total time saved across the next 10 planning sessions."* (Building the script takes ~15 minutes; saving 15 tool calls per session repays the investment in 2 sessions).
- **Confidence**: High.

### 4.5 The Dissenter Seat
- **Position**: Challenge: Is this another case of "agent building tools for agents"? If the agent in Response 1.0 had simply followed standard operating discipline and read `DOCS_HUB.md` first, it would have located `06_FINANCE_COMMERCIALS/` and `04_PROCUREMENT_VENDORS/` in 2 calls without needing any graph generator at all. Why build software to fix an agent attention failure?
- **Evidence**: `DOCS_HUB.md` was right there at the root. The failure was behavioral (skipping the index), not structural.
- **What would change my mind**: If `DOCS_HUB.md` alone does NOT show cross-domain linkages. For example, `DOCS_HUB.md` tells you where `02_RITUALS_CULTURE` lives and where `04_PROCUREMENT_VENDORS` lives, but it does NOT tell you that `RIT-001` (Nirbandha) is linked to `TRS-EG-01` (Rings) or that `FAM-001` has a `shagun_exchange_id` pointing to `GFT-###`. Only an entity cross-reference graph reveals those hidden couplings.
- **Verdict under Dissent**: The challenge concedes that `DOCS_HUB.md` gives directory routing, but NOT entity-level relational topology. Therefore, both Tier 1 (read `DOCS_HUB.md`) AND Tier 3 (generate entity graph) are justified.
- **Confidence**: Medium.

---

## 5. Phase 2: Synthesis & Verbatim Challenge Probing

### Resolution of Member Challenges:
1. **SSOT Auditor's Challenge** (*"What would change my mind: if someone proves that semantic vector embeddings or Python AST parsing are required to discover relationships..."*):
   - **Resolution**: Fully upheld. Standardized entity prefixes (`EVT-###`, `RIT-###`, `GFT-###`) make deterministic regex/frontmatter parsing 100% sufficient. Python pipeline discarded.
2. **Workflow Auditor's Challenge** (*"What would change my mind: if making DOCS_HUB.md unconditional causes prompt context bloat..."*):
   - **Resolution**: Fully upheld. 24 lines of markdown does not cause context bloat. Unconditional read adopted.
3. **Tooling Auditor's Challenge** (*"What would change my mind: if a pre-existing npm package or cross-repo script already provides this exact functionality..."*):
   - **Resolution**: Verified. Zero duplication found. `scripts/generate-domain-graph.cjs` will be built natively.
4. **Maintainability Auditor's Challenge** (*"What would change my mind: if the time to build and verify this script exceeds the total time saved..."*):
   - **Resolution**: Upheld. ROI positive after 2 sessions.
5. **Dissenter's Challenge** (*"Why build software to fix an agent attention failure? ... What would change my mind: If DOCS_HUB.md alone does NOT show cross-domain linkages."*):
   - **Resolution**: Dissenter's condition is physically met in the codebase: `DOCS_HUB.md` has domain links, but zero cross-entity linkages (`RIT` ↔ `TRS` ↔ `GFT`).

### Unanimous Agreement:
1. De-scope and reject the external Python Graphify toolchain (`scratch/finalize_graph.py`) — it represents dead configuration and broken dependencies.
2. Adopt the **Native 3-Tier Session Acceleration Engine** (`SK-019`):
   - **Tier 1 (Protocol)**: Update `GEMINI.md §2` and `aos-session-open.md` making `DOCS_HUB.md` the mandatory first read before any domain exploration.
   - **Tier 2 (Snapshot)**: Author `docs/SYSTEM_CLARITY_SNAPSHOT.md` as the living state and gap ledger.
   - **Tier 3 (Domain Graph)**: Author `scripts/generate-domain-graph.cjs` to emit `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json`.

---

## 6. As-Is Baseline Audit & Zero-Trust Claim Verification (`/plan-review` Mandates)

### As-Is Baseline Audit
| File / Surface | Lines Inspected | Relevant Existing Logic | Status |
|---|---|---|---|
| `DOCS_HUB.md` | L1–24 | Spoke & Hub domain table (7 domains) | LIVE / VALID |
| `ARCHITECTURE_SPEC.md` | L9–30 | Domain Entities & Identifier Registry (17 prefixes) | LIVE / VALID |
| `.agent/workflows/graphify.md` | L10–48 | References `finalize_graph.py` and pre-commit hook | BROKEN / STALE |
| `.agent/workflows/aos-session-open.md` | L26–36, L68–85 | Step 0.1 conditional graph load; Step 1 Memory Load | LIVE / NEEDS EXTENSION |
| `scripts/validate-task-graph.cjs` | L1–60 | Task DAG cycle detection and dependency validator | LIVE / VALID |
| `package.json` | L15–45 | npm scripts (`verify:*`, `build:*`) | LIVE / NEEDS NEW SCRIPT |

### Zero-Trust Claim Verification
| Element | Claim | Physical Verification (File:Line) | Status |
|---|---|---|---|
| `DOCS_HUB.md` existence | Exists at root | `DOCS_HUB.md:1` | VERIFIED |
| `graphify-out/` existence | Directory missing | `find_by_name` returned 0 results | VERIFIED MISSING |
| `finalize_graph.py` | Missing from scratch/ | `scratch/` directory listing | VERIFIED MISSING |
| Entity ID prefixes | Standard 3-digit padded | `ARCHITECTURE_SPEC.md:13-30` | VERIFIED |
| `next_id` in config | Updated to 20 | `enhancement-config.json:2` | VERIFIED |

---

## 7. Recommended Course of Action & Phased Scope Matrix

| Phase | Deliverable | RFG-001 Tag | Exit Verification Gate |
|---|---|---|---|
| **Phase 1 (MVP)** | **Native Domain Graph Generator (`scripts/generate-domain-graph.cjs`) & Output Artifacts**:<br>- Scans all 9 domain directories (`00_` to `08_`)<br>- Extracts entity IDs (`EVT`, `RIT`, `PER`, `FAM`, `TRS`, `PAY`, `GFT`, etc.) and cross-reference links<br>- Emits `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json`<br>- Adds npm script `npm run build:graph` | **Required Now** | `node scripts/generate-domain-graph.cjs` exits 0 and produces `graphify-out/GRAPH_REPORT.md` containing all active entities |
| **Phase 2** | **System Clarity Snapshot (`docs/SYSTEM_CLARITY_SNAPSHOT.md`)**:<br>- Documents active incidents, recent deployments, and the 8 unresolved items from Response 1.0<br>- Documents the primary `GFT-###` architectural gap | **Required Now** | File exists and is indexed in `DOCS_HUB.md` |
| **Phase 3** | **Session-Open Preflight Protocol Hardening**:<br>- Amend `GEMINI.md §2` and `aos-session-open.md`<br>- Deprecate stale `scratch/finalize_graph.py` reference in `graphify.md`<br>- Verify with `npm run verify:governance-wiring:all` | **Required Now** | Full governance suite passes with 0 errors |

---

## 8. Process Notes (ICG-001 #3 Self-Critique)

- **Gap**: `.agent/workflows/graphify.md` has been referencing non-existent Python scripts for multiple releases without being flagged because no verification test checked script existence in workflows.
- **Proposed Fix**: Add a static link/path checker in `verify-governance-wiring.cjs` that asserts any script path cited in a workflow exists on disk.
- **Application**: Logged for execution in Phase 3.

---

## 9. Final Decision & Certification

The Architecture Council hereby **APPROVES and CERTIFIES** the **Native 3-Tier Session Acceleration Engine (`SK-019` / `AC-DEC-2026-059`)**.
Phase 1 implementation plan is unlocked for immediate execution under Test-Driven Development (TDD).

*Certified by:* Architecture Council (`AC-DEC-2026-059`)  
*Snapshot Hash:* `ce9918422cff35160b8cda9a3c7d6dfeb32db45c`
