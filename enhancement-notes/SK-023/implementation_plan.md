# SK-023 Implementation Plan: Universal Scoped Container Print Engine & Tabular Run Sheet Artisan Skill

> **Governing Ticket**: [`enhancement-notes/SK-023/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-023/00_ENHANCEMENT_INDEX.md)  
> **Council Rulings**: `AC-DEC-2026-065` / `UI-DEC-2026-049`  
> **Standards Activated**: `STD-UI-PRINT-CONTAINER-001` / `STD-TABULAR-RUN-SHEET-SKILL-001` / `INV-PRINT-ZERO-DUMP-001` / `INV-PRINT-IFRAME-SANDBOX-001`  
> **Target Release**: v2.9.2  
> **Goal**: Eliminate the 50-to-60 page SPA print dump by de-multiplexing global `@media print` in `main.css`, author a zero-bleed sandboxed headless iframe print primitive in `ui_primitives/scripts/print_engine.js`, and provide a reusable skill for turning any tabular dataset into an ink-saving A4 run sheet.  
> **Architecture**: 3-Tier Print Architecture — (1) Sandboxed Headless Print Iframe Primitive, (2) Active-Tab Global Print De-multiplexer, and (3) Universal Tabular Run Sheet Artisan Skill & CLI Generator.  
> **Tech Stack / Toolchain**: Vanilla JS (ES6+), Headless Iframe Sandbox, `@media print` CSS, Node.js CommonJS test harnesses.

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax & Invariants | Zero unescaped syntax errors (`node -c`), strict modularity ceiling (<500 lines per file), zero unconditional `.tab-content { display: block !important; }` in `main.css`. |
| **T2** | **Functional** | Unit / Contract | `scripts/test-print-container-contract.cjs` passes 100% green; headless simulation verifies iframe sandbox creation, CSS injection, and garbage collection. |
| **T3** | **Integrated** | Cross-Module Parity | Global Ctrl+P prints only the active tab; container print prints strictly the target element; 100% byte parity between root and `/public`. |
| **T4** | **Governance** | Compliance | Architecture Council certified (`AC-DEC-2026-065`), P82 governance wiring 100% green, enhancement registry updated. |

---

## User Review Required

> [!IMPORTANT]
> **Retirement of Unconditional Multi-Tab Print Unrolling in `main.css` (`INV-PRINT-ZERO-DUMP-001`)**:
> Previously, line 3059 of `public/css/main.css` forced `.tab-content { display: block !important; page-break-after: always; }`. This meant pressing Ctrl+P anywhere in the app printed **all 13 tabs simultaneously (50–60 pages)**.
> In Phase 1, this will be replaced with:
> ```css
> .tab-content.active { display: block !important; }
> .tab-content:not(.active) { display: none !important; }
> ```
> This ensures that browser-level printing (Ctrl+P) only ever prints the single tab the user is actively viewing.

> [!NOTE]
> Container-scoped printing (e.g. printing solely an 8-column obligations table or trousseau catalog) will execute through `window.skPrintContainer(target, options)`. It utilizes a temporary hidden `<iframe>` to guarantee 100% DOM and CSS isolation, preventing any parent app chrome, quick-actions popover, or sidebar from polluting the printout.

---

## Proposed Changes

### Component 1: Global SPA Print De-Multiplexer

#### [MODIFY] [`public/css/main.css`](file:///d:/GitHub_Repo/Sree_Krushna/public/css/main.css#L3056-L3063)
- Retire unconditional `.tab-content { display: block !important; page-break-after: always; }`.
- Enforce active-tab print isolation:
  ```css
  @media print {
    body { background: #fff; color: #000; }
    .app-sticky-shell, .auth-overlay, .task-controls, button, .no-print { display: none !important; }
    .tab-content.active { display: block !important; margin-bottom: 20px; }
    .tab-content:not(.active) { display: none !important; }
    .card, .lane, .ritual-card { border: 1px solid #ccc; background: #fff; color: #000; }
    h1, h2, h3, h4 { color: #000 !important; }
  }
  ```

---

### Component 2: Shared UI Print Primitive (`ui_primitives/`)

#### [NEW] [`ui_primitives/scripts/print_engine.js`](file:///d:/GitHub_Repo/Sree_Krushna/ui_primitives/scripts/print_engine.js)
- Implements `window.skPrintContainer(target, options)`:
  - `target`: CSS selector string or DOM Element.
  - `options`: `{ title?: string, orientation?: 'landscape'|'portrait', margin?: string, customCss?: string }`.
  - Creates hidden `iframe#__sk_print_sandbox__`.
  - Injects target HTML and standardized high-density ink-saving print stylesheet.
  - Triggers print and safely removes iframe on `onafterprint` or timeout.

---

### Component 3: Automated Verification Harness

#### [NEW] [`scripts/test-print-container-contract.cjs`](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-print-container-contract.cjs)
- Automated verification script checking:
  1. `ui_primitives/scripts/print_engine.js` passes `node -c` syntax check.
  2. `main.css` adheres to `INV-PRINT-ZERO-DUMP-001` (zero unconditional multi-tab unrolling).
  3. Headless DOM simulation validates iframe injection, HTML encapsulation, and removal.

---

## Detailed Phase 1 TDD Implementation Steps

### Task 1.1: Automated Verification Test Baseline (Contract-First TDD)

**Files:**
- Create: `scripts/test-print-container-contract.cjs`

**Step 1: Write failing test**
Create `scripts/test-print-container-contract.cjs` asserting that `main.css` forbids unconditional `.tab-content { display: block !important; }` and that `ui_primitives/scripts/print_engine.js` exists and exports `skPrintContainer`.

**Step 2: Run test to verify it fails**
Run: `node scripts/test-print-container-contract.cjs`
Expected: Fails because `ui_primitives/scripts/print_engine.js` does not yet exist and `main.css` contains the legacy unrolling rule.

---

### Task 1.2: Global SPA Print De-Multiplexing in `public/css/main.css`

**Files:**
- Modify: `public/css/main.css:3056-3063`

**Step 1: Write failing assertion in test**
The test in Task 1.1 checks that `.tab-content:not(.active) { display: none !important; }` is present in `main.css`.

**Step 2: Apply the minimal fix**
Replace lines 3056–3063 in `public/css/main.css` with active-tab-only `@media print` rules.

**Step 3: Run test to verify partial progress**
Run: `node scripts/test-print-container-contract.cjs`
Expected: Check 1 (main.css de-multiplexing) passes; Check 2 (print primitive) fails.

---

### Task 1.3: Implement Sandboxed Headless Print Primitive

**Files:**
- Create: `ui_primitives/scripts/print_engine.js`

**Step 1: Author `ui_primitives/scripts/print_engine.js`**
Implement `window.skPrintContainer(target, options)` adhering to `INV-PRINT-IFRAME-SANDBOX-001` and `STD-UI-PRINT-CONTAINER-001`. Ensure `document.readyState !== 'loading'` guard per `INV-LIFECYCLE-02`.

**Step 2: Run syntax gate**
Run: `node -c ui_primitives/scripts/print_engine.js`

**Step 3: Run full contract test**
Run: `node scripts/test-print-container-contract.cjs`
Expected: 100% green pass.

---

### Task 1.4: Pre-Flight Verification Gates & Commit Boundary

**Commands:**
- `node scripts/test-print-container-contract.cjs`
- `npm run verify:modular-architecture`
- `npm run verify:ui-lifecycle`
- `npm run verify:deployment`

**Validation Gate (VG-1)**:
All tests pass; browser print preview on the main SPA verifies that only the active tab is queued for printing (≤3 pages).

---

## 🛑 MANDATORY PLAN HARD-STOP
In accordance with `INV-CANONICAL-PLANNING-001` (`INC-079` / `AC-DEC-2026-044`), this planning phase concludes with the plan saved to disk. **NO CODE MODIFICATIONS MAY BE EXECUTED UNTIL THE USER EXPLICITLY REVIEWS AND APPROVES THIS PLAN.**
