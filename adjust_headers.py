#!/usr/bin/env python3
"""
adjust_headers.py

Adjusts Markdown header levels under VS Code task integration.

Rules:
  1. Section headers (# Query X.Y -, # Review X.Y -, # Response X.Y -)
     always stay at H1. They are the only true top-level headers.
  2. All other (content) headers shift down by 1 level: H1→H2, H2→H3, etc.
  3. Skipping is preserved: if content H1 is followed directly by H3 (no H2
     in between), the H3 is already subordinate to the shifted H2 and is NOT
     incremented further.

Environment variables (set by .vscode/tasks.json):
  SELECTED_TEXT  - The currently highlighted text in VS Code (may be empty)
  SOURCE_FILE    - Absolute path to the active file
  CURSOR_LINE    - 1-based line number of the cursor (used to anchor search)

Interaction flow:
  1. Highlight a section in VS Code (or select nothing for the whole file)
  2. Ctrl+Shift+P → Tasks: Run Task → Adjust Markdown Headers
  3. Script finds the selection in the file, adjusts headers, writes a temp file
  4. VS Code diff opens: LEFT = original, RIGHT = proposed
  5. Review the diff, then press Enter in the terminal to apply (or Ctrl+C to cancel)
  6. VS Code prompts "file changed externally" → click Reload
"""

import os
import re
import shutil
import subprocess
import sys
import tempfile

# ── Section-header pattern ───────────────────────────────────────────────────
_SECTION_RE = re.compile(r'^# (Query|Review|Response) \d+\.\d+ -')


def is_section_header(line: str) -> bool:
    return bool(_SECTION_RE.match(line))


# ── Header-level adjustment ──────────────────────────────────────────────────
def adjust_headers_in_block(lines: list[str]) -> list[str]:
    """
    Apply the three rules to a list of raw file lines (with line endings).

    Algorithm for rule 3 (preserve skipping):
      Track an ancestor stack of tuples `(original_level, shifted_level)` to
      identify parent-child relationships. Section headers start at `[(1, 1)]`.

      For each content header at original level L:
        - Traverse the stack backward to find the closest parent P (where parent_L < L).
        - If L > parent_L + 1 (original gap/skip exists):
            - If L > parent_shifted_L (already subordinate to parent's new level),
              we preserve the gap: new_level = L.
            - Otherwise, we shift it down: new_level = parent_shifted_L + 1.
        - Otherwise (normal transition, same level, or higher level):
            - Shift down by 1: new_level = L + 1.
        - Update stack: discard all elements with original level >= L, and push (L, new_level).
    """
    result: list[str] = []
    # stack of (original_level, shifted_level)
    ancestors = [(1, 1)]

    for raw_line in lines:
        text = raw_line.rstrip("\r\n")
        ending = raw_line[len(text):]          # "\n", "\r\n", or ""

        if text.startswith("#"):
            if is_section_header(text):
                # ── Rule 1: section header stays at H1 ──
                ancestors = [(1, 1)]
                result.append(raw_line)
            else:
                # ── Rules 2 & 3: shift content headers ──
                original_level = len(text) - len(text.lstrip("#"))
                rest = text[original_level:]   # everything after the hashes

                # Find parent from ancestors stack
                parent_original, parent_shifted = 1, 1
                for a_orig, a_shift in reversed(ancestors):
                    if a_orig < original_level:
                        parent_original, parent_shifted = a_orig, a_shift
                        break

                # Shift header only if it is not already subordinate to parent's shifted level
                new_level = max(original_level, parent_shifted + 1)

                # Update stack
                ancestors = [a for a in ancestors if a[0] < original_level]
                ancestors.append((original_level, new_level))
                
                result.append("#" * new_level + rest + ending)
        else:
            result.append(raw_line)

    return result


# ── Line-range finder ────────────────────────────────────────────────────────
def find_selection_in_file(
    file_lines: list[str],
    selected_text: str,
    cursor_line: int,       # 0-based
) -> tuple[int, int]:
    """
    Locate selected_text inside file_lines.

    Uses cursor_line as an anchor so that if the same text block appears
    more than once in the file, we pick the one nearest the cursor.

    Returns (start, end) — 0-based, end is exclusive.
    Falls back to (0, len(file_lines)) on failure.
    """
    sel_lines = selected_text.splitlines(keepends=True)
    if not sel_lines:
        return 0, len(file_lines)

    def norm(line: str) -> str:
        return line.rstrip("\r\n")

    sel_norm = [norm(l) for l in sel_lines]
    n = len(sel_norm)
    best: tuple[int, int] | None = None
    best_dist = float("inf")

    for i in range(len(file_lines) - n + 1):
        block = [norm(file_lines[i + j]) for j in range(n)]
        if block == sel_norm:
            dist = abs(i - cursor_line)
            if dist < best_dist:
                best_dist = dist
                best = (i, i + n)

    # Fuzzy fallback: match on first + last line only
    if best is None and n > 1:
        for i, fl in enumerate(file_lines):
            if norm(fl) == sel_norm[0]:
                for j in range(i + 1, min(i + n + 10, len(file_lines))):
                     if norm(file_lines[j]) == sel_norm[-1]:
                        dist = abs(i - cursor_line)
                        if dist < best_dist:
                            best_dist = dist
                            best = (i, j + 1)

    return best if best else (0, len(file_lines))


def find_code() -> str | None:
    """Return path to the VS Code CLI, or None if not found."""
    if shutil.which("antigravity-ide"):
        return "antigravity-ide"
    if shutil.which("code"):
        return "code"
    if sys.platform == "win32":
        candidates = [
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Antigravity IDE\bin\antigravity-ide.cmd"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Microsoft VS Code\bin\code.cmd"),
            os.path.expandvars(r"%APPDATA%\Local\Programs\Microsoft VS Code\bin\code.cmd"),
        ]
        for c in candidates:
            if os.path.exists(c):
                return c
    return None


# ── Terminal diff preview (fallback) ─────────────────────────────────────────
def print_diff_preview(original: list[str], modified: list[str], start: int) -> None:
    """Print a simple before/after preview to the terminal."""
    changes = 0
    for i, (a, b) in enumerate(zip(original, modified)):
        if a != b:
            line_no = start + i + 1
            print(f"  Line {line_no}:")
            print(f"    - {a.rstrip()}")
            print(f"    + {b.rstrip()}")
            changes += 1
    if changes == 0:
        print("  (no changes)")


# ── Main ─────────────────────────────────────────────────────────────────────
def main() -> None:
    selected_text = os.environ.get("SELECTED_TEXT", "").strip()
    source_file   = os.environ.get("SOURCE_FILE", "").strip()
    cursor_raw    = os.environ.get("CURSOR_LINE", "1")

    try:
        cursor_line = int(cursor_raw) - 1   # convert to 0-based
    except ValueError:
        cursor_line = 0

    # ── Validate ────────────────────────────────────────────────────────────
    if not source_file:
        sys.exit("ERROR: SOURCE_FILE is not set. Run via the VS Code task.")
    if not os.path.isfile(source_file):
        sys.exit(f"ERROR: File not found: {source_file}")

    basename = os.path.basename(source_file)

    # ── Read file ───────────────────────────────────────────────────────────
    with open(source_file, encoding="utf-8") as f:
        file_lines = f.readlines()

    # ── Determine range ─────────────────────────────────────────────────────
    if selected_text:
        start, end = find_selection_in_file(file_lines, selected_text, cursor_line)
        print(f"\n  File   : {basename}")
        print(f"  Range  : lines {start + 1}-{end}")
    else:
        start, end = 0, len(file_lines)
        print(f"\n  File   : {basename}")
        print(f"  Range  : entire file ({len(file_lines)} lines)")

    # ── Adjust ──────────────────────────────────────────────────────────────
    original_block  = file_lines[start:end]
    adjusted_block  = adjust_headers_in_block(original_block)

    if original_block == adjusted_block:
        print("\n  [OK] No changes needed - headers are already correct.\n")
        return

    modified_lines = file_lines[:start] + adjusted_block + file_lines[end:]

    # ── Write temp file ─────────────────────────────────────────────────────
    fd, temp_path = tempfile.mkstemp(suffix=".md", prefix="adj_headers_")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.writelines(modified_lines)

        # ── Open diff in VS Code ─────────────────────────────────────────
        skip_diff = os.environ.get("SKIP_CODE_DIFF") == "1"
        auto_apply = os.environ.get("AUTO_APPLY") == "1" or os.environ.get("BYPASS_CONFIRMATION") == "1"
        code = None if skip_diff else find_code()

        if code:
            print(f"\n  Opening diff in VS Code ...")
            print(f"    LEFT  (original) : {source_file}")
            print(f"    RIGHT (proposed) : {temp_path}")
            
            # Clean PATH to remove directories pointing to golde user profile to prevent Node/Electron EPERM crashes
            sub_env = os.environ.copy()
            path_entries = sub_env.get("PATH", "").split(os.pathsep)
            clean_path_entries = [entry for entry in path_entries if "golde" not in entry.lower()]
            sub_env["PATH"] = os.pathsep.join(clean_path_entries)
            
            subprocess.Popen([code, "--diff", source_file, temp_path], shell=sys.platform == "win32", env=sub_env)
        else:
            if skip_diff:
                print("\n  [INFO] Running in terminal-only diff mode (SKIP_CODE_DIFF=1).")
            else:
                print("\n  VS Code not found in PATH. Showing diff here:\n")
            print_diff_preview(original_block, adjusted_block, start)

        # ── Confirmation ─────────────────────────────────────────────────
        if not auto_apply:
            print()
            print("  Review the diff, then come back here.")
            print("  Press Enter to APPLY changes, or Ctrl+C to CANCEL.")
            print()

            try:
                input()
            except KeyboardInterrupt:
                print("\n  Cancelled. No changes written.\n")
                return
        else:
            print("\n  [INFO] Auto-applying changes (AUTO_APPLY/BYPASS_CONFIRMATION=1)...")

        # ── Apply ─────────────────────────────────────────────────────────
        shutil.copy2(temp_path, source_file)
        print(f"\n  [OK] Applied. VS Code will ask to reload {basename} - click Reload.\n")

    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)


if __name__ == "__main__":
    main()
