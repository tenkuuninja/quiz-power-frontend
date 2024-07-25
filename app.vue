<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)

useHead({
  title: 'QuizPower',
  meta: [{ name: 'description', content: 'QuizPower' }],
})
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
