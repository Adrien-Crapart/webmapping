<template>
  <div class="layer-panel">
    <h2>Layers</h2>
    <div v-for="layer in layers" :key="layer.id" class="layer-block">
      <label>
        <input type="checkbox" v-model="layer.visible" @change="toggleLayer(layer)" />
        {{ layer.title }}
      </label>
      <div v-if="layer.type === 'TileWMS'" class="opacity-slider">
        <label>Opacity:</label>
        <input type="range" min="0" max="1" step="0.1" v-model="layer.opacity" @input="changeOpacity(layer)" />
        <span>{{ layer.opacity }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    layers: Array,
  },
  methods: {
    toggleLayer(layer) {
      this.$emit('toggle-layer', layer);
    },
    changeOpacity(layer) {
      this.$emit('change-opacity', layer);
    },
  },
};
</script>

<style scoped lang="scss">
.layer-panel {
  display: block;
  width: 250px;
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
  
  .layer-block {
    margin-bottom: 10px;
  }

  label {
    display: flex;
    align-items: center;
  }

  .opacity-slider {
    display: flex;
    align-items: center;

    label {
      margin-right: 5px;
    }

    input {
      width: 80px;
    }

    span {
      margin-left: 5px;
    }
  }
}
</style>