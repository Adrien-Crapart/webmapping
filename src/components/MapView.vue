<template>
  <div id="map" class="map"></div>
  <div class="coordinate-panel">
    Lat(x) / Lon(y): EPSG:4326
    <div id="mouse-position"></div>
  </div>
  <layer-panel :layers="layers" @toggle-layer="toggleLayer"></layer-panel>
  <BasemapSwitcher :basemaps="basemaps" @toggle-layer="toggleLayer"/>
  <address-search @address-selected="handleAddressSelected"></address-search>
  <InteractionBar />
  <CardInfo/>
  <Loader/>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { DragRotateAndZoom, Link, defaults as defaultInteractions} from 'ol/interaction.js';
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { createStringXY } from 'ol/coordinate.js';
import MousePosition from 'ol/control/MousePosition.js';

import LayerPanel from './LayerPanel.vue';
import AddressSearch from './AddressSearch.vue';
import CardInfo from './CardInfo.vue';
import Loader from './Loader_1.vue';
import InteractionBar from './InteractionBar.vue';
import BasemapSwitcher from './BasemapSwitcher.vue'

import { layers } from '../assets/layers';
import { basemaps } from "../assets/basemaps";

export default {
  data() {
    return {
      selectedCoordinates: null,
      map: null,
      mapView: null,
      layers: [...layers],
      basemaps: [...basemaps]
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {

      this.mapView = new View({
        center: fromLonLat([6.062899, 43.411056]),
        zoom: 13,
        maxZoom: 23,
        minZoom: 10
      });

      this.map = new Map({
        target: 'map',
        controls: defaultControls().extend([
          new ScaleLine({
            units: 'metric',
          }),
          new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
            target: document.getElementById('mouse-position'),
          })
        ]),
        interactions: defaultInteractions().extend([new DragRotateAndZoom(), new Link()]),
        layers: [
          ...this.basemaps.map(basemap => {
            basemap.layer.setZIndex(1);
            return basemap.layer;
          }),
          ...this.layers.map(layer => {
            layer.layer.setZIndex(2);
            return layer.layer;
          })
        ],
        view: this.mapView
      });

      // Set the initial visibility of layers
      this.basemaps.forEach(layer => {
        layer.layer.setVisible(layer.visible);
      });
      this.layers.forEach(layer => {
        layer.layer.setVisible(layer.visible);
      });

      this.map.on('singleclick', function (evt) {
        document.getElementById('info').innerHTML = '';
        const viewResolution = /** @type {number} */ (this.mapView.getResolution());
        const url = wmsSource.getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          'EPSG:3857',
          {'INFO_FORMAT': 'text/html'}
        );
        if (url) {
          fetch(url)
            .then((response) => response.text())
            .then((html) => {
              document.getElementById('info').innerHTML = html;
            });
        }
      });

      this.map.on('pointermove', function (evt) {
        if (evt.dragging) {
          return;
        }
        const data = wmsLayer.getData(evt.pixel);
        const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
        this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });
      
    },
    toggleLayer(layer) {
      layer.layer.setVisible(layer.visible);
    },
    handleAddressSelected(addressInfo) {
      this.selectedCoordinates = addressInfo;  
      this.updateMapView();
    },
    updateMapView() {
      if (this.selectedCoordinates) {  
        this.mapView.setCenter(fromLonLat([this.selectedCoordinates.lon, this.selectedCoordinates.lat]));
        this.mapView.setZoom(this.selectedCoordinates.zoomLevel);
      }
    },
  },
  components: {
    LayerPanel,
    AddressSearch,
    CardInfo,
    Loader, 
    InteractionBar,
    BasemapSwitcher
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
    background: #F8F8F8;
}
body {
   display: flex; 
   justify-content: center;
   align-items: center;
   justify-content: center;
   min-height: 100vh;
}
.map {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;

  &:-webkit-full-screen {
    height: 100%;
    margin: 0;
  }

  &:fullscreen {
    height: 100%;
  }

  .ol-rotate {
    top: 3em;
  }
}
.coordinate-panel {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 3;
  width: 20vw;
  height: 3.5vh;
  background: white;
  padding: 1.5px 2px 1.5px 2px;
  border-radius: 5px;
  left: 23vw;
  bottom: 1vh;
  box-shadow: 5px 6px 24px -2px rgba(0,0,0,0.3);
  align-items: left;
  justify-content: left;
  font-size: 10px;
  font-weight: 500;
}
</style>