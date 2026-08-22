---
description: Protocol for mapping and navigating codebases efficiently - prevents wasted searches
---

# Codebase Navigation Protocol

> **Purpose**: Prevent inefficient searches by maintaining structured indexes of script locations, dependencies, and integration points.
>
> **When to use**: When exploring a new codebase, adding new components, or after failed search attempts.

---

## 1. SETUP: Use Existing Documentation

Task Dashboard has extensive documentation. **Always start here**:

| Document                                                        | Purpose                       |
| --------------------------------------------------------------- | ----------------------------- |
| [GEMINI.md](../../GEMINI.md)                                    | Navigation hub - start here   |
| [QUICK-TASK-REFERENCE.md](../../docs/QUICK-TASK-REFERENCE.md)   | Instant file location         |
| [CODE-NAVIGATION-GUIDE.md](../../docs/CODE-NAVIGATION-GUIDE.md) | Complete code-to-file mapping |
| [COMPONENTS.md](../../docs/COMPONENTS.md)                       | UI component reference        |

---

## 2. SEARCH PROTOCOL

### 2-Strike Pivot Rule

| After N Failures | Action                                  |
| ---------------- | --------------------------------------- |
| 2 grep failures  | Switch to `git show <commit> -- <file>` |
| 3 grep failures  | Use `view_file` with line ranges        |
| 4+ failures      | **STOP** and check GEMINI.md first      |

### Fallback Strategies

1. **For recent changes**:

   ```powershell
   git log --oneline -5
   git show <hash> -- <file>
   ```

2. **For component locations**: Check `COMPONENTS.md`

3. **For file sections**: Use `view_file_outline` tool first

---

## 3. Task Dashboard Directory Structure

```
Task-Dashboard/
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── services/         # Firebase services
│   ├── contexts/         # React contexts
│   ├── pages/            # Page components
│   └── scripts/          # Testing scripts
├── docs/                 # Documentation
│   ├── enhancements/     # Enhancement specs
│   └── ui-design/        # UI documentation
├── functions/            # Firebase Cloud Functions
└── .agent/               # Agent workflows (this folder)
    └── workflows/        # Workflow templates
```

---

## 4. Common Lookups

| Question                  | Answer                         |
| ------------------------- | ------------------------------ |
| Where are hooks?          | `src/hooks/`                   |
| Where are services?       | `src/services/`                |
| Where is auth?            | `src/contexts/AuthContext.jsx` |
| Where is Firebase config? | `src/firebase.js`              |
| Where are task pages?     | `src/pages/`                   |
| Where is the main router? | `src/App.jsx`                  |

---

## 5. MAINTENANCE

Update this doc when:

- [ ] Adding new directory structures
- [ ] Adding new component patterns
- [ ] Adding new service patterns

---

## Best Practices Source

Based on:

- **C4 Model** - Context, Containers, Components, Code
- **Design Structure Matrix (DSM)** - Dependency visualization
- **Dependency Graphs** - Component relationships

---

_Ported from Task-Dashboard: 2025-12-30_
