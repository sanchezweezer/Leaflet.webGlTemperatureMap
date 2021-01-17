# Leaflet.WebglTemperatureMap

A simple and fast [Leaflet](http://leafletjs.com) Library to draw temperature maps (heat maps) using WebGL in pure Javascript. Except a O(N) pre-process step which is done in Javascipt, all calculations and drawing are done with shaders in WebGL, so it is pretty fast.

Inspired by [temperature-map-gl](https://github.com/ham-systems/temperature-map-gl)

Triangulation of mask powered by [earcut](https://github.com/mapbox/earcut)

In plans rewrite hole package to pixi or three.js (or may be pts) from naked webGL

## Demo

- [Temperature map demo &rarr;](https://sanchezweezer.github.io/Leaflet.webGlTemperatureMap/?isNullColorized=true)
- [Temperature map with transparent background demo &rarr;](https://sanchezweezer.github.io/Leaflet.webGlTemperatureMap/?isNullColorized=false)

## Basic Usage

```shell script
    npm i --save leaflet.webgl-temperature-map
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

points are in this format:

```js
// x, y - can be lat lng (must set second param in setPoints as { isLatLng: true}), or screen coords
const points = [[x0, y0, v0], [x1, y1, v1], ...[xN, yN, vN]];
```

## Requirements

- [Leaflet](https://leafletjs.com/) ^1.5.0
- [Leaflet-geometryutil](http://makinacorpus.github.io/Leaflet.GeometryUtil/) ^0.9.1

## Reference

#### L.webGlTemperatureMapLayer(options)

Return Object of class

#### Options

- All options from Leaflet setOptions
- idwOptions - options to temperature map: {
  - p: 5,
  - canvas: null,
  - zIndex: 10,
  - opacity: 0.35,
  - range_factor: 0.00390625,
  - gamma: 2.2,
  - debug_points: false, // work only for debug - not right position on zoom after move
  - framebuffer_factor: 1,
  - isNullColorized: true, // to transparent background set false
  - point_text:
  ```function(val) {
    let v;
    if (val < 1) v = val.toFixed(2);
    else if (val < 10) v = val.toFixed(1);
    else v = Math.round(val);
    return v;
    }
  ```
  }

#### Methods

- **onAdd(map)**: Sets temperature map to leaflet map.
- **setPoints(points: [x, y, value], options: { isLatLng: false })**: Adds array of points to the temperature map and draws it. X, y - can be lat lng, or screen coords.
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

#### 0.1.0 &mdash; July 05, 2020

- Fix default options

#### 0.1.0 &mdash; July 05, 2020

- Add options to temperature map.
- Add ability to set background transparent
- Add ability to set points as lat,lng or L.Point

#### 0.0.1 &mdash; May 06, 2020

- Initial release.

## License

[MIT License](https://github.com/sanchezweezer/Leaflet.webGlTemperatureMap/blob/master/LICENSE)

### Technical explanation

Values are calculated using 'Inverse Distance Weighting (IDW)' algorithm:

[Wikipedia - Inverse Distance Weighting](https://en.wikipedia.org/wiki/Inverse_distance_weighting)

The rest of the explanation makes sense only in the context of the wikipedia article above...

For every point, we perform a render pass to a texture. Using IDW, we calculate the point "influence" to every fragment using a fragment shader. We store the ui\*wi at the r channel of the texture and w_i at the g channel. Using blending with "accumulator" configuration, we end end up with a texture, where we have the top sum of IDW in r channel, and the bottom sum at the g channel. Since channels WebGL are clamped in [0,1], we multiply both channels with range_factor to avoid clamping.

At last, we perform a last pass where we get the IDW value by reading the calculation texture and do a r/g at every fragment. We then use this value to determine the color of the fragment.
