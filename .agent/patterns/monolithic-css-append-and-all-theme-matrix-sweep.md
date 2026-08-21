---
pattern: monolithic-css-append-and-all-theme-matrix-sweep
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Monolithic CSS Safe Appending & All-Theme Matrix Sweep

**Category**: Process Pattern & Design Gate  
**Applies to**: Large monolithic CSS file modifications (`theme-utilities.css`, `theme-tokens.css`), theme contrast adjustments, typography token tuning  
**Origin**: Session 2026-07-30 (INC-068)  
**Status**: VALIDATED  

---

## Pattern — Safe CSS Appending & Theme Matrix Sweep

### Problem
1. **Tool Execution Hazard**: In monolithic CSS files (>1,000 lines) with repetitive selector structures, inline string replacement (`replace_file_content`) near middle line ranges can match incorrect fuzzy boundaries, accidentally deleting adjacent theme rules (e.g. Velvet Dark card gradients/hover states).
2. **Single-Theme Scope Narrowing**: When solving a visual contrast bug reported in one specific theme (e.g. Sepia), applying overrides exclusively to `[data-theme="sepia"]` leaves other themes (e.g. Velvet Dark, Dark, Dim Dark) vulnerable to black-on-dark invisible text bugs.

---

### Why it happens
1. **Fuzzy String Matching in Dense Selector Blocks**: CSS selectors like `.card`, `.button`, and `[data-theme]` repeat throughout large stylesheets. Replacing text inline in middle line ranges without strictly unique surrounding anchors causes editor tools to match wider ranges than intended.
2. **Prompt-Focused Blind Spots**: LLMs naturally focus on the single theme mentioned in the user's prompt (Sepia), failing to evaluate how hardcoded utility classes (`.text-black`, `.text-gray-900`) behave across the full 7-theme matrix (`Light`, `Dark`, `Dim Dark`, `Sepia`, `Grayscale`, `Velvet Dark`, `Ambient`).

---

### Solution

#### 1. CSS Safe Appending Rule (`CSS-APP-001`)
When adding new utility overrides or theme rules to large monolithic CSS files:
- **Always append new rule blocks to the end of the file** (`replace_file_content` targeting the last lines) rather than splicing inline in middle line ranges.
- Appending has **zero boundary overlap risk** and cannot delete pre-existing rules higher up in the stylesheet.

#### 2. Mandatory Post-Edit Verification (`PEV-001`)
- Immediately after editing any CSS file, run `git diff <filepath>` to verify that only the intended lines were modified.

#### 3. All-Theme Matrix Sweep Rule (`ATM-001`)
Whenever addressing a theme contrast or typography bug:
- Evaluate all 7 active themes: `Light`, `Dark`, `Dim Dark`, `Sepia`, `Grayscale`, `Velvet Dark`, `Ambient`.
- Map hardcoded dark text utilities (`.text-black`, `.text-gray-900`, `.text-slate-900`, `.text-neutral-900`, `.text-zinc-900`) to appropriate semantic text tokens across all themes (e.g., `#4a2e12` for Sepia, `#f8f9ff` for Velvet Dark, `#f8fafc` for Dark/Dim Dark).

---

### Failure Mode
- **Partial Implementation**: Fixing Sepia text contrast while leaving Velvet Dark text black-on-purple.
- **Inline Editing Regressions**: Deleting pre-existing Velvet Dark card gradients during a Sepia replacement.

---

### Task-Dashboard Instance
- **Incident**: [INC-068](file:///d:/GitHub_Repo/Task-Dashboard/docs/incidents/INC-068-multi-theme-typography-override-and-css-edit-boundary.md)
- **Files**: `src/styles/theme-utilities.css` (L1263–L1338), `docs/ssot/ui-design/spokes/THEME-SYSTEM.md`
