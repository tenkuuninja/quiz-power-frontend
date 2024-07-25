<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'
import { useContestStore } from '~/stores'

const validationSchema = yup.object({
  name: yup.string().trim().required('Đây là trường bắt buộc'),
})

interface IProps {
  contestId: string
}

interface IEmits {
  (eventName: 'submit', question: any): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const form = useForm({
  validationSchema: validationSchema,
})
const contestStore = useContestStore()

const { contestId } = toRefs(props)

const contest = computed(() => contestStore?.getContest(contestId.value))
const playerId = computed(() => contestStore?.getPlayerId(contestId.value))
const sortedPlayers = computed(() => {
  const players = [...contest?.value?.players]
  players.sort((p1: any, p2: any) => {
    if (p1?.score !== p2?.score) {
      return p2?.score - p1?.score
    }
    return p2?.name > p1?.name ? 1 : -1
  })
  return players
})

const handleSubmit = async () => {
  try {
    await ContestApi.startContest({
      contestId: props?.contestId,
    })
  } catch (error) {
    //
    console.log(error)
  }
}
</script>

<template>
  <div class="min-h-screen p-4">
    <div
      class="container min-h-[500px] w-full max-w-[1080px] rounded-[8px] bg-slate-900/10 p-4 text-slate-900"
    >
      <div>
        <div class="flex items-center justify-between pb-[8px] font-bold">
          <div class="w-[60px] text-center">Hạng</div>
          <div class="w-[400px]">Người tham gia</div>
          <div class="w-[100px] text-center">Điểm</div>
          <div class="w-[calc(100%-60px-400px-100px-16px*3)] text-center"></div>
        </div>
        <div class="divide-y divide-slate-400">
          <div
            v-for="(player, i) of sortedPlayers"
            :key="player?.id"
            class="flex items-center justify-between py-[16px]"
          >
            <div
              :class="
                cn(
                  'w-[60px] text-center',
                  playerId === player?.id && 'text-primary',
                )
              "
            >
              {{ i + 1 }}
            </div>
            <div class="w-[400px]">
              <div class="flex items-center">
                <img
                  :src="`/assets/contest/avatar/avataaars-${player?.avatar}.svg`"
                  alt=""
                  class="mt-[-6px] w-[32px]"
                />
                <p
                  :class="
                    cn(
                      'ml-[12px] pr-[12px] text-[20px] font-bold',
                      playerId === player?.id && 'text-primary',
                    )
                  "
                >
                  {{ player?.name }}
                </p>
              </div>
            </div>
            <div
              :class="
                cn(
                  'w-[100px] text-center',
                  playerId === player?.id && 'text-primary',
                )
              "
            >
              {{ player?.score }}
            </div>
            <div
              class="relative flex w-[calc(100%-60px-400px-100px-16px*3)] overflow-hidden rounded-[8px] bg-slate-700/50 text-center"
            >
              <p class="absolute px-[8px] leading-[24px] text-white">
                {{ player?.streak }}
              </p>
              <div
                class="flex h-[24px] items-center overflow-hidden rounded-[8px]"
                :style="{
                  width:
                    (player?.answers?.length /
                      contest?.contestQuiz?.questions?.length) *
                      100 +
                    '%',
                }"
              >
                <div
                  class="h-full bg-green-500 transition-all"
                  :style="{
                    width:
                      (player?.answers?.filter((ans) => ans?.isCorrect)
                        ?.length /
                        player?.answers?.length) *
                        100 +
                      '%',
                  }"
                ></div>
                <div
                  class="h-full bg-red-500 transition-all"
                  :style="{
                    width:
                      (player?.answers?.filter((ans) => !ans?.isCorrect)
                        ?.length /
                        player?.answers?.length) *
                        100 +
                      '%',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
