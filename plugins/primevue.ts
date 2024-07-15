import ToastService from "primevue/toastservice";
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from "primevue/tooltip";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("tooltip", Tooltip);
  nuxtApp.vueApp.use(ConfirmationService);
  nuxtApp.vueApp.use(ToastService);
});
