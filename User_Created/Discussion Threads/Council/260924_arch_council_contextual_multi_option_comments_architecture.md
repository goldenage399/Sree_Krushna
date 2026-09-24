# Architecture & UI Council Review: Contextual Multi-Option Comments Engine Architecture, Cross-Option Tagging & Comparative Review Model

**Session Date**: 2026-09-24  
**Ruling Reference**: `AC-DEC-2026-046` / `UI-DEC-2026-042`  
**Governing Standard**: `P-CONTEXTUAL-COMMENTS-001` / `STD-MOD-COMP-001`  
**Status**: ✅ **APPROVED & CERTIFIED**  
**Ledger Entry**: Entry 50 in [`User_Created/Discussion Threads/Council/Council_Ledger.md`](./Council_Ledger.md)  
**Associated Ticket**: `SK-009` (`enhancement-notes/SK-009/00_ENHANCEMENT_INDEX.md`)  

---

## 🌍 Grounding Snapshot (`RFG-001`)

- **Current Stage**: Pre-launch / Family Milestone Validation (Bhubaneswar Trousseau Procurement & Rayagada Decorator Finalization)
- **Active Real-User Cohort**: 4–5 core stakeholders (Groom/Host, Bride, Sister, Parents/In-Laws), expanding to ~30 during active shopping visits
- **Active Surfaces**: Shopping Registry (SDCA standalone + host tab), Decorator Cockpit (SDCA standalone + host tab)
- **Team Size**: 1 developer (pair programming with AI assistant)

---

## 1. Problem Statement & Baseline Ground Truth

### 1.1 The Context-Silo Defect in `CommentsEngine`
Following a zero-trust audit of [`ui_primitives/scripts/comments_engine.js`](../../ui_primitives/scripts/comments_engine.js) (L80–105, L185–205) and [`ui_primitives/components/comments_drawer.html`](../../ui_primitives/components/comments_drawer.html):

1. **Flat `optionId` Siloing**:
   - Comments and emoji reactions are keyed strictly to an opaque string `optionId` (e.g., `TRS-BR-01_opt_1` or `PLATE-01`):
     ```javascript
     this.comments = this._loadData(STORAGE_KEY_COMMENTS, SEED_COMMENTS);
     // Storage: { "TRS-BR-01_opt_0": [...], "TRS-BR-01_opt_1": [...] }
     ```
   - When a user taps `[💬 Remarks]` on Look 2, `openComments('TRS-BR-01_opt_1')` launches the drawer filtered strictly to `this.activeOptionId = 'TRS-BR-01_opt_1'`.
   - **Observable Defect**: Stakeholders inspecting Look 2 are completely blind to remarks left on Look 1 or Look 3. There is no affordance to see the overall consensus or dialogue across the entire item.

2. **The Comparative Wedding Discussion Gap**:
   - Real-life family decision-making is inherently **comparative**, not siloed:
     - *"Look 1 has authentic Berhampuri temple borders, but Look 2 from Kalamandir has lighter raw silk suited for the 4-hour havan."*
     - *"Option 1 is ₹45,000, Option 2 is ₹68,000. Let's shortlist Option 1 for morning and Option 2 for evening."*
   - If posted while viewing Look 1, family members viewing Look 2 never see this critical comparison.

3. **Absence of Option Tagging (`@Look-N` / `@Option-N`)**:
   - There is no parsing or aggregation engine to cross-link comments across multiple visual candidates. A comment comparing multiple options cannot surface across all referenced options.

---

## 2. Multi-Dimensional Option Evaluation

| Dimension | Option 1: Fragmented Multi-Thread (Independent Store per Look + Summary Tab) | Option 2: Unified Parent-Entity Document with Look Tags (`entityId` Anchor) | Option 3: Two-Tier Relational Sub-Collection Model (Firestore Architecture) | Hybrid Model (`AC-DEC-2026-046` / `P-CONTEXTUAL-COMMENTS-001`) |
| :--- | :--- | :--- | :--- | :--- |
| **Similarities** | All options seek to provide visibility into discussions across multiple candidate photos. | Shares parent entity anchoring. | Shares Firestore synchronization goals. | Unifies parent entity context, in-drawer tab switching, and cross-option mention tagging. |
| **Distinctions** | Keeps separate array per look and introduces an ad-hoc `_summary` thread. | Re-keys entire storage schema to `entityId`, breaking existing flat keys. | Creates nested Firestore collections `/items/{id}/options/{opt}/comments`. | **Polymorphic**: Transparently supports both legacy `entityId_opt_idx` strings AND structured `{ entityId, activeOptionIndex, options }` context objects. |
| **Trade-offs** | Causes conversational duplication and fragmented threads. | Requires breaking schema migration across all existing client localStorage keys. | Massive query overhead (N+1 queries against Firestore) violating Protocol 33. | Small in-memory parsing footprint (~35 lines of vanilla JS) with 100% backward compatibility. |
| **Dependencies** | None. | Requires data migration script. | Depends on complex Firestore rules rewrites and index updates. | Contained to `ui_primitives/scripts/comments_engine.js` and `comments_drawer.html`. |
| **Impact Radius** | Medium (Requires modifying shopping and cockpit callers to manage summary keys). | High (Invalidates existing seeded and saved comments). | Very High (Backend Firestore rules, permissions, and network I/O). | Low (Zero schema disruption, zero breaking changes to existing callers). |
| **Complexity** | Medium (Managing split arrays). | Medium (Normalization logic). | High (Complex async fan-out). | Low (Single-pass regex parser + client-side filter array). |
| **Risks** | Split attention and orphaned summary threads. | Breaking existing live comments during migration. | Firestore quota blowouts and network latency on slow mobile connections. | Minor drawer header vertical expansion (controlled via compact tab strip). |
| **Architectural Implications** | Weakens modular primitive cohesion. | Clean schema but disruptive. | Violates `RFG-001` (over-engineering for a 4–5 user app). | Upholds `STD-MOD-COMP-001` (<500 lines per module) and `RFG-001`. |

---

## 3. Multi-Disciplinary Council Member Evaluations

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Finding**: `ui_primitives/scripts/comments_engine.js` is the canonical implementation of `AC-DEC-2026-021` (Collaborative Options and Comments Model).
- **Ruling**: Evolving `CommentsEngine` to support hierarchical context (`entityId` + `optionIndex`) directly realizes the architectural vision defined in `PROP-20260915-collaborative-options-and-comments-model.md` without fragmenting the codebase.

### 3.2 Schema & Firestore Auditor (`firebase-firestore`)
- **Finding**: Option 3 (relational subcollections) violates Protocol 33 (O(1) I/O rule) by generating fan-out queries whenever an item is inspected.
- **Ruling**: Retaining document-level sync under `shopping_items` (or `cockpit_content`) with a unified `comments` map allows O(1) single-document reads while supporting rich client-side tagging.

### 3.3 Service Layer & Shared Primitive Integrity Auditor (`cos-invoke`)
- **Finding**: `ui_primitives/scripts/comments_engine.js` has 403 lines. Adding contextual option tabs and regex parsing must not breach the strict 500-line modular limit (`STD-MOD-COMP-001`).
- **Ruling**: Implement the polymorphic context parser (`_parseContext(id)`) and mention scanner in under 50 lines of clean vanilla JavaScript, keeping `comments_engine.js` safely at ~445 lines.

### 3.4 Maintainability & Velocity Auditor (`ponytail` / `RFG-001`)
- **Burden of Proof**: A family wedding app requires frictionless communication. If an aunt or sister types *"Option 1 is better than Option 2"*, that comment must automatically show up when either option is viewed.
- **Verdict**: The Hybrid Model delivers this with zero external libraries and zero backend migrations.

### 3.5 The Dissenter Seat (UX Cognitive Load & Visual Clutter Challenge)
- **Challenge**: Adding an option navigation strip, general comments tab, and tagging dropdown to the comments drawer risks overcrowding an already dense mobile side-drawer (which already has stakeholder filter pills, emoji reactions, and visibility toggles).
- **Resolution**:
  1. Position the **Option Context Strip** directly under the drawer title as a compact, horizontal scrolling pill list (`[🌐 All Looks (5)]`, `[🖼️ Look 1 (2)]`, `[🖼️ Look 2 (3)]`).
  2. Keep stakeholder filter pills and reaction counters collapsed by default or stacked cleanly.
  3. Autotagging uses natural text typing (`@Look 1`, `@Look 2`) rather than complex multi-select UI widgets.

---

## 4. The Certified Hybrid Architecture (`P-CONTEXTUAL-COMMENTS-001`)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SKCommentsDrawer Primitive                      │
├────────────────────────────────────────────────────────────────────────┤
│  [Header] 👑 Vivaha Patta (TRS-BR-01)                      [✕ Close]   │
│           Bridal Handloom Saree — Bhubaneswar Procurement              │
├────────────────────────────────────────────────────────────────────────┤
│  [Option Scope Strip] (P-CONTEXTUAL-COMMENTS-001)                      │
│  [🌐 All Looks (5)]  [🖼️ Look 1 (2)]*  [🖼️ Look 2 (3)]  [🖼️ Look 3 (0)]  │
├────────────────────────────────────────────────────────────────────────┤
│  [Reactions]  ❤️ 4    👍 3    🤔 1    🚫 0                             │
├────────────────────────────────────────────────────────────────────────┤
│  [Role Filters]  All (5) | 👰 Bride | 👭 Sisters | 🎁 In-Laws | 👑 Host  │
├────────────────────────────────────────────────────────────────────────┤
│  [Comments Stream]                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 👰 Sree (Bride)  • Today 09:15 AM               [Look 1: Utkalika]│  │
│  │ "The temple border is gorgeous! Utkalika has 3 fresh handlooms." │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 👭 Aparna (Sister) • Today 11:30 AM             [@Look 1 & @Look 2]│ │
│  │ "@Look 1 has better zari, but @Look 2 fabric is much softer!"     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  [Sticky Composer]                                                     │
│  Posting as: [👰 Bride ▾]  |  Target: [🖼️ Look 1 (Click to change) ▾]  │
│  [ Textarea: "Share thoughts or tag @Look 2 to compare..."        ]    │
│  [💬 Post Remark]                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Polymorphic Context Ingestion Contract
```javascript
// comments_engine.js: Backwards-compatible context resolution
_resolveTargetContext(target, meta = {}) {
  if (typeof target === 'object' && target !== null) {
    return {
      entityId: target.entityId || 'ENTITY',
      activeOptionIndex: Number.isInteger(target.activeOptionIndex) ? target.activeOptionIndex : null,
      options: Array.isArray(target.options) ? target.options : [],
      title: target.title || meta.title || 'Discussion',
      subtitle: target.subtitle || meta.subtitle || ''
    };
  }
  // Legacy string format: 'TRS-BR-01_opt_1' or 'PLATE-01'
  const match = String(target).match(/^(.+)_opt_(\d+)$/);
  if (match) {
    return {
      entityId: match[1],
      activeOptionIndex: parseInt(match[2], 10),
      options: [],
      title: meta.title || match[1],
      subtitle: meta.subtitle || ''
    };
  }
  return {
    entityId: String(target),
    activeOptionIndex: null,
    options: [],
    title: meta.title || String(target),
    subtitle: meta.subtitle || ''
  };
}
```

### 4.2 Cross-Option Mention Parser (`@Look N` / `@Option N`)
```javascript
function extractOptionTags(text) {
  const tags = new Set();
  const regex = /@(look|option|opt)[-\s]*(\d+|all)/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const val = match[2].toLowerCase();
    tags.add(val === 'all' ? 'all' : `opt_${parseInt(val, 10) - 1}`);
  }
  return Array.from(tags);
}
```

---

## 5. Sequential Implementation Roadmap (`SK-009`)

- **Phase 1: Ingestion Engine & Polymorphic Context Normalizer** (`ui_primitives/scripts/comments_engine.js`)
  - Implement `_resolveTargetContext` supporting both legacy string keys and rich context objects.
  - Implement mention scanner extracting `@Look N` tags.
- **Phase 2: In-Drawer Option Scope Navigation & Filter State** (`ui_primitives/components/comments_drawer.html` + `03_comments_drawer.css`)
  - Add `.sk-drawer-option-nav` strip below drawer header.
  - Render `[🌐 All Looks]` pill alongside numbered candidate look pills with dynamic comment counts.
  - Add tag pill badges on comment cards in aggregated view.
- **Phase 3: Shopping Registry & Decorator Cockpit Integration**
  - Update `shopping_src/scripts/controller.js` to pass rich context object with all available candidate options to `SKPrimitives.openComments()`.
  - Update `cockpit_src/scripts/controller.js` to pass decor plate options context.
- **Phase 4: SDCA Recompilation & Verification Gate**
  - Run `node shopping_src/build.cjs --all` and `node cockpit_src/build.cjs --all`.
  - Run all 6 automated verification suites with 100% byte parity.

---

## 6. Council Certification

| Council Seat | Member / Sourced Standard | Verdict |
| :--- | :--- | :--- |
| **SSOT Authority** | `ssot-reconciliation` | ✅ **APPROVED** |
| **Schema & Firestore** | `firebase-firestore` / Protocol 33 | ✅ **APPROVED** |
| **Service Layer Integrity** | `cos-invoke` / `STD-MOD-COMP-001` | ✅ **APPROVED** |
| **Dependency & Impact** | `change-impact-analysis` | ✅ **APPROVED** |
| **Maintainability (RFG-001)** | `ponytail` | ✅ **APPROVED** |
| **UI/UX Craft Auditor** | `impeccable` | ✅ **APPROVED** |
| **Dissenter Seat** | Mobile Cognitive Load Advocate | ✅ **RESOLVED & CERTIFIED** |
