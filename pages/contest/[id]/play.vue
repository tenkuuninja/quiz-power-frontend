<script setup lang="ts">
import { useContestStore } from "~/stores";

const route = useRoute();
const router = useRouter();
const contestStore = useContestStore();

const contestId = computed(() => route?.params?.id as string);
const contest = computed(() => contestStore?.getContest(contestId.value));
const playerId = computed(() => contestStore?.getPlayerId(contestId.value));
const player = computed(() =>
  contest?.value?.players?.find((player: any) => player?.id === playerId?.value)
);

onMounted(() => {
  if (contest?.value?.status === "Idle") {
    router.push(`/contest/${contestId.value}/join`);
  }
});
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
      v-if="!(contest?.contestQuiz?.questions?.length > player?.answers?.length)"
      class="min-h-[calc(100vh-72px)] flex items-center justify-center text-[80px] font-bold bg-slate-900 text-white"
    >
      Completed!
    </div>
  </ContestLoadingWrapper>
</template>
