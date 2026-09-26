# Google Sheet Control Plane Schema Specification (`STD-DRIVE-MEDIA-RELAY-001`)

This specification defines the canonical three-tab spreadsheet schema governing the Universal Sheet-Drive Media Relay.

---

## Tab 1: `Config_Settings` (System Parameters & RBAC)

Stores operational key-value configuration and auxiliary authorized email allowlists.

| Column Index | Header Name | Data Type | Description & Examples |
| :--- | :--- | :--- | :--- |
| **A** | `SettingKey` | `STRING` | Configuration key name (e.g. `ALLOWLIST_EMAIL`, `CACHE_TTL_SEC`, `MAX_FILE_SIZE_KB`) |
| **B** | `SettingValue` | `STRING` | Configuration value (e.g. `user@example.com`, `2048`, `600`) |
| **C** | `Notes` | `STRING` | Descriptive memo or rationale |

### Seed Rows Example:
| SettingKey | SettingValue | Notes |
| :--- | :--- | :--- |
| `ALLOWLIST_EMAIL` | `goldenage399@gmail.com` | Host primary administrator |
| `ALLOWLIST_EMAIL` | `sreesubha18@gmail.com` | Host bride account |
| `CACHE_TTL_SEC` | `600` | In-memory CacheService TTL (seconds) |
| `MAX_FILE_SIZE_KB` | `2048` | Upper threshold before rejecting payload |

---

## Tab 2: `Config_Routing` (Dynamic Folder Hierarchy)

Maps combinations of `Module`, `Event`, and `Category` into Google Drive subfolder hierarchies.

| Column Index | Header Name | Data Type | Description & Examples |
| :--- | :--- | :--- | :--- |
| **A** | `Module` | `STRING` | Application module (`Shopping`, `Decorator_Cockpit`, `Liturgy`, `Finance`, `*`) |
| **B** | `Event` | `STRING` | Target wedding event (`Vivaha`, `Reception`, `Sangeet`, `Haldi`, `*`) |
| **C** | `Category` | `STRING` | Item category (`Bridal_Silks`, `Groom_Wear`, `Mandap`, `Jewellery`, `*`) |
| **D** | `SubfolderPath` | `STRING` | Google Drive path under `ROOT_FOLDER_ID` (e.g. `Shopping/Vivaha/Bridal_Silks`) |
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

Immutable append-only audit trail capturing every media upload transaction.

| Column Index | Header Name | Data Type | Description |
| :--- | :--- | :--- | :--- |
| **A** | `Timestamp` | `DATETIME` | ISO Timestamp of upload completion |
| **B** | `UploaderEmail` | `STRING` | Authenticated email address of the uploader |
| **C** | `ItemId` | `STRING` | Associated domain identifier (e.g. `LOOK-001`, `EXP-042`) |
| **D** | `Module` | `STRING` | Source module name (`Shopping`, `Decorator_Cockpit`, etc.) |
| **E** | `Event` | `STRING` | Event scope (`Vivaha`, `Reception`, `General`) |
| **F** | `Category` | `STRING` | Item categorization (`Bridal_Silks`, `Mandap`, etc.) |
| **G** | `FileName` | `STRING` | Sanitized unique filename created in Google Drive |
| **H** | `FileSizeKB` | `INTEGER` | Payload size in Kilobytes |
| **I** | `FileId` | `STRING` | Unique Google Drive File ID |
| **J** | `DriveUrl` | `URL` | Standard Google Drive web viewer link |
| **K** | `ThumbnailCdnUrl` | `URL` | High-DPI zero-CORS CDN link (`https://lh3.googleusercontent.com/d/{fileId}=w2048`) |
| **L** | `SubfolderPath` | `STRING` | Destination subfolder hierarchy |

---

## Auto-Provisioning & Auto-Healing Engine (`INV-RELAY-AUTO-HEAL-006`)

Rather than manually formatting sheets, Google Apps Script provides zero-click bootstrap and runtime resilience:

1. **Bootstrap Setup (`setupMediaRelaySheets()`)**:
   - Run from Apps Script editor or POST `{ action: 'SETUP_SHEETS', uploaderEmail: '...' }` to the webhook URL.
   - Automatically creates `Config_Settings`, `Config_Routing`, and `Upload_Ledger`.
   - Styles header rows in `#1a1a2e` Navy with bold white text, freezes row 1, sets min column width (130px), and seeds routing taxonomy rows.
   - Safely removes unneeded empty default `Sheet1`.

2. **Runtime Auto-Healing (`_getOrHealSheet()`)**:
   - If `Upload_Ledger` is accidentally deleted or corrupted, `_logUploadToSheet()` automatically re-provisions the sheet and header row on the very next upload.
   - Guarantees **zero dropped audit records**.
