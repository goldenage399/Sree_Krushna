# INC-097 — Comments Engine Context Silo, Single-Option Isolation & Missing Cross-Option Mentions

**Incident ID**: `INC-097`  
**Date**: `2026-09-24`  
**Severity**: Medium (Collaborative Communication Fracture / Context Silo / Comparative Discourse Omission)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `P-CONTEXTUAL-COMMENTS-001`, `AC-DEC-2026-046`, `UI-DEC-2026-042`, `SPEC-ARCH-CONTEXTUAL-COMMENTS-001.md`  
**Affected Components**: `ui_primitives/scripts/comments_engine.js`, `ui_primitives/components/comments_drawer.html`, `ui_primitives/styles/03_comments_drawer.css`, `shopping_src/scripts/controller.js`, `cockpit_src/scripts/controller.js`  
**Related Patterns**: `.agent/patterns/contextual-multi-option-comments-engine.md`, `.agent/patterns/collab-visual-intake-and-deep-link-sharing.md`  

---

## Architectural Surface Mapping

1. **UI Surface**: The `#skCommentsDrawer` primitive slide-over panel rendered isolated comments threads without indication of sibling candidate looks; card badges in Shopping and Decorator Cockpit showed comment counts only for the active option index.
2. **Data Surface**: Comments and reactions were keyed strictly to `${entityId}_opt_${optionIndex}` without item-level cross-indexing or tagging.
3. **Reactive Surface**: Clicking remarks on Look 2 hid comments made on Look 1 and Look 3. Users could not switch views inside the drawer without closing the drawer and reopening it from a different card element.
4. **Service Surface**: Real-time Firestore synchronization (`fsSetShoppingItemStatus`) wrote to single-option keys (`comments_${storageKey}`) without aggregated item-level rollup.
5. **Module Surface**: Lack of a polymorphic context normalizer forced callers to know internal key structures (`TRS-BR-01_opt_1`) rather than declaring semantic entity metadata.
6. **Governance Surface**: Ratified `AC-DEC-2026-046` / `UI-DEC-2026-042` (`P-CONTEXTUAL-COMMENTS-001`), scaffolded and executed `SK-009`, and codified `SPEC-ARCH-CONTEXTUAL-COMMENTS-001.md` (`FKL-DI-023` / `FKL-AL-007`).

---

## 1. Executive Summary & Symptoms

In wedding shopping and decor planning, decision-making is inherently **comparative**: stakeholders compare Look 1 vs. Look 2 vs. Look 3 side-by-side. 
However, prior to `SK-009`, the modular `CommentsEngine` keyed remarks strictly to a single option identifier (`${entityId}_opt_${index}`).

When family members inspected Look 2 in the Shopping Catalog or Mandap Plate 01 in the Decorator Cockpit:
1. They could **only see remarks left specifically on Look 2**. Any feedback, warnings, or vendor quotes posted on Look 1 or Look 3 were completely invisible.
2. If an elder posted: *"Look 1 fabric is too heavy, Look 2 is much better for the afternoon ritual"*, someone inspecting Look 2 never saw this comment.
3. Stakeholders could not naturally tag options in comments (`@Look 1`, `@Option 2`) to have their opinions appear across all referenced candidate options.
4. Item cards displayed a comments badge showing only the active look's comments (e.g. `0 Remarks`), even when sibling candidate looks had active family discussions.

---

## 2. Root Cause Analysis

### Step 1: Technical Anatomy
`CommentsEngine` was originally conceived for single decision steps (`DEC-01`). When candidate visual options were added (`SK-006` / `SK-007`), the engine integration simply appended `_opt_${optionIndex}` to the entity ID. This created fragmented, unlinked storage partitions:
```javascript
// Before SK-009: Fragmented Silos
comments['TRS-BR-01_opt_0'] = [ ... ]; // Look 1 remarks
comments['TRS-BR-01_opt_1'] = [ ... ]; // Look 2 remarks
// No cross-referencing, no aggregate queries, no multi-option context in drawer.
```

### Step 2: Escape Analysis
Automated smoke tests (`test:shopping`, `test:cockpit`, `verify:ui-lifecycle`) verified that the drawer opened, closed, and submitted comments without throwing runtime errors. They did not test comparative collaborative workflows or cross-option discoverability.

---

## 3. Resolution & Invariant Formulated

Under `AC-DEC-2026-046` / `UI-DEC-2026-042`, the **Two-Tier Contextual Comments Engine (`P-CONTEXTUAL-COMMENTS-001`)** was designed and implemented across 4 sequential phases under `SK-009`:

1. **Polymorphic Ingestion Contract**: `openComments(target, meta)` in `comments_engine.js` transparently accepts legacy string keys (`TRS-BR-01_opt_1`) or structured descriptors (`{ entityId, activeOptionIndex, options, title, sub }`).
2. **In-Drawer Option Scope Navigation Strip (`#skCommentsOptionNav`)**: A horizontal scrolling pill bar allows users to toggle between `[🌐 All Looks (N)]` and numbered option pills (`[🖼️ Look 1 (n1)]`, `[🖼️ Look 2 (n2)]`) directly inside the drawer.
3. **Cross-Option Natural Language Mention Scanner**: An in-memory regex tokenizer (`/@(look|option|opt)[-\s]*(\d+|all)/gi`) scans comment prose and indexes mentions into `comment.targetTags`, causing comments to surface whenever any referenced option is inspected.
4. **Deduplicated Item-Wide Aggregation**: `_getAllItemComments(entityId)` aggregates across all option partitions with ID-based deduplication (`Set`).
5. **Catalog Card Count Aggregation**: Item cards display `window.SKPrimitives.getCommentCount(item.id)`, showing total remarks across all candidate looks so users never miss sibling feedback.
6. **Strict SDCA Modularity (`STD-MOD-COMP-001`)**: `comments_engine.js` is 499 lines and `03_comments_drawer.css` is 495 lines, strictly maintaining the 500-line modular limit.

---

## 4. Verification & Prevention Gates

1. **Syntax Gate**: `node -c ui_primitives/scripts/comments_engine.js` exits 0.
2. **Modular Architecture Gate**: `npm run verify:modular-architecture` passes all 45 checks with 100% byte parity between root and `public/`.
3. **Dynamic Lifecycle Gate**: `npm run verify:ui-lifecycle` validates 3-trigger dismissibility (Close button, backdrop click, Escape keydown).
4. **Smoke Gates**: `npm run test:shopping` and `npm run test:cockpit` pass 100% green.
5. **Governance Wiring Gate**: `npm run verify:governance-wiring:all` verifies 190/190 artifacts fully wired.
