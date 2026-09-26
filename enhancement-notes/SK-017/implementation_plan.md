# Implementation Plan: Multi-Module Google Drive Hierarchy, Automated Sheet Self-Provisioning & Mandatory Module Onboarding Protocol (`SK-017`)

This implementation plan executes Phase 1 of `SK-017`, ratified by the Architecture Council under `AC-DEC-2026-057`. It implements native self-provisioning and auto-healing directly inside `backend_gas/MediaRelay.js` (`setupMediaRelaySheets()`), ensuring the physical Google Spreadsheet [`Sree_Krushna_Media_Relay`](https://docs.google.com/spreadsheets/d/1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc/edit) is configured with formatted headers and canonical seed rows, while preventing dropped audit rows during runtime.

---

## 🔒 Physical Storage & Data Transit Contract (`INV-DATA-TRANSIT-001`)

- **Physical Storage Target**: Google Drive Root Folder `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ` (`Sree_Krushna_Wedding_Media`) and Control Spreadsheet `1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc` (`Sree_Krushna_Media_Relay`).
- **Transit Path**: Client Canvas Downscaled JPEG (<1.2MB) &rarr; Zero-CORS Simple POST (`text/plain`) &rarr; GAS Webhook (`MediaRelay.js`) &rarr; Google Drive &rarr; Zero-CORS CDN (`lh3.googleusercontent.com/d/{fileId}=w2048`) &rarr; Firestore `shopping_items/{id}` candidate looks.
- **Binary Prohibition**: Zero binary or raw Base64 data is stored in `localStorage` or Firestore documents; only CDN URL, File ID, and subfolder paths are persisted.

---

## User Review Required

> [!IMPORTANT]
> **One-Command Live Provisioning**:
> Once Phase 1 is executed and pushed via `node scripts/deploy-gas-relay.cjs --push`, running `setupMediaRelaySheets()` in the Google Apps Script editor (or triggering the bootstrap action) will automatically format the entire Google Spreadsheet with all 3 tabs, professional styling, and canonical multi-module seed rows.

---

## Proposed Changes: Phase 1 (TDD First)

### Component: Google Apps Script Webhook Engine (`backend_gas/`)

#### [MODIFY] [MediaRelay.js](file:///d:/GitHub_Repo/Sree_Krushna/backend_gas/MediaRelay.js)
1. **Implement `setupMediaRelaySheets()`**:
   - Opens spreadsheet `1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`.
   - Creates or formats `Config_Settings`:
     - Headers: `['SettingKey', 'SettingValue', 'Notes']`
     - Theme Styling: Background `#1a1a2e`, Font color `#ffffff`, Bold, Freeze Row 1.
     - Seeds: `ALLOWLIST_EMAIL` (goldenage399@gmail.com, sreesubha18@gmail.com, krushna.s.panda@gmail.com), `CACHE_TTL_SEC` (600), `MAX_FILE_SIZE_KB` (2048).
   - Creates or formats `Config_Routing`:
     - Headers: `['Module', 'Event', 'Category', 'SubfolderPath', 'Status']`
     - Theme Styling: Background `#1a1a2e`, Font color `#ffffff`, Bold, Freeze Row 1.
     - Seeds canonical routes for `Shopping`, `Decorator_Cockpit`, `Liturgy`, `Finance`, and `Operations`.
   - Creates or formats `Upload_Ledger`:
     - Headers: `['Timestamp', 'UploaderEmail', 'ItemId', 'Module', 'Event', 'Category', 'FileName', 'FileSizeKB', 'FileId', 'DriveUrl', 'ThumbnailCdnUrl', 'SubfolderPath']`
     - Theme Styling: Background `#1a1a2e`, Font color `#ffffff`, Bold, Freeze Row 1.
   - Deletes empty default `Sheet1` if newly created.
2. **Implement Auto-Healing in `_getSheet()` and `_logUploadToSheet()`**:
   - If `TAB_UPLOAD_LEDGER` or `TAB_CONFIG_ROUTING` is requested but does not exist, automatically provision the tab with its canonical header row rather than returning `null` or dropping the record.
3. **Expose Secure Webhook Bootstrap Action**:
   - Allow `doPost` to handle `{ action: 'SETUP_SHEETS', secret: ... }` or administrative invocation.

#### [MODIFY] [SHEET_SCHEMA_SPEC.md](file:///d:/GitHub_Repo/Sree_Krushna/backend_gas/SHEET_SCHEMA_SPEC.md)
- Update seed rows table to reflect the full multi-module taxonomy ratified in `AC-DEC-2026-057`.

#### [NEW] [test-gas-self-provisioning.cjs](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-gas-self-provisioning.cjs)
- Automated static test asserting:
  1. `MediaRelay.js` passes `node -c` syntax check.
  2. `setupMediaRelaySheets` is exported/defined.
  3. Header arrays for `Config_Settings`, `Config_Routing`, and `Upload_Ledger` match the 12-dimension specification exactly.
  4. Auto-healing logic exists in `_logUploadToSheet`.

- **Validation Gate (VG-1)**:
  ```powershell
  node scripts/test-gas-self-provisioning.cjs
  # Expected: 🎉 All 4/4 Self-Provisioning and Auto-Healing checks passed!
  ```

---

## Sequential Phasing & DoD Matrix

### Phase 1: GAS Self-Provisioning Engine & Auto-Healing Runtime
- [ ] Implement `setupMediaRelaySheets()` in `backend_gas/MediaRelay.js`.
- [ ] Implement runtime auto-healing in `_logUploadToSheet()` and `_getSheet()`.
- [ ] Push code and bump versioned deployment: `node scripts/deploy-gas-relay.cjs --push`.
- [ ] Validation Gate (VG-1): `node scripts/test-gas-self-provisioning.cjs` passes 100% green.

### Phase 2: Canonical Hierarchy Specification & Local Declarative Manifest
- [ ] Author `docs/references/SPEC-PROC-MEDIA-HIERARCHY-001.md`.
- [ ] Create `backend_gas/media-routing-taxonomy.json`.
- [ ] Validation Gate (VG-2): `node scripts/test-media-hierarchy-contract.cjs` passes 100% green.

### Phase 3: Client Controller Explicit Parameterization & Byte Parity
- [ ] Update `shopping_src/scripts/controller.js` to pass explicit `module: 'Shopping'` and dynamic `event`.
- [ ] Rebuild shopping artifacts via `node shopping_src/build.cjs` and verify 100% byte parity.
- [ ] Validation Gate (VG-3): `npm run verify:modular-architecture` and `npm run test:shopping` pass 100% green.

### Phase 4: Module Onboarding Standard, Manuals Wiring & Governance Verification
- [ ] Codify Prime Invariant #9 (`INV-MODULE-UPLOAD-INTAKE-001`) in `GEMINI.md` and `CLAUDE.md`.
- [ ] Register `STD-MEDIA-HIERARCHY-001` in `.agent/standards-catalog.json`.
- [ ] Update `ENHANCEMENT-MASTER-REGISTRY.md` status to `COMPLETED`.
- [ ] Validation Gate (VG-4): `npm run verify:governance-wiring:all` passes 100% green.

---

## Verification Plan

### Automated Verification
```powershell
# 1. Self-Provisioning & Auto-Healing Syntax Gate
node scripts/test-gas-self-provisioning.cjs

# 2. Deploy updated GAS code to live project
node scripts/deploy-gas-relay.cjs --push

# 3. Governance Wiring Audit
npm run verify:governance-wiring:all
```
