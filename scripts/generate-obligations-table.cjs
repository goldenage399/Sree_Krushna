/**
 * Sree Krushna Marriage OS — Family Obligations Printable Run Sheet & Table Generator
 * Standard: STD-SHOPPING-OBLIGATION-002 / AC-DEC-2026-064 / UI-DEC-2026-048
 * Ticket: SK-022 (Phase 1)
 *
 * Generates:
 * 1. family-obligations-run-sheet.html (Root)
 * 2. public/family-obligations-run-sheet.html (Public distribution, 100% byte parity)
 * 3. 02_RITUALS_CULTURE/obligations/family_obligations_table.md (Canonical Markdown)
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const obligationsDataFile = path.join(rootDir, 'js', 'obligations-data.js');

if (!fs.existsSync(obligationsDataFile)) {
  console.error('❌ Missing js/obligations-data.js');
  process.exit(1);
}

// Load obligations dataset
const sandbox = {};
const rawCode = fs.readFileSync(obligationsDataFile, 'utf8');
eval(rawCode.replace('window.', 'sandbox.'));
const dataset = sandbox.FAMILY_OBLIGATIONS_DATA;
const obligations = dataset.obligations || [];

console.log(`⚡ Generating Tabular Run Sheets for ${obligations.length} Family Obligations...`);

// Milestone taxonomy & ordering
const milestoneOrder = [
  { id: 'EVT-001', title: 'EVT-001: Nirbandha (Engagement Ceremony)', icon: '💍' },
  { id: 'EVT-002', title: 'EVT-002: Pua-Bhauni & Mangan (Day 1 Pre-Wedding)', icon: '🌿' },
  { id: 'EVT-003', title: 'EVT-003: Snana & Haldi (Day 2 Morning)', icon: '🟡' },
  { id: 'EVT-004', title: 'EVT-004: Barat, Baranugam & Mandap Vivaha (Day 2 Wedding)', icon: '🔥' },
  { id: 'EVT-005', title: 'EVT-005: Bandapana, Gruha Prabesha & Reception', icon: '🏛️' },
  { id: 'EVT-006', title: 'EVT-006: Samandhi Bhoji, Basara & Reciprocal Handovers', icon: '🎁' },
  { id: 'POST_WEDDING', title: 'POST_WEDDING: Post-Wedding Reciprocals & Feasts', icon: '🐟' }
];

function getMilestoneKey(evtRef) {
  if (!evtRef) return 'POST_WEDDING';
  if (evtRef === 'EVT-007') return 'POST_WEDDING';
  const found = milestoneOrder.find(m => m.id === evtRef);
  return found ? found.id : 'POST_WEDDING';
}

function formatDirection(dir) {
  if (dir === 'bride_to_groom') return '👰 Bride Side ⟶ 🤵 Groom Side';
  if (dir === 'groom_to_bride') return '🤵 Groom Side ⟶ 👰 Bride Side';
  return '🤝 Joint / In-Laws Exchange';
}

function formatDirectionPrint(dir) {
  if (dir === 'bride_to_groom') return 'Bride ⟶ Groom';
  if (dir === 'groom_to_bride') return 'Groom ⟶ Bride';
  return 'Joint / In-Laws';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ----------------------------------------------------------------------------
// 1. GENERATE CANONICAL MARKDOWN TABLE
// ----------------------------------------------------------------------------
let mdContent = `# Sree Krushna Marriage OS — Customary Family Obligations Master Table

**Standard:** \`STD-SHOPPING-OBLIGATION-002\` / \`AC-DEC-2026-064\`  
**Governing Ticket:** \`SK-022\`  
**Generated Date:** ${new Date().toISOString().split('T')[0]}  
**Total Obligations:** ${obligations.length}  

---

## 📊 Executive Summary by Milestone

| Milestone | Event Title | Count | Bride Side | Groom Side | Joint / Ext |
| :--- | :--- | :---: | :---: | :---: | :---: |
`;

milestoneOrder.forEach(m => {
  const mObs = obligations.filter(o => getMilestoneKey(o.event_ref) === m.id);
  const bride = mObs.filter(o => o.derived_direction === 'bride_to_groom').length;
  const groom = mObs.filter(o => o.derived_direction === 'groom_to_bride').length;
  const joint = mObs.length - (bride + groom);
  mdContent += `| \`${m.id}\` | ${m.title} | **${mObs.length}** | ${bride} | ${groom} | ${joint} |\n`;
});

mdContent += `\n---\n\n## 📋 Detailed Milestone-by-Milestone Handover Roster\n\n`;

milestoneOrder.forEach(m => {
  const mObs = obligations.filter(o => getMilestoneKey(o.event_ref) === m.id);
  if (mObs.length === 0) return;

  mdContent += `### ${m.icon} ${m.title}\n\n`;
  mdContent += `| Code | Direction | Customary Title & Description | Category | Items & Specifications | Cash / Cost | Sourced Via | Verif |\n`;
  mdContent += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |\n`;

  mObs.forEach(o => {
    const dir = formatDirectionPrint(o.derived_direction);
    const itemsStr = o.items.map(i => (i.quantity ? `${i.quantity} ${i.unit || ''} ` : '') + i.description).join('; ');
    const cashStr = o.financial_obligation && o.financial_obligation.is_monetary
      ? `₹${o.financial_obligation.unit_amount_inr || o.financial_obligation.estimated_total_inr || 'TBD'}${o.financial_obligation.headcount ? '/head' : ''}`
      : '—';
    const trs = (o.downstream_projections && o.downstream_projections.commercial_shopping_ref) || 'Direct';

    mdContent += `| [**${o.id}**](./${o.id}.md) | ${dir} | **${o.customary_title}**<br/>_${o.english_descriptor}_ | \`${o.category}\` | ${itemsStr} | ${cashStr} | \`${trs}\` | [ ] |\n`;
  });

  mdContent += `\n`;
});

const mdOutputFile = path.join(rootDir, '02_RITUALS_CULTURE', 'obligations', 'family_obligations_table.md');
fs.writeFileSync(mdOutputFile, mdContent, 'utf8');
console.log(`  ✓ Written canonical Markdown table: ${mdOutputFile}`);

// ----------------------------------------------------------------------------
// 2. GENERATE STANDALONE A4 PRINTABLE HTML RUN SHEET
// ----------------------------------------------------------------------------
let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sree Krushna Marriage OS — Family Obligations Handover Run Sheet (A4 Landscape)</title>
  <style>
    /* Reset & Base Fonts */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background: #f9fafb;
      line-height: 1.35;
      font-size: 12px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Floating Screen Action Bar */
    .screen-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #1e293b;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .screen-toolbar-title {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .screen-toolbar-actions {
      display: flex;
      gap: 12px;
    }
    .toolbar-btn {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .btn-print { background: #d97706; color: #ffffff; }
    .btn-print:hover { background: #b45309; }
    .btn-back { background: #334155; color: #ffffff; }
    .btn-back:hover { background: #475569; }

    /* Printable Page Sheet Container */
    .sheet-wrapper {
      max-width: 1200px;
      margin: 24px auto;
      background: #ffffff;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-radius: 8px;
    }

    /* Sheet Header Banner */
    .sheet-header {
      border-bottom: 2px solid #000000;
      padding-bottom: 14px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .sheet-title-area h1 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #000000;
    }
    .sheet-title-area p {
      font-size: 11px;
      color: #4b5563;
      margin-top: 4px;
    }
    .sheet-meta-pills {
      display: flex;
      gap: 8px;
      text-align: right;
    }
    .stat-pill {
      border: 1px solid #d1d5db;
      background: #f3f4f6;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
    }
    .stat-pill strong { color: #000000; }

    /* Milestone Table Sections */
    .milestone-block {
      margin-bottom: 28px;
      page-break-inside: avoid;
    }
    .milestone-header {
      background: #000000;
      color: #ffffff;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .milestone-header-sub {
      font-size: 10px;
      font-weight: 500;
      color: #e5e7eb;
    }

    /* High-Density Spreadsheet Table */
    .run-sheet-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    .run-sheet-table th, .run-sheet-table td {
      border: 1px solid #9ca3af;
      padding: 5px 8px;
      text-align: left;
      vertical-align: top;
    }
    .run-sheet-table th {
      background: #f3f4f6;
      color: #000000;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9.5px;
      letter-spacing: 0.03em;
    }
    .run-sheet-table tr:nth-child(even) { background: #fafafa; }

    /* Column Sizing */
    .col-code { width: 75px; font-weight: 700; font-family: monospace; font-size: 10px; }
    .col-dir { width: 115px; font-weight: 600; font-size: 10px; }
    .col-title { width: 220px; }
    .col-cat { width: 85px; font-size: 9.5px; }
    .col-specs { width: 260px; font-size: 10px; }
    .col-cash { width: 80px; font-weight: 600; text-align: right; }
    .col-trs { width: 80px; font-family: monospace; font-size: 9.5px; text-align: center; }
    .col-verif { width: 55px; text-align: center; font-size: 12px; }

    .dir-bride { color: #1d4ed8; }
    .dir-groom { color: #be185d; }
    .dir-joint { color: #047857; }

    .check-box-square {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 1.5px solid #000000;
      border-radius: 2px;
      margin: 2px auto;
    }

    /* Verification & Sign-off Footer */
    .signoff-footer {
      margin-top: 36px;
      padding-top: 20px;
      border-top: 1.5px solid #000000;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      page-break-inside: avoid;
    }
    .signoff-box {
      width: 30%;
      border-top: 1px dashed #000000;
      padding-top: 6px;
      text-align: center;
      font-size: 11px;
      font-weight: 600;
    }

    /* Pure Black & White Ink-Saving Print Rules */
    @media print {
      .no-print { display: none !important; }
      body {
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 9.5px !important;
      }
      .sheet-wrapper {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      .sheet-header {
        border-bottom: 2px solid #000000 !important;
        padding-bottom: 8px !important;
        margin-bottom: 12px !important;
      }
      .sheet-title-area h1 { font-size: 16px !important; }
      .sheet-title-area p { font-size: 9px !important; color: #000000 !important; }
      .milestone-header {
        background: #000000 !important;
        color: #ffffff !important;
        padding: 4px 8px !important;
        font-size: 10px !important;
      }
      .run-sheet-table { font-size: 9px !important; }
      .run-sheet-table th, .run-sheet-table td {
        border: 1px solid #000000 !important;
        padding: 3px 5px !important;
      }
      .run-sheet-table th {
        background: #f0f0f0 !important;
        color: #000000 !important;
      }
      .dir-bride, .dir-groom, .dir-joint { color: #000000 !important; }
      .milestone-block { page-break-inside: avoid; margin-bottom: 16px !important; }
      @page {
        size: A4 landscape;
        margin: 8mm 10mm;
      }
    }
  </style>
</head>
<body>

  <!-- Floating Screen Action Toolbar (Hidden in Print) -->
  <div class="screen-toolbar no-print">
    <div class="screen-toolbar-title">
      <span>📜</span>
      <span>Sree Krushna Marriage OS — Customary Family Obligations Run Sheet</span>
    </div>
    <div class="screen-toolbar-actions">
      <a href="shopping-registry.html?subview=obligations" class="toolbar-btn btn-back">
        <span>←</span> Back to Interactive Registry
      </a>
      <button type="button" onclick="window.print()" class="toolbar-btn btn-print">
        <span>🖨️</span> Print Run Sheet (Ctrl+P)
      </button>
    </div>
  </div>

  <div class="sheet-wrapper">
    <!-- Header Banner -->
    <header class="sheet-header">
      <div class="sheet-title-area">
        <h1>📜 SACRED LINEAGE PROTOCOLS — FAMILY OBLIGATIONS RUN SHEET</h1>
        <p>Canonical Handover Register (Vidhi Dayitva / Bhara / Sara) • Sree & Krushna Hindu Vivaha • Bhubaneswar, Odisha</p>
      </div>
      <div class="sheet-meta-pills no-print">
        <div class="stat-pill">Total: <strong>${obligations.length}</strong></div>
        <div class="stat-pill">Bride Side: <strong>${obligations.filter(o => o.derived_direction === 'bride_to_groom').length}</strong></div>
        <div class="stat-pill">Groom Side: <strong>${obligations.filter(o => o.derived_direction === 'groom_to_bride').length}</strong></div>
        <div class="stat-pill">Unresolved: <strong>${obligations.filter(o => o.spec_status !== 'Fully_Specified').length}</strong></div>
      </div>
    </header>

    <main>
`;

milestoneOrder.forEach(m => {
  const mObs = obligations.filter(o => getMilestoneKey(o.event_ref) === m.id);
  if (mObs.length === 0) return;

  htmlContent += `
      <!-- Milestone: ${m.id} -->
      <section class="milestone-block">
        <div class="milestone-header">
          <span>${m.icon} ${escapeHtml(m.title)}</span>
          <span class="milestone-header-sub">${mObs.length} Customary Lineage Handovers</span>
        </div>
        <table class="run-sheet-table">
          <thead>
            <tr>
              <th class="col-code">Code</th>
              <th class="col-dir">Direction</th>
              <th class="col-title">Customary Title &amp; Description</th>
              <th class="col-cat">Category</th>
              <th class="col-specs">Items / Specifications</th>
              <th class="col-cash">Cash / Cost</th>
              <th class="col-trs">Sourced Via</th>
              <th class="col-verif">Verif</th>
            </tr>
          </thead>
          <tbody>
`;

  mObs.forEach(o => {
    const dirClass = o.derived_direction === 'bride_to_groom' ? 'dir-bride' : o.derived_direction === 'groom_to_bride' ? 'dir-groom' : 'dir-joint';
    const dirText = formatDirectionPrint(o.derived_direction);
    const itemsText = o.items.map(i => (i.quantity ? `${i.quantity} ${i.unit || ''} ` : '') + i.description).join('<br/>• ');
    const cashText = o.financial_obligation && o.financial_obligation.is_monetary
      ? `₹${o.financial_obligation.unit_amount_inr || o.financial_obligation.estimated_total_inr || 'TBD'}${o.financial_obligation.headcount ? '/head' : ''}`
      : '—';
    const trsText = (o.downstream_projections && o.downstream_projections.commercial_shopping_ref) || 'Direct';

    htmlContent += `
            <tr>
              <td class="col-code"><strong>${o.id}</strong></td>
              <td class="col-dir ${dirClass}">${escapeHtml(dirText)}</td>
              <td class="col-title">
                <strong>${escapeHtml(o.customary_title)}</strong>
                <div style="font-size: 9.5px; color: #4b5563; margin-top: 2px;">${escapeHtml(o.english_descriptor)}</div>
              </td>
              <td class="col-cat"><code>${escapeHtml(o.category)}</code></td>
              <td class="col-specs">• ${itemsText}</td>
              <td class="col-cash">${cashText}</td>
              <td class="col-trs"><code>${trsText}</code></td>
              <td class="col-verif"><span class="check-box-square"></span></td>
            </tr>
`;
  });

  htmlContent += `
          </tbody>
        </table>
      </section>
`;
});

htmlContent += `
    </main>

    <!-- Sign-off Block for Family Coordinators -->
    <footer class="signoff-footer">
      <div class="signoff-box">
        Bride's Family Representative<br/>
        (Signature &amp; Date)
      </div>
      <div class="signoff-box">
        Groom's Family Representative<br/>
        (Signature &amp; Date)
      </div>
      <div class="signoff-box">
        Lead Event / Ritual Coordinator<br/>
        (Handover Seal &amp; Date)
      </div>
    </footer>
  </div>

</body>
</html>
`;

// Write to root and public distributions (100% byte parity)
const htmlOutputFileRoot = path.join(rootDir, 'family-obligations-run-sheet.html');
const htmlOutputFilePub = path.join(rootDir, 'public', 'family-obligations-run-sheet.html');

fs.writeFileSync(htmlOutputFileRoot, htmlContent, 'utf8');
fs.writeFileSync(htmlOutputFilePub, htmlContent, 'utf8');

console.log(`  ✓ Written standalone printable HTML (root): ${htmlOutputFileRoot}`);
console.log(`  ✓ Written standalone printable HTML (public): ${htmlOutputFilePub}`);
console.log('✅ Generation complete with 100% byte parity!');
