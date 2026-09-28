/**
 * Universal Column Visibility & Print Data Masking Engine Primitive
 * Standard: STD-TABLE-COL-VIS-001 / INV-TABLE-COL-MASK-001 / STD-TABLE-BUDGET-001
 * Ruling: AC-DEC-2026-076 / UI-DEC-2026-056
 * Modularity: STD-MOD-COMP-001 (<500 lines)
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.skColumnVisibilityEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var registries = {};
  var memoryState = {};

  function getStorage(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      /* ignore storage access issues in restricted iframes */
    }
    return null;
  }

  function setStorage(key, val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {
      /* ignore storage access issues in restricted iframes */
    }
  }

  function removeStorage(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      /* ignore storage access issues in restricted iframes */
    }
  }

  /**
   * Register a table schema with columns, base widths, and role presets
   */
  function registerTable(tableId, config) {
    if (!tableId || !config || !Array.isArray(config.columns)) {
      throw new Error('[skColumnVisibilityEngine] Invalid table registration config for: ' + tableId);
    }
    registries[tableId] = {
      tableId: tableId,
      columns: config.columns,
      presets: config.presets || {},
      tableSelector: config.tableSelector || null
    };
  }

  /**
   * Retrieve registered configuration for a table
   */
  function getTableConfig(tableId) {
    return registries[tableId] || null;
  }

  /**
   * Retrieve active column keys for a table
   */
  function getActiveColumns(tableId) {
    if (memoryState[tableId] && Array.isArray(memoryState[tableId])) {
      return memoryState[tableId].slice();
    }

    var stored = getStorage('sk_col_vis_' + tableId);
    if (stored) {
      try {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryState[tableId] = parsed.slice();
          return memoryState[tableId].slice();
        }
      } catch (e) {
        /* fallback to defaults */
      }
    }

    var cfg = registries[tableId];
    if (cfg && cfg.columns) {
      var defaultCols = cfg.columns
        .filter(function (c) { return c.defaultVisible !== false; })
        .map(function (c) { return c.id; });
      memoryState[tableId] = defaultCols.slice();
      return defaultCols;
    }

    return [];
  }

  /**
   * Set and persist active columns for a table
   */
  function setActiveColumns(tableId, activeKeys) {
    if (!Array.isArray(activeKeys)) return;
    memoryState[tableId] = activeKeys.slice();
    setStorage('sk_col_vis_' + tableId, JSON.stringify(activeKeys));
    return memoryState[tableId].slice();
  }

  /**
   * Apply a role preset (e.g. 'full', 'elder', 'vendor')
   */
  function applyPreset(tableId, presetId) {
    var cfg = registries[tableId];
    if (cfg && cfg.presets && cfg.presets[presetId]) {
      return setActiveColumns(tableId, cfg.presets[presetId]);
    }
    return getActiveColumns(tableId);
  }

  /**
   * Reset in-memory and local storage state for a table
   */
  function resetTableState(tableId) {
    delete memoryState[tableId];
    removeStorage('sk_col_vis_' + tableId);
  }

  /**
   * Mathematically re-budget column widths so remaining columns sum to exactly 100.00%
   * Standard: STD-TABLE-BUDGET-001
   */
  function calculateRebalancedWidths(columns, activeKeys) {
    if (!Array.isArray(columns) || !Array.isArray(activeKeys) || activeKeys.length === 0) {
      return {};
    }

    var activeMap = {};
    activeKeys.forEach(function (k) { activeMap[k] = true; });

    var activeCols = columns.filter(function (col) {
      return activeMap[col.id] === true;
    });

    if (activeCols.length === 0) {
      return {};
    }

    if (activeCols.length === 1) {
      var singleResult = {};
      singleResult[activeCols[0].id] = {
        id: activeCols[0].id,
        percentage: 100.00,
        widthStyle: '100%'
      };
      return singleResult;
    }

    var totalBase = 0;
    activeCols.forEach(function (col) {
      totalBase += (typeof col.baseWidth === 'number' && col.baseWidth > 0) ? col.baseWidth : 10;
    });

    if (totalBase <= 0) totalBase = 1;

    var result = {};
    var runningSum = 0;
    var maxColKey = activeCols[0].id;
    var maxColVal = -1;

    activeCols.forEach(function (col) {
      var base = (typeof col.baseWidth === 'number' && col.baseWidth > 0) ? col.baseWidth : 10;
      var rawPct = (base / totalBase) * 100;
      var rounded = Math.round(rawPct * 100) / 100;
      runningSum += rounded;

      if (rounded > maxColVal) {
        maxColVal = rounded;
        maxColKey = col.id;
      }

      result[col.id] = {
        id: col.id,
        percentage: rounded,
        widthStyle: rounded + '%'
      };
    });

    // Zero-drift correction: adjust rounding residual on largest column
    var residual = Math.round((100.00 - runningSum) * 100) / 100;
    if (residual !== 0 && result[maxColKey]) {
      var corrected = Math.round((result[maxColKey].percentage + residual) * 100) / 100;
      result[maxColKey].percentage = corrected;
      result[maxColKey].widthStyle = corrected + '%';
    }

    return result;
  }

  /**
   * Physically excise unselected columns from table DOM tree for print sandboxes
   * Standard: INV-TABLE-COL-MASK-001 (Confidential Financial & Relationship Data Masking)
   */
  function filterTableDOMForPrint(tableElement, activeKeys, optionalColumns) {
    if (!tableElement || !Array.isArray(activeKeys)) return;

    var activeMap = {};
    activeKeys.forEach(function (k) { activeMap[k] = true; });

    // 1. Locate header cells
    var headerRow = null;
    var thead = tableElement.querySelector ? tableElement.querySelector('thead') : null;
    if (thead && thead.children && thead.children.length > 0) {
      headerRow = thead.children[0];
    } else {
      var allRows = tableElement.querySelectorAll ? tableElement.querySelectorAll('tr') : [];
      if (allRows.length > 0) headerRow = allRows[0];
    }

    if (!headerRow) return;

    var thList = headerRow.querySelectorAll ? headerRow.querySelectorAll('th') : headerRow.children;
    var colMeta = []; // { key, index, thEl }

    for (var i = 0; i < thList.length; i++) {
      var th = thList[i];
      var key = th.getAttribute ? th.getAttribute('data-col-key') : null;
      if (!key && optionalColumns && optionalColumns[i]) {
        key = optionalColumns[i].id;
      }
      colMeta.push({
        key: key || ('col_' + i),
        index: i,
        th: th
      });
    }

    // 2. Determine columns to prune
    var omittedIndices = {};
    var columnsToKeep = [];

    colMeta.forEach(function (meta) {
      if (!activeMap[meta.key]) {
        omittedIndices[meta.index] = true;
      } else {
        columnsToKeep.push(meta);
      }
    });

    // 3. Remove omitted TH elements
    colMeta.forEach(function (meta) {
      if (omittedIndices[meta.index]) {
        if (headerRow.removeChild) {
          headerRow.removeChild(meta.th);
        } else if (meta.th.parentNode && meta.th.parentNode.removeChild) {
          meta.th.parentNode.removeChild(meta.th);
        }
      }
    });

    // 4. Remove corresponding TD elements from all body rows
    var tbody = tableElement.querySelector ? tableElement.querySelector('tbody') : null;
    var bodyRows = [];
    if (tbody && tbody.children) {
      bodyRows = tbody.children;
    } else {
      var trs = tableElement.querySelectorAll ? tableElement.querySelectorAll('tr') : [];
      bodyRows = trs.slice(1);
    }

    for (var r = 0; r < bodyRows.length; r++) {
      var row = bodyRows[r];
      var cells = row.querySelectorAll ? row.querySelectorAll('td') : row.children;
      var cellsToRemove = [];

      for (var c = 0; c < cells.length; c++) {
        var cell = cells[c];
        var cellKey = cell.getAttribute ? cell.getAttribute('data-col-key') : null;
        if (cellKey) {
          if (!activeMap[cellKey]) {
            cellsToRemove.push(cell);
          }
        } else if (omittedIndices[c]) {
          cellsToRemove.push(cell);
        }
      }

      cellsToRemove.forEach(function (cell) {
        if (row.removeChild) {
          row.removeChild(cell);
        } else if (cell.parentNode && cell.parentNode.removeChild) {
          cell.parentNode.removeChild(cell);
        }
      });
    }

    // 5. Apply rebalanced percentage widths to remaining TH elements
    var colsSource = optionalColumns;
    if (!colsSource) {
      colsSource = colMeta.map(function (m) {
        return { id: m.key, baseWidth: 10 };
      });
    }

    var rebalanced = calculateRebalancedWidths(colsSource, activeKeys);
    columnsToKeep.forEach(function (meta) {
      if (rebalanced[meta.key] && meta.th && meta.th.style) {
        meta.th.style.width = rebalanced[meta.key].widthStyle;
      }
    });
  }

  /**
   * Mount and synchronize column selection section in the Pre-Print modal
   * @param {HTMLElement} modalEl - Modal container element containing #skPrintColumnSection
   * @param {string} tableId - Registered table ID
   * @param {Function} [onStateChange] - Optional callback when active columns change
   */
  function mountModalSection(modalEl, tableId, onStateChange) {
    if (!modalEl) return null;
    var section = modalEl.querySelector ? modalEl.querySelector('#skPrintColumnSection') : null;
    if (!section) return null;

    var cfg = getTableConfig(tableId);
    if (!cfg || !Array.isArray(cfg.columns) || cfg.columns.length === 0) {
      section.style.display = 'none';
      return null;
    }

    section.style.display = 'block';

    var container = section.querySelector ? section.querySelector('#skPrintColumnsContainer') : null;
    var presetGroup = section.querySelector ? section.querySelector('#skPrintPresetGroup') : null;
    var activeKeys = getActiveColumns(tableId);
    var activeMap = {};
    activeKeys.forEach(function (k) { activeMap[k] = true; });

    var doc = (modalEl && modalEl.ownerDocument) ? modalEl.ownerDocument : (typeof document !== 'undefined' ? document : null);

    // 1. Populate Checkboxes
    if (container) {
      container.innerHTML = '';
      cfg.columns.forEach(function (col) {
        var isChecked = activeMap[col.id] === true;
        if (doc && doc.createElement) {
          var lbl = doc.createElement('label');
          lbl.className = 'sk-print-col-check';
          lbl.innerHTML = '<input type="checkbox" data-col-id="' + col.id + '"' + (isChecked ? ' checked' : '') + '> ' +
                          '<span>' + (col.label || col.id) + '</span>';
          container.appendChild(lbl);
        }
      });

      // Bind change listeners to checkboxes
      var inputs = container.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', function () {
          var selected = [];
          for (var j = 0; j < inputs.length; j++) {
            if (inputs[j].checked) {
              selected.push(inputs[j].getAttribute('data-col-id'));
            }
          }
          setActiveColumns(tableId, selected);
          syncPresetPillHighlight(presetGroup, cfg, selected);
          if (typeof onStateChange === 'function') onStateChange(selected);
        });
      }
    }

    // 2. Bind Preset Pills
    if (presetGroup) {
      var presetBtns = presetGroup.querySelectorAll('.sk-btn-preset');
      for (var p = 0; p < presetBtns.length; p++) {
        (function (btn) {
          btn.onclick = function () {
            var presetId = btn.getAttribute('data-preset');
            var newKeys = applyPreset(tableId, presetId);
            if (container) {
              var chks = container.querySelectorAll('input[type="checkbox"]');
              for (var c = 0; c < chks.length; c++) {
                var colId = chks[c].getAttribute('data-col-id');
                chks[c].checked = newKeys.indexOf(colId) !== -1;
              }
            }
            syncPresetPillHighlight(presetGroup, cfg, newKeys);
            if (typeof onStateChange === 'function') onStateChange(newKeys);
          };
        })(presetBtns[p]);
      }
      syncPresetPillHighlight(presetGroup, cfg, activeKeys);
    }

    return section;
  }

  function syncPresetPillHighlight(presetGroup, cfg, activeKeys) {
    if (!presetGroup || !cfg || !cfg.presets) return;
    var activeSet = (activeKeys || []).slice().sort().join(',');
    var presetBtns = presetGroup.querySelectorAll('.sk-btn-preset');
    for (var i = 0; i < presetBtns.length; i++) {
      var btn = presetBtns[i];
      var presetId = btn.getAttribute('data-preset');
      var presetCols = (cfg.presets[presetId] || []).slice().sort().join(',');
      if (presetCols && presetCols === activeSet) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    }
  }

  function getSelectedColumnsFromModal(modalEl) {
    if (!modalEl) return null;
    var container = modalEl.querySelector ? modalEl.querySelector('#skPrintColumnsContainer') : null;
    if (!container) return null;
    var inputs = container.querySelectorAll('input[type="checkbox"]:checked');
    var res = [];
    for (var i = 0; i < inputs.length; i++) {
      res.push(inputs[i].getAttribute('data-col-id'));
    }
    return res;
  }

  return {
    registerTable: registerTable,
    getTableConfig: getTableConfig,
    getActiveColumns: getActiveColumns,
    setActiveColumns: setActiveColumns,
    applyPreset: applyPreset,
    resetTableState: resetTableState,
    calculateRebalancedWidths: calculateRebalancedWidths,
    filterTableDOMForPrint: filterTableDOMForPrint,
    mountModalSection: mountModalSection,
    getSelectedColumnsFromModal: getSelectedColumnsFromModal
  };
});
