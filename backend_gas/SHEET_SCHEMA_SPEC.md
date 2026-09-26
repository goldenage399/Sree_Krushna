# Sree Krushna Wedding Media Relay: Google Sheet Schema Specification

> **Governing Enhancement**: [`SK-014`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-014/00_ENHANCEMENT_INDEX.md)  
> **Standard**: `STD-DRIVE-MEDIA-RELAY-001`  
> **Host Spreadsheet Binding**: [`Sree_Krushna_Media_Relay`](https://docs.google.com/spreadsheets/d/1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc/edit) (`1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`)  
> **Host Root Drive Folder Binding**: [`Sree_Krushna_Wedding_Media`](https://drive.google.com/drive/folders/1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ) (`1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ`)  
> **Live GAS Project Binding**: [`Sree_Krushna_Media_Relay_Script`](https://script.google.com/u/0/home/projects/1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN/edit) (`1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`)  

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
| **C** | `Category` | `STRING` | Item category (`Bridal_Lehenga`, `Groom_Sherwani`, `Mandap`, `Jewelry`, `*`) |
| **D** | `SubfolderPath` | `STRING` | Destination path under `Sree_Krushna_Wedding_Media` |
| **E** | `Status` | `STRING` | `ACTIVE` or `ARCHIVED` |

### Seed Rows:
| Module | Event | Category | SubfolderPath | Status |
| :--- | :--- | :--- | :--- | :--- |
| `Shopping` | `Vivaha` | `Bridal_Lehenga` | `Shopping/Vivaha/Bridal_Lehenga` | `ACTIVE` |
| `Shopping` | `Vivaha` | `Groom_Sherwani` | `Shopping/Vivaha/Groom_Sherwani` | `ACTIVE` |
| `Shopping` | `Vivaha` | `Jewelry` | `Shopping/Vivaha/Jewelry` | `ACTIVE` |
| `Shopping` | `Reception` | `Bridal_Lehenga` | `Shopping/Reception/Bridal_Lehenga` | `ACTIVE` |
| `Shopping` | `Reception` | `Groom_Sherwani` | `Shopping/Reception/Groom_Sherwani` | `ACTIVE` |
| `Shopping` | `Sangeet` | `*` | `Shopping/Sangeet/Outfits` | `ACTIVE` |
| `Decorator_Cockpit` | `*` | `Mandap` | `Decor/Mandap_Concepts` | `ACTIVE` |
| `Decorator_Cockpit` | `*` | `Stage` | `Decor/Stage_Backdrops` | `ACTIVE` |
| `Decorator_Cockpit` | `*` | `Lighting` | `Decor/Lighting_Atmosphere` | `ACTIVE` |
| `Liturgy` | `*` | `*` | `Liturgy/Ritual_Items` | `ACTIVE` |
| `Finance` | `*` | `*` | `Finance/Vouchers_Receipts` | `ACTIVE` |

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
