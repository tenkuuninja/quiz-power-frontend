<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { QuizApi, CategoryApi, ContestApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '~/stores'
import { EUserRole } from '~/common/enum/entity'
import copy from 'copy-to-clipboard'

const toast = useToast()
const authStore = useAuthStore()

const profile = computed(() => authStore?.profile)
const openCreateContestDialog = ref(false)

interface IUpdateFormProps {
  quiz: any
}

interface IUpdateFormEmits {
  (eventName: 'submit'): void
}

const props = defineProps<IUpdateFormProps>()
const emit = defineEmits<IUpdateFormEmits>()
const quiz = computed(() => props?.quiz)

const exportQuizRequest = useMutation({
  mutationFn: QuizApi.exportPdf,
})

const handleCopyLink = async () => {
  const origin = window.location.origin
  copy(origin + '/quiz/' + quiz?.value?.id)

  toast.add({
    severity: 'success',
    summary: 'Đã sao chép đường dẫn!',
    life: 3000,
  })
}

const handleExportPdf = async () => {
  try {
    const response = await exportQuizRequest.mutateAsync({
      id: quiz?.value?.id,
    })

    const blob = new Blob([new Uint8Array(response?.data?.data)], {
      type: 'application/octet-stream',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '[QuizPower]-' + quiz.value.name + '-' + Date.now() + '.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch (error) {
    console.error('handleExportPdf', error)
  }
}

const handleCreateContest = async () => {
  openCreateContestDialog.value = true
}
</script>

<template>
  <div class="">
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
        :loading="exportQuizRequest?.isPending?.value"
        @click="handleExportPdf()"
        outlined
        label="Xuất câu hỏi"
        icon="pi pi-file-pdf"
        class="rounded-full"
      />
      <Button
        @click="handleCopyLink()"
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
      />
    </div>
  </div>
  <QuizCreateContestDialog
    :open="openCreateContestDialog"
    :quizId="quiz?.id"
    :onClose="
      () => {
        openCreateContestDialog = false
      }
    "
  />
</template>
