# Sree Krushna Wedding Media Relay: Google Sheet Schema Specification

> **Governing Enhancement**: [`SK-014`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-014/00_ENHANCEMENT_INDEX.md) / [`SK-017`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-017/00_ENHANCEMENT_INDEX.md)  
> **Standard**: `STD-DRIVE-MEDIA-RELAY-001` / `STD-MEDIA-HIERARCHY-001`  
> **Host Spreadsheet Binding**: [`Sree_Krushna_Media_Relay`](https://docs.google.com/spreadsheets/d/1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc/edit) (`1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`)  
> **Host Root Drive Folder Binding**: [`Sree_Krushna_Wedding_Media`](https://drive.google.com/drive/folders/1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ) (`1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ`)  
> **Live GAS Project Binding**: [`Sree_Krushna_Media_Relay_Script`](https://script.google.com/u/0/home/projects/1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN/edit) (`1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`)  
> **Live Webhook URL**: `https://script.google.com/macros/s/AKfycbxVgOoowYwpQBu__Eok4Is_DCy1vxOzrWy7SfVysed5LIcceC773cRDDaCAa7SVkrRraw/exec`  

---

## Tab 1: `Config_Settings` (System Parameters & RBAC Allowlist)

| Column Index | Header Name | Data Type | Description |
| :--- | :--- | :--- | :--- |
| **A** | `SettingKey` | `STRING` | Setting name (e.g. `ALLOWLIST_EMAIL`, `CACHE_TTL_SEC`, `MAX_PAYLOAD_KB`) |
| **B** | `SettingValue` | `STRING` | Value of the setting |
| **C** | `Notes` | `STRING` | Documentation / owner notes |

### Seed Rows:
| SettingKey | SettingValue | Notes |
| :--- | :--- | :--- |
| `ALLOWLIST_EMAIL` | `goldenage399@gmail.com` | Host primary administrator |
| `ALLOWLIST_EMAIL` | `sreesubha18@gmail.com` | Host bride account |
| `ALLOWLIST_EMAIL` | `krushna.s.panda@gmail.com` | Host family coordinator |
| `CACHE_TTL_SEC` | `600` | In-memory CacheService TTL (seconds) |
| `MAX_FILE_SIZE_KB` | `2048` | Upper threshold before rejecting payload |

---

## Tab 2: `Config_Routing` (Dynamic Subfolder Hierarchy)

| Column Index | Header Name | Data Type | Description |
| :--- | :--- | :--- | :--- |
| **A** | `Module` | `STRING` | Source module (`Shopping`, `Decorator_Cockpit`, `Liturgy`, `Finance`, `*`) |
| **B** | `Event` | `STRING` | Target wedding event (`Vivaha`, `Reception`, `Sangeet`, `Haldi`, `*`) |
| **C** | `Category` | `STRING` | Item category (`Bridal_Silks`, `Groom_Wear`, `Mandap`, `Jewellery`, `*`) |
| **D** | `SubfolderPath` | `STRING` | Destination path under `Sree_Krushna_Wedding_Media` |
| **E** | `Status` | `STRING` | `ACTIVE` or `ARCHIVED` |

### Multi-Module Taxonomy Seed Rows:
| Module | Event | Category | SubfolderPath | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Shopping` | `Vivaha` | `Bridal_Silks` | `Shopping/Vivaha/Bridal_Silks` | `ACTIVE` | Canonical bridal wedding attire |
| `Shopping` | `Vivaha` | `Groom_Wear` | `Shopping/Vivaha/Groom_Wear` | `ACTIVE` | Groom wedding dhoti/kurta |
| `Shopping` | `Vivaha` | `Jewellery` | `Shopping/Vivaha/Jewellery` | `ACTIVE` | Sacred gold & heirloom jewellery |
| `Shopping` | `Vivaha` | `Tarakasi_Silver` | `Shopping/Vivaha/Tarakasi_Silver` | `ACTIVE` | Cuttack filigree silver pieces |
| `Shopping` | `Reception` | `Bridal_Lehenga` | `Shopping/Reception/Bridal_Lehenga` | `ACTIVE` | Reception evening lehenga |
| `Shopping` | `Reception` | `Groom_Sherwani` | `Shopping/Reception/Groom_Sherwani` | `ACTIVE` | Reception formal sherwani |
| `Shopping` | `Sangeet` | `*` | `Shopping/Sangeet/Outfits` | `ACTIVE` | Festive sangeet ensembles |
| `Shopping` | `Engagement` | `*` | `Shopping/Engagement/Rings_Attire` | `ACTIVE` | Engagement rings & formal wear |
| `Shopping` | `Haldi` | `*` | `Shopping/Haldi/Yellow_Silks` | `ACTIVE` | Ceremonial yellow attire |
| `Shopping` | `*` | `Sara_Gifting` | `Shopping/Gifting/Sara_Relatives` | `ACTIVE` | Relative gifting & trousseau |
| `Decorator_Cockpit` | `Vivaha` | `Mandap` | `Decor/Vivaha/Mandap` | `ACTIVE` | Sacred vivaha mandap structures |
| `Decorator_Cockpit` | `Vivaha` | `Stage_Backdrop` | `Decor/Vivaha/Stage_Backdrop` | `ACTIVE` | Stage visual backdrops |
| `Decorator_Cockpit` | `Vivaha` | `Entry_Arch` | `Decor/Vivaha/Entry_Arch` | `ACTIVE` | Grand ceremonial entrance arch |
| `Decorator_Cockpit` | `Vivaha` | `Dining_Pandal` | `Decor/Vivaha/Dining_Pandal` | `ACTIVE` | Traditional dining pandal setup |
| `Decorator_Cockpit` | `*` | `Lighting` | `Decor/Lighting_Atmosphere` | `ACTIVE` | Ambience & architectural lighting |
| `Decorator_Cockpit` | `*` | `Florals` | `Decor/Floral_Installations` | `ACTIVE` | Fresh flower arrangements |
| `Decorator_Cockpit` | `*` | `Lounge` | `Decor/Photo_Lounges` | `ACTIVE` | Guest photo booths & lounges |
| `Liturgy` | `Vivaha` | `Sacred_Pata` | `Liturgy/Vivaha/Sacred_Pata` | `ACTIVE` | Holy cloths & sanctified textiles |
| `Liturgy` | `Vivaha` | `Samagri` | `Liturgy/Vivaha/Samagri` | `ACTIVE` | Ritual samagri items & utensils |
| `Finance` | `*` | `Invoices` | `Finance/Vendor_Invoices` | `ACTIVE` | Vendor billings & quotes |
| `Finance` | `*` | `Receipts` | `Finance/Payment_Receipts` | `ACTIVE` | Host transaction receipts |
| `Operations` | `*` | `Floorplans` | `Operations/Venue_Layouts` | `ACTIVE` | Venue layouts & spatial schematics |

---

## Tab 3: `Upload_Ledger` (12-Dimension Audit Trail)

| Column Index | Header Name | Data Type | Description |
| :--- | :--- | :--- | :--- |
| **A** | `Timestamp` | `DATETIME` | ISO upload completion timestamp |
| **B** | `UploaderEmail` | `STRING` | Authenticated email address |
| **C** | `ItemId` | `STRING` | Domain identifier (`LOOK-###`, `EXP-###`, etc.) |
| **D** | `Module` | `STRING` | Source module name |
| **E** | `Event` | `STRING` | Event scope |
| **F** | `Category` | `STRING` | Category scope |
| **G** | `FileName` | `STRING` | Sanitized filename in Google Drive |
| **H** | `FileSizeKB` | `INTEGER` | Payload size in KB |
| **I** | `FileId` | `STRING` | Google Drive File ID |
| **J** | `DriveUrl` | `URL` | Standard Google Drive web viewer link |
| **K** | `ThumbnailCdnUrl` | `URL` | High-DPI zero-CORS CDN link (`https://lh3.googleusercontent.com/d/{fileId}=w2048`) |
| **L** | `SubfolderPath` | `STRING` | Subfolder hierarchy created in Google Drive |

---

## Auto-Provisioning & Auto-Healing Engine (`INV-RELAY-AUTO-HEAL-006`)

1. **Bootstrap Setup (`setupMediaRelaySheets()`)**:
   - Run from Apps Script editor or POST `{ action: 'SETUP_SHEETS', uploaderEmail: 'goldenage399@gmail.com' }` to the webhook URL.
   - Automatically creates `Config_Settings`, `Config_Routing`, and `Upload_Ledger`.
   - Styles header rows in `#1a1a2e` Navy with bold white text, freezes row 1, sets min column width (130px), and seeds routing taxonomy rows.
   - Safely removes unneeded empty default `Sheet1`.

2. **Runtime Auto-Healing (`_getOrHealSheet()`)**:
   - If `Upload_Ledger` is accidentally deleted or corrupted, `_logUploadToSheet()` automatically re-provisions the sheet and header row on the very next upload.
   - Guarantees **zero dropped audit records**.
