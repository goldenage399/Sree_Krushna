#!/usr/bin/env node
/**
 * Enhancement Scaffolder - Automated ID Generation & Folder Creation
 * 
 * Usage:
 *   node create-enhancement.js --title "Feature Name" [options]
 * 
 * Options:
 *   --title     (required) Enhancement title
 *   --scope     frontend|backend|docs|misc (default: misc)
 *   --category  FEATURE|REFACTOR|FIX|TEST|DOCS|MIGRATION (default: FEATURE)
 *   --priority  HIGH|MEDIUM|LOW (default: MEDIUM)
 *   --estimation Time estimate (e.g., "2d", "8h") - if >2d creates folder
 *   --complex   Force complex mode (create folder)
 */

const fs = require('fs');
const path = require('path');

// Paths relative to repo root
const REPO_ROOT = path.resolve(__dirname, '../../../../');
const CONFIG_PATH = path.join(REPO_ROOT, 'enhancement-config.json');
const ENHANCEMENTS_PATH = path.join(REPO_ROOT, 'ENHANCEMENTS.md');
const ENHANCEMENT_NOTES_DIR = path.join(REPO_ROOT, 'enhancement-notes');

function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {
        title: '',
        scope: 'misc',
        category: 'FEATURE',
        priority: 'MEDIUM',
        estimation: '1d',
        complex: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--title' && args[i + 1]) parsed.title = args[++i];
        else if (arg === '--scope' && args[i + 1]) parsed.scope = args[++i];
        else if (arg === '--category' && args[i + 1]) parsed.category = args[++i].toUpperCase();
        else if (arg === '--priority' && args[i + 1]) parsed.priority = args[++i].toUpperCase();
        else if (arg === '--estimation' && args[i + 1]) parsed.estimation = args[++i];
        else if (arg === '--complex') parsed.complex = true;
    }

    return parsed;
}

function isComplexEstimation(estimation) {
    const match = estimation.match(/(\d+)(d|h|w)/);
    if (!match) return false;
    const [, num, unit] = match;
    const hours = unit === 'h' ? parseInt(num) : unit === 'd' ? parseInt(num) * 8 : parseInt(num) * 40;
    return hours > 16; // > 2 days = complex
}

function formatTitle(title) {
    return title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
}

function generateEnhancementRow(id, title, category, priority, scope) {
    const today = new Date().toISOString().split('T')[0];
    return `| ${id} | ${title} | ${category} | ${priority} | PENDING | ${today} | ${scope} |`;
}

function generateIndexContent(id, title, category, priority, estimation) {
    return `# ${id}: ${title}

## 📊 Metadata

- **Category**: ${category}
- **Priority**: ${priority}
- **Status**: PENDING
- **Estimate**: ${estimation}
- **Target Release**: TBD
- **Risk Level**: MEDIUM

## 🔗 Dependencies

- **Depends On**: None (Foundational)  # Specify dependent Task ID(s) or "None (Foundational)"
- **Blocks**: None (Foundational)      # Specify blocked Task ID(s) or "None (Foundational)"

## 🎯 Goal

[One sentence description]

## 🛡️ Risk Assessment

- **Risks**: [e.g. Data loss]
- **Mitigation**: [e.g. Backup before run]

## 📜 SSOT Impact

- [Link to affected SSOT 1]
- [Link to affected SSOT 2]

## 📋 Implementation Plan

- [ ] Phase 1: Research & Analysis
- [ ] Phase 2: Implementation
- [ ] Phase 3: Testing
- [ ] Phase 4: Documentation
`;
}

function main() {
    const args = parseArgs();

    if (!args.title) {
        console.error('Error: --title is required');
        console.log('Usage: node create-enhancement.js --title "Feature Name" [--scope backend] [--category FEATURE] [--estimation 2d]');
        process.exit(1);
    }

    // Read config
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error(`Error: enhancement-config.json not found at ${CONFIG_PATH}`);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    const nextId = config.next_id;
    const prefix = config.canonical_prefix || config.id_prefix || 'TASK';
    const enhancementId = `${prefix}-${String(nextId).padStart(3, '0')}`;

    console.log(`\n🎯 Creating Enhancement: ${enhancementId}`);
    console.log(`   Title: ${args.title}`);
    console.log(`   Category: ${args.category}`);
    console.log(`   Priority: ${args.priority}`);
    console.log(`   Estimation: ${args.estimation}`);

    const isComplex = args.complex || isComplexEstimation(args.estimation);
    console.log(`   Mode: ${isComplex ? 'COMPLEX (folder)' : 'SIMPLE (entry only)'}`);

    // Update config with incremented ID
    config.next_id = nextId + 1;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
    console.log(`\n✅ Updated enhancement-config.json (next_id: ${config.next_id})`);

    // Append to ENHANCEMENTS.md
    const row = generateEnhancementRow(enhancementId, args.title, args.category, args.priority, args.scope);
    fs.appendFileSync(ENHANCEMENTS_PATH, row + '\n');
    console.log(`✅ Appended to ENHANCEMENTS.md`);

    // Create folder if complex
    if (isComplex) {
        const folderName = `${enhancementId}-${formatTitle(args.title)}`;
        const folderPath = path.join(ENHANCEMENT_NOTES_DIR, folderName);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const indexPath = path.join(folderPath, '00_ENHANCEMENT_INDEX.md');
        const indexContent = generateIndexContent(enhancementId, args.title, args.category, args.priority, args.estimation);
        fs.writeFileSync(indexPath, indexContent);
        console.log(`✅ Created folder: ${folderName}`);
        console.log(`✅ Created 00_ENHANCEMENT_INDEX.md`);
    }

    console.log(`\n🎉 Enhancement ${enhancementId} scaffolded successfully!`);
    console.log(`\nNext steps:`);
    console.log(`  1. Review ENHANCEMENTS.md entry`);
    if (isComplex) {
        console.log(`  2. Edit 00_ENHANCEMENT_INDEX.md with details`);
    }
}

main();
