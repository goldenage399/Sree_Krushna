---
pattern: collab-visual-intake-and-deep-link-sharing
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/post-incident-governance.md
    at: "Phase 3 / Process Pattern Gate"
triggers: []
guard: ""
portability: universal
canonical_source: sree-krushna-marriage-os
porting_effort: low
---

# Tri-Modal Visual Ingestion and Collaborative Deep-Link Sharing Pattern

**Category**: Process / Interaction Design Gate  
**Applies to**: Visual procurement modules, shopping registries, decorator cockpits, multi-stakeholder approval interfaces, catalog inspection SPAs  
**Origin**: 2026-09-24 — Sree Krushna Marriage OS Shopping & Decorator Modules (Council Decision AC-DEC-2026-035)  
**Status**: VALIDATED  

---

## Pattern — Tri-Modal Visual Ingestion and Collaborative Deep-Link Sharing

### Problem
In multi-stakeholder wedding procurement and physical design (such as bridal trousseau, liturgical attire, and marquee decor elements), family members, coordinators, bride, and groom collaborate across fragmented communication channels (WhatsApp chats, physical showroom smartphone photos, Pinterest mood boards, web URLs). 

When procurement or decor dashboards treat catalog items as monolithic, single-image static entities:
1. Stakeholders cannot visually compare alternative fabric shades, embroidery finishes, or decor layout proposals (Option A vs Option B vs Option C) for a given catalog item or zone.
2. When a stakeholder finds inspiration on Pinterest or takes a photo in a physical market/showroom, they have no frictionless way to attach that preference to the canonical item without asking a developer to edit static data.
3. If users paste raw Pinterest web page URLs (e.g. `https://pin.it/...` or `https://www.pinterest.com/pin/...`), embedding them directly into HTML `<img>` tags fails due to HTTP 403 hotlink protection or CORS cross-origin iframe blocks.
4. When sharing a specific option via WhatsApp, naive link sharing either loses the active option selection, fails to deep-link to the item, or loses responsive context on mobile viewports.

### Why it happens
1. **Single-Asset Schema Trap**: Legacy models store a single string field (`image: "path.jpg"`). Supporting multiple options requires an options array where each option has its own label, image URL, provenance, and vote tally.
2. **CDN Domain vs HTML Page Conflation**: Pinterest pin URLs point to dynamic HTML web applications, not raw raster image assets (`i.pinimg.com/...`). Without automatic client-side or regex normalization, user-submitted links render as broken images.
3. **Decoupled URL State Machine**: User interactions (such as switching tabs, clicking option pills, or selecting an active option) often mutate only local in-memory JavaScript variables. Without bidirectional reflection into `window.location.search` (`?item=ITM-001&option=1`), executive quick-share links strip away the user's intent.
4. **Lexical Scope Shadowing during URL Query Parsing**: As uncovered in INC-094, extracting deep-link parameters for both parent clusters and child items within the same function scope often leads to accidental duplicate variable declarations (`const paramOption = ...`) that can break the script before execution.

### Solution
Implement the 4-layer Tri-Modal Visual Ingestion & Collaborative Sharing Architecture:

1. **Tri-Modal Ingestion Pipeline**:
   Provide a unified modal intake interface (`ui_primitives/components/option_intake_modal.html`) supporting three input modalities:
   - **Showroom Local Photos**: Bundled or uploaded photo paths in `/assets/<module>/...` (e.g. `./assets/shopping/haldi_saree_0.jpg`).
   - **Pinterest Web & CDN Normalization**: Detect Pinterest links (`pinterest.com`, `pin.it`, `pinimg.com`) and automatically normalize them:
     - Direct Pinterest CDN links (`https://i.pinimg.com/.../XYZ.jpg`) are accepted as high-resolution assets.
     - Web pin URLs (`pinterest.com/pin/12345/`) provide inline visual instructions guiding users to right-click/long-press "Copy Image Address" to obtain the CDN media URL (`i.pinimg.com`).
   - **Direct Web Image Links**: Any HTTPS image URL (`.jpg`, `.jpeg`, `.png`, `.webp`) from boutique catalogs or vendor portfolios.

2. **Option Pod Multi-Image Container**:
   Instead of a static card image, render an interactive Option Pod container:
   - Dynamic option thumbnail strip / carousel underneath the primary hero image.
   - Distinct Option Badges (`Option A`, `Option B (User Suggested)`, `Option C`).
   - Active Option Indicator with checkmark badge (`Active Selection`).
   - Add Option CTA pill (`+ Add Preference / Pinterest Link`) opening the intake modal scoped to that specific item (`#skOptionItemId`).

3. **Bidirectional Deep-Linking & WhatsApp Executive Quick-Share**:
   - URL parameter structure: `?item=<ITEM_ID>&option=<OPTION_INDEX>&view=<VIEW_MODE>`.
   - On load, parse URL query parameters. If `item` and `option` are present:
     - Automatically switch to the item's tab/cluster.
     - Scroll the item card into view (`scrollIntoView({ behavior: 'smooth', block: 'center' })`).
     - Set the active option index to the specified option and highlight the option pod.
   - When any stakeholder taps the WhatsApp Share button, the controller serializes the exact deep-link including item and active option:
     `https://<domain>/shopping-registry.html?item=ITM-001&option=1`
   - WhatsApp message copy clearly names the item, selected option name/source, and provides the direct deep-link.

4. **Real-Time Cloud Persistence & Offline Local Fallback**:
   - Firestore schema overlay: Attach an `options` array (`label`, `url`, `notes`, `source`, `addedAt`) and `selectedOptionIndex` to the item record (`shopping_items` or `decor_topics`).
   - Guarded by Firestore security rules (`isValidShoppingItemOverlay`).
   - When offline or unauthenticated, persist options to `localStorage` so user suggestions survive page reloads and can be synced once connected.

### Failure Mode
- **Unvalidated Pinterest URLs**: Pasting an arbitrary web page link without URL validation creates broken image cards. The intake modal must sanitize and test the URL format before appending.
- **URL Parameter Scope Collision**: Re-declaring `paramOption` or `paramItem` across different nested conditional blocks in the same function scope causes a fatal `SyntaxError` (prevented by SDCA pre-emit syntax gate, see INC-094).
- **Accessibility & Modal Trapping**: Failure to provide 3-trigger modal dismissibility (Escape key, backdrop click, close button) will trap mobile users when opening the intake dialog.

### Task-Dashboard / Sree Krushna Instance
- Architecture Council Decision: `User_Created/Discussion Threads/Council/260924_arch_council_pinterest_intake_and_collaborative_visual_sharing.md` (`AC-DEC-2026-035`).
- Intake Modal Primitive: `ui_primitives/components/option_intake_modal.html` (`#skOptionModal`, `#skOptionItemId`, `#skOptionUrl`).
- Styling: `shopping_src/styles/08_collab_options_and_sharing.css` (172 lines, `<500` limit).
- Script Controller: `shopping_src/scripts/controller.js` (`getItemImages`, `getActiveOptionIndex`, `window.selectItemOption`, `window.shareItemOption`, `initUrlDeepLinkHandling`).
- Test Suite: `scripts/test-shopping-registry.cjs` (Phase 6 Collaborative Option Pods & Deep-Link Sharing tests).

---

## Anti-Pattern — Monolithic Single-Asset Visual Disconnect

### What it is
Treating physical wedding goods or stage decor concepts as single immutable images hardcoded in JSON data files, forcing all stakeholder discussions and photo shares into external, untracked chat threads.

### Symptoms
1. Stakeholders text photos into WhatsApp groups with questions like "What about this instead?", but nobody knows which catalog item it corresponds to.
2. The shopping or decor dashboard becomes outdated because it only shows the initial catalog guess, not the family's preferred options.
3. High friction when family members want to show Pinterest inspirations: they have to explain verbally rather than attaching the pin directly to the item.
4. Deep-links only lead to the generic page, requiring the recipient to manually search and ask which item was being referenced.

### Why it fails
Physical wedding choices are iterative and consensus-driven. Restricting an item to a single hardcoded image assumes unilateral decision-making, which breaks down during family consultations.

### Correction
Adopt `P-COLLAB-VISUAL-INTAKE-001`: Render multi-option pods with tri-modal ingestion (showroom photos, Pinterest CDN links, web images) and bidirectional option deep-links.
