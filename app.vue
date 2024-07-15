<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
</script>

<template>
  <AuthProvider />
  <SplashLoading>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </SplashLoading>
  <Toast />
</template>
