# SK-016: Universal Google Apps Script CI/CD Engine, Standard & Portable Package (`STD-GAS-CICD-001` / `PKG-005`)

## 📊 Metadata

- **Category**: ARCHITECTURE / DEPLOYMENT / SAP_PORTABLE_SKILL
- **Priority**: HIGH
- **Status**: READY (Planned)
- **Estimate**: 4 hours
- **Target Release**: v2.8.0
- **Risk Level**: LOW (Strictly additive infrastructure & deployment automation capability, zero breaking changes to client runtime)
- **Owner**: goldenage399
- **Cluster**: `[INFRASTRUCTURE]` & `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-008  # Universal Canonical Planning Engine & Cross-Repo SAP Synchronization
    - SK-015  # Universal Sheet-Drive Media Relay Skill, Standard & Portable Package
  related:
    - AC-DEC-2026-054  # Sheet-Configured Drive Media Hierarchy & Automated Deployment
    - AC-DEC-2026-055  # Universal Sheet-Drive Media Relay Skill, Portable Pattern & SAP Sync Package
    - .agent/workflows/sap-sync.md
  blocks:
    - None
```

---

## 🎯 Goal

Elevate Google Apps Script deployment from a localized script into a **universal, portable developer capability** (`STD-GAS-CICD-001` / `PKG-005`). Formalizes the **Hybrid Model** evaluated and chosen during Prompt Clarity:
1. **Canonical Standard Specification (`STD-GAS-CICD-001`)**: Establish `.agent/patterns/universal-gas-deployment-engine.md` formalizing:
   - *In-Place Version Bump Invariant (`INV-GAS-VERSION-BUMP-001`)*: Mandates `clasp deploy --deploymentId <id> --description "<desc>"` to update versions in-place without spawning new URLs or altering client configurations.
   - *Cross-Platform Node.js Execution (`INV-GAS-NODE-RUNNER-001`)*: Native `.cjs` runner executing identically on Windows, Linux, macOS, and CI pipelines (eliminating PowerShell-only dependencies).
   - *Multi-Stage Pre-Flight Gate (`INV-GAS-PREFLIGHT-GATE-001`)*: Static AST syntax verification (`node -c`), manifest validation (`appsscript.json`), and credential discovery (`.clasp.json`).
   - *Declarative Multi-Target Routing (`INV-GAS-MULTI-TARGET-001`)*: `--target-dir` flag and optional `.gasrc.json` configuration.
   - *Dual-Mirror Parity & SAP Registration (`INV-GAS-SAP-SYNC-001`)*: 100% byte parity across `.agent` and `.claude`.
2. **Turnkey Parameterized Templates**: Standalone scripts in `.agent/skills/universal-gas-deployer/templates/`:
   - `deploy-gas.cjs`: Universal deployment orchestrator with automated version bumping and URL output.
   - `appsscript.json`: Production GAS manifest.
   - `.clasp.json.template`: Parameterized clasp config.
3. **Universal Operational Skill (`universal-gas-deployer`)**: Author `.agent/skills/universal-gas-deployer/SKILL.md` (with isolated SAP boundaries) and mirror to `.claude/skills/universal-gas-deployer/SKILL.md`.
4. **Portable Workflow**: Author `.agent/workflows/portable/universal-gas-deployer.md` for slash-command orchestration.
5. **Legacy Reconciliation**: Modernize and formally alias `.agent/skills/gas-deploy-guard` to delegate to `universal-gas-deployer`.
6. **Cross-Repo SAP Integration**: Register as `PKG-005` in `.agent/workflows/sap-sync.md`, `.agent/standards-catalog.json`, and `.agent/skill-router.yaml`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Canonical Standard Pattern, Test Suite & Turnkey Templates
- [ ] **Canonical Pattern (`STD-GAS-CICD-001`)**: Author `.agent/patterns/universal-gas-deployment-engine.md` with PACT-001 activation contract.
- [ ] **Standards Catalog Update**: Register `STD-GAS-CICD-001` in `.agent/standards-catalog.json`.
- [ ] **Turnkey Templates**: Author `deploy-gas.cjs`, `appsscript.json`, and `.clasp.json.template` in `.agent/skills/universal-gas-deployer/templates/`.
- [ ] **Validation Gate (VG-1)**: Author automated contract test `scripts/test-universal-gas-deployer-contract.cjs` verifying template placeholders, parameter replacement, syntax validation, and manifest conformance (5/5 tests passing).

### Phase 2: Universal Skill Scaffolding, Portable Workflow & Dual Mirror
- [ ] **Universal Operational Skill**: Author `.agent/skills/universal-gas-deployer/SKILL.md` with SAP core boundaries `<!-- shared:std.agent.universal-gas-deployer.core:start/end -->`.
- [ ] **Dual Mirror Scaffolding**: Mirror to `.claude/skills/universal-gas-deployer/SKILL.md` with 100% byte parity.
- [ ] **Portable Workflow**: Author `.agent/workflows/portable/universal-gas-deployer.md`.
- [ ] **Validation Gate (VG-2)**: Automated parity check verifying exact sync between `.agent` and `.claude` skill definitions (100% byte parity verified).

### Phase 3: Legacy Reconciliation, Composition & Root Runner
- [ ] **Modernize Legacy Guard**: Update `.agent/skills/gas-deploy-guard/SKILL.md` to formally alias and delegate to `universal-gas-deployer`.
- [ ] **Instantiate Root Runner**: Place `scripts/deploy-gas.cjs` at repository root.
- [ ] **Compose with SK-015**: Ensure `scripts/deploy-gas-relay.cjs` delegates to or shares the core engine of `deploy-gas.cjs`.
- [ ] **Validation Gate (VG-3)**: Dry-run `node scripts/deploy-gas.cjs --target-dir=backend_gas` completes with 0 errors.

### Phase 4: SAP Synchronization Manifest, Governance Wiring & Verification
- [ ] **SAP Sync Integration**: Register **`PKG-005`** alongside **`PKG-004`** in `.agent/workflows/sap-sync.md`.
- [ ] **Skill Router & Operating Manuals**: Register `universal-gas-deployer` in `.agent/skill-router.yaml`, `CLAUDE.md`, and `GEMINI.md`.
- [ ] **Enhancement Registration**: Update `ENHANCEMENT-MASTER-REGISTRY.md` and increment `enhancement-config.json` (`next_id: 17`).
- [ ] **Validation Gate (VG-4)**: Execute `npm run verify:governance-wiring:all` with 100% green pass and zero unreferenced artifacts.
