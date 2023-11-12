<template>
  <div class="layer-panel">
    <div class="wrap-collapsible" v-for="group in layerGroups" :key="group.id">
      <input :id="'collapsible-' + group.id" class="toggle" type="checkbox">
      <label :for="'collapsible-' + group.id" class="lbl-toggle">{{ group.name }} ({{ group.layers.length }})</label>
      <div class="collapsible-content">
        <div class="content-inner">
          <div v-for="layer in group.layers" :key="layer.id" class="layer-block">
            <label>
              <input type="checkbox" v-model="layer.visible" @change="toggleLayer(layer)" />
              {{ layer.title }}
            </label>
          </div>
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
  display: flex;
  flex-direction: column;
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
  gap: 1%;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &:hover{
    &::-webkit-scrollbar-thumb {
      background-color: #555;
      border-radius: 5px;
    }
  }
  .toggle { 
    display:none ; 
  } 
}

.lbl-toggle { 
  display: block; 
  font-weight: bold; 
  font-family: monospace; 
  font-size: 1.2rem; 
  text-transform: uppercase; 
  text-align: left; 
  font-size: 16px;
  padding: 10px; 
  color: #fffdfd; 
  background: #bbbbbb!important; 
  cursor: pointer; 
  border-radius: 7px; 
  transition: all 0.25s ease-out; 

  &:hover,
  &:focus,
  &:focus-visible {
    color: #FFF; 
    outline: 4px auto -webkit-focus-ring-color;
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

  &::-webkit-scrollbar {
    width: 10px;
  }

  &:hover{
    &::-webkit-scrollbar-thumb {
      background-color: #555;
      border-radius: 5px;
    }
  }

  .content-inner { 
    padding: 10px 0px 10px 0px; 
  }

  .layer-block{
    display: flex;
    align-items: center;
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
    color: black;
    border-radius: 5px;
    padding: 5px;
    vertical-align: middle;

    &:hover{
      background: #333333!important;
      color: white;
    }
  }
} 
.toggle:checked + .lbl-toggle + .collapsible-content { 
  max-height: 500px; 
  overflow-y: scroll;
  overflow-x: hidden;
} 
</style>