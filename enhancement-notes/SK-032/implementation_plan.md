# SK-032: Smart Cohesive Page-Break Orchestration & Cross-Repo Tabular Packaging Implementation Plan

> **Governing Ticket**: [`enhancement-notes/SK-032/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-032/00_ENHANCEMENT_INDEX.md)  
> **Target Release**: `v2.9.9`  
> **Council Rulings**: `AC-DEC-2026-075` / `UI-DEC-2026-055` (FULL COUNCIL CERTIFIED, 2026-09-28)  
> **Governing Standards**: `STD-UI-PRINT-RUNSHEET-003` / `INV-PAGE-COHESION-001` / `STD-COUNCIL-DUAL-GATE-001` / `STD-UI-INTERACTION-SPEC-001`  
> **Goal**: Eliminate awkward pagination splits where milestone/section tables are sliced near the bottom of an A4 page with only the header and 1–2 rows stranded before the page boundary.  
> **Architecture**: Declarative CSS block cohesion (`break-inside: avoid !important; page-break-inside: avoid !important;`) coupled with a 3-tier pagination spectrum (`cohesive` [default], `fluid`, `milestones`) and universal cross-repo standard token (`.sk-print-cohesive-block`).  
> **Tech Stack / Toolchain**: Vanilla ES6+, CSS Paged Media Module Level 3, W3C CSS Fragmentation Level 3, SDCA Compiler (`build.cjs`), Playwright / Node.js test harness.

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax / Line Limit | Valid CSS/JS syntax (`node -c`), zero naked buttons, `<500` lines per file (`STD-MOD-COMP-001`), clean taxonomy (`verify:taxonomy`). |
| **T2** | **Functional** | Unit / Contract | `scripts/test-print-cohesion-contract.cjs` and `scripts/test-print-ink-saver-contract.cjs` pass 100% green. |
| **T3** | **Integrated** | Cross-Module & Parity | Modal sync, 3-tier radio parsing, local preferences persistence, and 100% byte parity between root and `public/`. |
| **T4** | **Governance** | Dual-Council & Standards | `AC-DEC-2026-075` / `UI-DEC-2026-055` ratification, pattern codification, and `tabular-run-sheet-artisan` skill update. |

---

## 4-Phase Sequential Phasing Matrix

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Declarative Block Cohesion Engine & Core Test Harness (CURRENT FOCUS)                   │
│ ├─ scripts/test-print-cohesion-contract.cjs                                                      │
│ ├─ shopping_src/styles/12_print_themes_and_options.css (break-inside: avoid)                     │
│ ├─ ui_primitives/scripts/print_engine.js (data-print-pagebreak="cohesive" + token)               │
│ └─ VG-1: Automated contract test green; break-inside: avoid asserted on cohesive selectors       │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: 3-Tier Pre-Print Configuration Modal Upgrade                                            │
│ ├─ ui_primitives/components/print_options_modal.html (cohesive, fluid, milestones radios)       │
│ ├─ Preferences parser sync & localStorage update                                                 │
│ └─ VG-2: Headless lifecycle test verifying 3 radio modes and preferences persistence             │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Consumer Integration & Visual Layout Verification                                       │
│ ├─ Tag obligations tables and catalog groups with .sk-print-cohesive-block                       │
│ ├─ Multi-milestone print stream visual verification                                              │
│ └─ VG-3: Automated integration test verifying zero broken milestone blocks in multi-pack stream │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 4: SDCA Compilation, Byte Parity & Ecosystem Standards Promotion                           │
│ ├─ Recompile SDCA modules via build.cjs (100% byte parity to /public)                            │
│ ├─ Update tabular-run-sheet-artisan skill & codify universal pattern                             │
│ └─ VG-4: 100% dual-release byte parity; all 69 modular checks green; exit code 0                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## UI/UX Interaction & Ergonomics Specification (STD-UI-INTERACTION-SPEC-001)

| # | Domain | Mandatory Interaction Specification |
|---|---|---|
| **1** | **Data Tables & Lists** | Cohesive table grouping: individual milestone tables (`.obl-table-milestone-block`, `.shop-table-group`, `.sk-print-cohesive-block`) declare `break-inside: avoid !important`. Small tables fit together on Page 1; an overflowing table moves intact to Page 2. In giant tables (>1 A4 page), rows break cleanly with repeating headers via `thead { display: table-header-group !important; }`. |
| **2** | **Media & Lightbox Viewers** | N/A (Print engine is scoped to tabular run sheets and documentation views). |
| **3** | **Modals, Drawers & Popovers** | Pre-Print Options Dialog retains strict 3-trigger dismissibility (`INV-LIFECYCLE-03`: Close button `#skPrintModalClose`, Backdrop click `#skPrintOptionsModalBackdrop`, Escape key). Background scroll-lock (`sk-modal-open`). |
| **4** | **Interactive Controls & Touch Targets** | 3-way radio cards (`cohesive`, `fluid`, `milestones`) in Pre-Print Modal exceed 44x44px touch target bounds with distinct active/focus/checked styling (`--shop-gold`, `#d4af37`), full descriptive copy, and badge chips. Zero naked unstyled buttons (`STD-UI-PRIMITIVE-002`). |
| **5** | **Keyboard & Accessibility (A11y)** | Logical Tab sequence across modal radio cards and action buttons. Escape dismisses modal. Radio selection updates with arrow keys (`↑`/`↓`/`←`/`→`) and Spacebar. All inputs have associated `<label>` tags with matching `for` attributes. |
| **6** | **State Craft & Micro-Feedback** | User's preferred pagination mode (`cohesive`, `fluid`, or `milestones`) is remembered across sessions in `localStorage` (`sk_print_options`). Default mode is pre-selected as "Smart Cohesive Flow" with a prominent "Recommended" badge chip. |
| **7** | **Dual-Surface Media Isolation** | Clean separation between screen display and print rendering. Sandboxed iframe isolation (`INV-PRINT-IFRAME-SANDBOX-001`) prevents main document style pollution. Zero-dump printing (`INV-PRINT-ZERO-DUMP-001`) isolates target container only. Forced print unrolling (`INV-COLLAPSIBLE-PRINT-001`) ensures collapsed accordions expand fully in print streams. |

---

## Phase 1: Declarative Block Cohesion Engine & Core Test Harness

### Task 1.1: Automated Contract Test Harness (`scripts/test-print-cohesion-contract.cjs`)

**Files:**
- Create: [`scripts/test-print-cohesion-contract.cjs`](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-print-cohesion-contract.cjs)
- Modify: [`package.json:28`](file:///d:/GitHub_Repo/Sree_Krushna/package.json#L28)

**Step 1: Write failing test**
Create `scripts/test-print-cohesion-contract.cjs` asserting:
1. `shopping_src/styles/12_print_themes_and_options.css` declares `body[data-print-pagebreak="cohesive"]` with `break-inside: avoid !important` and `page-break-inside: avoid !important` on `.obl-table-milestone-block`, `.shop-table-group`, and `.sk-print-cohesive-block`.
2. `ui_primitives/scripts/print_engine.js` defines cohesive block packaging rules in `defaultStyles`.
3. `ui_primitives/scripts/print_engine.js` supports universal ecosystem token `.sk-print-cohesive-block`.
4. `skGetPrintPreferences()` defaults `pageBreaks` to `'cohesive'`.
5. `skPrintContainer()` normalizes legacy `'smart'` to `'cohesive'`, and supports `'cohesive'`, `'fluid'`, and `'milestones'`.
6. Both files strictly respect the 500-line modular limit (`STD-MOD-COMP-001`).

Add npm script in `package.json`:
`"test:print-cohesion": "node scripts/test-print-cohesion-contract.cjs"`

**Step 2: Run test to verify it fails**
Run: `npm run test:print-cohesion`  
Expected: FAIL with missing cohesive styling assertions.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code non-zero AND output matches `FAIL.*cohesive`.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 3.
- **Fail (1st)**: Test unexpectedly passed. Inspect file at specified path before continuing.
- **Fail (2nd)**: Halt. Surface to user: "Step 2 gate failed after retry — test is not failing as expected."

**Step 3: Minimal implementation (Tasks 1.2, 1.3, 1.4)**
Implement changes in:
- `shopping_src/styles/12_print_themes_and_options.css`
- `ui_primitives/scripts/print_engine.js`
- `scripts/test-print-ink-saver-contract.cjs` (backwards compatibility update)

**Step 4: Run test to verify it passes**
Run: `npm run test:print-cohesion && npm run test:print-ink-saver`  
Expected: PASS with 0 errors across all checks.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code 0 AND output matches `ALL COHESIVE PAGE-BREAK CONTRACT CHECKS PASSED`.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 5.
- **Fail (1st)**: Roll back changes using `git checkout -- <files>`, diagnose failure, and re-implement.
- **Fail (2nd)**: Halt. Surface to user: "Step 4 gate failed after retry."

**Step 5: Atomic Commit**
Run: `git add scripts/test-print-cohesion-contract.cjs shopping_src/styles/12_print_themes_and_options.css ui_primitives/scripts/print_engine.js scripts/test-print-ink-saver-contract.cjs package.json` && `git commit -m "feat(sk-032): implement declarative block cohesion engine and contract test harness (AC-DEC-2026-075)"`

---

### Task 1.2: Declarative Block Cohesion in `12_print_themes_and_options.css`

**Files:**
- Modify: [`shopping_src/styles/12_print_themes_and_options.css:264-272`](file:///d:/GitHub_Repo/Sree_Krushna/shopping_src/styles/12_print_themes_and_options.css#L264-L272)

**Step 3 Details:**
Add cohesive and fluid page break definitions inside `@media print`:
```css
  /* Smart Cohesive Page-Break Packaging (STD-UI-PRINT-RUNSHEET-003 / INV-PAGE-COHESION-001) */
  body[data-print-pagebreak="cohesive"] .obl-table-milestone-block,
  body[data-print-pagebreak="cohesive"] .shop-table-group,
  body[data-print-pagebreak="cohesive"] .sk-print-cohesive-block,
  .sk-print-cohesive-block {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  body[data-print-pagebreak="fluid"] .obl-table-milestone-block,
  body[data-print-pagebreak="fluid"] .shop-table-group,
  body[data-print-pagebreak="fluid"] .sk-print-cohesive-block {
    break-inside: auto !important;
    page-break-inside: auto !important;
  }

  /* Scoped Page Break Modes (INV-PAGE-BREAK-ORCH-001) */
  body[data-print-pagebreak="milestones"] .obl-table-milestone-block:not(:first-child),
  body[data-print-pagebreak="milestones"] .shop-table-group:not(:first-child),
  body[data-print-pagebreak="milestones"] .sk-print-cohesive-block:not(:first-child) {
    break-before: page !important;
    page-break-before: always !important;
    margin-top: 0 !important;
  }
```

---

### Task 1.3: Headless Sandbox Print Engine Cohesion Invariant (`ui_primitives/scripts/print_engine.js`)

**Files:**
- Modify: [`ui_primitives/scripts/print_engine.js:35-37`](file:///d:/GitHub_Repo/Sree_Krushna/ui_primitives/scripts/print_engine.js#L35-L37)
- Modify: [`ui_primitives/scripts/print_engine.js:213-220`](file:///d:/GitHub_Repo/Sree_Krushna/ui_primitives/scripts/print_engine.js#L213-L220)
- Modify: [`ui_primitives/scripts/print_engine.js:298-311`](file:///d:/GitHub_Repo/Sree_Krushna/ui_primitives/scripts/print_engine.js#L298-L311)

**Step 3 Details:**
1. In `skPrintContainer(target, options)`:
   ```javascript
   var pageBreaks = (options.pageBreaks === 'milestones' || options.pageBreaks === 'fluid')
     ? options.pageBreaks
     : 'cohesive'; // Defaults to 'cohesive' and normalizes legacy 'smart'
   ```
2. In `defaultStyles`:
   ```css
   /* Smart Cohesive Block Packaging (STD-UI-PRINT-RUNSHEET-003 / INV-PAGE-COHESION-001) */
   body[data-print-pagebreak="cohesive"] .obl-table-milestone-block,
   body[data-print-pagebreak="cohesive"] .shop-table-group,
   body[data-print-pagebreak="cohesive"] .sk-print-cohesive-block,
   .sk-print-cohesive-block {
     break-inside: avoid !important;
     page-break-inside: avoid !important;
   }
   body[data-print-pagebreak="fluid"] .obl-table-milestone-block,
   body[data-print-pagebreak="fluid"] .shop-table-group,
   body[data-print-pagebreak="fluid"] .sk-print-cohesive-block {
     break-inside: auto !important;
     page-break-inside: auto !important;
   }
   body[data-print-pagebreak="milestones"] .obl-table-milestone-block:not(:first-child),
   body[data-print-pagebreak="milestones"] .shop-table-group:not(:first-child),
   body[data-print-pagebreak="milestones"] .sk-print-cohesive-block:not(:first-child) {
     break-before: page !important;
     page-break-before: always !important;
     margin-top: 0 !important;
   }
   ```
3. In `skGetPrintPreferences()`:
   ```javascript
   var pb = parsed.pageBreaks;
   var validPb = (pb === 'milestones' || pb === 'fluid' || pb === 'cohesive') ? pb : 'cohesive';
   // ...
   return { theme: 'eco', pageBreaks: 'cohesive', orientation: 'landscape', includeSignoff: true };
   ```

---

### Task 1.4: Universal Standard Token `.sk-print-cohesive-block` Wire-up & Backwards Compatibility

**Files:**
- Modify: [`scripts/test-print-ink-saver-contract.cjs:160`](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-print-ink-saver-contract.cjs#L160)

**Step 3 Details:**
Update `test-print-ink-saver-contract.cjs` line 160 to accept `'cohesive'`, `'fluid'`, `'milestones'`, and `'smart'`, ensuring the existing SK-031 test suite passes without regression.

---

## Phase 1 Validation Gate & Escalation Path

**🔍 Validation Gate (VG-1)**:
- `node scripts/test-print-cohesion-contract.cjs` exits with code 0.
- `node scripts/test-print-ink-saver-contract.cjs` exits with code 0.
- `shopping_src/styles/12_print_themes_and_options.css` and `ui_primitives/scripts/print_engine.js` are each strictly under 500 lines.

**🚦 Decision Node (DN-1)**:
- If all checks pass: Mark Phase 1 COMPLETE in `enhancement-notes/SK-032/00_ENHANCEMENT_INDEX.md` and queue Phase 2.
- If any check fails on retry: Roll back file edits via `git checkout -- <file>` and diagnose syntax / line-limit regressions.

---

## Execution Handoff

Upon receiving user approval:
1. Execute Phase 1 (Tasks 1.1 through 1.4) following the 5-step TDD cycle.
2. Verify Phase 1 Validation Gate (VG-1) passes 100% green.
3. Commit Phase 1 changes atomically.
4. Stop and request review before Phase 2.
