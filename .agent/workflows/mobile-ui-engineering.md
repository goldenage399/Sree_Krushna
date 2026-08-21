---
description: Definitive guide for Mobile UI engineering, responsive rules, and mobile-specific debugging
---

# Mobile UI Engineering Workflow

**Purpose**: Standardize responsive behavior (Mobile < 768px) and prevent "desktop-only" features.
**Scope**: All CSS/JS referencing UI components in Task-Dashboard.
**Version**: 2.0 (External Review Integration - Jan 2026)

> **Knowledge Retrieval**: Before beginning, execute [FRONTEND-KNOWLEDGE-HUB.md](../../docs/ssot/ui-design/FRONTEND-KNOWLEDGE-HUB.md) Part 10 Step 0 to load the retrieval profile for this work type (WT-09 Mobile UI Engineering).

---

## 📱 Core Principles

### 1. Desktop-First, Mobile-Adapted

- Our CSS is written desktop-first (default styles).
- Use `@media (max-width: 768px)` overrides for mobile adaptations.
- **New components** should use `@media (min-width: 48rem)` (mobile-first) where practical.

### 2. The "Flex-Stack" Pattern

- **Desktop**: `flex-direction: row` (Side-by-side)
- **Mobile**: `flex-direction: column` (Stacked vertically)
- _Rule_: Any container with >2 items MUST stack on mobile.

### 3. Touch Target Integrity (WCAG 2.5.8)

- Minimum clickable size: **44px × 44px**.
- Minimum spacing between targets: **8px** (prevents accidental taps).
- Add `padding: 12px` to buttons inside mobile media queries.

```css
/* Use our existing design tokens */
.btn-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-md) var(--space-lg); /* 12px 16px */
  margin: var(--space-sm); /* 8px spacing */
}
```

### 4. Visibility Control

- Use `.hidden-mobile` for non-essential desktop decoration.
- **NEVER** hide primary actions (Save, Submit, Delete) on mobile.
- Use `aria-hidden="true"` for screen reader compatibility (not just CSS `display: none`).

---

## 🎨 CSS Architecture (Contextualized)

> **See Also**: [UI_DESIGN_SYSTEM.md](../../docs/UI_DESIGN_SYSTEM.md) for the full token hierarchy (Primitives → Semantic → Legacy Aliases) and z-index/sticky contracts.

### Use Design Tokens from `variables.css`

Our codebase already has CSS custom properties. Use them consistently:

```css
/* ✅ Good: Use tokens */
.mobile-card {
  padding: var(--space-lg); /* 16px */
  border-radius: var(--radius-lg); /* 8px */
  box-shadow: var(--shadow-md);
}

/* ❌ Bad: Hardcoded values */
.mobile-card {
  padding: 16px;
  border-radius: 8px;
}
```

### Unit Strategy

| Use Case                   | Recommended Unit        | Example                         |
| -------------------------- | ----------------------- | ------------------------------- |
| Spacing (margins, padding) | `var(--space-*)` tokens | `margin: var(--space-lg)`       |
| Font sizes                 | `var(--text-*)` tokens  | `font-size: var(--text-md)`     |
| Touch targets              | `px` (fixed minimum)    | `min-height: 44px`              |
| Container widths           | `%` or `max-width`      | `width: 100%; max-width: 900px` |

### Breakpoint Reference

```css
/* Mobile (phones) */
@media (max-width: 768px) {
  /* ... */
}

/* Tablet (optional) */
@media (min-width: 769px) and (max-width: 1024px) {
  /* ... */
}

/* Desktop (default styles, no query needed) */
```

---

## 🛠️ Harvested Patterns (Proven in Production)

### 1. The Mobile Overlay (e.g., Crop Modal)

```css
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal); /* Use token: 1000 */
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.95);
}
```

### 2. The Floating Toolbar

```css
.mobile-toolbar {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: var(--space-lg);
  background: var(--color-bg-white);
  box-shadow: var(--shadow-up);
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm); /* 8px between buttons */
}
```

### 3. Class-Based Toggles (JS)

```javascript
// ✅ Good: Toggle class
document.getElementById("panel").classList.toggle("mobile-open");

// ❌ Bad: Inline styles
document.getElementById("panel").style.display = "block";
```

---

## ♿ Accessibility Requirements

### Keyboard Navigation (Required for Modals)

```javascript
// All modals must handle Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Focus management pattern
function openModal() {
  const modal = document.getElementById("myModal");
  modal.classList.add("visible");
  modal.querySelector("button, [href], input").focus(); // Focus first interactive
}
```

### Focus Indicators

```css
/* Must be visible - don't remove outlines */
button:focus,
a:focus,
input:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support

- Use semantic HTML: `<button>`, `<nav>`, `<main>`, `<aside>`
- Add `aria-label` for icon-only buttons: `<button aria-label="Close">×</button>`
- Use `aria-hidden="true"` for decorative elements

---

## 🛠️ Engineering Checklist (Pre-Commit)

### 1. Ghost Component Check (Mandatory)

```powershell
# Must return > 0 matches
Select-String -Path "public/css/**/*.css" -Pattern "your-class-name" -Recurse
```

### 2. Responsive Query Check

```powershell
# Verify @media query exists for mobile
Select-String -Path "public/css/your-file.css" -Pattern "@media.*768"
```

### 3. Breakpoint Cascade Check (Critical!)

**When**: Component has styles in BOTH tablet (641-1200px) AND mobile (≤640px).

**Rule**: For each layout property set in tablet, verify mobile overrides it:
| Tablet Sets | Mobile Must Override |
|-------------|----------------------|
| `justify-content: center` | `justify-content: flex-start` |
| `flex-direction: row` | `flex-direction: column` |
| `display: none` | `display: flex/block` |

**Test**: Resize from 800px → 400px → open any overlay/expanded state → verify alignment.

### 4. Touch Target Check

```powershell
# Verify 44px minimum for buttons
Select-String -Path "public/css/**/*.css" -Pattern "min-height:\s*44px" -Recurse
```

### 4. Accessibility Quick Check

- [ ] All buttons have text or `aria-label`
- [ ] Modal closes on Escape key
- [ ] Focus is visible on all interactive elements
- [ ] No content hidden ONLY by color

### 5. UI Design System Compliance (Protocol #27)

- [ ] Sticky elements use `.container--sticky-enabled`?
- [ ] Z-index uses `--pio-z-layer-*` tokens (not hardcoded values)?
- [ ] CSS imports follow 5-layer order (Core → Components → Layouts → Utilities)?

---

## 🧪 Testing Protocol

### Manual Device Testing (Before Merge)

| Device           | Browser    | Check                         |
| ---------------- | ---------- | ----------------------------- |
| iPhone (Safari)  | iOS Safari | Layout, touch targets, modals |
| Android (Chrome) | Chrome     | Layout, touch targets, modals |
| iPad (Safari)    | iOS Safari | Landscape/Portrait            |

### Accessibility Testing

1. **Keyboard Navigation**: Tab through all interactive elements
2. **VoiceOver (iOS)**: Settings > Accessibility > VoiceOver
3. **TalkBack (Android)**: Settings > Accessibility > TalkBack
4. **Zoom Test**: Browser zoom to 200%, verify no overflow

### Quick Browser DevTools Test

```
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select: iPhone 12 Pro (390px)
4. Verify:
   - [ ] No horizontal scroll
   - [ ] All buttons visible
   - [ ] Text readable
   - [ ] Modals don't overflow
```

### Cross-Breakpoint Transition Test (Critical!)

```
1. Start at 1024px (tablet)
2. Open any sidebar/overlay (should be collapsed/centered)
3. Resize to 390px (mobile)
4. Open sidebar/overlay via hamburger
5. Verify:
   - [ ] Elements LEFT-aligned (not centered)
   - [ ] Text labels visible (not hidden)
   - [ ] No layout overlap from tablet styles
```

---

## 🐞 Mobile Debugging Protocol

### Symptom: "Element missing on mobile"

**Step 1: Check Visibility Classes**

- Does it have `.hidden-mobile`?
- Is it inside a parent with `.hidden-mobile`?

**Step 2: Check Flex-Wrap**

- If `flex-wrap: nowrap` (default) and content overflows, it might be pushed off-screen.
- _Fix_: Add `flex-wrap: wrap` or switch to `flex-direction: column`.

**Step 3: Check Fixed Widths**

- Did you use `width: 300px`?
- _Fix_: Change to `width: 100%` or `max-width: 100%` inside media query.

**Step 4: Check Ghost Styles**

- Are you relying on browser defaults?
- _Fix_: Explicitly define `display: flex` and `gap`.

**Step 5: Check Touch Target Size**

- Is the element < 44px in height/width?
- _Fix_: Add `min-height: 44px; min-width: 44px;`

---

## 📋 Orientation Handling

```css
/* Portrait (default on mobile) */
.header {
  padding: var(--space-lg);
}

/* Landscape - reduce vertical footprint */
@media (orientation: landscape) and (max-width: 900px) {
  .header {
    padding: var(--space-sm) var(--space-lg);
  }
  .mobile-toolbar {
    padding: var(--space-sm);
  }
}
```

---

## 🔗 References

- [WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [W3C Mobile Accessibility](https://w3c.github.io/matf/)
- [PIOperationsMgmt Design Tokens](file:///d:/GitHub_Repo/Task-Dashboard/public/css/core/variables.css)
