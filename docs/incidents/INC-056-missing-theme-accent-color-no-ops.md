# INC-056: Missing Theme Accent Color Classes (Silent No-Ops)

- **Status**: Resolved (Logged for systemic remediation)
- **Date**: 2026-07-10
- **Type**: UI Quality & CSS Variable/Token Drift
- **Affected Components**: 15 JSX files including `BlockerManagementDashboard.jsx`, `DependencyResolutionPanel.jsx`, `EditTaskDetailsModal.jsx`, `TaskUpdateModal.jsx`

---

## 1. Symptom

During the implementation of the Calendar and Work Schedule enhancement (TASK-214), it was identified that multiple theme-accent classes (such as `theme-accent-blue`, `theme-accent-red`, etc., and utility variations) used 329 times across 15 JSX files are defined nowhere in the codebase's active stylesheet rules. These classes operate as silent no-ops, resulting in transparent backgrounds or unstyled text colors instead of the intended vibrant accent designs.

---

## 2. Root Cause

1. **Undocumented Class Propagation**:
   - Developers referenced classes like `bg-theme-accent-blue` or `text-theme-accent-red` assuming they were standard library or theme system utilities.
   - However, the CSS variables and classes were never declared in the primary design token stylesheets (`themes-enhanced.css`, `enhanced-themes.css`, or `vibrancy-utilities.css`).
2. **Missing Lint/AST Verification**:
   - There was no automated check or AST-grep gate verifying the existence of theme variable/class mappings in JSX files against actual CSS definitions.

---

## 3. Resolution

1. **Systemic Audit Logging**:
   - Logged as **TASK-215** in the enhancement registry for systemic cleanup (defining the tokens in the stylesheet vs. migrating all usages to actual design system tokens).
2. **Validation Rule Creation**:
   - Proposed a new static analysis lint/sg rule to fail builds when undocumented accent classes are written.

---

## 4. Architectural Surface Mapping

1. **UI Surface**: Elements targeting accent borders, badges, or texts rendered transparent or with incorrect defaults due to missing declarations.
2. **Data Surface**: N/A (unaffected).
3. **Reactive Surface**: N/A (unaffected).
4. **Service Surface**: N/A (unaffected).
5. **Module Surface**: N/A (unaffected).
6. **Governance Surface**: Failure to maintain bidirectional synchronization between CSS token registry files and JSX class usages.

---

## 5. Prevention

- **P-THEME-VALIDATION**: Custom classes referencing accent or theme variants must either be validated against a registered token map in `token-map.json` or explicitly declared in `themes-enhanced.css`. Silent CSS class usage without validation is prohibited.
