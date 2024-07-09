<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, defineProps } from "vue";
import { ContestApi, QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";
import { EQuestionType } from "~/common/enum/entity";
import { useContestStore } from "~/stores";

interface IQuestionEditFormProps {
  contestId: string;
}

const props = defineProps<IQuestionEditFormProps>();

const contestStore = useContestStore();

const { contestId } = toRefs(props);

const contest = computed(() => contestStore?.getContest(contestId.value));
const playerId = computed(() => contestStore?.getPlayerId(contestId.value));
const player = computed(() =>
  contest?.value?.players?.find((player: any) => player?.id === playerId?.value)
);
</script>

<template>
  <div class="fixed top-0 left-0 w-full bg-slate-950">
    <div
      class="container h-[72px] flex items-center justify-between space-x-[16px]"
    >
      <div class="flex items-center">
        <IcQuizPower width="60" class="text-primary" />
        <span class="text-[40px] font-black ml-[8px]">
          <span class="text-white">Quiz</span>
          <span class="text-primary">Power</span>
        </span>
      </div>
      <div class="flex-grow"></div>
      <div class="text-center px-[16px]">
        <p class="text-blue-500 font-semibold leading-none">Rank</p>
        <p class="text-blue-600 text-[32px] font-black leading-none">1</p>
      </div>
      <div class="text-center px-[16px]">
        <p class="text-green-500 font-semibold leading-none">Score</p>
        <p class="text-green-600 text-[32px] font-black leading-none">
          {{ player?.score }}
        </p>
      </div>
      <div class="text-center px-[16px]">
        <p class="text-orange-500 font-semibold leading-none">Streak</p>
        <p class="text-orange-600 text-[32px] font-black leading-none">
          {{ player?.streak }}
        </p>
      </div>
      <div class="flex items-center">
        <img
          :src="`/assets/contest/avatar/avataaars-${player?.avatar}.svg`"
          alt=""
          class="w-[40px] mt-[-8px]"
        />
        <p class="text-[24px] text-white ml-[12px] font-bold pr-[12px]">
          {{ player?.name }}
        </p>
      </div>
    </div>
  </div>
  <div class="h-[72px]"></div>
</template>
