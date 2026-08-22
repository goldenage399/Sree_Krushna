---
description: Streamlined Frontend Knowledge Harvest & Registration Flow
---

# /harvest-frontend-knowledge-lite

**Purpose**: Quickly capture and register newly discovered visual, layout, responsive, or behavioral styling insights without standard 9-phase overhead.

---

## Step 1 — Worthiness Filter
Only capture if the styling discovery is **non-obvious** (took debugging to locate, or could catch other developers off guard) AND **reusable** (will prevent future layout/styling regressions). If it's a simple, obvious class addition, skip.

## Step 2 — Record & Document
Add a concise entry directly into the **[Frontend Knowledge Hub](file:///d:/GitHub_Repo/Task-Dashboard/docs/ssot/ui-design/FRONTEND-KNOWLEDGE-HUB.md)**. Ensure it includes:
1. **Topic/Symptom**: What was broken or what needs styling.
2. **Standard/Token**: The CSS class or style token to use or avoid.
3. **Short Example**: 1–5 lines of code.

## Step 3 — Invariant Check
Ensure the new style conforms to CSS contracts (e.g. no magic Z-indexes, proper theme-adaptive variables).
