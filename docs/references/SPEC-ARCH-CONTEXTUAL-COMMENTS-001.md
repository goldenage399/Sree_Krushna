# SPEC-ARCH-CONTEXTUAL-COMMENTS-001: Two-Tier Contextual Multi-Option Comments Engine & Collaborative Tagging

<details>
<summary>🔑 FKL Item Header (FKL-DI-023)</summary>

```yaml
---
fkl_id: FKL-DI-023
fkl_type: DesignInvariant
source:
  - docs/incidents/INC-097-comments-engine-context-silo-and-cross-option-isolation.md
  - User_Created/Discussion Threads/Council/260924_arch_council_contextual_multi_option_comments_architecture.md
  - AC-DEC-2026-046
  - UI-DEC-2026-042
  - WT-02
  - WT-06
promoted_from: ""
applies_to:
  - CommentsDrawerPrimitive
  - ShoppingRegistry
  - DecoratorCockpit
  - OptionNavStrip
workflow_activation:
  - WT-02
  - WT-06
  - WT-09
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-CONTEXTUAL-COMMENTS-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-AL-007)</summary>

```yaml
---
fkl_id: FKL-AL-007
fkl_type: ArchitecturalLearning
source:
  - docs/incidents/INC-097-comments-engine-context-silo-and-cross-option-isolation.md
  - SK-009
  - P-CONTEXTUAL-COMMENTS-001
promoted_from: ""
applies_to:
  - CommentsEngineCore
  - NaturalLanguageMentionTokenizer
  - MultiKeyAggregator
workflow_activation:
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-CONTEXTUAL-COMMENTS-001.md
---
```
</details>

---

## 1. Architectural Motivation & Context

In collaborative wedding platforms, attire and decor selection processes require multi-candidate evaluations. When reviewing a wedding saree or mandap setup, stakeholders (Bride, Groom, Sisters, In-Laws, Elders) compare 2 to 6 candidate looks simultaneously.

Prior to `SK-009`, comments and reactions were keyed strictly to a single isolated option key (`${entityId}_opt_${optionIndex}`). This introduced three major failure modes:
1. **The Context Silo Defect**: When a stakeholder opened remarks on Look 2, comments posted on Look 1 or Look 3 were completely invisible.
2. **The Comparative Wedding Discourse Gap**: Real family discourse is inherently comparative (*"Option 1 fabric is better for rituals, but Option 2 zari matches the veil"*). Keying feedback to only one option hid comparative advice from anyone reviewing the other options.
3. **Missing Cross-Option Mentions**: Users had no mechanism to mention multiple looks in one comment (e.g. `@Look 1`, `@Option 2`) and have the remark appear across all referenced candidate options.

---

## 2. Invariant Specifications

### 2.1 Invariant: Two-Tier Contextual Option Scope Navigation (`FKL-DI-023`)

All modal or slide-over comments drawers supporting candidate entities MUST provide an in-drawer option scope navigation bar (`#skCommentsOptionNav` / `.sk-drawer-option-nav`):
- Positioned immediately beneath the drawer title header.
- Features horizontal scroll overflow on mobile (`scrollbar-width: thin; -webkit-overflow-scrolling: touch;`).
- Always provides a `[🌐 All Looks (N)]` aggregate pill alongside numbered option chips (`[🖼️ Look 1 (n1)]`, `[🖼️ Look 2 (n2)]`).
- Switching scope updates active styling, filters the comments stream dynamically, and adjusts the composer's target selector without reloading the drawer.
- In `[🌐 All Looks]` view, each comment card must explicitly display a contextual look badge (`Look 1`, `Look 2`) to identify its reference point.

### 2.2 Invariant: Cross-Option Mention Tokenization & Deduplicated Aggregation (`FKL-AL-007`)

1. **Polymorphic Ingestion Contract**: `openComments(target, meta)` must transparently accept either a legacy string identifier (`TRS-BR-01_opt_1`) or a modern structured context descriptor:
   ```javascript
   {
     entityId: 'TRS-BR-01',
     activeOptionIndex: 1,
     options: [ { index: 0, label: 'Concept' }, { index: 1, label: 'Look 2' } ],
     title: 'Vivaha Patta',
     sub: 'Shopping Registry • Bridal Saree'
   }
   ```
2. **Mention Parsing**: Text submitted through the composer is scanned for option references using:
   `/@(look|option|opt)[-\s]*(\d+|all)/gi`
   Extracted tokens are normalized into `targetTags` (e.g. `['opt_0', 'opt_1']`).
3. **Deduplicated Multi-Key Aggregation**: Item-wide aggregation (`_getAllItemComments(entityId)`) collects remarks across `${entityId}_opt_${idx}` and `${entityId}_all`, deduplicating entries via a `Set` of comment IDs.
4. **Card-Level Aggregation**: Catalog cards must display the total aggregated comment count across all candidate looks (`window.SKPrimitives.getCommentCount(item.id)`), alerting users to active discussions even if they are currently viewing a different candidate look.

---

## 3. Structural Constraints & Modularity Compliance (`STD-MOD-COMP-001`)

To satisfy `STD-MOD-COMP-001`, all primitive implementation files must remain under 500 lines:
- `ui_primitives/scripts/comments_engine.js`: Strictly `<= 500 lines` (currently 498 lines).
- `ui_primitives/styles/03_comments_drawer.css`: Strictly `<= 500 lines` (currently 495 lines).
- `ui_primitives/components/comments_drawer.html`: Modular markup (94 lines).

---

## 4. Verification & Gate Compliance

Any modification to contextual comments must pass:
1. `npm run test:shopping`
2. `npm run test:cockpit`
3. `npm run verify:modular-architecture`
4. `npm run verify:ui-lifecycle`
5. `npm run verify:governance-wiring:all`
