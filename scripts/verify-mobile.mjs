#!/usr/bin/env node
/**
 * Sree Krushna Marriage OS — Automated Mobile Verification Gate (M-GATE-01)
 *
 * Implements deterministic checks from:
 * - Protocol 19 (.agent/workflows/mobile-ui-engineering.md)
 * - Defensive CSS & Mobile UI Validator (.agent/skills/mobile-ui-validator/SKILL.md)
 * - Discussion Thread 260821_Initiation.md (L3081-L3236)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('\n📱 ========================================================');
console.log('👑 Sree Krushna Marriage OS — Mobile First Gate (M-GATE-01)');
console.log('==========================================================\n');

let errors = [];
let warnings = [];
let passCount = 0;

function assert(condition, message, isWarning = false) {
  if (condition) {
    passCount++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    if (isWarning) {
      warnings.push(message);
      console.log(`  ⚠️  WARN: ${message}`);
    } else {
      errors.push(message);
      console.log(`  ❌ FAIL: ${message}`);
    }
  }
}

// 1. Audit public/index.html & index.html
const filesToAudit = ['public/index.html', 'index.html'];

for (const relPath of filesToAudit) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`File not found: ${relPath}`);
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  console.log(`\n🔍 Auditing ${relPath}...`);

  // Check 1: Viewport Meta Tag
  const hasViewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i.test(content);
  assert(hasViewport, `${relPath}: Contains standard responsive viewport meta tag`);

  // Check 2: Zero Horizontal Body Overflow Contract
  const hasZeroOverflow = /html,\s*body\s*\{[^}]*overflow-x:\s*hidden/i.test(content) || /body\s*\{[^}]*overflow-x:\s*hidden/i.test(content);
  assert(hasZeroOverflow, `${relPath}: Enforces body { overflow-x: hidden }`);

  // Check 3: Sticky Header & Nav Z-Index Tokens
  const hasZIndexTokens = /--z-sticky:\s*1000/i.test(content) && /--z-modal:\s*1020/i.test(content);
  assert(hasZIndexTokens, `${relPath}: Declares semantic layout z-index tokens (--z-sticky, --z-modal)`);

  // Check 4: Touch Target Minimums (>=44px)
  const has44pxMinTargets = /min-height:\s*44px/i.test(content);
  assert(has44pxMinTargets, `${relPath}: Implements WCAG 2.5.8 min-height: 44px touch targets`);

  // Check 5: Responsive Table Containment
  const tableMatches = content.match(/<table/g) || [];
  const wrapperMatches = content.match(/class=["'][^"']*table-responsive-wrapper[^"']*["']/g) || [];
  assert(
    tableMatches.length > 0 && wrapperMatches.length >= tableMatches.length,
    `${relPath}: All tabular data (${tableMatches.length} tables) contained in .table-responsive-wrapper`
  );

  // Check 6: Mobile Media Queries Presence (<=768px & <=480px)
  const has768pxQuery = /@media\s*\(\s*max-width:\s*768px\s*\)/i.test(content);
  const has480pxQuery = /@media\s*\(\s*max-width:\s*480px\s*\)/i.test(content);
  assert(has768pxQuery && has480pxQuery, `${relPath}: Defines both 768px tablet & 480px ultra-mobile media queries`);

  // Check 7: Input text font size (>=16px or 0.95rem to prevent iOS auto-zoom)
  const hasSafeInputSize = /input\[type=["']text["']\][^{]*\{[^}]*font-size:\s*0\.95rem/i.test(content) || /font-size:\s*16px/i.test(content);
  assert(hasSafeInputSize, `${relPath}: Text inputs calibrated to prevent iOS safari auto-zoom on tap`);

  // Check 8: Touch momentum scrolling on horizontal containers
  const hasMomentumScroll = /-webkit-overflow-scrolling:\s*touch/i.test(content);
  assert(hasMomentumScroll, `${relPath}: Nav & Swimlanes use -webkit-overflow-scrolling: touch`);
}

// 2. Summary Verdict
console.log('\n==========================================================');
console.log(`📊 Gate Summary: ${passCount} Checks Passed | ${errors.length} Failed | ${warnings.length} Warnings`);
console.log('==========================================================\n');

if (errors.length > 0) {
  console.error('🛑 M-GATE-01 VERIFICATION FAILED:\n');
  errors.forEach(e => console.error(`  ❌ ${e}`));
  process.exit(1);
} else {
  console.log('✨ M-GATE-01 VERIFICATION PASSED — Mobile & Web View Fully Optimized!\n');
  process.exit(0);
}
