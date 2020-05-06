# Leaflet.WebglTemperatureMap

A simple and fast [Leaflet](http://leafletjs.com) canvas smooth polygons plugin.
Uses [paperJS](http://paperjs.org/) under the hood to draw paths on canvas.

## Demo

- [Smooth polygons demo &rarr;](https://sanchezweezer.github.io/Leaflet.webGlTemperatureMap/)

## Basic Usage

```shell script
    npm i --save leaflet.webgl-temprature-map
```

```js
import L from 'leaflet';
import 'leaflet.webgl-temprature-map';

const map = L.map(); // creates map

const tempMap = L.webGlTemperatureMapLayer().addTo(map);

tempMap.setPoints([
  [2630.0850293955414, 7132.896936250415, 64.16567943765965],
  [4065.465306828053, 600.8491068712285, 41.28007958055719],
  [4559.413280590601, 6877.027363962465, 30.497164030229907]
]);
```

## Requirements

- [Leaflet](https://leafletjs.com/) ^1.5.0
- [Leaflet-geometryutil](http://makinacorpus.github.io/Leaflet.GeometryUtil/) ^0.9.1

## Reference

#### L.webGlTemperatureMapLayer()

Return Object of class

#### Methods

- **onAdd(map)**: Sets temperature map to leaflet map.
- **setPoints(points: [x, y, value])**: Adds array of points to the temperature map and draws it.
- **needRedraw()**: Redraws the temperature map.

#### Callbacks

- **onDrawLayer({
  layer,
  canvas,
  bounds,
  size,
  zoom,
  center,
  ce,
  ce_b,
  corner
  })**: Call when layer did redraw.
- **onLayerWillUnmount()**: Call when layer will unmount.
- **onLayerDidMount()**: Call when layer did mount.

## Changelog

#### 0.0.1 &mdash; May 06, 2020

- Initial release.

## License

[MIT License](https://github.com/sanchezweezer/Leaflet.webGlTemperatureMap/blob/master/LICENSE)
