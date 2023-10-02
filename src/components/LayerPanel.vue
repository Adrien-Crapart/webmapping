<template>
  <div class="layer-panel">
    <h2>Layers</h2>
    <ul>
      <li v-for="layer in layers" :key="layer.id">
        <label>
          <input type="checkbox" v-model="layer.visible" @change="toggleLayer(layer)" />
          {{ layer.title }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    layers: Array, // An array of layer objects with id, title, and visible properties
  },
  methods: {
    toggleLayer(layer) {
      // Emit an event to notify the parent component of the layer toggle
      this.$emit('toggle-layer', layer);
    },
  },
};
</script>

<style scoped lang="scss">
/* Add styling for the layer panel here */
.layer-panel {
  width: 250px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  position: absolute;
  top: 10vh;
  left: 20px;
  z-index: 2;
}
</style>