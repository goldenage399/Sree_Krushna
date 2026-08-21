# Incident Report: INC-037 — Presets Grid Layout Specificity Override

## Incident Summary
Following the layout restoration in INC-036, the **Project Hierarchies & Presets** cards collapsed back to a single-column layout on wide screens. The dynamic multi-column display grid (`lg:grid-cols-2`, `xl:grid-cols-3`) was lost due to a CSS layout catalog optimization entry in the shared stylesheets.

**Affected Component**: `src/styles/components/layout-containers.css`, `src/components/ProjectPresetsTab.jsx`

---

## Root Cause Analysis

### CSS Specificity Hierarchy Clash
To support performance optimizations, the ID of the presets card grid container (`#project-presets-cards-grid`) was added to a performance-containment selector grouping in `src/styles/components/layout-containers.css`:

```css
#project-presets-tab-layout,
#project-presets-filter-bar,
#project-presets-cards-grid {
  display: block;
  contain: layout style;
}
```

Because ID selectors have a specificity of `0.1.0.0` while class selectors (like Tailwind's `.grid` utility) have a specificity of `0.0.1.0`, the stylesheet's `display: block` declaration took precedence over Tailwind's layout declaration. This changed the display format of the grid container from a grid to a standard block layout, making all child cards stack vertically in a single column regardless of screen width.

---

## Architectural Surface Mapping
1. **UI Surface**: Specificity clash on the presets cards container. Corrected by removing the `display: block` declaration from the grid container ID in the stylesheets.
2. **Data Surface**: N/A
3. **Reactive Surface**: N/A
4. **Service Surface**: N/A
5. **Module Surface**: N/A
6. **Governance Surface**: Traced the collision to a performance optimization pattern. Captured a positive pattern under `css-bridge-specificity-management` to isolate display properties from containment optimization rules.

---

## Corrective Actions & Resolution
1. **Isolated Grid Container ID**: Removed `#project-presets-cards-grid` from the block grouping in `src/styles/components/layout-containers.css`.
2. **Retained Containment Rule**: Created a separate CSS rule for `#project-presets-cards-grid` that applies only `contain: layout style;`, allowing the Tailwind `display: grid;` and column classes to take effect.
3. **Validation**: Ran `npm run build` to verify standard compilation.

---

## Prevention & Invariants
- Enforce the new **CSS Bridge Specificity Management** pattern: Do not specify `display` overrides on element IDs that consume framework layout classes (like Tailwind's `.grid` or `.flex`).
