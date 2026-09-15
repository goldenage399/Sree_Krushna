---
name: excel-multisheet-processor
description: Use when processing, converting, inspecting, or consolidating multi-sheet Excel (.xlsx, .xls) workbooks, extracting data into Markdown for LLM ingestion, merging tabular sheets with schema validation, or checking cross-sheet relational data.
---

# Multi-Sheet Excel Processor (`excel-multisheet-processor`)

Standardized operational skill for parsing, converting, validating, and consolidating complex multi-sheet Excel workbooks across `Sree_Krushna` and `BMS`.

Built on the Architecture Council certified **Dual-Core Extractor & Contract Engine (DCE-001)**.

---

## When to Use

- When an Excel workbook contains multiple worksheets/tabs that must be inspected or inventoried.
- When spreadsheet tables must be converted into clean, human/LLM-readable Markdown (with individual H2 sections per sheet).
- When multiple sheets sharing similar or identical tabular schemas need to be consolidated/merged into a single master sheet (`_source_sheet` tracking).
- When validating that sheets adhere to mandatory column contracts (e.g. `Vendor ID`, `Category`, `Amount`).
- When extracting financial, guest, or vendor data without losing leading zeros or turning IDs into floats.

## When NOT to Use

- For single CSV files without sheets (use standard `pandas.read_csv` or ripgrep).
- For live Google Sheets synchronization (use Google Sheets API / GAS deploy workflows).
- For pure word processing documents (`.docx`, `.pdf` — use `.agent/workflows/document-conversion.md`).

---

## Core Capabilities & Architecture (DCE-001)

The skill provides an automated Python execution engine backed by `D:\GitHub_Repo\BMS\venv`:

```
┌──────────────────────────────────────────────────────────────┐
│                Multi-Sheet Excel Workbook                    │
└──────────────────────────────┬───────────────────────────────┘
                               │
               ┌───────────────▼───────────────┐
               │    Stage 1: Introspector      │
               │   (read_only + lock-bypass)   │
               └───────────────┬───────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        ▼                                             ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  Path A: Semantic Markdown   │        │  Path B: Relational Pipeline │
│  - Converts all tabs to MD   │        │  - Type-safe string casting  │
│  - Header auto-detection     │        │  - Schema validation         │
│  - Row-budget token guard    │        │  - Cross-sheet consolidation │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               ▼                                       ▼
       Clean Markdown Docs                     Master Consolidated
    (Converted Docs/*.md)                  (.xlsx, .csv, .json)
```

---

## Standard CLI Usage

The bundled engine is located at:
`d:\GitHub_Repo\Sree_Krushna\.agent\skills\excel-multisheet-processor\scripts\process_sheets.py`

Execute commands using the central Python virtual environment:

### 1. Inspect Sheet Topology & Dimensions
```powershell
& "D:\GitHub_Repo\BMS\venv\Scripts\python.exe" ".agent\skills\excel-multisheet-processor\scripts\process_sheets.py" "path\to\workbook.xlsx" --inspect
```
*Outputs sheet names, max rows, max columns, and the detected header row.*

For machine-readable JSON output:
```powershell
& "D:\GitHub_Repo\BMS\venv\Scripts\python.exe" ".agent\skills\excel-multisheet-processor\scripts\process_sheets.py" "path\to\workbook.xlsx" --inspect --json
```

### 2. Convert All Sheets to Structured Markdown
```powershell
& "D:\GitHub_Repo\BMS\venv\Scripts\python.exe" ".agent\skills\excel-multisheet-processor\scripts\process_sheets.py" "path\to\workbook.xlsx" --to-markdown --output "docs\extracted_workbook.md"
```
*Converts every worksheet tab into a Markdown table separated by `## Sheet: <name>` headers.*

### 3. Consolidate Multiple Sheets into One Master Dataset
```powershell
& "D:\GitHub_Repo\BMS\venv\Scripts\python.exe" ".agent\skills\excel-multisheet-processor\scripts\process_sheets.py" "path\to\workbook.xlsx" --consolidate --output "output\consolidated.xlsx"
```
*Merges all sheets, appends `_source_sheet` column to track row origin, and outputs `.xlsx`, `.csv`, or `.json`.*

To merge only specific sheets:
```powershell
& "D:\GitHub_Repo\BMS\venv\Scripts\python.exe" ".agent\skills\excel-multisheet-processor\scripts\process_sheets.py" "path\to\workbook.xlsx" --consolidate --sheets "Phase1_Vendors" "Phase2_Vendors" --output "output\merged.csv"
```

### 4. Validate Schema Contracts Across Sheets
```powershell
& "D:\GitHub_Repo\BMS\venv\Scripts\python.exe" ".agent\skills\excel-multisheet-processor\scripts\process_sheets.py" "path\to\workbook.xlsx" --validate "Vendor ID" "Category" "Amount"
```
*Checks all sheets for required columns and returns pass/fail with missing columns listed.*

---

## Python API Usage (Inline within Custom Scripts)

You can import and call the processor module directly in Python tasks:

```python
import sys
from pathlib import Path

# Add skill script to sys.path
skill_scripts = Path(r"d:\GitHub_Repo\Sree_Krushna\.agent\skills\excel-multisheet-processor\scripts")
sys.path.insert(0, str(skill_scripts))

from process_sheets import inspect_workbook, convert_to_markdown, consolidate_sheets, validate_schema

# 1. Inspect
info = inspect_workbook("vendor_bids.xlsx")
print(f"Total sheets: {info['sheet_count']}")

# 2. Convert to markdown string
md_content = convert_to_markdown("vendor_bids.xlsx", max_rows_per_sheet=50)

# 3. Consolidate
result = consolidate_sheets("vendor_bids.xlsx", "master_bids.json")
```

---

## Guardrails & Common Pitfalls

1. **Windows Excel Lock Bypass (EBUSY)**: Never fail because a workbook is open in Microsoft Excel. The script automatically creates a temporary read-buffer if a file lock is detected.
2. **Type Coercion Safeguard**: All identifier columns are read with `dtype=str`. Never cast phone numbers or padded IDs (`PER-001`) to numeric types.
3. **Banner / Merged Cell Heuristic**: Real spreadsheets often have merged title blocks in Row 1. The engine automatically scans the first 10 rows to detect the true column header row before parsing.
4. **Token Overflow Defense**: When converting huge sheets to Markdown, the `--max-rows` parameter (default 100) prevents blowing LLM context windows while providing a clean truncation indicator.
