---
name: mobile-ui-validator
description: >
  Detects Ghost Components and verifies responsive overrides (Protocol 19).
  Use when implementing "Mobile" features, "Responsive" layouts, or new "UI Components".
  Prevents invisible mobile features and touch target violations.
---

## Goal

Ensure every UI component works on mobile (300px) and has active CSS.

## Validation Routine

### 1. Ghost Component Check (Mandatory)

**Task**: Verify your HTML classes actually exist in CSS.

```powershell
Select-String -Path "public/css/**/*.css" -Pattern "your-new-class-name"
```

**IF 0 Matches**: 🛑 STOP. You created a Ghost Component. Write the CSS.

### 2. Breakpoint Continuity

**Task**: If you have `min-width` (Tablet/Desktop) styles, do you have mobile overrides?

- Check: `flex-direction: row` (Desktop) -> Must be `column` on Mobile?
- Check: `display: flex` (Desktop) -> Is it hidden on Mobile?

### 3. Touch Target Integrity

**Task**: Are buttons large enough?

- **Rule**: Minimum 44x44px.
- **Check pattern**: `min-height: 44px` or `padding: 12px` in CSS.

### 4. Visibility Check

**Task**: Did you hide critical actions?

- **Rule**: NEVER hide Save/Delete/Submit on mobile.
- **Search**: `.hidden-mobile` applied to buttons?

## Output

```markdown
## 📱 Mobile Validation

1. Ghost Check: [Pass/Fail]
2. Breakpoints: [Pass/Fail]
3. Touch Targets: [Pass/Fail]
```

## ❌ Example Violation

**User**: "I added a new `.wizard-step-header` class in HTML."

**Agent (Bad)**: Marks task complete without checking CSS.

**This skill catches it**: `Select-String` returns 0 matches → "Ghost Component detected! Write the CSS."

## ➡️ What's Next?

After this skill passes:

- Run **`ui-design-validator`** → Verify z-index and sticky contracts
