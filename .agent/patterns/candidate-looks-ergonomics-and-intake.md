---
pattern: candidate-looks-ergonomics-and-intake
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/mobile-ui-engineering.md
    at: "§ Touch Target & Ergonomics Guidelines"
triggers: []
guard: ""
portability: universal
canonical_source: sree-krushna
porting_effort: low
---

# Candidate Looks Ergonomics, Lightbox Destructive Gating & Multi-Surface File Ingestion

**Category**: Process / Design Gate / Methodology  
**Applies to**: Mobile touch interactions, candidate options management, modal file ingestion, and destructive action gating  
**Origin**: 2026-09-24, Candidate Looks UX feedback & incident review (`AC-DEC-2026-045` / `UI-DEC-2026-041`)  
**Status**: VALIDATED  

---

## Pattern 1 — Candidate Option Long-Press & Contextual Management (`P-LOOK-ERGONOMICS-001`)

### Problem
Overlaid inline deletion icons (`✕` badges on option chips) present an acute accidental deletion risk on mobile devices. When users attempt to tap a chip to switch candidate looks, imprecise finger taps frequently trigger premature deletion. Furthermore, visual chips become cluttered with destructive icons.

### Why it happens
Desktop-first UIs often rely on hover-to-reveal or small inline buttons. On touch devices, there is no hover state; making delete buttons permanent targets clutters touch targets below the recommended 44×44px minimum and creates tap collision.

### Solution
1. **Eradicate Inline Delete Badges**: Chips display only status indicators (selection state, option label, reference badges).
2. **500ms Long-Press Gesture**: Bind `pointerdown` with a 500ms timer triggering `#skChipActionPopover`.
3. **Scroll Displacement Cancellation Guard**:
   ```javascript
   const startX = e.clientX, startY = e.clientY;
   const onMove = (moveEvt) => {
     if (Math.hypot(moveEvt.clientX - startX, moveEvt.clientY - startY) > 8) {
       clearTimeout(timer); // Cancel if thumb is scrolling
     }
   };
   ```
4. **Desktop Context Menu Fallback**: Bind `contextmenu` (right-click) to open the same action popover.

### Failure Mode
Without scroll displacement cancellation, users attempting to scroll through a horizontal options bar will trigger the deletion popover unintentionally.

---

## Pattern 2 — Lightbox Destructive Action Gating (`P-DESTRUCTIVE-GATING-001`)

### Problem
Mass destructive actions (e.g. `[✕ Clear All Custom Looks]`) placed prominently on front-of-card options bars risk catastrophic accidental state wipes during fast browsing.

### Why it happens
Placing irreversible batch-destructive buttons in primary browsing viewports violates progressive disclosure and defensive UX guidelines.

### Solution
1. **Remove Mass Destructive Actions from Item Cards**: Front-of-card option bars contain only non-destructive actions (`[➕ Add Look]`, `[📤 Share]`, `[💬 Remarks]`).
2. **Sequester into Lightbox Modal (`#skLightboxBackdrop > div`)**: Require deliberate inspection of a candidate look before presenting deletion or reset options.
3. **Inject Administrative Controls inside Caption Area**:
   - `[🗑️ Move Option N to Trash Bin]`
   - `[⚠️ Clear All Custom Looks (Revert to Concept)]`
4. **Two-Step Confirmation & Host-Only RBAC**: Destructive actions verify `isHostUser()` and prompt with a clear confirmation dialog.

### Failure Mode
Bypassing inspection allows single-tap misclicks to wipe multi-candidate visual research.

---

## Pattern 3 — Progressive Multi-Surface File Ingestion (`P-PROGRESSIVE-INTAKE-001`)

### Problem
Hiding local file uploads behind secondary modal tabs forces users to hunt for dropzones. On mobile, raw smartphone camera uploads (12MB+) exhaust `localStorage` quotas or cause DOM performance degradation.

### Why it happens
Standard tabbed dialogs decouple URL intake from file intake. Mobile camera sensors produce high-resolution JPEGs unsuitable for immediate client-side base64 storage.

### Solution
1. **Modal-Wide HTML5 Drag & Drop**: Bind `dragenter`, `dragover`, `dragleave`, and `drop` to the entire modal backdrop and dialog card, providing visual pulse feedback.
2. **Native Android Camera & Gallery Picker**: Equip `#skFileInput` with `accept="image/*"` and provide a prominent 1-tap quick upload button on the primary tab.
3. **Client-Side Offscreen Canvas Compressor**:
   ```javascript
   function compressImageFile(file, maxWidth = 1400, quality = 0.82) {
     return new Promise((resolve) => {
       const reader = new FileReader();
       reader.onload = (e) => {
         const img = new Image();
         img.onload = () => {
           const canvas = document.createElement('canvas');
           let { width, height } = img;
           if (width > maxWidth) {
             height = Math.round((height * maxWidth) / width);
             width = maxWidth;
           }
           canvas.width = width;
           canvas.height = height;
           const ctx = canvas.getContext('2d');
           ctx.drawImage(img, 0, 0, width, height);
           resolve(canvas.toDataURL('image/jpeg', quality));
         };
         img.src = e.target.result;
       };
       reader.readAsDataURL(file);
     });
   }
   ```
4. **Quota Guarantee**: Downsamples all images to stay under 280KB, preventing `QuotaExceededError`.

### Task-Dashboard / Sree-Krushna Instance
- `shopping_src/scripts/controller.js`: Lines 860–980 (long-press, popover, lightbox admin, canvas compressor)
- `shopping_src/styles/08_collab_options_and_sharing.css`: Lines 250–420 (popover, admin bar, drag-over styles)
- `ui_primitives/components/option_intake_modal.html`: `#skBtnQuickUpload`, `#skDropzone`, `accept="image/*"`
