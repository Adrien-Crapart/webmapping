<template>
  <div
    class="basemap-panel"
    :class="{ expanded: isExpanded }"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
    <ul>
      <li v-for="basemap in basemaps" :key="basemap.id">
        <img
          :src="basemap.imageUrl"
          alt="Basemap"
          @click="selectBasemap(basemap)"
          @mouseover="hoverEffect(basemap.id)"
          @mouseout="hoverEffect(null)"
          :class="{ selected: basemap.id === selectedBasemapId }"
          :title="basemap.title"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    basemaps: Array,
    selectedBasemap: String,
  },
  data() {
    return {
      isExpanded: false,
      selectedBasemapId: null,
      isHovered: false,
    };
  },
  watch: {
    selectedBasemap(newVal) {
      // Update the selected basemap ID when the prop changes
      const selectedBasemap = this.basemaps.find(basemap => basemap.title === newVal);
      this.selectedBasemapId = selectedBasemap ? selectedBasemap.id : null;
    },
  },
  methods: {
    selectBasemap(basemap) {
      this.$emit('basemap-selected', basemap.title);
    },
    mouseEnter() {
      this.isExpanded = true;
    },
    mouseLeave() {
      this.isExpanded = false;
    },
    hoverEffect(basemapId) {
      this.isHovered = basemapId;
    },
  },
};
</script>

<style scoped lang="scss">
.basemap-panel {
  width: 50px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: absolute;
  bottom: 20px;
  right: 5px;
  z-index: 2;
  overflow: hidden;
  transition: width 0.3s, background-color 0.3s;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
  }

  li {
    margin-left: 5px;
    margin-right: 5px;
    padding: 5px;
  }

  img {
    width: 30px;
    height: auto;
    cursor: pointer;
    transition: filter 0.3s;
  }

  img:hover {
    filter: brightness(120%);
  }

  img.selected {
    filter: none;
  }

  h2 {
    text-align: center;
    margin: 0;
  }

  &.expanded {
    width: 200px;
  }
}
</style>