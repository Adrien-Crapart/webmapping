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
  <layer-panel :layers="layers" @toggle-layer="toggleLayerVisibility" @change-opacity="changeLayerOpacity"></layer-panel>
  <address-search @address-selected="handleAddressSelected"></address-search>
  <BasemapPanel :basemaps="basemaps" :selectedBasemap="selectedBasemap" @basemap-selected="changeBasemap" />
  <CardInfo/>
  <InfoPanel />
  <!-- <Loader/> -->
</template>

<script>
import 'boxicons'
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {DragBox, DragRotateAndZoom, Select, Snap, Draw, Modify, defaults as defaultInteractions} from 'ol/interaction.js';
import {useGeographic, toLonLat} from 'ol/proj.js';
import { FullScreen, ScaleLine, defaults as defaultControls } from 'ol/control.js';
import { toStringHDMS, createStringXY } from 'ol/coordinate.js';
import MousePosition from 'ol/control/MousePosition.js';

import LayerPanel from './LayerPanel.vue';
import AddressSearch from './AddressSearch.vue';
import CardInfo from './CardInfo.vue';
import Loader from './Loader.vue';
import BasemapPanel from './BasemapPanel.vue';
import InfoPanel from './InfoPanel.vue';

export default {
  data() {
    return {
      selectedCoordinates: null,
      map: null,
      mapView: null,
      basemaps: [
        { id: 'osm-color', title: 'OSM Color', imageUrl: 'src/assets/ic_default-1x.png' },
        { id: 'osm-bw', title: 'OSM Black and White', imageUrl: 'src/assets/ic_terrain-1x.png' },
        { id: 'satellite', title: 'Satellite', imageUrl: 'src/assets/aerien.jpg' },
        { id: 'ign', title: 'IGN', imageUrl: 'src/assets/ic_traffic-1x.png' },
      ],
      selectedBasemap: 'osm-color',
      layers: [
        {
          id: 1,
          title: 'OSM',
          visible: true,
          type: 'TileLayer',
          layer: new TileLayer({ source: new OSM() }),
        },
        {
          id: 2,
          title: 'Parcelles',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs.ign.fr/parcellaire/geoportail/r/wms?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "CADASTRALPARCELS.PARCELLAIRE_EXPRESS",
                'TILED': true,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 3,
          title: 'Radon',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "RADON_COMMUNE",
                'TILED': true,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 4,
          title: 'Séisme',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "risq_zonage_sismique",
                'TILED': false,
                // 'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.9
            })
          }),
        },
        {
          id: 5,
          title: 'Obligations de débrouissaillement',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "ZONAGE_OLD",
                'TILED': true,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 6,
          title: 'Argiles',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "ALEARG",
                'TILED': true,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 7,
          title: 'Canalisation de transports de matières dangereuses',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "CANALISATIONS",
                'TILED': true,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 8,
          title: 'Photo Aérienne',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs.ign.fr/inspire/inspire/r/wms?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "OI.OrthoimageCoverage.HR",
                'TILED': true,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 9,
          title: 'Zonage',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "du,psmv",
                'TILED': false,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 10,
          title: 'SUP',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "sup",
                'TILED': false,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 11,
          title: 'SCOT',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "scot",
                'TILED': false,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        }
        ,
        {
          id: 12,
          title: 'Prescription',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "prescription,prescription_psmv",
                'TILED': false,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        },
        {
          id: 13,
          title: 'Information',
          visible: false,
          type: 'TileWMS',
          layer: new TileLayer({
            source: new TileWMS({
              url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
              params: {
                "LAYERS": "info,info_psmv",
                'TILED': false,
                'FORMAT': 'image/png',
              },
              serverType: "geoserver",
              visible: true,
              transition: 0,
              opacity: 0.6
            })
          }),
        }
      ],
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
    toggleLayerVisibility(layer) {
      layer.layer.setVisible(layer.visible);
    },
    changeLayerOpacity(layer) {
      if (layer.type === 'TileWMS') {
        layer.layer.getSource().setOpacity(layer.layer.getOpacity());
      }
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
    BasemapPanel,
    InfoPanel
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

  &:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }

  &:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;

  &:after {
    content: "✖";
  }
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