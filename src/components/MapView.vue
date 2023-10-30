<template>
  <!-- <div id="map" class="map"></div> -->
  <!-- <div class="coordinate-panel">
    Lat(x) / Lon(y): EPSG:4326
    <div id="mouse-position"></div>
  </div> -->
  <div class="wrap-collabsible">
    <input id="collapsible" class="toggle" type="checkbox">
    <label for="collapsible" class="lbl-toggle">More Info</label>
    <div class="collapsible-content">
      <div class="content-inner">
        <p>QUnit is by calling one of the object that are embedded in JavaScript, and faster JavaScript program could also used with its elegant, well documented, and functional programming using JS, HTML pages Modernizr is a popular browsers without plug-ins. Test-Driven Development.</p>
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



input[type='checkbox'] { 
  display: none; 
} 
.wrap-collabsible { 
  margin: 1.2rem 0; 
} 
.lbl-toggle { 
  display: block; 
  font-weight: bold; 
  font-family: monospace; 
  font-size: 1.2rem; 
  text-transform: uppercase; 
  text-align: center; 
  padding: 1rem; 
  color: #DDD; 
  background: #0069ff; 
  cursor: pointer; 
  border-radius: 7px; 
  transition: all 0.25s ease-out; 

  &:hover { 
    color: #FFF; 
  } 

  &::before { 
    content: ' '; 
    display: inline-block; 
    border-top: 5px solid transparent; 
    border-bottom: 5px solid transparent; 
    border-left: 5px solid currentColor; 
    vertical-align: middle; 
    margin-right: .7rem; 
    transform: translateY(-2px); 
    transition: transform .2s ease-out; 
  } 
}  
.toggle:checked+.lbl-toggle::before { 
  transform: rotate(90deg) translateX(-3px); 
} 
.collapsible-content { 
  max-height: 0px; 
  overflow: hidden; 
  transition: max-height .25s ease-in-out; 

  p { 
    margin-bottom: 0; 
  }
} 
.toggle:checked + .lbl-toggle + .collapsible-content { 
  max-height: 350px; 
} 
.toggle:checked+.lbl-toggle { 
  border-bottom-right-radius: 0; 
  border-bottom-left-radius: 0; 
} 
.collapsible-content .content-inner { 
  border-bottom-left-radius: 7px; 
  border-bottom-right-radius: 7px; 
  padding: .5rem 1rem; 
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