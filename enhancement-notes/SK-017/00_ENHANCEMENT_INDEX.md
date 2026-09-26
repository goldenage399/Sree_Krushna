# SK-017: Multi-Module Google Drive Hierarchy, Automated Sheet Self-Provisioning & Mandatory Module Onboarding Protocol

## 📊 Metadata

- **Category**: ARCHITECTURE / STORAGE_ROUTING / GOVERNANCE_GATE
- **Priority**: CRITICAL
- **Status**: COMPLETED
- **Estimate**: 6 hours
- **Target Release**: v2.8.0
- **Risk Level**: MEDIUM (Directly touches live Google Sheet control plane, Drive folder creation, and client upload parameters)
- **Owner**: goldenage399
- **Cluster**: `[INFRASTRUCTURE]` & `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-011  # Multi-Provider Cloud Storage & Google Drive Intake Pipeline
    - SK-014  # Sheet-Configured Drive Media Hierarchy & Automated GAS Deployment Pipeline
    - SK-015  # Universal Sheet-Drive Media Relay Skill, Standard & Portable Package
  related:
    - AC-DEC-2026-054  # Sheet-Configured Drive Media Hierarchy
    - AC-DEC-2026-055  # Universal Sheet-Drive Media Relay Skill
    - AC-DEC-2026-057  # Multi-Module Google Drive Hierarchy & Onboarding Protocol
    - docs/references/SPEC-PROC-MEDIA-HIERARCHY-001.md
    - backend_gas/SHEET_SCHEMA_SPEC.md
  blocks:
    - None
```

---

## 🎯 Goal

Resolve the physical initialization gap on Google Spreadsheet [`Sree_Krushna_Media_Relay`](https://docs.google.com/spreadsheets/d/1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc/edit), establish a multi-module folder hierarchy across all Marriage OS domains, and enforce the mandatory Module Onboarding Protocol (`INV-MODULE-UPLOAD-INTAKE-001`):
1. **Automated Self-Provisioning & Auto-Healing in GAS (`MediaRelay.js`)**:
   - Provide a standalone function `setupMediaRelaySheets()` that creates `Config_Settings`, `Config_Routing`, and `Upload_Ledger` with styled headers (`#1a1a2e`, white text, frozen top row) and canonical seed rows with 1 click.
   - Implement runtime auto-healing: if an upload occurs and `Upload_Ledger` or `Config_Routing` is missing, dynamically generate the tab with headers on-the-fly, eliminating dropped rows.
2. **Canonical Multi-Module Hierarchy (`SPEC-PROC-MEDIA-HIERARCHY-001.md`)**:
   - Codify explicit folder routing across all 5 operational domains:
     - `Shopping` (`Shopping/Vivaha/Bridal_Silks`, `Shopping/Vivaha/Groom_Wear`, `Shopping/Reception/...`, etc.)
     - `Decorator_Cockpit` (`Decor/Vivaha/Mandap`, `Decor/Vivaha/Stage_Backdrop`, `Decor/Dining_Pandal`, etc.)
     - `Decision_Registry` (`Decisions/Attire`, `Decisions/Venues`, `Decisions/Catering`)
     - `Liturgy` (`Liturgy/Vivaha/Sacred_Pata`, `Liturgy/Samagri`)
     - `Finance` (`Finance/Invoices`, `Finance/Receipts`)
     - `Operations_Logistics` (`Operations/Floorplans`, `Operations/Vehicles`)
3. **Mandatory Module Onboarding Standard (`INV-MODULE-UPLOAD-INTAKE-001`)**:
   - Invariant added to `GEMINI.md` and `CLAUDE.md`: Any module adding photo intake must declare its taxonomy, forward explicit metadata, register routing rows, and pass automated contract verification.
4. **Client Explicit Parameterization**:
   - Update `shopping_src/scripts/controller.js` to forward `module: 'Shopping'` and explicit `event: (targetItem && (targetItem.event || targetItem.chapterId)) || 'Vivaha'` into `fsUploadLookPhoto()`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: GAS Self-Provisioning Engine & Auto-Healing Runtime
- [x] **Provisioning Engine Implementation**: Implement `setupMediaRelaySheets()` in `backend_gas/MediaRelay.js` creating `Config_Settings`, `Config_Routing`, and `Upload_Ledger` with styling and full multi-module seed rows.
- [x] **Auto-Healing Runtime**: Update `_getSheet()` and `_logUploadToSheet()` with dynamic tab self-healing if sheets are unexpectedly missing.
- [x] **GAS Deployment**: Deploy updated script to Google Apps Script via `node scripts/deploy-gas-relay.cjs --push` (bumping deployment version to `@4`).
- [x] **Validation Gate (VG-1)**: Execute automated unit test `scripts/test-sheet-drive-relay-contract.cjs` verifying that `setupMediaRelaySheets()` syntax compiles cleanly and generates expected schema objects (100% green).

### Phase 2: Canonical Hierarchy Specification & Local Declarative Manifest
- [x] **SSOT Specification**: Author `docs/references/SPEC-PROC-MEDIA-HIERARCHY-001.md` documenting complete folder taxonomy across all 5 modules.
- [x] **Declarative Manifest**: Create `backend_gas/media-routing-taxonomy.json` containing the authoritative machine-readable routing rules.
- [x] **Validation Gate (VG-2)**: Run automated contract test `scripts/test-media-hierarchy-contract.cjs` asserting all 5 modules are mapped to unique Google Drive subfolders with zero collisions.

### Phase 3: Client Controller Explicit Parameterization & Byte Parity
- [x] **Shopping Controller Enrichment**: Update `shopping_src/scripts/controller.js` to forward explicit `module: 'Shopping'` and dynamic `event` based on item chapter.
- [x] **SDCA Recompilation**: Recompile shopping artifacts via `node shopping_src/build.cjs` and verify 100% byte parity between root and `/public`.
- [x] **Validation Gate (VG-3)**: Run `npm run verify:modular-architecture` and `npm run test:shopping` (100% green).

### Phase 4: Module Onboarding Standard, Manuals Wiring & Governance Verification
- [x] **Standard Codification**: Add Prime Invariant #9 (`INV-MODULE-UPLOAD-INTAKE-001`) to `GEMINI.md` and `CLAUDE.md`.
- [x] **Standards Catalog Update**: Register `STD-MEDIA-HIERARCHY-001` in `.agent/standards-catalog.json`.
- [x] **Registry Synchronization**: Register `SK-017` in `ENHANCEMENT-MASTER-REGISTRY.md` and update `enhancement-config.json` (`next_id: 18`).
- [x] **Validation Gate (VG-4)**: Execute `npm run verify:governance-wiring:all` (100% green across all artifacts).
