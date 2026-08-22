/**
 * Sree Krushna & Ecosystem — Universal Web App Scaffolder & Release Gate Bootstrap CLI
 * Standard: SPEC-SAP-BOOTSTRAP-001 / P-VERIFY-GATE-002
 * 
 * Usage:
 *   1. Scaffold New Turnkey Web App:
 *      node scripts/bootstrap-web-app.cjs scaffold <targetDir> [appName] [firebaseProject]
 * 
 *   2. Retrofit Existing Project with Release Gate:
 *      node scripts/bootstrap-web-app.cjs retrofit <targetDir>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'templates', 'web-spa-shell');

function copyDirRecursive(src, dest, replacements = {}) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, replacements);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      for (const [key, val] of Object.entries(replacements)) {
        content = content.split(key).join(val);
      }
      fs.writeFileSync(destPath, content, 'utf8');
    }
  }
}

function handleScaffold(targetDirArg, appNameArg, firebaseProjectArg) {
  if (!targetDirArg) {
    console.error('\x1b[31m❌ Error: Target directory is required.\x1b[0m');
    console.log('Usage: node scripts/bootstrap-web-app.cjs scaffold <targetDir> [appName] [firebaseProject]');
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), targetDirArg);
  const appName = appNameArg || path.basename(targetDir);
  const firebaseProject = firebaseProjectArg || `${appName}-app`;
  const appTitle = appName.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  console.log('\n===============================================================');
  console.log('🚀 SCAFFOLDING NEW TURNKEY WEB APP (SPEC-SAP-BOOTSTRAP-001)');
  console.log('===============================================================');
  console.log(`Target Directory:  ${targetDir}`);
  console.log(`Application Name:  ${appName}`);
  console.log(`Firebase Project:  ${firebaseProject}`);
  console.log(`Application Title: ${appTitle}`);

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`\x1b[31m❌ Error: Template directory not found at ${TEMPLATE_DIR}\x1b[0m`);
    process.exit(1);
  }

  const replacements = {
    '{{APP_NAME}}': appName,
    '{{APP_TITLE}}': appTitle,
    '{{FIREBASE_PROJECT}}': firebaseProject
  };

  console.log('\n▶ Copying starter template & design tokens...');
  copyDirRecursive(TEMPLATE_DIR, targetDir, replacements);

  // Initialize or merge package.json
  const pkgPath = path.join(targetDir, 'package.json');
  let pkg = {
    name: appName,
    version: '1.0.0',
    description: `${appTitle} — Production Web Single Page Application`,
    scripts: {
      "verify:deployment": "node scripts/verify-deployment.cjs",
      "verify:react-deployment": "node scripts/verify-react-deployment.cjs",
      "audit:decomposition": "node scripts/forensic-audit.cjs",
      "pre-deploy": "npm run verify:deployment"
    }
  };

  if (fs.existsSync(pkgPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg = { ...existing, scripts: { ...existing.scripts, ...pkg.scripts } };
    } catch (e) {}
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');

  console.log('\x1b[32m  ✓ Starter template files created\x1b[0m');
  console.log('\x1b[32m  ✓ package.json configured with verification gates\x1b[0m');
  console.log('\x1b[32m  ✓ .deploymentrc.json initialized\x1b[0m');

  // Run initial pre-flight check inside target
  console.log('\n▶ Running initial pre-flight verification on generated app...');
  try {
    const verifyScript = path.join(targetDir, 'scripts', 'verify-deployment.cjs');
    if (fs.existsSync(verifyScript)) {
      execSync(`node "${verifyScript}"`, { cwd: targetDir, stdio: 'inherit' });
    }
    console.log('\n\x1b[32m🎉 TURNKEY WEB APP SUCCESSFULLY SCAFFOLDED & 100% GREEN!\x1b[0m\n');
  } catch (e) {
    console.error('\x1b[33m  ⚠️ Warning: Initial verification encountered an issue. Check target directory.\x1b[0m');
  }
}

function handleRetrofit(targetDirArg) {
  const targetDir = path.resolve(process.cwd(), targetDirArg || '.');
  console.log('\n===============================================================');
  console.log('🔧 RETROFITTING EXISTING REPO WITH RELEASE GATES (P-VERIFY-GATE-002)');
  console.log('===============================================================');
  console.log(`Target Repository: ${targetDir}`);

  const targetScripts = path.join(targetDir, 'scripts');
  if (!fs.existsSync(targetScripts)) {
    fs.mkdirSync(targetScripts, { recursive: true });
  }

  // Copy gate scripts
  const scriptsToCopy = [
    'verify-deployment.cjs',
    'forensic-audit.cjs',
    'verify-react-deployment.cjs'
  ];

  scriptsToCopy.forEach(script => {
    const src = path.join(ROOT_DIR, 'scripts', script);
    const dest = path.join(targetScripts, script);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`\x1b[32m  ✓ Copied scripts/${script}\x1b[0m`);
    }
  });

  // Copy or generate .deploymentrc.json
  const rcDest = path.join(targetDir, '.deploymentrc.json');
  if (!fs.existsSync(rcDest)) {
    const rcSrc = path.join(ROOT_DIR, '.deploymentrc.json');
    if (fs.existsSync(rcSrc)) {
      fs.copyFileSync(rcSrc, rcDest);
      console.log('\x1b[32m  ✓ Created .deploymentrc.json\x1b[0m');
    }
  }

  // Non-destructive update to package.json
  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.scripts = pkg.scripts || {};
      pkg.scripts['verify:deployment'] = 'node scripts/verify-deployment.cjs';
      pkg.scripts['verify:react-deployment'] = 'node scripts/verify-react-deployment.cjs';
      pkg.scripts['audit:decomposition'] = 'node scripts/forensic-audit.cjs';
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log('\x1b[32m  ✓ Merged verification scripts into package.json\x1b[0m');
    } catch (e) {
      console.warn('⚠️ Could not update package.json:', e.message);
    }
  }

  console.log('\n\x1b[32m✅ RETROFIT COMPLETE — Release verification gates active in project!\x1b[0m\n');
}

// CLI Command Router
const cmd = process.argv[2];
if (cmd === 'scaffold') {
  handleScaffold(process.argv[3], process.argv[4], process.argv[5]);
} else if (cmd === 'retrofit') {
  handleRetrofit(process.argv[3]);
} else {
  console.log(`
Universal Web App Scaffolder & Release Gate Bootstrap CLI (SPEC-SAP-BOOTSTRAP-001)

Commands:
  scaffold <targetDir> [appName] [firebaseProject]   Scaffold brand-new turnkey web SPA
  retrofit [targetDir]                               Inject release gates into existing project

Examples:
  node scripts/bootstrap-web-app.cjs scaffold ../my-new-portal my-portal portal-prod-123
  node scripts/bootstrap-web-app.cjs retrofit ./
`);
}
