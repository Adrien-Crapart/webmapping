<template>
  <div id="map" class="map"></div>
  <div id="mouse-position">
    <button @click="copyCoordinate">
      <box-icon name='copy'></box-icon>
    </button>
  </div>
  <div id="popup" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content"></div>
  </div>
  <layer-panel :layers="layers" @toggle-layer="toggleLayer"></layer-panel>
  <address-search @address-selected="updateMapLocation"></address-search>
</template>

<script>
import 'boxicons'
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay.js';
import {DragBox, DragRotateAndZoom, Select, Snap, Draw, Modify, defaults as defaultInteractions} from 'ol/interaction.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import {getWidth} from 'ol/extent.js';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import XYZ from 'ol/source/XYZ.js';
import {useGeographic, toLonLat} from 'ol/proj.js';
import { FullScreen, ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { toStringHDMS, createStringXY } from 'ol/coordinate.js';
import MousePosition from 'ol/control/MousePosition.js';

import LayerPanel from './LayerPanel.vue';
import AddressSearch from './AddressSearch.vue';

export default {
  data() {
    return {
      layers: [
        {
          id: 1,
          title: 'OSM',
          visible: true,
          layer: new TileLayer({
            source: new OSM(),
          }),
        },
        {
          id: 2,
          title: 'Parcelles',
          visible: true,
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs.ign.fr/parcellaire/geoportail/r/wms?SERVICE=WMS&VERSION=1.3.0",
              params: { "LAYERS": "CADASTRALPARCELS.PARCELLAIRE_EXPRESS", 'TILED': false },
              serverType: "geoserver",
              visible: true,
              transition: 0
            })
          }),
        },
        // Add more layers as needed
      ],
    };
  },
  mounted() {
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    // Create a map instance
    const map = new Map({
      target: 'map',
      controls: defaultControls().extend([
        new FullScreen(),
        new ScaleLine({
          units: 'metric',
        }),
        new MousePosition({
          coordinateFormat: createStringXY(4),
          projection: 'EPSG:4326',
          className: 'custom-mouse-position',
          target: document.getElementById('mouse-position'),
        })
      ]),
      overlays: [overlay],
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      view: new View({
        center: fromLonLat([6.062899, 43.411056]),
        zoom: 13,
        maxZoom: 23,
        minZoom: 10
      }),
    });

    // Add layers to the map
    this.layers.forEach((layer) => {
      map.addLayer(layer.layer);
    });

    // Copy coordinate function
    this.copyCoordinate = function () {
      const mousePositionElement = document.getElementById('mouse-position');
      const coordinateText = mousePositionElement.textContent;
      const textarea = document.createElement('textarea');
      textarea.value = coordinateText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert(coordinateText);
    };

    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function (evt) {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));

      content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
      overlay.setPosition(coordinate);
    });

  },
  methods: {
    toggleLayer(layer) {
      layer.visible = !layer.visible;
      layer.layer.setVisible(layer.visible);
    },
    updateMapLocation(coordinates) {
      // Update the map's view to display the selected address
      const view = this.map.getView();
      view.setCenter(fromLonLat(coordinates));
      view.setZoom(14); // Adjust the zoom level as needed
    },
  },
  components: {
    LayerPanel,
    AddressSearch,
  },
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    line-height: 1;
}
body {
   display: flex; 
   justify-content: center;
   align-items: center;
   min-height: 100vh;
}
.map {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}
.map:-webkit-full-screen {
  height: 100%;
  margin: 0;
}
.map:fullscreen {
  height: 100%;
}
.map .ol-rotate {
  top: 3em;
}
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;

  &:after,&:before{
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}

#mouse-position {
  display: flex;
  position: fixed;
  z-index: 3;
  padding: 1.5px 2px 1.5px 2px;
  background: white;
  border-radius: 5px;
  left: 20vw;
  bottom: 0.5vh;
  box-shadow: 5px 6px 24px -2px rgba(0,0,0,0.3);
  align-items: center;
  font-size: 10px;

  button {
    background: #dddcdc;
    margin-right: 10px;
  }

  box-icon {
    width: 20px;
    height: 20px;
  }
}
</style>