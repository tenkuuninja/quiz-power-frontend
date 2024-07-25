<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'
import { useContestStore } from '~/stores'

const toast = useToast()

const validationSchema = yup.object({
  name: yup.string().trim().required('Đây là trường bắt buộc'),
})

interface IQuestionEditFormProps {
  contestId: string
}

interface IQuestionEditFormEmits {
  (eventName: 'submit', question: any): void
}

const props = defineProps<IQuestionEditFormProps>()
const emit = defineEmits<IQuestionEditFormEmits>()

const form = useForm({
  validationSchema: validationSchema,
})
const contestStore = useContestStore()

const { contestId } = toRefs(props)

const contest = computed(() => contestStore?.getContest(contestId.value))

const endContestRequest = useMutation({
  mutationFn: ContestApi.endContest,
})

const handleSubmit = async () => {
  try {
    await endContestRequest.mutateAsync({
      contestId: props?.contestId,
    })

    toast.add({
      severity: 'success',
      summary: 'Cuộc thi đã kết thúc!',
      life: 3000,
    })
  } catch (error) {
    //
    console.log(error)
  }
}
</script>

<template>
  <div class="fixed left-0 top-0 z-[10] w-full bg-slate-900 backdrop-blur">
    <div
      class="container flex h-[72px] items-center justify-between space-x-[16px]"
    >
      <div class="flex items-center">
        <IcQuizPower width="60" class="text-primary" />
        <span class="ml-[8px] text-[40px] font-black">
          <span class="text-white">Quiz</span>
          <span class="text-primary">Power</span>
        </span>
      </div>
      <div class="flex-grow"></div>
      <div
        class="rounded-[8px] border border-primary px-[16px] text-[18px] font-medium leading-[36px] text-white"
      >
        {{ contest?.joinCode }}
      </div>
      <Button
        :loading="endContestRequest.isPending.value"
        v-if="contest?.status !== 'Ended'"
        label="End"
        severity="danger"
        @click="handleSubmit()"
      />
    </div>
  </div>
  <div class="h-[72px]"></div>
</template>
