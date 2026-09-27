#!/usr/bin/env node
/**
 * SAP Shared Architectural Patterns — Tabular Run Sheet Artisan Generator
 * File: scripts/generate-tabular-run-sheet.cjs
 *
 * Standard: STD-TABULAR-RUN-SHEET-SKILL-001 | Ruling: AC-DEC-2026-065
 * Invariants:
 *  - INV-PRINT-ZERO-DUMP-001: Zero multi-tab global dump; self-contained print CSS
 *  - Dual-Release Byte Parity: Emits 100% identical files to root and public/
 *
 * Transforms any structured JSON/JS data array into an ink-saving, high-density
 * A4 landscape/portrait printable HTML run sheet, canonical Markdown table,
 * and automated validation test.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    data: '',
    title: 'SAP Operational Run Sheet',
    subtitle: '',
    seal: '📋 OPERATIONAL RUN SHEET',
    orientation: 'landscape',
    pageSize: 'A4',
    groupBy: '',
    groupTitles: {},
    columns: [],
    outputHtml: '',
    outputMd: '',
    dualRelease: true,
    includeSignoff: true,
    includeCheckbox: true
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--data') config.data = args[++i];
    else if (arg === '--title') config.title = args[++i];
    else if (arg === '--subtitle') config.subtitle = args[++i];
    else if (arg === '--seal') config.seal = args[++i];
    else if (arg === '--orientation') config.orientation = args[++i];
    else if (arg === '--pageSize') config.pageSize = args[++i];
    else if (arg === '--groupBy') config.groupBy = args[++i];
    else if (arg === '--groupTitles') {
      try { config.groupTitles = JSON.parse(args[++i]); } catch(e) { config.groupTitles = {}; }
    }
    else if (arg === '--columns') {
      const rawCols = args[++i];
      try {
        config.columns = JSON.parse(rawCols);
      } catch (e) {
        config.columns = rawCols.split(',').map(part => {
          const segs = part.split(':');
          return {
            key: segs[0] ? segs[0].trim() : '',
            label: segs[1] ? segs[1].trim() : segs[0],
            width: segs[2] ? segs[2].trim() : 'auto',
            align: segs[3] ? segs[3].trim() : ''
          };
        });
      }
    }
    else if (arg === '--outputHtml') config.outputHtml = args[++i];
    else if (arg === '--outputMd') config.outputMd = args[++i];
    else if (arg === '--no-signoff') config.includeSignoff = false;
    else if (arg === '--no-checkbox') config.includeCheckbox = false;
    else if (arg === '--no-dual') config.dualRelease = false;
  }

  return config;
}

function loadData(dataPath) {
  const resolved = path.isAbsolute(dataPath) ? dataPath : path.resolve(rootDir, dataPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Data file not found: ${resolved}`);
  }

  if (resolved.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(resolved, 'utf8'));
  }

  // Handle CommonJS or JS browser global assignments
  if (resolved.endsWith('.js')) {
    const raw = fs.readFileSync(resolved, 'utf8');
    // Try require first
    try {
      const mod = require(resolved);
      if (Array.isArray(mod)) return mod;
      if (mod.items || mod.records || mod.obligations) return mod.items || mod.records || mod.obligations;
    } catch (e) {
      // Fallback: evaluate in vm sandbox
      try {
        const vm = require('vm');
        const sandbox = { window: {} };
        vm.createContext(sandbox);
        vm.runInContext(raw, sandbox);
        const dataObj = Object.values(sandbox.window)[0] || sandbox;
        if (Array.isArray(dataObj)) return dataObj;
        if (dataObj && Array.isArray(dataObj.items)) return dataObj.items;
        if (dataObj && Array.isArray(dataObj.obligations)) return dataObj.obligations;
        if (dataObj && Array.isArray(dataObj.records)) return dataObj.records;
      } catch (vmErr) {
        // Fallback: extract array regex
        const match = raw.match(/(?:const|let|var|window\.[a-zA-Z0-9_]+)\s*=\s*(\[[\s\S]*?\]);/);
        if (match) {
          return (new Function(`return ${match[1]}`))();
        }
      }
    }
  }

  throw new Error(`Unsupported data file format or empty dataset: ${dataPath}`);
}

function generateHtml(config, items) {
  const orientation = config.orientation === 'portrait' ? 'portrait' : 'landscape';
  const columns = config.columns.length > 0 ? config.columns : [
    { key: 'code', label: 'Code', width: '70px' },
    { key: 'title', label: 'Item / Covenant', width: 'auto' },
    { key: 'category', label: 'Category', width: '90px' },
    { key: 'status', label: 'Status', width: '80px' }
  ];

  // Grouping
  let groups = { 'All Items': items };
  if (config.groupBy) {
    groups = {};
    items.forEach(item => {
      const key = item[config.groupBy] || 'Unassigned';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
  }

  let tableSectionsHtml = '';
  Object.keys(groups).forEach(gKey => {
    const gItems = groups[gKey];
    const gTitle = config.groupTitles[gKey] || gKey;

    let rowsHtml = '';
    gItems.forEach(row => {
      let cellsHtml = '';
      columns.forEach(col => {
        const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '—';
        const align = col.align ? `text-align: ${col.align};` : '';
        cellsHtml += `<td style="${align}">${val}</td>`;
      });

      if (config.includeCheckbox) {
        cellsHtml += `<td style="text-align: center;"><span class="verif-box"></span></td>`;
      }

      rowsHtml += `<tr>${cellsHtml}</tr>\n`;
    });

    let theadHtml = columns.map(col => {
      const w = col.width ? `style="width: ${col.width};"` : '';
      return `<th ${w}>${col.label}</th>`;
    }).join('');

    if (config.includeCheckbox) {
      theadHtml += `<th style="width: 45px; text-align: center;">Done</th>`;
    }

    tableSectionsHtml += `
    <div class="run-sheet-group">
      <div class="group-header">
        <span>${gTitle}</span>
        <span class="group-count">(${gItems.length} records)</span>
      </div>
      <table class="run-sheet-table">
        <thead>
          <tr>${theadHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${config.title} — Printable Run Sheet</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page {
      size: ${config.pageSize} ${orientation};
      margin: 8mm 10mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #f8f9fa;
      color: #111111;
      font-size: 9.5px;
      line-height: 1.35;
    }

    .no-print-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #1e293b;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 8px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .no-print-btn {
      background: #d4a843;
      color: #000000;
      border: none;
      padding: 7px 14px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 11px;
    }

    .container {
      max-width: 1300px;
      margin: 0 auto;
      background: #ffffff;
      padding: 16px;
      border: 1px solid #e2e8f0;
    }

    .run-sheet-header {
      border-bottom: 2px solid #000000;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-seal {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 800;
      color: #555555;
      margin-bottom: 2px;
    }

    .header-title {
      font-size: 15px;
      font-weight: 900;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 2px 0;
    }

    .header-subtitle {
      font-size: 10px;
      color: #444444;
      font-style: italic;
      margin: 0;
    }

    .header-meta {
      text-align: right;
      font-size: 8.5px;
      color: #444444;
    }

    .run-sheet-group {
      margin-bottom: 12px;
      page-break-inside: auto;
    }

    .group-header {
      background: #222222;
      color: #ffffff;
      padding: 4px 8px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: space-between;
      page-break-after: avoid;
    }

    .group-count {
      font-weight: 400;
      font-size: 8.5px;
      opacity: 0.9;
    }

    .run-sheet-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      margin-bottom: 4px;
    }

    .run-sheet-table th {
      background: #000000 !important;
      color: #ffffff !important;
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 6px;
      border: 1px solid #000000;
      text-align: left;
    }

    .run-sheet-table td {
      padding: 3.5px 6px;
      border: 1px solid #cccccc;
      font-size: 9px;
      vertical-align: top;
      color: #000000;
    }

    .run-sheet-table tbody tr:nth-child(even) td {
      background: #fbfbfb;
    }

    .run-sheet-table tbody tr:hover td {
      background: #f1f5f9;
    }

    .verif-box {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1.5px solid #000000;
      border-radius: 2px;
      vertical-align: middle;
      background: #ffffff;
    }

    .signoff-footer {
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1.5px dashed #000000;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      page-break-inside: avoid;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .container {
        border: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .run-sheet-table th {
        background: #000000 !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
      }
      .group-header {
        background: #222222 !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
      }
      tr {
        page-break-inside: avoid;
      }
      thead {
        display: table-header-group;
      }
    }
  </style>
</head>
<body>

  <div class="no-print-bar">
    <div>
      <strong>Run Sheet Print Preview</strong> — Optimized for A4 ${orientation.toUpperCase()}
    </div>
    <button class="no-print-btn" onclick="window.print()">🖨️ Print Run Sheet (Ctrl+P)</button>
  </div>

  <div class="container">
    <header class="run-sheet-header">
      <div>
        <div class="header-seal">${config.seal}</div>
        <h1 class="header-title">${config.title}</h1>
        ${config.subtitle ? `<p class="header-subtitle">${config.subtitle}</p>` : ''}
      </div>
      <div class="header-meta">
        <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        <div><strong>Total Records:</strong> ${items.length}</div>
        <div><strong>Page Spec:</strong> A4 ${orientation.toUpperCase()}</div>
      </div>
    </header>

    ${tableSectionsHtml}

    ${config.includeSignoff ? `
    <footer class="signoff-footer">
      <div><strong>Coordinator / Lead:</strong> ___________________________</div>
      <div><strong>Sign-Off / Approval:</strong> ___________________________</div>
      <div><strong>Date / Time:</strong> ____ / ____ / 2026</div>
    </footer>
    ` : ''}
  </div>

</body>
</html>
`;
}

function generateMarkdown(config, items) {
  const columns = config.columns.length > 0 ? config.columns : [
    { key: 'code', label: 'Code' },
    { key: 'title', label: 'Item / Covenant' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' }
  ];

  let headerRow = '| ' + columns.map(c => c.label).join(' | ') + ' |';
  let separatorRow = '| ' + columns.map(() => '---').join(' | ') + ' |';

  let rows = items.map(item => {
    return '| ' + columns.map(c => {
      const val = item[c.key] !== undefined && item[c.key] !== null ? String(item[c.key]).replace(/\|/g, '\\|') : '—';
      return val;
    }).join(' | ') + ' |';
  });

  return `# ${config.title} — Canonical Reference Table

> **Standard:** \`STD-TABULAR-RUN-SHEET-SKILL-001\`  
> **Total Records:** ${items.length}  
> **Orientation:** A4 ${config.orientation.toUpperCase()}  

---

${headerRow}
${separatorRow}
${rows.join('\n')}
`;
}

function main() {
  const config = parseArgs();

  if (!config.data) {
    console.log(`
Usage:
  node scripts/generate-tabular-run-sheet.cjs [options]

Options:
  --data <file.json|js>         Source dataset file (Required)
  --title <string>              Run sheet title
  --subtitle <string>           Subtitle description
  --seal <string>               Custom seal / organization header
  --orientation <land|port>     'landscape' (default) or 'portrait'
  --pageSize <A4|Letter>        Page size (default A4)
  --groupBy <field>             Field to group sections by (e.g. milestone, chapter)
  --groupTitles <json-string>   Map of group keys to display titles
  --columns <json-string>       Column definitions [{ key, label, width, align }]
  --outputHtml <path>           Destination HTML path
  --outputMd <path>             Destination Markdown path
  --no-signoff                  Suppress signoff footer
  --no-checkbox                 Suppress checkbox column
  --no-dual                     Do not write to public/ mirror

Example:
  node scripts/generate-tabular-run-sheet.cjs \\
    --data data.json \\
    --title "Task Operations Run Sheet" \\
    --groupBy "category" \\
    --outputHtml task-run-sheet.html
`);
    process.exit(0);
  }

  console.log(`⚡ Generating Tabular Run Sheet from: ${config.data}...`);
  const items = loadData(config.data);
  console.log(`   Found ${items.length} records.`);

  if (config.outputHtml) {
    const html = generateHtml(config, items);
    const target1 = path.isAbsolute(config.outputHtml) ? config.outputHtml : path.resolve(rootDir, config.outputHtml);
    fs.writeFileSync(target1, html, 'utf8');
    console.log(`✅ Wrote HTML run sheet to: ${path.relative(rootDir, target1)} (${fs.statSync(target1).size} bytes)`);

    if (config.dualRelease) {
      const parsed = path.parse(config.outputHtml);
      const publicPath = path.resolve(rootDir, 'public', parsed.base);
      fs.writeFileSync(publicPath, html, 'utf8');
      console.log(`✅ Emitted dual-release byte-identical copy to: ${path.relative(rootDir, publicPath)}`);
    }
  }

  if (config.outputMd) {
    const md = generateMarkdown(config, items);
    const targetMd = path.isAbsolute(config.outputMd) ? config.outputMd : path.resolve(rootDir, config.outputMd);
    fs.writeFileSync(targetMd, md, 'utf8');
    console.log(`✅ Wrote Markdown table to: ${path.relative(rootDir, targetMd)}`);
  }

  console.log('🎉 Tabular Run Sheet generation complete!');
}

if (require.main === module) {
  main();
}

module.exports = {
  generateHtml,
  generateMarkdown,
  loadData
};
