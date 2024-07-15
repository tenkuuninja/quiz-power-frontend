<script setup lang="ts">
import { useAuthStore } from '~/stores'

const authStore = useAuthStore()
const profile = computed(() => authStore?.profile)
const op = ref()

const toggle = (event: MouseEvent) => {
  op.value.toggle(event)
}

const items = ref([
  {
    label: 'Trang chủ',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'Hồ sơ của tôi',
    icon: 'pi pi-user',
    route: '/dashboard/profile',
  },
  {
    label: 'Đăng xuất',
    icon: 'pi pi-sign-out',
    command: () => {
      authStore.removeAuth()
      op.value.toggle(undefined)
    },
  },
])
</script>

<template>
  <div
    class="fixed left-0 top-0 z-[10] w-full border-b border-slate-200 bg-white"
  >
    <div
      class="flex h-[80px] items-center justify-between space-x-[16px] px-[16px]"
    >
      <NuxtLink class="flex items-center" href="/">
        <IcQuizPower width="60" class="text-primary" />
        <span class="ml-[8px] text-[40px] font-black">
          <span class="text-black">Quiz</span>
          <span class="text-primary">Power</span>
        </span>
      </NuxtLink>
      <div class="flex-grow"></div>
      <div
        class="flex w-[180px] cursor-pointer items-center rounded-full border border-slate-200 bg-slate-100 p-[4px]"
        @click="toggle"
      >
        <img :src="profile?.avatar" alt="" class="w-[28px] rounded-full" />
        <p
          class="ml-[12px] truncate pr-[12px] text-[18px] font-bold text-slate-700"
        >
          {{ profile?.name }}
        </p>
      </div>
    </div>
  </div>
  <OverlayPanel ref="op" class="[&>div[data-pc-section=content]]:p-0">
    <Menu :model="items" class="border-none">
      <template #item="{ item, props }">
        <NuxtLink v-if="item.route" :href="item.route" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </NuxtLink>
        <a v-else v-bind="props.action" @click.prevent>
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </OverlayPanel>
  <div class="h-[80px]"></div>
</template>
