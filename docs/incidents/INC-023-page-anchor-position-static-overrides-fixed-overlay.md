# Incident Report: INC-023 — Page-Anchor ID Stub `position:static` Overrides a Fixed Overlay

**Date**: 2026-06-23
**Status**: RESOLVED
**ID**: INC-023
**Track**: Frontend / CSS Specificity / P55-P81 Instrumentation Anchors
**Resolved By**: Changed `#task-assignment-console-modal` anchor rule in `src/styles/page-anchors.css` from `position: static` to `position: fixed` to match the component's `.fixed` utility.
**Keywords**: page-anchors, id-selector, specificity, position-static, fixed-overlay, modal-invisible, P55, P81, layout-catalog, TaskAssignmentConsoleModal
**Topology Layer**: Component Authority ↔ Instrumentation Catalog (CSS layer)
**Ownership Type**: css-registration / positioning
**Symptom Tags**: modal-invisible, button-does-nothing, position-override, id-vs-utility-specificity
**Related**: [INC-016](./INC-016-p81-layout-catalog-css-registration-miss.md) (inverse failure — id with *no* rule)

---

## 1. Executive Summary

A new modal overlay component (`TaskAssignmentConsoleModal.jsx`) rendered its root with the standard Tailwind overlay classes `fixed inset-0 z-50 …` — identical to the working `IntegratedProfileSelector` modal. Clicking the trigger button appeared to **do nothing**: no overlay, no backdrop, no error.

The modal was mounting correctly the entire time. The P55/P81 instrumentation-anchor catalog (`src/styles/page-anchors.css`) had registered the component's root `id` with the default stub `#task-assignment-console-modal { position: static; }`. An **ID selector (specificity 1,0,0) beats a utility class (0,1,0)**, so `position: static` overrode `.fixed` (`position: fixed`). The overlay dropped out of the fixed layer and into normal document flow at the bottom of a long scrollable page (computed `position:static`, rect `y≈3166`, off-screen), with `z-index:50` rendered inert (z-index has no effect on static elements).

Two earlier hypotheses (z-index too low; runtime throw) were **both wrong**. The cause was only found by a DOM probe that read the modal's *computed* `position`.

---

## 2. Root Cause

`page-anchors.css` registers one rule per P55 root-container `id` for P81 layout-catalog compliance. The stub default is `position: static` ("to avoid overriding any display/width/grid"). That default is correct for **in-flow** anchors (forms, fields, table containers) but **wrong for any element whose own classes set a non-static position** (`fixed` / `absolute` / `sticky` / `relative`).

Because the anchor rule is an `#id` selector, it silently wins over the component's Tailwind positioning utility. The component author cannot see the override in the JSX — it lives in a different file and layer.

The established convention already handles this: `#edit-task-details-modal` is registered as `position: relative` (not static) **to match its modal root** (`page-anchors.css:26-30`). The new anchor simply used the wrong default.

---

## 3. Resolution

`src/styles/page-anchors.css`:

```css
/* before */
#task-assignment-console-modal { position: static; }
/* after — match the element's actual .fixed positioning */
#task-assignment-console-modal { position: fixed; }
```

Step-container anchors (`#…-task-step`, `#…-profile-step`) are genuinely in-flow `flex` blocks, so their `position: static` stubs are correct and were left unchanged. Rebuilt clean (`npm run build`).

---

## 4. Surface Impact (compact)

- **UI**: ✅ AFFECTED — overlay invisible (rendered in-flow, off-screen). Fixed by the anchor `position` correction.
- **Data / Reactive / Service / Security**: ✅ NOT AFFECTED — pure CSS-specificity issue; no JS, schema, query, or rule changes.

---

## 5. Prevention (→ P90)

**Invariant**: A P55/P81 `page-anchors.css` ID stub MUST declare a `position` consistent with the component root's own positioning utility — never a conflicting `static`. When the JSX root carries `fixed` / `absolute` / `sticky` / `relative`, the anchor rule must use the matching `position` (or omit `position` entirely so the utility wins).

**Mechanical check** (grep cross-reference): for each `#id { position: static }` in `page-anchors.css`, confirm the matching JSX `id=` element does not also carry a `fixed|absolute|sticky|relative` class.

```bash
# list anchor ids stubbed static
grep -oE "#[a-z0-9-]+ \{ position: static" src/styles/page-anchors.css
# for each, verify the JSX root isn't a positioned element
grep -rn 'id="<that-id>"' src/  # inspect its className for fixed/absolute/sticky
```

**Diagnostic playbook** (reusable for "modal/overlay invisible, no error"): read the element's *computed* `position` and bounding rect via a console probe before suspecting z-index or a runtime throw. `position:static` + a large off-screen `rect.y` ⇒ a positioning override (usually an `#id` rule), not a stacking-context problem.
