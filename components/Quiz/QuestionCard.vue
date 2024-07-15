<script setup lang="ts">
import { EQuestionType } from '~/common/enum/entity'

interface IProps {
  question: any
  classWrapper?: string
}

interface IEmits {
  (eventName: 'click'): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { question, classWrapper } = toRefs(props)

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

const questionType =
  questionTypeOptions?.find(
    (type) => type?.value === question?.value?.questionType,
  ) || questionTypeOptions[0]
</script>

<template>
  <div
    :key="question?.id || i"
    :class="
      cn(
        'cursor-pointer rounded-[8px] border border-slate-200 p-[16px] text-black',
        classWrapper,
      )
    "
    @click="emit('click')"
  >
    <div
      class="inline-block rounded-[4px] bg-primary-500 px-[4px] text-[12px] text-white"
    >
      {{ questionType?.label }}
    </div>
    <div class="mt-[4px]" v-html="question?.content" />
    <div class="mt-[16px] flex flex-wrap gap-[16px]">
      <div
        v-for="(option, j) in question?.options"
        :key="option?.id || j"
        class="flex w-[calc(50%-8px)] items-center space-x-[16px]"
      >
        <div
          :class="
            cn(
              'h-[12px] w-[12px] rounded-full',
              option?.isCorrect ? 'bg-green-500' : 'bg-red-500',
            )
          "
        ></div>
        <span>
          {{ option?.content }}
        </span>
      </div>
    </div>
  </div>
</template>
