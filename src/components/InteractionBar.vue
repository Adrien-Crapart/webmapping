<template>
  <div class="interaction-bar">
    <button @click="showInfo">Info from Layers</button>
    <button @click="selectMultipleEntities">Select Multiple Entities</button>
    <button @click="shareScreen">Share Screen</button>
    <button @click="placePoint">Place Point</button>
    <button @click="measureDistanceArea">Measure Distance/Area</button>
    <button @click="modifyGeomAndValue">Modify Geometry and Value</button>
    <button @click="viewPlainScreen">View Plain Screen</button>
  </div>
</template>

<script>
export default {
  methods: {
    showInfo() {
      // Implement the action for showing information from layers
    },
    selectMultipleEntities() {
      // Implement the action for selecting multiple entities
    },
    shareScreen() {
      // Implement the action for sharing the screen
    },
    placePoint() {
      // Implement the action for placing a point on the map
    },
    measureDistanceArea() {
      // Implement the action for measuring distance/area
    },
    modifyGeomAndValue() {
      // Implement the action for modifying geometry and value
    },
    viewPlainScreen() {
      // Implement the action for viewing the plain screen
    },
  },
};
</script>

<style scoped lang="scss">
.interaction-bar {
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f0f0f0;
  padding: 5px;
  z-index: 2;
  font-size: 12px;

  button {
    padding: 5px 10px;
    background-color: #0074d9;
    color: #fff;
    border: none;
    margin-right: 2px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
}

</style>