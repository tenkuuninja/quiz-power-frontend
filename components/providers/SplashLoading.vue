<script setup lang="ts">
import { onMounted } from 'vue'
import { AuthApi } from '~/services'
import { useAuthStore } from '~/stores'

const authStore = useAuthStore()

const isInitialized = computed(() => authStore?.isInitialized)
</script>

<template>
  <slot v-if="isInitialized" />
</template>
