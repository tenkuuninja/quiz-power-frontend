<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'
import { useContestStore } from '~/stores'
import dayjs from 'dayjs'

const contestStore = useContestStore()

const validationSchema = yup.object({
  name: yup.string().trim().required('Đây là trường bắt buộc'),
})

interface IProps {
  contestId: string
  playerId: string
  question: any
}

interface IEmits {
  (eventName: 'next'): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const form = useForm({
  validationSchema: validationSchema,
})

const { contestId } = toRefs(props)
const questionId = computed(() => props.question)
const selectedOptions = ref([] as any[])
const startedAt = ref(dayjs().toISOString())
const submitted = ref(false)

const handlePick = async (option: any) => {
  if (submitted.value) {
    return
  }
  try {
    submitted.value = true
    selectedOptions.value = [option]

    await sleep(500)
    await ContestApi.submitAnswer({
      contestId: props?.contestId,
      playerId: props?.playerId,
      contestQuestionId: props?.question?.id,
      optionIds: [option?.id],
      content: null,
      startedAt: startedAt.value,
    })
    await sleep(1000)
    emit('next')
  } catch (error) {
    //
    console.log(error)
  }
}

watch([questionId], () => {
  startedAt.value = dayjs().toISOString()
  submitted.value = false
  selectedOptions.value = []
})

const isSelected = (optionId: number) => {
  return (
    !submitted.value &&
    selectedOptions?.value?.find((sOption) => sOption?.id === optionId)
  )
}

const isSelectCorrect = (optionId: number) => {
  return (
    submitted.value &&
    selectedOptions?.value?.find((sOption) => sOption?.id === optionId)
      ?.isCorrect
  )
}

const isSelectWrong = (optionId: number) => {
  return (
    submitted.value &&
    selectedOptions?.value?.find((sOption) => sOption?.id === optionId) &&
    !selectedOptions?.value?.find((sOption) => sOption?.id === optionId)
      ?.isCorrect
  )
}
</script>

<template>
  <div class="mt-[24px] flex flex-wrap gap-[16px]">
    <div
      v-for="(option, i) of props?.question?.options || []"
      :key="i"
      :class="
        cn(
          'flex h-[100px] w-[calc(50%-8px)] items-center justify-between rounded-[8px] px-[16px] text-center text-[24px] font-medium text-slate-900 transition-all',
          'bg-primary-100',
          isSelected(option?.id) ? 'bg-primary-300' : '',
          isSelectCorrect(option?.id) ? 'bg-green-500 text-white' : '',
          isSelectWrong(option?.id) ? 'bg-red-500 text-white' : '',
        )
      "
      @click="handlePick(option)"
    >
      <div
        :class="
          cn(
            'flex h-[68px] w-[68px] items-center justify-center rounded-[8px] bg-primary text-[32px] font-bold text-white',
            isSelectCorrect(option?.id) ? 'bg-green-500' : '',
            isSelectWrong(option?.id) ? 'bg-red-500' : '',
          )
        "
      >
        {{ i + 1 }}
      </div>
      <span class="w-[calc(100%-80px-16px)]">
        {{ option?.content }}
      </span>
    </div>
  </div>
</template>
