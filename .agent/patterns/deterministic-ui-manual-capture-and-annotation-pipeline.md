---
pattern: deterministic-ui-manual-capture-and-annotation-pipeline
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
canonical_source: ug-farmhouse
porting_effort: low
---

# Deterministic UI Manual Capture and Annotation Pipeline

**Category**: Process / Methodology & Design Gate  
**Applies to**: UI Manual documentation, feature releases, visual testing across all tiers (`UG-Farmhouse`, `QSR`, `Task-Dashboard`, `PIOperationsMgmt`)  
**Origin**: 2026-08-21 — Development of the cross-repo `ui-manual-capture` suite  
**Status**: VALIDATED (Tested and verified across both `UG-Farmhouse` and `QSR` DO-PKOS engines)

---

## Pattern — Deterministic UI Manual Capture & Annotation

### Problem
Visual user manuals rot rapidly when screenshots must be taken manually. Common failure modes:
1. **Flaky Diffs**: Minor font smoothing, blinking carets, or unfinished CSS transitions create false-positive diffs, causing whole-image re-writes.
2. **Context Loss**: Microscopic crops of isolated buttons lack surrounding context (toolbars, headers, parent containers), making them unhelpful to end users.
3. **DOM Layout Corruption**: Injected callout badges/borders directly inside target elements disrupt flexbox/grid coordinates and cause layout shifts.
4. **Boundary Clipping**: Hardcoded or unclamped crop rectangles exceed viewport bounds or clip badge glow effects near window edges.

### Why it Happens
Naive screenshot scripts grab elements directly without waiting for CSS transition completion, mutate target DOM hierarchies, and compute crop math without clamping to origin coordinates.

### Solution
Follow the 6-pillar deterministic capture architecture implemented in `tools/ui-manual-capture/`:
1. **Declarative Per-Repo Config (`ui-manual.config.json`)**: Separate target selectors, actions, context padding, and sync commands from the core engine.
2. **Clamped Origin Math**: Clamp `x` and `y` first (`Math.max(0, ...)`), then derive `width` and `height` from clamped values to guarantee crop bounds stay strictly inside `[0, viewport.width]` and `[0, viewport.height]`.
3. **Padding Split (Raw vs. Annotated)**:
   - `rawClip`: Uses configured `contextPadding` as-is with no minimum.
   - `annotatedClip`: Enforces `Math.max(24, contextPadding)` on all 4 sides to contain callout badges and glow effects.
4. **Zero-DOM-Mutation Badging**: Append callout badges (`#__capture_badge__`) directly to `document.body` with fixed viewport integer coordinates (`Math.round(rect.top - 14)`, `Math.round(rect.left - 14)`), leaving target element layout 100% untouched.
5. **Deterministic Diffing**:
   - Inject `*, *::before, *::after { caret-color: transparent !important; }` to eliminate text cursor blink noise.
   - Compare SHA-256 buffer hashes against disk before overwriting (`[SKIP]` if identical).
6. **Automated Snippet Companion (`EMBED_SNIPPETS.md`)**: Automatically generate ready-to-paste markdown image links and descriptions.
7. **Multi-Format Office Compilation**: Programmatically compile captured assets into publication-grade Word (`generate_proposal_docx.py`) and PowerPoint (`generate_proposal_pptx.py`) documents with explicit retina scaling and formatted tables.

### Failure Mode
- Specifying action timeouts shorter than the CSS transition duration (e.g. `< 300ms` for drawer expansions), which captures mid-animation frames.
- Omitting `readySelector`, resulting in premature capture before the data layer mounts.

### Instance & Validation Evidence
- `UG-Farmhouse`: 24 assets generated; 100% byte-for-byte skip idempotency verified on repeat runs.
- `QSR`: 24 assets generated; verified with 0 errors in `QSR/validate_cross_deps.js`.
- Engine: `tools/ui-manual-capture/capture.js`.
