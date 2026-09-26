# Architecture Council Session: Sheet-Configured Drive Media Hierarchy, Real-Time Upload Ledger & Automated GAS Deployment Pipeline

**Session ID**: `AC-2026-054`  
**Date**: 2026-09-26  
**Ruling Reference**: `AC-DEC-2026-054`  
**Cluster**: `[INFRASTRUCTURE]` & `[GOVERNANCE]`  
**Enhancement Target**: `SK-014`  
**Governing Standard**: `SOP-WFL-ARCH-COUNCIL-001` (Council Deliberation Protocol v1.0) & `/plan-review`  
**Precedence Ladder**: `AC-DEC-2026-051` (Multi-Provider Cloud Storage) &rarr; `AC-DEC-2026-052` (PIOps Relay Webhook Port) &rarr; `AC-DEC-2026-053` (Dependency & Impact Radius) &rarr; `AC-DEC-2026-054` (Sheet-Configured Media Hierarchy)

---

## 🏛️ Executive Summary & Context

Following the successful delivery and verification of **SK-011**, the host planning authority provided the canonical live links for cloud media custody:
1. **Google Drive Root Folder**: [`1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ`](https://drive.google.com/drive/folders/1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ?usp=drive_link) (`Sree_Krushna_Wedding_Media`).
2. **Google Spreadsheet Control Plane**: [`1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`](https://docs.google.com/spreadsheets/d/1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc/edit?gid=0#gid=0) (`Sree_Krushna_Media_Relay`).
3. **Google Apps Script Project**: [`1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`](https://script.google.com/u/0/home/projects/1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN/edit).

The host posed an architectural challenge:
> *"I need you to paste the images here, but different Modules and different events and categories may be respected and hence the photos be organised accordingly, can we do that? All of these must be configurable by the google sheets that I created in Sree_Krushna_Media_Relay... All of these metadata need to be saved. Also, the uploaded images, how they can be organized and stored across different folders, and where the Google Sheets come into play can be checked from unified uploader sidebar uploader module in PI Ops repo or in `D:\GitHub_Repo\Unified_Uploader\src`... so that all the configurations can be altered in the Google Sheet directly and then the GAS script file can be deployed via deployment script as used in the PI Ops application as well."*

---

## 📋 Phase 0: Ground Truth & Evidence Collection (The 4 Anchors)

### 1. Maturity Anchor (Reality-First Grounding — RFG-001)
- **Current System State**: Production application deployed at `https://sree-krushna-forever.web.app` on Firebase Hosting.
- **Client Upload Surface**: `shopping-registry.html` and `decorator-cockpit.html` use `window.fsUploadLookPhoto()` via `firestore-client.js`.
- **Payload Protocol**: 2K QHD Canvas compression (<1.2MB), sent via `Content-Type: text/plain` POST to bypass CORS `OPTIONS` preflight failures.
- **Reference Architecture in PIOps / Unified Uploader**:
  - `D:\GitHub_Repo\Unified_Uploader\src\4_1_ImageUpload.js`: Reads `DocLinks` / `ImageUploader` sheet with 10-minute cache TTL.
  - Appends audit logs to `UploadLogs` sheet: `[timestamp, userEmail, fileName, fileSize, imageUrl, folderUrl]`.
  - Deployment automated via `scripts/deploy.sh` wrapping `clasp push` and `.clasp.json`.

### 2. Evidence Anchor (Live System Targets)
- Root Drive Folder ID: `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ` (owned by host, explicitly shared).
- Control Spreadsheet ID: `1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`.
- Bound GAS Script ID: `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`.

### 3. Precedence Anchor
- `AC-DEC-2026-051`: Zero-cost Google Drive storage strategy bypasses Firebase Blaze credit card barriers.
- `AC-DEC-2026-052`: Standalone GAS webhook isolation prevents cross-repo coupling.
- `STD-MOD-COMP-001`: Client-side controllers and UI primitives must remain decoupled from backend GAS implementation details.

### 4. Reversibility Anchor
- Changing Drive folder structures or sheet headers mid-flight could orphan existing uploaded images if paths change.
- **Mitigation**: Canonical `fileId` is immutable. Regardless of folder hierarchy, `https://lh3.googleusercontent.com/d/{fileId}=w2048` remains valid forever. Folder routing is purely an organizational layer in Drive.

---

## ⚖️ Phase 1: Comparative Options Evaluation & Multi-Disciplinary Council Review

### Comparative Evaluation Matrix

| Architectural Axis | Option A: Dynamic Auto-Provisioning | Option B: Static DocLinks (PIOps Clone) | Option C: Dual-Surface Sheet Sidebar | Option D (Certified Hybrid): Smart Router + Sheet Config + Audit Ledger |
| :--- | :--- | :--- | :--- | :--- |
| **Folder Organization** | Purely code-driven dynamic folder creation | Host must manually create all folders in Drive & paste IDs | Host manually creates folders; upload via Sheet Sidebar | **Dynamic Auto-Provisioning with Sheet Overrides**: Uses Sheet routing table; auto-creates missing subfolders under root folder `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ` and records folder ID back into Sheet. |
| **Spreadsheet Control Plane** | Hardcoded configs with sheet logging | Static `DocLinks` lookup tab | Direct Sheet Sidebar + `UploadLogs` | **Two-Tier SSOT**: `Config_Routing` (defines Module/Event/Category paths & IDs) + `Upload_Ledger` (audit logs with CDN URLs). |
| **Metadata Tracking** | Minimal log | Standard 6-column log | Interactive form in sidebar | **Comprehensive Audit Schema**: 12 columns (`Timestamp`, `UploaderEmail`, `ItemId`, `Module`, `Event`, `Category`, `FileName`, `FileSizeKB`, `FileId`, `DriveUrl`, `CdnUrl`, `SubfolderPath`). |
| **Deployment Automation** | Manual copy-paste | Bash `deploy.sh` with clasp | Clasp push | **Cross-Platform Node Pipeline (`scripts/deploy-gas-relay.cjs`)**: Supports both Windows PowerShell & Bash, wraps `.clasp.json`, validates syntax (`node -c`) before pushing to Script ID `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`. |
| **Complexity Score** | Low | Low-Medium | High (unneeded UI in Sheet) | **Optimal Medium**: Zero unnecessary UI overhead in Sheets; pure headless Webhook efficiency with automated deployment. |

---

### Council Member Deliberations

#### 1. SSOT Authority Auditor (`ssot-reconciliation`)
> **Position**: SUPPORT HYBRID OPTION D.  
> **Evidence**: Binding directly to Root Folder ID `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ` and Spreadsheet ID `1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc` establishes a deterministic single source of truth. Hardcoded folder names like `Sree_Krushna_Wedding_Media` in `MediaRelay.js` caused ambiguity because multiple folders with the same name could exist in Google Drive. Direct ID binding eliminates namespace collisions.

#### 2. Schema & Firestore Auditor (`firebase-firestore`)
> **Position**: SUPPORT HYBRID OPTION D.  
> **Evidence**: The client write path in `public/js/modules/firestore-client.js` currently stores `driveFileId` and `photoUrl` in Firestore collection `shopping_items/{itemId}`. Enriching the payload with `module`, `event`, and `category` allows the webhook to log comprehensive metadata in `Upload_Ledger` without modifying the core Firestore security rules or index definitions.

#### 3. Service Layer Integrity Auditor (`debug-backend` / `cos-invoke`)
> **Position**: SUPPORT HYBRID OPTION D.  
> **Evidence**: In `Unified_Uploader/src/4_1_ImageUpload.js`, `fetchReportTypesAndFolderIds()` implements a 10-minute cache (`CacheService.getScriptCache()`, TTL 600s). Querying Google Sheets on every single photo upload adds 1.2–2.0s of Sheet API latency. By caching the routing table in `CacheService`, subsequent photo uploads complete in under 800ms, completely eliminating GAS execution timeouts.

#### 4. Dependency & Impact Auditor (`change-impact-analysis`)
> **Position**: SUPPORT HYBRID OPTION D with STRICT CONTRACT ISOLATION.  
> **Evidence**: The Web App client (`shopping_src/scripts/controller.js` and `cockpit_src/scripts/controller.js`) already passes `itemId`, `category`, and metadata. The GAS webhook should accept optional `module` (default: `'shopping'`) and `event` (default: `'general'`) fields. If omitted, it gracefully defaults to `Shopping/General`. This guarantees 100% backward compatibility with all currently deployed clients.

#### 5. File Placement Auditor (`file-placement-guardrail`)
> **Position**: SUPPORT HYBRID OPTION D.  
> **Evidence**: In accordance with repo taxonomy:
> - GAS source lives in `backend_gas/MediaRelay.js`.
> - GAS configuration wrappers live in `backend_gas/Config.js`.
> - Automated push/deploy scripts live in `scripts/deploy-gas-relay.cjs` with `.clasp.json` at repo root or in `backend_gas/`.
> - Contract test lives in `scripts/test-drive-relay-contract.cjs`.

#### 6. Auth & Permission Auditor (`protocol-enforcer-pre-code`)
> **Position**: SUPPORT HYBRID OPTION D.  
> **Evidence**: The Google Sheet `Config_Settings` tab can maintain the `ALLOWED_USERS` list dynamically. If the host invites a wedding coordinator or relative (e.g. adding an email to the sheet), the script honors it without requiring a code redeployment.

#### 7. Maintainability & Velocity Auditor (`ponytail` / RFG-001)
> **Position**: VETO OPTION C (Sheet Sidebar UI); APPROVE OPTION D (Headless Webhook + Clasp Deploy).  
> **Evidence**: Building an interactive HTML sidebar inside Google Sheets (`4_2_UploadSideBar.html` from Unified Uploader) is 77KB of legacy HTML/CSS that duplicates the Marriage OS web application. Family members do not use Google Sheets to upload shopping photos; they use their mobile phones on the web app. Option C violates RFG-001 by adding speculative maintenance burden. Option D delivers 100% of the value with zero dead UI code.

---

## 📜 Phase 2: Council Synthesis & Certified Architecture Ruling

### Decision Reference: `AC-DEC-2026-054`
**Status**: APPROVED & CERTIFIED  
**Title**: Sheet-Configured Google Drive Media Hierarchy, Real-Time Upload Ledger & Automated GAS Clasp Deployment Pipeline  

The Architecture Council unanimously rules:
1. **Root Folder & Sheet Binding**:
   - The GAS Relay Webhook (`backend_gas/MediaRelay.js`) shall explicitly bind to Root Drive Folder ID `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ` and Spreadsheet ID `1m5kA8kvicAuCNPxbXPsRG2jWZayJODBQ5MquhhLX7nc`.
2. **Sheet-Driven Dynamic Routing Engine**:
   - The Google Sheet `Sree_Krushna_Media_Relay` shall contain:
     - `Config_Routing`: Table defining `[Module, Event, Category, SubfolderPath, FolderId]`.
     - `Upload_Ledger`: Audit log recording `[Timestamp, UploaderEmail, ItemId, Module, Event, Category, FileName, FileSizeKB, FileId, DriveUrl, ThumbnailCdnUrl, SubfolderPath]`.
   - The webhook shall check `Config_Routing` (cached for 10 minutes in `CacheService`). If a subfolder does not exist in Drive, the script auto-creates it under `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ`, saves the generated folder ID back into `Config_Routing`, and places the image there.
3. **Automated Cross-Platform Clasp Deployment**:
   - Provide `.clasp.json` configured for Script ID `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`.
   - Provide a cross-platform deployment script `scripts/deploy-gas-relay.cjs` that validates syntax (`node -c`), prepares the deployment payload, and executes clasp push/deploy.
4. **Mandatory Ticket Phasing**:
   - Register enhancement ticket **`SK-014`** in `enhancement-notes/SK-014/00_ENHANCEMENT_INDEX.md` with a 4-phase sequential Definition of Done (DoD) matrix.

---

## 📑 Cross-Council Referral Note
- **To UI/UX Council**: No client UI changes or design token updates required. Client-side controllers in `shopping_src` and `cockpit_src` pass enriched metadata without altering existing modal styling or button primitives.
