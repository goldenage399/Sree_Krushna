/**
 * Build script for generating unified Decision Registry data layer
 * Ensures 100% byte-parity between js/ and public/js/
 * Standards: P-DECISION-REG-001 / P-VISUAL-CAROUSEL-001 / P-COMPARE-SHARE-001 / P-EVENT-STEPPER-001
 * Ruling: AC-DEC-2026-017 / UI-DEC-2026-013
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const registryRaw = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets/decor/registry.json'), 'utf8'));

const plateMetadata = {
  'PLATE-01': { events: ['wedding'], eventLabel: '🪔 Day 2 Vedic Vivaha', status: 'locked', statusBadge: 'LOCKED SPEC', linkedDecisions: ['DEC-14', 'DEC-20', 'DEC-08'], clusterId: 'mandap', clusterOption: 'A' },
  'PLATE-02': { events: ['wedding'], eventLabel: '🪔 Day 2 Vedic Vivaha', status: 'locked', statusBadge: 'LOCKED SPEC', linkedDecisions: ['DEC-14'] },
  'PLATE-03': { events: ['sangeet'], eventLabel: '🌙 Day 1 Sangeet', status: 'locked', statusBadge: 'LOCKED SPEC', linkedDecisions: ['DEC-11', 'PROP-02', 'PROP-05'], clusterId: 'stage', clusterOption: 'A' },
  'PLATE-04': { events: ['infrastructure'], eventLabel: '🏗️ Whole Venue Infrastructure', status: 'locked', statusBadge: 'LOCKED SPEC', linkedDecisions: ['DEC-03', 'DEC-06', 'DEC-07', 'DEC-10', 'DEC-19'] },
  'PLATE-05': { events: ['haldi', 'wedding', 'infrastructure'], eventLabel: '☀️ Day 1 Haldi & Vivaha Arrival', status: 'locked', statusBadge: 'LOCKED SPEC', linkedDecisions: ['DEC-02', 'DEC-04'] },
  'PLATE-06': { events: ['mehendi'], eventLabel: '🌿 Day 1 Mehendi', status: 'locked', statusBadge: 'LOCKED SPEC', linkedDecisions: ['DEC-13'] },
  'PLATE-07': { events: ['infrastructure'], eventLabel: '🏗️ Whole Venue Infrastructure', status: 'locked', statusBadge: 'LOCKED SPEC', linkedDecisions: ['DEC-05', 'DEC-15'] },
  'PLATE-08': { events: ['haldi', 'mehendi'], eventLabel: '☀️ Day 1 Haldi & Mehendi', status: 'pending', statusBadge: 'PENDING HOST VOTE', linkedDecisions: ['DEC-15', 'PROP-07'] },
  'PLATE-09': { events: ['sangeet', 'wedding'], eventLabel: '🌙 Day 1 Sangeet & Vivaha Aisle', status: 'evaluating', statusBadge: 'INCUBATING PROPOSAL', linkedDecisions: ['PROP-01', 'PROP-03'] },
  'PLATE-10': { events: ['wedding'], eventLabel: '🪔 Day 2 Vedic Vivaha (Alt)', status: 'shortlisted', statusBadge: 'SHORTLISTED OPTION', linkedDecisions: ['DEC-14', 'DEC-20'], clusterId: 'mandap', clusterOption: 'B' },
  'PLATE-11': { events: ['wedding'], eventLabel: '🪔 Day 2 Vedic Vivaha (Alt)', status: 'shortlisted', statusBadge: 'SHORTLISTED OPTION', linkedDecisions: ['DEC-14', 'PROP-04'], clusterId: 'mandap', clusterOption: 'C' },
  'PLATE-12': { events: ['sangeet'], eventLabel: '🌙 Day 1 Sangeet (Alt Stage)', status: 'shortlisted', statusBadge: 'SHORTLISTED OPTION', linkedDecisions: ['DEC-12'], clusterId: 'stage', clusterOption: 'B' }
};

const enrichedPlates = registryRaw.plates.map(p => {
  const meta = plateMetadata[p.id] || { events: ['all'], eventLabel: 'General', status: 'pending', statusBadge: 'PENDING', linkedDecisions: [] };
  return {
    id: p.id,
    index: p.index,
    title: p.title,
    category: p.category,
    categoryLabel: p.categoryLabel,
    events: meta.events,
    eventLabel: meta.eventLabel,
    zone: p.zone,
    spec: p.spec,
    clause: p.clause,
    photoSrc: p.photoSrc,
    blueprintSrc: p.blueprintSrc || null,
    mandatory: p.mandatory,
    dimensions: p.dimensions,
    status: meta.status,
    statusBadge: meta.statusBadge,
    linkedDecisions: meta.linkedDecisions,
    clusterId: meta.clusterId || null,
    clusterOption: meta.clusterOption || null,
    notes: p.notes,
    prompt: p.prompt || ''
  };
});

const clusters = [
  {
    id: "mandap",
    clusterId: "CLUSTER-MANDAP",
    title: "Vedic Vivaha Mandap Architecture",
    event: "wedding",
    eventLabel: "🪔 Day 2 Vedic Vivaha",
    zone: "Zone A — Sacred Sanctuary",
    decisionId: "DEC-14",
    description: "Selection of the central Vedic wedding altar and liturgical sanctum. Three distinct design philosophies.",
    whatsappTemplate: "🌺 *Sree Krushna Marriage OS — Mandap Design Review*\nHelp us choose our Vedic Wedding Mandap! Please review the 3 shortlisted options:\n• *Option A:* Vedic Lotus Mandap & Elevated Altar (PLATE-01)\n• *Option B:* Royal Carved Telugu Vedic Mandap (PLATE-10)\n• *Option C:* Suspended Floral Lotus Canopy Dome (PLATE-11)\n👉 Compare & vote on your phone: {url}",
    options: [
      { plateId: "PLATE-01", optionId: "A", label: "Option A: Vedic Lotus Mandap", highlight: "Sacred lotus floral canopy with brass samai lamps & 24ft timber stage" },
      { plateId: "PLATE-10", optionId: "B", label: "Option B: Royal Carved Telugu Mandap", highlight: "Traditional carved temple pillars with peach silk & gold jali backdrop" },
      { plateId: "PLATE-11", optionId: "C", label: "Option C: Suspended Lotus Dome", highlight: "Ceiling-hung inverted fresh carnation lotus with circular mandala wall" }
    ]
  },
  {
    id: "stage",
    clusterId: "CLUSTER-STAGE",
    title: "Sangeet Concert & Performance Stage",
    event: "sangeet",
    eventLabel: "🌙 Day 1 Sangeet",
    zone: "Zone A — Performance Stage",
    decisionId: "DEC-12",
    description: "Production stage design for Sangeet dance performances and evening celebration.",
    whatsappTemplate: "✨ *Sree Krushna Marriage OS — Sangeet Stage Review*\nHelp us select our Sangeet stage design! Review the 2 shortlisted options:\n• *Option A:* Concert Production Stage & P3 LED Wall (PLATE-03)\n• *Option B:* Midnight Blooms Reflective Mirror Stage (PLATE-12)\n👉 Compare & vote on your phone: {url}",
    options: [
      { plateId: "PLATE-03", optionId: "A", label: "Option A: Concert Stage & LED Wall", highlight: "36ft elevated performance deck with 24x12ft LED wall & box truss cinema spots" },
      { plateId: "PLATE-12", optionId: "B", label: "Option B: Midnight Blooms Mirror Stage", highlight: "40ft high-gloss black reflective runway, crystal chandeliers & wisteria arch" }
    ]
  },
  {
    id: "entry",
    clusterId: "CLUSTER-ENTRY",
    title: "Grand Couple Entry Atmospheric Production",
    event: "sangeet",
    eventLabel: "🌙 Day 1 Sangeet & Vivaha Aisle",
    zone: "Zone B — Arrival & Processional Aisle",
    decisionId: "DEC-21",
    description: "Special atmospheric and visual effects for couple grand entrances at Sangeet and Daytime Varmala.",
    whatsappTemplate: "✨ *Sree Krushna Marriage OS — Grand Entry Effects Review*\nHelp us choose our wedding entry special effects! Please review the options:\n• *Option A:* Low-Lying Dry-Ice Cloud Fog + Shimmering Bubbles\n• *Option B:* Pyrotechnic Cold Spark Fountains (Gerb Units)\n• *Option C:* Mechanical Fresh Rose Petal Cannons & Floral Shower\n👉 Compare & vote on your phone: {url}",
    options: [
      { plateId: "PLATE-05", optionId: "A", label: "Option A: Dry-Ice Cloud Fog & Bubbles", highlight: "Safe indoor/marquee cloud fog with zero smoke alarm triggers or chemical residue (PROP-05)" },
      { plateId: "PLATE-09", optionId: "B", label: "Option B: Cold Spark Pyrotechnics", highlight: "Theatrical concert-style spark fountains along the aisle for high-energy walk-in (PROP-03)" },
      { plateId: "PLATE-01", optionId: "C", label: "Option C: Fresh Rose Petal Cannons", highlight: "Traditional sacred floral rain shower cascading over the couple at stage reveal (PROP-04)" }
    ]
  }
];

const eventTaxonomy = [
  { id: 'all', label: 'All Events', icon: '🌟', count: 12 },
  { id: 'haldi', label: 'Day 1 Haldi & Arrival', icon: '☀️', count: enrichedPlates.filter(p => p.events.includes('haldi')).length, phase: 1, timing: "Day 1 Morning (09:00 - 13:00)" },
  { id: 'mehendi', label: 'Day 1 Mehendi', icon: '🌿', count: enrichedPlates.filter(p => p.events.includes('mehendi')).length, phase: 2, timing: "Day 1 Afternoon (14:30 - 17:00)" },
  { id: 'sangeet', label: 'Day 1 Sangeet & Party', icon: '🌙', count: enrichedPlates.filter(p => p.events.includes('sangeet')).length, phase: 3, timing: "Day 1 Night (19:00 - 23:30)" },
  { id: 'wedding', label: 'Day 2 Vedic Vivaha', icon: '🪔', count: enrichedPlates.filter(p => p.events.includes('wedding')).length, phase: 4, timing: "Day 2 Daytime Vivaha (09:30 - 16:30, Hastaganthi 12:00 Noon)" },
  { id: 'infrastructure', label: 'Venue Infrastructure', icon: '🏗️', count: enrichedPlates.filter(p => p.events.includes('infrastructure')).length, phase: 5, timing: "Whole-Venue Backbone & Shell" }
];

// Read current items from existing js/decision-registry-data.js
const currentCode = fs.readFileSync(path.join(rootDir, 'js/decision-registry-data.js'), 'utf8');
const itemsMatch = currentCode.match(/items:\s*(\[[\s\S]*?\n\s*\])\s*\n\s*\};/);
if (!itemsMatch) {
  console.error('Could not extract items array from existing file');
  process.exit(1);
}

let items;
try {
  items = eval('(' + itemsMatch[1] + ')');
} catch (e) {
  console.error('Error parsing items:', e);
  process.exit(1);
}

// Map events and cluster IDs to items
const itemEventMap = {
  'DEC-08': { event: 'infrastructure', plateRef: 'PLATE-01', plateTitle: 'Vedic Lotus Mandap & Elevated Altar' },
  'DEC-09': { event: 'infrastructure', plateRef: 'PLATE-04', plateTitle: 'Modular Aluminum Marquee & Dual-Zone HVAC' },
  'DEC-12': { event: 'sangeet', clusterId: 'stage', plateRef: 'PLATE-12', alternativePlates: ['PLATE-03'], plateTitle: 'Midnight Blooms Reflective Mirror Stage' },
  'DEC-13': { event: 'mehendi', plateRef: 'PLATE-06', plateTitle: 'Mehendi Zone D Garden Promenade & Lounge' },
  'DEC-14': { event: 'wedding', clusterId: 'mandap', plateRef: 'PLATE-01', alternativePlates: ['PLATE-10', 'PLATE-11'], plateTitle: 'Vedic Lotus Mandap (3 Options Available)' },
  'DEC-15': { event: 'haldi', plateRef: 'PLATE-08', alternativePlates: ['PLATE-07'], plateTitle: 'Interactive Activity Stalls & Dining Pass' },
  'DEC-16': { event: 'wedding', plateRef: 'PLATE-01', alternativePlates: ['PLATE-03'], plateTitle: 'Mandap to Sangeet Stage Overnight Turnover' },
  'DEC-02': { event: 'haldi', plateRef: 'PLATE-05', plateTitle: '50m Grand Arrival Corridor' },
  'DEC-05': { event: 'infrastructure', plateRef: 'PLATE-07', plateTitle: 'BOH Satellite Finishing Kitchen' },
  'DEC-19': { event: 'infrastructure', plateRef: 'PLATE-04', plateTitle: 'Marquee Technical & Fire Safety' },
  'DEC-20': { event: 'wedding', clusterId: 'mandap', plateRef: 'PLATE-01', alternativePlates: ['PLATE-10', 'PLATE-11'], plateTitle: 'Mandap Mock-Up Verification Bay' },
  'DEC-21': { event: 'sangeet', clusterId: 'entry', plateRef: 'PLATE-05', alternativePlates: ['PLATE-09', 'PLATE-01'], plateTitle: 'Grand Couple Entry Atmospheric Production' },
  'DEC-22': { event: 'wedding', plateRef: 'PLATE-09', alternativePlates: ['PLATE-05'], plateTitle: 'Starlit Aisle Canopy & Illuminated Floral Walkway' },
  'DEC-23': { event: 'sangeet', clusterId: 'stage', plateRef: 'PLATE-03', alternativePlates: ['PLATE-12'], plateTitle: 'Sangeet Concert & Performance Stage' },
  'PROP-01': { event: 'wedding', plateRef: 'PLATE-09', plateTitle: 'Starlit Aisle Canopy & Illuminated Floral Walkway' },
  'PROP-02': { event: 'sangeet', clusterId: 'stage', plateRef: 'PLATE-03', videoRef: 'ref-sangeet-stage-balloon-drop.mp4', plateTitle: 'Sangeet Production Stage (Balloon Drop Ref)' },
  'PROP-03': { event: 'wedding', plateRef: 'PLATE-09', plateTitle: 'Starlit Aisle Canopy (Guard of Honour)' },
  'PROP-04': { event: 'wedding', clusterId: 'mandap', plateRef: 'PLATE-11', plateTitle: 'Suspended Floral Lotus Canopy Dome (Petal Shower)' },
  'PROP-05': { event: 'sangeet', clusterId: 'stage', plateRef: 'PLATE-03', plateTitle: 'Sangeet Production Stage (Low-Lying Fog)' },
  'PROP-06': { event: 'sangeet', plateRef: 'PLATE-03', plateTitle: 'Sangeet Stage Cinema Audio' },
  'PROP-07': { event: 'mehendi', plateRef: 'PLATE-08', plateTitle: 'Interactive Activity Kiosks (Polaroid Station)' },
  'DEC-002': { event: 'infrastructure' },
  'DEC-01': { event: 'infrastructure' },
  'DEC-03': { event: 'infrastructure', plateRef: 'PLATE-04', plateTitle: 'Marquee Sun Path Alignment' },
  'DEC-04': { event: 'infrastructure', plateRef: 'PLATE-05', plateTitle: 'Master Venue Spatial Zoning' },
  'DEC-06': { event: 'infrastructure', plateRef: 'PLATE-04', plateTitle: 'Modular Aluminum Marquee Shell' },
  'DEC-07': { event: 'infrastructure', plateRef: 'PLATE-04', plateTitle: 'Dual-Zone HVAC & DG Power' },
  'DEC-10': { event: 'infrastructure', plateRef: 'PLATE-04', plateTitle: 'Elevated Timber Subflooring' },
  'DEC-11': { event: 'sangeet', plateRef: 'PLATE-03', plateTitle: 'Sangeet Stage Cinema Lighting' },
  'DEC-17': { event: 'infrastructure' },
  'DEC-18': { event: 'infrastructure' }
};

items = items.map(item => {
  const meta = itemEventMap[item.id] || { event: 'infrastructure' };
  return { ...item, ...meta };
});

const outputJs = `/**
 * Sree Krushna Marriage OS — Unified Pending Decision Registry & Idea Incubator Data
 * Standard: P-DECISION-REG-001 / P-VISUAL-CAROUSEL-001 / P-COMPARE-SHARE-001 / P-EVENT-STEPPER-001
 * Ruling: AC-DEC-2026-017 / UI-DEC-2026-013
 * 
 * Aggregates all pending decisions, vendor deliverables, canonical visual plates,
 * and clustered decision pods into a single canonical data structure.
 */

window.DECISION_REGISTRY_DATA = {
  meta: {
    title: "Sree Krushna Marriage OS — Unified Decision & Ideation Registry",
    version: "2.1.0",
    updated_at: "2026-09-15T08:35:00+05:30",
    governance_ref: "AC-DEC-2026-017",
    standard: "P-DECISION-REG-001 / P-VISUAL-CAROUSEL-001 / P-COMPARE-SHARE-001"
  },
  summary: {
    totalItems: ${items.length},
    pendingChoices: ${items.filter(i => i.category === 'decor_pending').length},
    vendorDeliverables: ${items.filter(i => i.category === 'decor_vendor').length},
    incubatingIdeas: ${items.filter(i => i.category === 'idea_incubator').length},
    governancePolicies: ${items.filter(i => i.category === 'governance').length},
    certifiedLocked: ${items.filter(i => i.category === 'decor_locked').length},
    totalPlates: ${enrichedPlates.length},
    totalClusters: ${clusters.length}
  },
  events: ${JSON.stringify(eventTaxonomy, null, 2)},
  clusters: ${JSON.stringify(clusters, null, 2)},
  plates: ${JSON.stringify(enrichedPlates, null, 2)},
  items: ${JSON.stringify(items, null, 2)}
};
`;

const target1 = path.join(rootDir, 'js/decision-registry-data.js');
const target2 = path.join(rootDir, 'public/js/decision-registry-data.js');

fs.writeFileSync(target1, outputJs, 'utf8');
fs.writeFileSync(target2, outputJs, 'utf8');

console.log('✅ Successfully wrote updated data to:');
console.log(' - ' + target1 + ' (' + fs.statSync(target1).size + ' bytes)');
console.log(' - ' + target2 + ' (' + fs.statSync(target2).size + ' bytes)');
