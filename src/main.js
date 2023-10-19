import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faMinus,
  faHouse,
  faPen,
  faRuler,
  faShare,
  faImage,
  faGear,
  faEye,
  faEyeSlash,
  faCopy,
  faIndustry,
  faXmark,
  faCheck,
  faStar,
  faLocationDot,
  faTags,
  faList,
  faPenToSquare,
  faTable,
  faCity,
  faPaste,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faPlus,
  faMinus,
  faHouse,
  faPen,
  faRuler,
  faShare,
  faImage,
  faGear,
  faEye,
  faEyeSlash,
  faCopy,
  faIndustry,
  faXmark,
  faCheck,
  faStar,
  faLocationDot,
  faTags,
  faList,
  faPenToSquare,
  faTable,
  faCity,
  faPaste,
  faVectorSquare
);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
