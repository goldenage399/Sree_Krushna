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

console.log('🎉 Decision Registry, Event Stepper & WhatsApp Consensus Validation: 100% GREEN & SYNCHRONIZED!');

