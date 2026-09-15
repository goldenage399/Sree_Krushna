/**
 * Sree Krushna Marriage OS — Modular Zoom & Pan Engine
 * Standard: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-022
 * Adapted from: PIOperationsMgmt_Firebase UniversalViewer v2.0
 * Scope: High-res fabric & jewelry micro-inspection with mousewheel, drag-to-pan, and mobile pinch-to-zoom.
 */

(function(global) {
  'use strict';

  class ZoomPanEngine {
    constructor(targetElement, options = {}) {
      this.target = typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;
      this.container = this.target ? this.target.parentElement : null;
      
      this.options = Object.assign({
        minScale: 1,
        maxScale: 5,
        step: 0.3,
        onTransformChange: null
      }, options);

      this.scale = 1;
      this.pointX = 0;
      this.pointY = 0;
      this.panning = false;
      this.startX = 0;
      this.startY = 0;

      // Touch pinch state
      this.initialPinchDistance = 0;
      this.initialScaleOnPinch = 1;

      // Bound handlers for cleanup
      this._onMouseDown = this._handleMouseDown.bind(this);
      this._onMouseMove = this._handleMouseMove.bind(this);
      this._onMouseUp = this._handleMouseUp.bind(this);
      this._onWheel = this._handleWheel.bind(this);
      this._onTouchStart = this._handleTouchStart.bind(this);
      this._onTouchMove = this._handleTouchMove.bind(this);
      this._onTouchEnd = this._handleTouchEnd.bind(this);
      this._onKeyDown = this._handleKeyDown.bind(this);

      if (this.target && this.container) {
        this.init();
      }
    }

    init() {
      this.container.style.overflow = 'hidden';
      this.container.style.position = 'relative';
      this.container.style.cursor = 'grab';
      this.target.style.transformOrigin = 'center center';
      this.target.style.transition = 'transform 0.05s ease-out';
      this.target.style.userSelect = 'none';

      // Mouse & Wheel Listeners
      this.container.addEventListener('mousedown', this._onMouseDown);
      window.addEventListener('mousemove', this._onMouseMove);
      window.addEventListener('mouseup', this._onMouseUp);
      this.container.addEventListener('wheel', this._onWheel, { passive: false });

      // Mobile Touch Listeners
      this.container.addEventListener('touchstart', this._onTouchStart, { passive: false });
      this.container.addEventListener('touchmove', this._onTouchMove, { passive: false });
      this.container.addEventListener('touchend', this._onTouchEnd);

      // Keyboard shortcuts
      window.addEventListener('keydown', this._onKeyDown);
      this.updateTransform();
    }

    updateTransform() {
      if (!this.target) return;
      this.target.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
      if (this.container) {
        this.container.style.cursor = this.panning ? 'grabbing' : (this.scale > 1 ? 'grab' : 'default');
      }
      if (typeof this.options.onTransformChange === 'function') {
        this.options.onTransformChange({
          scale: this.scale,
          pointX: this.pointX,
          pointY: this.pointY,
          zoomPercent: Math.round(this.scale * 100)
        });
      }
    }

    zoomIn() {
      this.scale = Math.min(this.options.maxScale, +(this.scale + this.options.step).toFixed(2));
      this.updateTransform();
    }

    zoomOut() {
      this.scale = Math.max(this.options.minScale, +(this.scale - this.options.step).toFixed(2));
      if (this.scale <= 1) {
        this.pointX = 0;
        this.pointY = 0;
      }
      this.updateTransform();
    }

    fit() {
      this.scale = 1;
      this.pointX = 0;
      this.pointY = 0;
      this.updateTransform();
    }

    reset() {
      this.fit();
    }

    _handleMouseDown(e) {
      if (e.button !== 0) return; // Only primary mouse button
      e.preventDefault();
      this.panning = true;
      this.startX = e.clientX - this.pointX;
      this.startY = e.clientY - this.pointY;
      if (this.container) this.container.style.cursor = 'grabbing';
    }

    _handleMouseMove(e) {
      if (!this.panning) return;
      e.preventDefault();
      this.pointX = e.clientX - this.startX;
      this.pointY = e.clientY - this.startY;
      this.updateTransform();
    }

    _handleMouseUp() {
      if (this.panning) {
        this.panning = false;
        if (this.container) this.container.style.cursor = this.scale > 1 ? 'grab' : 'default';
      }
    }

    _handleWheel(e) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? this.options.step : -this.options.step;
      const newScale = Math.min(this.options.maxScale, Math.max(this.options.minScale, +(this.scale + delta).toFixed(2)));
      
      if (newScale <= 1) {
        this.pointX = 0;
        this.pointY = 0;
      }
      this.scale = newScale;
      this.updateTransform();
    }

    _getTouchDistance(touch1, touch2) {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.hypot(dx, dy);
    }

    _handleTouchStart(e) {
      if (e.touches.length === 1) {
        this.panning = true;
        this.startX = e.touches[0].clientX - this.pointX;
        this.startY = e.touches[0].clientY - this.pointY;
      } else if (e.touches.length === 2) {
        this.panning = false;
        this.initialPinchDistance = this._getTouchDistance(e.touches[0], e.touches[1]);
        this.initialScaleOnPinch = this.scale;
      }
    }

    _handleTouchMove(e) {
      if (e.touches.length === 1 && this.panning && this.scale > 1) {
        e.preventDefault();
        this.pointX = e.touches[0].clientX - this.startX;
        this.pointY = e.touches[0].clientY - this.startY;
        this.updateTransform();
      } else if (e.touches.length === 2 && this.initialPinchDistance > 0) {
        e.preventDefault();
        const currentDist = this._getTouchDistance(e.touches[0], e.touches[1]);
        const factor = currentDist / this.initialPinchDistance;
        const newScale = Math.min(this.options.maxScale, Math.max(this.options.minScale, +(this.initialScaleOnPinch * factor).toFixed(2)));
        this.scale = newScale;
        if (this.scale <= 1) {
          this.pointX = 0;
          this.pointY = 0;
        }
        this.updateTransform();
      }
    }

    _handleTouchEnd(e) {
      if (e.touches.length === 0) {
        this.panning = false;
        this.initialPinchDistance = 0;
      }
    }

    _handleKeyDown(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          this.zoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          this.zoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          this.fit();
        }
      } else if ((e.key === 'r' || e.key === 'R') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        this.reset();
      }
    }

    destroy() {
      if (this.container) {
        this.container.removeEventListener('mousedown', this._onMouseDown);
        this.container.removeEventListener('wheel', this._onWheel);
        this.container.removeEventListener('touchstart', this._onTouchStart);
        this.container.removeEventListener('touchmove', this._onTouchMove);
        this.container.removeEventListener('touchend', this._onTouchEnd);
      }
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mouseup', this._onMouseUp);
      window.removeEventListener('keydown', this._onKeyDown);
    }
  }

  global.SKZoomPanEngine = ZoomPanEngine;
})(typeof window !== 'undefined' ? window : this);
