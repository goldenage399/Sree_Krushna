const fs = require('fs');
const assert = require('assert');

const rootHtml = fs.readFileSync('decision-registry.html', 'utf8');
const pubHtml = fs.readFileSync('public/decision-registry.html', 'utf8');

assert.strictEqual(rootHtml, pubHtml, 'Byte parity between root and public decision-registry.html failed');

const rootData = fs.readFileSync('js/decision-registry-data.js', 'utf8');
const pubData = fs.readFileSync('public/js/decision-registry-data.js', 'utf8');

assert.strictEqual(rootData, pubData, 'Byte parity between root and public decision-registry-data.js failed');

// Check key elements in HTML
assert(rootHtml.includes('id="eventStepperSection"'), 'eventStepperSection exists');
assert(rootHtml.includes('id="milestoneTrack"'), 'milestoneTrack exists');
assert(rootHtml.includes('id="clusterPodsContainer"'), 'clusterPodsContainer exists');
assert(rootHtml.includes('id="visualShowcaseSection"'), 'visualShowcaseSection exists');
assert(rootHtml.includes('id="carouselTrack"'), 'carouselTrack exists');
assert(rootHtml.includes('id="filterPillsContainer"'), 'filterPillsContainer exists');
assert(rootHtml.includes('id="familyWelcomeBanner"'), 'familyWelcomeBanner exists');
assert(rootHtml.includes('id="drLightboxModal"'), 'drLightboxModal exists');
assert(rootHtml.includes('id="modalCompareStage"'), 'modalCompareStage exists');
assert(rootHtml.includes('window.openLightbox'), 'openLightbox exists');
assert(rootHtml.includes('window.jumpToDecision'), 'jumpToDecision exists');
assert(rootHtml.includes('window.selectClusterOption'), 'selectClusterOption exists');
assert(rootHtml.includes('window.shareClusterWhatsApp'), 'shareClusterWhatsApp exists');
assert(rootHtml.includes('window.selectEventMilestone'), 'selectEventMilestone exists');
assert(rootHtml.includes('parseUrlParams'), 'parseUrlParams exists');
assert(rootHtml.includes('getAlternativesForPlate'), 'getAlternativesForPlate exists');

// Check data layer contracts
assert(rootData.includes('PLATE-01'), 'PLATE-01 exists');
assert(rootData.includes('PLATE-12'), 'PLATE-12 exists');
assert(rootData.includes('events:'), 'events array exists');
assert(rootData.includes('plates:'), 'plates array exists');
assert(rootData.includes('clusters:'), 'clusters array exists');
assert(rootData.includes('CLUSTER-MANDAP'), 'CLUSTER-MANDAP exists');
assert(rootData.includes('CLUSTER-STAGE'), 'CLUSTER-STAGE exists');
assert(rootData.includes('CLUSTER-ENTRY'), 'CLUSTER-ENTRY exists');
assert(rootData.includes('DEC-21'), 'DEC-21 exists');
assert(rootData.includes('whatsappTemplate'), 'whatsappTemplate exists');
// Check app.js script loading contract
const appJs = fs.readFileSync('public/js/app.js', 'utf8');
assert(appJs.includes('mountDecisionRegistryTab'), 'mountDecisionRegistryTab exists in app.js');
assert(appJs.includes('newScript.onload'), 'mountDecisionRegistryTab awaits newScript.onload for external scripts');

// VM Execution Sandbox Test (Simulating dynamic injection & asynchronous data arrival)
const vm = require('vm');
const mockElements = {};
const mockEl = (id) => {
  if (!mockElements[id]) {
    const classes = new Set();
    mockElements[id] = {
      id,
      style: {},
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c)
      },
      innerHTML: '',
      textContent: '',
      addEventListener: () => {},
      scrollBy: () => {},
      scrollIntoView: () => {},
      querySelectorAll: () => [],
      querySelector: () => null
    };
  }
  return mockElements[id];
};

const sandbox = {
  console: { log: () => {}, warn: () => {}, error: console.error },
  document: {
    getElementById: (id) => mockEl(id),
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {}
  },
  window: {
    location: { search: '', origin: 'http://localhost:5000', pathname: '/' },
    localStorage: { getItem: () => null, setItem: () => {} }
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  URLSearchParams: URLSearchParams
};
sandbox.window.document = sandbox.document;
sandbox.window.URLSearchParams = URLSearchParams;
sandbox.global = sandbox.window;

// Extract script from fragment
const fragmentHtml = fs.readFileSync('decision-registry-fragment.html', 'utf8');
const scriptMatches = [...fragmentHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert(scriptMatches.length > 0, 'Controller script found in fragment');
const controllerCode = scriptMatches[0][1];

// 1. Execute WITHOUT data (simulating initial async script load) - MUST NOT THROW
assert.doesNotThrow(() => {
  vm.runInNewContext(controllerCode, sandbox);
}, 'Controller must execute without throwing when DECISION_REGISTRY_DATA is not yet populated');

// 2. Now load data and call window.renderDecisionRegistry() - MUST REFRESH & RENDER
vm.runInNewContext(pubData, sandbox);
assert(sandbox.window.DECISION_REGISTRY_DATA, 'DECISION_REGISTRY_DATA populated in sandbox');

assert.doesNotThrow(() => {
  sandbox.window.renderDecisionRegistry();
}, 'renderDecisionRegistry() must execute cleanly after data is populated');

assert(mockElements['milestoneTrack'].innerHTML.includes('dr-milestone-node'), 'milestoneTrack populated');
assert(mockElements['clusterPodsContainer'].innerHTML.includes('dr-cluster-card'), 'clusterPodsContainer populated');
assert(mockElements['carouselTrack'].innerHTML.includes('dr-plate-card'), 'carouselTrack populated');
assert(mockElements['decisionsGrid'].innerHTML.includes('dr-card'), 'decisionsGrid populated');

// 3. Test Comments Drawer Open & Close Mechanics
const backdrop = mockElements['skCommentsDrawerBackdrop'];
const drawer = mockElements['skCommentsDrawer'];
const closeBtn = mockElements['skBtnCloseComments'];

assert(backdrop, 'Backdrop element exists');
assert(drawer, 'Drawer element exists');
assert(closeBtn, 'Close button exists');

// Open drawer
sandbox.window.openCommentsDrawer('PLATE-01', { title: 'Test Mandap' });
assert(backdrop.classList.contains('is-active'), 'Backdrop has is-active on open');
assert(drawer.classList.contains('is-active'), 'Drawer has is-active on open');

// Close via close button
assert(closeBtn.onclick, 'Close button has onclick handler');
closeBtn.onclick({ preventDefault: () => {}, stopPropagation: () => {} });
assert(!backdrop.classList.contains('is-active'), 'Backdrop is-active removed on close button click');
assert(!drawer.classList.contains('is-active'), 'Drawer is-active removed on close button click');

// Close via global closeCommentsDrawer()
sandbox.window.openCommentsDrawer('PLATE-02', { title: 'Test Plate 2' });
assert(backdrop.classList.contains('is-active'), 'Re-opened for closeCommentsDrawer test');
assert(typeof sandbox.window.closeCommentsDrawer === 'function', 'window.closeCommentsDrawer is function');
sandbox.window.closeCommentsDrawer();
assert(!backdrop.classList.contains('is-active'), 'Backdrop is-active removed on window.closeCommentsDrawer()');
assert(!drawer.classList.contains('is-active'), 'Drawer is-active removed on window.closeCommentsDrawer()');

// Close via SKPrimitives.closeComments()
sandbox.window.openCommentsDrawer('PLATE-03', { title: 'Test Plate 3' });
assert(sandbox.window.SKPrimitives && typeof sandbox.window.SKPrimitives.closeComments === 'function', 'SKPrimitives.closeComments is function');
sandbox.window.SKPrimitives.closeComments();
assert(!backdrop.classList.contains('is-active'), 'Backdrop is-active removed on SKPrimitives.closeComments()');
assert(!drawer.classList.contains('is-active'), 'Drawer is-active removed on SKPrimitives.closeComments()');

console.log('🎉 Decision Registry, Event Stepper & WhatsApp Consensus Validation: 100% GREEN & SYNCHRONIZED!');

