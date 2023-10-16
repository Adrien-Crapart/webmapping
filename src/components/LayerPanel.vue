<template>
  <div class="layer-panel">
    <div v-for="group in layerGroups" :key="group.name">
      <button @click="toggleGroupVisibility(group)">{{ group.name }}</button>
      <div class="group" v-show="group.visible">
        <div v-for="layer in group.layers" :key="layer.id" class="layer-block">
          <label>
            <input type="checkbox" v-model="layer.visible" @change="toggleLayer(layer)" />
            {{ layer.title }}
          </label>
        </div>
      </div>
    </div>

    <div class="sticky-legend" v-if="hasActiveLayers">
      <h4>Legend</h4>
      <ul>
        <li v-for="layer in activeLayers" :key="layer.id">
          {{ layer.title }}:
          <img :src="getLegendUrl(layer.name)" alt="Legend" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    layers: Array,
  },
  computed: {
    activeLayers() {
      return this.layers.filter((layer) => layer.visible);
    },
    hasActiveLayers() {
      return this.activeLayers.length > 0;
    },
    layerGroups() {
      // Group layers by "layer_group"
      const groups = [];
      this.layers.forEach((layer) => {
        const existingGroup = groups.find((group) => group.name === layer.layer_group);
        if (existingGroup) {
          existingGroup.layers.push(layer);
        } else {
          groups.push({ name: layer.layer_group, visible: true, layers: [layer] });
        }
      });

      // Sort layers within each group by "layer_order"
      groups.forEach((group) => {
        group.layers.sort((a, b) => a.layer_order - b.layer_order);
      });

      return groups;
    },
  },
  methods: {
    toggleLayer(layer) {
      this.$emit('toggle-layer', layer);
    },
    changeOpacity(layer) {
      this.$emit('change-opacity', layer);
    },
    getLegendUrl(layerName) {
      const legendUrls = {
        RADON_COMMUNE: 'https://mapsref.brgm.fr/wxs/georisques/risques?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=RADON_COMMUNE&format=image/png&STYLE=default',
      };

      return legendUrls[layerName] || '';
    },
    toggleGroupVisibility(group) {
      group.visible = !group.visible;
    },
  },
};
</script>

<style scoped lang="scss">
.layer-panel {
  display: block;
  width: 315px;
  height: 100%;
  background-color: #F8F8F8;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  top: 0;
  left: 0;
  z-index: 2;
  transition: all 0.5s ease;

  button {
    background: #bbbbbb!important;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    text-align: left;
    padding: 5px;
    width: 100%;

    &:hover,
    &:focus,
    &:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  }

  .group {
    background: white;
  }

  label {
    display: flex;
    align-items: center;
    text-align: left;
    line-height: 20px;
    font-size: 12px;
    padding: 10px;
    color: black;

    &:hover {
      background: #333333!important;
      color: white;
    }

    input {
      margin-right: 10px;
    }
  }

  .sticky-legend {
    background: white;
    padding: 10px;
    position: sticky;
    bottom: 0;
    border-top: 1px solid #ccc;

    h4 {
      margin-top: 0;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>