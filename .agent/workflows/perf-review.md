---
description: Review code for performance optimization opportunities using indexed patterns
---

# Performance Review - Quick Reference

> **Full handbook:** [PERFORMANCE_OPTIMIZATION_HANDBOOK.md](file:///d:/GitHub_Repo/Task-Dashboard/docs/PERFORMANCE_OPTIMIZATION_HANDBOOK.md)

## Code Smell Index (Scan For These)

| Pattern | Symptom | Fix |
|---------|---------|-----|
| `array.find()` in loop | O(n²) | Build Map once → P1 |
| `array.filter()` in loop | O(n²) | Pre-index collection → P1 |
| Object rebuilt per iteration | Redundant | Cache outside loop → P1 |
| Nested `forEach` | O(n×m) | Index one collection → P1 |
| `console.log(bigArray)` in loop | Memory churn | Log `.length` only |
| String += in loop | O(n²) strings | Use `array.push()` + `.join()` |

## Quick Decision Tree

```
Changed code has loop?
  ├─ YES → Any array method inside? (find/filter/includes)
  │         ├─ YES → Potential O(n²) - Check Pattern P1
  │         └─ NO → Check for object rebuilds
  └─ NO → Likely OK
```

## Pattern Reference

| # | Name | Gain | Handbook Section |
|---|------|------|------------------|
| P1 | Cache Lookup Map | 97% reduction | [Handbook P1](file:///d:/GitHub_Repo/Task-Dashboard/docs/PERFORMANCE_OPTIMIZATION_HANDBOOK.md#p1-cache-lookup-map-2025-12-25) |

// turbo
## Scan Commands

```powershell
# Find potential O(n²) patterns in changed files
Select-String -Path "*.js" -Pattern "\.find\(|\.filter\(|\.includes\(" -Recurse | Select-String "forEach|for \("
```

## When to Use This Workflow

- During code review
- During PIRR Category 11 check
- When console shows repeated expensive operations
- When UI feels sluggish after data operations
