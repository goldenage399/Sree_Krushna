---
description: Manages shadcn/ui components — adding, searching, fixing, debugging, styling, and composing UI. Use when working with shadcn/ui components, registries, or configs in a shadcn-based project.
---

# /shadcn Workflow

## When to Use
Use when:
- Working with shadcn/ui components, registries, or configs.
- The user requests to "add a component", "create a ui preset", "initialize shadcn", or "switch shadcn template".
- Editing styling, form validation, component structure, or icons under the shadcn ecosystem.

> **Note for Task-Dashboard**: The main `src/` application uses vanilla CSS and custom components, **not** shadcn/ui. This workflow applies only when explicitly working in a feature area, tooling, or sub-project that uses shadcn/ui. Verify with `ls components.json` before proceeding — if no `components.json` exists at the project root, this workflow does not apply.

## Steps

1. Check current project context with `npx shadcn@latest info`.
2. Review the core rules in `.agents/skills/shadcn/SKILL.md` (Styling & Tailwind, Forms & Inputs, Component Structure, Chat & Messaging, and Icons).
3. Search for components if needed using `npx shadcn@latest search`.
4. Get documentation and usage examples using `npx shadcn@latest docs <component>`.
5. Install or update component using `npx shadcn@latest add <component>`.
6. Review the generated component files in the workspace and verify they match styling, form, and composition standards.
