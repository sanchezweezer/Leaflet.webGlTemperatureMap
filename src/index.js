import L from 'leaflet';
import TemperatureMapIdw from './temperature-map-idw';

L.CanvasLayer = L.Layer.extend({
  // -- initialized is called on prototype
  initialize: function(options) {
    this._map = null;
    this._canvas = null;
    this._frame = null;
    this._delegate = null;
    L.setOptions(this, options);
  },

  delegate: function(del) {
    this._delegate = del;
    return this;
  },

  needRedraw: function() {
    if (!this._frame) {
      this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
    }
    return this;
  },

  // -------------------------------------------------------------
  setPoints: function(points = []) {
    if (this.tempMap && this._map) {
      this.offsetState = this._map.containerPointToLatLng([0, 0]);
      this.zoomState = this._map.getZoom();
      this.tempMap.set_points(points);

      this.needRedraw();
    }
  },

  // -------------------------------------------------------------
  _onLayerDidResize: function(resizeEvent) {
    this._canvas.width = resizeEvent.newSize.x;
    this._canvas.height = resizeEvent.newSize.y;
  },
  // -------------------------------------------------------------
  _onLayerDidMove: function() {
    let topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    this.drawLayer();
  },
  // -------------------------------------------------------------
  getEvents: function() {
    let events = {
      resize: this._onLayerDidResize,
      moveend: this._onLayerDidMove
    };
    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      events.zoomanim = this._animateZoom;
    }

    return events;
  },
  // -------------------------------------------------------------
  onAdd: function(map) {
    this._map = map;
    this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
    this.tiles = {};

    let size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;

    let animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    map._panes.overlayPane.appendChild(this._canvas);

    map.on(this.getEvents(), this);

    this.tempMap = new TemperatureMapIdw({ canvas: this._canvas, debug_points: false });

    let del = this._delegate || this;
    del.onLayerDidMount && del.onLayerDidMount(); // -- callback

    this.needRedraw();
  },

  // -------------------------------------------------------------
  onRemove: function(map) {
    let del = this._delegate || this;
    del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback

    map.getPanes().overlayPane.removeChild(this._canvas);

    map.off(this.getEvents(), this);

    this._canvas = null;
  },

  // ------------------------------------------------------------
  addTo: function(map) {
    map.addLayer(this);
    return this;
  },
  // --------------------------------------------------------------------------------
  LatLonToMercator: function(latlon) {
    return {
      x: (latlon.lng * 6378137 * Math.PI) / 180,
      y: Math.log(Math.tan(((90 + latlon.lat) * Math.PI) / 360)) * 6378137
    };
  },

  // ------------------------------------------------------------------------------
  drawLayer: function() {
    // -- todo make the viewInfo properties  flat objects.
    let size = this._map.getSize();
    let bounds = this._map.getBounds();
    let zoom = this._map.getZoom();

    let center = this.LatLonToMercator(this._map.getCenter());
    let corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

    let del = this._delegate || this;

    if (this.offsetState && this.zoomState) {
      const params = {};
      params.scale = this._map.getZoomScale(zoom, this.zoomState);
      const oldOffset = this._map.latLngToLayerPoint(this.offsetState);
      const offset = this._map.containerPointToLayerPoint([0, 0]);
      params.transform = [offset.x - oldOffset.x, offset.y - oldOffset.y];

      this.tempMap && this.tempMap.draw(params);
    }

    del.onDrawLayer &&
      del.onDrawLayer({
        layer: this,
        canvas: this._canvas,
        bounds: bounds,
        size: size,
        zoom: zoom,
        center: center,
        ce: this._map.getCenter(),
        ce_b: bounds.getCenter(),
        corner: corner
      });

    this._frame = null;
  },

  // ------------------------------------------------------------------------------
  _animateZoom: function(e) {
    let scale = this._map.getZoomScale(e.zoom);
    let offset = this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), e.zoom, e.center);

    L.DomUtil.setTransform(this._canvas, offset, scale);
  }
});

L.canvasLayer = function() {
  return new L.CanvasLayer();
};

export default L.CanvasLayer;
