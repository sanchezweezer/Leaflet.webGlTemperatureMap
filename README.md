# Leaflet.SmoothPolygons

A simple and fast [Leaflet](http://leafletjs.com) canvas smooth polygons plugin.
Uses [paperJS](http://paperjs.org/) under the hood to draw paths on canvas.

And we support flyTo event =)

## Demo

- [Smooth polygons demo &rarr;](https://sanchezweezer.github.io/Leaflet.SmoothPolygons/docs)

## Basic Usage

```shell script
    npm i --save leaflet.smoothpolygons
```

```js
import L from 'leaflet';
import 'leaflet.smoothpolygons';

const map = L.map(); // creates map

const polygonLayer = L.smoothPolygonsLayer().addTo(map);

const smoothPolygon = polygonLayer.addToScene({
  polygon: {
    data: [
      {
        Value, // Long on which it is necessary to recede from the center
        Direction // Angle from upper border by clock wise
      } // ,...
    ]
  },
  centralPoint: [lat, lng] // L.LanLng
});
```

To include the plugin, just use `leaflet-smooth-poly.js` from the `dist` folder:

```html
<script src="leaflet-smooth-poly.js"></script>
```

## Requirements

- [Leaflet](https://leafletjs.com/) ^1.5.0
- [Leaflet-geometryutil](http://makinacorpus.github.io/Leaflet.GeometryUtil/) ^0.9.1
- [Paper](http://paperjs.org/) ^0.12.3

## Reference

#### L.smoothPolygonsLayer(options)

Return Object of class

You can pass defaults option to all paths that you add.

#### L.smoothPolygonsLayer().addTo(map)

Connect with map and Constructs a canvas for polygons layer on map. All Options

#### Methods

- **setOptions(options)**: Sets new heatmap options and redraws it.
- **addLatLng(latlng)**: Adds a new point to the heatmap and redraws it.
- **setLatLngs(latlngs)**: Resets heatmap data and redraws it.
- **redraw()**: Redraws the heatmap.

## Changelog

#### 1.0.0 &mdash; Dec 30, 2019

- Initial release.

## License

[MIT License](https://github.com/sanchezweezer/Leaflet.SmoothPolygons/blob/master/LICENSE)
