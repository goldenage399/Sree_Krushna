---
pattern: self-guarding-manual-system
origin_cap: CAP-037
tier: universal
applies_to:
  - "Any agentic AI development environment"
  - "Documentation-heavy codebases"
  - "Spreadsheet-backed applications"
prereqs:
  - "Node.js (for validator script)"
  - "Markdown-based documentation hub"
porting_effort: medium
canonical_source: docs/manual/index.md
last_reviewed: 2026-04-20
description: "Gating code changes against documentation accuracy."
---

# Self-Guarding Manual System (SGMS)

> **Purpose**: Automate the synchronization of human-readable documentation with the self-guarding system architecture. Prevents documentation rot by gating code changes against documentation accuracy.

## 1. Problem Statement
In agentic AI development, documentation (Manuals, Workflows) often drifts from the actual Code or the Reality of the live system. Agents operating on stale documentation produce incorrect code, which further breaks the system.

## 2. Solution: The Documentation Triangle
The SGMS enforces a strict mapping between three states:
1. **Intent (Manual)**: Human-readable Markdown files in `docs/manual/`.
2. **Implementation (Code)**: The source code (e.g., schemas, API handlers).
3. **Reality (System)**: The live environment (e.g., Google Sheet headers, Database schemas).

## 3. Core Components

### 3.1 The Structured Registry (`docs/manual/`)
Documentation is stored in a structured format (YAML frontmatter + Markdown) that can be parsed by scripts.
- `sheets/`: One file per data entity (e.g., `inventory.md`).
- `workflows/`: One file per user-facing process (e.g., `execute-daily.md`).

### 3.2 The Validator (`scripts/validate-ssot.js`)
A script that runs as a mandatory gate before any backend commit or session close.
- **Schema Validation**: Ensures `docs/manual/sheets/*.md` matches the code's schema definitions.
- **Staleness Detection**: Compares file modification times (`mtime`) of source code against the `last_verified` date in workflow documentation.
- **Code Mapping**: Auto-generates a `code_map.md` showing which backend files affect which workflows/sheets.

### 3.3 The Compiler (`scripts/compile-manual.js`)
A script that parses the technical documentation and generates clean, role-filtered Markdown manuals for non-technical users (e.g., `docs/output/User_Manual.md`).

## 4. Porting Steps

1. **Initialize the Registry**: Create a `docs/manual/` folder with subfolders for `sheets/` and `workflows/`.
2. **Define the Metadata**: Establish a YAML frontmatter standard for documentation (IDs, status, source files, last_verified).
3. **Implement the Validator**: Create a Node.js script that parses your project's schemas (e.g., a `Code.js` file or a SQL schema) and matches them against the Markdown files.
4. **Integrate Gates**: Add the validator to your agent operating system's commit and session-close protocols.

## 5. Protocols

### Protocol A: Pre-Flight Read
Before any task, the agent MUST read `docs/manual/index.md`.

### Protocol B: Validator Gate
No backend change is complete without a passing validator run (0 failures, 0 staleness warnings).

### Protocol C: Post-Implementation Sync
Whenever a feature is implemented, the agent MUST update the `last_verified` date in all affected workflows.
