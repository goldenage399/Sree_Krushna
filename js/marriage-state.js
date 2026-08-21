/**
 * 👑 Sree Krushna Marriage OS — Canonical State & Data Feed
 * Single Source of Truth for:
 * • 6 Temporal Stages / Phases
 * • 6 Parallel Operational Swimlanes (Tracks)
 * • 4 Critical Operational Gates (GATE-01 to GATE-04)
 * • 55+ Master Tasks & Work Packages (TSK-101 through TSK-1105)
 * • Sacred Samagri (SAM-###), Precious Assets (AST-###), People & Contacts (PER-###)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MARRIAGE_STATE = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    meta: {
      version: '3.0.0',
      title: 'Sree Krushna Marriage OS',
      couple: 'Sree & Krushna',
      muhurat: '2026-11-25 21:30 IST',
      venue: 'Swarna Mandap, Bhubaneswar, Odisha',
      updatedAt: '2026-08-22T01:50:00+05:30'
    },

    // ── 6 TEMPORAL PHASES / STAGES ──────────────────────────────────
    stages: [
      {
        id: 'STAGE_01',
        num: '01',
        name: 'Pre-Wedding & Procurement',
        timeframe: 'T - 120 to T - 15 Days',
        desc: 'Astrological Muhurat lock, venue SLAs, attire weaving, gold vault audit, wedding website & invitations.',
        icon: '📜'
      },
      {
        id: 'STAGE_02',
        num: '02',
        name: 'Mangan & Sacred Rites',
        timeframe: 'T - 2 to T - 1 Days',
        desc: 'Deva Nimantrana, Mangan dawn turmeric bath, Mehendi trials, Mandap decoration & guest airport pickups.',
        icon: '🌿'
      },
      {
        id: 'STAGE_03',
        num: '03',
        name: 'Barat & Grand Reception',
        timeframe: 'Day 0 • 16:00 to 19:30',
        desc: 'Barat assembly, Groom Safa/Mukuta dressing, bridal photography, brass band arrival & GATE-02 Baranugam.',
        icon: '🎺'
      },
      {
        id: 'STAGE_04',
        num: '04',
        name: 'Vedic Mandap Sanctum',
        timeframe: 'Day 0 • 19:30 to 22:30',
        desc: 'Astrological Lagna muhurat rites: Kanyadaan, Hastaganthi, Lajahoma, Saptapadi & Sindoor Daan.',
        icon: '🕉️'
      },
      {
        id: 'STAGE_05',
        num: '05',
        name: 'Royal Feast & Hospitality',
        timeframe: 'Day 0 • 19:30 to 23:30',
        desc: 'Traditional Odia feast dining pavilion, VIP Sattvic service, photo lounge candids & guest departures.',
        icon: '🍲'
      },
      {
        id: 'STAGE_06',
        num: '06',
        name: 'Chauthi & Astamangala',
        timeframe: 'Day +1 to Day +8',
        desc: 'HMA marriage registration, Grihapravesh, Chauthi night puja, asset bank vault return & Astamangala.',
        icon: '👑'
      }
    ],

    // ── 6 PARALLEL OPERATIONAL TRACKS (SWIMLANES) ───────────────────
    tracks: [
      {
        id: 'bride',
        code: 'TRACK_A',
        title: 'Bride Team & Styling',
        icon: '👰',
        lead: 'PER-006 (Bride Mother) & Sree',
        color: '#ff758f',
        bgGradient: 'linear-gradient(90deg, #3d1421, var(--bg-surface-elevated))'
      },
      {
        id: 'groom',
        code: 'TRACK_B',
        title: 'Groom Team & Barat',
        icon: '🤵',
        lead: 'PER-008 (Groom Lead) & Krushna',
        color: '#70d6ff',
        bgGradient: 'linear-gradient(90deg, #132a4a, var(--bg-surface-elevated))'
      },
      {
        id: 'purohit',
        code: 'TRACK_C',
        title: 'Vedic Purohits & Sanctum',
        icon: '🕉️',
        lead: 'PER-080 (Chief Vedic Purohit) & PER-005',
        color: '#ffd15c',
        bgGradient: 'linear-gradient(90deg, #382405, var(--bg-surface-elevated))'
      },
      {
        id: 'catering',
        code: 'TRACK_D',
        title: 'Catering & Hospitality',
        icon: '🍲',
        lead: 'PER-014 (Food Lead & Controller)',
        color: '#2ec4b6',
        bgGradient: 'linear-gradient(90deg, #0e331b, var(--bg-surface-elevated))'
      },
      {
        id: 'media',
        code: 'TRACK_E',
        title: 'Photo, Cinema & Drone',
        icon: '📸',
        lead: 'VDR-003 (Senior Studio Lead)',
        color: '#c77dff',
        bgGradient: 'linear-gradient(90deg, #2b1442, var(--bg-surface-elevated))'
      },
      {
        id: 'fleet',
        code: 'TRACK_F',
        title: 'Fleet & Asset Custody',
        icon: '🚗',
        lead: 'PER-007 (Cash/Gold Custodian) & PER-012',
        color: '#ffb703',
        bgGradient: 'linear-gradient(90deg, #332110, var(--bg-surface-elevated))'
      }
    ],

    // ── 4 CRITICAL OPERATIONAL GATES ────────────────────────────────
    gates: [
      {
        id: 'GATE-01',
        name: 'Pre-Event Readiness Greenlight',
        targetTime: 'Day 0 • T - 4 Hours (15:00)',
        owner: 'PER-014 (Command Controller)',
        description: 'Mandatory sign-off across green rooms, power backups, samagri inspection, and dining pavilion setup.',
        status: 'READY'
      },
      {
        id: 'GATE-02',
        name: 'Barat & Entrance Handshake',
        targetTime: 'Day 0 • 19:30',
        owner: 'PER-006 (Bride Mother) & PER-008',
        description: 'Synchronized handshake: Barat procession arrival, cold pyros clearance, and Baranugam welcoming aarti.',
        status: 'PENDING'
      },
      {
        id: 'GATE-03',
        name: 'Vedic Sanctum Muhurat Lock',
        targetTime: 'Day 0 • 21:30 Lagna Muhurat',
        owner: 'PER-080 (Chief Vedic Purohit)',
        description: 'Sacred Kanyadaan, Hastaganthi water pouring, Lajahoma, Saptapadi 7 vows & Sindoor Daan.',
        status: 'PENDING'
      },
      {
        id: 'GATE-04',
        name: 'Kanyavida & Shagun Custody Seal',
        targetTime: 'Day 0 • 23:45',
        owner: 'PER-007 (Asset Custodian) & Parents',
        description: 'Signed handover of gift ledger, cash envelopes, gold return verification, and bridal vehicle departure.',
        status: 'PENDING'
      }
    ],

    // ── KEY PEOPLE DIRECTORY (PER-###) ──────────────────────────────
    people: {
      'PER-001': { name: 'Sree (Bride)', role: 'Tier 1 Core Bride', phone: '+91 98765 00001' },
      'PER-002': { name: 'Krushna (Groom)', role: 'Tier 1 Core Groom', phone: '+91 98765 00002' },
      'PER-005': { name: 'Shri B. Panda', role: 'Bride Father (Kanyadata)', phone: '+91 94370 11111' },
      'PER-006': { name: 'Smt. S. Panda', role: 'Bride Mother (Green Room Lead)', phone: '+91 94370 22222' },
      'PER-007': { name: 'Shri D. Tripathy', role: 'Gold & Cash Custodian', phone: '+91 94370 33333' },
      'PER-008': { name: 'Shri R. Mishra', role: 'Groom Lead & Styling', phone: '+91 94370 44444' },
      'PER-012': { name: 'Capt. A. Dash', role: 'Fleet & Transit Dispatcher', phone: '+91 94370 55555' },
      'PER-014': { name: 'Er. S. Mohapatra', role: 'Day-of Command Controller', phone: '+91 94370 66666' },
      'PER-080': { name: 'Pandit S. Rath Sharma', role: 'Chief Vedic Purohit (Puri)', phone: '+91 94370 77777' },
      'VDR-003': { name: 'Royal Cinematography Studio', role: 'Lead Media Vendor', phone: '+91 94370 88888' },
      'VDR-005': { name: 'Master Bridal Artistry', role: 'Bridal MUA Lead', phone: '+91 94370 99999' },
      'VDR-006': { name: 'Odia Dhol & Brass Ensemble', role: 'Barajatri Band Lead', phone: '+91 94370 00000' }
    },

    // ── 55+ CANONICAL MASTER TASKS (TSK-101 THROUGH TSK-1105) ──────
    tasks: [
      // ════ STAGE 01: Pre-Wedding & Procurement (T-120 to T-15) ════
      {
        id: 'TSK-101',
        wbs: '2.1.1',
        stage: 'STAGE_01',
        track: 'purohit',
        title: 'Deva Nimantrana Sacred Invitation Offering',
        lead: 'PER-005 (Bride Father)',
        priority: 'Critical',
        status: 'Completed',
        timeTag: 'T - 60 Days',
        desc: 'Formal wedding invitation presented first to Lord Jagannath at Puri Srimandir, followed by Grama Devati.',
        checklist: [
          { text: 'Custom betel nuts, coconuts and raw rice samagri kit prepared', done: true },
          { text: 'Lord Jagannath Temple Sevayat coordination locked', done: true },
          { text: 'Formal Nirmalya & Mahaprasad receipt obtained', done: true }
        ],
        linkedEntities: ['RIT-002', 'SAM-002'],
        gate: null
      },
      {
        id: 'TSK-201',
        wbs: '3.1.1',
        stage: 'STAGE_01',
        track: 'catering',
        title: 'Main Convention Venue & Mandap Contract',
        lead: 'PER-001 / PER-002 (Couple)',
        priority: 'Critical',
        status: 'Completed',
        timeTag: 'T - 120 Days',
        desc: 'Execution of venue agreement CTR-001 with Swarna Mandap convention center including 6 VIP green rooms.',
        checklist: [
          { text: 'A/C capacity & 125 kVA generator backup verified', done: true },
          { text: 'Mandap sacred fire ventilation approved', done: true },
          { text: '50% initial advance deposit paid and ledger recorded', done: true }
        ],
        linkedEntities: ['CTR-001', 'VEN-003', 'PAY-001'],
        gate: null
      },
      {
        id: 'TSK-202',
        wbs: '3.2.1',
        stage: 'STAGE_01',
        track: 'catering',
        title: 'Traditional Odia Feast Catering SLA',
        lead: 'PER-014 (Food Lead)',
        priority: 'Critical',
        status: 'In-Progress',
        timeTag: 'T - 90 Days',
        desc: 'Contract signed for 850 guests traditional Odia ceremonial dinner menu (Kanika, Dalma, Paneer Besara, Chhena Poda).',
        checklist: [
          { text: 'Catering menu tasting session completed (TSK-903)', done: true },
          { text: 'Pure ghee purity certificate verified', done: true },
          { text: 'Sattvic priest dining protocol locked', done: false }
        ],
        linkedEntities: ['CTR-002', 'VDR-002'],
        gate: null
      },
      {
        id: 'TSK-203',
        wbs: '3.3.1',
        stage: 'STAGE_01',
        track: 'media',
        title: 'Cinematography, Drone & Photo Contract',
        lead: 'PER-001 / PER-002 (Couple)',
        priority: 'High',
        status: 'Completed',
        timeTag: 'T - 90 Days',
        desc: '4K multi-camera setup, dual drone operators, 48-hour teaser reel SLA, and full uncompressed raw archive storage.',
        checklist: [
          { text: 'Contract CTR-003 signed with VDR-003', done: true },
          { text: 'Day-of mandatory shot list approved', done: true },
          { text: 'Drone DGCA airspace clearance confirmed', done: true }
        ],
        linkedEntities: ['CTR-003', 'VDR-003'],
        gate: null
      },
      {
        id: 'TSK-401',
        wbs: '4.1.1',
        stage: 'STAGE_01',
        track: 'bride',
        title: 'Bridal Handloom Silk & Baula Patani Procurement',
        lead: 'PER-001 (Sree - Bride)',
        priority: 'Critical',
        status: 'Completed',
        timeTag: 'T - 75 Days',
        desc: 'Handwoven Odia Baula Patani yellow-red border silk saree and Sambalpuri bridal trousseau curated.',
        checklist: [
          { text: 'Authentic Sambalpur handloom master weaver engaged', done: true },
          { text: 'Natural vegetable dye purity checked for Vedic puja', done: true },
          { text: 'Blouse tailoring & fitting round 1 completed (TSK-704)', done: true }
        ],
        linkedEntities: ['AST-001', 'TSK-1101'],
        gate: null
      },
      {
        id: 'TSK-402',
        wbs: '4.2.1',
        stage: 'STAGE_01',
        track: 'groom',
        title: 'Groom Matka Silk Dhoti & Royal Sherwani',
        lead: 'PER-002 (Krushna - Groom)',
        priority: 'High',
        status: 'In-Progress',
        timeTag: 'T - 75 Days',
        desc: 'Pure Matka silk Vedic dhoti-chadar set for mandap and bespoke royal ivory sherwani for Barat.',
        checklist: [
          { text: 'Fabric trial and body measurement locked', done: true },
          { text: 'Embroidered safa fabric matched to bride palette', done: true },
          { text: 'Final trial fitting scheduled at T - 15', done: false }
        ],
        linkedEntities: ['AST-002', 'TSK-1102'],
        gate: null
      },
      {
        id: 'TSK-403',
        wbs: '4.3.1',
        stage: 'STAGE_01',
        track: 'fleet',
        title: 'Traditional Odia Mukuta Silver Crowns',
        lead: 'PER-006 / PER-008',
        priority: 'High',
        status: 'Completed',
        timeTag: 'T - 40 Days',
        desc: 'Cuttack silver filigree (Tarakasi) artisanal bridal and groom Mukuta crowns completed and placed in custody.',
        checklist: [
          { text: 'Silver hallmark purity certified', done: true },
          { text: 'Head circumference measurements verified', done: true },
          { text: 'Transferred to velvet vault box AST-005 / AST-006', done: true }
        ],
        linkedEntities: ['AST-005', 'AST-006'],
        gate: null
      },
      {
        id: 'TSK-801',
        wbs: '5.6.1',
        stage: 'STAGE_01',
        track: 'media',
        title: 'Wedding Website & Digital RSVP Portal',
        lead: 'PER-001 / PER-002 (Couple)',
        priority: 'High',
        status: 'Completed',
        timeTag: 'T - 90 Days',
        desc: 'Deployment of Sree Krushna Marriage OS digital platform with interactive guest RSVP and itinerary.',
        checklist: [
          { text: 'Firebase hosting & domain configuration live', done: true },
          { text: 'Mobile-first M-GATE-01 responsive audit passed', done: true },
          { text: 'PWA & Offline Service Worker registered', done: true }
        ],
        linkedEntities: ['TSK_PACK_08'],
        gate: null
      },
      {
        id: 'TSK-1001',
        wbs: '4.6.1',
        stage: 'STAGE_01',
        track: 'media',
        title: 'Sree & Krushna Royal Monogram Crest',
        lead: 'PER-001 / PER-002 (Couple)',
        priority: 'High',
        status: 'Completed',
        timeTag: 'T - 90 Days',
        desc: 'Official royal wedding emblem featuring Peacock, Conch (Sankha) and Kalasa motifs locked.',
        checklist: [
          { text: 'Vector design asset package exported', done: true },
          { text: 'Gold foil tooling stamp commissioned', done: true },
          { text: 'Applied to invitation suite & digital pass', done: true }
        ],
        linkedEntities: ['TSK_PACK_10'],
        gate: null
      },

      // ════ STAGE 02: Mangan & Sacred Rites (T-2 to T-1 Days) ═══════
      {
        id: 'TSK-103',
        wbs: '2.3.1',
        stage: 'STAGE_02',
        track: 'purohit',
        title: 'Mangan & Mangalakrutya Dawn Operations',
        lead: 'PER-006 (Bride Mother)',
        priority: 'High',
        status: 'Planned',
        timeTag: 'T - 2 Days • 06:00',
        desc: 'Traditional Odia turmeric grinding ceremony and ceremonial 7 married women (Sadhaba) dawn sacred bath.',
        checklist: [
          { text: 'Fresh raw organic turmeric roots procured from Puri', done: false },
          { text: 'Silaputa stone grinding setup in ceremonial courtyard', done: false },
          { text: '7 consecrated brass water pots (Kalasa) arranged', done: false }
        ],
        linkedEntities: ['RIT-003', 'SAM-003'],
        gate: null
      },
      {
        id: 'TSK-304',
        wbs: '5.4.1',
        stage: 'STAGE_02',
        track: 'fleet',
        title: 'Airport & Railway Station Transit Fleet Active',
        lead: 'PER-012 (Fleet Lead)',
        priority: 'High',
        status: 'Planned',
        timeTag: 'T - 2 Days • 08:00',
        desc: 'Dispatch of 8 dedicated shuttle vehicles for outstation family arrivals at BBI Airport and Railway Station.',
        checklist: [
          { text: 'Vehicle drivers briefed with passenger roster', done: false },
          { text: 'Welcome water bottles and Odia snacks kits loaded', done: false },
          { text: 'Real-time GPS tracking dashboard monitored', done: false }
        ],
        linkedEntities: ['TSK_PACK_03', 'PER-012'],
        gate: null
      },
      {
        id: 'TSK-705',
        wbs: '3.8.5',
        stage: 'STAGE_02',
        track: 'catering',
        title: 'Day-Before Full Operations Dry Run',
        lead: 'PER-014 (Day Commander)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'T - 1 Day • 18:00',
        desc: 'Comprehensive walkthrough with caterer, sound engineer, mandap purohit, and family track coordinators.',
        checklist: [
          { text: 'Sound system feedback test in Mandap sanctum', done: false },
          { text: 'Dining hall traffic flow and buffet line dry run', done: false },
          { text: 'Emergency contacts & pocket cards distributed', done: false }
        ],
        linkedEntities: ['TSK_PACK_07'],
        gate: null
      },
      {
        id: 'TSK-404',
        wbs: '4.4.1',
        stage: 'STAGE_02',
        track: 'fleet',
        title: 'Bank Vault Release for Precious Gold & Diamonds',
        lead: 'PER-007 (Custodian)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'T - 1 Day • 11:00',
        desc: 'Formal bank locker retrieval of bridal gold necklace sets, bangles and Mangalsutra with dual signatory log.',
        checklist: [
          { text: 'Weight verification against asset register AST-001..004', done: false },
          { text: 'Locked in biometric security case', done: false },
          { text: 'Armed custodian escort to venue safety locker', done: false }
        ],
        linkedEntities: ['AST-001', 'AST-002', 'AST-003'],
        gate: null
      },

      // ════ STAGE 03: Barat & Grand Reception (Day 0 • 16:00 to 19:30) ═
      {
        id: 'TSK-501',
        wbs: '6.0.1',
        stage: 'STAGE_03',
        track: 'catering',
        title: 'GATE-01 Pre-Event Readiness Sign-off',
        lead: 'PER-014 (Command Controller)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 15:00',
        desc: 'All-track readiness gate: Green room access, generator power test, sound levels, and samagri verification.',
        checklist: [
          { text: 'Green rooms cleaned, cooled, and key handed over', done: false },
          { text: '125 kVA generator test running on standby', done: false },
          { text: 'Purohit has inspected all 6 samagri kits (SAM-001..006)', done: false },
          { text: 'Command Control issues formal GATE-01 greenlight', done: false }
        ],
        linkedEntities: ['GATE-01', 'ALL_TRACKS'],
        gate: 'GATE-01'
      },
      {
        id: 'TSK-502',
        wbs: '6.1.1',
        stage: 'STAGE_03',
        track: 'bride',
        title: 'Bridal Makeup, Saree Draping & Chandan Chita',
        lead: 'PER-006 (Bride Mother) & VDR-005',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 16:00',
        desc: 'Senior MUA executes royal bridal makeup, Baula Patani draping, and intricate forehead sandalwood chita.',
        checklist: [
          { text: 'Airbrush base and eye artistry completed', done: false },
          { text: 'Chandan forehead sandalwood design painted', done: false },
          { text: 'Mukuta crown AST-005 securely pinned', done: false },
          { text: 'Bridal solo candid photoshoot in suite', done: false }
        ],
        linkedEntities: ['AST-001', 'AST-005', 'VDR-005'],
        gate: null
      },
      {
        id: 'TSK-503',
        wbs: '6.2.1',
        stage: 'STAGE_03',
        track: 'groom',
        title: 'Groom Sherwani, Safa & Barat Assembly',
        lead: 'PER-008 (Groom Lead)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 17:30',
        desc: 'Groom sherwani styling, safa tying, Mukuta AST-006 placement, and Barajatri assembly at gate.',
        checklist: [
          { text: 'Ivory sherwani, safa, and stole draped', done: false },
          { text: 'Barat brass band & Dhol ensemble in position', done: false },
          { text: 'Decorated luxury car VEH-01 ready', done: false },
          { text: 'Barat departure green signal from Command Control', done: false }
        ],
        linkedEntities: ['AST-006', 'VDR-006', 'VEH-01'],
        gate: null
      },
      {
        id: 'TSK-104',
        wbs: '2.4.1',
        stage: 'STAGE_03',
        track: 'purohit',
        title: 'GATE-02 Baranugam & Barat Reception Welcome',
        lead: 'PER-006 (Bride Mother) & Purohit',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 19:15',
        desc: 'Welcoming Groom as Lord Narayana at venue archway with ceremonial Aarti thali, coconut and floral garlands.',
        checklist: [
          { text: 'Aarti thali with burning ghee lamps and curd ready', done: false },
          { text: 'Cold pyrotechnics safely deployed along entryway', done: false },
          { text: 'Baranugam Vedic mantras chanted by Purohit', done: false },
          { text: 'Groom escorted to reception stage; GATE-02 locked', done: false }
        ],
        linkedEntities: ['GATE-02', 'RIT-004', 'SAM-004'],
        gate: 'GATE-02'
      },
      {
        id: 'TSK-506',
        wbs: '6.5.1',
        stage: 'STAGE_03',
        track: 'media',
        title: 'Barat Arrival Drone & Red Carpet Cinematography',
        lead: 'VDR-003 (Studio Lead)',
        priority: 'High',
        status: 'Planned',
        timeTag: 'Day 0 • 18:30',
        desc: 'Aerial 4K drone tracking of Barat procession, smoke flares, band performance, and grand entrance welcoming.',
        checklist: [
          { text: 'Drone battery bank charged & dual operators active', done: false },
          { text: 'Gimbal tracking of groom car arrival', done: false },
          { text: 'Emotional parents welcoming closeups captured', done: false }
        ],
        linkedEntities: ['VDR-003'],
        gate: null
      },

      // ════ STAGE 04: Vedic Mandap Sanctum (Day 0 • 19:30 to 22:30) ═
      {
        id: 'TSK-105',
        wbs: '2.5.1',
        stage: 'STAGE_04',
        track: 'purohit',
        title: 'GATE-03 Mandap Sanctum: Kanyadaan & Hastaganthi',
        lead: 'PER-005 (Kanyadata) & Chief Purohit',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 20:30',
        desc: 'Sacred water handover by parents, tying of holy Hastaganthi knot, and invoking Vedic ancestors.',
        checklist: [
          { text: 'Holy water from Ganga/Puri in copper vessel', done: false },
          { text: 'Hastaganthi consecrated yellow cloth tied securely', done: false },
          { text: 'Kanyadaan dakshina and coconut handed to groom', done: false }
        ],
        linkedEntities: ['GATE-03', 'RIT-005', 'SAM-005'],
        gate: 'GATE-03'
      },
      {
        id: 'TSK-106',
        wbs: '2.6.1',
        stage: 'STAGE_04',
        track: 'purohit',
        title: 'Lajahoma, Saptapadi & Seven Sacred Vows',
        lead: 'PER-080 (Chief Vedic Purohit)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 21:30 (Muhurat)',
        desc: 'Puffed rice offerings into Agni, seven circumambulations and stepping on grinding stone (Silaputa).',
        checklist: [
          { text: 'Pure cow ghee continuous fire oblations active', done: false },
          { text: '7 betel nuts placed for Saptapadi steps', done: false },
          { text: 'Bride brother pours Laja puffed rice into couple hands', done: false }
        ],
        linkedEntities: ['RIT-006', 'RIT-007', 'SAM-005'],
        gate: 'GATE-03'
      },
      {
        id: 'TSK-107',
        wbs: '2.6.2',
        stage: 'STAGE_04',
        track: 'bride',
        title: 'Sindoor Daan & Mangalsutra Dharan',
        lead: 'PER-001 / PER-002 (Couple)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 22:00',
        desc: 'Groom applies sacred vermilion (Sindoor) with betel leaf and fastens gold Mangalsutra AST-003.',
        checklist: [
          { text: 'Pure consecrated vermilion from temple in silver box', done: false },
          { text: 'Gold Mangalsutra handed over by Custodian PER-007', done: false },
          { text: 'Sindoor Daan solemnized to Vedic chanting', done: false }
        ],
        linkedEntities: ['RIT-008', 'AST-003'],
        gate: null
      },
      {
        id: 'TSK-507',
        wbs: '6.6.1',
        stage: 'STAGE_04',
        track: 'fleet',
        title: 'Priest Dakshina Cash Envelopes & Shagun Ledger',
        lead: 'PER-007 (Cash Custodian)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 22:15',
        desc: 'Handover of Vedic priest dakshina in cash envelopes CSH-01..05 with signed voucher receipts.',
        checklist: [
          { text: 'Dakshina envelopes verified with exact currency denominations', done: false },
          { text: 'Handover signed off by PER-005 and Chief Purohit', done: false },
          { text: 'Shagun cash box sealed in Mandap safety vault', done: false }
        ],
        linkedEntities: ['PAY-005', 'TSK_PACK_05'],
        gate: null
      },

      // ════ STAGE 05: Royal Feast & Hospitality (Day 0 • 19:30 to 23:30) 
      {
        id: 'TSK-505',
        wbs: '6.4.1',
        stage: 'STAGE_05',
        track: 'catering',
        title: 'Main Ceremonial Feast Dining Pavilion Operations',
        lead: 'PER-014 (Food Lead)',
        priority: 'High',
        status: 'Planned',
        timeTag: 'Day 0 • 19:30',
        desc: 'Opening of 850-capacity royal dining pavilion with live hot Chhena Poda and Odia cuisine service.',
        checklist: [
          { text: 'Buffet warmers at 70°C and hand sanitization active', done: false },
          { text: 'VIP Sattvic seating reserved for priests & elders', done: false },
          { text: 'Continuous water refilling & plate clearance monitored', done: false }
        ],
        linkedEntities: ['CTR-002', 'TSK_PACK_05'],
        gate: null
      },
      {
        id: 'TSK-305',
        wbs: '5.5.1',
        stage: 'STAGE_05',
        track: 'catering',
        title: 'VIP Sattvic Dining & Elder Hospitality Care',
        lead: 'Hospitality Committee',
        priority: 'Medium',
        status: 'Planned',
        timeTag: 'Day 0 • 21:00',
        desc: 'Dedicated silver thali dining service for temple sevayats, Vedic purohits, and senior family matriarchs.',
        checklist: [
          { text: 'Pure ghee no-onion-garlic menu verified by Purohit', done: false },
          { text: 'Seated dining attendants assigned', done: false },
          { text: 'Warm herbal tea and sweet digestives served', done: false }
        ],
        linkedEntities: ['TSK_PACK_03'],
        gate: null
      },

      // ════ STAGE 06: Chauthi, Grihapravesh & Astamangala (Day +1 to +8) 
      {
        id: 'TSK-109',
        wbs: '2.7.1',
        stage: 'STAGE_06',
        track: 'purohit',
        title: 'GATE-04 Kanyavida (Farewell) & Departure Escort',
        lead: 'PER-005 / PER-006 & PER-014',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day 0 • 23:45',
        desc: 'Emotional bridal farewell, rice throwing over shoulder, vehicle escort, and GATE-04 execution.',
        checklist: [
          { text: 'Consecrated rice and coins handed to bride', done: false },
          { text: 'Bridal car VEH-01 luggage verified and security sealed', done: false },
          { text: 'GATE-04 formal departure handshake signed off', done: false }
        ],
        linkedEntities: ['GATE-04', 'RIT-009'],
        gate: 'GATE-04'
      },
      {
        id: 'TSK-601',
        wbs: '1.5.1',
        stage: 'STAGE_06',
        track: 'bride',
        title: 'Marriage Legal Registration (Hindu Marriage Act)',
        lead: 'PER-001 / PER-002 (Couple)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day +2',
        desc: 'Submission of formal marriage registration application with priest solemnization certificate and 3 witnesses.',
        checklist: [
          { text: 'Priest signed Vedic marriage solemnization letter ready', done: false },
          { text: 'Passport size photographs and wedding card attested', done: false },
          { text: 'Biometric appointment at Sub-Registrar Office booked', done: false }
        ],
        linkedEntities: ['TSK_PACK_06'],
        gate: null
      },
      {
        id: 'TSK-108',
        wbs: '2.8.1',
        stage: 'STAGE_06',
        track: 'purohit',
        title: 'Post-Wedding Chauthi Puja & Astamangala Feast',
        lead: 'Family Elders & PER-005',
        priority: 'High',
        status: 'Planned',
        timeTag: 'Day +4 & Day +8',
        desc: '4th night sacred union homa, untying of Hastaganthi knot, and 8th day return feast to bride ancestral home.',
        checklist: [
          { text: 'Chauthi homa wood and samagri SAM-006 ready', done: false },
          { text: 'Hastaganthi knot holy water dissolution rite performed', done: false },
          { text: 'Astamangala return feast bhaar gifts prepared (TSK-1105)', done: false }
        ],
        linkedEntities: ['RIT-011', 'RIT-012', 'SAM-006'],
        gate: null
      },
      {
        id: 'TSK-405',
        wbs: '4.4.2',
        stage: 'STAGE_06',
        track: 'fleet',
        title: 'Bank Vault Asset Return & Final Audit',
        lead: 'PER-007 (Asset Custodian)',
        priority: 'Critical',
        status: 'Planned',
        timeTag: 'Day +3',
        desc: 'Re-deposit of bridal gold jewellery and silver Mukuta crowns to bank locker with zero weight discrepancy.',
        checklist: [
          { text: 'Detailed physical audit of AST-001 through AST-006', done: false },
          { text: 'Bank locker deposit voucher signed and filed in 06_FINANCE', done: false },
          { text: 'Asset custody ledger closed out', done: false }
        ],
        linkedEntities: ['AST-001', 'AST-006', '06_FINANCE_COMMERCIALS'],
        gate: null
      }
    ]
  };
});
