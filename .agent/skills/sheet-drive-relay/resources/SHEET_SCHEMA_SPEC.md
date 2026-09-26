# Google Sheet Control Plane Schema Specification (`STD-DRIVE-MEDIA-RELAY-001`)

This specification defines the canonical three-tab spreadsheet schema governing the Universal Sheet-Drive Media Relay.

---

## Tab 1: `Config_Settings` (System Parameters & RBAC)

Stores operational key-value configuration and auxiliary authorized email allowlists.

| Column Index | Header Name | Data Type | Description & Examples |
| :--- | :--- | :--- | :--- |
| **A** | `SettingKey` | `STRING` | Configuration key name (e.g. `ALLOWLIST_EMAIL`, `DEFAULT_MAX_KB`, `CACHE_TTL_SEC`) |
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
| **C** | `Category` | `STRING` | Item category (`Bridal_Lehenga`, `Groom_Sherwani`, `Mandap`, `Jewelry`, `*`) |
| **D** | `SubfolderPath` | `STRING` | Google Drive path under `ROOT_FOLDER_ID` (e.g. `Shopping/Vivaha/Bridal_Lehenga`) |
| **E** | `Status` | `STRING` | `ACTIVE` or `ARCHIVED` |

### Seed Rows Example:
| Module | Event | Category | SubfolderPath | Status |
| :--- | :--- | :--- | :--- | :--- |
| `Shopping` | `Vivaha` | `Bridal_Lehenga` | `Shopping/Vivaha/Bridal_Lehenga` | `ACTIVE` |
| `Shopping` | `Vivaha` | `Groom_Sherwani` | `Shopping/Vivaha/Groom_Sherwani` | `ACTIVE` |
| `Shopping` | `Reception` | `*` | `Shopping/Reception/General` | `ACTIVE` |
| `Decorator_Cockpit` | `*` | `Mandap` | `Decor/Mandap_Concepts` | `ACTIVE` |
| `Decorator_Cockpit` | `*` | `Stage` | `Decor/Stage_Backdrops` | `ACTIVE` |
| `Finance` | `*` | `*` | `Finance/Receipts` | `ACTIVE` |

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
| **F** | `Category` | `STRING` | Item categorization (`Bridal_Lehenga`, `Mandap`, etc.) |
| **G** | `FileName` | `STRING` | Sanitized unique filename created in Google Drive |
| **H** | `FileSizeKB` | `INTEGER` | Payload size in Kilobytes |
| **I** | `FileId` | `STRING` | Unique Google Drive File ID |
| **J** | `DriveUrl` | `URL` | Standard Google Drive web viewer link |
| **K** | `ThumbnailCdnUrl` | `URL` | High-DPI zero-CORS CDN link (`https://lh3.googleusercontent.com/d/{fileId}=w2048`) |
| **L** | `SubfolderPath` | `STRING` | Destination subfolder hierarchy |
