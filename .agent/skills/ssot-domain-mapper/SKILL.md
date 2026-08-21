---
name: ssot-domain-mapper
description: >
  Map a Task-Dashboard code change to the exact SSOT document(s) that govern it,
  so docs never go stale. Use whenever you touch Firestore schema/rules, roles,
  task lifecycle, data flow, feature flags, layout, design tokens, themes, or
  components — and before approving any change that has a governing spoke. If you
  would otherwise run a directory listing of docs/ssot/ to find the right file,
  use this skill instead. Reads point to live docs under docs/ssot/<hub>/.
---

## Goal

Eliminate "Orphan SSOTs" by mapping every code change to its governing documentation
in this repo's hub-and-spoke tree (`docs/ssot/<hub>/`).

## Change Type → Governing SSOT

| If your change touches… | Read / update |
| --- | --- |
| Firestore fields / schema | `docs/ssot/architecture-hub/FIREBASE-SCHEMA.md`, `TASK-FIELD-REQUIREMENTS-SSOT.md` |
| `firestore.rules` | `docs/ssot/architecture-hub/FIRESTORE-RULES-SSOT.md` |
| Roles / permissions / auth | `docs/ssot/architecture-hub/AUTHENTICATION-USER-REGISTRY.md`, `USER-PROFILE-REGISTRY.md` |
| Task status / escalation / lifecycle | `docs/ssot/architecture-hub/TASK-LIFECYCLE-SSOT.md` |
| Data movement between layers | `docs/ssot/architecture-hub/DATA_FLOW_SSOT.md` |
| Feature flags | `docs/ssot/architecture-hub/FEATURE-FLAG-SSOT.md` |
| Entity relationships / cardinality | `docs/ssot/architecture-hub/RELATIONSHIP-CARDINALITY-SSOT.md` |
| Grid / flex / breakpoints / responsive | `docs/ssot/ui-design/spokes/RESPONSIVE-DESIGN.md` |
| Spacing / color / typography tokens | `docs/ssot/ui-design/spokes/DESIGN-TOKENS.md` → also `design-token-registry` facts in CSS (see below) |
| Theme behavior | `docs/ssot/ui-design/spokes/THEME-SYSTEM.md` |
| Sticky / scroll / z-index | `docs/ssot/ui-design/spokes/SCROLL-AND-STICKY-CONTRACT.md` → also `ui-design-validator` skill |
| Component contracts / creation | `docs/ssot/ui-design/spokes/COMPONENTS.md`, `dev-workflow-hub/COMPONENT-DEVELOPMENT-STANDARDS.md` → also `admin-component-contracts` skill |
| Tests / validation | `docs/ssot/testing-hub/*` |

## Hub Entry Points

Each hub has a `README.md`. When unsure which spoke applies, start at the hub index:
- UI/design → `docs/ssot/ui-design/UI-DESIGN-HUB.md`
- Architecture → `docs/ssot/architecture-hub/README.md`
- Dev workflow → `docs/ssot/dev-workflow-hub/README.md`
- Testing → `docs/ssot/testing-hub/README.md`

## Output Format

```markdown
## 🗺️ SSOT Domain Map

| Change Area               | Concept Domain | Governing SSOT                                   |
| :------------------------ | :------------- | :----------------------------------------------- |
| [e.g. Added task field]   | Schema         | docs/ssot/architecture-hub/FIREBASE-SCHEMA.md    |
| [e.g. New tile min-width] | Responsive     | docs/ssot/ui-design/spokes/RESPONSIVE-DESIGN.md  |

⚠️ Open these files now to verify current state before merge.
```

## Cross-references

- Token validity (CSS source) → `design-token-registry` facts: `src/styles/tailwind-semantic-bridge.css`, `src/tokens/`, `docs/ssot/ui-design/spokes/DESIGN-TOKENS.md`
- Sticky / z-index contracts → `ui-design-validator` skill
- Shared admin component contracts → `admin-component-contracts` skill

## ➡️ What's Next?

- `pirr-compliance-checklist` → before merge, verify all mapped SSOTs were updated
