<template>
  <div class="layer-panel">
    <div v-for="group in layerGroups" :key="group.id">
      <div class="group-header" @click="toggleGroupVisibility(group.id)">
        <span>{{ group.name }}</span>
        <i class="fa" :class="{'fa-chevron-down': group.expanded, 'fa-chevron-up': !group.expanded}"></i>
      </div>
      <div class="group" :class="{ expanded: group.expanded }">
        <div v-for="layer in group.layers" :key="layer.id" class="layer-block">
          <label>
            <input type="checkbox" v-model="layer.visible" @change="toggleLayer(layer)" />
            {{ layer.title }}
          </label>
        </div>
      </div>
    </div>

    <div class="sticky-legend" v-if="hasActiveLayers">
      <h4>Legende</h4>
      <ul>
        <li v-for="layer in activeLayers" :key="layer.id">
          <div class="legend-block" v-if="getLegendUrl(layer) !== ''">
            <p>{{ layer.title }}</p>
            <img :src="getLegendUrl(layer)" alt="legend" />
          </div>
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
          groups.push({
            id: groups.length + 1,
            name: layer.layer_group,
            expanded: true,
            layers: [layer]
          });
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
    getLegendUrl(layer) {
      return layer.legend || '';
    },
    toggleGroupVisibility(groupId) {
      const group = this.layerGroups.find((group) => group.id === groupId);
      if (group) {
        group.expanded = !group.expanded;
      }
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
  padding: 0px 10px 0px;
  position: absolute;
  overflow-y: auto;
  overflow-x: hidden;
  top: 0;
  left: 0;
  z-index: 2;
  transition: all 0.5s ease;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &:hover{
    &::-webkit-scrollbar-thumb {
      background-color: #555;
      border-radius: 5px;
    }
  }

  .group-header {
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

  .group.expanded  {
    display: block;
  }

  .group {
    display: none;
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
    display: flex;
    flex-direction: column;
    background: white;
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 10px;
    position: sticky;
    border: 1px solid #ddd;
    bottom: 0;
    border-top: 1px solid #ccc;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &:hover{
      &::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius: 5px;
      }
    }

    h4 {
      margin-top: 0;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    .legend-block {
      display: flex;
      flex-direction: column;

      p {
        font-size: 14px;
        text-align: left;
      }

      img {
        max-width: 100%;
      }
    }
  }
}


</style>