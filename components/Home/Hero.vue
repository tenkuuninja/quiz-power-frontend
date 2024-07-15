<script setup lang="ts">
import { useAuthStore } from '~/stores'

const auth = useAuthStore()
const isAuthenticated = computed(() => auth?.isAuthenticated)
const profile = computed(() => auth?.profile)
</script>

<template>
  <div
    class="z-[10] w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 px-[16px]"
  >
    <div
      class="container flex min-h-[calc(100vh-80px)] items-center justify-between"
    >
      <div class="w-[50%]">
        <h1 class="font-extrabold text-primary">
          <p class="text-[80px]">QuizPower</p>
          <p class="text-[40px]">Năng lượng trí tuệ của bạn!</p>
        </h1>
        <p class="mt-[40px] max-w-[600px] text-[18px] text-slate-100">
          Nơi bạn không chỉ tham gia những bài quiz hấp dẫn và thách thức, mà
          còn khám phá kho tàng tri thức vô tận, nâng cao hiểu biết và chinh
          phục mọi thử thách cùng cộng đồng đam mê tri thức!
        </p>
        <NuxtLink href="/join">
          <Button
            size="large"
            label="Tham gia ngay"
            class="mt-[60px] h-[60px] rounded-full font-nunito text-[30px] text-slate-800 [&>span]:font-bold"
          />
        </NuxtLink>
        <div class="h-[60px]"></div>
      </div>
      <div class="relative flex w-[45%] items-center justify-end">
        <img
          class="absolute left-0 top-[-40%] rounded-[8px] w-[90%]"
          src="/assets/home/banner-1.png"
          alt=""
        />
        <div class="relative w-[90%]">
          <img
            class="w-full rounded-[8px]"
            src="/assets/home/banner-2.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
