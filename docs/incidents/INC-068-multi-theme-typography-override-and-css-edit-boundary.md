# INC-068: Multi-Theme Typography Override and CSS Edit Boundary Defect

- **Status**: Resolved
- **Date**: 2026-07-30
- **Type**: Tooling Execution Defect & Multi-Theme Design Governance
- **Affected Components**: [src/styles/theme-utilities.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/theme-utilities.css), [src/styles/theme-tokens.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/theme-tokens.css)

---

## 1. Symptom

1. **Adjacent Code Deletion**: During an inline string replacement on `src/styles/theme-utilities.css`, lines 1054–1173 (containing Velvet Dark card gradients, hover effects, and input borders) were unintentionally deleted.
2. **Single-Theme Blind Spot**: Initial typography contrast fixes targeting raw dark text (`.text-black`, `.text-gray-900`) were applied exclusively to `[data-theme="sepia"]`, leaving dark themes (**Velvet Dark**, **Dark**, **Dim Dark**) vulnerable to black-on-dark invisible text.

---

## 2. Root Cause Analysis

1. **Inline Splicing Risk in Monolithic CSS**:
   - `theme-utilities.css` is a large file (>1,200 lines) with repetitive selector blocks. Using `replace_file_content` near middle line ranges without strict outer boundary anchors caused fuzzy matching errors that excised adjacent theme selectors.
2. **Single-Theme Design Scope Narrowing**:
   - Focusing exclusively on the theme mentioned in the prompt ("Sepia") resulted in ignoring the remaining 6 active themes in the repository, violating the All-Theme Matrix Sweep rule.

---

## 3. Resolution

1. **Surgical Restoration**: Cleanly restored `src/styles/theme-utilities.css` to HEAD state via `git checkout` after obtaining user approval.
2. **Safe Appending**: Appended all new multi-theme raw dark text class overrides to the very end of `theme-utilities.css` (lines 1263–1338).
3. **Multi-Theme Matrix Coverage**: Mapped hardcoded dark text utilities (`.text-black`, `.text-gray-900`, `.text-slate-900`, `.text-neutral-900`, `.text-zinc-900`) across all relevant theme blocks:
   - **Sepia**: `#4a2e12` (rich warm dark brown)
   - **Velvet Dark**: `#f8f9ff` (light purple accent text)
   - **Dark & Dim Dark**: `#f8fafc` (inverted light text)

---

## 4. Architectural Surface Mapping

- **UI Surface**: Affected CSS custom properties and text utility classes (`.text-black`, `.text-gray-900`) across all 7 themes (`Light`, `Dark`, `Dim Dark`, `Sepia`, `Grayscale`, `Velvet Dark`, `Ambient`). Resolved via safe CSS appending at the end of `theme-utilities.css`.
- **Data Surface**: N/A — No Firestore schema, database rules, or backend data layer entities were touched by these frontend styling overrides.
- **Reactive Surface**: N/A — Theme state management in `ThemeContext.jsx` remains unchanged; the fix operates strictly at the CSS utility presentation layer via `[data-theme]` attributes.
- **Service Surface**: N/A — No backend Cloud Functions, Apps Script controllers, or API endpoint services were involved.
- **Module Surface**: Affected `src/styles/theme-utilities.css` and `src/styles/theme-tokens.css` styling submodules. Preserved monolith edit boundary via bottom-appending protocol.
- **Governance Surface**: Codified `CSS-APP-001` (Safe CSS Appending), `PEV-001` (Post-Edit `git diff` Verification), and `ATM-001` (All-Theme Matrix Sweep Rule) into `.agent/patterns/monolithic-css-append-and-all-theme-matrix-sweep.md` and updated `THEME-SYSTEM.md`.

---

## 5. Institutionalized Rules & Prevention

1. **Rule of Safe CSS Appending (CSS-APP-001)**:
   - New global utility classes or theme override blocks added to monolithic CSS files MUST be appended to the bottom of the file rather than spliced inline, eliminating edit-boundary deletion risk.
2. **Mandatory Post-Edit Verification (PEV-001)**:
   - Any tool edit on CSS files must be immediately followed by a `git diff <file>` check in the same turn before proceeding.
3. **All-Theme Matrix Sweep Rule (ATM-001)**:
   - Any theme-specific typography or contrast fix targeting one theme MUST evaluate and map all 7 active themes (`Light`, `Dark`, `Dim Dark`, `Sepia`, `Grayscale`, `Velvet Dark`, `Ambient`). Single-theme fixes are disallowed.
