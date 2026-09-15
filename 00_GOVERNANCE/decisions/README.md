---
hub: 00_GOVERNANCE/HUB.md
---

# ⚖️ Decision Register (`DEC-###`)

This directory contains formal **Decision Records (`DEC-###`)** for all major choices regarding venues, dates, vendor selections, policy agreements, and budget commitments.

---

## Decision Index

| ID | Title | Date Decided | Status | Financial Impact (₹) | Deciders |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`DEC-002`](./DEC-002_hotel_baseline_inspection_and_printable_checklist.md) | Ratification of On-Site Hotel Inspection Checklist & Printable 4-Page Field Audit Dossier | 2026-09-13 | Approved | ₹ 0 | Architecture Council, Ops Lead, Logistics Lead |
| [`DEC-003`](./DEC-003_dynamic_ui_lifecycle_and_modal_dismissibility_contract.md) | Dynamic UI Lifecycle, Script Sequencing, and 3-Trigger Modal Dismissibility Standard (STD-UI-LIFECYCLE-001) | 2026-09-15 | Approved | ₹ 0 | Architecture Council, UI/UX Council, Lead Architect |

---

## Standard Decision Template

```markdown
---
id: DEC-###
title: "Brief title of decision"
category: "Venue | Catering | Decor | Date | Policy | Attire | Photography"
status: "Proposed | Under_Review | Approved | Frozen"
date_decided: "YYYY-MM-DD"
decision_makers:
  - "PER-###"
  - "PER-###"
financial_impact_inr: 0
downstream_artifacts:
  - "CTR-###"
  - "TSK-###"
---

# Decision Context
Explain the background, why a decision is needed, and constraints.

## Options Evaluated
1. **Option A:** Pros, Cons, Cost.
2. **Option B:** Pros, Cons, Cost.

## Final Choice & Rationale
State clearly what was agreed and why.

## Action Items & Next Steps
- [ ] TSK-###: Action description (Owner: PER-###, Due: YYYY-MM-DD)
```
