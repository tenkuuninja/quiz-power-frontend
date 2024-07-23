<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { EQuizStatus, EQuizVisibility, EUserRole } from '~/common/enum/entity'
import { QuizApi } from '~/services'
import { useAuthStore } from '~/stores'

const authStore = useAuthStore()
const route = useRoute()
const quizId = computed(() => +route?.params?.id)

const router = useRouter()

const loading = ref(false)

const quizDetailRequest = useQuery({
  queryKey: ['quiz-detail', quizId],
  queryFn: async () => {
    const response = await QuizApi.getDetailQuiz({ id: quizId.value })
    return response
  },
})

const quiz = computed(() => quizDetailRequest?.data?.value?.data)
const profile = computed(() => authStore?.profile)

const canView = computed(() => {
  if (profile?.value?.role === EUserRole.Admin) {
    return true
  }
  if (quiz?.value?.visibility === EQuizVisibility.Public) {
    return true
  }
  if (quiz?.value?.userId === profile?.value?.id) {
    return true
  }
  return false
})

definePageMeta({
  layout: 'user',
})
</script>

<template>
  <div class="rounded-[8px] bg-white p-[16px]">
    <div class="container mt-[32px] min-h-[500px] max-w-screen-md">
      <QuizDetail v-if="canView" :quiz="quiz" />
    </div>
  </div>
</template>
