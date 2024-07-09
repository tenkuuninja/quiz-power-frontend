import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as IoIcons from "oh-vue-icons/icons/io";

const Io = Object.values({ ...IoIcons });
addIcons(...Io);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("v-icon", OhVueIcon);
});
