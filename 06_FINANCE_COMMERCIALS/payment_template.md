---
hub: 06_FINANCE_COMMERCIALS/HUB.md
id: PAY-###
contract_id: "CTR-###"
vendor_id: "VDR-###"
category: "Venue | Catering | Decor | Photo | Attire | Priest | Transport"
amount_inr: 0
payment_type: "Advance | Milestone | Final_Settlement | Tip_Dakshina"
payment_mode: "UPI | Bank_Transfer_NEFT | Cheque | Cash"
payment_date: "YYYY-MM-DD"
paid_by_person_id: "PER-###"
transaction_ref: "UPI Ref / Bank UTR / Cheque #"
receipt_doc_link: "07_DOCUMENTS_ARCHIVE/..."
status: "Pending | Paid | Reconciled"
---

# 💳 Payment Record: PAY-###

## 1. Transaction Details
- **Vendor:** [`{{vendor_id}}`](file:///d:/GitHub_Repo/Sree_Krushna/04_PROCUREMENT_VENDORS/vendors/)
- **Amount:** ₹ `{{amount_inr}}`
- **Date Paid:** `{{payment_date}}`
- **Paid By:** [`{{paid_by_person_id}}`](file:///d:/GitHub_Repo/Sree_Krushna/03_PEOPLE_GUESTS/directory/)

## 2. Settlement Verification & Receipt
- **Reference UTR:** `{{transaction_ref}}`
- **Signed Voucher / Receipt:** Stored in `07_DOCUMENTS_ARCHIVE/`
