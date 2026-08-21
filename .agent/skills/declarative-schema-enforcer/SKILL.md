---
name: declarative-schema-enforcer
description: >
  Enforce declarative field schemas over imperative field lists (Protocol 22).
  Use when writing 5+ fields to a sheet.
  Prevents silent data loss from forgotten fields.
---

## Goal

Eliminate "forgotten field" bugs by using schema-driven writes.

## The Rule

**Trigger**: Any function with 5+ `setVal()`, `setUpdate()`, or field assignment calls.

### ❌ Anti-Pattern (Imperative)

```javascript
// Easy to forget a field!
setVal("Cash_Sale", data.cashSale);
setVal("UPI_Sale", data.upiSale);
setVal("Card_Sale", data.cardSale);
// Forgot 'UPI_Settlement_Proof_URL' → silent data loss
```

### ✅ Required Pattern (Declarative)

```javascript
const STEP4_FIELDS = {
  cashSale: { column: "Cash_Sale", type: "number" },
  upiSale: { column: "UPI_Sale", type: "number" },
  cardSale: { column: "Card_Sale", type: "number" },
  upiSettlementProofUrl: { column: "UPI_Settlement_Proof_URL", type: "string" },
};

// Schema-driven write - impossible to forget a field
for (const [key, schema] of Object.entries(STEP4_FIELDS)) {
  if (data[key] !== undefined) {
    updates[colMap[schema.column]] = data[key];
  }
}
```

## Validation Checklist

When you see 5+ field writes:

1. ☐ Is there a `*_FIELDS` schema constant?
2. ☐ Does the schema include ALL fields for this step?
3. ☐ Is the write loop iterating over the schema?
4. ☐ Are INSERT and UPDATE paths using the same schema?

## ❌ Example Violation

**User**: "Add `paidBy` to the Step 4 save function."

**Agent (Bad)**: Adds `setVal('Paid_By', data.paidBy)` inline.

**This skill BLOCKS**: "Add `paidBy` to `STEP4_FIELDS` schema instead of inline `setVal()`."

## ➡️ What's Next?

After this skill passes:

- Run **`contract-api-validator`** → Verify `CONTRACT.json` includes the field
- Run **`backend-test-generator`** → Create test for new field
