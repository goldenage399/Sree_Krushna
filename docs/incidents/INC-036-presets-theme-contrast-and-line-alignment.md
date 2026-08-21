# Incident Report: INC-036 — Presets Tab Theme Contrast & Stepped Line Misalignment

## Incident Summary
During the redesign of the **Project Hierarchies & Presets** dashboard, several layout regressions and visual defects were identified on the Sepia theme and various responsive viewports:
1. **Low Contrast / Theme Violation**: Unselected project filter buttons rendered with a solid dark brown background, making the text almost unreadable under the Sepia theme.
2. **Selector Overflow**: The project buttons were laid out in a single horizontal row that overflowed off the right edge of the viewport.
3. **Dashed Line Misalignment**: The vertical dashed connector line in the stepped level tree cards ran to the right of the level numbers instead of passing directly through their centers.

---

## Root Cause Analysis

### 1. Tailwind Opacity Utility Failures in Hybrid CSS Bridge
The unselected project selector buttons used Tailwind's opacity class overlay (`bg-theme-bg/20`), while the selected ones used `bg-theme-accent/10`. Because this codebase uses a hybrid design system with a static compiled semantic bridge (`src/styles/tailwind-semantic-bridge.css`), utility classes with custom opacity modifiers (like `/10`, `/20`) that are not explicitly defined in the bridge stylesheet fail silently in the browser. 

The fallback behavior led to:
- The background resolving to a solid color without transparency.
- In the Sepia theme, this resulted in a dark brown solid button which crushed text contrast with the unselected label text.

### 2. Dotted Command Line Offset Mismatch
The vertical dashed connector line was set to `left-[34px]`, while the parent level row container had `pl-5` (20px padding) and the level circle avatars had `absolute -left-5` (-20px offset). Since the level circles sit exactly at `0px` relative to the container, their horizontal centers sit at `8px` (half of their `w-4` width). Setting the line position to `34px` shifted it `26px` to the right.

---

## Architectural Surface Mapping
1. **UI Surface**: Resolved visual contrast issues by mapping selector items to standard CSS theme custom variables and using native `color-mix()` for alpha overlays. Realignment of vertical stepped connector lines to `left-[8px]` to center them on level circles.
2. **Data Surface**: N/A
3. **Reactive Surface**: N/A
4. **Service Surface**: N/A
5. **Module Surface**: N/A
6. **Governance Surface**: Registered new standards `FKL-DI-013` inside `RESPONSIVE-DESIGN.md` to govern future comparative dashboards, ensuring fluid grids, top-level wrapping filter lists, and unified button groups.

---

## Corrective Actions & Resolution
1. **Removed Tailwind Opacity Classes**: Replaced `bg-theme-bg/20` and `bg-theme-accent/10` with inline styles targeting standard CSS theme variables.
2. **Native CSS Color-Mix**: Used native browser `color-mix(in srgb, var(--theme-accent) 15%, transparent)` to define transparent background highlights dynamically across all themes.
3. **Realigned Connector Line**: Adjusted the connector line position in `ProjectPresetsTab.jsx` to `left-[8px]` to center it precisely.
4. **Wrap-Around Filters**: Converted the horizontal overflow bar to a `flex flex-wrap gap-2.5` wrap-around tag bar at the top, freeing up full screen width for the grid below.
5. **Responsive Grid**: Restored multi-column responsive classes `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` to split cards side-by-side.

---

## Prevention & Invariants
Standardized under **FKL-DI-013** in `RESPONSIVE-DESIGN.md` to ensure comparative dashboards align to:
- Fluid Multi-Column Card Grids.
- Top-Level Wrapping Filters.
- Unified Button Group Controls.
