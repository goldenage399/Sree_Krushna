# Sree_Krushna — Preflight Gate & Routing Table

> **Standard**: P82 (Governance Wiring Completeness) & M-GATE-01 (Mobile First Verification)
> **Enforcement**: Run before making structural, code, UI, or schema changes.

## Routing Matrix

| Row | Trigger / Condition | Standard / Protocol | Verification Action | Rationale / Failure Mode Prevented |
|---|---|---|---|---|
| R1 | Creating new Markdown specifications or guides | `.agent/workflows/portable/spoke-and-wheel-docs.md` | Check `hub:` frontmatter and verify registration in parent hub | Documentation drift and orphaned markdown files |
| R2 | Adding or updating `.agent/patterns/*.md` | `docs/protocols/PATTERN-ACTIVATION-CONTRACT-MANUAL.md` (PACT-001) | `npm run verify:governance-wiring` | Orphaned pattern contracts or unwired triggers |
| R3 | Running cross-repo sync | `.agent/workflows/sap-sync.md` | `npm run verify:governance-wiring:all` | Schema drift across sibling repositories |
| R4 | **Any UI, Layout, Component, or CSS Modification** | **Protocol 19 / `.agent/workflows/mobile-ui-engineering.md` & `.agent/skills/mobile-ui-validator/SKILL.md`** | **Mandatory 300px/320px/375px/768px Viewport Audit**: (1) No horizontal body overflow, (2) Touch targets $\ge 44 \times 44\text{px}$, (3) Touch momentum scroll on nav/swimlanes, (4) Flex-Stack on forms/cards, (5) Responsive table wrap | Desktop-only features, unclickable mobile buttons, broken layouts on mobile devices |

---

## 📱 Mandatory Mobile Gate Protocol (M-GATE-01)
Every UI step must pass the following 5-point verification checklist before being deployed:
1. **300px Viewport Hard Test:** No element causes horizontal scroll on `body`.
2. **Touch Target Size (WCAG 2.5.8):** All buttons, tabs, inputs, and toggles have $\ge 44\text{px}$ effective touch dimension.
3. **Flex-Stack Rule:** Multi-column forms and grids collapse to 1 column on viewports $< 768\text{px}$.
4. **Table Protection:** All data tables are enclosed in touch-scrolling containers (`.table-responsive-wrapper`) with sticky headers or card adaptation.
5. **Sticky Nav Compressibility:** Sticky header shell cleanly shrinks on mobile without obstructing viewport space.
