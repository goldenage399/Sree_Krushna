# SK-009: Contextual Multi-Option Comments Engine Architecture & Cross-Option Tagging

## 📊 Metadata

- **Category**: FEATURE / REFACTOR
- **Priority**: HIGH
- **Status**: IMPLEMENTED
- **Estimate**: 5 hours
- **Target Release**: v2.4.0
- **Risk Level**: LOW
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-007  # Candidate Look Lifecycle, 30-Day Trash & Comments Primitive Integration
  related:
    - AC-DEC-2026-021  # Collaborative Options & Comments Model
    - AC-DEC-2026-040  # Candidate Look Lifecycle & Comments
    - AC-DEC-2026-041  # Modular Comments Primitive Reusability
    - AC-DEC-2026-045  # Candidate Looks Ergonomics & Ingestion
    - AC-DEC-2026-046  # Contextual Multi-Option Comments Engine Architecture (P-CONTEXTUAL-COMMENTS-001)
  blocks:
    - None
```

---

## 🎯 Goal

Resolve the context-silo defect in `CommentsEngine` (`ui_primitives/scripts/comments_engine.js`) by upgrading the flat `optionId` storage/retrieval model into an item-aware, multi-option comparative review architecture. Stakeholders inspecting candidate looks in the Shopping Registry or Decorator Cockpit can seamlessly toggle between individual candidate look remarks and aggregated item-level discussions (`[🌐 All Looks]`), tag specific choices using natural language (`@Look 1`, `@Option 2`), and compose comparative remarks that automatically surface across all referenced visual options.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Ingestion Engine & Polymorphic Context Normalizer (`ui_primitives/scripts/comments_engine.js`)
- [x] **Polymorphic Ingestion Contract**: Implement `_resolveTargetContext(target, meta)` transparently accepting both legacy string IDs (`TRS-BR-01_opt_1`) and structured context descriptors (`{ entityId, activeOptionIndex, options, title, subtitle }`).
- [x] **Mention & Tagging Scanner**: Implement `extractOptionTags(text)` parsing `@(look|option|opt)[-\s]*(\d+|all)` tokens to auto-index cross-option mentions.
- [x] **Dual-Key Retrieval Engine**: Support querying remarks by specific option index (`opt_1`), parent entity (`entityId`), or cross-option mentions (`targetTags.includes(activeOption)`).
- [x] **Syntax & Modularity Verification**: Verify `comments_engine.js` passes `node -c` and remains strictly under 500 lines (`STD-MOD-COMP-001`).

### Phase 2: In-Drawer Option Scope Navigation & Filter State (`ui_primitives/`)
- [x] **Option Scope Strip**: Inject `.sk-drawer-option-nav` strip below drawer header in `ui_primitives/components/comments_drawer.html`.
- [x] **Dynamic Tab Generation**: Render `[🌐 All Looks (N)]` alongside numbered option chips (`[🖼️ Look 1 (n1)]`, `[🖼️ Look 2 (n2)]`) with dynamic count badges.
- [x] **Composer Target Selector**: Provide active scope pill in composer: `"Commenting on: [🖼️ Look 1 (Change)]"`.
- [x] **Compact Responsive Styling**: Add drawer styles in `ui_primitives/styles/03_comments_drawer.css` (<500 lines) with horizontal touch-scroll on mobile.

### Phase 3: Shopping Registry & Decorator Cockpit Integration
- [x] **Shopping Registry Caller**: Update `shopping_src/scripts/controller.js` to pass full item context (including candidate image labels and thumbnails) to `window.SKPrimitives.openComments()`.
- [x] **Decorator Cockpit Caller**: Update `cockpit_src/scripts/controller.js` to pass decor plate candidate options context.
- [x] **Card Badge Aggregation**: Display aggregated comment counts (`[💬 N Remarks]`) on item cards representing total remarks across all candidate looks.

### Phase 4: SDCA Recompilation & Binary Byte Parity
- [x] **SDCA Recompilation**: Rebuild via `node shopping_src/build.cjs --all` and `node cockpit_src/build.cjs --all`.
- [x] **Binary Byte Parity**: Verify 100% byte parity (`fc.exe /b`) between root and `public/` files.
- [x] **Automated Verification Suites**: Pass `npm run test:shopping`, `npm run test:cockpit`, `npm run verify:modular-architecture`, `npm run verify:ui-lifecycle`, `npm run verify:deployment`, and `npm run verify:governance-wiring:all`.

---

## 🚦 Binary Validation Gates (VG) & Decision Nodes (DN)

- **VG-1**: `node -c ui_primitives/scripts/comments_engine.js` exits 0 AND line count is ≤ 500 lines.
  - *DN-1*: If lines > 500, compact internal helper functions before proceeding to Phase 2.
- **VG-2**: Headless DOM test verifies `.sk-drawer-option-nav` renders correctly with active state and count badges.
  - *DN-2*: If counts fail to update dynamically, trace `_loadData` aggregation logic.
- **VG-3**: Clicking `[💬 Remarks]` from Shopping card opens drawer with all candidate look pills rendered.
  - *DN-3*: If pills missing, verify `options` array passed in caller metadata.
- **VG-4**: `npm run verify:modular-architecture` and `npm run test:shopping` pass 100% green with 0 errors.
  - *DN-4*: If byte parity fails, re-run SDCA compiler with `--all`.
