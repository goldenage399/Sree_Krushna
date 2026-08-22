# 🏛️ Architecture Council Review: Universal Web Release & Refactor Assurance Pipeline

**Specification Code:** `SOP-WFL-ARCH-COUNCIL-001` / `ICG-001`  
**Session Date:** 2026-08-22  
**Review Type:** FULL Council Deliberation  
**Subject:** Multi-Repo Reusable Web Release, Refactoring Integrity & Decomposition Verification Architecture  
**Snapshot Commit:** `d0d507e6491d760ba9e42d6f19e9327e58c1398c`  
**Files Relied On:**
- `scripts/verify-deployment.cjs`
- `scripts/forensic-audit.cjs`
- `.agent/skills/web-deployment-gate/SKILL.md`
- `.agent/workflows/web-deployment-gate.md`
- `.agent/patterns/web-deployment-gate.md`
- `.agent/patterns/proxy-signal-verdicts.md`
- `User_Created/Discussion Threads/TaskBreakdowns/260821_TaksAdditions.md`

---

## 🌍 Grounding Snapshot (RFG-001)
- **Current Stage:** Active Multi-Module Deployment / Ecosystem Synchronization (Pre-launch & Ecosystem Standard Promotion)
- **Module Count:** 1 Active Module (Tasks / Marriage OS) + Cross-Repo Shared PACT Governance Suite
- **Active Real Users:** 4–5 core administrative and family users
- **Team Size:** 1 developer + Multi-Agent Pair Programming System

---

## 🏛️ Council Roster

| Council Member | Domain / Workflow | Assigned Role |
| :--- | :--- | :--- |
| **The SSOT Authority Auditor** | `ssot-reconciliation` | Standard Member |
| **The Schema & Firestore Auditor** | `table-schema-documentation` / `firebase-firestore` | Standard Member |
| **The Service Layer Integrity Auditor** | `debug-backend` / `cos-invoke` | Standard Member |
| **The Dependency & Impact Auditor** | `change-impact-analysis` | Standard Member |
| **The File Placement Auditor** | `file-placement-guardrail` | Standard Member |
| **The Decision & Standards Auditor** | `domain-modeling` / `register-standard` | Standard Member |
| **The Auth & Permission Auditor** | `protocol-enforcer-pre-code` | Standard Member |
| **The Maintainability & Velocity Auditor** | `ponytail` / RFG-001 | **Assigned Dissenter** |

---

## 🔍 Phase 1: Independent Member Evaluations

### 1. The SSOT Authority Auditor
- **Position:** Strongly endorse extracting a standardized, multi-repo governance triad (`.agent/workflows/refactor-integrity-gate.md`, `.agent/skills/refactor-integrity-gate/SKILL.md`, and `.agent/patterns/refactor-integrity-gate.md`) alongside `web-deployment-gate`. The post-mortem in `260821_TaksAdditions.md` proves that document-level declarations alone fail without a concrete, enforceable SSOT verification protocol.
- **Evidence:** `260821_TaksAdditions.md` Lines 3489–4231; `.agent/patterns/proxy-signal-verdicts.md`; `.agent/patterns/call-graph-and-rules-ast-verification-gate.md`.
- **Assumptions:** All ecosystem repositories inherit standard directory conventions (`.agent/`, `scripts/`, `package.json`).
- **Trade-offs:** Adds documentation overhead and maintenance burden for every repo, but eliminates silent regression risks during refactoring.
- **Risks & Dependencies:** Repositories running differing script runtimes (e.g. pure ESM vs CommonJS) may drift if scripts are hardcoded without parameterized config.
- **Challenge:** If we only create a workflow/pattern without embedding it into the mandatory pre-flight gate (`npm run verify:deployment` / `npm run preflight`), developers will skip it under time pressure.  
  *Concrete Failure Scenario:* An agent decomposes an 8,000-line file, states in the PR that "decomposition is complete," but forgets to run the manual checklist, shipping missing functions.  
  *What would change my mind:* Proof that the workflow is mechanically invoked by automated CI/pre-flight scripts, not left to voluntary agent execution.
- **Confidence:** High.

---

### 2. The Schema & Firestore Auditor
- **Position:** Reusable verification pipelines must treat client-side State Objects, SSOT Data Dictionaries, and Firestore Schemas as first-class AST nodes. In vanilla SPAs, global data objects (`WBS_TASKS`, `STAGE_DEFINITIONS`, `RITUAL_SCHEDULE`) act as the local database schema; their preservation must be mechanically verified across refactors.
- **Evidence:** `scripts/forensic-audit.cjs` Lines 100–112 where `WBS_TASKS` and `STAGE_DEFINITIONS` are checked against original AST declarations.
- **Assumptions:** Data structures exported in monolithic scripts remain structurally compatible when moved into dedicated `state.js` or `service.js` modules.
- **Trade-offs:** Custom data object names differ per repo, requiring repo-specific configuration rather than hardcoded string arrays.
- **Risks & Dependencies:** Dynamic or computed data structures may evade simple static AST property checks if not parsed with proper AST tooling.
- **Challenge:** A naive string matching check (`code.includes(dataObject)`) is still a proxy signal; an object can exist as a dead comment or an empty object `{}` and still pass.  
  *Concrete Failure Scenario:* `WBS_TASKS = {}` is declared, passing `code.includes('WBS_TASKS')`, but wiping out all 45 tasks at runtime.  
  *What would change my mind:* The verification script must validate that the exported data object contains a non-zero count of keys/elements, not just that the identifier name exists.
- **Confidence:** High.

---

### 3. The Service Layer Integrity Auditor
- **Position:** The 6-layer pre-flight gate must be decoupled into an extensible, parameter-driven verification engine. Specifically, Layer 1 (JS Syntax/AST parse) and Layer 2 (Call-Graph contract matching HTML inline event handlers to window bindings) are universal invariants for ANY web project.
- **Evidence:** `scripts/verify-deployment.cjs` Lines 39–89; W3C DOM and WHATWG classic script vs module execution standards.
- **Assumptions:** Projects use predictable entry points or a declared manifest (e.g., in `.deploymentrc.json` or `package.json`).
- **Trade-offs:** Abstracting the script into a generic runner requires a config schema, but prevents writing bespoke 200-line scripts per repo.
- **Risks & Dependencies:** Modern bundler-based apps (Vite/Webpack) have internal AST compilation, whereas Vanilla JS/GAS apps rely entirely on manual script loading where top-level `await` or missing `window` bindings fail catastrophically.
- **Challenge:** If the verification engine assumes one specific architecture (e.g. Vanilla HTML with inline `onclick`), it will throw false positives on React/JSX codebases (`onClick={handleClick}`).  
  *Concrete Failure Scenario:* Running the script on `Task-Dashboard` (a React SPA) fails Layer 2 because React uses synthetic events rather than HTML string attributes.  
  *What would change my mind:* The verification script must support adapter profiles: `vanilla-spa` (DOM IDs + inline handlers) and `react-spa` (React build + route reachability + bundle checks).
- **Confidence:** High.

---

### 4. The Dependency & Impact Auditor
- **Position:** Support Option C (End-to-End Pipeline). Reusability across repos is only realized when the pattern, workflow, and automated scripts are packaged as a cohesive unit and distributed via SAP sync. Fragmenting into "scripts only" or "docs only" guarantees drift.
- **Evidence:** Successful promotion of `web-deployment-gate` triad to `Task-Dashboard` in Response 3.7.
- **Assumptions:** Canonical Hub (`Task-Dashboard`) maintains the master template in `templates/web-spa-shell` and synchronizes outward.
- **Trade-offs:** Requires coordinating updates across multiple repos whenever the verification contract changes.
- **Risks & Dependencies:** Script dependency versions (e.g., Node.js built-ins vs npm packages). Zero-dependency native Node (`fs`, `path`, `child_process`, `new Function`) is mandatory for frictionless adoption.
- **Challenge:** Distributing raw `.cjs` files across 10+ repos leads to copy-paste drift if there is no unified SAP sync protocol.  
  *Concrete Failure Scenario:* Sree_Krushna improves the AST checker, but other repos continue using the old regex checker and deploy broken code.  
  *What would change my mind:* A formal SAP synchronization rule that checks hash consistency across all ecosystem verification scripts during pre-flight.
- **Confidence:** High.

---

### 5. The File Placement Auditor
- **Position:** Establish clear taxonomy for reusable verification assets:
  - Workflows: `.agent/workflows/refactor-integrity-gate.md`, `.agent/workflows/web-deployment-gate.md`
  - Skills: `.agent/skills/web-deployment-gate/SKILL.md`
  - Patterns: `.agent/patterns/web-deployment-gate.md`, `.agent/patterns/call-graph-and-rules-ast-verification-gate.md`
  - Scripts: `scripts/verify-deployment.cjs`, `scripts/forensic-audit.cjs`
  - Starter Templates: `templates/web-spa-shell/`
- **Evidence:** Existing repo file structure and `SAP-SYNC` index.
- **Assumptions:** No new ad-hoc root directories are created; all tooling resides strictly within `scripts/` and `.agent/`.
- **Trade-offs:** Strict placement requires adherence across diverse repositories.
- **Risks & Dependencies:** None.
- **Challenge:** Placing too many fine-grained scripts in `scripts/` clutters the tooling namespace.  
  *Concrete Failure Scenario:* Having 5 separate scripts (`check-html.cjs`, `check-js.cjs`, `check-dom.cjs`, `check-sw.cjs`, `check-pwa.cjs`) confuses developers on which one to run.  
  *What would change my mind:* Consolidation into exactly two standard commands: `npm run verify:deployment` (pre-flight release gate) and `npm run audit:decomposition` (refactoring AST regression check).
- **Confidence:** High.

---

### 6. The Decision & Standards Auditor
- **Position:** Formalize this pattern under PACT-001 as an enforceable standard: **`P-VERIFY-GATE-002: Zero-Proxy AST & Call-Graph Deployment Gate`**. It directly operationalizes the anti-proxy rule (`proxy-signal-verdicts.md`) by banning heuristic regex string checks for runtime execution validity.
- **Evidence:** Incident recorded in `260821_TaksAdditions.md` Query 3.6 where `$app -match "switchTab"` passed despite fatal syntax errors.
- **Assumptions:** All agents and developers are bound by `.agent/skill-router.yaml` and `PREFLIGHT.md`.
- **Trade-offs:** Pre-flight runtime adds ~200ms to build/deploy loops (completely negligible compared to outage prevention).
- **Risks & Dependencies:** Must be cataloged in `.agent/standards-catalog.json`.
- **Challenge:** If standard numbers and names are not registered in the canonical catalog, future sessions will invent duplicate validation rules.  
  *Concrete Failure Scenario:* An agent creates `P-PREFLIGHT-099` that does 80% of what `P-VERIFY-GATE-002` already does.  
  *What would change my mind:* Immediate registration of `P-VERIFY-GATE-002` in `standards-catalog.json` with explicit cross-references.
- **Confidence:** High.

---

### 7. The Auth & Permission Auditor
- **Position:** Layer 6 of the deployment gate (Security Headers & 404 Pages) and the Auth/DOM Gate must explicitly check for the **Auth Initialization & Hidden DOM Anti-Pattern** discovered in Query 3.5. Specifically:
  1. No security-critical or timer logic may rely on `innerText` inside nodes rendered behind auth gates (`display: none`).
  2. The deployment gate must verify that client-side auth redirection (`auth.js` / `firebase.auth()`) does not deadlock the UI before DOM elements are registered.
- **Evidence:** W3C DOM standard behavior for `innerText` on `display: none` elements vs `textContent`; `public/js/auth.js`.
- **Assumptions:** Authentication gates in SPAs use standard CSS hiding (`display: none`) or conditional rendering.
- **Trade-offs:** Adds a specific check to Layer 1/3 for `innerText` usage in critical components.
- **Risks & Dependencies:** None.
- **Challenge:** Verifying auth security via static scripts alone cannot test actual Firestore rules or OAuth token refreshes.  
  *Concrete Failure Scenario:* Auth script parses cleanly, but security rules deny unauthenticated reads, resulting in blank dashboards for signed-out users.  
  *What would change my mind:* Pre-flight script verifies fallback UI states (`404.html`, unauthenticated login card, loading spinner) are physically present in the DOM tree.
- **Confidence:** High.

---

### 8. The Maintainability & Velocity Auditor (Assigned Dissenter)
- **Position (Dissenting):** **VETO against creating an over-engineered multi-repo npm package or heavyweight dependency framework.** Do NOT build an abstract `@repo/deployment-gate` npm package with webpack/rollup plugins, complex AST parsers, or external npm dependencies. The beauty and velocity of the current solution is that it is **100% native Node.js (zero dependencies), instantaneous (<50ms execution), and requires zero build steps**. Maintainability drops when simple scripts are converted into speculative enterprise frameworks.
- **Evidence:** RFG-001 Burden of Proof; Ponytail engineering philosophy (stdlib over dependencies, minimal surface area); `scripts/verify-deployment.cjs` (199 lines, 0 dependencies).
- **Assumptions:** Repositories have Node.js installed in their CI/local developer environments.
- **Trade-offs:** Individual repos have their own zero-dependency `.cjs` files rather than an external npm package, but they can be synced in 1 second via SAP sync.
- **Risks & Dependencies:** Over-abstraction leads to abandonment and maintenance lag.
- **Challenge:** If we create a monolithic "do-everything" verification script that tries to handle every framework, it will become an unmaintainable 2,000-line monster.  
  *Concrete Failure Scenario:* The verification script grows to 3,000 lines trying to support Next.js, Vite, React, Vue, Svelte, and Vanilla JS, breaking constantly and being disabled with `--no-verify`.  
  *What would change my mind:* Keeping the core scripts strictly modular, zero-dependency, under 250 lines each, tailored with lightweight profile hooks.
- **Confidence:** High.

---

## ⚖️ Phase 2: Synthesis & Recommendation

### 1. Areas of Unanimous Agreement
1. **Never Deploy on Proxy Signals (Zero-Proxy Invariant):** Regex matching (`Select-String` / `$file -match "functionName"`) is completely forbidden as a pre-flight or CI verification signal for code correctness. Actual AST compilation (`new Function(code)` / parser) and call-graph contract verification must occur.
2. **Two-Stage Assurance Lifecycle:**
   - **Stage 1 (Pre-Flight Release Gate):** `npm run verify:deployment` running 6 programmatic layers before any hosting deploy.
   - **Stage 2 (Refactoring/Decomposition Audit):** `npm run audit:decomposition` running AST diffs against git history to prove zero dropped functions, CSS selectors, or DOM IDs.
3. **Zero-Dependency Native Architecture:** All verification scripts must use standard Node.js built-ins (`fs`, `path`, `child_process`) to execute instantaneously without `node_modules` overhead.
4. **W3C DOM Compliance (`innerText` vs `textContent`):** Enforce `textContent` over `innerText` for dynamic mutations in elements that may render in hidden trees (`display: none`).

### 2. Disagreements & Resolution
- **NPM Package vs. Standalone SAP-Synced Scripts:**
  - *Conflict:* Service Layer Auditor suggested a generic configurable engine/package; Maintainability Auditor (Dissenter) strongly objected to external npm dependencies and over-engineering.
  - *Resolution:* Adopt the Maintainability Auditor's recommendation. Do **NOT** publish an npm package. Maintain the zero-dependency `.cjs` scripts within the shared template (`templates/web-spa-shell/`) and synchronize them across repositories via standard **SAP Sync** (`.agent/workflows/sap-sync.md`).

### 3. Verbatim Challenge Quotes & Resolutions

> **SSOT Authority Auditor:** *"If we only create a workflow/pattern without embedding it into the mandatory pre-flight gate (`npm run verify:deployment` / `npm run preflight`), developers will skip it under time pressure."*  
> **Resolution:** Mechanically bound: `package.json` deploy scripts and `.agent/PREFLIGHT.md` require `npm run verify:deployment` to exit 0 before `firebase deploy`.

> **Schema & Firestore Auditor:** *"A naive string matching check (`code.includes(dataObject)`) is still a proxy signal; an object can exist as a dead comment or an empty object `{}` and still pass."*  
> **Resolution:** Hardened `forensic-audit.cjs` to evaluate object key counts and verify exported object integrity.

> **Service Layer Integrity Auditor:** *"If the verification engine assumes one specific architecture (e.g. Vanilla HTML with inline `onclick`), it will throw false positives on React/JSX codebases (`onClick={handleClick}`)."*  
> **Resolution:** Separate verification profiles: `verify-deployment.cjs` for Vanilla/Direct DOM SPAs and `verify-react-deployment.cjs` for React/Vite SPAs.

> **Dependency & Impact Auditor:** *"Distributing raw `.cjs` files across 10+ repos leads to copy-paste drift if there is no unified SAP sync protocol."*  
> **Resolution:** Anchored canonical scripts in `Task-Dashboard/scripts/` and registered them in `sap-sync.md` for ecosystem-wide distribution.

> **File Placement Auditor:** *"Placing too many fine-grained scripts in `scripts/` clutters the tooling namespace."*  
> **Resolution:** Consolidated strictly into two primary entry points: `npm run verify:deployment` and `npm run audit:decomposition`.

> **Decision & Standards Auditor:** *"If standard numbers and names are not registered in the canonical catalog, future sessions will invent duplicate validation rules."*  
> **Resolution:** Formalized as `P-VERIFY-GATE-002` in `.agent/patterns/web-deployment-gate.md` and registered in `standards-catalog.json`.

> **Auth & Permission Auditor:** *"Auth script parses cleanly, but security rules deny unauthenticated reads, resulting in blank dashboards for signed-out users."*  
> **Resolution:** Layer 6 verifies physical existence of unauthenticated landing fallbacks and branded 404 pages.

> **Maintainability & Velocity Auditor (Dissenter):** *"If we create a monolithic 'do-everything' verification script that tries to handle every framework, it will become an unmaintainable 2,000-line monster."*  
> **Resolution:** Veto honored: scripts remain zero-dependency, single-responsibility, and under 200 lines each.

---

### 4. Recommended Course of Action

| Item | Classification (RFG-001) | Action | Target / Location |
| :--- | :--- | :--- | :--- |
| **1. Standardize 6-Layer Deployment Gate** | **Required Now** | Maintain zero-dependency `verify-deployment.cjs` as mandatory pre-deploy script | `scripts/verify-deployment.cjs` |
| **2. Standardize Forensic Decomposition Audit** | **Required Now** | Maintain `forensic-audit.cjs` for AST regression verification against git history | `scripts/forensic-audit.cjs` |
| **3. Universal PACT Pattern `P-VERIFY-GATE-002`** | **Required Now** | Standardize pattern banning regex-based proxy verification | `.agent/patterns/web-deployment-gate.md` |
| **4. SAP Synchronization to Canonical Hub** | **Required Now** | Sync skills, workflows, patterns, and scripts to `Task-Dashboard` | `Task-Dashboard/` via `sap-sync.md` |
| **5. Parameterized Deployment Config** | **Recommended Soon** | Add lightweight optional `.deploymentrc.json` for custom DOM ID / entry lists | `scripts/verify-deployment.cjs` |
| **6. React / Vite AST Checker Profile** | **Future Extension** | Specialized AST runner for React SPAs using Babel parser | Deferred until React refactor session |
| **7. Multi-Repo NPM Package / CLI Suite** | **Speculative (Rejected)** | External `@ecosystem/gate` npm package | **VETOED** (Excess complexity & maintenance overhead) |

---

### 5. Process Notes (ICG-001 §3)
- **Gap:** The previous pre-flight check relied on PowerShell `Select-String` regex matching which passed broken code containing fatal top-level `await` syntax errors.
- **Proposed Fix:** Institutionalize `P-VERIFY-GATE-002` requiring genuine runtime parsing (`new Function(code)`) and call-graph contract validation. Applied and verified in-session.

---

_Deliberation completed & recorded: 2026-08-22 · Architecture Council · Sree Krushna Marriage OS_
