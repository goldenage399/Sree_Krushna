# SK-033: Universal Column Visibility & Print Data Masking Engine Implementation Plan

> **Governing Ticket**: [`enhancement-notes/SK-033/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-033/00_ENHANCEMENT_INDEX.md)  
> **Target Release**: `v2.10.0`  
> **Council Rulings**: `AC-DEC-2026-076` / `UI-DEC-2026-056` (FULL COUNCIL CERTIFIED, 2026-09-28)  
> **Governing Standards**: `STD-TABLE-COL-VIS-001` / `INV-TABLE-COL-MASK-001` / `STD-TABLE-BUDGET-001` / `STD-COUNCIL-DUAL-GATE-001` / `STD-UI-INTERACTION-SPEC-001`  
> **Goal**: Provide customizable column visibility checkboxes, role-based audience presets, and confidential data masking for printable tables without monolithic bloat.  
> **Architecture**: Decoupled standalone primitive (`ui_primitives/scripts/column_visibility_engine.js`) providing column state persistence, proportional width re-budgeting (`STD-TABLE-BUDGET-001`), and physical DOM tree excision (`INV-TABLE-COL-MASK-001`) before print execution.  
> **Tech Stack / Toolchain**: Vanilla ES6+, SDCA Compiler (`build.cjs`), W3C Table Layout Algorithm, Node.js contract test runner.

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax / Line Limit | Valid JS syntax (`node -c`), `<500` lines per file (`STD-MOD-COMP-001`), clean taxonomy (`verify:taxonomy`). |
| **T2** | **Functional** | Unit / Contract | `scripts/test-column-visibility-contract.cjs` passes 100% green with mathematical width sum proof. |
| **T3** | **Integrated** | Cross-Module & Parity | Modal sync, 3 role presets (`Full`, `Elder`, `Vendor`), DOM excision verification, and 100% byte parity. |
| **T4** | **Governance** | Dual-Council & Standards | `AC-DEC-2026-076` / `UI-DEC-2026-056` compliance, pattern codification, and `/sap-sync` packaging as `PKG-010`. |

---

## 4-Phase Sequential Phasing Matrix

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Core Column Visibility Engine & Contract Test Harness (CURRENT FOCUS)                   │
│ ├─ scripts/test-column-visibility-contract.cjs                                                   │
│ ├─ ui_primitives/scripts/column_visibility_engine.js (registration, state, math rebalancing)     │
│ └─ VG-1: Automated contract test green; width normalization sums to 100%; <500 lines limit       │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Pre-Print Options Dialog Integration & Role Presets                                     │
│ ├─ ui_primitives/components/print_options_modal.html (Column selection section + 3 presets)     │
│ ├─ Wire column_visibility_engine.js to print_engine.js clone pipeline (INV-TABLE-COL-MASK-001)   │
│ └─ VG-2: Headless test verifying checked/unchecked columns omit DOM nodes in print sandbox       │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Interactive Screen Table Toolbar Integration                                            │
│ ├─ Add [👁️ Columns] popover to #oblTableInnerToolbar                                            │
│ ├─ Live screen table column toggling & localStorage persistence                                  │
│ └─ VG-3: Dynamic DOM re-rendering; mobile table scroll wrapper maintains min-width               │
└─────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 4: SDCA Compilation, Byte Parity & Cross-Repo Packaging (PKG-010)                          │
│ ├─ Recompile SDCA modules via build.cjs (100% byte parity to /public)                            │
│ ├─ Update tabular-run-sheet-artisan skill & codify universal pattern in .agent/patterns/         │
│ └─ VG-4: 100% dual-release byte parity; all 69 modular checks green; exit code 0 across all gates│
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## UI/UX Interaction & Ergonomics Specification (STD-UI-INTERACTION-SPEC-001)

| # | Domain | Mandatory Interaction Specification |
|---|---|---|
| **1** | **Data Tables & Lists** | Proportional column re-budgeting: when columns are toggled off, remaining columns expand proportionally so the table fills 100% width with zero border misalignments or dead gaps (`STD-TABLE-BUDGET-001`). Dynamic column header attributes (`data-col-key`). |
| **2** | **Media & Lightbox Viewers** | N/A (Scoped to tabular run sheets and documentation views). |
| **3** | **Modals, Drawers & Popovers** | Column selector in Pre-Print Dialog adheres to strict 3-trigger dismissibility (`INV-LIFECYCLE-03`). Interactive column popover on screen toolbar closes on Outside Click or Escape. |
| **4** | **Interactive Controls & Touch Targets** | Checkbox items have minimum 44x44px touch targets on mobile viewports (`STD-MOBILE-UI-001`). Role preset pill buttons ([Full], [Elder], [Vendor]) feature distinct active states with `--shop-gold` accent borders. Zero naked unstyled buttons (`STD-UI-PRIMITIVE-002`). |
| **5** | **Keyboard & Accessibility (A11y)** | Logical Tab order across preset pills and column checkboxes. Spacebar toggles checkboxes. Arrow keys navigate presets. `aria-label` and `<label for="...">` associations on every control. |
| **6** | **State Craft & Micro-Feedback** | Custom column selections persist across sessions in `localStorage` under `sk_table_col_vis_{tableId}`. Toggling an individual checkbox automatically unhighlights any active preset pill to prevent false state representation. |
| **7** | **Dual-Surface Media Isolation** | Physical DOM excision (`INV-TABLE-COL-MASK-001`): in the print iframe sandbox, unselected `<th>` and `<td>` elements are deleted entirely from the DOM tree, guaranteeing confidential data (cash amounts, family relationship annotations) cannot be inspected or leaked in PDF output. |

---

## Phase 1: Core Column Visibility Engine & Contract Test Harness

### Task 1.1: Author Automated Contract Test Harness (`scripts/test-column-visibility-contract.cjs`)

**Files:**
- [NEW] [`scripts/test-column-visibility-contract.cjs`](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-column-visibility-contract.cjs)
- [MODIFY] [`package.json:29`](file:///d:/GitHub_Repo/Sree_Krushna/package.json#L29)

**Step 1: Write failing test**
Create `scripts/test-column-visibility-contract.cjs` asserting:
1. `ui_primitives/scripts/column_visibility_engine.js` exists, exports required API functions (`registerTableColumns`, `getColumnVisibility`, `setColumnVisibility`, `applyPreset`, `calculateRebalancedWidths`, `filterTableDOMForPrint`).
2. Mathematical width rebalancing correctly scales remaining column percentages to sum to exactly 100% (+/- 0.05% rounding tolerance).
3. Preset definitions (`full`, `elder`, `vendor`) resolve to expected column arrays for obligations schema.
4. `filterTableDOMForPrint` excises unselected `<th>` and `<td>` nodes from a test table DOM tree.
5. Modular line limit: `column_visibility_engine.js` is strictly `<500` lines (`STD-MOD-COMP-001`).

Add npm script in `package.json`:
`"test:column-visibility": "node scripts/test-column-visibility-contract.cjs"`

**Step 2: Run test to verify it fails**
Run: `npm run test:column-visibility`  
Expected: FAIL with module not found error.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code non-zero AND output matches `Cannot find module.*column_visibility_engine`.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 3.
- **Fail (1st)**: Test unexpectedly passed. Inspect file at specified path before continuing.
- **Fail (2nd)**: Halt. Surface to user: "Step 2 gate failed after retry."

**Step 3: Write minimal implementation (`column_visibility_engine.js`)**
Create `ui_primitives/scripts/column_visibility_engine.js` implementing:
- Table column registry with initial widths and preset configurations.
- `calculateRebalancedWidths(cols, activeKeys)` returning normalized percentages.
- `filterTableDOMForPrint(tableEl, activeKeys)` pruning omitted cells.
- CommonJS and browser window dual-export.

**Step 4: Run test to verify it passes**
Run: `npm run test:column-visibility`  
Expected: PASS with 0 errors across all checks.

**🔍 Validation Gate (VG)**:
1. (Binary) Exit code 0 AND output matches `ALL COLUMN VISIBILITY CONTRACT CHECKS PASSED`.

**🚦 Decision Node (DN)**:
- **Pass**: Proceed to Step 5.
- **Fail (1st)**: Roll back changes using `git checkout -- <files>`, diagnose failure, and re-implement.
- **Fail (2nd)**: Halt. Surface to user: "Step 4 gate failed after retry."

**Step 5: Atomic Commit**
Run: `git add scripts/test-column-visibility-contract.cjs ui_primitives/scripts/column_visibility_engine.js package.json` && `git commit -m "feat(sk-033): implement universal column visibility engine and contract test harness (AC-DEC-2026-076)"`

---

## Phase 1 Validation Gate & Escalation Path

**🔍 Validation Gate (VG-1)**:
- `node scripts/test-column-visibility-contract.cjs` exits with code 0.
- `ui_primitives/scripts/column_visibility_engine.js` is strictly under 500 lines.
- `node -c ui_primitives/scripts/column_visibility_engine.js` syntax check exits with 0.

**🚦 Decision Node (DN-1)**:
- If all checks pass: Mark Phase 1 COMPLETE in `enhancement-notes/SK-033/00_ENHANCEMENT_INDEX.md` and queue Phase 2.
- If any check fails on retry: Roll back edits and diagnose mathematical width calculation errors.

---

## Recommended Execution Roadmap

1. **Step 1 (Immediate)**: Execute and release **`SK-032`** (Smart Cohesive Page-Break Orchestration, v2.9.9), which is already 100% planned and ready.
2. **Step 2 (Direct Follow-up)**: Execute **`SK-033`** (Universal Column Visibility & Print Data Masking Engine, v2.10.0), building directly upon `SK-032`'s Pre-Print Options Dialog.
