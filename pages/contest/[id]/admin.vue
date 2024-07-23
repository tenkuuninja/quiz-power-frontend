<script setup lang="ts">
import { useContestStore } from "~/stores";

const route = useRoute();
const contestStore = useContestStore();

const showCountdown = ref(false);
const countdown = ref(5);

const contestId = computed(() => route?.params?.id as string);
const contest = computed(() => contestStore?.getContest(contestId.value));

onMounted(() => {});

watch([contest], ([newContest], [oldContest]) => {
  let interval: NodeJS.Timeout;
  if (oldContest?.status === "Idle" && newContest?.status === "Started") {
    showCountdown.value = true;
    interval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        showCountdown.value = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  return () => {
    clearInterval(interval);
  };
});
</script>

<template>
  <ContestSubscribeSocketEvent />
  <ContestLoadingWrapper>
    <div class="bg-primary-50">
      <div class="bg-black/10 min-h-screen">
        <ContestAdminHeader :contestId="contestId" />
        <ContestAdminWaitingPlayer
          v-if="contest?.status === 'Idle'"
          :contestId="contestId"
        />
        <ContestAdminDashboardPlayerScore
          v-if="contest?.status === 'Started' || contest?.status === 'Ended'"
          :contestId="contestId"
        />
        <ContestJoinCountDown v-if="showCountdown" :value="countdown" />
      </div>
    </div>
  </ContestLoadingWrapper>
</template>
