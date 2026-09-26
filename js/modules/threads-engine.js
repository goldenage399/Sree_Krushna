/**
 * Sree Krushna Marriage OS — Workstream Decision Journeys (Pull-a-Thread)
 * Module: js/modules/threads-engine.js
 */
(function(window) {
  'use strict';

  let selectedThreadId = 'THREAD_PHOTO';

  const WORKSTREAM_THREADS = [
    {
      id: 'THREAD_PHOTO',
      title: '📸 Photography, Cinematography & Video Journey',
      owner: 'Media Team (Debashis & Rayagada Crew)',
      desc: 'Complete journey from 36-question SLA and drone permissions to pre-wedding shoots, 2-camera sanctum recording, and 4TB raw archive handover.',
      steps: [
        {
          stepNum: 1,
          horizon: 'TODAY (T-180)',
          title: '36-Question SLA Contract & Mandap Sanctum Clearance',
          deliverable: 'Signed Photographer SLA (CTR-001)',
          isToday: true,
          status: 'READY',
          ctaLabel: 'Submit Photographer Change Request',
          ctaDomain: 'VENDORS',
          ctaNotes: 'Propose wedding photographer shortlist and 36-question SLA draft.'
        },
        {
          stepNum: 2,
          horizon: 'T-120',
          title: 'Pre-Wedding Shoot Location Permits & Shot-List Approval',
          deliverable: 'Approved Shot-list & Forest/Heritage Permits',
          status: 'READY',
          ctaLabel: 'Submit Pre-Wedding Location Plan',
          ctaDomain: 'VISION',
          ctaNotes: 'Propose shoot locations around Rayagada and Puri beach.'
        },
        {
          stepNum: 3,
          horizon: 'T-60',
          title: 'Rayagada Pre-Wedding Shoot Execution & 48h Teaser Cut',
          deliverable: 'Teaser Reel (1080x1920) for Family WhatsApp Broadcast',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 4,
          horizon: 'T-14',
          title: 'Equipment & Lapel Mic Audio Sync Test with Sound Vendor',
          deliverable: 'Audio-Visual Sound-check Certification',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 5,
          horizon: 'Day 0 (10 Mar)',
          title: '2-Camera Mandap Recording + Live YouTube Private Stream',
          deliverable: 'Live Wedding Feed & Raw 4K Cards Backup',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 6,
          horizon: 'Day +30',
          title: '4TB Master Hard-Drive Handover & Archival Vault Reseal',
          deliverable: 'Dual Hard-Drive Physical Handover (Bride + Groom Vaults)',
          status: 'LOCKED',
          ctaLabel: null
        }
      ]
    },
    {
      id: 'THREAD_ATTIRE',
      title: '👗 Handloom Trousseau & Bridal Attire Journey',
      owner: 'Bridal Custody Team (Pooja & Shashi Rekha)',
      desc: 'Sourcing authentic Nuapatna Baula Patani silk, Cuttack silver filigree Mukutas, Groom Vedic dhoti, and bridal MUA trial.',
      steps: [
        {
          stepNum: 1,
          horizon: 'TODAY (T-180)',
          title: 'Nuapatna Baula Patani Master Weaver Commission',
          deliverable: 'Weaving Contract & Color Palette Swatches',
          isToday: true,
          status: 'DONE',
          ctaLabel: 'Submit Attire Change Request',
          ctaDomain: 'VISION',
          ctaNotes: 'Bridal Saree color scheme adjustment or blouse embroidery draft.'
        },
        {
          stepNum: 2,
          horizon: 'T-120',
          title: 'Groom Vedic Silk Dhoti & Uttariya Custom Dyeing',
          deliverable: 'Groom Attire Package (Nuapatna Handloom)',
          status: 'READY',
          ctaLabel: 'Propose Groom Attire Specs',
          ctaDomain: 'VISION',
          ctaNotes: 'Groom silk dhoti and wedding reception sherwani styling note.'
        },
        {
          stepNum: 3,
          horizon: 'T-60',
          title: 'Cuttack Tarakasi Silver Filigree Mukuta Sizing & Fitting',
          deliverable: 'Custom Fitted Mukutas (Bride + Groom Set)',
          status: 'READY',
          ctaLabel: 'Submit Mukuta Sizing Note',
          ctaDomain: 'RITUALS',
          ctaNotes: 'Head circumference measurements and custom crest inscription.'
        },
        {
          stepNum: 4,
          horizon: 'T-14',
          title: 'Bridal Makeup (MUA) Trial & HD Lookbook Signoff',
          deliverable: 'MUA Signed Lookbook & Timing Schedule',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 5,
          horizon: 'Day 0 (04:00)',
          title: 'Bridal Dressing, Alta Application & Mukuta Coronation',
          deliverable: 'Bride Ready for Mandap Entry (06:45 Sharp)',
          status: 'LOCKED',
          ctaLabel: null
        }
      ]
    },
    {
      id: 'THREAD_HOSPITALITY',
      title: '🏛️ Venues, Hospitality & Transport Journey',
      owner: 'Fleet & Venue Security (Kalyan & Transport Leads)',
      desc: 'Venue lease execution, 125kVA power generator SLAs, 70-room hotel blocks, airport transfers, and Rayagada fleet coordination.',
      steps: [
        {
          stepNum: 1,
          horizon: 'TODAY (T-180)',
          title: 'Rayagada & BBSR Mandap Leases & Generator SLA Lock',
          deliverable: 'Executed Venue Agreements with 125kVA Backup Guarantee',
          isToday: true,
          status: 'READY',
          ctaLabel: 'Submit Venue Proposal',
          ctaDomain: 'VENDORS',
          ctaNotes: 'Propose hotel room allocation table or airport shuttle schedule.'
        },
        {
          stepNum: 2,
          horizon: 'T-90',
          title: '70-Room Hotel Block Lock & Room Allocation Matrix',
          deliverable: 'Guest Room Roster & Family Tier Distribution',
          status: 'READY',
          ctaLabel: 'Submit Room Allocation Change',
          ctaDomain: 'GOVERNANCE',
          ctaNotes: 'VIP suite allocations for elderly relatives and purohit quarters.'
        },
        {
          stepNum: 3,
          horizon: 'T-30',
          title: '15-Vehicle Fleet Contract (Rayagada - BBSR Highway)',
          deliverable: 'Driver Roster, Mobile Numbers & Highway Permit Pass',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 4,
          horizon: 'Day -1',
          title: 'Guest Arrival Welcome Desk & VIP Transport Dispatch',
          deliverable: '100% Guest Check-in Confirmation Ledger',
          status: 'LOCKED',
          ctaLabel: null
        }
      ]
    },
    {
      id: 'THREAD_CATERING',
      title: '🍲 Authentic Odia Catering & Mithai Journey',
      owner: 'Catering & Food Security (Debashis & Master Chefs)',
      desc: '21-item traditional Odia feast design, Pahala Rasagola & Nayagarh Chhenapoda batch booking, FSSAI water tests, and live reception banqueting.',
      steps: [
        {
          stepNum: 1,
          horizon: 'TODAY (T-180)',
          title: '21-Item Odia Feast Menu Selection & Live Tasting Audit',
          deliverable: 'Signed Menu Schedule with Dahi Baigana & Kanika Specs',
          isToday: true,
          status: 'READY',
          ctaLabel: 'Submit Catering Proposal',
          ctaDomain: 'VENDORS',
          ctaNotes: 'Propose live counter inclusions (Chhena Jhilli, Dahi Bara Aloo Dum).'
        },
        {
          stepNum: 2,
          horizon: 'T-60',
          title: 'Pahala Rasagola & Nayagarh Chhenapoda Batch Booking',
          deliverable: 'Mithai Advance Order & Batch Freshness Guarantee',
          status: 'READY',
          ctaLabel: 'Submit Mithai Order Note',
          ctaDomain: 'VENDORS',
          ctaNotes: 'Specify count of hot Rasagola earthen handis for reception.'
        },
        {
          stepNum: 3,
          horizon: 'T-14',
          title: 'Kitchen FSSAI Hygiene Audit & RO Water Quality Test',
          deliverable: 'Water Quality & Food Safety Inspection Certificate',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 4,
          horizon: 'Day 0 (09:00)',
          title: 'Vedic Prasada Batch 1 Delivery to Mandap Elders',
          deliverable: '120 Portions Fresh Mandap Prasada',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 5,
          horizon: 'Day 0 (19:30)',
          title: '850-Guest Royal Reception Feast Service',
          deliverable: 'Seamless Buffet & Sit-down Feast Execution',
          status: 'LOCKED',
          ctaLabel: null
        }
      ]
    },
    {
      id: 'THREAD_CUSTODY',
      title: '💍 Precious Gold & Vault Custody Journey',
      owner: 'Governance & Vault Leads (Family Elders Dual-Custody)',
      desc: 'Hallmark photographic ledger, tamper-evident silver strongboxes, dual-signoff vault keys, and mandap jewellery transfer protocol.',
      steps: [
        {
          stepNum: 1,
          horizon: 'TODAY (T-180)',
          title: 'Jewellery Photographic Ledger & BIS Hallmark Cataloguing',
          deliverable: 'Verified Photo Ledger with Weight & Custody ID Tags',
          isToday: true,
          status: 'READY',
          ctaLabel: 'Submit Custody Proposal',
          ctaDomain: 'GOVERNANCE',
          ctaNotes: 'Add new gold heirloom item to dual-custody verification list.'
        },
        {
          stepNum: 2,
          horizon: 'T-30',
          title: 'Tamper-Evident Silver Strongboxes & Dual-Key Assignment',
          deliverable: 'Strongbox Seal Signoff (Key A: Groom Elder / Key B: Bride Elder)',
          status: 'READY',
          ctaLabel: 'Propose Custodian Elders',
          ctaDomain: 'GOVERNANCE',
          ctaNotes: 'Assign primary and secondary key custodians for wedding vault.'
        },
        {
          stepNum: 3,
          horizon: 'Day 0 (07:00)',
          title: 'Mandap Handshake: Dual-Custody Signoff & Jewellery Transfer',
          deliverable: 'Signed Transfer Slip (100% Item Match)',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 4,
          horizon: 'Day +1 (11:00)',
          title: 'Post-Wedding Vault Reseal & Bank Locker Deposit',
          deliverable: 'Bank Safe Deposit Receipt & Reconciled Audit Log',
          status: 'LOCKED',
          ctaLabel: null
        }
      ]
    },
    {
      id: 'THREAD_LITURGY',
      title: '🕉️ Vedic Liturgy & Chief Purohit Journey',
      owner: 'Liturgy Team (Chief Purohit Raghunath Das)',
      desc: '08:00 Lagna lock, Deva Nimantrana at Puri Jagannath, 108 Vedic Samagri trunk packing, Kanyadaan, Hastaganthi, and Saptapadi rites.',
      steps: [
        {
          stepNum: 1,
          horizon: 'TODAY (T-180)',
          title: 'Astrological Lagna Confirmation (10 Mar 2027 08:00)',
          deliverable: 'Signed Kundali & Muhurat Patra',
          isToday: true,
          status: 'DONE',
          ctaLabel: 'Submit Liturgy Proposal',
          ctaDomain: 'RITUALS',
          ctaNotes: 'Suggest custom Gotra chanting or special Vedic mantra inclusion.'
        },
        {
          stepNum: 2,
          horizon: 'T-90',
          title: 'Puri Shri Jagannath Temple Deva Nimantrana Ceremony',
          deliverable: 'Mahaprasad & Betel Nut First Invitation Offering',
          status: 'READY',
          ctaLabel: 'Propose Puri Yatra Date',
          ctaDomain: 'RITUALS',
          ctaNotes: 'Schedule family travel to Puri for Lord Jagannath Deva Nimantrana.'
        },
        {
          stepNum: 3,
          horizon: 'T-14',
          title: '108 Sacred Samagri Trunk Inventory & Ghee Quality Audit',
          deliverable: '100% Verified Samagri Inventory Trunk',
          status: 'LOCKED',
          ctaLabel: null
        },
        {
          stepNum: 4,
          horizon: 'Day 0 (07:30)',
          title: 'Baranugam, Kanyadaan & Hastaganthi Sacred Knot',
          deliverable: 'Vedic Marriage Rites Completion by 09:15',
          status: 'LOCKED',
          ctaLabel: null
        }
      ]
    }
  ];

  function selectDopkosThread(threadId) {
    selectedThreadId = threadId;
    if (window.renderDoPkosStudio) window.renderDoPkosStudio();
  }

  function renderDopkosThreads(container) {
    const thread = WORKSTREAM_THREADS.find(t => t.id === selectedThreadId) || WORKSTREAM_THREADS[0];

    const threadPills = WORKSTREAM_THREADS.map(t => {
      const isSel = t.id === selectedThreadId;
      const border = isSel ? 'border: 1.5px solid var(--gold-bright); background: rgba(245, 197, 24, 0.15); color: var(--gold-bright); font-weight: 700;' : 'border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-muted);';
      return '<button onclick="selectDopkosThread(\'' + t.id + '\')" style="' + border + ' padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.78rem; cursor: pointer; text-align: left; transition: all 0.2s ease;">' +
        '<div>' + t.title + '</div>' +
        '<div style="font-size: 0.68rem; color: var(--text-dim); margin-top: 2px;">' + t.owner + '</div>' +
      '</button>';
    }).join('');

    let stepsHtml = '';
    thread.steps.forEach(s => {
      const isActiveToday = s.isToday;
      const isNextUp = s.status === 'READY' && !s.isToday;

      const badge = isActiveToday 
        ? '<span class="status-badge status-urgent" style="font-size: 0.72rem; animation: pulse 2s infinite;">👉 DO THIS TODAY</span>'
        : (isNextUp ? '<span class="status-badge" style="background: rgba(59, 130, 246, 0.15); color: var(--sapphire-royal); font-size: 0.72rem;">⚪ NEXT UP</span>' : '<span class="status-badge" style="background: var(--bg-surface-elevated); color: var(--text-dim); font-size: 0.72rem;">⚪ FUTURE</span>');

      const cardBorder = isActiveToday 
        ? 'border: 2px solid var(--gold-bright); background: rgba(245, 197, 24, 0.06); box-shadow: 0 0 16px rgba(245, 197, 24, 0.15);' 
        : 'border: 1px solid var(--border-subtle); background: var(--bg-surface);';

      let actionCta = '';
      if (s.ctaLabel) {
        actionCta = '<div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">' +
          '<span style="font-size: 0.76rem; color: var(--text-dim);">Deliverable: <strong>' + s.deliverable + '</strong></span>' +
          '<button class="btn btn-primary" onclick="openUniversalIntakeModal({ domain: \'' + s.ctaDomain + '\', contextLabel: \'' + thread.title + '\', initialNotes: \'' + s.ctaNotes + '\' })" style="font-size: 0.76rem; padding: 5px 14px; background: var(--gold-gradient); color: #080b11; font-weight: 700;">' +
            '⚡ ' + s.ctaLabel + ' →' +
          '</button>' +
        '</div>';
      } else {
        actionCta = '<div style="margin-top: 10px; font-size: 0.76rem; color: var(--text-dim);">' +
          'Deliverable: <strong>' + s.deliverable + '</strong>' +
        '</div>';
      }

      stepsHtml += '<div style="' + cardBorder + ' border-radius: var(--radius-md); padding: 16px;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">' +
          '<div style="display: flex; align-items: center; gap: 8px;">' +
            '<span style="font-family: monospace; font-weight: 800; color: var(--gold-bright); background: rgba(245, 197, 24, 0.1); padding: 2px 8px; border-radius: var(--radius-sm); font-size: 0.8rem;">STEP ' + s.stepNum + ' &bull; ' + s.horizon + '</span>' +
            '<h4 style="margin: 0; font-size: 0.95rem; color: var(--text-main); font-weight: 700;">' + s.title + '</h4>' +
          '</div>' +
          badge +
        '</div>' +
        actionCta +
      '</div>';
    });

    container.innerHTML = '<div style="display: flex; flex-direction: column; gap: 16px;">' +
      '<div style="display: flex; gap: 8px; flex-wrap: wrap; overflow-x: auto; padding-bottom: 4px;">' +
        threadPills +
      '</div>' +
      '<div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">' +
        '<div style="margin-bottom: 16px;">' +
          '<h3 style="margin: 0 0 4px 0; color: var(--gold-bright); font-size: 1.15rem; font-family: var(--font-display);">' + thread.title + '</h3>' +
          '<p style="margin: 0; font-size: 0.82rem; color: var(--text-muted);">' + thread.desc + '</p>' +
          '<div style="margin-top: 6px; font-size: 0.76rem; color: var(--gold-antique); font-weight: 600;">👑 Responsible Lead: ' + thread.owner + '</div>' +
        '</div>' +
        '<div style="display: flex; flex-direction: column; gap: 12px;">' +
          stepsHtml +
        '</div>' +
      '</div>' +
    '</div>';
  }

  window.WORKSTREAM_THREADS = WORKSTREAM_THREADS;
  window.selectDopkosThread = selectDopkosThread;
  window.renderDopkosThreads = renderDopkosThreads;

})(window);
