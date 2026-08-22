const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const TEST_PORT = 5055;
process.env.PORT = TEST_PORT;

console.log('🧪 ========================================================');
console.log('👑 Sree Krushna Marriage OS — Local Smoke & Pre-Deploy Test');
console.log('==========================================================\n');

// 1. Syntax check JavaScript modules
console.log('🔍 [1/4] Validating JavaScript Syntax & VM Integrity...');
const jsFiles = [
  { file: 'public/js/app.js', isModule: false },
  { file: 'public/js/theme-init.js', isModule: false },
  { file: 'public/js/config.js', isModule: false },
  { file: 'public/js/allowed_users.js', isModule: true },
  { file: 'public/js/auth.js', isModule: true },
  { file: 'public/js/marriage-state.js', isModule: false },
  { file: 'public/sw.js', isModule: false }
];

let jsErrors = 0;
jsFiles.forEach(({ file, isModule }) => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`  ❌ Missing JS file: ${file}`);
    jsErrors++;
    return;
  }
  let code = fs.readFileSync(fullPath, 'utf8');
  if (isModule) {
    // Transform import/export keywords for VM syntax parsing check
    code = code
      .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm, '/* import */')
      .replace(/^export\s+(const|let|var|function|class|default)\s+/gm, '$1 ');
  }
  try {
    new vm.Script(code, { filename: file });
    console.log(`  ✅ ${file}: Valid JavaScript syntax`);
  } catch (err) {
    console.error(`  ❌ ${file} syntax error:`, err.message);
    jsErrors++;
  }
});

if (jsErrors > 0) {
  console.error(`\n❌ JavaScript validation failed with ${jsErrors} error(s).`);
  process.exit(1);
}

// 2. Start local server
console.log('\n🚀 [2/4] Starting In-Memory Dev Server on port ' + TEST_PORT + '...');
const server = require('./dev-server.cjs');

function fetchPath(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  let failed = 0;
  console.log('\n🌐 [3/4] Probing Endpoints & Asset Delivery...');

  const endpoints = [
    { path: '/', expectedStatus: 200, contentType: 'text/html' },
    { path: '/index.html', expectedStatus: 200, contentType: 'text/html' },
    { path: '/css/main.css', expectedStatus: 200, contentType: 'text/css' },
    { path: '/js/app.js', expectedStatus: 200, contentType: 'application/javascript' },
    { path: '/js/theme-init.js', expectedStatus: 200, contentType: 'application/javascript' },
    { path: '/js/config.js', expectedStatus: 200, contentType: 'application/javascript' },
    { path: '/js/allowed_users.js', expectedStatus: 200, contentType: 'application/javascript' },
    { path: '/js/marriage-state.js', expectedStatus: 200, contentType: 'application/javascript' },
    { path: '/js/auth.js', expectedStatus: 200, contentType: 'application/javascript' },
    { path: '/sw.js', expectedStatus: 200, contentType: 'application/javascript' },
    { path: '/manifest.json', expectedStatus: 200, contentType: 'application/json' },
    { path: '/non-existent-file.xyz', expectedStatus: 404, contentType: 'text/plain' }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchPath(ep.path);
      if (res.statusCode !== ep.expectedStatus) {
        console.error(`  ❌ ${ep.path}: Expected ${ep.expectedStatus}, got ${res.statusCode}`);
        failed++;
      } else {
        console.log(`  ✅ ${ep.path}: HTTP ${res.statusCode} (${res.headers['content-type'] || 'no content-type'})`);
      }

      // Check security headers
      if (res.statusCode === 200) {
        if (!res.headers['x-frame-options']) {
          console.warn(`  ⚠️ ${ep.path}: Missing X-Frame-Options header`);
        }
        if (!res.headers['x-content-type-options']) {
          console.warn(`  ⚠️ ${ep.path}: Missing X-Content-Type-Options header`);
        }
      }
    } catch (err) {
      console.error(`  ❌ Failed to fetch ${ep.path}:`, err.message);
      failed++;
    }
  }

  // 3. Validate DOM components
  console.log('\n🎨 [4/4] Auditing Rendered DOM Structure & Critical Elements...');
  try {
    const rootRes = await fetchPath('/');
    const html = rootRes.body;

    const requiredElements = [
      { name: 'Viewport Meta Tag', test: /<meta\s+name=["']viewport["']/i },
      { name: 'External CSS Link (/css/main.css)', test: /href=["']\/?css\/main\.css["']/i },
      { name: 'Theme Init Script (/js/theme-init.js)', test: /src=["']\/?js\/theme-init\.js["']/i },
      { name: 'Main App Script (/js/app.js)', test: /src=["']\/?js\/app\.js["']/i },
      { name: 'Marriage State Script (js/marriage-state.js)', test: /src=["']\/?js\/marriage-state\.js["']/i },
      { name: 'Auth Gate Script (js/auth.js)', test: /src=["']\/?js\/auth\.js["']/i },
      { name: 'Hero Countdown Component', test: /id=["']countdown["']|class=["'][^"']*countdown[^"']*["']/i },
      { name: 'Navigation Tabs Shell (class="tab-nav")', test: /<nav\s+class=["']tab-nav["']|class=["'][^"']*nav-btn[^"']*["']/i },
      { name: 'Inspection Console Drawer', test: /id=["']console-drawer["']/i },
      { name: 'DO-PKOS Canvas Container', test: /id=["']dopkos-canvas-container["']/i },
      { name: 'DO-PKOS Engine Script (/js/modules/dopkos-engine.js)', test: /src=["']\/?js\/modules\/dopkos-engine\.js["']/i }
    ];

    requiredElements.forEach(item => {
      if (item.test.test(html)) {
        console.log(`  ✅ DOM Check: ${item.name} present`);
      } else {
        console.error(`  ❌ DOM Check: Missing ${item.name}`);
        failed++;
      }
    });
  } catch (err) {
    console.error('  ❌ DOM structure audit failed:', err.message);
    failed++;
  }

  // Cleanup
  server.close(() => {
    console.log('\n==========================================================');
    if (failed === 0) {
      console.log('✨ LOCAL SMOKE TEST PASSED (100% HEALTHY) — Ready for Deployment!');
      console.log('==========================================================\n');
      process.exit(0);
    } else {
      console.error(`❌ LOCAL SMOKE TEST FAILED with ${failed} issue(s).`);
      console.log('==========================================================\n');
      process.exit(1);
    }
  });
}

runTests();
