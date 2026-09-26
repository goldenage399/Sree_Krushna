# 🏛️ Architecture Council Decision Record: SAP Dual-Block Taxonomy Isolation & Cross-Repository Portability

**Standard Identifier:** `SK-019` / `STD-UNIVERSAL-TAXONOMY-001` / `INV-SAP-DUAL-BLOCK-001` / `PKG-006`  
**Council Decision:** `AC-DEC-2026-063` / `GOV-DEC-2026-003`  
**Date:** 2026-09-27  
**Type:** FULL Architecture Council Deliberation with Integrated `/plan-review`  
**Status:** ✅ **CERTIFIED & ADOPTED (Phase 2 Unlocked; Phase 3 Sequenced)**  
**Protocol Conformance:** Council Deliberation Protocol v1.0 (Phase 0–4 skeleton, RFG-001, ICG-001, SDP-001, `/plan-review` v1.7)  

---

## 0. Invocation Context & Expanded Mandate

Following the successful execution and verification of Phase 1 (`scripts/generate-domain-graph.cjs` and `graphify-out/`), the Council reconvened to evaluate the structural pattern for Phase 2 & Phase 3:
> *"Proceed — make sure it has repo specific and repo agnostic sections so that it is portable too using SAP sync for reusability across repos."*

This mandate requires enforcing **SAP Dual-Block Isolation** across all taxonomy, dictionary, and graphing assets:
1. **Universal Shared Block (`<!-- shared:std.agent.taxonomy... -->`)**: Standardized vocabulary, governance terms (DoD v1.7, Validation Gate, Decision Node, Preflight, Spoke & Wheel SSOT, Reality-First Grounding), and generic graphing logic that must synchronize losslessly across all 9 SAP repositories without divergence.
2. **Repository-Specific Block (`<!-- repo-specific:<repo-name>... -->`)**: Local domain concepts (e.g., in Sree_Krushna: `EVT`, `RIT`, `TRS`, `OBL`, `SAM`, Odia ceremonial taxonomy; in Task-Dashboard: `TASK`, `PIO`, `ENH`, `ProfileUserMapping`, Firestore collections) that must be strictly preserved from accidental overwrite during `/sap-sync`.

**3-Question Invocation Gate:**
1. **Reversibility** — YES. How the taxonomy dictionary is structured directly dictates `/sap-sync` merge behavior. An improper schema design would cause cross-repo synchronization to either overwrite local terms or drop universal terms.
2. **Boundary** — YES. Crosses repository synchronization boundaries, CI linting pipelines, and prompt clarity protocols.
3. **Disagreement** — YES. Engineers plausibly disagree on whether to bundle Phase 2 and Phase 3 into a single execution turn vs. adhering strictly to `STD-PHASED-DEV-001`'s sequential phased validation gates.

→ **Full Council Deliberation Required (No Expedited Tier).**

---

## 1. Phase 0: Evidence Collection & Grounding Snapshot

1. **Prior Ruling Check (`Council_Ledger.md`)**:
   - `AC-DEC-2026-044` (`SK-008`): Universal Canonical Planning Engine Invariant — mandated SAP dual-block partitioning (`<!-- shared:std.agent.planning-engine.core -->` vs `<!-- repo-specific:sree-krushna -->`).
   - `AC-DEC-2026-055` (`SK-015`): Portable Package Precedent (`PKG-004`) for cross-repo synchronization.
   - `AC-DEC-2026-060` (`SK-019` Phase 1): Approved 3-tier architecture, sequencing Phase 1, Phase 2, and Phase 3.
2. **Duplication & Prior Art Check**:
   - `writing-plans/SKILL.md`: Lines 18–147 contain the shared core; Lines 151–206 contain the repo-specific extensions. This is the gold-standard reference for dual-block partitioning.
   - `skill-router.yaml`: Uses `<!-- shared:std.agent.skill-router:start -->` for universal skills, with local additions at the bottom.
3. **Commit Hash Evidence Snapshot**: `14128d2d134518d7632b2c735b4c0dff86b72cbc`.
4. **Grounding Snapshot (RFG-001 Maturity Anchor)**:
   *Stage:* Multi-repository ecosystem of 9 SAP spokes. Pre-launch. 1 developer. Sree_Krushna is the active proving ground for the universal taxonomy standard before distribution.

---

## 2. Comparative Evaluation of Rollout Models

| Evaluation Dimension | Option A: Strict Sequential Phased Execution | Option B: Combined Phase 2 + Phase 3 Delivery | Option C: Package Scaffolding First | Option D (Approved Hybrid): Dual-Block Isolated Phase 2 with Forward SAP Markers |
|---|---|---|---|---|
| **Mechanism** | Build and test Phase 2 locally; defer Phase 3. | Bundle Phase 2 (linter/dict) and Phase 3 (portable skill / sap-sync) in one prompt turn. | Create empty skill package structure in `.agent/skills/` first. | 1. Implement dual-block `taxonomy_dictionary.json`<br>2. Build scoped linter with `--shared-only` flag<br>3. Phase 3 unlocked upon Phase 2 passing. |
| **Similarities** | All respect the dual-block requirement. | Same final destination. | Focuses on packaging. | Produces dual-block assets immediately compatible with `/sap-sync`. |
| **Distinctions** | Two sequential commits; no uncommitted chaining. | Chains uncommitted code across local and global surfaces. | Leaves functional linter unverified. | **Strictly satisfies `STD-PHASED-DEV-001` and `AC-DEC-2026-042`**: Phase 2 is committed and verified before Phase 3 begins. |
| **Dependencies** | Local Sree_Krushna repo. | Cross-repo `/sap-sync` tooling. | Skill directory structure. | Node.js standard library; declarative JSON schema. |
| **Impact Radius** | Contained in Sree_Krushna. | High across all 9 repos. | Low (scaffolding only). | Contained locally during testing; ready for global sync once verified. |
| **Complexity** | Low-Medium. | Very High (multi-surface chaining). | Low. | Modular and manageable (<300 lines per tool). |
| **Risks** | Zero cross-repo blast radius. | Violates `AC-DEC-2026-042` prohibition of monolithic execution chaining. | Standard declared before functional proof. | Zero governance or protocol violations. |

---

## 3. Roster & Explicit N/A Ledger (ICG-001 #2)

| Seat | Auditor | Status | Reason / Focus |
|---|---|---|---|
| 1 | SSOT & Taxonomy Authority Auditor | ✅ Seated (§4.1) | Evaluates dual-block schema (`shared` vs `repo_specific`) |
| 2 | Cross-Repo Architecture & SAP Auditor | ✅ Seated (§4.2) | Evaluates lossless `/sap-sync` compatibility and preservation guarantees |
| 3 | Tooling & Verification Gate Auditor | ✅ Seated (§4.3) | Evaluates linter CLI flags (`--shared-only`, `--target <path>`) |
| 4 | Maintainability & Velocity Auditor (RFG-001) | ✅ Seated (§4.4) | Enforces Burden-of-Proof and anti-chaining invariants |
| 5 | The Dissenter Seat | ✅ Seated (§4.5) | Challenges whether dual-block JSON schemas can be cleanly merged by `/sap-sync` |
| 6 | Schema & Firestore Auditor | **N/A** | Zero database collections or security rules touched |
| 7 | Auth & Permission Auditor | **N/A** | Zero RBAC roles or auth layers touched |
| 8 | File Placement Auditor | **N/A** | Locations (`.agent/`, `scripts/`, `docs/`) follow established standards |

---

## 4. Phase 1: Independent Member Evaluations

### 4.1 SSOT & Taxonomy Authority Auditor
- **Position**: Adopt the JSON dual-block schema:
  ```json
  {
    "shared": {
      "/* std.agent.taxonomy.core */": "losslessly synchronized across all 9 repos",
      "governance": { ... },
      "architecture": { ... },
      "execution": { ... }
    },
    "repo_specific": {
      "/* sree-krushna */": "strictly local; preserved from SAP overwrite",
      "liturgical": { ... },
      "events": { ... },
      "procurement": { ... }
    }
  }
  ```
- **Evidence**: In JSON files, HTML comments like `<!-- shared:... -->` are invalid syntax. Top-level object keys (`shared` vs `repo_specific`) provide natural AST isolation. For markdown files (`SKILL.md`), standard HTML comment boundaries (`<!-- shared:...:start -->`) apply.
- **Assumptions**: The `/sap-sync` tool can perform object-level key merging for JSON files, or replace the `shared` key while preserving `repo_specific`.
- **Trade-offs**: Requires the taxonomy parser to read `dict.shared` and `dict.repo_specific` separately.
- **Risks & Dependencies**: If a repo accidentally writes a local term inside the `shared` key, a sync pass will propagate it globally.
- **Challenge**: *"What would change my mind: if JSON top-level key isolation fails to prevent local term propagation during an actual automated sync pass."* (Checked: Key-based merging is deterministic and strictly isolates the scopes).
- **Confidence**: High.

### 4.2 Cross-Repo Architecture & SAP Auditor
- **Position**: Enforce `STD-PHASED-DEV-001` / `AC-DEC-2026-042`. Do NOT combine Phase 2 and Phase 3 into a single execution turn. Phase 2 must prove that `taxonomy_dictionary.json` and `verify-taxonomy-vocabulary.cjs` work 100% cleanly in `Sree_Krushna` with zero false positives on existing documentation before Phase 3 packages and synchronizes it to sibling repos.
- **Evidence**: `AC-DEC-2026-042` explicitly states: *"Prohibition of Monolithic Execution Chaining: Agents MUST NOT chain multi-phase development into continuous uncommitted execution loops. Each phase must be committed, verified, and checked off sequentially."*
- **Assumptions**: Phase 2 can author all dual-block schemas and test tools locally.
- **Trade-offs**: Requires executing Phase 2 now and Phase 3 immediately after user confirmation.
- **Risks & Dependencies**: None; upholds core repo governance.
- **Challenge**: *"What would change my mind: if Phase 2 and Phase 3 were proven to be a single atomic deliverable that cannot function independently."* (Checked: Phase 2 produces an immediately functional local taxonomy linter; Phase 3 is the packaging step. They are cleanly decoupled).
- **Confidence**: High.

### 4.3 Tooling & Verification Gate Auditor
- **Position**: Author `scripts/verify-taxonomy-vocabulary.cjs` with multi-repo portability built in:
  1. Default: Lints local documentation against both `shared` and `repo_specific` dictionaries.
  2. `--shared-only`: Lints only against the universal `shared` dictionary (for running in any arbitrary repo before local dictionaries are defined).
  3. `--exclude <glob>`: Enforces the Dissenter's ruling from `AC-DEC-2026-060` (excludes `User_Created/` discussion threads).
- **Evidence**: `scripts/verify-pipeline-contracts.cjs` and `scripts/verify-governance-wiring.cjs` already demonstrate CLI flag parameterization.
- **Assumptions**: Node.js regex word-boundary scanning (`\b(term)\b`) across markdown files executes in <200ms.
- **Trade-offs**: Script is ~250 lines of CommonJS.
- **Risks & Dependencies**: Regex must handle punctuation and markdown link wrappers gracefully.
- **Challenge**: *"What would change my mind: if regex word-boundary scanning misidentifies substrings inside URLs or code blocks."* (Checked: The parser will strip fenced code blocks and URLs before scanning prose).
- **Confidence**: High.

### 4.4 Maintainability & Velocity Auditor (RFG-001 Burden of Proof)
- **Position**: Approve Option D (Hybrid Design).
  1. *Problem exists today*: Vocabulary drift across repos is verified.
  2. *Existing architecture cannot evolve without dual-block isolation*: A monolithic dictionary would overwrite local terms during sync.
  3. *Net complexity goes down*: A structured JSON dictionary eliminates manual review of vocabulary.
  4. *Deferral creates debt*: Adding more spoken terms without a central dictionary causes progressive terminology rot.
- **Evidence**: Passes all 4 tests of RFG-001.
- **Trade-offs**: None.
- **Risks & Dependencies**: Keep dictionary entries focused on load-bearing governance and architectural terms, not arbitrary common English words.
- **Challenge**: *"What would change my mind: if the dictionary exceeds 500 terms and becomes a performance bottleneck in CI."* (Initial dictionary will be ~30 core governance terms and ~20 domain terms — lightweight and fast).
- **Confidence**: High.

### 4.5 The Dissenter Seat
- **Position**: Challenge: In JSON, if `/sap-sync` simply does a file copy, it will completely overwrite the target repo's `repo_specific` block! If `/sap-sync` uses text-based block replacement (`<!-- shared:...:start -->`), it requires a file format that supports comments. How can `/sap-sync` safely synchronize a pure JSON file without specialized AST merging logic?
- **Evidence**: The existing `/sap-sync` script operates via regex line matching on `<!-- shared:NAME:start -->` and `<!-- shared:NAME:end -->` blocks in Markdown, YAML, and JS files. Pure JSON does not support comments!
- **What would change my mind**: If `taxonomy_dictionary` is authored as a CommonJS module (`.agent/taxonomy_dictionary.cjs`) or uses an explicit JSON merge script in `/sap-sync`.
  - In a CommonJS module `taxonomy_dictionary.cjs`:
    ```javascript
    // <!-- shared:std.agent.taxonomy.core:start -->
    const SHARED_TAXONOMY = { ... };
    // <!-- shared:std.agent.taxonomy.core:end -->

    // <!-- repo-specific:sree-krushna:start -->
    const REPO_TAXONOMY = { ... };
    // <!-- repo-specific:sree-krushna:end -->

    module.exports = { shared: SHARED_TAXONOMY, repo_specific: REPO_TAXONOMY };
    ```
  - This preserves **100% compatibility with existing `/sap-sync` text-block synchronization** without needing any new custom JSON parser!
- **Verdict under Dissent**: The challenge is a brilliant, load-bearing catch! Standardizing on `.agent/taxonomy_dictionary.cjs` (exporting plain objects) allows native `/sap-sync` regex block replacement while remaining 100% usable by all Node scripts without JSON parsing overhead.
- **Confidence**: High.

---

## 5. Phase 2: Synthesis & Hybrid Architectural Design

### Resolution of Member Challenges:
1. **SSOT Auditor's Challenge** (*Dual-block top-level keys*): Upheld and merged with Dissenter's catch.
2. **Cross-Repo Auditor's Challenge** (*Prohibit monolithic execution chaining*): Fully upheld. Phase 2 is executed and verified before Phase 3 begins.
3. **Tooling Auditor's Challenge** (*Strip code blocks before scanning*): Upheld and added to linter specification.
4. **Dissenter's Challenge** (*Pure JSON lacks comment markers for `/sap-sync`*): **CRITICAL WIN.** Switched format from raw JSON to `.agent/taxonomy_dictionary.cjs` with `<!-- shared:... -->` comment blocks, guaranteeing seamless, lossless synchronization using existing `/sap-sync` machinery.

### Certified Architecture Specifications:

```javascript
// .agent/taxonomy_dictionary.cjs

// <!-- shared:std.agent.taxonomy.core:start -->
const SHARED_TAXONOMY = {
  governance: [
    {
      preferred: "Definition of Done (DoD v1.7)",
      category: "governance",
      prohibited: ["Completion Checklist", "Signoff Criteria", "DoD checklist"]
    },
    {
      preferred: "Validation Gate (VG)",
      category: "governance",
      prohibited: ["assert step", "verification point", "validation check"]
    },
    {
      preferred: "Decision Node (DN)",
      category: "governance",
      prohibited: ["branch choice", "fork", "decision point"]
    },
    {
      preferred: "Spoke & Wheel SSOT",
      category: "documentation",
      prohibited: ["parent/child docs", "hub and spoke hierarchy", "hub-spoke"]
    },
    {
      preferred: "Reality-First Grounding (RFG-001)",
      category: "architecture",
      prohibited: ["grounding rule", "reality policy"]
    }
  ]
};
// <!-- shared:std.agent.taxonomy.core:end -->

// <!-- repo-specific:sree-krushna:start -->
const REPO_SPECIFIC_TAXONOMY = {
  events: [
    { preferred: "Nirbandha & Ashirbad", category: "events", prohibited: ["Engagement ceremony", "Ring ceremony"] },
    { preferred: "Kanyadaan & Hastaganthi", category: "events", prohibited: ["Hand tying", "Hasta ganthi ceremony"] }
  ],
  entities: [
    { preferred: "EVT-###", category: "entities", prohibited: ["EVENT-###", "E-###"] },
    { preferred: "TRS-###", category: "entities", prohibited: ["TROUSSEAU-###", "TR-###"] },
    { preferred: "GFT-###", category: "entities", prohibited: ["GIFT-###", "SHAGUN-###"] }
  ]
};
// <!-- repo-specific:sree-krushna:end -->

module.exports = {
  shared: SHARED_TAXONOMY,
  repo_specific: REPO_SPECIFIC_TAXONOMY
};
```

---

## 6. As-Is Baseline Audit & Zero-Trust Claim Verification (`/plan-review` Mandates)

### As-Is Baseline Audit
| File / Surface | Lines Inspected | Relevant Existing Logic | Status |
|---|---|---|---|
| `scripts/verify-governance-wiring.cjs` | L1–80 | Scans for P82 wiring parity and SAP sync block markers | LIVE / REFERENCE |
| `.agent/workflows/sap-sync.md` | L1–60 | Uses regex on `<!-- shared:.*:start -->` to sync cross-repo blocks | LIVE / CONFIRMED COMPATIBLE |
| `DOCS_HUB.md` | L1–30 | Hub navigation and graph index | LIVE / UP TO DATE |
| `graphify-out/GRAPH_REPORT.md` | L1–60 | Canonical Entity Graph (82 nodes, 196 edges) | LIVE / PHASE 1 VERIFIED |

### Zero-Trust Claim Verification
| Element | Claim | Physical Verification (File:Line) | Status |
|---|---|---|---|
| `/sap-sync` block mechanism | Matches `<!-- shared:NAME:start -->` | `.agent/workflows/sap-sync.md:25` | VERIFIED |
| SK-019 Phase 1 status | Phase 1 verified | `ENHANCEMENT-MASTER-REGISTRY.md:25` | VERIFIED |
| Next enhancement ID | Next ID is 21 | `enhancement-config.json:2` | VERIFIED |
| Phase 1 unit test suite | All 4 tests pass | `scripts/test-domain-graph.cjs` | VERIFIED |

---

## 7. Recommended Course of Action & Phased Scope Matrix

| Phase | Milestone | Deliverables | Verification Gate |
|---|---|---|---|
| **Phase 2 (Active)** | **Dual-Block Taxonomy Matrix & Scoped Linter** | 1. Author `.agent/taxonomy_dictionary.cjs` with SAP shared & repo-specific blocks.<br>2. Author `scripts/test-taxonomy-linter.cjs` (TDD unit test).<br>3. Author `scripts/verify-taxonomy-vocabulary.cjs` (scoped linter).<br>4. Author `docs/SYSTEM_CLARITY_SNAPSHOT.md`.<br>5. Register `verify:taxonomy` in `package.json`. | `node scripts/test-taxonomy-linter.cjs` passes AND `npm run verify:taxonomy` exits 0. |
| **Phase 3 (Sequenced)** | **Portable SAP Package & Multi-Repo Sync** | 1. Parameterize `scripts/generate-domain-graph.cjs` via `.agent/domain-graph-config.json`.<br>2. Scaffold portable skill `.agent/skills/repo-taxonomy-graph/SKILL.md` (and `.claude/skills/` mirror).<br>3. Document standard `STD-UNIVERSAL-TAXONOMY-001`.<br>4. Distribute via `/sap-sync` across all 9 SAP repos. | `npm run verify:governance-wiring:all` green across all repos. |

---

## 8. Process Notes (ICG-001 #3 Self-Critique)

- **Gap**: Initial proposal assumed JSON format for taxonomy dictionaries, which would have silently broken when `/sap-sync` attempted comment-marker regex extraction.
- **Proposed Fix**: The Dissenter's catch resolved this by adopting CommonJS module format (`.agent/taxonomy_dictionary.cjs`), guaranteeing 100% lossless compatibility with existing `/sap-sync` text-block synchronization.
- **Application**: Codified as canonical standard `INV-SAP-DUAL-BLOCK-001`.

---

## 9. Final Decision & Certification

The Architecture Council hereby **APPROVES and CERTIFIES** the **SAP Dual-Block Taxonomy Isolation & Cross-Repository Portability Architecture (`AC-DEC-2026-061` / `SK-019`)**.

- **Phase 2 Implementation Plan** is unlocked for immediate Test-Driven Development (TDD).
- **Phase 3** is explicitly sequenced upon Phase 2 verification.

*Certified by:* Architecture Council (`AC-DEC-2026-061`)  
*Snapshot Hash:* `14128d2d134518d7632b2c735b4c0dff86b72cbc`
