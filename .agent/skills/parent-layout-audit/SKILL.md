---
name: parent-layout-audit
description: >
  Mandatory checklist before asserting that a child's min-width / max-width /
  flex-basis / column count fits a given viewport in Task-Dashboard. Use whenever a
  review or implementation makes pixel-fit math like "120px + 120px + 16px gap fits
  in 320px". Such claims are INVALID until the parent ancestor chain's padding,
  border, and gap are subtracted from viewport width. If a sizing claim is made
  without tracing parents first, this skill must run.
---

## Goal

Kill the recurring error of asserting child sizing without subtracting ancestor
padding/border/gap (the gap that let Review 2.1 miss the real usable width).

## The Formula

```
usable_width = viewport_width − Σ(ancestor horizontal padding + 2×border) − Σ(gaps before the child)
fits? →  child_min_width × columns + gap × (columns − 1)  ≤  usable_width   (check at SMALLEST claimed breakpoint)
```

## Token Pixel Values (this repo)

The loaded Tailwind config is an **empty stub** (`tailwind.config.js`), so spacing
resolves to **standard Tailwind**:
- `gap-4` = 16px · `gap-3` = 12px · `p-3` = 12px · `p-5` = 20px · `px-4` = 16px each side
- (The compact scale in CLAUDE.md applies to **fonts** via the CSS bridge, NOT spacing.)

> Confirm any token you rely on; do not assume a custom override exists — there is none in config.

## Worked Anchor: `#profile-mgmt-stats`

Verified facts (re-trace at source before relying):
- Container: `src/components/ProfilesManageTab.jsx:301` — `flex flex-wrap gap-4`, `id="profile-mgmt-stats"`
- Tiles: `:302-345` — `className="flex-1 min-w-[120px] max-w-[200px]"`
- Immediate parent: `:278` `<div className="space-y-6">` — **no horizontal padding**
- Tile root padding (`AdminStatTile`): `p-3 sm:p-5` → `admin-component-contracts` skill

**To complete the audit you MUST trace above ProfilesManageTab:**
1. Grep where `ProfilesManageTab` is rendered (its page + layout shell).
2. For each ancestor wrapper record `p-*`/`px-*`, `m-*`/`mx-*`, `border*`, and `gap-*`.
3. Sum horizontal offset at 320 / 360 / 480 / 640px and fill the table below.

| Viewport | Σ ancestor horizontal offset | Usable width |
| --- | --- | --- |
| 320px | [trace] | [320 − Σ] |
| 360px | [trace] | [360 − Σ] |
| 480px | [trace] | [480 − Σ] |

Then test: two tiles `min-w-[120px]` + `gap-4` (16px) = **256px** ≤ usable@320? `flex-wrap`
means tiles drop to a new row when they don't fit — so also confirm the **intended row
count** is what wrapping actually produces, not just that "it doesn't overflow."

## Sizing Assertion Checklist

- [ ] Full ancestor padding/border chain traced and documented (not assumed)
- [ ] `usable_width` computed at the smallest claimed breakpoint
- [ ] `child_min × cols + gap × (cols−1) ≤ usable_width` verified
- [ ] `flex-wrap` row-count behavior matches the claim
- [ ] Token px values confirmed as standard Tailwind (config is an empty stub)

## Cross-references

- Tile component contract (padding, className) → `admin-component-contracts` skill
- Responsive/Fluid-Tile invariant → `ssot-domain-mapper` → `docs/ssot/ui-design/spokes/RESPONSIVE-DESIGN.md`
- Token px values → `design-token-registry` facts / `DESIGN-TOKENS.md`
