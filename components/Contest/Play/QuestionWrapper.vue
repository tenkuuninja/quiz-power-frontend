<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'
import { useContestStore } from '~/stores'

const contestStore = useContestStore()

const validationSchema = yup.object({
  name: yup.string().trim().required('Đây là trường bắt buộc'),
})

interface IProps {
  contestId: string
}

interface IEmits {
  (eventName: 'success', question: any): void
}

const questions = ref([] as any[])
const currentQuestionIndex = ref(0)

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { contestId } = toRefs(props)

const contest = computed(() => contestStore?.getContest(contestId.value))
const playerId = computed(() => contestStore?.getPlayerId(contestId.value))
const player = computed(() =>
  contest?.value?.players?.find(
    (player: any) => player?.id === playerId?.value,
  ),
)

const currentQuestion = computed(
  () => questions?.value[currentQuestionIndex?.value],
)

const handleSubmit = async () => {
  try {
    const joinResponse = await ContestApi.joinContest({
      contestId: props?.contestId,
    })

    console.log(props?.contestId, joinResponse?.data?.id)

    contestStore.setPlayerIdByContestId(
      props?.contestId,
      joinResponse?.data?.id,
    )
  } catch (error) {
    //
    console.log(error)
  }
}

onMounted(() => {
  questions.value = contest?.value?.contestQuiz?.questions || []
  const answerLength = player.value.answers?.length
  currentQuestionIndex.value = answerLength
})
</script>

<template>
  <div class="min-h-[calc(100vh-72px)] bg-slate-100 p-4">
    <div
      class="flex min-h-[400px] items-center justify-center rounded-[16px] bg-primary-100/30 p-[16px] text-center text-[32px] text-black"
    >
      {{ currentQuestion?.content }}
    </div>
    <ContestPlayQuestionSingleChoice
      v-if="currentQuestion?.questionType === EQuestionType.SingleChoice"
      :contestId="contestId"
      :question="currentQuestion"
      :playerId="playerId"
      @next="
        () => {
          console.log('next', currentQuestionIndex)
          currentQuestionIndex += 1
        }
      "
    />
    <ContestPlayQuestionMultipleChoice
      v-if="currentQuestion?.questionType === EQuestionType.MultipleChoice"
      :contestId="contestId"
      :question="currentQuestion"
      :playerId="playerId"
      @next="
        () => {
          console.log('next', currentQuestionIndex)
          currentQuestionIndex += 1
        }
      "
    />
    <ContestPlayQuestionTextEntry
      v-if="currentQuestion?.questionType === EQuestionType.TextEntryWithLength"
      :contestId="contestId"
      :question="currentQuestion"
      :playerId="playerId"
      @next="
        () => {
          console.log('next', currentQuestionIndex)
          currentQuestionIndex += 1
        }
      "
    />
  </div>
</template>
