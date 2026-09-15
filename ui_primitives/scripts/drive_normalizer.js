/**
 * Sree Krushna Marriage OS — Drive Normalizer & Zero-CORS CDN Engine
 * Standard: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-022
 * Adapted from: PIOperationsMgmt_Firebase UniversalViewer & ImageUploadWidget
 * Scope: Extract Google Drive IDs, build high-speed zero-CORS CDN URLs, and manage LRU cache.
 */

(function(global) {
  'use strict';

  // Static LRU Cache for resolved Drive image metadata
  class DriveLRUCache {
    constructor(maxSize = 20) {
      this.maxSize = maxSize;
      this.cache = new Map();
    }

    get(key) {
      if (!this.cache.has(key)) return null;
      const val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
      return val;
    }

    set(key, value) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      } else if (this.cache.size >= this.maxSize) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
      this.cache.set(key, value);
    }

    has(key) {
      return this.cache.has(key);
    }

    clear() {
      this.cache.clear();
    }

    get size() {
      return this.cache.size;
    }
  }

  const driveCache = new DriveLRUCache(20);

  const DriveNormalizer = {
    cache: driveCache,

    /**
     * Regex patterns for Google Drive IDs (sourced from PIO UniversalViewer)
     */
    PATTERNS: [
      /\/file\/d\/([a-zA-Z0-9_-]{25,})/,
      /id=([a-zA-Z0-9_-]{25,})/,
      /\/open\?id=([a-zA-Z0-9_-]{25,})/,
      /drive\.google\.com.*\/([a-zA-Z0-9_-]{25,})/
    ],

    /**
     * Extract Drive File ID from any Google Drive link or return raw ID
     * @param {string} url 
     * @returns {string|null}
     */
    extractDriveId: function(url) {
      if (!url || typeof url !== 'string') return null;
      const trimmed = url.trim();
      if (/^[-\w]{25,}$/.test(trimmed)) return trimmed;

      for (const pattern of this.PATTERNS) {
        const match = trimmed.match(pattern);
        if (match && match[1]) return match[1];
      }
      return null;
    },

    /**
     * Test if a given string or URL is a Google Drive reference
     * @param {string} url 
     * @returns {boolean}
     */
    isDriveUrl: function(url) {
      if (!url || typeof url !== 'string') return false;
      return url.includes('drive.google.com') ||
             url.includes('docs.google.com') ||
             /^[-\w]{25,}$/.test(url.trim());
    },

    /**
     * Tier 1: Official Zero-CORS Google Thumbnail CDN endpoint with arbitrary width
     * @param {string} driveId 
     * @param {number} [width=1200] 
     * @returns {string}
     */
    getThumbnailUrl: function(driveId, width = 1200) {
      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w${width}`;
    },

    /**
     * Tier 2: Direct High-Speed Usercontent CDN failover
     * @param {string} driveId 
     * @returns {string}
     */
    getDirectCdnUrl: function(driveId) {
      return `https://lh3.googleusercontent.com/d/${encodeURIComponent(driveId)}`;
    },

    /**
     * Tier 3: Standard Iframe Preview URL for PDFs or documents
     * @param {string} driveId 
     * @returns {string}
     */
    getPreviewUrl: function(driveId) {
      return `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`;
    },

    /**
     * Direct browser viewing URL (external fallback)
     * @param {string} driveId 
     * @returns {string}
     */
    getViewUrl: function(driveId) {
      return `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/view`;
    },

    /**
     * Resolve any URL into normalized asset descriptor with zero-CORS CDN URLs
     * @param {string} url 
     * @param {Object} [options]
     * @param {number} [options.cardWidth=600]
     * @param {number} [options.zoomWidth=1600]
     * @returns {Object}
     */
    resolveAsset: function(url, options = {}) {
      if (!url) return { isDrive: false, url: '' };

      const cardWidth = options.cardWidth || 600;
      const zoomWidth = options.zoomWidth || 1600;

      const driveId = this.extractDriveId(url);
      if (!driveId) {
        return {
          isDrive: false,
          driveId: null,
          url: url,
          cardThumbnail: url,
          zoomUrl: url
        };
      }

      // Check LRU cache
      const cached = this.cache.get(driveId);
      if (cached) return cached;

      const result = {
        isDrive: true,
        driveId: driveId,
        url: url,
        cardThumbnail: this.getThumbnailUrl(driveId, cardWidth),
        zoomUrl: this.getThumbnailUrl(driveId, zoomWidth),
        cdnUrl: this.getDirectCdnUrl(driveId),
        previewUrl: this.getPreviewUrl(driveId),
        viewUrl: this.getViewUrl(driveId)
      };

      this.cache.set(driveId, result);
      return result;
    }
  };

  global.SKDriveNormalizer = DriveNormalizer;
})(typeof window !== 'undefined' ? window : this);
