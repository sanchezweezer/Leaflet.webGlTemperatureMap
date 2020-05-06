import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import '../src';
import('./config').then((defaultData) => {
  const { arr } = defaultData;

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });

  const startZoom = 16;

  const startPoint = { lat: 55.75, lng: 37.61 };

  const mapOptions = {};
  const tileOptions = {};

  const flyToBtn = document.getElementById('flyTo');
  const addPoly = document.getElementById('addPoly');
  const reset = document.getElementById('reset');

  const map = L.map('map', {
    zoomControl: false,
    ...mapOptions
  }).setView(startPoint, startZoom);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
    id: 'CartoDB.VoyagerLabelsUnder',
    ...tileOptions
  })
    .on('tileerror', (e) => {
      console.error('Tile not load:', e);
    })
    .addTo(map);

  L.control
    .zoom({
      position: 'bottomleft'
    })
    .addTo(map);

  const startFlyPoint = L.marker(startPoint).addTo(map);
  const endFlyPoint = L.marker({ lat: 55.67, lng: 37.72 }).addTo(map);
  const tempMap = L.webGlTemperatureMapLayer().addTo(map);

  tempMap.setPoints(arr);

  let flyPoint = 'start';

  flyToBtn.onclick = function() {
    map.flyTo(flyPoint === 'start' ? endFlyPoint.getLatLng() : startFlyPoint.getLatLng());
    flyPoint = flyPoint === 'start' ? 'end' : 'start';
  };
});
