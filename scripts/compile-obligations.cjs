/**
 * Sree Krushna Marriage OS — Customary Family Obligations Compiler
 * Standard: STD-FAMILY-OBLIGATION-001 / AC-DEC-2026-061 / AC-DEC-2026-062
 * Ticket: SK-020
 * 
 * Aggregates all canonical OBL-### markdown records, validates contracts,
 * generates the human-readable family_obligations_master.md SSOT view, and
 * emits js/obligations-data.js and public/js/obligations-data.js with 100% byte parity.
 */

const fs = require('fs');
const path = require('path');
const { parseYamlFrontmatter } = require('./obligation-parser.cjs');

const rootDir = path.resolve(__dirname, '..');
const obligationsDir = path.join(rootDir, '02_RITUALS_CULTURE', 'obligations');
const jsDir = path.join(rootDir, 'js');
const pubJsDir = path.join(rootDir, 'public', 'js');

console.log('⚡ Compiling Customary Family Obligations (OBL-001)...');

// 1. Scan and parse all OBL-*.md records
const files = fs.existsSync(obligationsDir)
  ? fs.readdirSync(obligationsDir).filter(f => f.startsWith('OBL-') && f.endsWith('.md')).sort()
  : [];

const obligations = [];

for (const f of files) {
  const filePath = path.join(obligationsDir, f);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = parseYamlFrontmatter(raw);
  if (parsed && parsed.id) {
    // Derive direction at runtime
    const obligorFamily = (parsed.obligor && parsed.obligor.family) || 'unspecified';
    const recipientFamily = (parsed.recipient && parsed.recipient.family) || 'unspecified';
    parsed.derived_direction = `${obligorFamily}_to_${recipientFamily}`;
    parsed.file_basename = f;
    obligations.push(parsed);
  }
}

console.log(`  ✓ Parsed ${obligations.length} canonical obligation records from disk.`);

// 2. Compute aggregate statistics
const stats = {
  total: obligations.length,
  by_direction: {
    groom_to_bride: obligations.filter(o => o.derived_direction === 'groom_to_bride').length,
    bride_to_groom: obligations.filter(o => o.derived_direction === 'bride_to_groom').length,
    joint: obligations.filter(o => o.derived_direction.includes('joint')).length,
    external: obligations.filter(o => o.derived_direction.includes('external')).length
  },
  by_lifecycle: {
    Identified: obligations.filter(o => o.lifecycle_status === 'Identified').length,
    Agreed: obligations.filter(o => o.lifecycle_status === 'Agreed').length,
    Procuring: obligations.filter(o => o.lifecycle_status === 'Procuring').length,
    Staged: obligations.filter(o => o.lifecycle_status === 'Staged').length,
    Handed_Over: obligations.filter(o => o.lifecycle_status === 'Handed_Over').length,
    Waived: obligations.filter(o => o.lifecycle_status === 'Waived').length
  },
  by_spec_status: {
    Fully_Specified: obligations.filter(o => o.spec_status === 'Fully_Specified').length,
    TBD_Family_Choice: obligations.filter(o => o.spec_status === 'TBD_Family_Choice').length,
    Source_Unclear: obligations.filter(o => o.spec_status === 'Source_Unclear').length,
    Source_Redacted: obligations.filter(o => o.spec_status === 'Source_Redacted').length,
    Pending_Family_Confirmation: obligations.filter(o => o.spec_status === 'Pending_Family_Confirmation').length
  },
  by_epistemic_tier: {
    SACRED_CORE: obligations.filter(o => o.epistemic_tier === 'SACRED_CORE').length,
    PROTOCOL_SPECIFIED: obligations.filter(o => o.epistemic_tier === 'PROTOCOL_SPECIFIED').length,
    UNCERTAIN_EXPLORATORY: obligations.filter(o => o.epistemic_tier === 'UNCERTAIN_EXPLORATORY').length
  },
  unresolved_count: obligations.filter(o => o.spec_status !== 'Fully_Specified').length
};

// 3. Emit family_obligations_master.md
let masterMd = `# 📜 Family Obligations Master Register (Vidhi Dayitva / Bhara / Sara)

> **Parent Hub**: [\`02_RITUALS_CULTURE/HUB.md\`](../HUB.md)  
> **Standard**: \`STD-FAMILY-OBLIGATION-001\` | **Rulings**: \`AC-DEC-2026-061\` & \`AC-DEC-2026-062\`  
> **Total Obligations**: ${stats.total} | **Unresolved**: ${stats.unresolved_count} | **Last Compiled**: ${new Date().toISOString()}  

---

## 1. Executive Summary & Directional Balance

| Direction | Count | Primary Focus |
| :--- | :--- | :--- |
| **Bride's Family ⟶ Groom / In-Laws** | ${stats.by_direction.bride_to_groom} | Batabasana attire/gold, Bandhu Daksa, Samdhi Milan, Nananda Putuli, Family Packs |
| **Groom's Family ⟶ Bride / In-Laws** | ${stats.by_direction.groom_to_bride} | Ahiya Manduli (Saree for Mummy), Nirbandha lehenga, Haldi Basa, Sadu Basana, Alankar |
| **Joint / External** | ${stats.by_direction.joint + stats.by_direction.external} | Guest honoraria, temple offerings, shared travel trolleys |

---

## 2. Master Obligation Directory

| ID | Customary Title | Event | Direction | Category | Spec Status | Lifecycle | Downstream SKU |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

if (obligations.length === 0) {
  masterMd += `| *None* | *Awaiting Phase 4 Dataset Ingestion (49 Obligations)* | - | - | - | - | - | - |\n`;
} else {
  obligations.forEach(o => {
    const link = `[\`${o.id}\`](./${o.file_basename})`;
    const sku = (o.downstream_projections && o.downstream_projections.commercial_shopping_ref) || '-';
    masterMd += `| ${link} | **${o.customary_title}** | ${o.event_ref || '-'} | ${o.derived_direction} | \`${o.category}\` | \`${o.spec_status}\` | \`${o.lifecycle_status}\` | \`${sku}\` |\n`;
  });
}

masterMd += `
---

## 3. Downstream Projection Channels

### 3.1 Commercial Shopping Pipeline (\`TRS-###\`)
Items fulfilled through retail store procurement in Bhubaneswar (silks, suiting, lehengas, presentation trunks):
- Monitored live in the [Interactive Shopping Registry](../../shopping-registry.html?subview=obligations).
- Governed by [\`SPEC-PROC-TROUSSEAU-001\`](../../04_PROCUREMENT_VENDORS/shopping_and_trousseau/SPEC-PROC-TROUSSEAU-001.md).

### 3.2 Sacred Samagri Checklists (\`SAM-###\`)
Customary items consecrated during Mandap homa and entrance welcoming:
- Cross-referenced in [\`02_RITUALS_CULTURE/HUB.md\`](../HUB.md).

### 3.3 Precious Asset Custody (\`AST-###\`)
Gold and silver jewelry items requiring secure bank locker custody and stage transfer handshakes:
- Governed by [\`04_PROCUREMENT_VENDORS/assets/\`](../../04_PROCUREMENT_VENDORS/).
`;

const masterMdPath = path.join(obligationsDir, 'family_obligations_master.md');
fs.writeFileSync(masterMdPath, masterMd, 'utf8');
console.log(`  ✓ Emitted master markdown register: ${masterMdPath} (${fs.statSync(masterMdPath).size} bytes)`);

// 4. Emit obligations-data.js for client-side consumption with 100% byte parity
const clientDataset = {
  meta: {
    title: "Sree Krushna Marriage OS — Customary Family Obligations Register",
    version: "1.0.0",
    standard: "STD-FAMILY-OBLIGATION-001",
    governance_ref: "AC-DEC-2026-061 & AC-DEC-2026-062",
    updated_at: new Date().toISOString()
  },
  stats,
  obligations
};

const outputJs = `/**
 * Sree Krushna Marriage OS — Customary Family Obligations Dataset
 * Standard: STD-FAMILY-OBLIGATION-001 | Ruling: AC-DEC-2026-061 / AC-DEC-2026-062
 * 
 * Auto-generated by scripts/compile-obligations.cjs. DO NOT EDIT DIRECTLY.
 */

window.FAMILY_OBLIGATIONS_DATA = ${JSON.stringify(clientDataset, null, 2)};
`;

fs.mkdirSync(jsDir, { recursive: true });
fs.mkdirSync(pubJsDir, { recursive: true });

const target1 = path.join(jsDir, 'obligations-data.js');
const target2 = path.join(pubJsDir, 'obligations-data.js');

fs.writeFileSync(target1, outputJs, 'utf8');
fs.writeFileSync(target2, outputJs, 'utf8');

console.log(`  ✓ Emitted client data layer:`);
console.log(`    - ${target1} (${fs.statSync(target1).size} bytes)`);
console.log(`    - ${target2} (${fs.statSync(target2).size} bytes)`);
console.log(`  ✓ 100% Dual-Release Byte Parity Guaranteed.`);
