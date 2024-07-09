<script setup lang="ts">
import { useContestStore } from "~/stores";

const route = useRoute();
const contestStore = useContestStore();

const contestId = computed(() => route?.params?.id as string);
const contest = computed(() => contestStore?.getContest(contestId.value));
</script>

<template>
  <slot v-if="!!contest" />
</template>
