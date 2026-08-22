# UI Manual Capture & Visual Documentation Workflow

> **Workflow Type**: Ecosystem-Wide Standard (Tier 1 Web Apps & Tier 3 DO-PKOS)  
> **Source Tool**: `tools/ui-manual-capture/` (CLI: `ui-manual-capture`)  
> **Applicability**: All user-facing repositories with interactive visual interfaces (`Task-Dashboard`, `PIOperationsMgmt`, `UG-Farmhouse`, `QSR`)

---

## 1. Purpose & Core Principles

Visual documentation rots when screenshots must be taken manually. This workflow establishes an automated, reproducible visual capture pipeline across the entire ecosystem:

- **100% Deterministic Captures**: Fixed viewport (`1920x1080 @ 2x DPI`), per-target state isolation, and disabled animations ensure identical byte-for-byte SHA-256 hashes when UI hasn't changed.
- **Context Padding**: Crops include surrounding UI context (default 60px) rather than isolated microscopic buttons.
- **Callout Badges (`#NN`)**: Injected highlight borders and cyan numbered badges pinpoint action locations without third-party image editing tools.
- **Automated Embed Generation**: Generates `EMBED_SNIPPETS.md` containing ready-to-paste markdown image links.

---

## 2. Cross-Tier Operational Models

```
                                 [ui-manual-capture Engine]
                                (tools/ui-manual-capture/)
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
                    ▼                                               ▼
          [Tier 1: React / Firebase]                     [Tier 3: DO-PKOS Offline]
          (Task-Dashboard, PIOperations)                 (UG-Farmhouse, QSR)
          • targetUrl: "http://localhost:5173"           • targetFile: "standalone-dashboard.html"
          • readySelector: "#root .admin-shell"          • readySelector: "#swimlane-inner .task-card"
          • install: npm install file:...                • run: node tools/ui-manual-capture/capture.js
```

---

## 3. Step-by-Step SOP

### Step 1: Identify Interactive Action Points
When a new feature, toolbar, filter, or side panel is created or modified:
1. Identify the target CSS selector (e.g. `#filter-ready-btn`, `#detail-panel`, `.export-dropdown`).
2. Identify the required interaction action:
   - `none`: Static UI component (KPI cards, headers).
   - `click` / `dblclick`: Opening drawers, toggling filters.
   - `press_key`: Keyboard shortcuts (e.g. `KeyT` for table view).
   - `fill`: Typing query into search inputs.
   - `sequence`: Multi-step flows (e.g. Expand drawer $\rightarrow$ Click export).

---

### Step 2: Update `ui-manual.config.json`
Add or update the item entry in `ui-manual.config.json` at the repo root:

```json
{
  "id": 5,
  "name": "05-task-card-anatomy",
  "title": "Task Card Anatomy & Ports",
  "selector": ".task-card[data-id=\"A1-001\"]",
  "contextPadding": 48,
  "annotationColor": "#00E5FF",
  "action": {
    "type": "click",
    "target": ".task-card[data-id=\"A1-001\"]",
    "timeout": 350
  },
  "description": "Selected card highlighting upstream and downstream dependency lines"
}
```

---

### Step 3: Run the Capture Suite

```bash
# Tier 3 DO-PKOS:
node tools/ui-manual-capture/capture.js

# Tier 1 React (with dev server running):
npm run capture:manual

# Local development mode (skips syncCommand):
node tools/ui-manual-capture/capture.js --no-sync
```

**Preflight Execution Checks**:
- The engine checks that all selectors exist in the DOM.
- It calculates `rawClip` (tight context padding) and `annotatedClip` (guaranteed $\ge 24\text{px}$ padding for badge and glow).
- It compares SHA-256 hashes against disk files; only modified screenshots are written (`[DIFF]`), unchanged screenshots are skipped (`[SKIP]`).
- *See `.agent/patterns/deterministic-ui-manual-capture-and-annotation-pipeline.md` for the full deterministic capture & annotation architecture.*

---

### Step 4: Embed Screenshots in User Manuals
Open the generated `EMBED_SNIPPETS.md` in the output directory and paste the formatted markdown snippets into your user manual:

```markdown
### Active Dependency Chain Highlight
Selected card with illuminated upstream/downstream SVG bezier lines

![Active Dependency Chain Highlight](screenshots/06-dependency-chain-highlight.png)
```

---

### Step 4b: Compile Office Formats (DOCX & PPTX Deck)
In addition to Markdown manuals, generate styled, publication-grade Word documents and PowerPoint decks embedding all 12 annotated retina screenshots:

```bash
# 1. Generate Executive Proposal & Operations Manual (Word DOCX):
python scripts/generate_proposal_docx.py
# Output: DO_PKOS_Proposal_and_User_Manual.docx (Formatted with Modern Slate styles, tables & callouts)

# 2. Generate 16:9 Executive Presentation Deck (PowerPoint PPTX):
python scripts/generate_proposal_pptx.py
# Output: DO_PKOS_Executive_Proposal.pptx (11 dark-mode slides with action point cards)
```

---

### Step 5: Validate & Synchronize

1. **Verify Integrity**: Run validation suites (e.g. `node validate_cross_deps.js` in Tier 3 or `npm test` in Tier 1).
2. **Reverse Sync (Tier 3)**: If changes touch shared portable assets, execute:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\sync-portable.ps1 -Reverse
   ```
3. **Commit & Stage**: Stage the updated config, screenshot assets, and user manuals together in a logical commit.

---

## 4. Troubleshooting & Best Practices

- **Selector Not Found**: Ensure `readySelector` waits for the dynamic data layer to mount before captures begin.
- **Flaky Visual Diff**: Ensure elements with CSS transitions have sufficient `action.timeout` (e.g. $\ge 300\text{ms}$) so transitions complete 100% before the crop is captured.
- **Caret Blinking**: The engine automatically injects `caret-color: transparent !important` to prevent blinking text cursors from causing false diffs.
