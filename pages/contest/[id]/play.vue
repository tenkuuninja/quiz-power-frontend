<script setup lang="ts">
import { useContestStore } from '~/stores'

const route = useRoute()
const router = useRouter()
const contestStore = useContestStore()

const contestId = computed(() => route?.params?.id as string)
const contest = computed(() => contestStore?.getContest(contestId.value))
const playerId = computed(() => contestStore?.getPlayerId(contestId.value))
const player = computed(() =>
  contest?.value?.players?.find(
    (player: any) => player?.id === playerId?.value,
  ),
)

onMounted(() => {
  if (contest?.value?.status === 'Idle') {
    router.push(`/contest/${contestId.value}/join`)
  }
})
</script>

<template>
  <ContestSubscribeSocketEvent />
  <ContestLoadingWrapper>
    <ContestPlayHeader :contestId="contestId" />
    <ContestPlayQuestionWrapper
      v-if="contest?.contestQuiz?.questions?.length > player?.answers?.length"
      :contestId="contestId"
    />
    <div
      v-if="contest?.status !== 'Ended' && contest?.contestQuiz?.questions?.length === player?.answers?.length"
      :contestId="contestId"
      class="flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center text-center"
    >
      <p class="text-[32px] font-bold">Đã hoàn thành!</p>
      <p class="text-[20px]">Vui lòng chờ người tổ chức kết thúc cuộc thi!</p>
    </div>

    <ContestAdminDashboardPlayerScore
      v-if="contest?.status === 'Ended'"
      :contestId="contestId"
    />
  </ContestLoadingWrapper>
</template>
