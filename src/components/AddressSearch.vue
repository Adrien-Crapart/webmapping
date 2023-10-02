<template>
  <div class="address-search">
    <input v-model="searchQuery" @input="handleInputChange" placeholder="Search for an address..." />
    <ul v-if="searchResults.length">
      <li v-for="result in searchResults" :key="result.place_id" @click="selectAddress(result)">
        {{ result.display_name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
    };
  },
  methods: {
    handleInputChange() {
      if (this.searchQuery.length >= 5) {
        this.performAddressSearch();
      } else {
        this.searchResults = [];
      }
    },
    async performAddressSearch() {
      try {
        const apiUrl1 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.searchQuery)}&format=json`;
        const apiUrl2 = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(this.searchQuery)}`;

        // Send requests to both APIs simultaneously using Promise.all
        const [response1, response2] = await Promise.all([
          axios.get(apiUrl1),
          axios.get(apiUrl2),
        ]);

        // Combine and organize the results from both APIs into a single array
        const combinedResults = [
          ...this.parseNominatimResponse(response1.data),
          response2.data,
        ];

        this.searchResults = combinedResults;
      } catch (error) {
        console.error('Error performing address search:', error);
      }
    },
    parseNominatimResponse(data) {
      // Parse and format results from the Nominatim API
      return data.map(result => ({
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
        tag: "Nominatim"
        // Add other properties as needed
      }));
    },
    parseDataGouvResponse(data) {
      // Parse and format results from the Data Gouv API
      return data.map(result => ({
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.label,
        tag: "Etalab"
        // Add other properties as needed
      }));
    },
    selectAddress(result) {
      this.searchQuery = result.display_name;
      this.searchResults = [];

      if (result.type === 'administrative') {
        var zoomLevel = 14;
      }
      if (result.type === 'residential') {
        var zoomLevel = 18;
      }
      if (result.type === 'house') {
        var zoomLevel = 21;
      }

      this.$emit('address-selected', {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
        zoomLevel: zoomLevel,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.address-search {
  position: absolute;
  right: 6vw;
  top: 1vh;
  z-index: 2;

  input {
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      cursor: pointer;
      padding: 5px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      margin-bottom: 2px;
    }
  }
}
</style>