# SK-015: Universal Sheet-Drive Media Relay Skill, Standard & Portable Package (`STD-DRIVE-MEDIA-RELAY-001`)

## 📊 Metadata

- **Category**: ARCHITECTURE / GOOGLE_DRIVE_RELAY / SAP_PORTABLE_SKILL
- **Priority**: HIGH
- **Status**: PLANNING
- **Estimate**: 4 hours
- **Target Release**: v2.7.0
- **Risk Level**: LOW (Strictly additive governance capability, zero breaking changes to client runtime)
- **Owner**: goldenage399
- **Cluster**: `[INFRASTRUCTURE]` & `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-008  # Universal Canonical Planning Engine & Cross-Repo SAP Synchronization
    - SK-011  # Multi-Provider Cloud Storage & Google Drive Intake Pipeline
  related:
    - AC-DEC-2026-051  # Multi-Provider Cloud Storage & Google Drive Intake Pipeline
    - AC-DEC-2026-052  # PIOps Drive Relay Webhook Leverage & Standalone Media Architecture
    - AC-DEC-2026-053  # End-to-End Dependency & Impact Radius Blueprint
    - AC-DEC-2026-054  # Sheet-Configured Drive Media Hierarchy & Automated Deployment
    - AC-DEC-2026-055  # Universal Sheet-Drive Media Relay Skill, Portable Pattern & SAP Sync Package
    - docs/references/SPEC-ARCH-CLOUD-STORAGE-INTAKE-001.md
    - .agent/workflows/sap-sync.md
  blocks:
    - SK-014  # SK-014 local instance directly instantiates this canonical SAP standard
```

---

## 🎯 Goal

Elevate the Google Drive Media Relay, dynamic Google Sheet routing engine, 12-dimension audit ledger, and automated clasp deployment pipeline into a **reusable SAP capability** (`STD-DRIVE-MEDIA-RELAY-001` / `.agent/skills/sheet-drive-relay`) that can be instantiated with one command in ANY repository in the ecosystem (e.g. `Task-Dashboard`, `Capsicum`, `BMS`, `UG-Farmhouse`, `QSR`):
1. **Canonical Standard Specification (`STD-DRIVE-MEDIA-RELAY-001`)**: Establish `.agent/patterns/sheet-drive-media-relay.md` formalizing the 5 Universal Invariants:
   - *Zero-CORS Simple POST Relay Protocol* (`headers: { 'Content-Type': 'text/plain' }` + `redirect: 'follow'`).
   - *Browser-Side 2K QHD Offscreen Canvas Budgeting* (max 2048px, 0.88 quality, <1.2MB payload, 0 timeout risk).
   - *Two-Tier Sheet Control Plane* (`Config_Routing` + `Upload_Ledger`).
   - *Dynamic Hierarchical Folder Auto-Provisioning* with 10-Minute `CacheService` TTL.
   - *Universal 2K UserContent CDN Resolution* (`https://lh3.googleusercontent.com/d/{fileId}=w2048`).
2. **Turnkey Parameterized Templates**: Bundle fully parameterized, standalone scripts in `.agent/skills/sheet-drive-relay/templates/`:
   - `MediaRelay.template.js`: Headless GAS webhook with dynamic routing, folder creation, and ledger logging.
   - `appsscript.json`: Production GAS manifest.
   - `deploy-gas-relay.cjs`: Cross-platform Node.js deployer with pre-flight syntax checks (`node -c`).
   - `resources/SHEET_SCHEMA_SPEC.md`: Declarative specification for all 3 control tabs (`Config_Settings`, `Config_Routing`, `Upload_Ledger`).
3. **Universal Operational Skill (`sheet-drive-relay`)**: Author `.agent/skills/sheet-drive-relay/SKILL.md` (with isolated SAP boundary tags `<!-- shared:std.agent.sheet-drive-relay.core:start/end -->`) and mirror to `.claude/skills/sheet-drive-relay/SKILL.md`.
4. **Portable Workflow**: Author `.agent/workflows/portable/sheet-drive-media-relay.md` providing slash-command interactive orchestration.
5. **Cross-Repo SAP Integration**: Register in `.agent/standards-catalog.json`, `.agent/skill-router.yaml`, `CLAUDE.md`, and `GEMINI.md`, verified green by `verify:governance-wiring:all`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Canonical Standard Pattern & Turnkey Templates
- [x] **Canonical Pattern (`STD-DRIVE-MEDIA-RELAY-001`)**: Author `.agent/patterns/sheet-drive-media-relay.md` with full PACT-001 activation contract frontmatter, detailing the 5 invariants, client payload contracts, and error recovery ladders.
- [x] **Standards Catalog Update**: Register `STD-DRIVE-MEDIA-RELAY-001` in `.agent/standards-catalog.json`.
- [x] **Turnkey Parameterized Templates**:
  - Author `.agent/skills/sheet-drive-relay/templates/MediaRelay.template.js` parameterized with `{{ROOT_FOLDER_ID}}`, `{{SPREADSHEET_ID}}`, and `{{AUTHORIZED_EMAILS}}`.
  - Author `.agent/skills/sheet-drive-relay/templates/appsscript.json` (GAS manifest).
  - Author `.agent/skills/sheet-drive-relay/templates/deploy-gas-relay.cjs` (cross-platform deployment orchestrator).
  - Author `.agent/skills/sheet-drive-relay/resources/SHEET_SCHEMA_SPEC.md` (canonical sheet schema).
- [x] **Validation Gate (VG-1)**: Author automated contract test `scripts/test-sheet-drive-relay-contract.cjs` verifying template placeholders, parameter replacement, syntax validation, and schema conformance (6/6 tests passing).

### Phase 2: Universal Skill Scaffolding & Dual Mirror
- [ ] **Universal Operational Skill**: Author `.agent/skills/sheet-drive-relay/SKILL.md` structured with SAP core boundaries `<!-- shared:std.agent.sheet-drive-relay.core:start/end -->`, documenting setup, templating, deployment, client integration, and troubleshooting.
- [ ] **Dual Mirror Scaffolding**: Mirror `.agent/skills/sheet-drive-relay/SKILL.md` to `.claude/skills/sheet-drive-relay/SKILL.md` with 100% byte parity.
- [ ] **Validation Gate (VG-2)**: Automated parity check verifying exact sync between `.agent` and `.claude` skill definitions.

### Phase 3: Portable Workflow, SAP Sync Registration & Governance Verification Gate
- [ ] **Portable Workflow Authoring**: Author `.agent/workflows/portable/sheet-drive-media-relay.md` with interactive step-by-step guidance.
- [ ] **Skill Router & Manuals Wiring**: Register `sheet-drive-relay` in `.agent/skill-router.yaml` and reference in `CLAUDE.md`, `GEMINI.md`, and `.agent/workflows/sap-sync.md`.
- [ ] **Validation Gate (VG-3)**: Execute `npm run verify:governance-wiring:all` with 100% green pass and zero unreferenced artifacts.
