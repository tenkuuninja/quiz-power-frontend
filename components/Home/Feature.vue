<script setup lang="ts">
import { useAuthStore } from '~/stores'

const auth = useAuthStore()
const isAuthenticated = computed(() => auth?.isAuthenticated)
const profile = computed(() => auth?.profile)

const features = [
  {
    image: '/assets/home/feature-1.png',
    title: 'Tạo Quiz Dễ Dàng',
    text: 'Giao diện tạo quiz thân thiện và dễ sử dụng, giúp bạn nhanh chóng tạo ra những quiz thú vị. Cho phép tùy chỉnh các câu hỏi, đáp án và hình ảnh để tạo nên quiz độc đáo của riêng bạn.',
  },
  {
    image: '/assets/home/feature-3.png',
    title: 'Chia Sẻ Quiz',
    text: 'Chia sẻ quiz của bạn với bạn bè và cộng đồng qua mạng xã hội hoặc liên kết trực tiếp.',
  },
  {
    image: '/assets/home/feature-2.png',
    title: 'Gợi Ý Quiz Dựa Trên Trí Tuệ Nhân Tạo',
    text: 'Công cụ gợi ý quiz thông minh dựa trên trí tuệ nhân tạo giúp bạn tạo ra những câu hỏi phù hợp và hấp dẫn.',
  },
  {
    image: '/assets/home/feature-3.png',
    title: 'Xuất Ra File PDF',
    text: 'Dễ dàng xem lại các quiz bạn đã tạo và xuất chúng ra file PDF để lưu trữ hoặc chia sẻ.',
  },
]
</script>

<template>
  <div class="container py-[40px]">
    <h3 class="mb-[32px] text-[40px] font-bold">Tính năng nổi bật</h3>
    <div
      v-for="(feature, i) of features"
      :class="
        cn(
          'flex flex-wrap items-center justify-between py-[24px]',
          i % 2 ? 'sm:flex-row-reverse' : 'text-right',
        )
      "
      :key="i"
    >
      <div class="w-[50%]">
        <img
          :src="feature?.image"
          alt=""
          class="max-h-[300px] object-contain"
        />
      </div>
      <div class="w-[35%]">
        <p class="text-[28px] font-bold">{{ feature?.title }}</p>
        <p class="mt-[20px] text-[20px] font-medium text-slate-700">
          {{ feature?.text }}
        </p>
      </div>
    </div>
  </div>
</template>
