# INC-057: Calendar Chip Transparent Background Bug (`color-mix()` with Gradients)

- **Status**: Resolved
- **Date**: 2026-07-10
- **Type**: UI Layout Defect & CSS Token Drift
- **Affected Component**: Calendar UI, specifically components referencing `--theme-bg` or `--theme-accent` inside `color-mix()` (e.g., `Task-Dashboard`).

---

## 1. Symptom

During the implementation of Calendar UI improvements (TASK-214), background colors for certain events in the Sepia and Velvet-Dark themes disappeared, rendering transparently. This broke the visual hierarchy and readability of the calendar.

---

## 2. Root Cause

1. **Token Type Mismatch inside `color-mix()`**:
   - The CSS function `color-mix()` requires solid colors as inputs.
   - The `--theme-bg` and `--theme-accent` tokens were redefined in `enhanced-themes.css` as `linear-gradient(...)` strings for the new themes (e.g., Sepia).
   - Passing a gradient string to `color-mix()` causes it to fail silently and return `transparent`, resulting in invisible backgrounds without any CSS compiler errors.

---

## 3. Resolution

1. **Direct CSS Mitigation (`palette.css`)**:
   - Added a header guard documenting **TOKEN-TYPE-001**, explicitly outlining the solid-color requirement for `color-mix()` and listing forbidden vs. approved tokens.
2. **SSOT Update (`THEME-SYSTEM.md`)**:
   - Registered `FKL-DI-021` and Architectural Decision #5 (TOKEN-TYPE-001).
   - Added a **Token Type Registry** table to distinguish between ⛔ Gradient-type (forbidden in `color-mix()`) and ✅ Solid-color (safe in `color-mix()`).
3. **Automated Auditing (`scripts/check-color-mix-types.cjs`)**:
   - Created a dedicated script to scan all CSS files for `color-mix()` usages referencing forbidden gradient tokens.
   - Identified and isolated 29 pre-existing baseline-debt sites to prevent them from blocking the build, while ensuring any *new* usages trigger a failure.
4. **Preflight Gate Integration (`scripts/preflight-gate.cjs`)**:
   - Wired the **P-CMT** check into the `preflight` script, ensuring the audit runs automatically on any commit that touches a CSS file.

---

## 4. Architectural Surface Mapping

1. **UI Surface**: Affected background colors in multiple views (Sepia/Velvet-Dark) rendering completely transparent.
2. **Data Surface**: N/A.
3. **Reactive Surface**: N/A.
4. **Service Surface**: N/A.
5. **Module Surface**: N/A.
6. **Governance Surface**: Missing enforcement around CSS custom property typings (Solid vs. Gradient) being injected into CSS color functions. Addressed via `TOKEN-TYPE-001` invariant, SSOT documentation, and P-CMT automated check.

---

## 5. Prevention

- **P-CMT (Token Type Validator)**: The `check:color-mix` gate automatically blocks commits containing new references to gradient-based theme variables (like `--theme-bg` or `--theme-accent`) within `color-mix()`.
