#!/usr/bin/env node
/**
 * deploy-gas-relay.cjs
 * 
 * Cross-Platform Deployment Script for Google Apps Script Media Relay
 * Standard: STD-DRIVE-MEDIA-RELAY-001 (Sree Krushna Marriage OS Instance)
 * 
 * Usage:
 *   node scripts/deploy-gas-relay.cjs [--target-dir=backend_gas] [--push]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const targetDirArg = args.find(a => a.startsWith('--target-dir='));
const shouldPush = args.includes('--push');
const targetDirName = targetDirArg ? targetDirArg.split('=')[1] : 'backend_gas';

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = path.resolve(ROOT, targetDirName);

console.log('🚀 Sheet-Drive Media Relay Deployer (STD-DRIVE-MEDIA-RELAY-001)\n');
console.log(`📂 Target directory: ${TARGET_DIR}`);

// 1. Verify Directory and Files
if (!fs.existsSync(TARGET_DIR)) {
  console.error(`❌ Error: Target directory does not exist: ${TARGET_DIR}`);
  process.exit(1);
}

const jsFile = path.join(TARGET_DIR, 'MediaRelay.js');
const manifestFile = path.join(TARGET_DIR, 'appsscript.json');
const claspFile = path.join(TARGET_DIR, '.clasp.json');

if (!fs.existsSync(jsFile)) {
  console.error(`❌ Error: Missing MediaRelay.js in ${TARGET_DIR}`);
  process.exit(1);
}

if (!fs.existsSync(manifestFile)) {
  console.error(`❌ Error: Missing appsscript.json in ${TARGET_DIR}`);
  process.exit(1);
}

// 2. Pre-flight Syntax Check
console.log('🔍 Running pre-flight JavaScript syntax check (node -c)...');
try {
  execSync(`node -c "${jsFile}"`, { stdio: 'inherit' });
  console.log('  ✅ Syntax check passed cleanly.\n');
} catch (syntaxErr) {
  console.error('  ❌ Syntax check failed! Please resolve errors before deploying.');
  process.exit(1);
}

// 3. Verify .clasp.json
if (!fs.existsSync(claspFile)) {
  console.warn(`⚠️ Warning: No .clasp.json found in ${TARGET_DIR}`);
  console.log('\nTo configure clasp deployment, create .clasp.json:');
  console.log(`{
  "scriptId": "YOUR_APPS_SCRIPT_PROJECT_ID",
  "rootDir": "."
}\n`);
  if (shouldPush) {
    console.error('❌ Cannot push without .clasp.json');
    process.exit(1);
  }
} else {
  console.log('✅ Found .clasp.json configuration.');
}

// 4. Clasp Push Execution (if --push flag passed)
if (shouldPush) {
  console.log('📤 Executing clasp push...');
  try {
    execSync('npx @google/clasp push --force', { cwd: TARGET_DIR, stdio: 'inherit' });
    console.log('  ✅ Clasp push completed.');
  } catch (pushErr) {
    console.error('\n❌ Clasp push failed. Ensure you are logged in via `npx @google/clasp login`.');
    process.exit(1);
  }

  // 5. Version Bump & Live Deployment Update (PIOps / STD-DRIVE-MEDIA-RELAY-001)
  let claspConfig = {};
  try {
    claspConfig = JSON.parse(fs.readFileSync(claspFile, 'utf8'));
  } catch (e) {}

  const deploymentIdArg = args.find(a => a.startsWith('--deployment-id='));
  const deploymentId = deploymentIdArg ? deploymentIdArg.split('=')[1] : claspConfig.deploymentId;
  const descArg = args.find(a => a.startsWith('--desc='));
  const deployDesc = descArg ? descArg.split('=')[1] : `deploy ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`;

  console.log('\n📦 Bumping versioned deployment...');
  try {
    let deployCmd = 'npx @google/clasp deploy';
    if (deploymentId) {
      deployCmd += ` --deploymentId ${deploymentId}`;
    }
    deployCmd += ` --description "${deployDesc}"`;

    const deployOut = execSync(deployCmd, { cwd: TARGET_DIR }).toString().trim();
    console.log(`  ${deployOut}`);

    const matchedId = deploymentId || (deployOut.match(/Deployed\s+([A-Za-z0-9_-]+)/) ? deployOut.match(/Deployed\s+([A-Za-z0-9_-]+)/)[1] : null);
    if (matchedId) {
      console.log(`\n🎉 Web App URL is live with new code:\n  https://script.google.com/macros/s/${matchedId}/exec\n`);
    }
  } catch (deployErr) {
    console.warn(`  ⚠️ Warning: Version bump failed: ${deployErr.message}`);
    console.log('  Check existing deployments: npx @google/clasp deployments');
  }
} else {
  console.log('💡 Dry run completed successfully.');
  console.log('To push live changes to Google Apps Script and update deployment, run:');
  console.log(`  node ${path.relative(ROOT, __filename)} --target-dir=${targetDirName} --push\n`);
}
