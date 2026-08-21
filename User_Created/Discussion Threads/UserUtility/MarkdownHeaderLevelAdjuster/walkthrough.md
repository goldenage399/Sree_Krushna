# Markdown Header Level Adjuster Walkthrough

The script `User_Created/Discussion Threads/UserUtility/adjust_headers.py` has been upgraded to a CLI Wizard. It supports four modes of operation.

---

## How to Run

### 1. Interactive CLI Wizard (Recommended)
Simply run the script with no arguments in your terminal:
```powershell
py "User_Created/Discussion Threads/UserUtility/adjust_headers.py"
```
It will present a menu:
- **Option 1**: Adjust headers of a file in-place (with optional start/end line range and a preview of changes before applying).
- **Option 2**: Adjust markdown currently in your system clipboard. Displays the detected clipboard text, asks for confirmation, and writes the adjusted markdown back to your clipboard.
- **Option 3**: Read from standard input (stdin) and output to standard output (stdout).
- **Option 4**: Configure VS Code Integration (automatically generates/updates `.vscode/tasks.json` with active selection detection).

### 2. VS Code Task Integration (Selection Mode)
After configuring VS Code integration (via Option 4 in the wizard), you can run the task directly on highlighted text:
1. Open the target markdown file.
2. **Select / highlight** the lines of text you want to adjust.
3. Press `Ctrl+Shift+P` -> type `Tasks: Run Task` -> choose `Adjust Markdown Headers (Selection)`.
4. A terminal window will open, display the lines you selected, and ask for confirmation:
   `Apply header level adjustments to this selection? (y/N):`
5. Press `y` and Enter to apply the adjustments in-place. Pressing `n` or Enter without `y` will abort safely.

### 3. Selected Sections (Piping / stdin)
You can pipe selected sections directly to the script:
```powershell
# Pipe selected content to the script, which prints adjusted content to stdout
Get-Content file.md | py "User_Created/Discussion Threads/UserUtility/adjust_headers.py"
```

### 4. Line Range Mode (Command Line)
To edit a specific line range in-place:
```powershell
py "User_Created/Discussion Threads/UserUtility/adjust_headers.py" -f "d:\GitHub_Repo\Task-Dashboard\User_Created\Discussion Threads\Task_log\260626_Th7_UI_Improvements.md" -s 299 -e 309
```

### 5. Whole File Mode (Command Line)
To adjust the whole file in-place:
```powershell
py "User_Created/Discussion Threads/UserUtility/adjust_headers.py" -f "d:\GitHub_Repo\Task-Dashboard\User_Created\Discussion Threads\Task_log\260626_Th7_UI_Improvements.md"
```

---

## Validation Results

Running a mock input with skipped hierarchy:
```powershell
echo "# Query 1.2 -`n# Header 1`n### Header 3" | py "User_Created/Discussion Threads/UserUtility/adjust_headers.py"
```

**Output:**
```markdown
# Query 1.2 -
## Header 1
### Header 3
```
- `# Query 1.2 -` remains at level 1.
- `# Header 1` shifts to level 2 (`## Header 1`).
- `### Header 3` remains at level 3, since it is already subordinate to level 2.
