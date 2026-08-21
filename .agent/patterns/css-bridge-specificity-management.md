---
pattern: css-bridge-specificity-management
activation_tier: reference
canonical_source: task-dashboard
guard: "npm run check:bridge-classes"
status: VALIDATED
portability: universal
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "responsive class not working"
  - "sm: class does nothing"
  - "md: class ignored"
  - "grid won't multi-column"
  - "responsive prefix no-op"
  - "bridge specificity"
  - "tailwind responsive broken"
  - "layout not responsive"
  - "breakpoint class ignored"
  - "sm: grid-cols not applying"
origin_incident: INC-022
created: 2026-06-23
---

# CSS Bridge Specificity Management & Scroll Overflow

## Problem

Under a hybrid styling system where a global CSS semantic bridge (`tailwind-semantic-bridge.css`) is imported after Tailwind utilities:
1. Base utility definitions in the bridge (like `.w-full` or typography classes like `.text-xs` and `.font-bold`) can silently override responsive overrides from Tailwind (like `md:w-auto`, `md:text-[10px]`, or `md:font-semibold`) due to equal selector specificity combined with late loading order in the CSS cascade.
2. Missing classes in the bridge cause silent layout failures on custom components.
3. Outermost wrappers with `overflow-hidden` clip the scrollbars of child elements using `overflow-x-auto`, breaking table responsiveness.

## Solution

1. **Responsive Mirroring Rule**:
   - If a layout/width utility is registered in the bridge, all of its responsive variations (`md:`, `sm:`, etc.) used in the JSX must also be mirrored inside the corresponding `@media` queries in the bridge to prevent cascade override bugs.

2. **Tailwind Important Modifier Bypass**:
   - For typography or other bridge-redefined utility classes (e.g., `.text-xs`, `.font-bold`) where responsive overrides in JSX are ignored by the browser, use Tailwind's `!` important modifier (e.g., `md:!text-[10px]` and `md:!font-semibold`). This forces the browser to respect the media query layout styles over the late-loaded CSS bridge defaults.

3. **Scroll Context Isolation**:
   - Avoid using `overflow-hidden` on components that wrap scrollable children.
   - Restructure border-radius clipping bounds directly onto the child scroll container (`overflow-x-auto`) to preserve clean corners without clipping scrollbars.

4. **Vertical Column Stacking**:
   - If badges or tag groups inside a grid cell wrap horizontally and squeeze the main title content, change the badges container to a vertical column (`flex-col items-end flex-shrink-0`) instead of a wrapping row (`flex-wrap`). Stacking them vertically leverages the cell's height, prevents horizontal blowout, and maximizes space for the title on the left.

## Visual Edit Attempt Cap (VEA-001)

**This rule applies to ALL CSS/layout bug fixes using this pattern.**

Because the agent cannot see computed browser output, trial-and-error edits create the tiresome loop documented in RCA 6.4 (260628 ProfileModal). Enforce strictly:

- **Attempt 1**: Make the fix. Report exactly what was changed and why.
- **If the user reports it did not work**: STOP IMMEDIATELY. Do NOT make a second edit.
- **Instead, say**: "I cannot verify visual output from static analysis. Please share a screenshot or DevTools → Computed styles for `<element>` before I continue."
- **Only after receiving visual evidence**: diagnose from the evidence, then make attempt 2.

Rationale: build-pass ≠ visual correctness. A correct-compiling change can still produce zero visual change (INC-002 root: equal-specificity cascade override). Iterating without browser proof wastes turns and burdens the user as the visual verification layer.

---

## Task-Dashboard instance

- **Incident INC-022**: Restored responsiveness on `AdminUsersPage.jsx` by adding missing width (`.min-w-full`, `.w-1/3`), overflow (`.overflow-x-auto`), and responsive width classes (`.md:w-auto`, `.md:w-64`, `.md:items-end`) to `src/styles/tailwind-semantic-bridge.css`, and moved layout constraints directly to the scroll container.
- **Cockpit Redesign (260626_Th7_UI_Improvements)**: Restored the responsive two-column layout on `MyTasksPage.jsx` by adding missing responsive grid classes (`.lg:grid-cols-2`, `.xl:grid-cols-2`) to `src/styles/tailwind-semantic-bridge.css`.
- **Incident INC-037**: Restored the multi-column layout of the Project Presets dashboard cards by removing the container ID (`#project-presets-cards-grid`) from a stylesheet rule that declared `display: block;` (which overrode Tailwind's `.grid` utility class due to ID selector specificity).
- **ProfileModal LIVE VIEW (260628, Thread 4)**: `LIVE VIEW` card stacked at bottom of `ProfileModal.jsx` grid despite `sm:grid-cols-12` class. Root cause: `grid-cols-1` base class in component co-existed with `sm:grid-cols-12` override — bridge cascade locked the grid in 1-column. Fix: removed `grid-cols-1` and `col-span-1` from JSX, letting CSS Grid default handle mobile and `sm:grid-cols-12` handle tablet+. Agent initially assumed breakpoint mismatch and attempted code changes without consulting LAYOUT-BUG-INDEX.md → triggered VEA-001 failure mode (3 failed attempts, user as visual verifier). This is the 4th confirmed instance of this pattern.
- **Cockpit Badge Redesign (260708, Thread 5)**: Badges on `TaskCard.jsx` failed to scale down to `md:text-[10px]` on desktop/tablet. Root cause: `tailwind-semantic-bridge.css` contains a global definition `.text-xs { font-size: var(--tc-caption, 12px); }` loaded late, which overrode the responsive `md:text-[10px]` class selector due to cascade ordering. Fixed by utilizing Tailwind's important modifier (`md:!text-[10px]` and `md:!font-semibold`) to bypass the late-loaded selector.
- **MyDayPage.jsx (260730, TASK-227 Slice 1.7)**: `grid grid-cols-1 lg:grid-cols-[280px_1fr_260px]` stacked all three panels full-width at every viewport, found via a real user screenshot. This is the 6th confirmed instance — same root cause as the ProfileModal case (unconditional `grid-cols-N` co-existing with a responsive override). **Notable difference from prior instances**: the guard (`check:bridge-classes`) was already fully wired into `npm run preflight` (PREFLIGHT.md row R26) *before* this bug was written — the agent simply never ran `npm run preflight` across four iterative edits to this file, substituting an ad hoc `eslint`+`build` verification recipe instead. Running `npm run preflight` retroactively against the pre-fix diff would have caught it on the first edit. This is a process-compliance gap (the designated entry protocol in `cos-invoke.md` — "any task that touches `src/`... Step 1: `npm run preflight`" — wasn't followed), not a tooling gap. Fix: removed `grid-cols-1`, switched to `lg:grid-cols-12` + `lg:col-span-3/6/3`.


