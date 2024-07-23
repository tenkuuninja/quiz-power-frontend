<script setup lang="ts">
import { useAuthStore } from '~/stores'
const router = useRouter()

const auth = useAuthStore()
const isAuthenticated = computed(() => auth?.isAuthenticated)
const profile = computed(() => auth?.profile)
const op = ref()

const toggle = (event: MouseEvent) => {
  op.value.toggle(event)
}

const items = ref([
  // {
  //   label: 'Bảng điều khiển',
  //   icon: 'pi pi-palette',
  //   route: '/dashboard',
  // },
  {
    label: 'Hồ sơ của tôi',
    icon: 'pi pi-user',
    route: '/dashboard/profile',
  },
  {
    label: 'Đăng xuất',
    icon: 'pi pi-sign-out',
    command: () => {
      auth.removeAuth()
      op.value.toggle(undefined)
    },
  },
])
</script>

<template>
  <div
    class="fixed left-0 top-0 z-[10] w-full border-b border-slate-800 bg-slate-900"
  >
    <div
      class="flex h-[80px] items-center justify-between space-x-[16px] px-[16px]"
    >
      <NuxtLink href="/">
        <div class="flex items-center">
          <IcQuizPower width="60" class="text-primary" />
          <span class="ml-[8px] text-[40px] font-black">
            <span class="text-white">Quiz</span>
            <span class="text-primary">Power</span>
          </span>
        </div>
      </NuxtLink>
      <div class="flex-grow"></div>
      <button
        class="flex w-[180px] cursor-pointer items-center rounded-full border border-slate-700 bg-slate-800 p-[4px]"
        v-if="isAuthenticated"
        @click="toggle"
      >
        <img :src="profile?.avatar" alt="" class="w-[28px] rounded-full" />
        <p
          class="ml-[12px] truncate pr-[12px] text-[18px] font-bold text-slate-100"
        >
          {{ profile?.name }}
        </p>
      </button>
      <div v-if="!isAuthenticated" class="cursor-pointer space-x-[16px]">
        <NuxtLink :to="`/login`">
          <Button link class="font-nunito font-bold">Đăng nhập</Button>
        </NuxtLink>
        <NuxtLink :to="`/register`">
          <Button class="font-nunito font-bold text-slate-900">Đăng ký</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
  <OverlayPanel
    ref="op"
    class="translate-x-[-20px] [&>div[data-pc-section=content]]:p-0"
  >
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
