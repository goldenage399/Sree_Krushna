---
pattern: contextual-multi-option-comments-engine
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/mobile-ui-engineering.md
    at: "Contextual Multi-Option Collaboration & In-Drawer Navigation"
  - file: .agent/workflows/post-incident-governance.md
    at: "Phase 3 Step 5 (Process Pattern Gate)"
triggers: []
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Contextual Multi-Option Comments Engine Architecture (`P-CONTEXTUAL-COMMENTS-001`)

**Category**: Architectural Design Pattern & Collaborative Ergonomics  
**Applies to**: Modular UI Primitives, Comments Engine, Shopping Registry, Decorator Cockpit, Candidate Visual Options, Multi-Surface Collaboration  
**Origin**: 2026-09-24 — Sree Krushna Marriage OS (SK-009 / `AC-DEC-2026-046` / `UI-DEC-2026-042` / `INC-097`)  
**Status**: VALIDATED (Implemented and verified across Shopping Registry and Decorator Cockpit)  

---

## Pattern — Contextual Multi-Option Comments Engine

### Problem
In multi-candidate visual selection interfaces (e.g. wedding shopping candidate looks, decorator mandap design options), commenting engines that key strictly to a single option identifier (`${entityId}_opt_${index}`) create an isolated context silo.
- Users inspecting Option 2 cannot see feedback or concerns raised on Option 1 or Option 3.
- Family and vendor discourse is inherently **comparative** (*"Look 1 has better embroidery, but Look 2 fabric is more comfortable for the summer daytime ritual"*). If posted on Look 1, stakeholders reviewing Look 2 never discover this crucial context.
- There is no aggregate view showing total feedback for the overarching attire or decor plate as a whole.
- Stakeholders cannot tag options naturally in text (`@Look 1`, `@Option 2`) to make remarks surface across referenced choices.

### Why It Happens
A naive flat entity-keying architecture (`storageKey = targetId`) assumes comments belong to exactly one isolated node in the UI. When visual alternatives (candidate looks, swatches, proposals) are added to an item, the naive integration simply appends an option index to the target key (`item123_opt_2`), fracturing what should be a unified multi-candidate conversation into disjoint, invisible silos.

### Solution

#### 1. Polymorphic Context Normalizer (`_resolveTargetContext`)
Accept both legacy string target keys (`TRS-BR-01_opt_1`) and modern structured context descriptors:
```javascript
const context = {
  entityId: 'TRS-BR-01',
  activeOptionIndex: 1,
  options: [
    { index: 0, label: 'Concept (Berhampuri)' },
    { index: 1, label: 'Look 2 (Utkalika Handloom)' },
    { index: 2, label: 'Look 3 (Antique Zari)' }
  ],
  title: 'Vivaha Patta',
  sub: 'Shopping Registry • Bridal Saree',
  alignment: '✨ Open for Family Remarks'
};
```
If a legacy string is passed, parse `_opt_` automatically to construct `{ entityId, activeOptionIndex }` without breaking backward compatibility.

#### 2. In-Drawer Option Scope Navigation Strip (`.sk-drawer-option-nav`)
Position a compact, horizontally scrolling pill navigation strip immediately below the drawer header:
```
[🌐 All Looks (5)]  [🖼️ Look 1 (2)]  [🖼️ Look 2 (3)]*  [🖼️ Look 3 (0)]
```
- Tapping `[🌐 All Looks]` displays the aggregated conversation across all candidate options, with dynamic look badges (`Look 1`, `Look 2`) indicating context.
- Tapping a specific look filters the stream to remarks made on that look OR tagged with that look.

#### 3. Cross-Option Natural Language Mention Scanner
An off-thread regex scanner scans newly posted text:
```javascript
function extractOptionTags(text) {
  if (!text) return [];
  const regex = /@(look|option|opt)[-\s]*(\d+|all)/gi;
  const tags = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    const rawVal = match[2].toLowerCase();
    tags.add(rawVal === 'all' ? 'all' : `opt_${parseInt(rawVal, 10) - 1}`);
  }
  return Array.from(tags);
}
```
If a comment mentions `@Look 1`, it is automatically indexed into `targetTags: ['opt_0']` and surfaces whenever Look 1 is active.

#### 4. Deduplicated Item-Wide Aggregation
Querying `_getAllItemComments(entityId)` aggregates comments across all candidate keys (`${entityId}_opt_${idx}`) and global keys (`${entityId}_all`), deduplicating by comment ID:
```javascript
getCommentCount(target) {
  if (!target) return 0;
  if (typeof target === 'string' && !target.includes('_opt_')) {
    return this._getAllItemComments(target).length;
  }
  return (this.comments[target] || []).length;
}
```
Cards in the parent catalog query `getCommentCount(item.id)` to show the total conversation count, ensuring family members never miss remarks on alternative looks.

### Failure Mode
1. **Unbounded File Growth**: Expanding the comments primitive engine beyond 500 lines violates `STD-MOD-COMP-001`. Fix: Keep context normalizers and regex tokenizers compact (<45 lines total).
2. **Duplicate Rendering in Aggregated Stream**: Merging arrays from multiple option keys without ID deduplication causes duplicate cards if a comment has multiple tags. Always use `Set(seenIds)`.
3. **Broken Backward Compatibility**: Calling `openCommentsDrawer('DEC-01')` without an options array fails if the engine assumes `options` is always populated. Fallback gracefully to legacy string mode.

### Task-Dashboard Instance
- `ui_primitives/scripts/comments_engine.js`: Polymorphic context ingestion, `@Look N` tokenizer, deduplicated `_getAllItemComments()`, under 500 lines (498 lines).
- `ui_primitives/components/comments_drawer.html` & `03_comments_drawer.css`: `#skCommentsOptionNav` strip and composer scope dropdown (495 lines).
- `shopping_src/scripts/controller.js`: Pass `options` array from active and candidate looks in `openItemRemarks()`.
- `cockpit_src/scripts/controller.js`: Pass decor plate visual alternatives in `openDecorRemarks()`.
