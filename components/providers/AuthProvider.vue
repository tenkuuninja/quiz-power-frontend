<script setup lang="ts">
import { onMounted } from "vue";
import { AuthApi } from "~/services";
import { useAuthStore } from "~/stores";

const authStore = useAuthStore();

onMounted(async () => {
  try {
    const profileResponse = await AuthApi.getProfile();
    authStore.setAuthProfile(profileResponse?.data);
  } catch (error) {
    authStore.removeAuth();
  }
});
</script>

<template>
  <slot />
</template>
