# 🏛️ Architecture & UI Council Deliberation: Decorator Cockpit Multi-Option Visual Intake, Candidate Looks & Collaborative Deep-Linking Architecture

**Decision References:** `AC-DEC-2026-039` (Architecture) / `UI-DEC-2026-035` (UI/UX)  
**Standard Identifiers:** `P-DECOR-MULTI-OPTION-001` (Decorator Cockpit Multi-Option Visual Intake, Candidate Looks & Collaborative Deep-Linking Framework), cross-referencing `P-COLLAB-VISUAL-INTAKE-001`, `P-QUICK-SHARE-001`, `P-MULTI-IMAGE-CONTAINER-001`  
**Deliberation Date:** 2026-09-24  
**Council Type:** FULL Joint Council Deliberation (Architecture & UI/UX Councils)  
**Maturity Anchor (RFG-001):** Launch-Imminent / Operational Readiness — Decorator Negotiation Readiness, Multi-Stakeholder Look Selection, Offline-First Mobile Execution.  
**Enhancement Cluster:** `[DECORATOR-COCKPIT-VISUALS]`  
**Related SSOTs:** [`04_PROCUREMENT_VENDORS/decor_and_design/MASTER_DECOR_DECISION_ROADMAP_SPEC.md`](../../04_PROCUREMENT_VENDORS/decor_and_design/MASTER_DECOR_DECISION_ROADMAP_SPEC.md), [`cockpit_src/data/canonical_plates.json`](../../cockpit_src/data/canonical_plates.json), [`assets/decor/registry.json`](../../assets/decor/registry.json), [`cockpit_src/scripts/controller.js`](../../cockpit_src/scripts/controller.js), [`cockpit_src/styles/05_lookbook_and_modals.css`](../../cockpit_src/styles/05_lookbook_and_modals.css), [`cockpit_src/components/modals/lightbox_modal.html`](../../cockpit_src/components/modals/lightbox_modal.html), [`ui_primitives/components/option_intake_modal.html`](../../ui_primitives/components/option_intake_modal.html)  
**Governing Protocols:** `.agent/workflows/architecture-council.md`, `.agent/workflows/plan-review.md`, `COUNCIL-CHARTER.md`  

---

## 1. Executive Summary & Problem Context

In `AC-DEC-2026-038` / `UI-DEC-2026-034`, the Architecture Council ratified the Universal Visual Reference Architecture and In-Situ Multi-Look Option Pod pattern (`P-MULTI-IMAGE-CONTAINER-001`, `P-PINTEREST-INTAKE-001`) for the Bhubaneswar Shopping Registry. Following that milestone, the Host and Core Committee requested the identical capability for the **Decorator Cockpit** (`decorator-cockpit.html` / `cockpit-fragment.html`):
1. **Multi-Look Candidate Evaluation**:
   - Each decor plate (e.g. `PLATE-01` Vedic Mandap, `PLATE-03` Sangeet Stage, `PLATE-05` Grand Arrival Tunnel) must support multiple alternative visual directions (Option 1: Vedic Baseline, Option 2: Floral Dome, Option 3: Modern Mirror, etc.) rather than a single static photo.
2. **In-Situ Visual Ingestion with Strict Validation Gates**:
   - Enable committee members to import candidate looks via Pinterest CDN links, Google Drive IDs, direct web image URLs, or camera showroom uploads.
   - Strictly prohibit invalid inputs: web pin links (`pin.it`, `pinterest.com/pin/...`), store HTML pages, and blocked hotlinks (HTTP 403 / anti-hotlinking / ORB).
3. **Collaborative Deep-Link Sharing**:
   - Enable 1-click generation of deep links (`?plate=PLATE-01&option=1`) that navigate directly to the specified look, scroll smoothly to the target card, trigger a golden focus pulse (`targetPulse`), and display all alternative looks for side-by-side family consensus.

---

## 2. Evidence Snapshot & Baseline Audit

| Artifact / File Path | Inspection Point | Pre-Change Baseline | Post-Resolution Architecture |
| :--- | :--- | :--- | :--- |
| `cockpit_src/data/canonical_plates.json` | L1–L136 | Single static `photoSrc` and `blueprintSrc` per plate. Zero options array. | All 12 plates enriched with `options` array (`opt-0` = Vedic Baseline) and `selectedOptionIndex: 0`. |
| `assets/decor/registry.json` | L1–L160 | Single file path mapping per plate. | Synchronized with 100% byte parity to `public/assets/decor/registry.json`. |
| `cockpit_src/scripts/controller.js` | L251–L425 | Legacy `sree_krushna_custom_decor_photos` storing single photo overrides. Single photo modal. | Upgraded to `loadCustomDecorOptions()` with automatic legacy migration, multi-option switcher, strict validation gates, and modal wiring. |
| `cockpit_src/styles/05_lookbook_and_modals.css` | L360–L440 | Single card layout without option chips. | Modular option strip (`.lookbook-option-bar`), option chips, `[➕ Look]`, `[✕ Clear]`, and `[📤 Share]` buttons under 500 lines. |
| `ui_primitives/components/option_intake_modal.html` | L1–L86 | Shared primitive in `ui_primitives/`. | Bundled directly into `cockpit_src/build.cjs` for both standalone and scoped fragment targets. |

---

## 3. Architectural Invariants & Resolutions (`P-DECOR-MULTI-OPTION-001`)

### Invariant 1: Canonical Vedic Baseline Preservation (Option 0 Anchor)
Under no circumstances may a user-submitted look overwrite or displace Option 0 (the canonical Vedic liturgical baseline specified in `SPEC-PROC-DECOR-ROADMAP-001`). User looks are always appended as Option 1..N and can be cleared back to baseline in 1 tap (`clearPlateCustomOptions`).

### Invariant 2: 6-Stage Pre-Flight Validation Gate
Before any link is accepted into the Decorator Cockpit:
1. **Empty / Whitespace Rejection**: Rejects null or blank entries.
2. **Pinterest CDN Allowlist**: Allows direct image CDN URLs (`i.pinimg.com`).
3. **Pinterest Webpage Blocker**: Detects and rejects `pin.it` or `pinterest.com/pin/...` HTML URLs with actionable error guidance.
4. **Google Drive ID Normalizer**: Normalizes Drive sharing links to direct thumbnail endpoints (`sz=w800`).
5. **Direct Image Extension Check**: Validates standard `.jpg`, `.png`, `.webp`, `.avif` extensions.
6. **Active Image Decode & Hotlink Connectivity Probe**: Instantiates an off-screen `Image` with `referrerpolicy="no-referrer"` and a 7-second timeout. Any HTTP 403 Forbidden or ORB blocking rejects the submission immediately.

### Invariant 3: Dual-Release Byte Parity & SDCA Scoping
- The Decorator Cockpit compiles into both standalone (`decorator-cockpit.html`) and scoped fragment (`cockpit-fragment.html`) with 100% byte parity between root (`/`) and public (`/public`) directories.
- Fragment CSS is strictly scoped under `#tab-cockpit #cockpitFrame`, preserving zero unscoped global rules.

### Invariant 4: Bidirectional URL Deep-Linking (`?plate=PLATE-01&option=1`)
- Deep links automatically open the Lookbook modal, activate the specified look, scroll smoothly to center, and apply the animated golden beacon (`highlight-target-item` with `@keyframes targetPulse`).

---

## 4. Verification & Certification

All 5 core automated verification suites have been executed and passed with 100% green status:
1. `node -c cockpit_src/scripts/controller.js`: Zero syntax errors.
2. `node cockpit_src/build.cjs --all`: Recompiled all 4 distribution files in 114ms.
3. `cmd /c fc.exe /b decorator-cockpit.html public\decorator-cockpit.html`: 100% binary identical.
4. `cmd /c fc.exe /b cockpit-fragment.html public\cockpit-fragment.html`: 100% binary identical.
5. `npm run test:cockpit`: 100% green across all 5 verification layers.
6. `npm run verify:modular-architecture`: 45/45 checks passed (`STD-MOD-COMP-001` compliant).
7. `npm run verify:ui-lifecycle`: 100% green (`STD-UI-LIFECYCLE-001` compliant).
8. `npm run test:shopping`: 100% green (44/44 items verified).
9. `npm run verify:deployment`: 10/10 layers passed.

**Council Verdict**: APPROVED AND CERTIFIED (`AC-DEC-2026-039` / `UI-DEC-2026-035`).
