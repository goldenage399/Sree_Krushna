#!/usr/bin/env python3
"""
format_chat_log.py

Formats raw agent-user chat logs into the Query/Response format.

Rules:
  1. Maps the first "### User Input" in a round to "# Query X.Y -" starting at 1.0.
  2. Maps the first "### Planner Response" for that query to "# Response X.Y -".
  3. Subsequent "### Planner Response" blocks in the same round remain level 3 "### Planner Response".

Environment variables (set by .vscode/tasks.json):
  SELECTED_TEXT  - The currently highlighted text in VS Code (may be empty)
  SOURCE_FILE    - Absolute path to the active file
  CURSOR_LINE    - 1-based line number of the cursor (used to anchor search)
"""

import os
import re
import shutil
import subprocess
import sys
import tempfile


# ── Format Log ───────────────────────────────────────────────────────────────
def format_chat_log_in_block(lines: list[str]) -> list[str]:
    result: list[str] = []
    x = 1
    y = 0
    query_seen = False
    response_seen_for_query = False

    user_input_re = re.compile(r'^###\s+User\s+Input\s*$', re.IGNORECASE)
    query_header_re = re.compile(r'^#\s+Query\s+(\d+)\.(\d+)\s*-\s*$', re.IGNORECASE)

    planner_response_re = re.compile(r'^###\s+Planner\s+Response\s*$', re.IGNORECASE)
    response_header_re = re.compile(r'^#\s+Response\s+(\d+)\.(\d+)\s*-\s*$', re.IGNORECASE)

    i = 0
    n = len(lines)

    while i < n:
        raw_line = lines[i]
        text = raw_line.rstrip("\r\n")
        ending = raw_line[len(text):]

        m_user = user_input_re.match(text)
        m_query_empty = query_header_re.match(text)
        m_planner = planner_response_re.match(text)
        m_resp_empty = response_header_re.match(text)

        header_prefix = None

        if m_user:
            if query_seen:
                y += 1
                if y > 9:
                    x += 1
                    y = 0
            header_prefix = f"# Query {x}.{y} -"
            query_seen = True
            response_seen_for_query = False
        elif m_query_empty:
            x = int(m_query_empty.group(1))
            y = int(m_query_empty.group(2))
            header_prefix = f"# Query {x}.{y} -"
            query_seen = True
            response_seen_for_query = False
        elif m_planner and query_seen and not response_seen_for_query:
            header_prefix = f"# Response {x}.{y} -"
            response_seen_for_query = True
        elif m_resp_empty:
            x = int(m_resp_empty.group(1))
            y = int(m_resp_empty.group(2))
            header_prefix = f"# Response {x}.{y} -"
            response_seen_for_query = True

        if header_prefix:
            j = i + 1
            content_line_idx = -1
            while j < n:
                line_j = lines[j].rstrip("\r\n")
                if line_j.startswith("#"):
                    break
                if line_j.strip():
                    content_line_idx = j
                    break
                j += 1

            if content_line_idx != -1:
                content_text = lines[content_line_idx].rstrip("\r\n").strip()
                result.append(f"{header_prefix} {content_text}{ending}")
                i = content_line_idx + 1
            else:
                result.append(f"{header_prefix}{ending}")
                i += 1
        else:
            result.append(raw_line)
            i += 1

    return result


# ── Line-range finder ────────────────────────────────────────────────────────
def find_selection_in_file(
    file_lines: list[str],
    selected_text: str,
    cursor_line: int,       # 0-based
) -> tuple[int, int]:
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
        cursor_line = int(cursor_raw) - 1
    except ValueError:
        cursor_line = 0

    if not source_file:
        sys.exit("ERROR: SOURCE_FILE is not set. Run via the VS Code task.")
    if not os.path.isfile(source_file):
        sys.exit(f"ERROR: File not found: {source_file}")

    basename = os.path.basename(source_file)

    with open(source_file, encoding="utf-8") as f:
        file_lines = f.readlines()

    if selected_text:
        start, end = find_selection_in_file(file_lines, selected_text, cursor_line)
        print(f"\n  File   : {basename}")
        print(f"  Range  : lines {start + 1}-{end}")
    else:
        start, end = 0, len(file_lines)
        print(f"\n  File   : {basename}")
        print(f"  Range  : entire file ({len(file_lines)} lines)")

    original_block  = file_lines[start:end]
    adjusted_block  = format_chat_log_in_block(original_block)

    if original_block == adjusted_block:
        print("\n  [OK] No changes needed - chat headers are already correct.\n")
        return

    modified_lines = file_lines[:start] + adjusted_block + file_lines[end:]

    fd, temp_path = tempfile.mkstemp(suffix=".md", prefix="fmt_chat_")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.writelines(modified_lines)

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

        shutil.copy2(temp_path, source_file)
        print(f"\n  [OK] Applied. VS Code will ask to reload {basename} - click Reload.\n")

    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)


if __name__ == "__main__":
    main()
