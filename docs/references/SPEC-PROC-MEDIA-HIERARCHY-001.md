---
id: SPEC-PROC-MEDIA-HIERARCHY-001
title: Multi-Module Google Drive Hierarchy & Mandatory Module Onboarding Specification
parent: DOCS_HUB.md
standard: STD-MEDIA-HIERARCHY-001
governance_ref: AC-DEC-2026-057
status: RATIFIED
version: 1.0.0
updated_at: 2026-09-26T23:30:00+05:30
---

# Multi-Module Google Drive Hierarchy & Module Onboarding Specification (`SPEC-PROC-MEDIA-HIERARCHY-001`)

## 1. Executive Summary

This specification establishes the authoritative folder hierarchy and module intake protocol governing all media storage across the **Sree Krushna Marriage OS**. It guarantees that media files uploaded from distinct functional modules (`Shopping`, `Decorator_Cockpit`, `Decision_Registry`, `Liturgy`, `Finance`, `Operations_Logistics`) are partitioned into distinct Google Drive subfolders while maintaining an immutable 12-dimension audit trail in Google Sheets.

---

## 2. Invariant & Standards Framework

### 2.1 Invariant: `INV-MODULE-UPLOAD-INTAKE-001`
Whenever an operational module introduces an image, photo, or file upload capability, it MUST:
1. **Declare Routing Taxonomy**: Define its `[Module, Event, Category]` tuple and destination subfolder path in `backend_gas/media-routing-taxonomy.json` and seed rows in `Config_Routing`.
2. **Explicit Client Parameterization**: Forward fully qualified `module`, `event`, and `category` parameters from its frontend controller into `window.fsUploadLookPhoto()`.
3. **Zero Monolithic Scripts**: Keep UI assemblers under 500 lines per `STD-MOD-COMP-001`.
4. **Pass Automated Contract Gate**: Verify with `npm run test:modular-architecture` and `node scripts/test-media-hierarchy-contract.cjs`.

### 2.2 Standard: `STD-MEDIA-HIERARCHY-001`
- **Root Google Drive Folder**: `Sree_Krushna_Wedding_Media` (`1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ`)
- **Control Spreadsheet**: `Sree_Krushna_Media_Relay` (`1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`)
- **GAS Webhook**: `https://script.google.com/macros/s/AKfycbxVgOoowYwpQBu__Eok4Is_DCy1vxOzrWy7SfVysed5LIcceC773cRDDaCAa7SVkrRraw/exec`

---

## 3. Canonical Multi-Module Routing Taxonomy

| Module | Event | Category | Destination Google Drive Subfolder | Domain Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `Shopping` | `Vivaha` | `Bridal_Silks` | `Shopping/Vivaha/Bridal_Silks` | Canonical bridal wedding silks and Hastaganthi pata |
| `Shopping` | `Vivaha` | `Groom_Wear` | `Shopping/Vivaha/Groom_Wear` | Groom ceremonial silk joda and dhoti |
| `Shopping` | `Vivaha` | `Jewellery` | `Shopping/Vivaha/Jewellery` | Sacred gold, Sita Haar, and temple bridal ornaments |
| `Shopping` | `Vivaha` | `Tarakasi_Silver` | `Shopping/Vivaha/Tarakasi_Silver` | Cuttack filigree silver pieces, payal, and ritual thalis |
| `Shopping` | `Reception` | `Bridal_Lehenga` | `Shopping/Reception/Bridal_Lehenga` | Evening reception bridal lehengas |
| `Shopping` | `Reception` | `Groom_Sherwani` | `Shopping/Reception/Groom_Sherwani` | Reception formal sherwani and bandhgala |
| `Shopping` | `Sangeet` | `*` | `Shopping/Sangeet/Outfits` | Festive sangeet dance ensembles |
| `Shopping` | `Engagement` | `*` | `Shopping/Engagement/Rings_Attire` | Engagement rings, formal attire, and sagan hampers |
| `Shopping` | `Haldi` | `*` | `Shopping/Haldi/Yellow_Silks` | Ceremonial yellow silks and floral jewelry |
| `Shopping` | `*` | `Sara_Gifting` | `Shopping/Gifting/Sara_Relatives` | Extended family trousseau and relative gifting |
| `Decorator_Cockpit` | `Vivaha` | `Mandap` | `Decor/Vivaha/Mandap` | Sacred Vedic vivaha mandap structure and canopy |
| `Decorator_Cockpit` | `Vivaha` | `Stage_Backdrop` | `Decor/Vivaha/Stage_Backdrop` | Stage visual backdrops and photogenic staging |
| `Decorator_Cockpit` | `Vivaha` | `Entry_Arch` | `Decor/Vivaha/Entry_Arch` | Grand ceremonial entrance gate and welcoming walkway |
| `Decorator_Cockpit` | `Vivaha` | `Dining_Pandal` | `Decor/Vivaha/Dining_Pandal` | Traditional banquet and dining canopy setup |
| `Decorator_Cockpit` | `*` | `Lighting` | `Decor/Lighting_Atmosphere` | Atmospheric, warm, and architectural lighting |
| `Decorator_Cockpit` | `*` | `Florals` | `Decor/Floral_Installations` | Fresh floral styling, marigolds, tuberoses, and orchids |
| `Decorator_Cockpit` | `*` | `Lounge` | `Decor/Photo_Lounges` | Guest photo booths and interactive seating corners |
| `Liturgy` | `Vivaha` | `Sacred_Pata` | `Liturgy/Vivaha/Sacred_Pata` | Ritual consecrated cloths and altar drapery |
| `Liturgy` | `Vivaha` | `Samagri` | `Liturgy/Vivaha/Samagri` | Sacred ritual samagri, homa woods, and utensils |
| `Finance` | `*` | `Invoices` | `Finance/Vendor_Invoices` | Official vendor bills, quotations, and contract riders |
| `Finance` | `*` | `Receipts` | `Finance/Payment_Receipts` | Host payment receipts and proof-of-transaction slips |
| `Operations` | `*` | `Floorplans` | `Operations/Venue_Layouts` | Venue architectural layout maps and parking plans |

---

## 4. Control Plane Auto-Provisioning & Auto-Healing

Under `INV-RELAY-AUTO-HEAL-006`:
1. The spreadsheet is initialized via `setupMediaRelaySheets()`, formatting header cells in Deep Navy (`#1a1a2e`), bold white text, and auto-sized column widths.
2. If any control tab is missing at runtime during an upload, `_getOrHealSheet()` transparently re-creates the tab, preventing silent record loss.
