<template>
  <!-- <div id="map" class="map"></div> -->
  <!-- <div class="coordinate-panel">
    Lat(x) / Lon(y): EPSG:4326
    <div id="mouse-position"></div>
  </div> -->
  <div>
    <button @click="toggleExpand">{{ isExpanded ? 'Collapse' : 'Expand' }}</button>
    <div class="map-container" :class="{ expanded: isExpanded }">
      <!-- Your map content goes here -->
      <div class="column">
        <div class="column-header" @click="toggleColumn">
          <span>{{ isColumnExpanded ? '▼' : '▶' }} Column</span>
        </div>
        <div class="column-content" :class="{ expanded: isColumnExpanded }">
          <label>couche</label>
          <!-- Add more items here as needed -->
        </div>
      </div>
    </div>
  </div>
  
  <!-- <layer-panel :layers="layers" @expand-group="toggleGroupVisibility" @toggle-layer="toggleLayer" @change-opacity="changeOpacity"></layer-panel> -->
  <!-- <address-search @address-selected="handleAddressSelected"></address-search> -->
  <!-- <InteractionBar /> -->
  <!-- <CardInfo/> -->
  <!-- <InfoPanel /> -->
  <!-- <Loader/> -->
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { DragRotateAndZoom, defaults as defaultInteractions} from 'ol/interaction.js';
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { createStringXY } from 'ol/coordinate.js';
import MousePosition from 'ol/control/MousePosition.js';

import LayerPanel from './LayerPanel.vue';
import AddressSearch from './AddressSearch.vue';
import CardInfo from './CardInfo.vue';
import Loader from './Loader.vue';
import InteractionBar from './InteractionBar.vue';
import InfoPanel from './InfoPanel.vue';

import { layers } from '../assets/layers';

export default {
  data() {
    return {
      selectedCoordinates: null,
      map: null,
      mapView: null,
      isExpanded: false,
      isColumnExpanded: true,
      basemaps: [
        { id: 'osm-color', title: 'OSM Color', imageUrl: 'src/assets/ic_default-1x.png' },
        { id: 'osm-bw', title: 'OSM Black and White', imageUrl: 'src/assets/ic_terrain-1x.png' },
        { id: 'satellite', title: 'Satellite', imageUrl: 'src/assets/aerien.jpg' },
        { id: 'ign', title: 'IGN', imageUrl: 'src/assets/ic_traffic-1x.png' },
      ],
      selectedBasemap: 'osm-color',
      layers: [...layers]
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
        interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
        layers: this.layers.map(layer => layer.layer),
        view: this.mapView
      });

      // Set the initial visibility of layers
      this.layers.forEach(layer => {
        layer.layer.setVisible(layer.visible);
      });
    },
    changeBasemap(basemap) {
      // Remove the current basemap layer from the map
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') === 'basemap') {
          this.map.removeLayer(layer);
        }
      });

      // Define a new basemap layer based on the selected basemap
      let basemapLayer;
      switch (basemap.id) {
        case 'osm-color':
          basemapLayer = new TileLayer({
            source: new OSM(),
            name: 'basemap',
          });
          break;
        case 'osm-bw':
          basemapLayer = new TileLayer({
            source: new OSM({ url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png' }),
            name: 'basemap',
          });
          break;
        case 'satellite':
          basemapLayer = new TileLayer({
            source: new XYZ({
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            }),
            name: 'basemap',
          });
          break;
        case 'ign':
          basemapLayer = new TileLayer({
            source: new TileWMS({
              url: 'https://wxs.ign.fr/your-ign-wms-url',
              params: {
                LAYERS: 'your-ign-layer',
                FORMAT: 'image/png',
              },
            }),
            name: 'basemap',
          });
          break;
        default:
          break;
      }

      this.map.getLayers().insertAt(0, basemapLayer);
      this.map.getView().fit(basemapLayer.getSource().getExtent());
      this.selectedBasemap = basemap.id;
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
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    toggleColumn() {
      this.isColumnExpanded = !this.isColumnExpanded;
    },
  },
  components: {
    LayerPanel,
    AddressSearch,
    CardInfo,
    Loader, 
    InfoPanel,
    InteractionBar
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

.map-container {
  display: flex;
  width: 800px; /* Set your desired expanded width */
  height: 600px; /* Set your desired expanded height */
  background-color: lightgray; /* Set your desired background color */
  transition: all 0.3s; /* Add a smooth transition effect */
}

.column {
  width: 200px; /* Set your desired column width */
  background-color: #fff; /* Set your desired column background color */
  border: 1px solid #ddd; /* Add a border for separation */
  overflow: hidden;
}

.column-header {
  background-color: #f0f0f0; /* Set the header background color */
  padding: 8px;
  cursor: pointer;
}

.column-content {
  padding: 8px;
  transition: all 0.3s;
}

.expanded {
  width: 400px; /* Set your desired expanded column width */
}

// .coordinate-panel {
//   display: flex;
//   flex-direction: column;
//   position: fixed;
//   z-index: 3;
//   width: 20vw;
//   height: 3.5vh;
//   background: white;
//   padding: 1.5px 2px 1.5px 2px;
//   border-radius: 5px;
//   left: 23vw;
//   bottom: 0.5vh;
//   box-shadow: 5px 6px 24px -2px rgba(0,0,0,0.3);
//   align-items: left;
//   justify-content: left;
//   font-size: 10px;
//   font-weight: 500;
// }

// .ol-mouse-position {
//     position: none;
//     top: 0;
//     right: 0;
//     margin-top: 10px;
//     display: flex;
//     font-size: 12px;
//     font-weight: 500;
//     padding: 10px;
//   }
</style>