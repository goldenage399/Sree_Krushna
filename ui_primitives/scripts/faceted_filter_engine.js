/**
 * Universal Agnostic Faceted Filter Headless Engine & UI Toolbar (Layers 1 & 2)
 * Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 / AC-DEC-2026-074 / UI-DEC-2026-053
 * Ticket: SK-030
 *
 * Invariants:
 *  - INV-FACET-INTERSECT-001: Active orthogonal dimensions intersect via Boolean AND
 *  - INV-FACET-COUNTS-001: Active selection in dimension A dynamically recalculates counts for dimension B options
 *  - INV-LIFECYCLE-02: Zero naked DOMContentLoaded listeners
 *  - STD-MOD-COMP-001: Modular architecture, zero external dependencies, < 500 lines
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exportsObj = factory();
    root.skCreateFacetedFilterEngine = exportsObj.skCreateFacetedFilterEngine;
    root.skFacetedToolbar = exportsObj.skFacetedToolbar;
    if (root.skPrimitives) {
      root.skPrimitives.createFacetedFilterEngine = exportsObj.skCreateFacetedFilterEngine;
      root.skPrimitives.facetedToolbar = exportsObj.skFacetedToolbar;
    }
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Factory to create an isolated Faceted Filter Engine (Layer 1)
   * @param {Object} config - Configuration options
   * @param {Object} [config.dimensions] - Dimension schemas { dimName: { default: 'all', predicate: fn } }
   * @param {Function} [config.searchExtractor] - Function taking item and returning searchable string
   * @returns {Object} Engine instance
   */
  function skCreateFacetedFilterEngine(config) {
    config = config || {};
    var dimensionConfigs = config.dimensions || {};
    var searchExtractor = typeof config.searchExtractor === 'function' ? config.searchExtractor : null;

    var activeFacets = {};
    var defaultFacets = {};
    var predicates = {};
    var searchQuery = '';
    var listeners = [];

    // Initialize dimensions
    Object.keys(dimensionConfigs).forEach(function (dimKey) {
      var dConf = dimensionConfigs[dimKey] || {};
      var defVal = dConf.default !== undefined ? dConf.default : 'all';
      defaultFacets[dimKey] = defVal;
      activeFacets[dimKey] = defVal;
      predicates[dimKey] = typeof dConf.predicate === 'function'
        ? dConf.predicate
        : function (item, val) { return val === 'all' || item[dimKey] === val; };
    });

    function notifyListeners() {
      var stateSnapshot = getState();
      for (var i = 0; i < listeners.length; i++) {
        try {
          listeners[i](stateSnapshot);
        } catch (err) {
          console.error('[skFacetedFilterEngine] Listener callback error:', err);
        }
      }
    }

    function setFacet(dim, val, silent) {
      if (activeFacets[dim] === undefined) {
        activeFacets[dim] = val;
        defaultFacets[dim] = 'all';
        predicates[dim] = function (item, v) { return v === 'all' || item[dim] === v; };
      } else {
        activeFacets[dim] = val;
      }
      if (!silent) notifyListeners();
    }

    function getFacet(dim) {
      return activeFacets[dim];
    }

    function setSearchQuery(query, silent) {
      searchQuery = (query || '').trim();
      if (!silent) notifyListeners();
    }

    function getSearchQuery() {
      return searchQuery;
    }

    function matchesSearch(item, query) {
      if (!query) return true;
      var q = query.toLowerCase();
      var text = searchExtractor ? searchExtractor(item) : '';
      if (!text && typeof item === 'object') {
        text = Object.values(item).filter(function (v) { return typeof v === 'string'; }).join(' ');
      }
      return text.toLowerCase().indexOf(q) !== -1;
    }

    function filter(items) {
      if (!Array.isArray(items)) return [];
      var dimKeys = Object.keys(activeFacets);
      var query = searchQuery;

      return items.filter(function (item) {
        if (!matchesSearch(item, query)) return false;

        // Conjunctive Boolean AND across all active dimensions (INV-FACET-INTERSECT-001)
        for (var i = 0; i < dimKeys.length; i++) {
          var dim = dimKeys[i];
          var val = activeFacets[dim];
          var pred = predicates[dim];
          if (pred && !pred(item, val)) {
            return false;
          }
        }
        return true;
      });
    }

    /**
     * Compute dynamic counts for targetDim given other active facets
     * INV-FACET-COUNTS-001: Isolates targetDim while applying other facets + search
     */
    function computeCounts(items, targetDim) {
      var counts = { all: 0 };
      if (!Array.isArray(items)) return counts;

      var dimKeys = Object.keys(activeFacets);
      var query = searchQuery;

      // Filter items matching all active facets EXCEPT targetDim, plus search
      var relevantItems = items.filter(function (item) {
        if (!matchesSearch(item, query)) return false;

        for (var i = 0; i < dimKeys.length; i++) {
          var dim = dimKeys[i];
          if (dim === targetDim) continue; // Skip target dimension!
          var val = activeFacets[dim];
          var pred = predicates[dim];
          if (pred && !pred(item, val)) {
            return false;
          }
        }
        return true;
      });

      counts.all = relevantItems.length;

      var targetConf = dimensionConfigs[targetDim] || {};
      if (typeof targetConf.valueExtractor === 'function') {
        for (var j = 0; j < relevantItems.length; j++) {
          var extractedVal = targetConf.valueExtractor(relevantItems[j]);
          if (extractedVal !== undefined && extractedVal !== null && extractedVal !== '') {
            counts[extractedVal] = (counts[extractedVal] || 0) + 1;
          }
        }
      } else if (Array.isArray(targetConf.options)) {
        var targetPred = predicates[targetDim];
        for (var k = 0; k < targetConf.options.length; k++) {
          var optKey = targetConf.options[k];
          var optId = typeof optKey === 'object' ? optKey.id : optKey;
          if (optId === 'all') continue;
          var matchCount = 0;
          for (var j = 0; j < relevantItems.length; j++) {
            if (targetPred && targetPred(relevantItems[j], optId)) {
              matchCount++;
            }
          }
          counts[optId] = matchCount;
        }
      } else {
        // Aggregate counts by direct property lookup
        for (var j = 0; j < relevantItems.length; j++) {
          var itm = relevantItems[j];
          var itemVal = itm[targetDim];
          if (itemVal !== undefined && itemVal !== null && itemVal !== '') {
            counts[itemVal] = (counts[itemVal] || 0) + 1;
          }
        }
      }

      return counts;
    }

    function reset(silent) {
      Object.keys(defaultFacets).forEach(function (k) {
        activeFacets[k] = defaultFacets[k];
      });
      searchQuery = '';
      if (!silent) notifyListeners();
    }

    function getState() {
      var facetsCopy = {};
      Object.keys(activeFacets).forEach(function (k) {
        facetsCopy[k] = activeFacets[k];
      });
      return {
        facets: facetsCopy,
        search: searchQuery
      };
    }

    function setState(state, silent) {
      if (!state) return;
      if (state.facets && typeof state.facets === 'object') {
        Object.keys(state.facets).forEach(function (k) {
          activeFacets[k] = state.facets[k];
        });
      }
      if (typeof state.search === 'string') {
        searchQuery = state.search.trim();
      }
      if (!silent) notifyListeners();
    }

    function subscribe(listener) {
      if (typeof listener === 'function') {
        listeners.push(listener);
        return function unsubscribe() {
          var idx = listeners.indexOf(listener);
          if (idx !== -1) listeners.splice(idx, 1);
        };
      }
      return function () {};
    }

    function toQueryString() {
      var params = [];
      Object.keys(activeFacets).forEach(function (k) {
        var val = activeFacets[k];
        var def = defaultFacets[k];
        if (val && val !== def && val !== 'all') {
          params.push(encodeURIComponent(k) + '=' + encodeURIComponent(val));
        }
      });
      if (searchQuery) {
        params.push('q=' + encodeURIComponent(searchQuery));
      }
      return params.join('&');
    }

    function fromQueryString(qs, silent) {
      if (!qs) {
        reset(silent);
        return;
      }
      var clean = qs.replace(/^[?#]/, '');
      var pairs = clean.split('&');
      var newFacets = {};
      var newSearch = '';

      pairs.forEach(function (pair) {
        if (!pair) return;
        var parts = pair.split('=');
        var k = decodeURIComponent(parts[0] || '');
        var v = decodeURIComponent(parts[1] || '');
        if (k === 'q') {
          newSearch = v;
        } else if (k) {
          newFacets[k] = v;
        }
      });

      Object.keys(defaultFacets).forEach(function (k) {
        activeFacets[k] = newFacets[k] !== undefined ? newFacets[k] : defaultFacets[k];
      });
      searchQuery = newSearch;

      if (!silent) notifyListeners();
    }

    return {
      setFacet: setFacet,
      getFacet: getFacet,
      setSearchQuery: setSearchQuery,
      getSearchQuery: getSearchQuery,
      filter: filter,
      computeCounts: computeCounts,
      reset: reset,
      getState: getState,
      setState: setState,
      subscribe: subscribe,
      toQueryString: toQueryString,
      fromQueryString: fromQueryString
    };
  }

  /**
   * Agnostic UI Toolbar Mounter (Layer 2)
   * Mounts a 2-tier segmented filter bar into any DOM container
   */
  var skFacetedToolbar = {
    mount: function (container, engine, options, customDoc) {
      var doc = customDoc || (typeof document !== 'undefined' ? document : null);
      if (!container || !engine) {
        console.warn('[skFacetedToolbar] mount failed: container and engine are required');
        return null;
      }
      if (!doc) {
        console.warn('[skFacetedToolbar] mount failed: DOM document is not available');
        return null;
      }

      var rootEl = typeof container === 'string' ? doc.querySelector(container) : container;
      if (!rootEl) {
        console.warn('[skFacetedToolbar] container element not found:', container);
        return null;
      }

      options = options || {};
      var primary = options.primary || {};
      var secondary = options.secondary || {};
      var searchConf = options.search || {};
      var getItems = typeof options.getItems === 'function' ? options.getItems : function () { return []; };
      var onFilterChange = typeof options.onFilterChange === 'function' ? options.onFilterChange : null;

      var primaryDim = primary.dimension || 'direction';
      var primaryOptions = primary.options || [];
      var secondaryDim = secondary.dimension || 'category';
      var secondaryOptions = secondary.options || [];
      var searchPlaceholder = searchConf.placeholder || 'Filter by keyword...';

      // Build Toolbar DOM
      rootEl.innerHTML = '';
      if (!rootEl.classList.contains('sk-facet-toolbar')) {
        rootEl.classList.add('sk-facet-toolbar');
      }
      rootEl.setAttribute('role', 'region');
      rootEl.setAttribute('aria-label', options.ariaLabel || 'Faceted Filters');

      // Tier 1: Primary Dimension Segmented Bar
      var tier1 = doc.createElement('div');
      tier1.className = 'sk-facet-tier sk-facet-tier-primary';
      tier1.setAttribute('role', 'tablist');
      tier1.setAttribute('aria-label', primary.label || 'Primary Filter Dimension');

      primaryOptions.forEach(function (opt) {
        var btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = 'sk-btn sk-facet-pill' + (engine.getFacet(primaryDim) === opt.id ? ' is-active' : '');
        btn.setAttribute('data-facet-dim', primaryDim);
        btn.setAttribute('data-facet-val', opt.id);
        btn.setAttribute('aria-pressed', engine.getFacet(primaryDim) === opt.id ? 'true' : 'false');
        btn.setAttribute('role', 'tab');

        var labelSpan = doc.createElement('span');
        labelSpan.className = 'sk-facet-pill-label';
        labelSpan.innerHTML = (opt.icon ? '<span class="sk-facet-pill-icon" aria-hidden="true">' + opt.icon + '</span> ' : '') + opt.label;

        var badgeSpan = doc.createElement('span');
        badgeSpan.className = 'sk-facet-badge';
        badgeSpan.textContent = '0';

        btn.appendChild(labelSpan);
        btn.appendChild(badgeSpan);

        btn.addEventListener('click', function () {
          engine.setFacet(primaryDim, opt.id);
        });

        tier1.appendChild(btn);
      });

      rootEl.appendChild(tier1);

      // Tier 2: Secondary Dimension Chips + Search Strip
      var tier2 = doc.createElement('div');
      tier2.className = 'sk-facet-tier sk-facet-tier-secondary';

      var chipsScroll = doc.createElement('div');
      chipsScroll.className = 'sk-facet-chips-scroll';
      chipsScroll.setAttribute('role', 'group');
      chipsScroll.setAttribute('aria-label', secondary.label || 'Secondary Sub-Filters');

      secondaryOptions.forEach(function (opt) {
        var btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = 'sk-btn sk-facet-chip' + (engine.getFacet(secondaryDim) === opt.id ? ' is-active' : '');
        btn.setAttribute('data-facet-dim', secondaryDim);
        btn.setAttribute('data-facet-val', opt.id);
        btn.setAttribute('aria-pressed', engine.getFacet(secondaryDim) === opt.id ? 'true' : 'false');

        var labelSpan = doc.createElement('span');
        labelSpan.className = 'sk-facet-chip-label';
        labelSpan.innerHTML = (opt.icon ? '<span class="sk-facet-chip-icon" aria-hidden="true">' + opt.icon + '</span> ' : '') + opt.label;

        var badgeSpan = doc.createElement('span');
        badgeSpan.className = 'sk-facet-badge';
        badgeSpan.textContent = '0';

        btn.appendChild(labelSpan);
        btn.appendChild(badgeSpan);

        btn.addEventListener('click', function () {
          engine.setFacet(secondaryDim, opt.id);
        });

        chipsScroll.appendChild(btn);
      });

      tier2.appendChild(chipsScroll);

      // Search & Reset Wrap
      var searchWrap = doc.createElement('div');
      searchWrap.className = 'sk-facet-search-wrap';

      var inputBox = doc.createElement('div');
      inputBox.className = 'sk-facet-search-input-box';

      var iconSpan = doc.createElement('span');
      iconSpan.className = 'sk-facet-search-icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = '🔍';

      var searchInput = doc.createElement('input');
      searchInput.type = 'search';
      searchInput.className = 'sk-facet-search-input';
      searchInput.placeholder = searchPlaceholder;
      searchInput.setAttribute('aria-label', searchPlaceholder);
      searchInput.value = engine.getSearchQuery() || '';

      searchInput.addEventListener('input', function () {
        engine.setSearchQuery(searchInput.value);
      });

      inputBox.appendChild(iconSpan);
      inputBox.appendChild(searchInput);
      searchWrap.appendChild(inputBox);

      var resetBtn = doc.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'sk-btn sk-btn-secondary sk-facet-reset-btn';
      resetBtn.title = 'Reset all filters';
      resetBtn.setAttribute('aria-label', 'Reset all filters');
      resetBtn.innerHTML = '<span class="sk-facet-reset-icon" aria-hidden="true">↺</span><span class="sk-facet-reset-label">Reset</span>';

      resetBtn.addEventListener('click', function () {
        engine.reset();
      });

      searchWrap.appendChild(resetBtn);
      tier2.appendChild(searchWrap);
      rootEl.appendChild(tier2);

      // Synchronize UI active states & dynamic badges
      function syncUI() {
        var items = getItems();
        var primaryVal = engine.getFacet(primaryDim);
        var secondaryVal = engine.getFacet(secondaryDim);
        var query = engine.getSearchQuery();

        if (searchInput.value !== query) {
          searchInput.value = query;
        }

        // Compute counts (INV-FACET-COUNTS-001)
        var pCounts = engine.computeCounts(items, primaryDim);
        var sCounts = engine.computeCounts(items, secondaryDim);

        // Update Primary Pills
        var pillBtns = tier1.querySelectorAll('.sk-facet-pill');
        for (var i = 0; i < pillBtns.length; i++) {
          var pBtn = pillBtns[i];
          var pVal = pBtn.getAttribute('data-facet-val');
          var pActive = pVal === primaryVal;
          if (pActive) {
            pBtn.classList.add('is-active');
            pBtn.setAttribute('aria-pressed', 'true');
          } else {
            pBtn.classList.remove('is-active');
            pBtn.setAttribute('aria-pressed', 'false');
          }
          var pBadge = pBtn.querySelector('.sk-facet-badge');
          if (pBadge) {
            pBadge.textContent = pCounts[pVal] !== undefined ? pCounts[pVal] : 0;
          }
        }

        // Update Secondary Chips
        var chipBtns = chipsScroll.querySelectorAll('.sk-facet-chip');
        for (var j = 0; j < chipBtns.length; j++) {
          var cBtn = chipBtns[j];
          var cVal = cBtn.getAttribute('data-facet-val');
          var cActive = cVal === secondaryVal;
          if (cActive) {
            cBtn.classList.add('is-active');
            cBtn.setAttribute('aria-pressed', 'true');
          } else {
            cBtn.classList.remove('is-active');
            cBtn.setAttribute('aria-pressed', 'false');
          }
          var cBadge = cBtn.querySelector('.sk-facet-badge');
          if (cBadge) {
            cBadge.textContent = sCounts[cVal] !== undefined ? sCounts[cVal] : 0;
          }
        }

        // Notify consumer with filtered items & state
        if (onFilterChange) {
          var filtered = engine.filter(items);
          onFilterChange(filtered, engine.getState());
        }
      }

      // Initial synchronization
      syncUI();

      // Subscribe to engine changes
      var unsubscribe = engine.subscribe(function () {
        syncUI();
      });

      return {
        updateCounts: syncUI,
        unmount: function () {
          unsubscribe();
          rootEl.innerHTML = '';
        },
        getEngine: function () {
          return engine;
        }
      };
    }
  };

  return {
    skCreateFacetedFilterEngine: skCreateFacetedFilterEngine,
    skFacetedToolbar: skFacetedToolbar
  };
}));
