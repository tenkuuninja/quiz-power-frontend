<script setup lang="ts">
import { useAuthStore } from '~/stores'

const auth = useAuthStore()
const isAuthenticated = computed(() => auth?.isAuthenticated)
const profile = computed(() => auth?.profile)

const socials = [
  {
    image: '',
    label: 'Facebook',
  },
  {
    image: '',
    label: 'Twitter',
  },
  {
    image: '',
    label: 'Google+',
  },
  {
    image: '',
    label: 'Telegram',
  },
  {
    image: '',
    label: 'Discord',
  },
]

const usefulLinks = [
  {
    image: '',
    label: 'Hướng dẫn',
  },
  {
    image: '',
    label: 'Afiliates',
  },
  {
    image: '',
    label: 'Chính sách bảo mật',
  },
  {
    image: '',
    label: 'Điều khoản sử dụng',
  },
]
</script>

<template>
  <footer class="w-full bg-gray-900 text-white">
    <div class="container mx-auto flex justify-between py-20">
      <div class="w-[30%]">
        <h3
          class="mb-4 text-2xl font-bold leading-6 text-primary underline underline-offset-8"
        >
          Về chúng tôi
        </h3>
        <p class="text-justify">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
          fugiat tempore, ipsa, modi facilis porro quasi neque nemo rerum
          pariatur suscipit quae consectetur!
        </p>
      </div>
      <div class="w-[20%]">
        <h3
          class="mb-4 text-2xl font-bold leading-6 text-primary underline underline-offset-8"
        >
          Kết nối với chúng tôi
        </h3>
        <NuxtLink
          v-for="(social, i) of socials"
          :key="i"
          class="mt-1 flex cursor-pointer items-center hover:underline"
        >
          <img :src="social?.label" alt="" />
          <p>{{ social?.label }}</p>
        </NuxtLink>
      </div>
      <div class="w-[20%]">
        <h3
          class="mb-4 text-2xl font-bold leading-6 text-primary underline underline-offset-8"
        >
          Liên kết
        </h3>
        <NuxtLink
          v-for="(link, i) of usefulLinks"
          :key="i"
          class="mt-1 flex cursor-pointer items-center hover:underline"
        >
          <p>{{ link?.label }}</p>
        </NuxtLink>
      </div>
    </div>
    <div class="py-[20px] text-center text-[14px] border-t border-slate-800">
      QuizPower, Copyright © 2024
    </div>
  </footer>
</template>
