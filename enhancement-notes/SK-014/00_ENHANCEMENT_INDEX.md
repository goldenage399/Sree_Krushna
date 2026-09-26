# SK-014: Sheet-Configured Drive Media Hierarchy, Real-Time Upload Ledger & Automated GAS Deployment Pipeline

## 📊 Metadata

- **Category**: ARCHITECTURE / GOOGLE_DRIVE_HIERARCHY / SHEET_INTEGRATION
- **Priority**: HIGH
- **Status**: PLANNING
- **Estimate**: 6 hours
- **Target Release**: v2.7.0
- **Risk Level**: MEDIUM
- **Owner**: goldenage399
- **Cluster**: `[INFRASTRUCTURE]` & `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-011  # Multi-Provider Cloud Storage & Google Drive Intake Pipeline
    - SK-013  # Interactive Multi-Look Lightbox Carousel & Shared Primitive Navigation
  related:
    - AC-DEC-2026-051  # Cloud Storage & Google Drive Hybrid Architecture
    - AC-DEC-2026-052  # PIOps Drive Relay Webhook Leverage & Standalone Media Architecture
    - AC-DEC-2026-053  # End-to-End Dependency & Impact Radius Blueprint
    - AC-DEC-2026-054  # Sheet-Configured Drive Media Hierarchy & Automated Deployment
    - docs/references/SPEC-ARCH-CLOUD-STORAGE-INTAKE-001.md
  blocks:
    - None
```

---

## 🎯 Goal

Upgrade the standalone Google Apps Script Media Relay into an enterprise-grade, sheet-controlled media routing and audit system:
1. **Host Drive & Spreadsheet Binding**: Bind the relay script explicitly to Host Root Drive Folder ID `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ` (`Sree_Krushna_Wedding_Media`) and Control Spreadsheet ID `1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc` (`Sree_Krushna_Media_Relay`).
2. **Sheet-Driven Dynamic Routing Engine**: In `Sree_Krushna_Media_Relay`, read configuration from tab `Config_Routing` (with 10-minute cache TTL in `CacheService`). Route files into organized subfolders by Module (`Shopping`, `Decorator_Cockpit`, `Liturgy`, `Finance`), Event (`Vivaha`, `Reception`, `Sangeet`, `General`), and Category (`Saree`, `Sherwani`, `Mandap`, `Jewelry`). Auto-provision missing subfolders in Drive dynamically and update the Sheet.
3. **Comprehensive Audit Ledger**: Append every upload transaction into a dedicated `Upload_Ledger` tab with 12 metadata dimensions (`Timestamp`, `UploaderEmail`, `ItemId`, `Module`, `Event`, `Category`, `FileName`, `FileSizeKB`, `FileId`, `DriveUrl`, `ThumbnailCdnUrl`, `SubfolderPath`).
4. **Automated Cross-Platform Clasp Pipeline**: Create `.clasp.json` and a cross-platform deployment script (`scripts/deploy-gas-relay.cjs`) targeting Script ID `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN` that validates syntax (`node -c`) and deploys with one command.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Sheet Configuration Architecture & Clasp Deployment Pipeline
- [x] **GAS Project Clasp Configuration**: Create `.clasp.json` linking `backend_gas/` to Script ID `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`.
- [x] **Cross-Platform Deployer Script**: Create `scripts/deploy-gas-relay.cjs` validating syntax (`node -c`), preparing file manifests, and pushing via clasp or providing structured instructions.
- [x] **Sheet Initialization Guide & Schema Spec**: Author `backend_gas/SHEET_SCHEMA_SPEC.md` documenting the exact headers, columns, and seed rows for `Config_Settings`, `Config_Routing`, and `Upload_Ledger` tabs in spreadsheet `1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`.
- [x] **Validation Gate (VG-1)**: Automated test `scripts/test-gas-deployment-wiring.cjs` verifying `.clasp.json`, manifest validity, syntax pass, and schema conformance (4/4 checks passing).

### Phase 2: Sheet-Driven Dynamic Folder Routing & Cache Engine
- [ ] **Root Folder & Sheet ID Binding**: Update `backend_gas/MediaRelay.js` to anchor `ROOT_FOLDER_ID = '1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ'` and `SPREADSHEET_ID = '1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc'`.
- [ ] **Routing Engine with CacheService**: Implement `getRoutingTable()` with 10-minute in-memory cache TTL. Read `Config_Routing` tab to resolve `[Module, Event, Category]` to subfolder paths.
- [ ] **Dynamic Subfolder Provisioning**: Implement `resolveOrCreateFolder(subfolderPath)` creating missing subfolders hierarchically under root folder `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ`.
- [ ] **Validation Gate (VG-2)**: Unit test `scripts/test-sheet-routing-engine.cjs` verifying hierarchical path traversal, cache TTL simulation, and fallback default routing.

### Phase 3: Real-Time Audit Ledger & Client Metadata Enrichment
- [ ] **Upload Ledger Logger**: Implement `_logUploadToSheet(entry)` appending 12 metadata dimensions to `Upload_Ledger` tab.
- [ ] **Client Payload Enrichment**: Update `public/js/modules/firestore-client.js` and `js/modules/firestore-client.js` `fsUploadLookPhoto()` to accept and forward `module`, `event`, and `category` in the webhook payload.
- [ ] **Validation Gate (VG-3)**: Contract test `scripts/test-upload-ledger-contract.cjs` verifying 12-column ledger row formatting, client payload propagation, and zero CORS regression.

### Phase 4: Production Deployment & Verification Sweep
- [ ] **Push to Live GAS Webhook**: Execute deployment script to push updated code to Script ID `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`.
- [ ] **Byte Parity & Pre-flight Sweep**: Run full verification suite:
  - `npm run verify:ui-buttons`
  - `npm run verify:modular-architecture`
  - `npm run verify:ui-lifecycle`
  - `npm run test:shopping`
  - `npm run verify:deployment`
  - `npm run verify:governance-wiring:all`
- [ ] **Validation Gate (VG-4)**: Perform test upload from Web App, verify organized placement in Drive subfolder and corresponding entry in Google Sheet `Upload_Ledger`.
