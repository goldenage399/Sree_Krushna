# SK-015 Phase 1 Implementation Plan: Canonical Standard Pattern & Turnkey Templates

> **Governing Ticket**: `enhancement-notes/SK-015/00_ENHANCEMENT_INDEX.md`  
> **Target Release**: v2.7.0  
> **Goal**: Author the canonical SAP standard pattern `STD-DRIVE-MEDIA-RELAY-001` and bundled turnkey parameterized templates (`MediaRelay.template.js`, `deploy-gas-relay.cjs`, `appsscript.json`, `SHEET_SCHEMA_SPEC.md`) for zero-friction cross-repo media relay distribution.  
> **Architecture**: Standalone Google Apps Script Webhook with dynamic hierarchical Google Drive subfolder auto-provisioning, 10-minute `CacheService` TTL, two-tier Google Sheet control plane (`Config_Routing` + `Upload_Ledger`), and cross-platform Clasp syntax-checked deployer.  
> **Tech Stack / Toolchain**: Google Apps Script (V8 runtime), Google Drive API, Google Sheets API, Node.js (`test-sheet-drive-relay-contract.cjs`), PACT-001 governance engine.  

---

## Sequential Phased Definition of Done (DoD v1.7 Standard)

| Tier | Name | Target | Requirement |
| :--- | :--- | :--- | :--- |
| **T1** | **Static** | Pattern & Templates | Valid YAML/PACT-001 frontmatter in `.agent/patterns/sheet-drive-media-relay.md`, catalog entry in `.agent/standards-catalog.json`, clean syntax in all templates. |
| **T2** | **Functional** | Template Contract | Contract verification test passes: placeholder replacement (`{{ROOT_FOLDER_ID}}`, `{{SPREADSHEET_ID}}`, `{{AUTHORIZED_EMAILS}}`), valid JS parsing via `node -c`, and valid JSON schema. |
| **T3** | **Integrated** | Governance & Clasp | Deployment script `deploy-gas-relay.cjs` handles missing clasp gracefully, validates file manifests, and conforms to SAP repo bootstrap conventions. |
| **T4** | **Governance** | Verification Gate | `npm run verify:governance-wiring:all` passes with zero unreferenced files or broken pointers. |

---

## User Review Required

> [!IMPORTANT]
> **Zero Breaking Changes / 100% Additive Capability**:
> Phase 1 authors the canonical reusable standard pattern and templates under `.agent/patterns/` and `.agent/skills/sheet-drive-relay/templates/`. It does **not** alter existing web client code or runtime routes. It equips any repository in the SAP network to instantiate a zero-billing, high-capacity Google Drive media pipeline with dynamic sheet routing via `/sap-sync`.

---

## Open Questions

None. Architecture and invariants were ratified by Architecture Council in `AC-DEC-2026-055` and tested across `Unified_Uploader`, `PIOperationsMgmt_Firebase`, and `Sree_Krushna`.

---

## Bite-Sized TDD Task Structure (Phase 1)

### Task 1.1: Automated Template & Contract Test Scaffold

**Files:**
- Create: `scripts/test-sheet-drive-relay-contract.cjs`

**Step 1: Write failing test**
Create `scripts/test-sheet-drive-relay-contract.cjs` that asserts:
1. Pattern file `.agent/patterns/sheet-drive-media-relay.md` exists and contains valid PACT-001 frontmatter (`STD-DRIVE-MEDIA-RELAY-001`, `P-DRIVE-MEDIA-RELAY-001`).
2. Catalog entry in `.agent/standards-catalog.json` exists for `STD-DRIVE-MEDIA-RELAY-001`.
3. Template file `.agent/skills/sheet-drive-relay/templates/MediaRelay.template.js` exists, contains mandatory template placeholders (`{{ROOT_FOLDER_ID}}`, `{{SPREADSHEET_ID}}`, `{{AUTHORIZED_EMAILS}}`), and after placeholder substitution passes `node -c` (valid V8/JS syntax).
4. Template file `.agent/skills/sheet-drive-relay/templates/deploy-gas-relay.cjs` exists and passes `node -c`.
5. Template file `.agent/skills/sheet-drive-relay/templates/appsscript.json` exists and parses as valid JSON.
6. Schema reference `.agent/skills/sheet-drive-relay/resources/SHEET_SCHEMA_SPEC.md` exists and declares schemas for `Config_Settings`, `Config_Routing`, and `Upload_Ledger`.

**Step 2: Run test to verify it fails**
Run: `node scripts/test-sheet-drive-relay-contract.cjs`
Expected: FAIL with "File does not exist: .agent/patterns/sheet-drive-media-relay.md" (or missing templates directory).

**🔍 Validation Gate (VG-1.1)**:
1. (Binary) Exit code non-zero AND output matches "AssertionError" or "ENOENT" or "FAIL".

**🚦 Decision Node (DN-1.1)**:
- **Pass**: Proceed to Task 1.2.
- **Fail (1st)**: Test unexpectedly passed. Check whether template files pre-existed.
- **Fail (2nd)**: Halt. Surface to user: "Step 2 gate failed: contract test did not fail as expected."

---

### Task 1.2: Canonical Standard Pattern & Standards Catalog Registration

**Files:**
- Create: `.agent/patterns/sheet-drive-media-relay.md`
- Modify: `.agent/standards-catalog.json:150-162`

**Step 1: Write failing test**
Covered by Task 1.1 test assertions.

**Step 2: Run test to verify it fails**
Run: `node scripts/test-sheet-drive-relay-contract.cjs`
Expected: FAIL with missing pattern file.

**Step 3: Write minimal implementation**
1. Author `.agent/patterns/sheet-drive-media-relay.md` declaring:
   - PACT-001 frontmatter (`pattern: sheet-drive-media-relay`, `guard: "node scripts/test-sheet-drive-relay-contract.cjs"`, `status: VALIDATED`, `portability: universal`).
   - The 5 Universal Invariants:
     - `INV-RELAY-CORS-001`: Zero-CORS Simple POST (`Content-Type: text/plain` with `redirect: 'follow'`).
     - `INV-RELAY-CANVAS-002`: Client-Side 2K Budgeting (max 2048px, quality 0.88, <1.2MB).
     - `INV-RELAY-SHEET-003`: Two-Tier Control Plane (`Config_Routing` + `Upload_Ledger`).
     - `INV-RELAY-CACHE-004`: Dynamic Subfolder Auto-Provisioning with 10-Minute `CacheService` TTL.
     - `INV-RELAY-CDN-005`: Universal 2K High-DPI CDN Resolution (`https://lh3.googleusercontent.com/d/{fileId}=w2048`).
2. Add `STD-DRIVE-MEDIA-RELAY-001` entry to `.agent/standards-catalog.json`.

**Step 4: Run test to verify partial progress**
Run: `node scripts/test-sheet-drive-relay-contract.cjs`
Expected: FAIL on next assertion (missing template `MediaRelay.template.js`).

**Step 5: Atomic Commit**
Run: `git add .agent/patterns/sheet-drive-media-relay.md .agent/standards-catalog.json` && `git commit -m "feat(governance): define canonical STD-DRIVE-MEDIA-RELAY-001 standard pattern"`

---

### Task 1.3: Turnkey Parameterized Templates & Schema Spec

**Files:**
- Create: `.agent/skills/sheet-drive-relay/templates/MediaRelay.template.js`
- Create: `.agent/skills/sheet-drive-relay/templates/appsscript.json`
- Create: `.agent/skills/sheet-drive-relay/templates/deploy-gas-relay.cjs`
- Create: `.agent/skills/sheet-drive-relay/resources/SHEET_SCHEMA_SPEC.md`

**Step 1: Write failing test**
Covered by Task 1.1 assertions.

**Step 2: Run test to verify it fails**
Run: `node scripts/test-sheet-drive-relay-contract.cjs`
Expected: FAIL on missing template files.

**Step 3: Write minimal implementation**
1. Author `MediaRelay.template.js`:
   - Config block with `{{ROOT_FOLDER_ID}}`, `{{SPREADSHEET_ID}}`, `{{AUTHORIZED_EMAILS}}`.
   - `doPost(e)` accepting base64 image data and metadata (`module`, `event`, `category`, `fileName`, `uploaderEmail`, `itemId`).
   - RBAC check against `{{AUTHORIZED_EMAILS}}` and optional `Config_Settings` allowlist.
   - `getRoutingTable()` with 10-minute in-memory `CacheService` TTL.
   - `resolveOrCreateFolder(subfolderPath)` recursively creating Drive folders and caching folder IDs.
   - `_logUploadToSheet(entry)` appending 12 metadata dimensions to `Upload_Ledger`.
   - Standard JSON envelope response `{ success: true, fileId, fileUrl, cdnUrl, subfolderPath }`.
2. Author `appsscript.json`:
   - V8 runtime, timeZone, exceptions logging, webapp execution permissions.
3. Author `deploy-gas-relay.cjs`:
   - Cross-platform Clasp deployer with pre-flight `node -c` syntax check and clear instructions if `.clasp.json` is missing.
4. Author `resources/SHEET_SCHEMA_SPEC.md`:
   - Column schemas for `Config_Settings`, `Config_Routing`, and `Upload_Ledger`.

**Step 4: Run test to verify it passes**
Run: `node scripts/test-sheet-drive-relay-contract.cjs`
Expected: PASS with 0 errors (all 6 contract assertions green).

**🔍 Validation Gate (VG-1.3)**:
1. (Binary) Exit code 0 AND output matches "All Sheet-Drive Relay template and contract checks passed".

**🚦 Decision Node (DN-1.3)**:
- **Pass**: Proceed to Step 5.
- **Fail (1st)**: Fix placeholder substitution or syntax error and re-run.
- **Fail (2nd)**: Halt. Surface failure output to user.

**Step 5: Atomic Commit**
Run: `git add .agent/skills/sheet-drive-relay/ scripts/test-sheet-drive-relay-contract.cjs` && `git commit -m "feat(sheet-drive-relay): bundle turnkey parameterized templates and contract verifier"`

---

## Verification Plan

### Automated Tests
1. **Contract & Template Verification**:
   ```bash
   node scripts/test-sheet-drive-relay-contract.cjs
   ```
2. **Governance Wiring Verification**:
   ```bash
   npm run verify:governance-wiring:all
   ```

### Manual Verification
- Verify that substituted `MediaRelay.js` passes `node -c` without any syntax warnings.
- Verify that `.agent/standards-catalog.json` passes JSON validation.
