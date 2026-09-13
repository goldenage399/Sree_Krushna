# 🏛️ Architecture & UI Council Certified Ruling: Decor Generative Prompt Catalog, Tweak Matrix & In-Cockpit Clipboard Engine
**Document ID**: `AC-DEC-2026-009` / `UI-DEC-2026-005`  
**Date**: 2026-09-13  
**Status**: APPROVED & CERTIFIED  
**Conveners**: Architecture Council & UI/UX Council (featuring `/impeccable` as Core Craft Auditor)  
**Governing Documents**: `SPEC-PROC-DECOR-MARQUEE-001`, `COUNCIL-CHARTER.md`, `.agent/skills/prompt-clarity/SKILL.md`

---

## 1. Context & Problem Statement

Following the successful deployment of the authentic Vedic Indian wedding decor visual lookbook in Decorator Cockpit v2.5, the executive procurement team required full transparency and reusability of the generative AI prompts that produced the 8 architectural plates (`PLATE-01` through `PLATE-08`). Specifically:
1. **Prompt Portability**: The prompts must be documented in structured Markdown with image tags so they can be copied, tweaked, and re-run in image generation models (Midjourney, DALL-E, Imagen).
2. **Vendor Collaboration**: The prompts must serve as a clear design brief for physical decorators and 3D visualizers to align on colors, lighting temperatures, and materials.
3. **Ergonomic Friction**: Leaving the live negotiation cockpit to open external files during meetings disrupts operational cadence; prompts should also be directly accessible inside the web application UI.

---

## 2. Comparative Evaluation of Available Options

| Dimension | Option A: SSOT Markdown Catalog (`04_PROCUREMENT_VENDORS/`) | Option B: Vendor Brief Dossier (`User_Created/Discussion Threads/`) | Option C: In-Cockpit UI Copy Button Only | Option D (Certified Hybrid): 3-Layer Unified System |
|---|---|---|---|---|
| **SSOT Governance** | Full Spoke-and-Wheel compliance | Discussion thread only | Client JS memory only | **Complete**: Anchored in `04_PROCUREMENT_VENDORS/` SSOT |
| **Vendor Usability** | Technical & structured | Conversational & narrative | Not shareable offline | **Dual**: Both formal SSOT & conversational vendor brief |
| **Meeting Ergonomics** | Requires markdown viewer | Requires document sharing | Instant 1-click clipboard copy | **Instant**: In-app 1-click copy + toast feedback |
| **Tweak Guidance** | Systematic token matrix | General notes | None | **Exhaustive**: Parametric matrices for Midjourney/DALL-E |
| **Risk of Drift** | Low | Medium | Low | **Zero**: Tied directly to `registry.json` and asset files |

---

## 3. Architecture Council Certified Ruling (`AC-DEC-2026-009` / `UI-DEC-2026-005`)

The Councils unanimously certify a **3-Layer Unified Prompt Delivery Architecture**:

### Layer 1: Canonical Procurement SSOT Prompt Catalog (`P-SSOT-DOCS`)
- Location: `04_PROCUREMENT_VENDORS/decor_and_design/DECOR_IMAGE_PROMPT_CATALOG.md`
- Conforms to repository Spoke-and-Wheel documentation standards (`parent_hub: 04_PROCUREMENT_VENDORS/HUB.md`).
- For each plate (`PLATE-01` through `PLATE-08`):
  1. Identifiers, Zone, Physical Specifications, and Dimensions.
  2. Local image preview tag: `![Plate Title](../../public/assets/decor/...jpg)` and relative link.
  3. Verbatim generative prompt in a fenced code block with single-click copyability.
  4. Camera, Lens, and Lighting parameters (`3200K` warm amber, `24mm` architectural wide, `85mm` portrait).
  5. Modular Tweak Matrix providing concrete substitution keywords for:
     - Time of Day (Golden Hour Afternoon vs Midnight Ceremony)
     - Floral Style (Traditional Marigold/Jasmine vs Modern Pastel Rose/Peony)
     - Palette Saturation (Royal Amber & Crimson vs Regal Ivory & Gold)
     - Structural Scale (Intimate Altar vs 10,000 sq. ft. Royal Pavilion)

### Layer 2: Vendor Collaboration Design Brief
- Location: `User_Created/Discussion Threads/DecoratorDiscussion/260913_Decor_Image_Prompts_And_Visual_Brief.md`
- Formatted as a presentation-ready creative brief for decorators, set fabricators, and 3D visual artists.

### Layer 3: Interactive In-Cockpit Clipboard Engine (`COCKPIT-CLIPBOARD-AFFORDANCE`)
- Embedded directly inside `public/decorator-cockpit.html` and `decorator-cockpit.html`:
  1. **Fullscreen Lightbox Drawer**: Tactile **"📋 Copy Prompt"** button alongside "✏️ Custom / Pinterest URL".
  2. **Custom Photo Modal**: Expandable **"💡 View Original AI Prompt"** accordion displaying the prompt in a monospace block with an instant copy action.
  3. **Visual Feedback**: Non-blocking toast notification (*"✓ Prompt copied to clipboard!"*) styled with `--accent-gold` tokens.

---

## 4. Verification & Sign-Off

- **UI Craft Auditor (`impeccable`)**: PASS — In-cockpit clipboard affordances preserve layout elegance and provide instantaneous haptic/visual feedback.
- **Systems Architecture**: PASS — Zero-dependency architecture preserved; offline asset resilience and repo SSOT integrity maintained.
- **Compliance Gates**: Verified through `npm run verify:deployment` and `npm run test:smoke`.
