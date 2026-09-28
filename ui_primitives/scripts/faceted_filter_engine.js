/**
 * Universal Agnostic Faceted Filter Headless Engine (Layer 1)
 * Standard: STD-UI-PRIMITIVE-FACETED-FILTER-001 / AC-DEC-2026-074 / UI-DEC-2026-053
 * Ticket: SK-030
 *
 * Invariants:
 *  - INV-FACET-INTERSECT-001: Active orthogonal dimensions intersect via Boolean AND
 *  - INV-FACET-COUNTS-001: Active selection in dimension A dynamically recalculates counts for dimension B options
 *  - STD-MOD-COMP-001: Modular architecture, zero external dependencies, < 250 lines
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var exportsObj = factory();
    root.skCreateFacetedFilterEngine = exportsObj.skCreateFacetedFilterEngine;
    if (root.skPrimitives) {
      root.skPrimitives.createFacetedFilterEngine = exportsObj.skCreateFacetedFilterEngine;
    }
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Factory to create an isolated Faceted Filter Engine
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

      // Aggregate counts by targetDim value
      for (var j = 0; j < relevantItems.length; j++) {
        var itm = relevantItems[j];
        var itemVal = itm[targetDim];
        if (itemVal !== undefined && itemVal !== null && itemVal !== '') {
          counts[itemVal] = (counts[itemVal] || 0) + 1;
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

  return {
    skCreateFacetedFilterEngine: skCreateFacetedFilterEngine
  };
}));
