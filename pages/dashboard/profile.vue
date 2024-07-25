<script setup>
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import dayjs from 'dayjs'

const confirm = useConfirm()

// Query
const getQuizListRequest = useQuery({
  queryKey: ['quiz-list'],
  queryFn: () => QuizApi.getListQuiz(),
})

const quizzes = computed(() => getQuizListRequest?.data?.value?.data || [])
const total = computed(() => getQuizListRequest?.data?.value?.total || 0)
const { isPending, isSuccess, isError, data, error, refetch } =
  toRefs(getQuizListRequest)

const router = useRouter()

const loading = ref(false)

const handleCreateQuiz = async () => {
  loading.value = true
  try {
    const createQuizResponse = await QuizApi.createQuiz()
    const quizId = createQuizResponse?.data?.id
    router.push({ path: `/dashboard/quiz/${quizId}/edit` })
  } catch (error) {
    //
  }
  loading.value = false
}

const handleConfirmDelete = async (id) => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Save',
    },
    accept: async () => {
      await QuizApi.deleteQuiz({ id })
      refetch()
    },
    reject: () => {},
  })
}

definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <div class="rounded-[8px] bg-white p-[16px]">
    <div class="max-w-[500px] space-y-[80px]">
      <ProfileInfo />
      <ProfileChangePassword />
    </div>
  </div>
</template>
