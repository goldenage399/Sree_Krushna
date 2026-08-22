/**
 * Sree Krushna Marriage OS — Universal Intake & Change Request Engine
 * Module: js/modules/intake-engine.js
 */
(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    CHANGE_REQUESTS: 'sree_krushna_change_requests_v1'
  };

  let changeRequestsList = [];
  try {
    changeRequestsList = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANGE_REQUESTS) || '[]');
  } catch (e) {}

  if (!changeRequestsList.length) {
    changeRequestsList = [
      {
        requestId: 'CR-001',
        title: 'Nuapatna Handloom Baula Patani Color Adjustment',
        targetDomain: 'VISION',
        sourceType: 'WEDDING_VISION',
        submitter: 'Bride Lead (Pooja)',
        submittedAt: '2026-08-22T10:00:00Z',
        status: 'PROPOSED',
        payload: {
          rawNotes: 'Add golden zari temple border to Baula Patani weave.'
        }
      },
      {
        requestId: 'CR-002',
        title: 'Include Chhena Jhilli & Dahi Bara Aloo Dum live counters',
        targetDomain: 'VENDORS',
        sourceType: 'VENDOR_NOMINATION',
        submitter: 'Debashis (Groom Side)',
        submittedAt: '2026-08-22T11:30:00Z',
        status: 'PROPOSED',
        payload: {
          rawNotes: 'Authentic Nimapada Chhena Jhilli live frying counter at reception.'
        }
      },
      {
        requestId: 'CR-003',
        title: 'Mandap Sanctum Audio Recording Strict SLA',
        targetDomain: 'RITUALS',
        sourceType: 'LITURGY_FEEDBACK',
        submitter: 'Chief Purohit',
        submittedAt: '2026-08-22T12:15:00Z',
        status: 'PROPOSED',
        payload: {
          rawNotes: 'Wireless lapel mic for Kanyadaan and Hastaganthi sacred mantras.'
        }
      }
    ];
  }

  function getAuthenticatedSubmitterName() {
    if (window.currentUser && window.currentUser.displayName) return window.currentUser.displayName;
    if (window.currentUser && window.currentUser.email) return window.currentUser.email.split('@')[0];
    return 'Council Member';
  }

  function openUniversalIntakeModal(options = {}) {
    const modal = document.getElementById('inspirationModal');
    if (!modal) return;

    const domainSelect = document.getElementById('idea-category');
    const notesInput = document.getElementById('idea-notes');
    const ribbon = document.getElementById('intake-context-ribbon');

    if (domainSelect && options.domain) domainSelect.value = options.domain;
    if (notesInput && options.initialNotes) notesInput.value = options.initialNotes;

    if (ribbon) {
      if (options.contextLabel) {
        ribbon.style.display = 'block';
        ribbon.innerHTML = '<strong>Context:</strong> ' + options.contextLabel;
      } else {
        ribbon.style.display = 'none';
      }
    }

    modal.classList.add('open');
  }

  function openLiturgyNoteModal(ritualId) {
    openUniversalIntakeModal({
      domain: 'RITUALS',
      contextLabel: 'Vedic Liturgy Ritual: ' + ritualId,
      initialNotes: 'Feedback / Vedic Samagri note for ritual ' + ritualId + ': '
    });
  }

  function openVendorNominationModal(vendorType) {
    openUniversalIntakeModal({
      domain: 'VENDORS',
      contextLabel: 'Vendor Nomination: ' + vendorType,
      initialNotes: 'Nominate vendor for ' + vendorType + ' with pricing SLA: '
    });
  }

  function openCustodyProposalModal(itemId) {
    openUniversalIntakeModal({
      domain: 'GOVERNANCE',
      contextLabel: 'Precious Custody Item: ' + itemId,
      initialNotes: 'Propose custody / vault handling rule for ' + itemId + ': '
    });
  }

  function dispatchChangeRequest(request) {
    const crId = 'CR-' + String(changeRequestsList.length + 1).padStart(3, '0');
    const record = {
      requestId: crId,
      title: request.title || 'Untitled Change Request',
      targetDomain: request.targetDomain || 'VISION',
      sourceType: request.sourceType || 'UNIVERSAL_INTAKE',
      submitter: request.submitter || getAuthenticatedSubmitterName(),
      submittedAt: new Date().toISOString(),
      status: 'PROPOSED',
      payload: request.payload || {}
    };

    changeRequestsList.unshift(record);

    try {
      localStorage.setItem(STORAGE_KEYS.CHANGE_REQUESTS, JSON.stringify(changeRequestsList));
    } catch (e) {
      console.warn('Storage sync failed:', e.message);
    }

    renderIntakeLedger();
    showChangeRequestReceipt(record);
    return record;
  }

  function showChangeRequestReceipt(record) {
    const modal = document.getElementById('changeRequestReceiptModal');
    if (!modal) return;

    const elId = document.getElementById('cr-receipt-id');
    const elTitle = document.getElementById('cr-receipt-title');
    const elDomain = document.getElementById('cr-receipt-domain');
    const elSubmitter = document.getElementById('cr-receipt-submitter');

    if (elId) elId.textContent = record.requestId;
    if (elTitle) elTitle.textContent = record.title;
    if (elDomain) elDomain.textContent = record.targetDomain;
    if (elSubmitter) elSubmitter.textContent = record.submitter;

    modal.classList.add('open');
  }

  function closeChangeRequestReceipt() {
    const modal = document.getElementById('changeRequestReceiptModal');
    if (modal) modal.classList.remove('open');
  }

  function openIntakeLedgerModal() {
    renderIntakeLedger();
    const modal = document.getElementById('intakeLedgerModal');
    if (modal) modal.classList.add('open');
  }

  function closeIntakeLedgerModal() {
    const modal = document.getElementById('intakeLedgerModal');
    if (modal) modal.classList.remove('open');
  }

  let intakeDomainFilter = 'ALL';
  let intakeStatusFilter = 'ALL';

  function filterIntakeLedger(type, value) {
    if (type === 'domain') intakeDomainFilter = value;
    if (type === 'status') intakeStatusFilter = value;
    renderIntakeLedger();
  }

  function renderIntakeLedger() {
    const modalTbody = document.getElementById('intake-ledger-tbody');
    const tabTbody = document.getElementById('intake-tab-tbody');
    const countEl = document.getElementById('intake-ledger-count');
    const tabCountEl = document.getElementById('ledger-tab-count');

    let filtered = changeRequestsList.filter(cr => {
      if (intakeDomainFilter !== 'ALL' && cr.targetDomain !== intakeDomainFilter) return false;
      if (intakeStatusFilter !== 'ALL' && cr.status !== intakeStatusFilter) return false;
      return true;
    });

    if (countEl) countEl.textContent = filtered.length;
    if (tabCountEl) tabCountEl.textContent = filtered.length;

    const renderRows = (tbody) => {
      if (!tbody) return;
      tbody.innerHTML = '';

      if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 24px;">No change requests found matching filter criteria.</td></tr>';
        return;
      }

      filtered.forEach(cr => {
        const tr = document.createElement('tr');
        const statusColors = {
          'PROPOSED': 'var(--sapphire-royal)',
          'TRIAGED': 'var(--gold-bright)',
          'APPROVED': 'var(--emerald-royal)',
          'REJECTED': 'var(--crimson-royal)',
          'GRADUATED': 'var(--emerald-royal)'
        };
        const statusColor = statusColors[cr.status] || 'var(--text-dim)';

        let actionBtns = '';
        if (cr.status === 'PROPOSED' || cr.status === 'TRIAGED') {
          actionBtns = '<div style="display: flex; gap: 4px; justify-content: center;">' +
            '<button class="btn btn-primary" onclick="approveChangeRequest(\'' + cr.requestId + '\')" style="font-size: 0.7rem; padding: 2px 8px; background: var(--emerald-royal); border: none; color: #fff; font-weight: 700; border-radius: 3px;">✓ Approve</button>' +
            '<button class="theme-toggle-btn" onclick="rejectChangeRequest(\'' + cr.requestId + '\')" style="font-size: 0.7rem; padding: 2px 8px; color: var(--crimson-royal); border: 1px solid var(--crimson-royal); border-radius: 3px;">✕ Withdraw</button>' +
          '</div>';
        } else if (cr.status === 'APPROVED' || cr.status === 'GRADUATED') {
          actionBtns = '<span style="font-size: 0.72rem; color: var(--emerald-royal); font-weight: 700;">✓ Merged into OS</span>';
        } else {
          actionBtns = '<span style="font-size: 0.72rem; color: var(--text-dim);">Archived</span>';
        }

        tr.innerHTML = '<td><span style="font-family: monospace; font-weight: 800; color: var(--gold-bright); font-size: 0.78rem;">' + cr.requestId + '</span></td>' +
          '<td><span class="role-pill-tag" style="background: var(--bg-surface-elevated); font-size: 0.72rem;">' + cr.targetDomain + '</span></td>' +
          '<td>' +
            '<div style="font-weight: 600; color: var(--text-main); font-size: 0.84rem;">' + cr.title + '</div>' +
            '<div style="font-size: 0.74rem; color: var(--text-dim); margin-top: 2px;">' + (cr.payload ? (cr.payload.rawNotes || '') : '') + '</div>' +
          '</td>' +
          '<td style="font-size: 0.8rem; color: var(--text-muted);">' + cr.submitter + '</td>' +
          '<td style="font-size: 0.75rem; color: var(--text-dim);">' + (cr.submittedAt ? cr.submittedAt.split('T')[0] : '2026-08-22') + '</td>' +
          '<td><span class="status-badge" style="color: ' + statusColor + '; border-color: ' + statusColor + '; font-size: 0.7rem;">' + cr.status + '</span></td>' +
          '<td style="text-align: center;">' + actionBtns + '</td>';
        tbody.appendChild(tr);
      });
    };

    renderRows(modalTbody);
    renderRows(tabTbody);
  }

  function approveChangeRequest(requestId) {
    const cr = changeRequestsList.find(r => r.requestId === requestId);
    if (!cr) return;

    cr.status = 'APPROVED';

    const newTaskId = 'TSK-' + String((window.currentTasks ? window.currentTasks.length : 40) + 1).padStart(3, '0');
    const newTask = {
      id: newTaskId,
      title: cr.title,
      event: cr.targetDomain === 'RITUALS' ? 'VEDIC_MARRIAGE' : (cr.targetDomain === 'VISION' ? 'RAYAGADA_PREWED' : 'ALL_EVENTS'),
      owner: cr.submitter,
      priority: 'MEDIUM',
      status: 'pending',
      wbs: 'WBS-CR.' + cr.requestId.split('-')[1],
      lead_role: cr.targetDomain + ' Council Reviewer',
      lead_phone: '+919437000000',
      time_tag: 'Stage 2 Horizon',
      notes: cr.payload ? (cr.payload.rawNotes || '') : '',
      checklist: [
        'Review graduated change request from ' + cr.submitter,
        'Verify resource allocation and operational signoff',
        'Physical milestone verification on-site'
      ],
      linked_tasks: ['GOV-001']
    };

    if (window.currentTasks) window.currentTasks.unshift(newTask);
    if (window.allTasks) window.allTasks.unshift(newTask);

    try {
      localStorage.setItem('sree_krushna_tasks', JSON.stringify(window.currentTasks || []));
      localStorage.setItem(STORAGE_KEYS.CHANGE_REQUESTS, JSON.stringify(changeRequestsList));
    } catch (e) {
      console.warn('Storage sync failed:', e.message);
    }

    renderIntakeLedger();
    if (window.renderTasks) window.renderTasks();
    if (window.renderCommandCenter) window.renderCommandCenter();
  }

  function rejectChangeRequest(requestId) {
    const cr = changeRequestsList.find(r => r.requestId === requestId);
    if (!cr) return;

    cr.status = 'REJECTED';

    try {
      localStorage.setItem(STORAGE_KEYS.CHANGE_REQUESTS, JSON.stringify(changeRequestsList));
    } catch (e) {
      console.warn('Storage sync failed:', e.message);
    }

    renderIntakeLedger();
    if (window.renderIdeas) window.renderIdeas();
  }

  window.changeRequestsList = changeRequestsList;
  window.getAuthenticatedSubmitterName = getAuthenticatedSubmitterName;
  window.openUniversalIntakeModal = openUniversalIntakeModal;
  window.openLiturgyNoteModal = openLiturgyNoteModal;
  window.openVendorNominationModal = openVendorNominationModal;
  window.openCustodyProposalModal = openCustodyProposalModal;
  window.dispatchChangeRequest = dispatchChangeRequest;
  window.showChangeRequestReceipt = showChangeRequestReceipt;
  window.closeChangeRequestReceipt = closeChangeRequestReceipt;
  window.openIntakeLedgerModal = openIntakeLedgerModal;
  window.closeIntakeLedgerModal = closeIntakeLedgerModal;
  window.filterIntakeLedger = filterIntakeLedger;
  window.renderIntakeLedger = renderIntakeLedger;
  window.approveChangeRequest = approveChangeRequest;
  window.rejectChangeRequest = rejectChangeRequest;

})(window);
