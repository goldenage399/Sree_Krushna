---
pattern: theme-button-opt-out-contract
activation_tier: reference
status: SUPERSEDED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Theme Button Opt-Out Contract — SUPERSEDED (INC-063, 2026-07-12)

> [!WARNING]
> **This pattern is retired.** It documented an opt-out CSS default
> (`button:not(.theme-button-secondary)`) that made every `<button>` in the app a hijacked
> gradient CTA unless it carried an escape class — the fact that a future dev had to "always
> remember" that escape class is *why this pattern needed to exist at all*. That selector
> recurred as a real defect at least 3 times (this pattern's own origin session, INC-058, and
> 4 more buttons found during TAP-001) before it was recognized as one root cause and
> **inverted to opt-in**: `.button-theme-primary` now declares itself; nothing is hijacked by
> default. `button:not(.theme-button-secondary)` no longer exists anywhere in the CSS.
> **If `harvest-frontend-knowledge.md` Phase 0.1 routed you here for a theme-button conflict:
> the model below is history, not current guidance.** Go to
> [INC-063](../../docs/incidents/INC-063-button-theme-hijack-opt-out-default.md) and
> `debug-frontend.md` Track G instead — the opt-in contract table there is current.
>
> Kept below (unedited) as the historical record of the pattern that led to the inversion —
> per DPP-001, institutional memory is not deleted, only superseded in place.

**Category**: Design Gate / Anti-Pattern (HISTORICAL — see warning above)
**Applies to**: Frontend UI styling, layouts, customized filters, and custom HTML buttons
**Origin**: 2026-06-28 session, debugging Cockpit page filter buttons locked in brown theme styling.
**Status**: SUPERSEDED (was VALIDATED) — superseded by the opt-in model, INC-063, 2026-07-12

---

## Pattern — Theme Button Opt-Out Contract

### Problem
When developing custom interactive buttons (e.g. toggles, filter chips, navigation capsules), standard Tailwind utility classes (like `bg-primary`, `bg-surface-secondary`, `text-primary`) are applied in JSX but silently ignored in the browser. The buttons remain locked to standard theme colors (e.g., solid brown in Sepia theme, dark-gray gradients in Velvet-Dark), breaking visual active states and rendering state changes completely invisible.

### Why it happens
Global theme override stylesheets (such as `themes-enhanced.css` or `theme-overrides.css`) include high-specificity selector overrides of the form:
```css
button:not(.theme-button-secondary) {
  background: var(--color-theme-button-bg);
  color: var(--color-theme-button-fg);
  border-color: var(--color-theme-button-border);
}
```
Because these stylesheet overrides load late in the cascade and target elements directly, their specificity overrides standard Tailwind CSS utility classes. Any button without the opt-out class is forcefully coerced into the global theme style variables.

### Solution
1. **Always apply the opt-out class**: Every customized `<button>` element in the application JSX must be explicitly decorated with the `.theme-button-secondary` class.
2. **Apply Tailwind/Inline styling alongside**: Once `.theme-button-secondary` is present on the button, Tailwind class states (e.g. `bg-primary` for active, `bg-surface` for inactive) will render correctly.
3. **Include a Back-Link**: Add a comment referencing the design invariant to prevent future regression.

### Failure Mode
Omitting `.theme-button-secondary` results in silent override of active state styling, causing interactive controls to look dead and unresponsive in specific themes.

### Task-Dashboard instance
- **My Tasks Cockpit Page**: Filter buttons (`Filter Overdue`, `Search & Filter`, `Closed`) were locked to brown colors in the active theme because they lacked `.theme-button-secondary`. Appending the class restored state-switching responsiveness on [MyTasksPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/MyTasksPage.jsx#L516).
- **Team Oversight Page**: The global closed toggle button successfully responded to state changes because it was styled with `.theme-button-secondary` on [TeamOversightPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/TeamOversightPage.jsx#L880).
- **Project Presets Tab Edit/Cancel buttons**: Buttons styled with `bg-theme-bg` class had their brown gradient overridden by the `!important` sepia background rule — see Anti-Pattern below (2026-06-29).

---

## Anti-Pattern — `bg-theme-bg !important` Overriding Button Theme Gradient

**Origin**: 2026-06-29 session, Edit/Cancel buttons in `ProjectPresetsTab.jsx` rendering in parchment color instead of sepia brown despite correct button theme rule.

### What it is
A `button` element carries a background utility class (e.g. `bg-theme-bg`, `bg-theme-bg-secondary`) as a Tailwind class. In Sepia and Velvet-Dark themes, these classes are overridden at a **theme level** with `!important` (e.g. `[data-theme="sepia"] .bg-theme-bg { background: ... !important }`). The `!important` declaration fires **after** the `button:not(.theme-button-secondary)` rule in the cascade and unconditionally wins — even though the button rule was supposed to color the button.

This is the **inverse** of FKL-DI-003. FKL-DI-003 covers button theme overriding utility classes. This anti-pattern covers `!important` utility classes overriding button themes.

### Symptoms
- Button appears as a page-surface color (parchment / sidebar tone) instead of the expected button gradient
- Only occurs in Sepia or Velvet-Dark theme, not in Light or Dim Dark
- Button has both a background utility class (`bg-theme-bg`) AND does NOT have `.theme-button-secondary`
- The button's intended theme gradient (e.g. brown for Sepia) is registered in the CSS but visually absent

### Why it fails
```css
/* Rule A — fires first (L1114) */
[data-theme="sepia"] button:not(.theme-button-secondary) {
  background: linear-gradient(135deg, #A67C52 0%, #C19A6B 100%);
  /* no !important */
}

/* Rule B — fires later (L1075), same specificity, has !important → WINS */
[data-theme="sepia"] .bg-theme-bg {
  background: linear-gradient(135deg, #F8F5F0 0%, #F2EDE6 100%) !important;
}
```
`!important` beats normal cascade specificity. Rule B was designed for **container surfaces**, not button chrome — but because the button has `bg-theme-bg` as a class, it gets caught.

### Correction (two valid approaches)

**Approach A — Fix at CSS root (preferred)**: Scope the background utility override to non-button elements:
```css
/* Before */
[data-theme="sepia"] .bg-theme-bg { background: ... !important; }

/* After — excludes buttons from the override */
[data-theme="sepia"] :not(button).bg-theme-bg { background: ... !important; }
```
Apply the same fix to `[data-theme="velvet-dark"] .bg-theme-bg` if it also uses `!important`.

**Approach B — Fix at JSX**: Remove `bg-theme-bg` from the button className and replace with a class that is NOT targeted by the utility override rule.

### Files to check
- `src/styles/themes-enhanced.css` — search for `[data-theme="sepia"] .bg-theme-bg` and `[data-theme="velvet-dark"] .bg-theme-bg`
- Any button JSX that uses `bg-theme-bg`, `bg-theme-bg-secondary`, or `bg-theme-bg-tertiary` as classes

<!-- FKL-DI-015 SSOT: docs/ssot/ui-design/spokes/THEME-SYSTEM.md § "FKL-DI-015" -->
