# INC-083 — UI Typography Weight Inflation, Non-Canonical Utility Token Divergence, and Semantic Bridge Cascade Drift

**Incident ID**: INC-083  
**Date**: 2026-08-18  
**Severity**: Medium (Visual Polish, Token Integrity & Design System Divergence)  
**Governing Documents**: [`DESIGN.md`](file:///d:/GitHub_Repo/Task-Dashboard/DESIGN.md), [`PRODUCT.md`](file:///d:/GitHub_Repo/Task-Dashboard/PRODUCT.md), [`CLAUDE.md § 🗚 Typography Conventions`](file:///d:/GitHub_Repo/Task-Dashboard/CLAUDE.md), [`tailwind-semantic-bridge.css`](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/tailwind-semantic-bridge.css), `P-UI-TYPO` (`P106`)  
**Affected Components**: `src/components/checklists/TemplateEditorModal.jsx`, `src/components/checklists/PositionRoutinesTab.jsx`, `src/components/checklists/AuditAndComplianceTab.jsx`, `src/pages/RecurringChecklistsPage.jsx`  

---

## 1. Incident Summary

During user inspection of the updated Positional Routine and Checklist components (`/checklists`), visual discordance was reported regarding font sizes, weights, and overall typography scaling:
*"all the ui changes doesnt match our overall fonts and sizes and all please check and share a report on the analysis and inspection , get the UI council to report on it and imppecable"*.

A forensic design system audit conducted via the UI Council and Impeccable review surfaced five systematic deviations from the repo's design anchors:
1. **Typography Weight Inflation**: Excessive usage of `font-black` (900) and `font-extrabold` (800) across standard headings, scope pills, and buttons. In `DESIGN.md § 3`, weights are strictly capped at `font-bold` (700) for Display/Hero titles, `font-semibold` (600) for Headlines/Titles, `font-medium` (500) for Labels/Badges, and `font-normal` (400) for Body.
2. **Inert Utility Classes in Semantic Bridge**: Heavy usage of `shadow-2xs` and `shadow-xs`. Neither class exists in `tailwind-semantic-bridge.css` (which only supports `shadow-none`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-card`), causing dozens of elements to render completely un-elevated.
3. **Radius Inconsistency & Over-Rounding**: Using `rounded-2xl` (16px) and `rounded-xl` (12px) indiscriminately on small action buttons and inputs, distorting the standard 8px (`rounded-lg` / `var(--tc-border-radius-lg)`) component curvature.
4. **Non-Semantic Slashed Opacities & Backdrop Bleed**: Arbitrary Tailwind JIT opacity classes (`bg-black/60`, `bg-surface/50`, `bg-surface/60`, `bg-surface/70`, `bg-surface/90`, `border-default/70`, `bg-status-info/10`, `backdrop-blur-xs`) that fail or degrade under vanilla CSS across dark themes, Sepia, and Velvet-Dark modes.
5. **Inverted Visual Hierarchy**: Modal title was rendered at `text-base font-black` (14px) while section sub-headings rendered at `text-xs font-black uppercase` (12px), making nested section titles visually louder than the modal's primary title.

---

## 2. Root Cause Analysis

1. **Failure to Consult `DESIGN.md` & `tailwind-semantic-bridge.css`**: Developers relied on ad-hoc Tailwind classes (`font-black`, `font-extrabold`, `shadow-2xs`, `shadow-xs`) common in external tailwind configurations rather than adhering to the Task Dashboard's semantic bridge subset.
2. **Lack of Pre-Commit Typography Linter**: The preflight scan did not mechanically enforce a ban on `font-black` or `font-extrabold` in application UI code (`src/components/`, `src/pages/`), allowing typographic weight escalation.
3. **Card-in-Card Nesting Reflex**: Sub-sections and item rows were each wrapped in nested bordered cards (`p-4 bg-surface/60`), creating excessive container borders and visual clutter.

---

## 3. Architectural Surface Mapping (6 Surfaces)

| Surface | Impact & Verification |
|---|---|
| **1. UI Surface** | • Converted all headings to `font-semibold` (600) / `font-bold` (700) and form inputs/labels to `font-normal` (400) / `font-medium` (500).<br>• Replaced inert `shadow-2xs` / `shadow-xs` with `shadow-sm` and `shadow-lg`.<br>• Standardized button and input radii to `rounded-lg` (8px).<br>• Replaced `bg-black/60` backdrop with `bg-surface-base-inverse backdrop-blur-sm`.<br>• Replaced arbitrary slashed opacities with semantic tokens (`bg-section`, `bg-card`, `bg-surface`, `border-default`). |
| **2. Data Surface** | • **No Direct Schema Change**: Incident was purely presentation and token alignment. Verified that no Firestore queries or schemas were mutated during styling refactor. |
| **3. Reactive Surface** | • Preserved all component state hooks (`useState`, `useCallback`, `createPortal`) without introducing state churn or unmemoized callback regressions. |
| **4. Service Surface** | • **No Service Layer Mutation**: `RecurringChecklistService.js` and `ProfileCRUDService.js` remained untouched and functional. |
| **5. Module Surface** | • Recompiled layout catalog cache via `npm run cache:build:layout` (mapped 406 active selectors with 0 orphaned utilities). |
| **6. Governance Surface** | • Registered standard `P-UI-TYPO` (`P106`) in `.agent/standards-catalog.json` and `GEMINI.md`.<br>• Captured pattern `.agent/patterns/typography-weight-and-bridge-token-enforcement.md`.<br>• Added row `R41` to `.agent/PREFLIGHT.md`.<br>• Registered incident entry in `CLAUDE.md` and `docs/frontend/frontend-knowledge-index.jsonl`. |

---

## 4. Corrective Actions & Invariants Established

### Invariant 1: Typographic Weight Ceiling (`P-UI-TYPO`)
- `font-black` (900) and `font-extrabold` (800) are **strictly forbidden** in UI components.
- Canonical weights:
  - Display / Hero Headings: `font-bold` (700)
  - Titles & Headlines: `font-semibold` (600)
  - Labels, Badges & Nav Tabs: `font-medium` (500)
  - Body Text, Inputs & Helper Descriptions: `font-normal` (400)

### Invariant 2: Semantic Bridge Utility Compliance
- Components MUST ONLY use elevation shadows defined in `tailwind-semantic-bridge.css` (`shadow-none`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-card`).
- Slashed color opacities on CSS variables (e.g. `bg-surface/50`, `bg-status-info/10`) MUST NOT be used in JSX; use solid semantic tokens (`bg-section`, `bg-card`, `bg-surface`) or explicit `var(--color-...)` tokens.

---

## 5. Verification Matrix

| Check / Gate | Command | Result |
|---|---|---|
| **Vitest Test Suite** | `npx vitest run src/services/RecurringChecklistService.test.js src/components/myday/OperationalRoutinesSection.test.jsx` | **18/18 passed** ✅ |
| **Layout Catalog Recompile** | `npm run cache:build:layout` | **406 active selectors mapped** ✅ |
| **Standards Catalog Integrity** | `node scripts/verify-standards-integrity.cjs` | **Exit Code 0 (Validated)** ✅ |
| **Governance Wiring Gate** | `npm run verify:governance-wiring` | **Exit Code 0 (All artifacts wired)** ✅ |
| **Preflight Gate** | `npm run preflight` | **Exit Code 0** ✅ |
