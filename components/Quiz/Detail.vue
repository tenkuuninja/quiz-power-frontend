<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { QuizApi, CategoryApi, ContestApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '~/stores'
import { EUserRole } from '~/common/enum/entity'

const authStore = useAuthStore()

const profile = computed(() => authStore?.profile)

const updateQuestionSchema = yup.object({
  id: yup.number().nullable().optional(),
  name: yup.string().trim().required('This field is required'),
  status: yup.boolean().nullable().optional(),
  visibility: yup.boolean().nullable().optional(),
  categories: yup.array().min(1, 'Tối thiểu 1 danh mục').optional(),
})

interface IUpdateFormProps {
  quizId: number
}

interface IUpdateFormEmits {
  (eventName: 'submit'): void
}

const props = defineProps<IUpdateFormProps>()
const emit = defineEmits<IUpdateFormEmits>()

const { quizId } = props

const router = useRouter()
const openCreateContestDialog = ref(false)

const loading = ref(false)

const quizDetailRequest = useQuery({
  queryKey: ['quiz-detail', ['quiz-detail', quizId].join('-')],
  queryFn: async () => {
    const response = await QuizApi.getDetailQuiz({ id: quizId })

    return response
  },
})

const quiz = computed(() => quizDetailRequest?.data?.value?.data)

const handleCreateContest = async () => {
  openCreateContestDialog.value = true
}
</script>

<template>
  <span v-if="quizDetailRequest.isPending?.value" class="">Loading...</span>
  <div v-if="quizDetailRequest.isSuccess?.value" class="">
    <h1 class="text-[20px] font-bold">{{ quiz?.name }}</h1>
    <div class="mt-[16px] flex flex-wrap gap-[4px]">
      <Chip
        v-for="(category, i) in quiz?.categories"
        :key="category?.id || i"
        :label="category?.name"
      />
    </div>
    <div class="mt-[20px] flex space-x-[16px]">
      <Button
        v-if="profile?.role === EUserRole.User"
        @click="handleCreateContest()"
        label="Tạo cuộc thi"
        icon="pi pi-palette"
        class="rounded-full"
      />
      <Button
        @click="handleCreateContest()"
        outlined
        label="Xuất câu hỏi"
        icon="pi pi-file-pdf"
        class="rounded-full"
      />
      <Button
        @click="handleCreateContest()"
        outlined
        label="Chia sẻ"
        icon="pi pi-share-alt"
        class="rounded-full"
      />
    </div>
    <div class="mt-[24px] space-y-[16px]">
      <QuizQuestionCard
        v-for="(question, i) in quiz?.questions"
        :question="question"
        :key="question?.id || i"
        @click="
          () => {
            openQuestion = true
            questionToUpdate = question
          }
        "
      />
    </div>
  </div>
  <QuizCreateContestDialog
    :open="openCreateContestDialog"
    :quizId="quizId"
    :onClose="
      () => {
        openCreateContestDialog = false
      }
    "
  />
</template>
