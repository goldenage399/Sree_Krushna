---
description: Streamlined Pattern Capture Workflow - Archive process discoveries and methodologies
---

# /capture-pattern-lite

**Purpose**: Quickly save a validated process discovery, failure mode, or design gate to prevent future agents from re-deriving it.

---

## Step 1 — Worthiness Filter
A pattern is worth capturing if:
- It applies to $\ge$ 2 future tasks.
- A future agent would waste time re-deriving it from scratch.

## Step 2 — Write Pattern File
Create or append to `.agent/patterns/<descriptive-name>.md` with the following structure:

```markdown
# <Pattern Name>

**Category**: <Process | Design Gate | Anti-Pattern | Methodology>
**Applies to**: <Which files or workflows trigger this>

---

### Problem
<What fails or breaks without this pattern - 1 concrete scenario>

### Solution
<How to implement the correct pattern step-by-step>

### Example
<Short code block or config example>
```
