/**
 * Sree Krushna Marriage OS — Shopping Catalog JSONL & CSV Exporter
 * Standard: SPEC-PROC-TROUSSEAU-001 / P-SHOPPING-FIRESTORE-COLLAB-001
 * Ruling: AC-DEC-2026-028 / UI-DEC-2026-024
 * 
 * Exports the canonical 44 items from js/shopping-data.js into:
 * 1. 04_PROCUREMENT_VENDORS/shopping_and_trousseau/shopping_items.jsonl
 * 2. 04_PROCUREMENT_VENDORS/shopping_and_trousseau/shopping_items.csv
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dataJsPath = path.join(rootDir, 'js', 'shopping-data.js');
const outDir = path.join(rootDir, '04_PROCUREMENT_VENDORS', 'shopping_and_trousseau');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Read and eval shopping-data.js
const code = fs.readFileSync(dataJsPath, 'utf8');
const sandbox = {};
eval(code.replace('window.', 'sandbox.'));

const data = sandbox.SHOPPING_REGISTRY_DATA;
if (!data || !Array.isArray(data.items)) {
  console.error('❌ Failed to load shopping items from js/shopping-data.js');
  process.exit(1);
}

const items = data.items;
console.log(`📦 Loaded ${items.length} canonical items from shopping data.`);

// 1. Generate JSONL
const jsonlPath = path.join(outDir, 'shopping_items.jsonl');
const jsonlContent = items.map(item => JSON.stringify(item)).join('\n') + '\n';
fs.writeFileSync(jsonlPath, jsonlContent, 'utf8');
console.log(`✅ Emitted ${jsonlPath} (${fs.statSync(jsonlPath).size} bytes)`);

// 2. Generate CSV
const csvPath = path.join(outDir, 'shopping_items.csv');
const escapeCsv = (str) => {
  if (str === undefined || str === null) return '""';
  const s = String(str).replace(/"/g, '""');
  return `"${s}"`;
};

const headers = [
  'ID', 'Code', 'Title', 'Category', 'Chapter_ID', 'Liturgical_Role',
  'Fabric_Spec', 'Suggested_Color', 'Store', 'Est_Price_Range', 'Status', 'Notes'
];

const csvRows = [headers.join(',')];

items.forEach(item => {
  const row = [
    escapeCsv(item.id),
    escapeCsv(item.code || ''),
    escapeCsv(item.title),
    escapeCsv(item.category),
    escapeCsv(item.chapterId),
    escapeCsv(item.role || ''),
    escapeCsv(item.spec || ''),
    escapeCsv(item.suggestedColor || ''),
    escapeCsv(item.store || ''),
    escapeCsv(item.priceRange || ''),
    escapeCsv(item.status || 'Planned'),
    escapeCsv(item.notes || '')
  ];
  csvRows.push(row.join(','));
});

const csvContent = csvRows.join('\n') + '\n';
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log(`✅ Emitted ${csvPath} (${fs.statSync(csvPath).size} bytes)`);
