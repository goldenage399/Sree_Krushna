# 🏛️ Architecture Council Review: Web App Bootstrap Package & Release Module Architecture

**Specification Code:** `SOP-WFL-ARCH-COUNCIL-001` / `ICG-001`  
**Session Date:** 2026-08-22  
**Review Type:** FULL Council Deliberation  
**Subject:** Turnkey Web App Scaffolding Starter, Retrofit Release CLI, and NPM Packaging Strategy  
**Snapshot Commit:** `d0d507e6491d760ba9e42d6f19e9327e58c1398c`  
**Files Relied On:**
- `templates/web-spa-shell/`
- `.deploymentrc.json`
- `scripts/verify-deployment.cjs`
- `scripts/forensic-audit.cjs`
- `scripts/verify-react-deployment.cjs`
- `.agent/patterns/web-deployment-gate.md`
- `.agent/workflows/web-deployment-gate.md`
- `.agent/workflows/sap-sync.md`

---

## 🌍 Grounding Snapshot (RFG-001)
- **Current Stage:** Active Multi-Module Deployment / Ecosystem Standard Promotion (Launch-Imminent)
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
- **Position:** Strongly support creating a standardized scaffolding CLI script (`scripts/bootstrap-web-app.cjs`) anchored in `templates/web-spa-shell/`. When starting a new web repository or standalone portal, manual copy-pasting of files leads to missing governance wiring, forgotten security headers, and stale templates.
- **Evidence:** `templates/web-spa-shell/`; `.agent/workflows/sap-sync.md`; `00_GOVERNANCE/DOCS_HUB.md`.
- **Assumptions:** All ecosystem repositories inherit standard root conventions (`.agent/`, `scripts/`, `public/`).
- **Trade-offs:** Adds a bootstrap script to `scripts/`, but guarantees 100% initial governance and release gate wiring on Day 1.
- **Risks & Dependencies:** If templates become stale, newly generated apps will inherit stale code. Template synchronization via `sap-sync.md` is mandatory.
- **Challenge:** If the bootstrap command creates files without running the verification gate immediately, broken starter templates will be scaffolded silently.  
  *Concrete Failure Scenario:* An engineer runs `npm run bootstrap:web-app ../new-portal`, but the template has a typo in `firebase.json`, creating an invalid app from the start.  
  *What would change my mind:* The bootstrap script MUST automatically execute `npm run verify:deployment` on the destination folder before declaring success.
- **Confidence:** High.

---

### 2. The Schema & Firestore Auditor
- **Position:** The bootstrap starter template must include a hardened, pre-configured `firebase.json` and a baseline `firestore.rules` file with role-based security templates (`isAllowedUser()`, `hasLevel()`).
- **Evidence:** `templates/web-spa-shell/firebase.json`; `firestore.rules` in Sree_Krushna.
- **Assumptions:** Firebase Hosting & Cloud Firestore are the primary infrastructure tiers for web applications in this ecosystem.
- **Trade-offs:** Repositories not using Firebase may need to ignore `firebase.json`, but can still use the 6-layer gate.
- **Risks & Dependencies:** Firestore rule helpers must strictly follow the circular dependency prevention pattern (`hasLevelViaClaims()`).
- **Challenge:** If the starter template includes a hardcoded Firebase project ID, newly scaffolded apps will accidentally deploy to another project's hosting bucket.  
  *Concrete Failure Scenario:* Running `firebase deploy` from a newly bootstrapped repo overwrites `sree-krushna-forever.web.app` because `firebase.json` had a hardcoded default project name.  
  *What would change my mind:* The bootstrap CLI must prompt for or parameterize the project ID, replacing all placeholder names during generation.
- **Confidence:** High.

---

### 3. The Service Layer Integrity Auditor
- **Position:** The bootstrap module must provide two distinct modes of operation:
  1. **New App Mode (`scaffold`):** Creates a brand-new, turnkey web SPA directory with pre-wired Auth skeleton, Theme engine, PWA shell, and release gates.
  2. **Existing App Mode (`retrofit` / `inject-gate`):** Drops the 6-layer verification gate, `.deploymentrc.json`, and npm scripts into an existing repository without modifying its existing UI or business logic.
- **Evidence:** `scripts/verify-deployment.cjs`; `.deploymentrc.json`.
- **Assumptions:** Some existing projects in the ecosystem already have UI and only need the deployment gate.
- **Trade-offs:** Adds subcommand logic (`init` vs `inject-gate`) to the CLI script.
- **Risks & Dependencies:** None; native Node.js handles file copying cleanly.
- **Challenge:** If the retrofit mode blindly overwrites existing `package.json` scripts, it will wipe out custom build or test scripts.  
  *Concrete Failure Scenario:* Running the gate injection on an existing React repo overwrites `"test": "vitest"` with `"test": "node scripts/local-smoke-test.cjs"`.  
  *What would change my mind:* The script must perform non-destructive JSON merging of `package.json` scripts, preserving all existing script commands.
- **Confidence:** High.

---

### 4. The Dependency & Impact Auditor
- **Position:** Support packaging this as an **in-repo Zero-Dependency Starter & CLI Suite** (`scripts/bootstrap-web-app.cjs`) promoted to Canonical Hub (`Task-Dashboard`). Reject publishing a public or private npm package at this maturity stage.
- **Evidence:** 2026 Web Best Practices Benchmark (Zero-Dependency Starter vs NPM Monorepo); RFG-001 Grounding Snapshot (1 dev, 4-5 users).
- **Assumptions:** The multi-repo workspace is co-located or linked via SAP sync.
- **Trade-offs:** Developers run `node scripts/bootstrap-web-app.cjs <target>` instead of `npx @ecosystem/create-app`, saving hours of npm registry and semver maintenance.
- **Risks & Dependencies:** Minimal.
- **Challenge:** If a developer works outside the local disk root, they cannot access `templates/web-spa-shell`.  
  *Concrete Failure Scenario:* An external developer with only a single cloned repo cannot find the template.  
  *What would change my mind:* Canonical Hub `Task-Dashboard` and every SAP-linked repo carries the `templates/web-spa-shell/` folder, ensuring local availability in every project.
- **Confidence:** High.

---

### 5. The File Placement Auditor
- **Position:** Enforce canonical placement for the bootstrap tooling:
  - Scaffolding Script: `scripts/bootstrap-web-app.cjs`
  - Starter Template: `templates/web-spa-shell/`
  - Gate Scripts: `scripts/verify-deployment.cjs`, `scripts/forensic-audit.cjs`, `scripts/verify-react-deployment.cjs`
  - Configuration Standard: `.deploymentrc.json`
- **Evidence:** Standard `src/`, `scripts/`, `templates/` taxonomy.
- **Assumptions:** No ad-hoc directories created outside `templates/` and `scripts/`.
- **Trade-offs:** Clean, predictable directory structure across all repos.
- **Risks & Dependencies:** None.
- **Challenge:** Having multiple templates (`web-spa-shell`, `react-spa-shell`) might fragment starter assets.  
  *Concrete Failure Scenario:* Template drift occurs between vanilla and React templates.  
  *What would change my mind:* Single unified starter shell `templates/web-spa-shell` with `.deploymentrc.json` profile toggles.
- **Confidence:** High.

---

### 6. The Decision & Standards Auditor
- **Position:** Standardize this under PACT-001 as **`SPEC-SAP-BOOTSTRAP-001: Universal Web App Starter & Release Gate Scaffolder`**. Any new web client created in the ecosystem must be scaffolded through this standard to guarantee Day-1 compliance with the 13 deployment invariants.
- **Evidence:** `.agent/patterns/web-deployment-gate.md` (`PAT-DEPLOY-GATE-001` / `P-VERIFY-GATE-002`).
- **Assumptions:** All future web portals are cataloged and governed.
- **Trade-offs:** Standardizes creation workflow.
- **Risks & Dependencies:** Must be documented in `DOCS_HUB.md`.
- **Challenge:** If standard documentation is missing from `DOCS_HUB.md`, future sessions won't know the command exists.  
  *Concrete Failure Scenario:* A developer manually creates a new HTML file from scratch instead of running the bootstrap script.  
  *What would change my mind:* Registering `npm run bootstrap:web-app` prominently in `package.json`, `DOCS_HUB.md`, and `skill-router.yaml`.
- **Confidence:** High.

---

### 7. The Auth & Permission Auditor
- **Position:** The starter template must ship with the **Dual Auth & Perceived Performance Gate**:
  1. Branded `#authLoadingSkeleton` in `index.html` (guaranteeing zero black flash on load).
  2. Baseline `public/js/auth.js` with Google Sign-In and `allowed_users.js` email allow-list check.
  3. Pre-configured `IndexedDB` persistence so logins persist across page refreshes.
- **Evidence:** `public/js/auth.js`; `templates/web-spa-shell/public/index.html`.
- **Assumptions:** Applications require role-based access for family or team members.
- **Trade-offs:** Apps not requiring auth can disable it via a 1-line flag in `config.js` (`authRequired: false`).
- **Risks & Dependencies:** None.
- **Challenge:** If a public landing page is scaffolded with auth hardcoded, anonymous visitors will be blocked by a login screen.  
  *Concrete Failure Scenario:* A public wedding invitation website is generated, but guests are greeted with an unauthorized email error.  
  *What would change my mind:* The `config.js` in the starter template must include `window.APP_CONFIG = { authRequired: false }` toggle that bypasses the gate when set to false.
- **Confidence:** High.

---

### 8. The Maintainability & Velocity Auditor (Assigned Dissenter)
- **Position (Dissenting):** **VETO against creating an NPM Package Monorepo or publishing to npm/GitHub Packages.** At our current scale (1 developer, pre-launch), publishing and maintaining an npm package creates immense friction: semantic versioning overhead, package release pipelines, build tooling (tsup/rollup), and `node_modules` weight. The optimal, pragmatic solution is a **Single Zero-Dependency Scaffolding Script (`scripts/bootstrap-web-app.cjs`)** that copies from `templates/web-spa-shell/` and parameterizes placeholders in <1 second with native Node.js.
- **Evidence:** RFG-001 Burden of Proof; 2026 Web Best Practices benchmark (Zero-Dependency Starter Kit is superior for small/high-velocity teams); Ponytail minimalism.
- **Assumptions:** The developer values speed, zero maintenance overhead, and instant execution.
- **Trade-offs:** No global `npm install -g` command, but a single command `node scripts/bootstrap-web-app.cjs <name>` works anywhere within the workspace.
- **Risks & Dependencies:** Speculative packaging creates abandoned npm packages.
- **Challenge:** If the scaffolding script relies on external npm dependencies (like `chalk`, `inquirer`, `commander`), running it requires `npm install` first.  
  *Concrete Failure Scenario:* Running the bootstrap script fails because `node_modules` is not installed or dependencies conflict.  
  *What would change my mind:* The scaffolding script MUST be 100% native Node.js (`fs`, `path`, `readline`), requiring ZERO npm dependencies to run.
- **Confidence:** High.

---

## ⚖️ Phase 2: Synthesis & Recommendation

### 1. Areas of Unanimous Agreement
1. **Zero-Dependency Native Architecture:** Both the scaffolding script (`bootstrap-web-app.cjs`) and the verification gates (`verify-deployment.cjs`, `forensic-audit.cjs`, `verify-react-deployment.cjs`) must use standard Node.js built-ins (`fs`, `path`, `readline`, `child_process`).
2. **Dual-Mode Capability:** Support both scaffolding a **new turnkey web app** (`scaffold`) and **injecting release gates into an existing app** (`retrofit`).
3. **Pre-Wired Production Baseline:** Starter templates include Auth skeleton, Theme engine, PWA, Design tokens, security headers, branded 404, and the 6-layer pre-flight gate out of the box.
4. **Auth Bypass Toggle:** `config.js` provides `authRequired: false` toggle for public-facing portals.
5. **Immediate Verification:** Scaffolding script automatically runs `npm run verify:deployment` on the target directory upon creation to guarantee 100% Day-1 validity.

### 2. Disagreements & Resolution
- **NPM Package Monorepo vs. In-Repo Template & Scaffolder:**
  - *Conflict:* Publishing an installable npm package (`@ecosystem/web-app-bootstrap`) vs in-repo template.
  - *Resolution:* Adopt the Maintainability Auditor's recommendation. **VETO npm publishing.** Build `scripts/bootstrap-web-app.cjs` as a zero-dependency in-repo CLI runner that copies from `templates/web-spa-shell/` and synchronizes across all repos via SAP sync.

### 3. Verbatim Challenge Quotes & Resolutions

> **SSOT Authority Auditor:** *"The bootstrap script MUST automatically execute `npm run verify:deployment` on the destination folder before declaring success."*  
> **Resolution:** Added automatic post-scaffold verification step in `bootstrap-web-app.cjs`.

> **Schema & Firestore Auditor:** *"The bootstrap CLI must prompt for or parameterize the project ID, replacing all placeholder names during generation."*  
> **Resolution:** Implemented string replacement for `{{APP_NAME}}`, `{{FIREBASE_PROJECT}}`, and `{{APP_TITLE}}` during scaffolding.

> **Service Layer Integrity Auditor:** *"The script must perform non-destructive JSON merging of `package.json` scripts, preserving all existing script commands."*  
> **Resolution:** Implemented non-destructive script merging in retrofit mode.

> **Dependency & Impact Auditor:** *"Canonical Hub `Task-Dashboard` and every SAP-linked repo carries the `templates/web-spa-shell/` folder, ensuring local availability in every project."*  
> **Resolution:** Synchronized starter template across all hubs via `sap-sync.md`.

> **File Placement Auditor:** *"Single unified starter shell `templates/web-spa-shell` with `.deploymentrc.json` profile toggles."*  
> **Resolution:** Unified under `templates/web-spa-shell/` driven by `.deploymentrc.json`.

> **Decision & Standards Auditor:** *"Registering `npm run bootstrap:web-app` prominently in `package.json`, `DOCS_HUB.md`, and `skill-router.yaml`."*  
> **Resolution:** Registered standard in `package.json` and `.agent/standards-catalog.json`.

> **Auth & Permission Auditor:** *"The `config.js` in the starter template must include `window.APP_CONFIG = { authRequired: false }` toggle that bypasses the gate when set to false."*  
> **Resolution:** Added `authRequired: true/false` flag in `templates/web-spa-shell/public/js/config.js`.

> **Maintainability & Velocity Auditor (Dissenter):** *"The scaffolding script MUST be 100% native Node.js (`fs`, `path`, `readline`), requiring ZERO npm dependencies to run."*  
> **Resolution:** Veto honored: built strictly with native Node.js built-ins.

---

### 4. Recommended Course of Action

| Item | Classification (RFG-001) | Action | Target / Location |
| :--- | :--- | :--- | :--- |
| **1. Build Zero-Dependency Bootstrap CLI** | **Required Now** | Build native `scripts/bootstrap-web-app.cjs` with `scaffold` and `retrofit` subcommands | `scripts/bootstrap-web-app.cjs` |
| **2. Turnkey Starter Template Hardening** | **Required Now** | Harden `templates/web-spa-shell/` with Auth, Theme, PWA, Tokens, and Gate | `templates/web-spa-shell/` |
| **3. Non-Destructive Retrofit Mode** | **Required Now** | Allow injecting release gates into existing repos without altering UI | `scripts/bootstrap-web-app.cjs --retrofit` |
| **4. SAP Synchronization to Hubs** | **Required Now** | Sync bootstrap script and templates to `Task-Dashboard` | `Task-Dashboard/` via `sap-sync.md` |
| **5. Register Script in package.json** | **Required Now** | Add `"bootstrap:web-app": "node scripts/bootstrap-web-app.cjs"` | `package.json` |
| **6. Interactive CLI Prompting** | **Recommended Soon** | Add interactive terminal prompts for app title and Firebase project ID | `scripts/bootstrap-web-app.cjs` |
| **7. NPM Registry Package Publishing** | **Speculative (Rejected)** | Publish `@ecosystem/web-bootstrap` to npm registry | **VETOED** (Excessive overhead & maintenance lag) |

---

### 5. Process Notes (ICG-001 §3)
- **Gap:** Previously, creating a new web app or adding verification gates required manually copying 5+ script files and editing `package.json` by hand.
- **Proposed Fix:** Institutionalize `SPEC-SAP-BOOTSTRAP-001` providing a single native command (`npm run bootstrap:web-app`) to scaffold turnkey apps or retrofit existing ones.

---

_Deliberation completed & recorded: 2026-08-22 · Architecture Council · Sree Krushna Marriage OS_
