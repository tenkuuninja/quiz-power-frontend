<script setup lang="ts">
import { useContestStore } from "~/stores";

const route = useRoute();
const router = useRouter();
const contestStore = useContestStore();

const showCountdown = ref(false);
const countdown = ref(5);

const contestId = computed(() => route?.params?.id as string);
const contest = computed(() => contestStore?.getContest(contestId.value));
const playerId = computed(() => contestStore?.getPlayerId(contestId.value));
const player = computed(() =>
  contest?.value?.players?.find((player: any) => player?.id === playerId?.value)
);

watch(
  [contest],
  ([newContest], [oldContest]) => {
    let interval: NodeJS.Timeout;

    if (oldContest?.status === "Idle" && newContest?.status === "Started") {
      showCountdown.value = true;
      interval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          router.push(`/contest/${contestId.value}/play`);
        }
      }, 1000);
    } else if (newContest?.status === "Started") {
      router.push(`/contest/${contestId.value}/play`);
    }

    return () => {
      clearInterval(interval);
    };
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <ContestSubscribeSocketEvent />
  <ContestLoadingWrapper>
    <ContestJoinPlayerProfileForm v-if="!player" :contestId="contestId" />
    <ContestJoinWaitingScreen
      v-if="!!player"
      :contestId="contestId"
      :player="player"
    />
    <ContestJoinCountDown v-if="showCountdown" :value="countdown" />
  </ContestLoadingWrapper>
</template>
