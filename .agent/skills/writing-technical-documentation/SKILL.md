---
name: writing-technical-documentation
description: Use when creating or updating Architecture decisions, SSOTs, or large technical guides. Enforces hierarchy, systematic update workflow, and SSOT alignment.
---

# Writing Technical Documentation

> **Portability Note:** This skill has a generic core (portable across projects) and an optional Project Extensions section at the end.

## Overview

This skill helps writers make changes to technical documentation **systematically and safely**. It prevents "hierarchy rot" and "orphan docs" by enforcing structural standards and a systematic update workflow.

## When to Use

- Creating or updating Architecture docs, SSOTs, or technical guides
- Reorganizing large documents
- Dealing with "wrong hierarchy" or confused data flow explanations
- Any documentation change that might affect related artifacts

---

## Part 1: Update Workflow (Portable)

### Identify Change Scope

- **Determine what changed**: Clarify whether the update is driven by code changes, new requirements, or corrections.
- **Find related artifacts**: Search the codebase and documentation hub for terms or modules affected. If the project provides a `DOCUMENTATION_HUB.md`, use it. Otherwise, search the repository for keywords.
- **Run reconciliation tools**: If available, run `/ssot-reconciliation` or similar to uncover mismatches.
- **Note no-dependency cases**: If no related artifacts are found, explicitly document "no dependencies".

### Check for Dependencies

1. **Cross-Document References**: Review docs, code comments, and release notes for references to the topic you're editing.
2. **SSOT and Secondary Sources**: Identify which SSOT(s) cover this topic. Reconcile differences so only one authoritative version remains.
3. **Third-Party or Generated Content**: Check if code samples or auto-generated docs depend on this content.
4. **Fallback if None Found**: Document "No related docs were found" to ensure traceability.

### Coordinate Updates

- **Communicate with Stakeholders**: Inform affected teams early.
- **Assign Ownership**: Clearly assign who will make each part of the update.
- **Version Control Practices**: Link documentation updates to issue trackers or pull requests.
- **Review and Merge Strategy**: Verify each related document has been updated before finalizing.

---

## Part 2: Structure Standards (Portable)

### The Hierarchy Standard

You **MUST** follow this structural hierarchy. No skipping levels.

| Level  | Syntax        | Usage                                                           |
| ------ | ------------- | --------------------------------------------------------------- |
| **H1** | `# Title`     | **Document Title ONLY**. One per file.                          |
| **H2** | `## Header`   | **Major Concept Domains**. (e.g., Architecture, Schema, Flows). |
| **H3** | `### Subhead` | **Specific Components**. (e.g., Pattern G, Validation Rules).   |
| **H4** | `#### Detail` | **Implementation Details**. (e.g., Function names, Edge cases). |

**❌ Anti-Pattern:** Jumping from H1 to H3. This breaks Table of Contents and semantic flow.

### The Data Flow Standard

When documenting data movement, align document structure with actual flow steps:

- `## 1. Intake` (Input)
- `## 2. Processing` (Logic)
- `## 3. Storage` (Output)

**Do not** describe Output before Input unless writing a high-level summary.

### Writing and Style Guidelines

- **Clear, concise language**, consistent voice, active voice preferred
- **Logical heading hierarchy** (H1–H4 only)
- **Use cross-references** to link related docs
- **Fallback for missing sections**: Add "(No known dependencies)" rather than leaving ambiguity

---

## Part 3: Checklists (Portable)

### Pre-Write Checklist

1. **Identify the Domain:** Which SSOT category is this?
2. **Check Existing Hierarchy:** Run `view_file_outline` to see current structure.
3. **Plan the Insert:** Decide exactly under which H2 parent your content belongs.

### Post-Write Checklist

1. **Hierarchy Integrity:** Did I create a dangling H3 without an H2?
2. **Numbering:** If sections are numbered, is the sequence unbroken?
3. **Flow:** Does top-to-bottom reading match execution order?

### Decision Checklist

- **Scope Identification**
  - [ ] What triggered this change?
  - [ ] Which documents reference this topic?
- **Dependency Analysis**
  - [ ] Have you run SSOT/search tools to find overlaps?
  - [ ] If none found, noted "No related artifacts"?
- **Content Update**
  - [ ] Headings, code blocks, examples updated consistently?
  - [ ] Terminology changes applied everywhere?
- **Review and Verification**
  - [ ] Documentation builds/link-checks run?
  - [ ] Final review before merging?

### Hub Maintenance Checklist (After Any Doc Update)

> **Enforcement**: Protocol #41 (Hub-First), PIRR Category 15

- [ ] Is this doc in `DOCUMENTATION_HUB.md`?
- [ ] Dependencies recorded in Dependency Graph?
- [ ] Impact docs recorded in Dependency Graph?
- [ ] "Last Verified" date updated?

---

## Related Workflows

- **`/ssot-reconciliation`**: Conflict mode — when you find contradictory claims across files.
- **`/ssot-reconciliation cascade`**: Cascade mode — update multiple related docs from hub.

---

## Project Extensions (PIOperationsMgmt)

> **Note:** This section is project-specific. Remove or adapt when porting to other codebases.

### Module SSOT Folder Structure

| Folder                          | Contains                                          |
| ------------------------------- | ------------------------------------------------- |
| `docs/Accounts_Module_SSOT/`    | CONTRACT.json, DATA_FLOW_MAP.md, SHEET_SCHEMAS.md |
| `docs/Expense_Module_SSOT/`     | ARCHITECTURE\_\*.md, VALIDATION_Rules.md          |
| `docs/Ledger_Module_SSOT/`      | CONTRACT.json, DATA_FLOW_MAP.md                   |
| `docs/Receivables_Module_SSOT/` | CONTRACT.json, DATA_FLOW_MAP.md                   |
| `docs/Consumption_Module_SSOT/` | Emerging module docs                              |

### Required Companion Artifacts

| Artifact           | Purpose            | Template                                  |
| ------------------ | ------------------ | ----------------------------------------- |
| `CONTRACT.json`    | API action schema  | `docs/templates/CONTRACT_TEMPLATE.json`   |
| `DATA_FLOW_MAP.md` | Visual data flow   | Mermaid diagrams                          |
| `SHEET_SCHEMAS.md` | Column definitions | `docs/templates/SHEET_SCHEMA_TEMPLATE.md` |

### File Naming Conventions

| Prefix                 | Usage                      |
| ---------------------- | -------------------------- |
| `ARCHITECTURE_*.md`    | Design decisions, patterns |
| `MODULE_*.md`          | Module overview docs       |
| `TROUBLESHOOTING_*.md` | Debug guides               |
| `SSOT_*.md`            | Reconciliation records     |

### Mandatory First Step

**Before ANY doc edit:**

1. Open `docs/DOCUMENTATION_HUB.md`
2. Search for concept domain
3. Identify correct SSOT location
4. THEN proceed with edit
