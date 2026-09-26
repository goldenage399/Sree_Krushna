# SK-014 Implementation Plan — Phase 1: Sheet Configuration Architecture & Clasp Deployment Pipeline

> **Governing Ticket**: `enhancement-notes/SK-014/00_ENHANCEMENT_INDEX.md`  
> **Target Release**: v2.7.0  
> **Goal**: Establish the Google Apps Script Clasp deployment pipeline, author the multi-tab Google Sheet schema specification for `Sree_Krushna_Media_Relay`, and validate automated deployment manifests.  
> **Architecture**: Cross-platform Node.js automation (`scripts/deploy-gas-relay.cjs`) wrapping `.clasp.json` targeting Script ID `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`, backed by a declarative 3-tab Google Spreadsheet schema specification (`backend_gas/SHEET_SCHEMA_SPEC.md`).  
> **Tech Stack / Toolchain**: Node.js, Google Apps Script Clasp CLI, Google Drive API, Google Sheets API.  

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | `.clasp.json` & Manifests | Valid JSON schema with scriptId `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN` and `rootDir: backend_gas`. |
| **T2** | **Functional** | Deployer Engine | `scripts/deploy-gas-relay.cjs` validates syntax (`node -c`) and executes clean dry-run manifest assembly. |
| **T3** | **Integrated** | Sheet Schema Spec | `backend_gas/SHEET_SCHEMA_SPEC.md` details exact columns, data types, and default seed data for tabs `Config_Settings`, `Config_Routing`, and `Upload_Ledger`. |
| **T4** | **Governance** | Validation Gate VG-1 | `scripts/test-gas-deployment-wiring.cjs` passes 100% green with zero errors. |

---

## Bite-Sized TDD Task Breakdown (Phase 1)

### Task 1.1: Automated Deployment Contract Test (VG-1)

**Files:**
- Create: `scripts/test-gas-deployment-wiring.cjs`

**Step 1: Write failing test**
Create test assertions verifying:
1. `.clasp.json` exists, is valid JSON, and points to `scriptId: "1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN"`.
2. `backend_gas/appsscript.json` manifest exists and specifies `runtimeVersion: "V8"`.
3. `backend_gas/SHEET_SCHEMA_SPEC.md` exists and defines schemas for `Config_Settings`, `Config_Routing`, and `Upload_Ledger`.
4. `scripts/deploy-gas-relay.cjs` exists and passes syntax validation (`node -c`).

**Step 2: Run test to verify it fails**
Run: `node scripts/test-gas-deployment-wiring.cjs`
Expected: FAIL (missing files).

**Step 3: Implement minimal files to pass**
Create `.clasp.json`, `backend_gas/appsscript.json`, and `scripts/deploy-gas-relay.cjs`.

**Step 4: Run test to verify it passes**
Run: `node scripts/test-gas-deployment-wiring.cjs`
Expected: PASS (4/4 checks green).

**Step 5: Commit checkpoint**
`git add .clasp.json backend_gas/ scripts/test-gas-deployment-wiring.cjs`

---

### Task 1.2: Google Sheet Multi-Tab Schema Specification

**Files:**
- Create: `backend_gas/SHEET_SCHEMA_SPEC.md`

**Step 1: Document Tab 1 (`Config_Settings`)**
- Key-Value store for global parameters:
  - `ROOT_FOLDER_ID`: `1pnSsJGadKXCoo9opQa-ghbNlCN5N7OAJ`
  - `MAX_FILE_SIZE_MB`: `8.0`
  - `ALLOWED_USERS`: `goldenage399@gmail.com,sreesubha18@gmail.com,krushna.s.panda@gmail.com`
  - `AUTO_CREATE_FOLDERS`: `TRUE`
  - `CACHE_TTL_SECONDS`: `600`

**Step 2: Document Tab 2 (`Config_Routing`)**
- Hierarchical routing rules table:
  - Columns: `Module | Event | Category | SubfolderPath | TargetFolderId | Description`
  - Seed rows:
    - `Shopping | Vivaha | bridal_saree | Shopping/Bridal/Vivaha_Saree | | Sacred Bibapata & Silk Sarees`
    - `Shopping | Reception | bridal_lehenga | Shopping/Bridal/Reception_Lehenga | | Reception Lehenga`
    - `Shopping | Mandap | groom_wear | Shopping/Groom/Mandap_Attire | | Kurta & Sherwani`
    - `Shopping | All | jewelry | Shopping/Jewelry | | Gold, Kundan & Temple Jewelry`
    - `Decor | Marquee | mandap | Decor/Marquee/Mandap | | Mandap & Stage Floral Decor`
    - `Decor | Rayagada | stage | Decor/Rayagada/Stage | | Reception Stage & Lighting`
    - `Liturgy | Vivaha | puja_items | Liturgy/Vivaha/Puja_Samagri | | Sacred Ritual Accessories`
    - `General | All | other | General/Showroom_Proofs | | Miscellaneous candidate photos`

**Step 3: Document Tab 3 (`Upload_Ledger`)**
- Transaction audit trail:
  - Columns: `Timestamp | UploaderEmail | ItemId | Module | Event | Category | FileName | FileSizeKB | FileId | DriveUrl | ThumbnailCdnUrl | SubfolderPath`

**Step 4: Verify schema alignment with test**
Run: `node scripts/test-gas-deployment-wiring.cjs`
Expected: PASS.

---

### Task 1.3: Cross-Platform Deployer Script (`scripts/deploy-gas-relay.cjs`)

**Files:**
- Create: `scripts/deploy-gas-relay.cjs`

**Step 1: Write deployer logic**
- Checks `backend_gas/MediaRelay.js` syntax via `node -c`.
- Checks for `.clasp.json` and `backend_gas/appsscript.json`.
- If `clasp` is available in environment: runs `clasp push`.
- If `clasp` is not authenticated or not installed: formats a 1-click fallback report copying the bundle directly to `script.google.com/u/0/home/projects/1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN/edit`.

**Step 2: Validate execution**
Run: `node scripts/deploy-gas-relay.cjs --dry-run`
Expected: PASS (syntax verified, deployment manifest valid).

---

## 🔒 Validation Gate (VG-1) Checklist
- [ ] `node scripts/test-gas-deployment-wiring.cjs` passes 100% green.
- [ ] `.clasp.json` strictly declares Script ID `1vwRBuQZ-Yuom8ckWNt8LPMK1nVMFzdkInaIivPbdR-V00CqJ8vtMrpJN`.
- [ ] `backend_gas/SHEET_SCHEMA_SPEC.md` provides copy-paste ready table schemas.
- [ ] Plan Hard-Stop enforced: No Phase 2 code modified until Phase 1 passes and user approves.
