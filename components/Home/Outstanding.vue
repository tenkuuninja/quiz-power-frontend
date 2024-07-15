<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { QuizApi } from '~/services'
import { useAuthStore } from '~/stores'

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 4,
    numScroll: 4,
  },
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 3,
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 2,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1,
  },
])

const getListQuizRequest = useQuery({
  queryKey: ['quizasd'],
  queryFn: () => QuizApi.getListOutstandingQuiz({}),
})

const quizzes = computed(() => getListQuizRequest.data?.value?.data || [])

watchEffect(() => {
  console.log(quizzes)
})
</script>

<template>
  <div class="container py-[40px]">
    <h3 class="mb-[32px] text-[40px] font-bold">Quiz nổi bật</h3>
    <Carousel
      :value="quizzes"
      :numVisible="4"
      :numScroll="4"
      :responsiveOptions="responsiveOptions"
      circular
    >
      <template #item="slotProps">
        <NuxtLink
          :href="`/quiz/${slotProps.data?.id}`"
          class="border-1 surface-border border-round m-2 block p-3"
        >
          <div class="mb-3">
            <div
              class="relative mx-auto h-[160px] overflow-hidden rounded-[8px] bg-primary-200"
            >
              <img
                :src="slotProps?.data?.image"
                alt=""
                class="h-full w-full object-cover"
              />
            </div>
          </div>
          <div class="mb-3 line-clamp-2 font-medium">
            {{ slotProps.data?.name }}
          </div>
          <div class="line-clamp-1 text-[12px] font-medium text-slate-600">
            {{ slotProps.data?.questions?.length }} câu hỏi
          </div>
        </NuxtLink>
      </template>
    </Carousel>
  </div>
</template>
