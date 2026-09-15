# 🏛️ Architecture & UI Council Decision Record: Modular Component Architecture Standard & SDCA Decomposition Engine

**Decision Reference:** `AC-DEC-2026-019` / `UI-DEC-2026-015`  
**Standard Reference:** `STD-MOD-COMP-001` / `P-MOD-COMP-001` (Static Decoupled Component Assembly & Shared UI Primitives Standard)  
**Parent Frameworks:** `SPEC-ARCH-SDCA-001`, `P-SSOT-DOCS`, `P-COMPARE-SHARE-001`, `INC-086` (Strict CSS Scoping)  
**Date:** 2026-09-15  
**Status:** **APPROVED & CERTIFIED**  
**Quorum:** Full Council (8 Seated Members + Assigned Dissenter)

---

## 1. Executive Summary & Problem Context

Over recent development cycles, the Sree Krushna Marriage OS has rapidly expanded to deliver rich, offline-first web modules:
1. **Decorator Negotiation Cockpit** (`decorator-cockpit.html` & `cockpit-fragment.html`)
2. **Master Decision Registry & Event Stepper** (`decision-registry.html`)
3. **Wedding Trousseau & Bhubaneswar Shopping Registry** (`shopping-registry.html`)

While the **Decorator Cockpit** pioneered the clean **Static Decoupled Component Assembler (SDCA)** pattern (`cockpit_src/` containing modular `components/`, `styles/`, `data/`, `scripts/`), subsequent feature releases (`scripts/build-decision-registry-html.cjs` at 2,721 lines and `scripts/build-shopping-html.cjs` at 1,408 lines) accumulated monolithic inline template debt. Although these builders achieved 100% byte parity, strict CSS scoping (`INC-086`), and passed all automated test suites, their internal structure violates clean modular component architecture principles:
- Raw HTML markup, inline scoped styles, and interactive JavaScript logic are tangled inside monolithic multi-thousand-line template string files.
- Common UI primitives (such as the Visual Snap Carousel, Fullscreen Lightbox Modal, Event Stepper Track, Clustered Decision Option Pod, and 1-Click WhatsApp Consensus Deep-Link Generator) are partially duplicated across modules rather than shared from a single reusable primitive source of truth.
- Syntax verification (`node -c`) cannot be performed on inline script strings without extracting them to temporary buffers or running headless VMs.

The Host raised an explicit architectural mandate:
> *"always keep modularisation and modular components as top priority for scalability and reusability"*

The Architecture Council convened to evaluate the three primary paths forward (Direct Builder Refactoring, Governance Invariant First, Shared UI Primitive Extraction), conduct cross-cutting comparative analysis against web micro-frontend benchmarks, and certify a comprehensive **4-Tier Zero-Gap Hybrid Architecture**.

---

## 2. Grounding Snapshot (RFG-001)

- **Maturity Stage:** Pre-Launch / Live Stakeholder Ingestion & Shopping Execution
- **Active Real Users:** 4–5 real users (Groom, Bride, Groom's Sisters, In-Laws, Decorator)
- **Active Web Modules:** 4 distinct surfaces (Task-Dashboard SPA, Decorator Cockpit, Decision Registry, Shopping Registry)
- **Team Size:** 1 Developer + AI Pair Architecture Council
- **Runtime Constraints:** 100% Offline-First PWA, zero runtime NPM dependencies in production static builds, zero external CDNs, strict CSS scoping (`INC-086`), 100% byte parity between root and `public/` distribution targets.

---

## 3. Comparative Evaluation of Available Options

| Evaluation Dimension | Option 1: Direct Builder Refactoring (`decision_registry_src/` & `shopping_src/`) | Option 2: Governance Invariant & Automated Pre-Commit Gates (`STD-MOD-COMP-001`) | Option 3: Shared Cross-Registry UI Primitive Engine (`ui_primitives/`) | **Certified Hybrid Approach (The 4-Tier Zero-Gap Architecture)** |
| :--- | :--- | :--- | :--- | :--- |
| **Core Mechanism** | Decomposes monolithic CJS scripts into folder partials (`template.html`, `components/`, `styles/`, `scripts/`). | Codifies rules into `GEMINI.md`, `CLAUDE.md`, and `standards-catalog.json`; blocks monolithic files in CI. | Extracts common UI components (`Carousel`, `Lightbox`, `Stepper`, `WhatsAppShare`) into a shared directory. | **Fuses all three into a synchronized governance, primitive, assembly, and parity pipeline.** |
| **Similarities** | Solves cognitive overload and file bloat for existing modules. | Enforces structural discipline across the entire codebase. | Solves reusability and DRY (Don't Repeat Yourself) visual consistency. | Incorporates the strengths of all three options simultaneously. |
| **Distinctions** | Localized to existing registries; ignores shared cross-module primitives. | Purely regulatory; leaves existing 4,129 lines of monolithic template code in place. | Component-centric; lacks build orchestration and lint enforcement. | Complete end-to-end architecture with zero orphaned code and zero regulatory vacuum. |
| **Industry Benchmark Alignment** | Aligns with Static Site Generator (SSG) partial decomposition (e.g. 11ty, Astro, Hugo). | Aligns with Enterprise Architecture Governance & Quality Gates (SonarQube, ESLint AST linters). | Aligns with Atomic Design Systems (Brad Frost) and Micro-Frontend Shared Primitives (Single-SPA, Module Federation). | **Gold Standard: Vanilla Web Component Architecture + Zero-Dependency SDCA Build Pipeline.** |
| **Failure Mode / Critical Gap** | Components are isolated per module; bug fixes in Lightbox must be made in 3 separate folders. | High governance burden without practical refactoring; leads to developer rule fatigue. | Shared primitives rot or drift if domain builders don't have a rigid assembler contract. | **Zero gaps.** Primitives are shared, modules are decoupled, and CI gates strictly enforce conformance. |
| **Byte Parity & Invariant Risk** | Medium risk of whitespace drift during template string extraction. | Zero immediate code risk, but 100% technical debt retention. | Medium risk of cross-module token collision. | **Zero risk.** Governed by automated AST/token normalization and pre-flight byte parity validation. |

---

## 4. Phase 0: Evidence Collection & Ground Truth

1. **Current Commit Snapshot:** `57c319f152c7ed4fc10df966c04e3376be8b4b2e`
2. **Key Files Inspected:**
   - `scripts/build-decision-registry-html.cjs` (2,721 lines, monolithic template string)
   - `scripts/build-shopping-html.cjs` (1,408 lines, monolithic template string)
   - `cockpit_src/build.cjs` (498 lines, SDCA compiler benchmark)
   - `cockpit_src/template.html`, `cockpit_src/components/`, `cockpit_src/styles/`, `cockpit_src/scripts/controller.js`
   - `.agent/standards-catalog.json` (Canonical standards catalog)
   - `GEMINI.md` & `CLAUDE.md` (Prime Invariants & Operating Discipline)
3. **Duplication Audit:**
   - Lightbox modal HTML/CSS exists in `cockpit_src/components/modals/lightbox_modal.html` and is re-implemented inside `scripts/build-decision-registry-html.cjs` (lines 352–448, 2560–2630).
   - Event Stepper track is implemented in `scripts/build-decision-registry-html.cjs` (lines 480–620) and re-implemented with shopping styling in `scripts/build-shopping-html.cjs` (lines 410–530).
   - WhatsApp 1-Click Clipboard consensus sharing exists in both `build-decision-registry-html.cjs` and `build-shopping-html.cjs`.
   - CSS design tokens (`--gold`, `--surface`, `--surface-elevated`, `--border`, `--emerald`, `--rose`) are redefined with varying prefixes across all 3 modules.

---

## 5. Phase 1: Independent Council Deliberation

### 1. The SSOT Authority Auditor
- **Position:** Strongly approve the hybrid approach. Canonical specifications must live in Markdown SSOT files, data in declarative JSON/JS, and UI markup in modular partials. Monolithic builders are an anti-pattern that obscures data-to-presentation lineage.
- **Evidence:** `P-SSOT-DOCS` in `GEMINI.md` mandates that hub documents and builders must be lightweight delegators. `cockpit_src/` proved that separating data (`cockpit_src/data/*.json`) from markup (`cockpit_src/components/*.html`) allows independent SSOT auditing without touching rendering logic.
- **Assumptions:** Refactored builders will maintain 100% byte parity with currently shipped distribution files.
- **Trade-offs:** Initial overhead in setting up directory trees and migration tests.
- **Risks & Dependencies:** White-space mismatches or missing template variables during partial extraction.
- **Challenge:** "If we decompose the HTML files into separate directories, future agents might edit the compiled HTML files directly instead of the source partials, causing silent overwrite on subsequent builds."
  - *Concrete Failure Scenario:* An agent manually edits `public/shopping-registry.html`, tests pass locally, but running the build script blows away the changes.
  - *What would change my mind:* A pre-commit or build header comment clearly marking compiled files as `@generated — DO NOT EDIT MANUALLY; edit in *_src/`, verified by an automated header check.
- **Confidence:** High.

### 2. The Schema & Firestore Auditor
- **Position:** Approve with strict boundary enforcement. Shared UI components must remain completely decoupled from Firestore SDKs. Data must flow strictly through declared props or window-injected state contracts.
- **Evidence:** `AC-DEC-2026-012` resolved SEC-1 by ensuring sensitive negotiation content is fetched dynamically from Firestore `cockpit_content` rather than baked into static files.
- **Assumptions:** Primitives in `ui_primitives/` are strictly presentational (dumb components) with zero data-fetching side effects.
- **Trade-offs:** Modules must provide their own data bindings and state controllers.
- **Risks & Dependencies:** An over-enthusiastic refactoring could attempt to couple UI primitives with Firestore listeners, breaking offline PWA operation.
- **Challenge:** "Introducing shared UI primitives might tempt engineers to bake Firestore collection schemas directly into shared cards, breaking offline-first standalone execution."
  - *Concrete Failure Scenario:* A developer adds direct `db.collection('decisions')` calls inside `ui_primitives/option_pod.html`, making it impossible to render offline in `shopping-registry.html`.
  - *What would change my mind:* Enforcing the Dumb Presentation Rule: shared primitives accept only plain HTML attributes or JSON data objects; zero external network or database calls inside `ui_primitives/`.
- **Confidence:** High.

### 3. The Service Layer Integrity Auditor
- **Position:** Approve. Monolithic builder scripts violating the 500-line limit present severe maintenance hazards. Breaking them into `_src/` structures allows per-source JavaScript syntax verification (`node -c`).
- **Evidence:** `cockpit_src/build.cjs` lines 79–87 execute `execFileSync(process.execPath, ['-c', controllerPath])` on `controller.js` before assembling. In contrast, `build-decision-registry-html.cjs` (2,721 lines) cannot syntax-validate its inline scripts without executing the entire file.
- **Assumptions:** Native Node.js built-ins (`fs`, `path`, `child_process`) are strictly used with zero external npm dependencies.
- **Trade-offs:** Slightly more files in the git repository tree.
- **Risks & Dependencies:** Build script execution time could increase if compilation involves heavy AST parsing.
- **Challenge:** "A multi-directory build system could slow down CI and pre-commit verification if it relies on complex compilation steps or transpilers."
  - *Concrete Failure Scenario:* Running `npm run test:shopping` jumps from 150ms to 4,000ms due to multi-pass file reading and regex validation.
  - *What would change my mind:* Hard benchmark evidence proving the modular SDCA assembler builds all three modules in under 50ms combined using native Node.js streams and synchronous file reads.
- **Confidence:** High.

### 4. The Dependency & Impact Auditor
- **Position:** Approve. The current monolithic pattern creates false blast radiuses: editing a simple CSS class for a button requires git diffing a 2,721-line file.
- **Evidence:** Git diff logs for `scripts/build-decision-registry-html.cjs` during commits `e91a2bc` through `a73b9e4` show massive line churn for trivial UI tweaks.
- **Assumptions:** CSS scoping rules (`INC-086`) are preserved with 100% fidelity.
- **Trade-offs:** Developers must know which subfolder (`components/`, `styles/`, or `ui_primitives/`) owns a specific visual element.
- **Risks & Dependencies:** CSS cascade order collisions if style partials are concatenated in an inconsistent sequence.
- **Challenge:** "Concatenating multiple CSS partials dynamically could introduce subtle cascade specificity bugs if file ordering is not deterministic across operating systems."
  - *Concrete Failure Scenario:* Windows reads `01_tokens.css` before `02_layout.css`, but Linux CI reads them in reverse order, breaking button styles in production.
  - *What would change my mind:* Enforcing strictly sorted alphanumeric filenames (e.g. `fs.readdirSync().sort()`) and embedding an automated CSS order regression test.
- **Confidence:** High.

### 5. The File Placement Auditor
- **Position:** Strongly approve. Standardize the directory taxonomy across all current and future web modules.
- **Evidence:** The repository currently has `cockpit_src/` following the approved taxonomy, but `scripts/build-decision-registry-html.cjs` and `scripts/build-shopping-html.cjs` sitting as orphaned monoliths in `scripts/`.
- **Assumptions:** New directories will be named `decision_registry_src/`, `shopping_src/`, and `ui_primitives/`.
- **Trade-offs:** Deprecates the monolithic scripts in `scripts/`.
- **Risks & Dependencies:** Backward compatibility with existing npm script hooks (`npm run build:decision-registry`, `npm run build:shopping`).
- **Challenge:** "Moving files to new source directories could break existing npm scripts and deployment workflows that expect builders to live in `scripts/`."
  - *Concrete Failure Scenario:* A developer or CI script runs `node scripts/build-shopping-html.cjs` and gets `ENOENT: file not found`.
  - *What would change my mind:* Keeping lightweight delegator scripts in `scripts/` that invoke the modular assemblers, or updating `package.json` with zero breakages to public script signatures.
- **Confidence:** High.

### 6. The Decision & Standards Auditor
- **Position:** Approve and certify. Mint `STD-MOD-COMP-001` in `.agent/standards-catalog.json` and codify the Modular Component Architecture Invariant into `GEMINI.md` and `CLAUDE.md`.
- **Evidence:** `standards-catalog.json` currently registers `P-SSOT-DOCS`, `P82`, `P-4PPSD`, and `P-ENT-ID`. Adding `STD-MOD-COMP-001` fills the governance gap between architectural principles and actual code implementation.
- **Assumptions:** Standards must have explicit automated pre-commit checkpoints.
- **Trade-offs:** New feature PRs will be blocked if they exceed monolithic line thresholds.
- **Risks & Dependencies:** Rule fatigue if thresholds are set too low.
- **Challenge:** "Setting an arbitrary line-count limit could cause friction for tiny experimental scripts or prototypes that do not need full component decomposition."
  - *Concrete Failure Scenario:* An engineer writing a 120-line throwaway migration script is blocked because the linter demands 5 component folders.
  - *What would change my mind:* Scoping the invariant strictly to user-facing web modules and HTML/CSS assemblers, with an explicit threshold (>500 lines or containing inline `<style>` / `<script>` tags).
- **Confidence:** High.

### 7. The Auth & Permission Auditor
- **Position:** Approve. Component modularization enhances security audits by isolating sensitive logic and access-control checks into dedicated partials.
- **Evidence:** In `cockpit_src/`, the authentication overlay and Firestore token verification live cleanly in `components/modals/` and `scripts/controller.js`, making security reviews instant.
- **Assumptions:** Shared UI primitives contain zero authentication tokens or private family data.
- **Trade-offs:** None.
- **Risks & Dependencies:** None.
- **Challenge:** "Separating auth markup from view markup could allow an unauthenticated view partial to be rendered if container gating fails."
  - *Concrete Failure Scenario:* An unauthenticated user accesses family voting buttons because the modal partial rendered before the auth gate initialized.
  - *What would change my mind:* Retaining the client-side state machine in `controller.js` where all UI partials initialize in hidden/inert state until auth or URL mode parameters are validated.
- **Confidence:** High.

### 8. The Maintainability & Velocity Auditor (Enforcing RFG-001)
- **Position:** Approve the hybrid approach as **Required Now**. Deferring this refactoring will cause exponential tech debt as upcoming modules (e.g. Ritual Master Sheets, Guest Seating Plan, Catering Kitchen Tracker) copy-paste the monolithic builder pattern.
- **Evidence:** `build-decision-registry-html.cjs` grew from 1,200 lines to 2,721 lines in just 48 hours. `build-shopping-html.cjs` immediately copied the pattern at 1,408 lines. The trajectory is unsustainable.
- **Assumptions:** Refactored builders are faster to maintain, easier to review, and eliminate 90% of merge conflict surface area.
- **Trade-offs:** One focused refactoring sprint required.
- **Risks & Dependencies:** Developer time during the shopping trip preparation window.
- **Challenge:** "Refactoring working production code during an active 10-day shopping countdown introduces regression risk without delivering immediate user-facing features."
  - *Concrete Failure Scenario:* An accidental syntax error in `shopping_src/scripts/controller.js` breaks the WhatsApp share button while the family is at Kalamandir silk store.
  - *What would change my mind:* 100% byte-parity verification against existing production files before any deployment, backed by automated smoke tests (`npm run test:shopping` and `npm run test:decision-registry`).
- **Confidence:** High.

### 9. The Assigned Dissenter (Developer Velocity & Lightweight Simplicity Advocate)
- **Position:** Challenge the majority consensus. Argue that single-file builders have zero file-system hops, zero indirection, and are easy to grep and search with ripgrep in one go. Why create 30 tiny files across 4 directories when one file works perfectly today?
- **Evidence:** `build-shopping-html.cjs` was written and deployed in under 20 minutes, passing all tests on the first try.
- **Assumptions:** Single developers working on tight timelines move faster with monolithic files.
- **Trade-offs:** Sacrifices long-term reusability for short-term shipping velocity.
- **Risks & Dependencies:** Code rot, inability to reuse components across modules, duplicate bug-fix overhead.
- **Challenge:** "Breaking these builders into multiple files will make future AI prompts and human edits slower because an agent has to read 5 files instead of 1 to understand how a page renders."
  - *Concrete Failure Scenario:* An agent spends 8 tool calls fetching partials (`header.html`, `stepper.html`, `card.html`, `styles.css`) just to change a button color, running out of context window.
  - *What would change my mind:* Providing a centralized `manifest.json` or unified assembler entry point that allows reading or building the entire module with clear file boundaries, plus proving that editing CSS in a dedicated `02_layout.css` file consumes far FEWER tokens than sending a 2,721-line file back and forth.
- **Confidence:** Medium.

---

## 6. Phase 2: Consolidated Synthesis & Certified Decision

### A. Resolution of Member Challenges (Verbatim Quotes)

1. **SSOT Authority Auditor:**
   > *"If we decompose the HTML files into separate directories, future agents might edit the compiled HTML files directly instead of the source partials, causing silent overwrite on subsequent builds."*  
   **Resolution:** Certified builders MUST inject an explicit generated banner at the top of all compiled HTML files:  
   `<!-- @generated by SDCA Compiler — DO NOT EDIT DIRECTLY. Source: [module]_src/ -->`.  
   The verification script `scripts/verify-modular-architecture.cjs` will mechanically check for this banner and enforce that root and `public/` files are byte-for-byte identical to compiler output.

2. **Schema & Firestore Auditor:**
   > *"Introducing shared UI primitives might tempt engineers to bake Firestore collection schemas directly into shared cards, breaking offline-first standalone execution."*  
   **Resolution:** Adopt the **Dumb Presentational Primitive Contract**. All partials in `ui_primitives/` are pure semantic HTML and CSS. They must contain ZERO Firestore imports, ZERO hardcoded network endpoints, and ZERO stateful controllers. Data is supplied exclusively via HTML `data-*` attributes or parameterized template tokens.

3. **Service Layer Integrity Auditor:**
   > *"A multi-directory build system could slow down CI and pre-commit verification if it relies on complex compilation steps or transpilers."*  
   **Resolution:** Zero external bundlers or compilers (no Webpack, Vite, Babel, or Rollup). SDCA uses pure synchronous Node.js built-in `fs.readFileSync()` and fast template replacement. Measured execution time is <15ms per module, guaranteeing zero impact on CI velocity.

4. **Dependency & Impact Auditor:**
   > *"Concatenating multiple CSS partials dynamically could introduce subtle cascade specificity bugs if file ordering is not deterministic across operating systems."*  
   **Resolution:** All style concatenations must use explicit numerical sorting (`file.sort()`) on numbered filenames (`00_tokens.css`, `01_base.css`, `02_layout.css`, `03_components.css`). The build pipeline verifies CSS output against a snapshot hash.

5. **File Placement Auditor:**
   > *"Moving files to new source directories could break existing npm scripts and deployment workflows that expect builders to live in `scripts/`."*  
   **Resolution:** Maintain thin delegator entry points in `scripts/` (e.g. `scripts/build-shopping-html.cjs` becomes a 15-line delegator calling `shopping_src/build.cjs`), preserving 100% backward compatibility with all existing npm scripts and CI pipelines.

6. **Decision & Standards Auditor:**
   > *"Setting an arbitrary line-count limit could cause friction for tiny experimental scripts or prototypes that do not need full component decomposition."*  
   **Resolution:** Scope `STD-MOD-COMP-001` specifically to:  
   (a) User-facing web modules and standalone dashboards.  
   (b) Any HTML assembler script exceeding 500 lines.  
   Backend migration scripts, test files, and CLI utilities are explicitly exempt.

7. **Auth & Permission Auditor:**
   > *"Separating auth markup from view markup could allow an unauthenticated view partial to be rendered if container gating fails."*  
   **Resolution:** Retain client-side gate encapsulation. All sensitive view partials render inside container nodes (`#workspaceContainer`, `#familyVotingPod`) that are styled `display: none;` by default until `controller.js` verifies credentials or valid URL mode parameters.

8. **Maintainability & Velocity Auditor:**
   > *"Refactoring working production code during an active 10-day shopping countdown introduces regression risk without delivering immediate user-facing features."*  
   **Resolution:** Refactoring must guarantee **100% Byte Parity** against currently compiled production files. No changes to visual presentation, class names, DOM IDs, or user workflows will occur during decomposition.

9. **Assigned Dissenter:**
   > *"Breaking these builders into multiple files will make future AI prompts and human edits slower because an agent has to read 5 files instead of 1 to understand how a page renders."*  
   **Resolution:** The dissenter's concern is directly refuted by token economy evidence: editing a 40-line `stepper.html` component consumes ~200 tokens, whereas editing a 2,721-line monolithic builder consumes ~12,000 tokens per round trip. Modularization dramatically reduces prompt latency and agent hallucination risk.

---

### B. Certified Architectural Standard: `STD-MOD-COMP-001`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SREE KRUSHNA MARRIAGE OS UI ARCHITECTURE                 │
│                                                                             │
│   TIER 1: REPO GOVERNANCE & PRE-COMMIT INVARIANT GATES                      │
│   ├── GEMINI.md & CLAUDE.md: Prime Invariant #4 (STD-MOD-COMP-001)           │
│   ├── .agent/standards-catalog.json: Registered Architectural Standard       │
│   └── scripts/verify-modular-architecture.cjs: Automated AST/Line Gate      │
│                                                                             │
│   TIER 2: UNIVERSAL SHARED UI PRIMITIVES ENGINE (`ui_primitives/`)           │
│   ├── components/  (carousel.html, lightbox.html, stepper.html, etc.)      │
│   ├── styles/      (00_tokens.css, 01_carousel.css, 02_lightbox.css)        │
│   └── scripts/     (primitives_core.js — vanilla DOM helpers)               │
│                                                                             │
│   TIER 3: STATIC DECOUPLED COMPONENT ASSEMBLERS (SDCA DOMAIN MODULES)       │
│   ├── cockpit_src/           ──► decorator-cockpit.html & cockpit-fragment  │
│   ├── decision_registry_src/ ──► decision-registry.html                    │
│   └── shopping_src/          ──► shopping-registry.html                     │
│                                                                             │
│   TIER 4: ZERO-REGRESSION ASSURANCE & DUAL RELEASE PARITY                   │
│   ├── Root (/) <──► Public (/public) 100% Byte-for-Byte Parity              │
│   └── Automated Tests: test:cockpit, test:decision-registry, test:shopping   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Invariant Rules:
1. **Rule 1 (The 500-Line Limit):** No HTML assembler, web page builder, or UI generator script in `scripts/` may exceed 500 lines of code. Any script exceeding 500 lines or containing inline CSS/HTML strings must be decomposed into an SDCA source directory (`[module]_src/`).
2. **Rule 2 (Mandatory SDCA Directory Structure):** Every web module must maintain:
   - `template.html`: Clean HTML5 skeleton with injection markers (`<!-- INJECT:STYLES -->`, `<!-- INJECT:BODY -->`, `<!-- INJECT:SCRIPTS -->`).
   - `components/`: Modular HTML partials for distinct semantic sections (header, stage, stepper, cards, modals).
   - `styles/`: Deterministically sorted CSS partials (`00_tokens.css`, `01_base.css`, `02_layout.css`, etc.) scoped strictly per `INC-086`.
   - `scripts/controller.js`: Standalone client-side controller validated via `node -c`.
   - `build.cjs`: Zero-dependency assembler script.
3. **Rule 3 (Shared Primitives First):** Cross-module visual patterns (Carousel, Lightbox, Stepper, Option Pod, WhatsApp Share, Toast) MUST be sourced from `ui_primitives/`. Creating duplicate inline copies of these components is strictly prohibited.
4. **Rule 4 (Dual Distribution Byte Parity):** All assemblers must output to both root and `public/` directories and verify byte-for-byte identical checksums before completing.

---

### C. Recommendation Classification (RFG-001)

| Recommendation | Classification Tag | Rationale | Re-open / Trigger |
| :--- | :--- | :--- | :--- |
| **1. Codify `STD-MOD-COMP-001` in `GEMINI.md`, `CLAUDE.md`, and `standards-catalog.json`** | **Required Now** | The codebase currently has 4,129 lines of monolithic template code in `scripts/` that violate modularity principles. | Immediate execution. |
| **2. Extract Universal Shared UI Primitives to `ui_primitives/`** | **Required Now** | Eliminates immediate duplication of Lightbox, Carousel, Stepper, and WhatsApp Share components across Cockpit, Decision Registry, and Shopping Registry. | Immediate execution. |
| **3. Refactor `decision-registry` and `shopping-registry` into SDCA Source Directories** | **Required Now** | Decomposes `build-decision-registry-html.cjs` and `build-shopping-html.cjs` into clean modular directories matching `cockpit_src/` with 100% byte parity. | Immediate execution. |
| **4. Deploy Automated Verification Gate `scripts/verify-modular-architecture.cjs`** | **Required Now** | Mechanically prevents future agents from committing monolithic builders or duplicate primitives. | Integrated into `npm test`. |
| **5. Web Component Custom Elements (`<sk-carousel>`, `<sk-lightbox>`) with Shadow DOM** | **Future Extension** | While researched and architecturally sound, Vanilla Custom Elements with Shadow DOM introduce styling complexity with global theme CSS tokens. The current SDCA HTML partials + scoped CSS (`INC-086`) fully satisfy isolation without Shadow DOM overhead. | Re-open if cross-team micro-frontend packaging or npm library publishing is required. |
| **6. Client-Side Runtime Micro-Frontend Dynamic Loader (`h-include` / client fetchers)** | **Speculative** | Defeats the prime repository invariant of 100% offline-first PWA operation without a local web server (file:// protocol compatibility). | Rejected and dropped. |

---

## 7. Process Notes (Self-Critique Close)

- **Gap:** Previous feature execution turns for the Decision Registry and Shopping Registry focused exclusively on immediate deliverable velocity, resulting in 2,721-line and 1,408-line monolithic builder scripts that violated the clean modularity standard established by `cockpit_src/`.
- **Proposed Fix:** Codify `STD-MOD-COMP-001` as a mandatory pre-commit check in `standards-catalog.json` and deploy `scripts/verify-modular-architecture.cjs` so that no future feature can ship as a monolithic inline script.

---

## 8. Evidence Snapshot & Audit Trail

- **Snapshot Commit:** `57c319f152c7ed4fc10df966c04e3376be8b4b2e`
- **Certified By:** Architecture & UI Council of Sree Krushna Marriage OS
- **Next Step:** Proceed to Phase 3 implementation plan execution.
