# Implementation Plan: SK-018 Decorator Cockpit Cloud Media Intake & Protocol Onboarding

Onboard the Decorator Cockpit module to the canonical Google Drive Media Relay (`STD-MEDIA-HIERARCHY-001` / `INV-MODULE-UPLOAD-INTAKE-001`), replacing the legacy `localStorage` Base64 storage anti-pattern with automated cloud media upload, dynamic subfolder routing, and cross-device sync.

- **Council Deliberation**: [`AC-DEC-2026-058`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260926_arch_council_decorator_cockpit_media_onboarding.md)
- **Governing Standards**: `STD-MEDIA-HIERARCHY-001` (Prime Invariant #9), `STD-DRIVE-MEDIA-RELAY-001`
- **Cluster**: `[UI-QUALITY]` & `[INFRASTRUCTURE]`
- **Target Release**: v2.9.0

---

## User Review Required

> [!NOTE]
> This enhancement is 100% non-breaking. When unauthenticated or offline, the Cockpit gracefully falls back to local memory storage so existing mock/offline testing workflows are completely preserved.

---

## Proposed Changes

Grouped by component layer:

### Component: Cockpit Controller (`cockpit_src/`)

#### [MODIFY] [`cockpit_src/scripts/controller.js`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit_src/scripts/controller.js)
- Implement `resolveDecorCategory(plate)`:
  - Maps plate IDs and categories (`mandap`, `stage`, `entry`, `dining`, `lighting`, `florals`, `lounge`) to canonical taxonomy targets:
    - `mandap` &rarr; `Mandap` (`Decor/Vivaha/Mandap`)
    - `stage` &rarr; `Stage_Backdrop` (`Decor/Vivaha/Stage_Backdrop`)
    - `entry` &rarr; `Entry_Arch` (`Decor/Vivaha/Entry_Arch`)
    - `dining` &rarr; `Dining_Pandal` (`Decor/Vivaha/Dining_Pandal`)
    - `lighting` &rarr; `Lighting` (`Decor/Lighting_Atmosphere`)
    - `florals` &rarr; `Florals` (`Decor/Floral_Installations`)
    - `lounge` &rarr; `Lounge` (`Decor/Photo_Lounges`)
- Wire `btnSubmitOption` in `wireOptionIntakeModal()`:
  - If `localUploadedDataUrl` is present:
    - Check if `window.fsUploadLookPhoto` is a function and `window.currentUser` exists.
    - If yes: Show progress feedback (`☁️ Uploading decor concept to Drive...`), animate progress bar, and call `window.fsUploadLookPhoto(plateId, localUploadedDataUrl, { module: 'Decorator_Cockpit', event: 'Vivaha', category, existingOptions })`.
    - On success: commit look using returned CDN URL (`opt.src = newOpt.url || newOpt.cdnUrl`), save to custom options, re-render, and show success toast.
    - On error: catch error, display warning toast, and gracefully fall back to `commitLook(localUploadedDataUrl, '', 'showroom_upload')`.

---

### Component: SDCA Assembler & Distribution (`cockpit_src/`)

#### [RECOMPILE] [`decorator-cockpit.html`](file:///d:/GitHub_Repo/Sree_Krushna/decorator-cockpit.html) & [`cockpit-fragment.html`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit-fragment.html)
- Run `node cockpit_src/build.cjs` to compile modular components into root and `/public` distribution files.
- Ensure 100% byte parity across dual-release distributions.

---

### Component: Automated Verification Gate (`scripts/`)

#### [MODIFY] [`scripts/test-media-hierarchy-contract.cjs`](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-media-hierarchy-contract.cjs)
- Add Check 4: Assert `cockpit_src/scripts/controller.js` explicitly passes `module: 'Decorator_Cockpit'`, `event: 'Vivaha'`, and normalized category into `fsUploadLookPhoto`.

---

## 📋 Sequential Phased Execution & Verification Plan

### Phase 1: Controller Cloud Upload & Category Normalization Integration
- Implement category resolution helper in `cockpit_src/scripts/controller.js`.
- Wire `btnSubmitOption` upload branch to `window.fsUploadLookPhoto()`.
- Add progress bar animation and graceful offline fallback.
- **Validation Gate (VG-1)**: `node -c cockpit_src/scripts/controller.js` syntax check (100% green).

### Phase 2: SDCA Recompilation & Dual-Release Parity Gate
- Execute `node cockpit_src/build.cjs`.
- Verify byte parity between `/` and `/public`.
- **Validation Gate (VG-2)**: `npm run verify:modular-architecture` (46/46 checks pass).

### Phase 3: Contract Verification, Smoke Test & Registry Update
- Update `scripts/test-media-hierarchy-contract.cjs` to verify both Shopping and Cockpit controllers.
- Run `npm run test:media-hierarchy`.
- Run `npm run test:cockpit` and `npm test`.
- Run `npm run verify:governance-wiring:all`.
- Mark `SK-018` as `COMPLETED` in `ENHANCEMENT-MASTER-REGISTRY.md`.
- **Validation Gate (VG-3)**: All contract, smoke, and governance checks pass (100% green).

---

## 🛑 Plan Hard-Stop & Approval Gate

In accordance with `P-TICKET-FIRST-PHASING-001`, `STD-PLANNING-ENGINE-001`, and `AC-DEC-2026-044`, this plan concludes the scaffolding and planning phase. Detailed code execution will begin upon confirmation.
