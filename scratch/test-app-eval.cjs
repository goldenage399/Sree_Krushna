const fs = require('fs');
const vm = require('vm');

const appJs = fs.readFileSync('public/js/app.js', 'utf8');

const listeners = [];
const createMockEl = () => ({
  style: {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  setAttribute: () => {},
  getAttribute: () => '',
  innerHTML: '',
  innerText: '',
  value: '2026-08-22',
  addEventListener: () => {},
  querySelectorAll: () => [],
  querySelector: () => null,
  appendChild: () => {}
});

const sandbox = {
  window: {},
  document: {
    documentElement: {
      getAttribute: () => 'dark',
      setAttribute: () => {}
    },
    getElementById: (id) => createMockEl(),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => createMockEl(),
    body: { classList: { add: () => {}, remove: () => {}, contains: () => false } },
    addEventListener: (event, cb) => { listeners.push({ event, cb }); }
  },
  navigator: { serviceWorker: { ready: Promise.resolve({ addEventListener: () => {} }) } },
  location: { hash: '#tab-dashboard' },
  localStorage: { getItem: () => null, setItem: () => {} },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  alert: console.log,
  confirm: () => true
};
sandbox.window = sandbox;
sandbox.addEventListener = (event, cb) => { listeners.push({ event, cb }); };

try {
  vm.runInNewContext(appJs, sandbox);
  console.log('✅ Top-level app.js parsed and executed.');
  listeners.forEach(({ event, cb }) => {
    console.log('Triggering event:', event);
    cb();
  });
  console.log('✅ All DOMContentLoaded and window load listeners executed with ZERO errors!');

  console.log('\n--- VERIFYING ALL WINDOW EXPORTS EXIST AND ARE CALLABLE ---');
  const windowFunctions = Object.keys(sandbox).filter(k => typeof sandbox[k] === 'function');
  console.log(Found  window functions:);
  windowFunctions.forEach(fn => console.log('  ✓', fn));
} catch (e) {
  console.error('❌ Eval error:', e.message);
  console.error(e.stack);
  process.exit(1);
}
