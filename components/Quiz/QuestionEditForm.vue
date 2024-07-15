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

const updateQuestionSchema = yup.object({
  id: yup.number().nullable().optional(),
  content: yup.string().trim().required('Trường này không được bỏ trống'),
  questionType: yup
    .string()
    .trim()
    .required('Trường này không được bỏ trống')
    .default(EQuestionType.SingleChoice),
  answerLength: yup.number().nullable().optional(),
  options: yup
    .array(
      yup.object({
        id: yup.number().nullable().optional(),
        content: yup.string().trim().required('Trường này không được bỏ trống'),
        isCorrect: yup.boolean().default(false),
      }),
    )
    .required(),
})

interface IQuestionSchema extends yup.Asserts<typeof updateQuestionSchema> {}

interface IQuestionEditFormProps {
  open: boolean
  question: any
  quizId: number
  onClose: VoidFunction
}

interface IQuestionEditFormEmits {
  (eventName: 'submit', question: any): void
}

const props = defineProps<IQuestionEditFormProps>()
const emit = defineEmits<IQuestionEditFormEmits>()

const form = useForm<IQuestionSchema>({
  validationSchema: updateQuestionSchema,
})
const { values, defineField, isSubmitting, resetForm } = toRefs(form)

const suggestAnswerRequest = useMutation({
  mutationFn: QuizApi.suggestionAnswer,
})

const { open, question, onClose } = toRefs(props)

console.log('props', props?.open, props?.question)

const questionType = computed(() => values?.value?.questionType)
const optionArray = computed(() => {
  if (values?.value?.questionType === EQuestionType.TextEntryWithLength) {
    return [null]
  }
  return [
    ...new Array(
      (values?.value?.options?.length || 0) >= 4
        ? values?.value?.options?.length
        : 4,
    ),
  ]
})

const questionTypeOptions = [
  {
    label: 'Một lựa chọn',
    value: EQuestionType.SingleChoice,
  },
  {
    label: 'Nhiều lựa chọn',
    value: EQuestionType.MultipleChoice,
  },
  {
    label: 'Nhập',
    value: EQuestionType.TextEntryWithLength,
  },
]

const handleSetIsCorrect = (index: number) => {
  let options =
    form.values?.options?.map((option: any) => ({ ...option })) || []
  if (form.values?.questionType === EQuestionType.SingleChoice) {
    options = options?.map((option: any) => ({ ...option, isCorrect: false }))
    options[index].isCorrect = true
    form.setFieldValue('options', options)
  }
  if (form.values?.questionType === EQuestionType.MultipleChoice) {
    console.log(options[index].isCorrect, !options[index].isCorrect)
    options[index].isCorrect = !options[index].isCorrect
    console.log(options[index].isCorrect)
    form.setFieldValue('options', [...options])
  }
}

const handleRemoveOption = (index: number) => {
  let options =
    form.values?.options?.map((option: any) => ({ ...option })) || []
  options[index].content = ''
  form.setFieldValue('options', options)
}

const handleSuggestAnswer = async () => {
  if (!form.values?.content) {
    toast.add({
      severity: 'info',
      summary: 'Please enter question content!',
      life: 3000,
    })
    return
  }
  const handleGet = async () => {
    try {
      const response = await suggestAnswerRequest.mutateAsync({
        message: form.values?.content,
        type: form.values?.questionType,
      })
      form.setFieldValue('options', response?.data)
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Please try again!',
        life: 3000,
      })
    }
  }
  const options = form.values?.options?.filter(
    (option: any) => !!option?.content,
  )
  if (options?.length) {
    confirm.require({
      header: "You've some options",
      message: 'All your options will be replaced',
      rejectLabel: 'Cancel',
      acceptLabel: 'Replace',
      accept: handleGet,
      reject: () => {},
    })
  } else {
    handleGet()
  }
}

const handleSubmit = () => {
  const options = form.values?.options?.filter(
    (option: any) => !!option?.content,
  )
  if (!options?.length) {
    toast.add({
      severity: 'error',
      summary: 'Hãy nhập đáp án cho câu hỏi này!',
      life: 3000,
    })
    return
  }
  const hasSelected = !!options?.find((option: any) => !!option?.isCorrect)
  if (!hasSelected) {
    toast.add({
      severity: 'error',
      summary: 'Hãy chọn đáp án cho câu hỏi này!',
      life: 3000,
    })
    return
  }
  emit('submit', { ...form.values, options })
}

watch([open, question], () => {
  if (props?.question) {
    const question = props?.question
    form.resetForm({
      values: {
        questionType: EQuestionType.SingleChoice,
        ...question,
      },
    })
  } else {
    form.resetForm({
      values: {
        content: '',
        questionType: EQuestionType.SingleChoice,
        options: [],
      },
    })
  }
})

watch(
  [questionType, open],
  ([newQuestionType, oldOpen], [oldQuestionType, newOpen]) => {
    if (oldOpen === newOpen) {
      if (newQuestionType === EQuestionType.TextEntryWithLength) {
        form.setFieldValue('options', [
          {
            isCorrect: true,
            content: '',
          },
        ])
      } else {
        form.setFieldValue(
          'options',
          values?.value?.options?.map((option: any) => ({
            ...option,
            isCorrect: false,
          })),
        )
      }
    }
  },
)
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
        <Field name="content" v-slot="{ field, errorMessage }" class="456">
          <Textarea
            v-bind="field"
            type="text"
            placeholder="Nhập câu hỏi"
            class="min-h-[120px] w-full text-[20px]"
          />
          <p v-if="errorMessage" class="text-[12px] text-red-600">
            {{ errorMessage }}
          </p>
        </Field>
        <div class="mt-[24px] flex flex-wrap gap-[16px]">
          <div
            class="flex max-w-full flex-wrap gap-[4px] overflow-x-auto rounded-[8px] border border-primary p-[4px]"
          >
            <div
              v-for="type in questionTypeOptions"
              :key="type?.value"
              :class="
                cn(
                  `w-[calc(50%-2px)] cursor-pointer rounded-[4px] px-[8px] py-[2px] text-center transition-all md:w-auto`,
                  type?.value === values?.questionType
                    ? 'bg-primary/80'
                    : 'text-primary',
                )
              "
              @click="form.setFieldValue('questionType', type.value)"
            >
              {{ type?.label }}
            </div>
          </div>
          <button
            :disabled="suggestAnswerRequest.isPending.value"
            class="flex h-[32px] w-[32px] cursor-pointer items-center justify-center text-primary"
            type="button"
            v-if="
              form.values.questionType === EQuestionType.SingleChoice ||
              form.values.questionType === EQuestionType.MultipleChoice
            "
            @click="handleSuggestAnswer"
          >
            <span
              class="pi pi-sparkles"
              v-if="!suggestAnswerRequest.isPending.value"
            ></span>
            <span
              class="pi pi-spinner animate-spin"
              v-if="suggestAnswerRequest.isPending.value"
            ></span>
          </button>
        </div>
        <div class="mt-[24px] space-y-[16px]">
          <div
            v-for="(_, i) in optionArray"
            :key="i"
            :class="
              cn(
                'flex items-center justify-between rounded-[8px] bg-primary-100 p-[16px]',
              )
            "
          >
            <div
              :class="
                cn(
                  'flex h-[24px] w-[24px] cursor-pointer items-center justify-center',
                  values?.questionType === EQuestionType.MultipleChoice
                    ? 'rounded-[4px]'
                    : 'rounded-full',
                  values?.options[i]?.isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white',
                )
              "
              @click="handleSetIsCorrect(i)"
            >
              <span
                :class="
                  cn(
                    'pi',
                    values?.options[i]?.isCorrect ? 'pi-check' : 'pi-times',
                  )
                "
              ></span>
            </div>
            <Field :name="`options.${i}.content`" v-slot="{ field }">
              <input
                v-bind="field"
                type="text"
                class="min-h-[40px] w-[calc(100%-20px-20px-16px*2)] px-[16px] text-[20px] text-slate-900 placeholder:text-slate-500"
                placeholder="Nhập lựa chọn"
              />
            </Field>
            <div
              class="flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
              @click="handleRemoveOption(i)"
            >
              <span class="pi pi-trash text-red-500"></span>
            </div>
          </div>
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
