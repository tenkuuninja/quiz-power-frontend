<script setup lang="ts">
import { ref } from 'vue'
import { EUserRole } from '~/common/enum/entity'
import { useAuthStore } from '~/stores'

const authStore = useAuthStore()

const profile = computed(() => authStore?.profile)

const items = ref([
  {
    label: 'Chung',
    items: [
      // {
      //   label: 'Bảng điều khiển',
      //   icon: 'pi pi-palette',
      //   url: '/dashboard',
      // },
      {
        label: 'Hồ sơ của tôi',
        icon: 'pi pi-user',
        url: '/dashboard/profile',
        roles: [EUserRole.User, EUserRole.Admin],
      },
      {
        label: 'Trang chủ',
        icon: 'pi pi-home',
        url: '/',
        roles: [EUserRole.User, EUserRole.Admin],
      },
    ],
  },
  {
    label: 'Quản lý',
    items: [
      {
        label: 'Quiz',
        icon: 'pi pi-cog',
        url: '/dashboard/quiz',
        roles: [EUserRole.User, EUserRole.Admin],
      },
      {
        label: 'Cuộc thi',
        icon: 'pi pi-inbox',
        url: '/dashboard/contest',
        roles: [EUserRole.User],
      },
      {
        label: 'Người dùng',
        icon: 'pi pi-user',
        url: '/dashboard/user',
        roles: [EUserRole.Admin],
      },
    ],
  },
])
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="p-[16px] pb-[32px] text-center">
      <NuxtLink href="/dashboard/profile">
        <img
          :src="authStore.profile?.avatar"
          alt=""
          class="mx-auto w-[100px] rounded-full"
        />
      </NuxtLink>
      <NuxtLink href="/dashboard/profile">
        <p class="ml-[12px] pr-[12px] text-[24px] font-bold text-black">
          {{ authStore.profile?.name }}
        </p>
      </NuxtLink>
    </div>
    <Menu :model="items" class="md:w-15rem w-full border-none">
      <template #submenuheader="{ item }">
        <span class="text-[12px] font-bold text-primary">{{ item.label }}</span>
      </template>
      <template #item="{ item, props }">
        <NuxtLink
          v-if="item?.roles?.includes(profile?.role)"
          v-bind="props.action"
          class="align-items-center flex"
          :href="item?.url"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </NuxtLink>
      </template>
    </Menu>
    <div class="flex-grow"></div>
    <button
      class="flex cursor-pointer items-center justify-center space-x-[16px] border-t border-red-300 px-[16px] py-[8px] text-red-600 transition-all hover:bg-slate-200"
    >
      <span class="pi pi-sign-out"></span>
      <span class="text-[18px]">Đăng xuất</span>
    </button>
  </div>
</template>
