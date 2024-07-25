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

const validationSchema = yup.object({
  totalQuestion: yup
    .number()
    .required('Số câu hỏi phải trong khoảng từ 5 đến 10')
    .typeError('Số câu hỏi phải trong khoảng từ 5 đến 10')
    .min(5, 'Số câu hỏi phải trong khoảng từ 5 đến 10')
    .max(10, 'Số câu hỏi phải trong khoảng từ 5 đến 10'),
  message: yup.string().trim().required('Trường này không được bỏ trống'),
})

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
const totalQuestion = ref('')

const form = useForm({
  initialValues: {
    message: '',
    totalQuestion: '',
  },
  validationSchema: validationSchema,
})
const { values, defineField, isSubmitting, resetForm } = toRefs(form)

const suggestQuestionRequest = useMutation({
  mutationFn: QuizApi.suggestionQuestion,
  retry: 3,
})

const handleSuggestQuestion = form.handleSubmit(async (values) => {
  try {
    const suggestResponse = await suggestQuestionRequest.mutateAsync({
      message: values?.message,
      totalQuestion: +values?.totalQuestion,
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
})

const handleSelectQuestion = async (index: number) => {
  if (questions.value[index]) {
    questions.value[index].selected = !questions.value[index]?.selected
  }
}

const handleSubmit = async () => {
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
    class="mx-auto !max-h-max w-[90%] max-w-screen-md bg-primary"
  >
    <template #container="{ closeCallback }">
      <div class="rounded-[8px] bg-white p-4">
        <div class="space-y-[4px]">
          <Field name="message" v-slot="{ field, errorMessage }">
            <label class="font-semibold">Chủ đề</label>
            <Textarea
              v-bind="field"
              type="text"
              placeholder="Nhập chủ đề"
              class="min-h-[120px] w-full"
            />
            <p v-if="errorMessage" class="text-[12px] text-red-600">
              {{ errorMessage }}
            </p>
          </Field>
        </div>
        <div class="mt-[16px] space-y-[4px]">
          <Field name="totalQuestion" v-slot="{ field, errorMessage }">
            <label class="font-semibold">Số câu hỏi</label>
            <InputText
              type="text"
              class="block w-full"
              v-bind="field"
              placeholder="Nhập số câu hỏi"
            />
            <p v-if="errorMessage" class="text-[12px] text-red-600">
              {{ errorMessage }}
            </p>
          </Field>
        </div>
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
