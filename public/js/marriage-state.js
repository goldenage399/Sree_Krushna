/**
 * 👑 Sree Krushna Marriage OS — Canonical State & Data Feed
 * Single Source of Truth for:
 * • 6 Temporal Stages / Phases
 * • 6 Parallel Operational Swimlanes (Tracks)
 * • 4 Critical Operational Gates (GATE-01 to GATE-04)
 * • 62 Master Tasks & Work Packages (TSK-101 through TSK-1105)
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
      version: '3.1.0',
      title: 'Sree Krushna Marriage OS',
      couple: 'Sree & Krushna',
      muhurat: '2027-03-10 08:00 IST',
      venue: 'Swarna Mandap, Bhubaneswar, Odisha',
      updatedAt: '2026-08-22T14:06:13.540Z'
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

    // ── CANONICAL MASTER TASKS (TSK-101 THROUGH TSK-1105) ───────────
    tasks: [
      {
            "id": "TSK-101",
            "wbs": "2.1.1",
            "stage": "STAGE_01",
            "track": "purohit",
            "title": "Deva Nimantrana Sacred Invitation Offering",
            "lead": "PER-005 (Bride Father / Elders)",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-60 Days",
            "desc": "Offer the first formal wedding invitation card along with sacred betel nut (*Gua*), unbroken rice (*Akshata*), yellow cloth (*Pata*), and coconut at the sanctum sanctorum of Lord Jagannath Temple (Puri), Lord Lingaraj Temple (Bhubaneswar), and local Grama Devati.",
            "checklist": [
                  {
                        "text": "Consecrated Puri Jagannath Temple card package assembled with raw silk wrap.",
                        "done": false
                  },
                  {
                        "text": "Temple priest (*Pujapanda*) appointment booked.",
                        "done": false
                  },
                  {
                        "text": "Formal *Sankalpa* and blessing offering performed at Jagannath Temple.",
                        "done": false
                  },
                  {
                        "text": "Lingaraj Temple & family ancestral temple (*Grama Devati*) card offerings completed.",
                        "done": false
                  },
                  {
                        "text": "Sacred *Mahaprasad / Nirmalya* collected for wedding day mandap distribution.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "RIT-002",
                  "SAM-002"
            ],
            "gate": null
      },
      {
            "id": "TSK-102",
            "wbs": "2.2.1",
            "stage": "STAGE_01",
            "track": "purohit",
            "title": "Nirbandha & Ashirbad Liturgy Setup",
            "lead": "PER-005 / PER-007",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-45 Days",
            "desc": "Conduct the formal Odia engagement liturgy (*Nirbandha*) with *Patra Paribartana* (horoscope agreement exchange), solemn paternal vow exchange (*Sankalpa*), and blessing ring exchange.",
            "checklist": [
                  {
                        "text": "Family Purohits from bride & groom sides coordinated.",
                        "done": false
                  },
                  {
                        "text": "`SAM-001` Nirbandha samagri box (silver thali, betel nuts, coconuts, raw turmeric) verified.",
                        "done": false
                  },
                  {
                        "text": "Horoscope exchange scrolls signed and preserved.",
                        "done": false
                  },
                  {
                        "text": "Blessing gold rings inspected and blessed by elders.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-001",
                  "RIT-001",
                  "SAM-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-103",
            "wbs": "2.3.1",
            "stage": "STAGE_02",
            "track": "purohit",
            "title": "Mangan & Mangalakrutya Dawn Operations",
            "lead": "PER-006 (Bride Mother) & Married Elders (*Sadhaba*)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-2 Days",
            "desc": "Perform the traditional pre-dawn turmeric grinding and ceremonial bath (*Mangan Snana*) conducted by seven married women (*Sadhaba*), setting up the sacred brass water pot (*Purna Kumbha*) and auspicious oil lamp (*Diya*).",
            "checklist": [
                  {
                        "text": "7 married women (*Sadhaba*) family roster confirmed.",
                        "done": false
                  },
                  {
                        "text": "Fresh whole organic turmeric roots (*Kancha Haladi*) procured for ceremonial stone grinding (*Silaputa*).",
                        "done": false
                  },
                  {
                        "text": "Brass *Ghata / Purna Kumbha* decorated with mango leaves and coconut.",
                        "done": false
                  },
                  {
                        "text": "Consecrated yellow cotton attire procured for bride and groom.",
                        "done": false
                  },
                  {
                        "text": "Mangan morning photo capture schedule synchronized with photographer.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-003",
                  "RIT-003",
                  "SAM-003"
            ],
            "gate": null
      },
      {
            "id": "TSK-104",
            "wbs": "2.4.1",
            "stage": "STAGE_03",
            "track": "purohit",
            "title": "Baranugam & Barat Reception Sacred Welcome",
            "lead": "PER-006 (Bride Mother) & PER-014",
            "priority": "High",
            "status": "Planned",
            "timeTag": "Day 0 - T+0",
            "desc": "Formal Vedic welcoming of the Groom and Barajatri procession at the main venue entrance, including sacred water washing of feet, sandalwood application, *Arati* by the bride's mother, and wearing of the consecrated garland.",
            "checklist": [
                  {
                        "text": "Brass Arati thali with consecrated ghee lamps, flowers, and sweet curd prepared.",
                        "done": false
                  },
                  {
                        "text": "Silver rosewater sprinkler (*Golap Pasha*) and sandalwood paste bowl ready.",
                        "done": false
                  },
                  {
                        "text": "Royal entrance floral garland for groom ready.",
                        "done": false
                  },
                  {
                        "text": "Entrance coordinator deployed with wireless mic for arrival announcement.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-004",
                  "RIT-004",
                  "SAM-004"
            ],
            "gate": null
      },
      {
            "id": "TSK-105",
            "wbs": "2.5.1",
            "stage": "STAGE_04",
            "track": "purohit",
            "title": "Kanyadaan & Hastaganthi Sacred Handover Sanctum",
            "lead": "Kanyadata (Bride Father / PER-005) & Chief Purohit",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - T+0",
            "desc": "Perform the central Vedic Kanyadaan ceremony, joining hands with consecrated water (*Hastaganthi*), wrapping the sacred kusha grass and mango leaf, and reciting ancestral lineage (*Gotra & Pravara*).",
            "checklist": [
                  {
                        "text": "Consecrated brass *Kunda* and holy water from Ganga/Puri verified.",
                        "done": false
                  },
                  {
                        "text": "Ancestral lineage gotra genealogy recital sheet ready for Purohit.",
                        "done": false
                  },
                  {
                        "text": "Sacred *Baula Patani* yellow-red silk saree handed over for bride's mandap entry.",
                        "done": false
                  },
                  {
                        "text": "Gold ring / token dakshina prepared for Kanyadata ritual.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-004",
                  "RIT-005",
                  "SAM-005"
            ],
            "gate": null
      },
      {
            "id": "TSK-106",
            "wbs": "2.6.1",
            "stage": "STAGE_04",
            "track": "purohit",
            "title": "Lajahoma, Saptapadi & Seven Sacred Vows",
            "lead": "Chief Vedic Purohit",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - T+0",
            "desc": "Conduct the holy sacrificial fire offerings (*Lajahoma*) with bride's brother offering puffed rice (*Khai*), circumambulation around Agni (*Pradakshina*), and taking the seven sacred steps (*Saptapadi*) over 7 betel nut mounds.",
            "checklist": [
                  {
                        "text": "Dry sacred wood (*Samidha*) and pure desi cow ghee (2 kg) in mandap box.",
                        "done": false
                  },
                  {
                        "text": "Bride brother appointed and briefed for *Khai* pouring ceremony.",
                        "done": false
                  },
                  {
                        "text": "7 distinct mounds of rice, betel leaves, and whole betel nuts laid in line.",
                        "done": false
                  },
                  {
                        "text": "Consecrated stone slab (*Shila Arohana*) placed near sacred fire.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-004",
                  "RIT-006",
                  "SAM-006"
            ],
            "gate": null
      },
      {
            "id": "TSK-107",
            "wbs": "2.6.2",
            "stage": "STAGE_04",
            "track": "purohit",
            "title": "Sindoor Daan, Mangalsutra & Mukuta Consecration",
            "lead": "Chief Purohit & Sree/Krushna",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - T+0",
            "desc": "Execute the crowning Vedic rite of applying pure vermilion (*Sindoor*) with the golden ring/betel leaf, tying the sacred Mangalsutra (`AST-003`), and blessing the handcrafted silver crowns (*Mukuta*).",
            "checklist": [
                  {
                        "text": "Pure Odia vermilion (*Sindoor*) in traditional brass casket (*Kajalpati*).",
                        "done": false
                  },
                  {
                        "text": "`AST-003` Mangalsutra handed over from parents vault box directly to Groom.",
                        "done": false
                  },
                  {
                        "text": "Handcrafted silver Mukuta crowns (`AST-005` & `AST-006`) fitted with velvet ribbons.",
                        "done": false
                  },
                  {
                        "text": "High-definition macro photography lens ready for unrepeatable millisecond capture.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-004",
                  "RIT-009",
                  "AST-003",
                  "AST-005"
            ],
            "gate": null
      },
      {
            "id": "TSK-108",
            "wbs": "2.8.1",
            "stage": "STAGE_06",
            "track": "purohit",
            "title": "Post-Wedding Chauthi Puja & Astamangala Feast",
            "lead": "Family Elders & Parents Council",
            "priority": "High",
            "status": "Planned",
            "timeTag": "Day +4 to Day +8",
            "desc": "Coordinate the sacred 4th night *Chauthi Puja* at the groom's residence and the 8th day *Astamangala* celebratory banquet at the bride's parental residence.",
            "checklist": [
                  {
                        "text": "Chauthi floral room decoration and sacred milk/sweet offerings arranged.",
                        "done": false
                  },
                  {
                        "text": "Astamangala travel conveyance arranged for the couple and entourage.",
                        "done": false
                  },
                  {
                        "text": "8-course traditional homecoming feast planned at bride residence.",
                        "done": false
                  },
                  {
                        "text": "Astamangala gift exchanges (*Bhaar*) cataloged and verified.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-006",
                  "RIT-011"
            ],
            "gate": null
      },
      {
            "id": "TSK-201",
            "wbs": "3.1.1",
            "stage": "STAGE_01",
            "track": "catering",
            "title": "Main Convention Venue & Mandap Booking Contract",
            "lead": "Sree & Krushna",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-120 Days",
            "desc": "Execute the formal booking contract with Mayfair Convention Hub for the main wedding hall, green rooms, central mandap courtyard, and designated dining pavilion with 50% advance deposit.",
            "checklist": [
                  {
                        "text": "Hall capacity verified for 500+ guests with central air conditioning.",
                        "done": false
                  },
                  {
                        "text": "2 VIP Green Rooms reserved with attached private washrooms and locks.",
                        "done": false
                  },
                  {
                        "text": "Dedicated parking zone for 100+ vehicles confirmed with venue security.",
                        "done": false
                  },
                  {
                        "text": "Generator power backup (125 kVA) written into the contract rider.",
                        "done": false
                  },
                  {
                        "text": "50% booking advance payment executed (`PAY-001`).",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VEN-001",
                  "CTR-001",
                  "PAY-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-202",
            "wbs": "3.2.1",
            "stage": "STAGE_01",
            "track": "catering",
            "title": "Traditional Odia Feast Catering SLA & Menu Finalization",
            "lead": "PER-014 (Food & Hospitality Lead)",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-90 Days",
            "desc": "Finalize contract with Royal Odia Caterers (`VDR-001`) for multi-course traditional Odia wedding banquet, live snack counters, specialized banana-leaf VIP service, and sweet counter.",
            "checklist": [
                  {
                        "text": "Food tasting session completed with Parents Council.",
                        "done": false
                  },
                  {
                        "text": "Traditional signature menu locked: *Kanika, Ghee Rice, Dalma, Paneer Besara, Chhena Jhili, Rasagola, Chhena Poda*.",
                        "done": false
                  },
                  {
                        "text": "Minimum guaranteed plate count (450 pax) + 15% floating buffer locked.",
                        "done": false
                  },
                  {
                        "text": "Mineral water dispenser (20L jars + eco paper cups) SLA signed.",
                        "done": false
                  },
                  {
                        "text": "Waste disposal and live banquet cleaning staff SLA finalized.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-001",
                  "CTR-002"
            ],
            "gate": null
      },
      {
            "id": "TSK-203",
            "wbs": "3.3.1",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Cinematography, Drone & Photography Suite Contract",
            "lead": "Sree & Krushna",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-90 Days",
            "desc": "Finalize photography agreement with Studio Cinema & Drone (`VDR-003`) covering 3 candid photographers, 2 cinematic videographers, 1 drone operator, and 1 traditional stage photographer.",
            "checklist": [
                  {
                        "text": "Portfolio review and lighting style alignment completed.",
                        "done": false
                  },
                  {
                        "text": "Drone flight permission and indoor gimbal stabilization confirmed.",
                        "done": false
                  },
                  {
                        "text": "YouTube / Private Web Live Stream link delivery SLA included.",
                        "done": false
                  },
                  {
                        "text": "Raw footage SSD drive delivery within 7 days SLA locked.",
                        "done": false
                  },
                  {
                        "text": "Advance booking payment executed (`PAY-003`).",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-003",
                  "CTR-003",
                  "PAY-003"
            ],
            "gate": null
      },
      {
            "id": "TSK-204",
            "wbs": "3.4.1",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Mandap Floral Architecture & Dynamic Light Styling",
            "lead": "PER-006 / PER-008",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-45 Days",
            "desc": "Finalize 3D mandap render and floral contract with Mandap Decorators (`VDR-002`) featuring a consecrated fresh tuberose (*Rajanigandha*) and marigold dome, fairy light canopy, and royal entryway arches.",
            "checklist": [
                  {
                        "text": "3D architectural render approved by Sree & Krushna.",
                        "done": false
                  },
                  {
                        "text": "Fresh flower sourcing lock from local flower mandis confirmed.",
                        "done": false
                  },
                  {
                        "text": "Fire-retardant fabric certification obtained for mandap drapes.",
                        "done": false
                  },
                  {
                        "text": "Stage sofa seating and family brass chairs delivered and inspected.",
                        "done": false
                  },
                  {
                        "text": "Ambient warm yellow lighting (2700K) specified for photo clarity.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-002",
                  "CTR-004"
            ],
            "gate": null
      },
      {
            "id": "TSK-205",
            "wbs": "3.5.1",
            "stage": "STAGE_01",
            "track": "bride",
            "title": "Bridal Makeup Artist (MUA) & Groom Styling Suite",
            "lead": "Sree (Bride)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-30 Days",
            "desc": "Book Bridal Artistry Studio (`VDR-005`) for HD Airbrush bridal makeup, hair styling, traditional Odia sandalwood forehead artistry (*Chandan Chita*), saree draping, and mother/sister styling.",
            "checklist": [
                  {
                        "text": "Bridal trial makeup and hair test completed.",
                        "done": false
                  },
                  {
                        "text": "Sandalwood forehead design (*Chita*) reference template approved.",
                        "done": false
                  },
                  {
                        "text": "Call-time schedule locked (MUA on-site 3.5 hours before Barat arrival).",
                        "done": false
                  },
                  {
                        "text": "Groom professional beard trimming and hair styling appointment booked.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-005",
                  "CTR-005"
            ],
            "gate": null
      },
      {
            "id": "TSK-206",
            "wbs": "3.6.1",
            "stage": "STAGE_01",
            "track": "groom",
            "title": "Barajatri Brass Band, Royal Dhol & Pyrotechnic Permitting",
            "lead": "PER-008 (Groom Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-30 Days",
            "desc": "Contract consecrated traditional Odia brass band, royal Punjabi dhol unit, illuminated mobile light trolleys, and cold spark pyrotechnic machines for the Barat procession.",
            "checklist": [
                  {
                        "text": "Brass band 15-piece brass ensemble confirmed with curated song playlist.",
                        "done": false
                  },
                  {
                        "text": "2 Punjabi dhol players contracted for high-energy entrance beats.",
                        "done": false
                  },
                  {
                        "text": "4 Cold spark pyrotechnic machines booked (safe indoor/outdoor operation).",
                        "done": false
                  },
                  {
                        "text": "Procession route from hotel to main hall mapped with transit police.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-006",
                  "CTR-006"
            ],
            "gate": null
      },
      {
            "id": "TSK-207",
            "wbs": "3.7.1",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "High-Fidelity Audio, Collar Mics & Purohit Sound Rider",
            "lead": "PER-014 (Logistics Lead)",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-7 Days",
            "desc": "Deploy professional PA audio setup with wireless lapel/collar microphones for the officiating Purohits, ambient mandap speakers, and reception sound engineering.",
            "checklist": [
                  {
                        "text": "2 Ultra-sensitive UHF wireless collar microphones reserved for Purohits.",
                        "done": false
                  },
                  {
                        "text": "Dedicated audio technician stationed near mandap during Vedic rites.",
                        "done": false
                  },
                  {
                        "text": "Shehnai and classical Odissi instrumental background tracks curated.",
                        "done": false
                  },
                  {
                        "text": "Sound check and echo damping test scheduled at T-4 hours.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-007",
                  "CTR-007"
            ],
            "gate": null
      },
      {
            "id": "TSK-301",
            "wbs": "5.1.1",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Master Guest Register & Family Unit Mapping",
            "lead": "Sree & Krushna",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-60 Days",
            "desc": "Compile and deduplicate 350+ invited guests across 85 structured family units (`FAM-001` through `FAM-085`), assigning VIP priority tiers, dietary restrictions, and headcounts.",
            "checklist": [
                  {
                        "text": "Bride side family guest list finalized (175 pax).",
                        "done": false
                  },
                  {
                        "text": "Groom side family guest list finalized (175 pax).",
                        "done": false
                  },
                  {
                        "text": "VIP elder relatives flagged for dedicated hospitality escorts.",
                        "done": false
                  },
                  {
                        "text": "Special dietary preferences (pure satvik / diabetic / kids) logged in directory.",
                        "done": false
                  },
                  {
                        "text": "Phone numbers and WhatsApp numbers verified for automated broadcast.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "PER-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-302",
            "wbs": "5.2.1",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Physical Invitation Box & Traditional Pana Gua Packing",
            "lead": "Sree & Krushna / Parents Council",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-45 Days",
            "desc": "Design, print, and hand-assemble luxury physical wedding invitation boxes containing consecrated cards, traditional Odia dried betel nuts (*Gua*), betel leaves (*Pana*), sweets, and itinerary cards.",
            "checklist": [
                  {
                        "text": "Luxury foil-stamped invitation card proofing approved.",
                        "done": false
                  },
                  {
                        "text": "Traditional brass-wrapped whole betel nuts (*Gua*) sourced from Puri.",
                        "done": false
                  },
                  {
                        "text": "Local hand delivery roster for elder relatives planned with family cars.",
                        "done": false
                  },
                  {
                        "text": "Courier tracking register established for outstation / overseas relatives.",
                        "done": false
                  },
                  {
                        "text": "Digital e-card video teaser produced for instant messaging dispatch.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-303",
            "wbs": "5.3.1",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Hotel Room Block Contract & Family Room Allocation",
            "lead": "PER-014 (Hospitality Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-30 Days",
            "desc": "Block 30+ premium air-conditioned hotel rooms at Mayfair / adjacent partner hotels, mapping family units (`FAM-###`) to specific room numbers with early check-in allowances.",
            "checklist": [
                  {
                        "text": "30 deluxe double-occupancy rooms locked with group discount rate.",
                        "done": false
                  },
                  {
                        "text": "Early morning check-in (08:00 AM) pre-arranged for morning arrivals.",
                        "done": false
                  },
                  {
                        "text": "Room allocation spreadsheet generated mapping families to floor clusters.",
                        "done": false
                  },
                  {
                        "text": "Key card envelopes pre-printed with guest names and event schedules.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-304",
            "wbs": "5.4.1",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "Airport & Railway Transit Fleet Dispatch Schedule",
            "lead": "PER-014 (Fleet Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-3 Days",
            "desc": "Contract and schedule a fleet of 8 air-conditioned vehicles (Toyota Innovas & sedans) for round-the-clock airport (BBI) and Bhubaneswar railway station pickups.",
            "checklist": [
                  {
                        "text": "8 Innova Crysta / Dzire cabs contracted with vendor with fuel SLA.",
                        "done": false
                  },
                  {
                        "text": "Drivers briefed on VIP guest courtesy and designated parking passes.",
                        "done": false
                  },
                  {
                        "text": "Live flight / train arrival tracking sheet managed by transit dispatcher.",
                        "done": false
                  },
                  {
                        "text": "Welcome dashboard display placards printed (*\"Welcome Guests of Sree & Krushna\"*).",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-305",
            "wbs": "5.5.1",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "In-Room Welcome Hampers & Concierge Hospitality Desk",
            "lead": "Hospitality Committee",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-1 Day",
            "desc": "Assemble and place 35+ custom gift hampers in guest rooms containing mineral water, Odia snacks (*Nimki, Khaja*), first-aid/ORS sachets, and laminated event pocket guides.",
            "checklist": [
                  {
                        "text": "35 jute gift baskets packed with local snacks, dry fruits, and water.",
                        "done": false
                  },
                  {
                        "text": "Emergency medical / hangover / paracetamol kit included in each basket.",
                        "done": false
                  },
                  {
                        "text": "Laminated pocket run-sheet card with coordinator emergency hotlines placed.",
                        "done": false
                  },
                  {
                        "text": "24/7 lobby welcome desk manned with hospitality badge coordinators.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-401",
            "wbs": "4.1.1",
            "stage": "STAGE_01",
            "track": "bride",
            "title": "Traditional Bridal Silk & Baula Patani Saree Procurement",
            "lead": "Sree (Bride) & PER-006 (Bride Mother)",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-75 Days",
            "desc": "Select and custom-tailor the handloom Sambalpuri silk wedding saree, auspicious yellow-red *Baula Patani* for Vedic rites, and designer evening reception attire with matching blouses.",
            "checklist": [
                  {
                        "text": "Authentic handloom Sambalpuri bridal red silk saree selected.",
                        "done": false
                  },
                  {
                        "text": "Traditional yellow silk with red border *Baula Patani* procured for mandap entry.",
                        "done": false
                  },
                  {
                        "text": "Blouse embroidery and custom fitting trial completed.",
                        "done": false
                  },
                  {
                        "text": "Reception designer gown / lehenga alterations finalized.",
                        "done": false
                  },
                  {
                        "text": "Fall and pico stitching verified for all 6 bridal ceremony sarees.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-402",
            "wbs": "4.2.1",
            "stage": "STAGE_01",
            "track": "groom",
            "title": "Groom Matka Silk Dhoti, Royal Sherwani & Safa",
            "lead": "Krushna (Groom) & PER-008 (Groom Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-75 Days",
            "desc": "Tailor the traditional unstitched pure Matka silk Dhoti-Kurta for Vedic mandap rituals, royal velvet embroidered Sherwani for the Barat procession, and tailored suit for the reception.",
            "checklist": [
                  {
                        "text": "Matka silk yellow Kurta-Dhoti set for mandap rites purchased.",
                        "done": false
                  },
                  {
                        "text": "Royal ivory/gold Sherwani with matching stole (*Dupatta*) fitted.",
                        "done": false
                  },
                  {
                        "text": "Royal royal-blue/burgundy Safa (turban) with antique Kalgi broach fitted.",
                        "done": false
                  },
                  {
                        "text": "Tailored reception suit fitting verified with trial footwear (*Juttis*).",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-403",
            "wbs": "4.3.1",
            "stage": "STAGE_01",
            "track": "groom",
            "title": "Traditional Odia Mukuta Handcrafted Silver Filigree",
            "lead": "PER-006 / PER-008",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-40 Days",
            "desc": "Commission and fit authentic Cuttack silver filigree / Solapitha bridal and groom crowns (*Mukuta*) crafted according to classical Odia wedding tradition.",
            "checklist": [
                  {
                        "text": "Master artisan commissioned in Cuttack for traditional silver Mukutas.",
                        "done": false
                  },
                  {
                        "text": "Head circumference sizing verified for both Sree and Krushna.",
                        "done": false
                  },
                  {
                        "text": "Padded velvet headbands attached to prevent forehead pinching during long rites.",
                        "done": false
                  },
                  {
                        "text": "`AST-005` (Bride Mukuta) and `AST-006` (Groom Mukuta) stored in dedicated green room boxes.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "AST-005",
                  "AST-006"
            ],
            "gate": null
      },
      {
            "id": "TSK-404",
            "wbs": "4.4.1",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "Bank Safe Vault Release for Precious Gold (`AST-001`..`004`)",
            "lead": "PER-007 (Parents Custodian)",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-3 Days",
            "desc": "Execute scheduled appointment at State Bank of India / HDFC Bank safe deposit vault to withdraw bridal gold ornaments (`AST-001` Choker, `AST-002` Bangles/Kada, `AST-003` Mangalsutra, `AST-004` Gold Coins) into lockable security box.",
            "checklist": [
                  {
                        "text": "Bank locker appointment booked for T-3 days.",
                        "done": false
                  },
                  {
                        "text": "Witness sign-off log initiated with two designated family custodians.",
                        "done": false
                  },
                  {
                        "text": "Weight verification and inspection of 22K hallmarks performed.",
                        "done": false
                  },
                  {
                        "text": "Velvet jewellery organizer case locked inside portable digital fire-safe box.",
                        "done": false
                  },
                  {
                        "text": "Custody log state updated to `\"Box Ready\"` in Marriage OS.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "AST-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-405",
            "wbs": "4.5.1",
            "stage": "STAGE_03",
            "track": "fleet",
            "title": "Emergency Green Room Wardrobe & Repair Unit",
            "lead": "Green Room Attendant / Sister",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "Day 0 - T+0",
            "desc": "Deploy a comprehensive emergency dressing kit in both Bride and Groom VIP green rooms with steam iron, tailoring kit, stain remover, safety pins, and duplicate dupattas.",
            "checklist": [
                  {
                        "text": "Heavy-duty handheld steam iron delivered to green room.",
                        "done": false
                  },
                  {
                        "text": "Emergency sewing kit (matching threads, needles, hooks, scissors) placed.",
                        "done": false
                  },
                  {
                        "text": "100+ premium safety pins, bobby pins, and double-sided fashion tape.",
                        "done": false
                  },
                  {
                        "text": "Backup footwear / comfortable flats ready for mandap transitions.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-501",
            "wbs": "6.0.1",
            "stage": "STAGE_03",
            "track": "fleet",
            "title": "GATE-01 Pre-Event Readiness Sign-off",
            "lead": "PER-014 (Command Controller) & Parents Council",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - T - 4 Hours",
            "desc": "Execute full venue walkthrough and sign-off on all 6 tracks 4 hours prior to Barat arrival, verifying green room access, sound levels, generator power, mandap samagri readiness, and dining buffer readiness.",
            "checklist": [
                  {
                        "text": "Green rooms unlocked, cleaned, and air-conditioning operational.",
                        "done": false
                  },
                  {
                        "text": "Mandap Purohit has inspected all 6 samagri packs (`SAM-001`..`006`).",
                        "done": false
                  },
                  {
                        "text": "Backup diesel generator (125 kVA) tested and idling in standby.",
                        "done": false
                  },
                  {
                        "text": "Buffet dining area setup complete with water jars and handwash stations.",
                        "done": false
                  },
                  {
                        "text": "Formal `GATE-01` green light issued by PER-014.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": "GATE-01"
      },
      {
            "id": "TSK-502",
            "wbs": "6.1.1",
            "stage": "STAGE_03",
            "track": "bride",
            "title": "Track A — Bride Sanctum & MUA Timing Run",
            "lead": "PER-006 (Bride Mother) & Green Room Coordinator",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - 15:00 to 18:30",
            "desc": "Coordinate bridal makeup, hair styling, traditional *Chandan Chita* sandalwood art, Sambalpuri silk saree draping, and gold jewelry handover in the Bride VIP green room.",
            "checklist": [
                  {
                        "text": "15:00 — MUA arrives at green room with airbrush equipment.",
                        "done": false
                  },
                  {
                        "text": "16:30 — Hair and sandalwood forehead artwork completed.",
                        "done": false
                  },
                  {
                        "text": "17:30 — Saree draping and `AST-001` & `AST-002` jewellery handover signed off.",
                        "done": false
                  },
                  {
                        "text": "18:15 — Bridal solo portraits and family green room photo session completed.",
                        "done": false
                  },
                  {
                        "text": "18:30 — Ready signal sent to Command Control for Mandap entry coordination.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-005",
                  "AST-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-503",
            "wbs": "6.2.1",
            "stage": "STAGE_03",
            "track": "groom",
            "title": "Track B — Groom Sherwani, Safa & Barajatri Procession",
            "lead": "PER-008 (Groom Lead)",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - 17:00 to 19:30",
            "desc": "Manage Groom sherwani dressing, safa tying, Mukuta placement (`AST-006`), Barajatri assembly at assembly hotel, brass band start, and grand musical entry.",
            "checklist": [
                  {
                        "text": "17:00 — Groom dressed in royal ivory sherwani; safa tied.",
                        "done": false
                  },
                  {
                        "text": "18:00 — Barajatri guests assembled at hotel lobby; floral corsages distributed.",
                        "done": false
                  },
                  {
                        "text": "18:30 — Brass band and dhol begin procession along pre-approved route.",
                        "done": false
                  },
                  {
                        "text": "19:15 — Procession arrives at main gate; cold pyrotechnics ignited safely.",
                        "done": false
                  },
                  {
                        "text": "19:30 — `GATE-02` Barat Handshake triggered at venue entrance.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-006",
                  "AST-006"
            ],
            "gate": null
      },
      {
            "id": "TSK-504",
            "wbs": "6.3.1",
            "stage": "STAGE_04",
            "track": "purohit",
            "title": "Track C — Purohit Vedic Mandap Sanctum & Muhurat Clock",
            "lead": "Chief Vedic Purohit & PER-005",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - 19:30 to 22:30",
            "desc": "Officiate sequential Vedic rites: Baranugam, Kanyadaan, Hastaganthi, Lajahoma, Saptapadi, and Sindoor Daan, keeping strictly within the astrological lagna muhurat.",
            "checklist": [
                  {
                        "text": "19:45 — Groom seated in mandap; preliminary *Varana* puja started.",
                        "done": false
                  },
                  {
                        "text": "20:15 — Bride enters mandap wearing yellow-red *Baula Patani* saree.",
                        "done": false
                  },
                  {
                        "text": "20:45 — *Kanyadaan* and *Hastaganthi* sacred water pouring executed.",
                        "done": false
                  },
                  {
                        "text": "21:30 — *Lajahoma* sacred fire offerings and *Saptapadi* seven steps completed.",
                        "done": false
                  },
                  {
                        "text": "22:00 — *Sindoor Daan* and Mangalsutra tied (`AST-003`); `GATE-03` Sanctum Complete.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "RIT-004",
                  "SAM-005"
            ],
            "gate": null
      },
      {
            "id": "TSK-505",
            "wbs": "6.4.1",
            "stage": "STAGE_03",
            "track": "catering",
            "title": "Track D — Dining Pavilion Operations & Feast Flow",
            "lead": "PER-014 (Food Lead) & Catering Captain",
            "priority": "High",
            "status": "Planned",
            "timeTag": "Day 0 - 19:30 to 23:30",
            "desc": "Control dining hall traffic flow, manage live snack stalls during Barat, coordinate seated banana-leaf VIP service for elder relatives, and ensure uninterrupted dessert refills.",
            "checklist": [
                  {
                        "text": "19:00 — Welcome drinks and live Odia street snack counters open.",
                        "done": false
                  },
                  {
                        "text": "20:00 — Main banquet buffet line opens for guests.",
                        "done": false
                  },
                  {
                        "text": "20:30 — VIP seated dining area reserved for Barajatri elder relatives.",
                        "done": false
                  },
                  {
                        "text": "22:00 — Fresh hot batch of *Chhena Poda* & sweets replenished.",
                        "done": false
                  },
                  {
                        "text": "23:30 — Post-wedding mandap dinner packed for couple and immediate family.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-506",
            "wbs": "6.5.1",
            "stage": "STAGE_03",
            "track": "media",
            "title": "Track E — Cinematography, Drone & Macro Shot Execution",
            "lead": "VDR-003 Lead Videographer",
            "priority": "High",
            "status": "Planned",
            "timeTag": "Day 0 - 15:00 to 23:00",
            "desc": "Execute the pre-approved cinematic shot wishlist, capturing emotional Kanyadaan tears, Saptapadi macro footwork, aerial drone entrance, and steady live stream transmission.",
            "checklist": [
                  {
                        "text": "YouTube live stream broadcast link tested and shared with overseas relatives.",
                        "done": false
                  },
                  {
                        "text": "Aerial drone flight captures Barat procession and full venue illuminations.",
                        "done": false
                  },
                  {
                        "text": "Gimbal operator captures 360-degree bridal mandap entry walk.",
                        "done": false
                  },
                  {
                        "text": "Macro prime lens captures exact millisecond of *Sindoor Daan*.",
                        "done": false
                  },
                  {
                        "text": "Hard disk backup of all memory cards initiated at end-of-night.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-003"
            ],
            "gate": null
      },
      {
            "id": "TSK-507",
            "wbs": "6.6.1",
            "stage": "STAGE_03",
            "track": "fleet",
            "title": "Track F — Shagun Safe Custody, Cash Logistics & Gold Handover",
            "lead": "PER-007 (Custody Lead) & Family Treasurer",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day 0 - 18:00 to 24:00",
            "desc": "Maintain physical custody of the master Shagun gift safe box, distribute cash tips to band/drivers, and transfer precious jewellery back into locked safe following mandap completion.",
            "checklist": [
                  {
                        "text": "Dual-custodian lockbox established in Bride green room.",
                        "done": false
                  },
                  {
                        "text": "Shagun gift envelopes logged and deposited into locked drop-box.",
                        "done": false
                  },
                  {
                        "text": "Pre-counted cash tip envelopes (Driver, Band, MUA assistant) disbursed.",
                        "done": false
                  },
                  {
                        "text": "Mandap jewellery items verified against inventory and locked in safe.",
                        "done": false
                  },
                  {
                        "text": "`GATE-04` Departure Handshake signed off for convoy transit.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-601",
            "wbs": "1.5.1",
            "stage": "STAGE_05",
            "track": "fleet",
            "title": "Marriage Registration (Hindu Marriage Act / Special Marriage Act)",
            "lead": "Sree & Krushna",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "Day +1 to Day +30",
            "desc": "Collect ID/age/address proofs for both parties, book the sub-registrar appointment, arrange 2 witnesses, and file for the marriage certificate after `RIT-007` (Saptapadi) is complete.",
            "checklist": [
                  {
                        "text": "Aadhaar, PAN, birth/age proof, and passport-size photos ready for both parties.",
                        "done": false
                  },
                  {
                        "text": "2 witnesses (with ID proof) confirmed and briefed on registrar appointment date.",
                        "done": false
                  },
                  {
                        "text": "Sub-registrar / Tahsildar office appointment booked (online or in-person).",
                        "done": false
                  },
                  {
                        "text": "Marriage certificate application filed within statutory window post-ceremony.",
                        "done": false
                  },
                  {
                        "text": "Certified copy of marriage certificate collected and archived.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "PER-001",
                  "PER-002",
                  "EVT-004"
            ],
            "gate": null
      },
      {
            "id": "TSK-602",
            "wbs": "1.5.2",
            "stage": "STAGE_06",
            "track": "fleet",
            "title": "Post-Marriage Document & Name-Change Updates",
            "lead": "Sree (Bride)",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "Day +7 to Day +30",
            "desc": "Where a name/address change is elected post-wedding, update passport, bank KYC, Aadhaar, and PAN records using the registered marriage certificate as supporting proof.",
            "checklist": [
                  {
                        "text": "Passport re-issuance / name-change application filed (if applicable).",
                        "done": false
                  },
                  {
                        "text": "Bank account KYC & joint-account paperwork updated.",
                        "done": false
                  },
                  {
                        "text": "Aadhaar address/name update submitted.",
                        "done": false
                  },
                  {
                        "text": "Employer HR & insurance nominee records updated.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "PER-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-603",
            "wbs": "1.5.3",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Vendor Contract & Invoice Compliance",
            "lead": "Sree & Krushna",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-90) to Phase 6 (Day +5",
            "desc": "Ensure every signed vendor contract (`CTR-###`) has a countersigned copy on file, GST-compliant invoices for payments above the statutory threshold, and security-deposit receipts retained for post-event refund claims.",
            "checklist": [
                  {
                        "text": "All `CTR-",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "CTR-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-604",
            "wbs": "1.5.4",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Venue & Event Permits",
            "lead": "PER-014 (Operations Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-30) to Phase 4 (T-7",
            "desc": "Secure fire-safety NOC, late-night sound/noise permission, and (if the Barajatri procession uses a public road) local police route permission.",
            "checklist": [
                  {
                        "text": "Venue fire-safety NOC on file.",
                        "done": false
                  },
                  {
                        "text": "Local noise/sound permission obtained for DJ/pyrotechnics beyond cutoff hours.",
                        "done": false
                  },
                  {
                        "text": "Police permission secured for Barajatri procession on public roads, if applicable.",
                        "done": false
                  },
                  {
                        "text": "Parking/traffic clearance confirmed with venue management.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VEN-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-605",
            "wbs": "1.5.5",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Event & Asset Insurance",
            "lead": "Sree & Krushna",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-90",
            "desc": "Evaluate and (if elected) purchase event-cancellation insurance and in-transit/jewellery coverage for the gold vault items (`AST-001..006`) during the wedding day custody window.",
            "checklist": [
                  {
                        "text": "Event cancellation/liability insurance policy reviewed and decision recorded (`DEC-",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "AST-001",
                  "CTR-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-701",
            "wbs": "3.8.1",
            "stage": "STAGE_01",
            "track": "bride",
            "title": "Bridal Hair & Makeup Trial Session",
            "lead": "Sree (Bride)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-30",
            "desc": "Full trial run of bridal HD/airbrush makeup and hairstyle with the booked artist, photographed under mandap-equivalent lighting, before the look is locked for the wedding day.",
            "checklist": [
                  {
                        "text": "Trial slot booked with `VDR-005` at least 30 days before `EVT-004`.",
                        "done": false
                  },
                  {
                        "text": "Trial look photographed in daylight and stage-lighting conditions.",
                        "done": false
                  },
                  {
                        "text": "Final look, product list, and touch-up kit sign-off recorded.",
                        "done": false
                  },
                  {
                        "text": "Backup artist/assistant confirmed for wedding-day availability.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-005",
                  "CTR-005"
            ],
            "gate": null
      },
      {
            "id": "TSK-702",
            "wbs": "3.8.2",
            "stage": "STAGE_01",
            "track": "bride",
            "title": "Mehendi Trial & Design Finalization",
            "lead": "Sree (Bride)",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-20",
            "desc": "Review the bridal mehendi artist's design portfolio, finalize the pattern (including groom's name concealment motif), and confirm coverage area and application time for `EVT-002`.",
            "checklist": [
                  {
                        "text": "Design reference finalized with artist ahead of `EVT-002`.",
                        "done": false
                  },
                  {
                        "text": "Coverage area (hands/feet/arms) and estimated application time confirmed.",
                        "done": false
                  },
                  {
                        "text": "Guest mehendi counter capacity (artists/stations) sized to guest count.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-002",
                  "VDR-005"
            ],
            "gate": null
      },
      {
            "id": "TSK-703",
            "wbs": "3.8.3",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Sangeet Choreography Rehearsals",
            "lead": "PER-008 / Family Performance Leads",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-45) to Phase 4 (T-5",
            "desc": "Schedule and track rehearsal sessions for family performance acts at the Sangeet, finalize the song/performance running order, and confirm the emcee/anchor script.",
            "checklist": [
                  {
                        "text": "Performance lineup and running order finalized.",
                        "done": false
                  },
                  {
                        "text": "Minimum 2 rehearsal sessions completed per performing group.",
                        "done": false
                  },
                  {
                        "text": "Emcee/anchor briefed with final script and cue sheet.",
                        "done": false
                  },
                  {
                        "text": "Music/DJ playlist handed off ahead of `EVT-002`.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "EVT-002"
            ],
            "gate": null
      },
      {
            "id": "TSK-704",
            "wbs": "3.8.4",
            "stage": "STAGE_01",
            "track": "groom",
            "title": "Attire Fitting & Alteration Rounds",
            "lead": "Sree & Krushna",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-40) to Phase 4 (T-5",
            "desc": "Track the 3-checkpoint fitting cycle (initial measurement, mid alteration, final fit) for bridal and groom wedding-day outfits, separate from the initial procurement covered in `TSK_PACK_04`.",
            "checklist": [
                  {
                        "text": "Checkpoint 1 (T-40): initial measurements and stitching order placed.",
                        "done": false
                  },
                  {
                        "text": "Checkpoint 2 (T-20): mid-alteration fitting completed, adjustments logged.",
                        "done": false
                  },
                  {
                        "text": "Checkpoint 3 (T-5): final fitting signed off, outfit packed and labeled.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-705",
            "wbs": "3.8.5",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "Day-Before Dry Run / Full Rehearsal Walkthrough",
            "lead": "PER-014 (Command Controller)",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-1",
            "desc": "Full walkthrough of the wedding-day run-of-show one day prior — mandap layout, Purohit muhurat cue timing, emcee cues, and each track lead confirming their `TSK_PACK_05` checklist — before the actual `GATE-01` sign-off.",
            "checklist": [
                  {
                        "text": "All 6 track leads present and briefed on their swimlane timing.",
                        "done": false
                  },
                  {
                        "text": "Purohit confirms muhurat clock and ritual sequence cues with emcee.",
                        "done": false
                  },
                  {
                        "text": "Sound/lighting cues walked through at the actual mandap venue.",
                        "done": false
                  },
                  {
                        "text": "Open issues from dry run logged and resolved before `GATE-01`.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-801",
            "wbs": "5.6.1",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Wedding Website & RSVP Portal",
            "lead": "Sree & Krushna",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-90",
            "desc": "Stand up a single wedding website/microsite with event schedule, venue maps, dress code, hotel booking links, and a digital RSVP form that writes back into the master guest register (`PER-###`).",
            "checklist": [
                  {
                        "text": "Website live with schedule, venue, and dress-code info for all `EVT-",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-802",
            "wbs": "5.6.2",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Save-the-Date Dispatch",
            "lead": "Sree & Krushna",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-150",
            "desc": "Send an early digital (and optionally physical) save-the-date to all confirmed family units well ahead of the formal invitation, so outstation/NRI guests can plan travel.",
            "checklist": [
                  {
                        "text": "Save-the-date design finalized (date, city, \"formal invite to follow\").",
                        "done": false
                  },
                  {
                        "text": "Dispatched to all `FAM-",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "PER-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-803",
            "wbs": "5.6.3",
            "stage": "STAGE_01",
            "track": "media",
            "title": "WhatsApp Broadcast Groups & Family Coordinator Channels",
            "lead": "Sree & Krushna",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-90",
            "desc": "Set up a guest-facing broadcast/announcement group for schedule updates, plus a separate coordinator group per side of the family for logistics questions that shouldn't hit the main group.",
            "checklist": [
                  {
                        "text": "Guest broadcast group/list created and tested with a sample announcement.",
                        "done": false
                  },
                  {
                        "text": "Bride-side and groom-side coordinator groups created with track leads added.",
                        "done": false
                  },
                  {
                        "text": "Escalation contact (PER-014) pinned in every group.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "PER-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-804",
            "wbs": "5.6.4",
            "stage": "STAGE_02",
            "track": "media",
            "title": "Digital Itinerary & QR Event Pass",
            "lead": "PER-014 (Hospitality)",
            "priority": "Low",
            "status": "Planned",
            "timeTag": "T-7",
            "desc": "Generate a per-guest digital itinerary/QR pass with event timings and venue map pins, distributed alongside the physical welcome hamper (`TSK-305`).",
            "checklist": [
                  {
                        "text": "QR pass template finalized with per-event map pins.",
                        "done": false
                  },
                  {
                        "text": "Passes generated for all confirmed RSVPs.",
                        "done": false
                  },
                  {
                        "text": "Distribution paired with `TSK-305` welcome hamper delivery.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-805",
            "wbs": "5.6.5",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "Guest Query Helpdesk",
            "lead": "Hospitality Committee",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-3) to Phase 5 (Day 0",
            "desc": "Publish one concierge phone number (staffed T-3 through the wedding day) that guests can call for transport, room, or schedule questions instead of calling the couple's family directly.",
            "checklist": [
                  {
                        "text": "Concierge number published on website, QR pass, and welcome hamper card.",
                        "done": false
                  },
                  {
                        "text": "Staffing roster covers T-3 through Day +1.",
                        "done": false
                  },
                  {
                        "text": "Common FAQ (venue address, dress code, contact) drafted for the staffer.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-901",
            "wbs": "5.7.1",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Outstation & NRI Guest Travel Tracking",
            "lead": "PER-014 (Fleet Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-45) to Phase 4 (T-7",
            "desc": "Maintain a per-family flight/train itinerary tracker for outstation and international guests, feeding the `TSK-304` airport/railway pickup dispatch with confirmed arrival slots.",
            "checklist": [
                  {
                        "text": "Flight/train itinerary collected for every outstation `FAM-",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "PER-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-902",
            "wbs": "5.7.2",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Visa Invitation Letters for International Guests",
            "lead": "Sree & Krushna",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-90",
            "desc": "Draft and issue formal wedding-invitation letters (with venue address and event dates) for any international guests who need one to support a tourist visa application.",
            "checklist": [
                  {
                        "text": "List of guests requiring a visa invitation letter compiled.",
                        "done": false
                  },
                  {
                        "text": "Invitation letter template drafted with venue/date details.",
                        "done": false
                  },
                  {
                        "text": "Letters issued with enough runway before each guest's visa appointment.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "PER-001"
            ],
            "gate": null
      },
      {
            "id": "TSK-903",
            "wbs": "5.7.3",
            "stage": "STAGE_01",
            "track": "catering",
            "title": "Catering Menu Tasting Session",
            "lead": "PER-014 (Food Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-45",
            "desc": "Conduct a formal tasting session with the caterer (`VDR-001`) covering every planned menu item and live counter, ahead of `TSK-202`'s final SLA sign-off.",
            "checklist": [
                  {
                        "text": "Tasting session scheduled with full proposed menu.",
                        "done": false
                  },
                  {
                        "text": "Portion size, spice level, and presentation approved item-by-item.",
                        "done": false
                  },
                  {
                        "text": "Any menu changes fed back into the `CTR-002` SLA before final lock.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-001",
                  "CTR-002"
            ],
            "gate": null
      },
      {
            "id": "TSK-904",
            "wbs": "5.7.4",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Decor & Mandap Mockup Site Visit",
            "lead": "PER-006 / PER-008",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-30",
            "desc": "Walk the actual venue with the decor vendor for a mandap/stage mockup (physical or rendered) before the wedding day, confirming floral scale, color palette, and lighting rig placement.",
            "checklist": [
                  {
                        "text": "Mockup (render or on-site sample) reviewed against `CTR-004` scope.",
                        "done": false
                  },
                  {
                        "text": "Color palette and floral volume confirmed against monogram/theme colors.",
                        "done": false
                  },
                  {
                        "text": "Lighting rig and generator backup placement confirmed on-site.",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-002",
                  "CTR-004"
            ],
            "gate": null
      },
      {
            "id": "TSK-905",
            "wbs": "5.7.5",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "Venue Sound Check & AV Technical Rehearsal",
            "lead": "PER-014",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-7",
            "desc": "Run a technical rehearsal at the actual mandap venue covering Purohit collar mics, PA coverage across the seating area, and DJ/reception sound levels, ahead of `TSK-207`'s final sign-off.",
            "checklist": [
                  {
                        "text": "Purohit collar mic tested for mandap-area coverage.",
                        "done": false
                  },
                  {
                        "text": "PA system tested for audibility at furthest guest seating row.",
                        "done": false
                  },
                  {
                        "text": "Reception DJ sound levels tested against venue noise-permission limits (`TSK-604`).",
                        "done": false
                  }
            ],
            "linkedEntities": [
                  "VDR-007",
                  "CTR-007"
            ],
            "gate": null
      },
      {
            "id": "TSK-1001",
            "wbs": "4.6.1",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Sree & Krushna Royal Monogram Crest Finalization",
            "lead": "Sree & Krushna",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-90 Days",
            "desc": "Finalize the vector artwork for the interlocking `S × K` monogram with the sacred Kalinga arch crest, typography pairings (*Cinzel* & *Playfair Display*), and export high-res vector formats (SVG, PDF, PNG, AI).",
            "checklist": [
                  {
                        "text": "Vector monogram variations (Full Crest, Compact Monogram, Watermark) approved.",
                        "done": false
                  },
                  {
                        "text": "Color palette tokens verified against sacred temple gold and crimson silk standards.",
                        "done": false
                  },
                  {
                        "text": "High-resolution vector exports delivered to printers, video editors, and decor teams.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1002",
            "wbs": "5.2.2",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Physical Luxury Box Invitation Card Production",
            "lead": "Sree & Krushna / Parents Council",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-45 Days",
            "desc": "Print and assemble 250 rigid velvet-wrapped luxury invitation boxes with 5 gold-foiled handmade cotton leaf inserts, velvet pouches with *Pana Gua*, and *Khaja* sweet boxes.",
            "checklist": [
                  {
                        "text": "Physical proof sample inspected for 24K gold foil stamping crispness.",
                        "done": false
                  },
                  {
                        "text": "250 handcrafted velvet rigid boxes manufactured.",
                        "done": false
                  },
                  {
                        "text": "Consecrated whole betel nuts (*Puri Pana Gua*) packed in velvet pouches.",
                        "done": false
                  },
                  {
                        "text": "Freshly packed pure ghee *Khaja* boxes sealed into bottom trays.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1003",
            "wbs": "5.2.3",
            "stage": "STAGE_01",
            "track": "media",
            "title": "45-Second Animated WhatsApp Video Invite Master",
            "lead": "Media & Tech Lead",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-75 Days",
            "desc": "Produce a 45-second cinematic 4K motion graphics video invitation with authentic Odissi flute and Shehnai soundtrack, formatted in both Vertical 9:16 (WhatsApp Status/Reels) and Horizontal 16:9 (TV/Web).",
            "checklist": [
                  {
                        "text": "Storyboard approved (Sacred Invocation $\\rightarrow$ Couple Portrait $\\rightarrow$ Timeline $\\rightarrow$ Venue).",
                        "done": false
                  },
                  {
                        "text": "Custom bansuri/shehnai audio master synced with title reveals.",
                        "done": false
                  },
                  {
                        "text": "Dual-format renders (9:16 and 16:9) compressed under 16 MB for seamless WhatsApp streaming.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1004",
            "wbs": "4.6.2",
            "stage": "STAGE_01",
            "track": "bride",
            "title": "Antique Gold Wax Seal Stamp & Custom Die Tooling",
            "lead": "Sree (Bride)",
            "priority": "Medium",
            "status": "Planned",
            "timeTag": "T-60 Days",
            "desc": "Manufacture 30mm solid brass wax seal stamp head with 3D CNC relief of the `SK` crest and formulate 400 flexible metallic antique gold wax seals for invitation envelopes.",
            "checklist": [
                  {
                        "text": "30mm brass stamp head engraved and tested on cotton parchment.",
                        "done": false
                  },
                  {
                        "text": "Flexible metallic gold wax formulation tested against postal bending.",
                        "done": false
                  },
                  {
                        "text": "400 wax seal seals cast, quality-inspected, and backed with adhesive tabs.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1005",
            "wbs": "5.6.6",
            "stage": "STAGE_01",
            "track": "media",
            "title": "Personalized QR Event Pass & Digital RSVP Web Launch",
            "lead": "Sree & Krushna / Operations Lead",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-40 Days",
            "desc": "Deploy digital web invitation portal with interactive countdown ticker, Google Maps directions, RSVP capture form, and personalized QR code event passes for guests.",
            "checklist": [
                  {
                        "text": "Digital landing page responsive layout tested down to 300px mobile viewport.",
                        "done": false
                  },
                  {
                        "text": "RSVP form integrated with Google Sheets / Firestore directory sync.",
                        "done": false
                  },
                  {
                        "text": "Unique QR pass generator tested for venue check-in scanning.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1101",
            "wbs": "4.7.1",
            "stage": "STAGE_01",
            "track": "bride",
            "title": "Bridal Handloom Silk & Baula Patani Procurement",
            "lead": "Sree (Bride) & PER-006 (Bride Mother)",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-75 Days",
            "desc": "Source authentic handloom Sambalpuri bridal red silk saree from Bargarh weavers, auspicious yellow-red *Baula Patani* silk from Berhampur, Mehendi lehenga, and Haldi cotton sets.",
            "checklist": [
                  {
                        "text": "Authentic Sambalpuri bridal red silk saree purchased with silk-mark certification.",
                        "done": false
                  },
                  {
                        "text": "Consecrated yellow-red *Baula Patani* silk saree procured for mandap entry.",
                        "done": false
                  },
                  {
                        "text": "Mehendi magenta/violet floral lehenga fitted.",
                        "done": false
                  },
                  {
                        "text": "Haldi marigold yellow Chanderi kurta-skirt set ready.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1102",
            "wbs": "4.7.2",
            "stage": "STAGE_01",
            "track": "groom",
            "title": "Groom Matka Silk Dhoti & Royal Sherwani Tailoring",
            "lead": "Krushna (Groom) & PER-008 (Groom Lead)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-75 Days",
            "desc": "Procure pure unstitched Matka silk yellow Dhoti-Kurta for Vedic mandap rites, tailor royal ivory velvet embroidered Sherwani for the Barat procession, and fit Italian wool reception tuxedo.",
            "checklist": [
                  {
                        "text": "Pure Matka silk Dhoti-Kurta set purchased.",
                        "done": false
                  },
                  {
                        "text": "Royal ivory velvet Sherwani altered and trial fitted.",
                        "done": false
                  },
                  {
                        "text": "Royal burgundy safa fitted with antique gold *Kalgi* broach.",
                        "done": false
                  },
                  {
                        "text": "Handcrafted embroidered leather juttis and Italian oxford shoes purchased.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1103",
            "wbs": "4.7.3",
            "stage": "STAGE_01",
            "track": "fleet",
            "title": "Extended Family & Relative Gifting Suite (*Bhaar*)",
            "lead": "Parents Council (PER-005 & PER-007)",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-45 Days",
            "desc": "Procure 25 handloom Sambalpuri sarees for mothers and elder aunts, 25 cotton-silk Kurta-Pajama sets for fathers and uncles, and coordinated pastel kurta-bundi sets for groomsmen.",
            "checklist": [
                  {
                        "text": "18 of 25 Sambalpuri silk sarees procured and gift-wrapped.",
                        "done": false
                  },
                  {
                        "text": "20 of 25 Men’s Kurta-Pajama sets procured with matching stoles.",
                        "done": false
                  },
                  {
                        "text": "15 Groomsmen pastel kurta sets ordered with custom sizing.",
                        "done": false
                  },
                  {
                        "text": "Relative names and family units mapped to each gift parcel.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1104",
            "wbs": "4.7.4",
            "stage": "STAGE_02",
            "track": "purohit",
            "title": "Sacred Liturgical Samagri Shopping & Puri Sanctum Sourcing",
            "lead": "PER-005 / Chief Vedic Purohit",
            "priority": "Critical",
            "status": "Planned",
            "timeTag": "T-10 Days",
            "desc": "Source all specialized liturgical items: consecrated betel nuts from Puri, pure desi cow ghee, dry sacred mango wood (*Samidha*), brass *Ghatas*, *Kusha* grass, and pure vermilion.",
            "checklist": [
                  {
                        "text": "50 Consecrated betel nuts (*Puri Pana Gua*) and *Nirmalya* sourced from Puri temple.",
                        "done": false
                  },
                  {
                        "text": "5 kg Dry sacred *Samidha* wood for Yajna kunda procured.",
                        "done": false
                  },
                  {
                        "text": "5 kg Pure organic Vedic cow ghee purchased and stored in brass canister.",
                        "done": false
                  },
                  {
                        "text": "Fresh *Kusha* grass and mango leaves scheduled for morning pickup on T-2 days.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      },
      {
            "id": "TSK-1105",
            "wbs": "4.7.5",
            "stage": "STAGE_02",
            "track": "fleet",
            "title": "Shagun Cash Envelopes & Astamangala Gift Bhaar Assembly",
            "lead": "Family Treasurer & Parents Council",
            "priority": "High",
            "status": "Planned",
            "timeTag": "T-5 Days",
            "desc": "Pack 200 custom foil-stamped Shagun cash envelopes with crisp new currency notes, and assemble 8 traditional bell-metal Astamangala gift hampers.",
            "checklist": [
                  {
                        "text": "200 Foil-stamped Shagun envelopes stuffed with new currency notes (₹500 / ₹2000 denominations).",
                        "done": false
                  },
                  {
                        "text": "8 Traditional bell-metal (*Kansa Thali*) Astamangala hampers packed with sarees, sweets, and dry fruits.",
                        "done": false
                  },
                  {
                        "text": "Safe storage of all Shagun boxes confirmed in Bride Green Room locked box.",
                        "done": false
                  }
            ],
            "linkedEntities": [],
            "gate": null
      }
]
  };
});
