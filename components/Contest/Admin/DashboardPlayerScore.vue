<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, defineProps } from "vue";
import { ContestApi, QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";
import { EQuestionType } from "~/common/enum/entity";
import { useContestStore } from "~/stores";

const validationSchema = yup.object({
  name: yup.string().trim().required("Đây là trường bắt buộc"),
});

interface IProps {
  contestId: string;
}

interface IEmits {
  (eventName: "submit", question: any): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const form = useForm({
  validationSchema: validationSchema,
});
const contestStore = useContestStore();

const { contestId } = toRefs(props);

const contest = computed(() => contestStore?.getContest(contestId.value));

const handleSubmit = async () => {
  try {
    await ContestApi.startContest({
      contestId: props?.contestId,
    });
  } catch (error) {
    //
    console.log(error);
  }
};
</script>

<template>
  <div class="p-4 min-h-screen">
    <div class="container text-white bg-slate-900/50 w-full p-4 min-h-[500px]">
      <table class="w-full">
        <thead>
          <tr>
            <th>Player</th>
            <th>Rank</th>
            <th>Score</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player of contest?.players" :key="player?.id">
            <td>
              <div class="flex items-center">
                <img
                  :src="`/assets/contest/avatar/avataaars-${player?.avatar}.svg`"
                  alt=""
                  class="w-[32px] mt-[-6px]"
                />
                <p class="text-[20px] text-white ml-[12px] font-bold pr-[12px]">
                  {{ player?.name }}
                </p>
              </div>
            </td>
            <td class="text-center">{{ player?.rank || 1 }}</td>
            <td class="text-center">{{ player?.score }}</td>
            <td class="text-center">{{ player?.streak }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
