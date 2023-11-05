<template>
  <div class="offcanvas-panel" :class="{ active: isPanelActive }">
    <interaction-bar/>
    <BasemapPanel :basemaps="basemaps" :selectedBasemap="selectedBasemap" @basemap-selected="changeBasemap" />
    <button class="toggle-button" :class="{ active: isPanelActive }" @click="togglePanel">
    <img :src="isPanelActive ? 'src/assets/chevrons-down-regular-24.png' : 'src/assets/chevrons-up-regular-24.png'" alt="Toggle Panel" />
    </button>
  </div>
</template>

<script>
import InteractionBar from './InteractionBar.vue';
import BasemapPanel from './BaseMapPanel_old.vue';

export default {
  data() {
    return {
      isPanelActive: false,
    };
  },
  methods: {
    togglePanel() {
      this.isPanelActive = !this.isPanelActive;
    },
  },
  components: {
    InteractionBar,
    BasemapPanel,
  },
};
</script>

<style scoped lang="scss">
.offcanvas-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: #fff;
  overflow: hidden;
  transition: height 0.3s;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
  z-index: 9999;

  &.active {
    height: 40%;
    }
}

.toggle-button {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  transition: bottom 0.3s;

  &.active {
    bottom: 40%;
    transition: bottom 0.3s;
    }
}
</style>