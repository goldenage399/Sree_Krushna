---
name: ui-design-validator
description: >
  Enforces the Task-Dashboard CSS contracts: z-index tokens (no magic numbers),
  the sticky/scroll viewport contract, and semantic tokens over hardcoded values.
  Use when a change touches CSS, styling, z-index, position:sticky, or the design
  system. Prevents stacking-context wars and broken sticky elements. Token names
  and the sticky spec below are sourced from this repo, not a generic design system.
---

## Goal

Maintain visual stability by enforcing this repo's UI Design System contracts.

## The CSS Contracts

### 1. Z-Index Tokens (No Magic Numbers)

**Tokens (source: `src/styles/tokens/layout-tokens.css:169-170`):**
- `--z-sticky: 1000`
- `--z-modal: 1020`

**Check:** Does CSS contain a hardcoded numeric `z-index`?

- ❌ `z-index: 9999`
- ❌ `z-index: 100`
- ✅ `z-index: var(--z-sticky)`
- ✅ `z-index: var(--z-modal)`

> If a needed layer has no token, add one to `layout-tokens.css` — do not inline a number.

### 2. Sticky / Scroll Viewport Contract

**Governing SSOT:** `docs/ssot/ui-design/spokes/SCROLL-AND-STICKY-CONTRACT.md`

**The Unbroken Overflow Rule:** a `position: sticky` element fails if ANY ancestor
between it and the scroll viewport has `overflow: hidden/auto/scroll` (unless that
ancestor IS the designated scroll viewport).

**Check:** Is `position: sticky` used? Then classify the page into ONE scroll model:
- **Model A (Outer scroll):** page grows; sticky offsets `top: calc(var(--topbar-height) + var(--spacing-md))`; `z-index: var(--z-sticky)`.
- **Model B (Inner scroll, e.g. TaskCreationPage):** wrapper `height:100%; overflow:hidden`; `.page-content` is the scroll viewport (`overflow-y:auto; min-height:0`); sticky uses `top: 0; z-index: var(--z-sticky)`.

❌ Never mix Model A and Model B in the same page hierarchy.

### 3. Semantic Tokens Over Presentation

- ✅ `bg-surface-base-card`, `text-theme-fg`, `border-theme-accent`
- ❌ `bg-white`, `text-[#111]`, raw hex

Token registry: `src/styles/tailwind-semantic-bridge.css`, `src/tokens/` →
governed by `docs/ssot/ui-design/spokes/DESIGN-TOKENS.md`.

## Output

```markdown
## 🎨 Design System Validation
- Z-Index tokens: [✅/❌ + var used]
- Sticky/scroll model: [Model A / Model B / N/A]
- Semantic tokens: [✅/❌]
```

## ❌ Example Violation

**User:** "Set the modal to `z-index: 9999` so it's always on top."
**This skill BLOCKS:** "❌ Hardcoded z-index. Use `z-index: var(--z-modal)` (1020) from layout-tokens.css."

## Cross-references

- Token validity → `design-token-registry` facts / `DESIGN-TOKENS.md`
- Which spoke governs a change → `ssot-domain-mapper` skill
- Shared admin component CSS → `admin-component-contracts` skill

## ➡️ What's Next?

- `mobile-ui-validator` → if the component is responsive
- `pirr-compliance-checklist` → before merge
