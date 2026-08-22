---
description: Guardrail for correct file placement before creating any new file
---

# File Placement Guardrail

> **MANDATORY**: Run this mental checklist BEFORE creating ANY new file.

## Step 1: Classify the File Type

Ask: _"What IS this file?"_

| File Type                   | Examples                                 |
| --------------------------- | ---------------------------------------- |
| **Application Code**        | Components, hooks, services, utilities   |
| **Configuration**           | firebase.json, package.json, vite.config |
| **Documentation**           | Guides, references, specs, walkthroughs  |
| **Debug/Testing Utilities** | Debug scripts, test helpers, fixtures    |
| **Assets**                  | Images, icons, fonts                     |

## Step 2: Apply Placement Rules

### Application Code → `src/`

```
src/
├── components/     # React components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── services/       # Business logic, Firebase calls
├── utils/          # Pure utility functions
├── styles/         # CSS files
└── pages/          # Page-level components
```

### Documentation → `docs/ssot/[hub]/`

**Key Question**: _"Which hub does this belong to?"_

| Hub                 | What Goes Here                                        |
| ------------------- | ----------------------------------------------------- |
| `architecture-hub/` | Schemas, data flow, system design, field mappings     |
| `testing-hub/`      | Test guides, debugging, validation, **debug scripts** |
| `dev-workflow-hub/` | Checklists, patterns, development procedures          |
| `ui-design/`        | Theme, components, tokens, responsive                 |

```
docs/ssot/
├── architecture-hub/
├── testing-hub/
│   └── scripts/     # Debug utilities (NOT src/scripts!)
├── dev-workflow-hub/
└── ui-design/
```

### Scripts - The Common Mistake!

**STOP**: Is this script for:

| Purpose                                   | Location                                           |
| ----------------------------------------- | -------------------------------------------------- |
| **Build/Deploy** (needs to run in CI)     | `scripts/` at project root                         |
| **Debugging/Testing** (reference utility) | `docs/ssot/testing-hub/scripts/`                   |
| **Sample Data** (test fixtures)           | `src/scripts/` OR `docs/ssot/testing-hub/scripts/` |
| **Application Runtime** (used by app)     | `src/services/` or `src/utils/`                    |

## Step 3: Check for SSOT Violations

Before creating, ask:

1. **Does similar content exist elsewhere?** → Search first
2. **Will this create duplication?** → Update existing file instead
3. **Is there a hub that owns this topic?** → Place in that hub

## Step 4: Reference Hub README

Each hub has a README. Check it first:

- `docs/ssot/architecture-hub/README.md`
- `docs/ssot/testing-hub/README.md`
- `docs/ssot/dev-workflow-hub/README.md`

## Quick Decision Tree

```
Creating a new file?
│
├─ Is it React component/hook/service?
│   └─ YES → src/[appropriate folder]
│
├─ Is it documentation/reference?
│   └─ YES → docs/ssot/[hub]/
│
├─ Is it a debug/test utility script?
│   └─ YES → docs/ssot/testing-hub/scripts/
│
├─ Is it configuration?
│   └─ YES → Project root or appropriate config folder
│
└─ Unsure?
    └─ ASK the user before creating!
```

## Anti-Patterns to Avoid

❌ **Putting debug scripts in `src/scripts/`** - They're documentation, not app code
❌ **Creating new folders without checking hub structure** - May already exist
❌ **Duplicating content across hubs** - Update SSOT instead
❌ **Ignoring existing README patterns** - Each hub has conventions
