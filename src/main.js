import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus, faMinus, faHouse } from "@fortawesome/free-solid-svg-icons";
//, ruler, pen, share, image, gear, eye, eye-slash, copy, industry, microsoft, location-dot, star, xmark, check, tag, list, pen-to-square

/* add icons to the library */
library.add(faPlus, faMinus, faHouse);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
