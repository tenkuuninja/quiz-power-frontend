<script setup lang="ts">
import { useAuthStore } from '~/stores'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = toRefs(authStore)

watch(
  [isAuthenticated],
  ([newIsAuthenticated]) => {
    if (!newIsAuthenticated) {
      router.push({ path: '/' })
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <DashboardLayoutHeader />
  <div
    class="left-0 top-[81px] h-[calc(100vh-81px)] w-[240px] border-r border-gray-300 bg-white md:fixed md:z-20"
  >
    <DashboardLayoutSideBar />
  </div>
  <div class="pl-[240px]">
    <div class="min-h-[calc(100vh-80px)] bg-gray-100 p-[20px]">
      <slot />
    </div>
  </div>
</template>
