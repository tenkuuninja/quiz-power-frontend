<script setup lang="ts">
import { useAuthStore } from "~/stores";

const auth = useAuthStore();
const isAuthenticated = computed(() => auth?.isAuthenticated)
const profile = computed(() => auth?.profile)
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full border-b border-slate-200 bg-white z-[10]"
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
      <NuxtLink to="/dashboard/quiz" v-if="isAuthenticated">
        <div class="flex items-center">
          <img :src="profile?.avatar" alt="" class="w-[40px] mt-[-8px]" />
          <p class="text-[24px] text-black ml-[12px] font-bold pr-[12px]">
            {{ profile?.name }}
          </p>
        </div>
      </NuxtLink>
      <div v-if="!isAuthenticated" class="space-x-[16px]">
        <NuxtLink :to="`/login`">
          <Button outlined>Login</Button>
        </NuxtLink>
        <NuxtLink :to="`/register`">
          <Button>Register</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
  <div class="h-[80px]"></div>
</template>
