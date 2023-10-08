import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

export const layers = [
  {
    id: 1,
    title: "OSM",
    visible: true,
    type: "TileLayer",
    layer: new TileLayer({ source: new OSM() }),
  },
  {
    id: 2,
    title: "Parcelles",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://wxs.ign.fr/parcellaire/geoportail/r/wms?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "CADASTRALPARCELS.PARCELLAIRE_EXPRESS",
          TILED: true,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 3,
    title: "Radon",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "RADON_COMMUNE",
          TILED: true,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 4,
    title: "Séisme",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "risq_zonage_sismique",
          TILED: false,
          // 'FORMAT': 'image/png',
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.9,
      }),
    }),
  },
  {
    id: 5,
    title: "Obligations de débrouissaillement",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "ZONAGE_OLD",
          TILED: true,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 6,
    title: "Argiles",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "ALEARG",
          TILED: true,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 7,
    title: "Canalisation de transports de matières dangereuses",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://mapsref.brgm.fr/wxs/georisques/risques?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "CANALISATIONS",
          TILED: true,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 8,
    title: "Photo Aérienne",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://wxs.ign.fr/inspire/inspire/r/wms?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "OI.OrthoimageCoverage.HR",
          TILED: true,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 9,
    title: "Zonage",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "du,psmv",
          TILED: false,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 10,
    title: "SUP",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "sup",
          TILED: false,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 11,
    title: "SCOT",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "scot",
          TILED: false,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 12,
    title: "Prescription",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "prescription,prescription_psmv",
          TILED: false,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
  {
    id: 13,
    title: "Information",
    visible: false,
    type: "TileWMS",
    layer: new TileLayer({
      source: new TileWMS({
        url: "https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wms/v?SERVICE=WMS&VERSION=1.3.0",
        params: {
          LAYERS: "info,info_psmv",
          TILED: false,
          FORMAT: "image/png",
        },
        serverType: "geoserver",
        visible: true,
        transition: 0,
        opacity: 0.6,
      }),
    }),
  },
];
