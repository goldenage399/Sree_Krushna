# SK-018: Decorator Cockpit Cloud Media Intake & Protocol Onboarding

## 📊 Metadata

- **Category**: UI QUALITY / INFRASTRUCTURE / STORAGE_ROUTING
- **Priority**: HIGH
- **Status**: IN_PLANNING
- **Estimate**: 3 hours
- **Target Release**: v2.9.0
- **Risk Level**: LOW (Non-destructive update to Cockpit controller and SDCA compilation)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]` & `[INFRASTRUCTURE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-011  # Multi-Provider Cloud Storage & Google Drive Intake Pipeline
    - SK-014  # Sheet-Configured Drive Media Hierarchy & Automated GAS Deployment Pipeline
    - SK-017  # Multi-Module Google Drive Hierarchy & Onboarding Protocol
  related:
    - AC-DEC-2026-057  # Multi-Module Google Drive Hierarchy & Onboarding Protocol
    - AC-DEC-2026-058  # Decorator Cockpit Cloud Media Intake & Protocol Onboarding
    - docs/references/SPEC-PROC-MEDIA-HIERARCHY-001.md
    - backend_gas/media-routing-taxonomy.json
  blocks:
    - None
```

---

## 🎯 Goal

Onboard the Decorator Cockpit module to the canonical Google Drive Media Relay (`STD-MEDIA-HIERARCHY-001` / `INV-MODULE-UPLOAD-INTAKE-001`), eliminating the legacy `localStorage` Base64 storage anti-pattern and enabling seamless cross-device synchronization of showroom decor concepts:

1. **Eliminate Base64 LocalStorage Anti-Pattern**:
   - Replace raw Base64 dataURL persistence in `cockpit_src/scripts/controller.js` with calls to `window.fsUploadLookPhoto()`.
2. **Category Normalization to Canonical Routing**:
   - Map plate categories (`mandap`, `stage`, `entry`, `dining`, `lighting`, `florals`, `lounge`) to canonical taxonomy targets (`Decor/Vivaha/Mandap`, `Decor/Vivaha/Stage_Backdrop`, `Decor/Vivaha/Entry_Arch`, etc.).
3. **Responsive Visual Feedback**:
   - Provide visual progress feedback during upload (`☁️ Uploading decor concept to Drive...`) with progress bar and toast notifications.
4. **Dual-Release Byte Parity**:
   - Recompile `decorator-cockpit.html` and `cockpit-fragment.html` via `node cockpit_src/build.cjs` and verify 100% byte parity between root and `/public`.
5. **Contract Gate Verification**:
   - Update `scripts/test-media-hierarchy-contract.cjs` to assert both `Shopping` and `Decorator_Cockpit` controllers pass fully qualified parameters.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Cockpit Controller Cloud Upload & Category Normalization
- [ ] **Category Normalizer**: Implement `resolveDecorCategory(plate)` in `cockpit_src/scripts/controller.js` mapping plate IDs/categories to canonical routing categories (`Mandap`, `Stage_Backdrop`, `Entry_Arch`, `Dining_Pandal`, `Lighting`, `Florals`, `Lounge`).
- [ ] **Cloud Upload Integration**: Wire `skBtnSubmitOption` in `cockpit_src/scripts/controller.js` to invoke `window.fsUploadLookPhoto(plateId, localUploadedDataUrl, { module: 'Decorator_Cockpit', event: 'Vivaha', category, ... })` when `localUploadedDataUrl` is present.
- [ ] **Visual Progress & Error Fallback**: Display progress bar animation during upload and provide graceful fallback if unauthenticated or offline.
- [ ] **Validation Gate (VG-1)**: Syntax check passes cleanly (`node -c cockpit_src/scripts/controller.js`).

### Phase 2: SDCA Recompilation & Dual-Release Parity Gate
- [ ] **SDCA Build**: Execute `node cockpit_src/build.cjs` to regenerate standalone `decorator-cockpit.html` and `cockpit-fragment.html`.
- [ ] **Parity Verification**: Verify 100% byte parity between root and `/public` distribution files.
- [ ] **Validation Gate (VG-2)**: Execute `npm run verify:modular-architecture` (all 46 modular checks pass green).

### Phase 3: Contract Verification, Smoke Test & Registry Update
- [ ] **Contract Gate Update**: Enforce in `scripts/test-media-hierarchy-contract.cjs` that `cockpit_src/scripts/controller.js` forwards `module: 'Decorator_Cockpit'` and dynamic category.
- [ ] **Smoke Test**: Execute `npm run test:cockpit` and `npm test` verifying clean DOM rendering and endpoint health.
- [ ] **Registry & Cluster Update**: Append lean entry to `docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md` and mark `SK-018` in `ENHANCEMENT-MASTER-REGISTRY.md`.
- [ ] **Validation Gate (VG-3)**: Execute `npm run test:media-hierarchy` and `npm run verify:governance-wiring:all` (100% green).
