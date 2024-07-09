// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: ".",
  devtools: { enabled: true },
  plugins: ["~/plugins/socket-io.client.ts"],
  modules: ["nuxt-primevue"],
  css: ["~/styles/main.scss"],
  primevue: {
    /* Options */
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  components: {
    dirs: ["~/components/providers", "~/components"],
  },
});
