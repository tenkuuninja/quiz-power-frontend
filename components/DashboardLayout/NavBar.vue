<script setup lang="ts">
import { useAuthStore } from "~/stores";

const authStore = useAuthStore();

</script>

<template>
  <div
    class="fixed top-0 left-0 w-full border-b border-slate-200 backdrop-blur z-[10]"
  >
    <div
      class="h-[80px] flex items-center justify-between space-x-[16px] px-[16px]"
    >
      <div class="flex items-center">
        <IcQuizPower width="60" class="text-primary" />
        <span class="text-[40px] font-black ml-[8px]">
          <span class="text-black">Quiz</span>
          <span class="text-primary">Power</span>
        </span>
      </div>
      <div class="flex-grow"></div>
      <div class="flex items-center">
        <img :src="authStore.profile?.avatar" alt="" class="w-[40px] mt-[-8px]" />
        <p class="text-[24px] text-black ml-[12px] font-bold pr-[12px]">
          {{ authStore.profile?.name }}
        </p>
      </div>
    </div>
  </div>
  <div class="h-[72px]"></div>
</template>
