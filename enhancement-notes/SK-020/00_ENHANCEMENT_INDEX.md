# SK-020: Customary Family Obligation Register & Multi-Domain Fulfilment Pipeline (OBL-001)

## 📊 Metadata

- **Category**: DOMAIN_MODEL / RITUAL_OBLIGATIONS / DATA_PIPELINE
- **Priority**: HIGH
- **Status**: PLANNING
- **Estimate**: 12 hours
- **Target Release**: v2.9.0
- **Risk Level**: MEDIUM (Touches cross-cutting domains: Rituals, Shopping, Samagri, Asset Custody, Finance)
- **Owner**: goldenage399
- **Cluster**: `[BUSINESS-LOGIC]` & `[GOVERNANCE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-001  # Domain Workflow & SSOT Reconciliation Adaptation
    - SK-002  # Hub-and-Spoke Documentation Architecture (P-SSOT-DOCS)
    - SK-008  # Universal Canonical Planning Engine (P-UNIVERSAL-PLANNING-ENGINE-001)
  related:
    - AC-DEC-2026-058  # Ratification of OBL-001 Family Obligation Model
    - 02_RITUALS_CULTURE/HUB.md
    - 03_PEOPLE_GUESTS/HUB.md
    - 04_PROCUREMENT_VENDORS/shopping_and_trousseau/SPEC-PROC-TROUSSEAU-001.md
    - 06_FINANCE_COMMERCIALS/cash_logistics.md
  blocks:
    - None
```

---

## 🎯 Goal

Codify, validate, and operationalize the handwritten family-to-family ritual, gifting, and logistical obligations (*Vidhi Dayitva / Bhara / Sara*) into the Marriage OS:
1. **Canonical Entity Scaffolding (`OBL-###`)**:
   - Establish `02_RITUALS_CULTURE/obligations/` as the single source of truth for customary obligations.
   - Decouple social covenants from commercial shopping (`TRS`), liturgical materials (`SAM`), precious assets (`AST`), and monetary outflows (`PAY`).
2. **Deterministic Data Contract & State Separation**:
   - Formalize the two-tier state machine: `lifecycle_status` (Identified → Agreed → Procuring → Staged → Handed_Over) vs `spec_status` (Fully_Specified, TBD_Family_Choice, Source_Unclear, Source_Redacted, Pending_Family_Confirmation).
   - Guarantee zero silent normalization of Odia cultural terminology and zero invented headcount/quantity totals.
3. **Multi-Domain Compilation & Projection Engine**:
   - Build automated schema validator (`scripts/test-obligation-contract.cjs`) and projection compiler (`scripts/compile-obligations.cjs`) to emit downstream catalog additions, samagri line items, and executive summaries without duplicate SSOTs.
4. **40+ Item Ingestion**:
   - Losslessly import the 40+ obligations across Event 1 (Engagement), Event 2 (Before Marriage), and Event 3 (After Marriage) into verified markdown records.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Architecture Ratification, Spoke Directory Scaffolding & Template Baseline
- [x] **Directory Scaffolding**: Create `02_RITUALS_CULTURE/obligations/` and wire into `02_RITUALS_CULTURE/HUB.md`.
- [x] **Obligation Template**: Create `02_RITUALS_CULTURE/obligation_template.md` adhering strictly to `AC-DEC-2026-058`.
- [x] **Specification Spoke**: Commit canonical specification `docs/references/SPEC-ARCH-FAMILY-OBLIGATION-001.md`.
- [x] **Validation Gate (VG-1)**: Execute `npm run test:obligations` verifying valid YAML schema syntax and frontmatter contracts (100% green).

### Phase 2: Schema Validation Suite & State Machine Invariants
- [x] **Schema Validator**: Implement `scripts/test-obligation-contract.cjs` verifying:
  - Required fields, actor model (derived direction), line-item schemas, and exchange cluster pairings.
  - Invalid state combination guards (e.g. rejecting `Handed_Over + Source_Unclear`).
  - Cash formula honesty invariant (no hardcoded totals when headcount is null).
- [x] **Validation Gate (VG-2)**: Run automated test suite against synthetic valid and invalid fixture records with 100% assertion coverage.

### Phase 3: Downstream Compilation Engine & Master Views
- [ ] **Master Aggregator**: Create `scripts/compile-obligations.cjs` generating derived views:
  - `02_RITUALS_CULTURE/obligations/family_obligations_master.md`
  - Cross-domain projections (shopping queue in `04_PROCUREMENT_VENDORS/`, samagri needs in `02_RITUALS_CULTURE/`, cash desk requirements in `06_FINANCE_COMMERCIALS/`).
- [ ] **Validation Gate (VG-3)**: Verify deterministic compiler output and zero byte drift on rerun.

### Phase 4: Full 49-Obligation Dataset Ingestion & Anti-Duplication Audit
- [ ] **Dataset Import**: Ingest all 49 obligations into `02_RITUALS_CULTURE/obligations/OBL-001.md` through `OBL-049.md` preserving verbatim provenance.
- [ ] **Anti-Duplication Audit**: Verify that no duplicate records exist across TRS/SAM/AST/PAY.
- [ ] **Validation Gate (VG-4)**: Execute `node scripts/test-obligation-contract.cjs` (100% green across all 49 records).

### Phase 5: Shopping Tab SDCA Component Architecture
- [ ] **Markup Component**: Create `shopping_src/components/obligations_view.html` with segmented filter bar, milestone accordions, and card layouts.
- [ ] **Modular Styles**: Create `shopping_src/styles/10_obligations.css` (<500 lines, container queries, mobile 300px responsive).
- [ ] **Subnav Button**: Add `[📜 Family Obligations (49)]` mode to `#catalogSubnavStrip` in `shopping_src/components/body.html`.
- [ ] **Validation Gate (VG-5)**: Execute `npm run verify:modular-architecture` (passes 500-line modular limit).

### Phase 6: Controller Wiring, Deep-Link State & WhatsApp Sharing
- [ ] **Controller Integration**: Wire `window.setCatalogSubView('obligations')`, subview filters, and deep-linking into `shopping_src/scripts/controller.js`.
- [ ] **Bi-Directional Badges**: Implement click handlers linking catalog items (`[📜 Fulfills OBL-###]`) and obligation cards (`[🛍️ Sourced via TRS-###]`).
- [ ] **WhatsApp Sharing**: Add WhatsApp sharing template for family consultation.
- [ ] **Validation Gate (VG-6)**: Verify URL state updating (`?subview=obligations&obl=OBL-001`) and interactive filtering.

### Phase 7: Automated Byte Parity & Governance Verification
- [ ] **Compilation**: Run `node shopping_src/build.cjs --all` emitting root and public HTML distributions.
- [ ] **Byte Parity**: Verify 100% byte parity between `/` and `/public/`.
- [ ] **Pre-Flight Gates**: Execute `npm run test:shopping`, `npm run test:obligations`, `npm run verify:modular-architecture`, and `npm run verify:governance-wiring:all` (100% green).
- [ ] **Validation Gate (VG-7)**: All pre-flight suites pass without errors or regressions.

