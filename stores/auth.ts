import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isInitialized: false,
    isAuthenticated: false,
    profile: null as any,
  }),
  actions: {
    setAuthProfile(profile: any) {
      this.isInitialized = true;
      this.isAuthenticated = true;
      this.profile = profile;
    },
    removeAuth() {
      this.isInitialized = true;
      this.isAuthenticated = false;
      this.profile = null;
    },
  },
  getters: {
    // doubleCounter: (state) => state.counter * 2,
  },
});
