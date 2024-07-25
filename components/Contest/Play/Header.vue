<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'
import { useContestStore } from '~/stores'

interface IQuestionEditFormProps {
  contestId: string
}

const props = defineProps<IQuestionEditFormProps>()

const contestStore = useContestStore()

const { contestId } = toRefs(props)

const contest = computed(() => contestStore?.getContest(contestId.value))
const playerId = computed(() => contestStore?.getPlayerId(contestId.value))
const player = computed(() =>
  contest?.value?.players?.find(
    (player: any) => player?.id === playerId?.value,
  ),
)

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

const rank = computed(
  () =>
    sortedPlayers?.value?.findIndex(
      (sortedPlayer) => sortedPlayer?.id === playerId.value,
    ) + 1,
)
</script>

<template>
  <div class="fixed left-0 top-0 w-full bg-slate-900">
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
      <div class="px-[16px] text-center">
        <p class="font-semibold leading-none text-blue-500">Rank</p>
        <p class="text-[32px] font-black leading-none text-blue-600">
          {{ rank }}
        </p>
      </div>
      <div class="px-[16px] text-center">
        <p class="font-semibold leading-none text-green-500">Score</p>
        <p class="text-[32px] font-black leading-none text-green-600">
          {{ player?.score }}
        </p>
      </div>
      <div class="px-[16px] text-center">
        <p class="font-semibold leading-none text-orange-500">Streak</p>
        <p class="text-[32px] font-black leading-none text-orange-600">
          {{ player?.streak }}
        </p>
      </div>
      <div class="flex items-center">
        <img
          :src="`/assets/contest/avatar/avataaars-${player?.avatar}.svg`"
          alt=""
          class="mt-[-8px] w-[40px]"
        />
        <p class="ml-[12px] pr-[12px] text-[24px] font-bold text-white">
          {{ player?.name }}
        </p>
      </div>
    </div>
  </div>
  <div class="h-[72px]"></div>
</template>
