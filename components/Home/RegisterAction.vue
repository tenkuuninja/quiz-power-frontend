<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { QuizApi } from '~/services'
import { useAuthStore } from '~/stores'
</script>

<template>
  <div class="relative bg-gray-800 overflow-hidden">
    <img
      class="absolute bottom-0 right-0 top-0 h-full rounded-[8px] rotate-[15deg] blur-[2px]"
      src="/assets/home/banner-2.png"
      alt=""
    />
    <div class="container py-[40px]">
      <p class="mb-[32px] max-w-[800px] text-[24px] font-bold text-primary-400">
        Bạn là người đam mê kiến thức? Hãy trở thành tác giả quiz của chúng tôi
        ngay! Đăng ký để bắt đầu sáng tạo!
      </p>
      <Button size="large" label="Đăng ký ngay" />
    </div>
  </div>
</template>
