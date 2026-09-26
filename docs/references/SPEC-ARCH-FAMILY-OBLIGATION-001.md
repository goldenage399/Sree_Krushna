# Canonical Specification: Customary Family Obligation Register & Multi-Domain Fulfilment Architecture

**Standard Identifier:** `STD-FAMILY-OBLIGATION-001` / `P-FAMILY-OBLIGATION-001` / `P-SSOT-DOCS`  
**Governing Council Decisions:** [`AC-DEC-2026-061`](../../User_Created/Discussion%20Threads/Council/260927_arch_council_family_obligation_register_and_fulfilment_pipeline.md) & [`AC-DEC-2026-062`](../../User_Created/Discussion%20Threads/Council/260927_arch_council_shopping_tab_family_obligation_integration.md)  
**Ticket Ref:** `SK-020` ([`enhancement-notes/SK-020/00_ENHANCEMENT_INDEX.md`](../../enhancement-notes/SK-020/00_ENHANCEMENT_INDEX.md))  
**Target Release:** v2.9.0  
**Parent Hub:** [`02_RITUALS_CULTURE/HUB.md`](../../02_RITUALS_CULTURE/HUB.md)  

---

## 1. Domain Purpose & Context

In traditional Odia weddings (*Odia Hindu / Brahmin customs*), the union represents not only the sacred joining of the couple but an extensive matrix of reciprocal covenants, customary duties (*Vidhi Dayitva*), and ceremonial respect offerings between the two extended families (*Bhara*, *Sara*, *Bandhu Daksa*, *Batabasana*, *Ahiya Manduli*, *Samdhi Milan*, *Nananda Putuli*, *Saga Macha*).

Historically, these customary obligations have either been conflated into generic retail shopping lists (causing severe catalog clutter) or tracked across informal paper notes (risking embarrassing logistical omissions on the wedding day).

`STD-FAMILY-OBLIGATION-001` establishes `02_RITUALS_CULTURE/obligations/` as the single canonical source of truth for customary family obligations (`OBL-###`), decoupling social covenants from commercial procurement (`TRS`), liturgical materials (`SAM`), precious asset custody (`AST`), and financial disbursements (`PAY`).

---

## 2. Prime Invariants

### 2.1 Domain Decoupling & Separation of Concerns (`INV-OBL-DECOUPLE-001`)
*   **The Covenant (`OBL-###`)**: Documents *who owes what to whom* according to cultural custom, the ritual context, assigned custodians, and handover timing.
*   **Commercial Shopping (`TRS-###`)**: Documents *where to buy, size, fabric, trial schedule, and retail pricing*.
*   **Liturgical Samagri (`SAM-###`)**: Documents *ritual consecration, sacred mantras, and priest coordination*.
*   **Precious Assets (`AST-###`)**: Documents *hallmarked gold/silver weight (g), bank locker custody, and security transfer logs*.
*   **Monetary Disbursements (`PAY-###`)**: Documents *bank transfers, cash vouchers, and currency denomination logs*.

Zero duplication of fields is permitted across these domains. Downstream domains reference obligations via foreign keys (`obligation_ref: "OBL-###"`).

### 2.2 Epistemic Honesty Invariant (`INV-EPISTEMIC-HONESTY-001`)
*   **Zero Invented Quantities or Headcounts**: Whenever source notes leave headcounts or quantities unconfirmed (e.g. "₹5,000 per head excluding family members", or "Dress for Bacha Party"), the system stores `headcount: null` and `projected_total_inr: null`. No fabricated multiplier totals are committed.
*   **Preservation of Verbatim Provenance**: Customary Odia terms (*Batabasana*, *Ahiya Manduli*, *Bandhu Daksa*, *Samdhi Milan*, *Nananda Putuli*, *Guin Chada*, *Saga Macha*) must never be normalized into generic English terms. Source manuscript text is recorded verbatim in frontmatter (`verbatim_provenance.raw_source_text`).
*   **Struck-Out Items Preserved**: Items blacked out or struck out in source sheets remain recorded with `spec_status: "Source_Redacted"` rather than silently dropped.

### 2.3 Runtime Direction Derivation (`INV-DERIVED-DIRECTION-001`)
Direction is never stored as a raw static string (e.g. `"bride_to_groom"`). Instead, direction is derived at runtime from the actor model:
$$\text{Direction} = \text{obligor.family} \longrightarrow \text{recipient.family}$$
Allowed family values are strictly constrained to: `groom`, `bride`, `joint`, `external`.

---

## 3. Two-Tier Orthogonal State Machine

To prevent procedural deadlocks while maintaining operational safety, procurement lifecycle is strictly decoupled from specification clarity:

```
LIFECYCLE STATUS (The Social Covenant)
[Identified] ──► [Agreed] ──► [Procuring] ──► [Staged] ──► [Handed_Over]
     │               │             │             │
     └───────────────┴─────────────┴─────────────┴──────► [Waived]

SPECIFICATION STATUS (Physical Payload Clarity)
• Fully_Specified
• TBD_Family_Choice
• Source_Unclear
• Source_Redacted
• Pending_Family_Confirmation
```

### Invalid Combination Guards:
1.  An obligation CANNOT transition to `Staged` or `Handed_Over` if its `spec_status` is `Source_Unclear` or `Source_Redacted`.
2.  An obligation CANNOT transition to `Handed_Over` unless its assigned custodian (`PER-###`) confirms physical handover at the ritual milestone.

---

## 4. Reciprocal Exchange Architecture (`EXC-###`)

Customary exchanges that occur synchronously between families (such as *Samdhi Milan* dress exchange between Baba and Daddy) are modeled as **two autonomous atomic obligations** bound together by a shared virtual cluster identifier:

```yaml
exchange_cluster:
  is_exchange: true
  cluster_id: "EXC-001"
  peer_obligation_id: "OBL-022"
  synchronous_handover: true
```

*   **Autonomous Procurement**: Each family manages its own shopping, fabric trials, and packaging independently.
*   **Synchronous Execution Verification**: At the physical venue (`GATE-02` / Mandap entrance), the command controller verifies that both peer obligations are `Staged` before initiating the ritual handshake.

---

## 5. Reconciled Customary Rituals: Batabarana & Ahiya Manduli

### 5.1 Batabasana / Batabarana (`EVT-004`, 10:30 AM)
*   **Tradition**: When the Groom arrives at the venue entrance, the Bride's family formally welcomes him at the doorstep with customary attire and precious assets.
*   **Obligor**: Bride's Family (Lead: Daddy / Bride's Father)
*   **Recipient**: Groom (`PER-002`)
*   **Customary Payload**: Suit (3-piece executive suit), Gold Chain, Gold Mudi (Ring), Gold Bracelet.

### 5.2 Ahiya Manduli Presentation (`EVT-004`, 10:30 AM Entrance Welcome)
*   **Tradition**: Immediately following the Batabarana welcoming aarti, the Groom's family presents the sacred **Ahiya Manduli** (*Saree for Mummy*) to the Bride's Mother (*Mummy* / Smt. Tapaswini, the *Ahiya* / *Sumangali* who welcomes the groom).
*   **Obligor**: Groom's Family (Lead: Groom's Parents)
*   **Recipient**: Bride's Mother ("Mummy" — Smt. Tapaswini / `PER-006`)
*   **Customary Payload**: Consecrated pure silk saree (*Samandhi Vastra*) + auspicious shringar presentation.
*   **Procurement SKU**: Satisfied by **`TRS-SA-01`** (*Samandhi Vastra — Mother-in-Law Silk Saree from Boyanika*) in the Trousseau Catalog.
*   **Liturgical Sequence**: Codified as Step 3 of [`RIT-004: Baranugam & Barat Reception`](../../02_RITUALS_CULTURE/specs/RIT-004_baranugam.md).

---

## 6. Multi-Surface Projection & Shopping Registry Integration (`AC-DEC-2026-062`)

Per Architecture Council Ruling `AC-DEC-2026-062` / `UI-DEC-2026-047`, obligations are integrated into the interactive Shopping Registry (`shopping-registry.html`) using **Option C: Faceted Subview Navigation**:
1.  **Additive Subview Mode**: A 6th operating mode `[📜 Family Obligations (49)]` is added to `#catalogSubnavStrip` (`data-subview="obligations"`).
2.  **Zero Catalog Inflation**: The 44-item Canonical Trousseau Catalog (`SPEC-PROC-TROUSSEAU-001`) remains strictly 44/44 items, guaranteeing 100% pass on `npm run test:shopping`.
3.  **Bi-Directional Deep-Linking**:
    *   Catalog cards fulfilling an obligation display a tactile badge `[📜 Fulfills OBL-###]`.
    *   Obligation cards display `[🛍️ Sourced via TRS-###]` linking back to store and trial status.
4.  **Segmented Filtering**: Coordinators can filter obligations by family side: `All`, `Bride ⟶ Groom`, `Groom ⟶ Bride`, `Unresolved`.
5.  **100% Byte Parity**: Root and `/public/` distributions remain byte-identical via the SDCA compiler (`shopping_src/build.cjs`).

---

## 7. Downstream Projection Matrix

| Fulfillment Channel | Target Domain Entity | Trigger Condition | Source of Truth (SSOT) | Deep-Link Foreign Key |
| :--- | :--- | :--- | :--- | :--- |
| **`shopping`** | `TRS-###` in `shopping_items.jsonl` | Item requires retail purchase (sarees, suits, luggage). | `TRS-###` | `commercial_shopping_ref: "TRS-###"` |
| **`samagri`** | `SAM-###` in `02_RITUALS_CULTURE/` | Item is a sacred consumable (Gua, Pana, Haldi, Sindoor). | `SAM-###` | `samagri_checklist_ref: "SAM-###"` |
| **`asset`** | `AST-###` in `04_PROCUREMENT_VENDORS/`| Item is gold/silver requiring locker custody. | `AST-###` | `asset_custody_ref: "AST-###"` |
| **`cash`** | `cash_logistics.md` & `PAY-###` | Cash shagun envelopes or dakshina. | `06_FINANCE_COMMERCIALS/` | `finance_ledger_ref: "PAY-###"` |
| **`logistics`** | Run sheets & `VEN-###` | Presentation luggage trunks, delivery vans. | `05_OPERATIONS_LOGISTICS/` | `logistical_custody.staging_location` |
