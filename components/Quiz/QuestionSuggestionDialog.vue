<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'

const confirm = useConfirm()
const toast = useToast()

interface IQuestionEditFormProps {
  open: boolean
  onClose: VoidFunction
}

interface IQuestionEditFormEmits {
  (eventName: 'submit', question: any[]): void
}

const props = defineProps<IQuestionEditFormProps>()
const emit = defineEmits<IQuestionEditFormEmits>()

const questions = ref([] as any[])
const message = ref('')

const suggestQuestionRequest = useMutation({
  mutationFn: QuizApi.suggestionQuestion,
})

const handleSuggestQuestion = async () => {
  if (!message.value) {
    toast.add({
      severity: 'error',
      summary: 'Hãy nhập nội dung chủ đề !',
      life: 3000,
    })
    return
  }

  try {
    const suggestResponse = await suggestQuestionRequest.mutateAsync({
      message: message.value,
    })
    questions.value = (suggestResponse?.data || [])?.map((question: any) => ({
      ...question,
      questionType: EQuestionType.SingleChoice,
    }))
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại !',
      life: 3000,
    })
  }
}

const handleSelectQuestion = async (index: number) => {
  if (questions.value[index]) {
    questions.value[index].selected = !questions.value[index]?.selected
  }
}

const handleSubmit = async (index: number) => {
  const selectedQuestion = questions?.value?.filter((q) => q?.selected)

  if (!selectedQuestion?.length) {
    toast.add({
      severity: 'error',
      summary: 'Hãy chọn ít nhất 1 câu hỏi !',
      life: 3000,
    })
    return
  }

  emit('submit', selectedQuestion)
}
</script>

<template>
  <Dialog
    :visible="props?.open"
    @update:visible="props?.onClose"
    modal
    dismissableMask
    blockScroll
    pt:mask:class="overflow-y-auto !block py-[40px]"
    pt:root:class="p-0 !max-h-auto"
    class="mx-auto !max-h-max w-[90%] max-w-screen-md bg-primary text-white"
  >
    <template #container="{ closeCallback }">
      <div class="rounded-[8px] bg-white p-4">
        <Textarea
          v-model="message"
          type="text"
          placeholder="Nhập chủ đề"
          class="min-h-[120px] w-full"
        />
        <Button
          :loading="suggestQuestionRequest?.isPending?.value"
          icon="pi pi-sparkles"
          label="Gợi ý"
          @click="handleSuggestQuestion()"
          class="mt-[16px] w-full"
        />

        <div class="mt-[24px] min-h-[300px] space-y-[16px]">
          <QuizQuestionCard
            v-for="(question, i) in questions"
            :question="question"
            :classWrapper="
              cn(question?.selected ? 'border-primary border-2' : '')
            "
            :key="question?.id || i"
            @click="handleSelectQuestion(i)"
          />
        </div>
        <div class="mt-[40px] flex items-center justify-end gap-4">
          <Button label="Đóng" @click="closeCallback" text class="" />
          <Button label="Lưu" @click="handleSubmit()" class="" />
        </div>
      </div>
    </template>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
</template>
