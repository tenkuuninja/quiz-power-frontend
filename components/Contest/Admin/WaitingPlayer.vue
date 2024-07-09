<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, defineProps } from "vue";
import { ContestApi, QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";
import { BASE_URL } from "~/common/constants/app";
import { useContestStore } from "~/stores";
import copy from "copy-to-clipboard";
import { useToast } from "primevue/usetoast";

const validationSchema = yup.object({
  name: yup.string().trim().required("Đây là trường bắt buộc"),
});

interface IQuestionEditFormProps {
  contestId: string;
}

interface IQuestionEditFormEmits {
  (eventName: "submit", question: any): void;
}

const props = defineProps<IQuestionEditFormProps>();
const emit = defineEmits<IQuestionEditFormEmits>();

const form = useForm({
  validationSchema: validationSchema,
});
const contestStore = useContestStore();

const toast = useToast();

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

const handleCopy = async (text: string) => {
  copy(text, {
    message: "copied",
  });

  // toast.info("Copied");

  toast.add({
    severity: "info",
    summary: "Copied",
    life: 3000,
  });
};
</script>

<template>
  <div class="py-4">
    <div
      class="bg-black/80 rounded-[8px] p-[16px] mx-auto max-w-[500px] border border-slate-700 text-slate-50"
    >
      <div class="flex items-center space-x-[16px] justify-between">
        <span class="w-[80px]">Join link</span>
        <span class="text-[32px] font-bold">quizpower.com/join</span>
        <button
          class="pi pi-clone text-white text-[20px]"
          @click="handleCopy(`${BASE_URL}/contest/${contest?.id}/join`)"
        ></button>
      </div>
      <div class="mt-[20px] flex items-center space-x-[16px] justify-between">
        <span class="w-[80px]">Enter code</span>
        <span class="font-bold text-[52px] tracking-wider">
          {{ contest?.joinCode }}
        </span>
        <button
          class="pi pi-clone text-white text-[20px]"
          @click="handleCopy(contest?.joinCode)"
        ></button>
      </div>
    </div>
    <div
      class="bg-black/80 rounded-b-[8px] p-[16px] mx-auto w-[80%] max-w-[400px] border border-t-0 border-slate-700 text-slate-50"
    >
      <Button
        label="Start"
        size="large"
        @click="handleSubmit()"
        class="w-full block"
      />
    </div>

    <div class="mt-[32px] text-center">
      <div
        class="bg-black/80 border border-slate-800 rounded-full px-[32px] py-[12px] inline-flex items-center mx-auto text-[24px] text-white font-bold"
      >
        {{ contest?.players?.length || 0 }} Member Joined
      </div>
      <div class="mt-[20px] flex flex-wrap justify-center gap-[16px]">
        <div
          class="bg-black/80 border border-slate-800 rounded-full p-[12px] flex items-center"
          v-for="player of contest?.players || []"
          :key="player?.id"
        >
          <img
            :src="`/assets/contest/avatar/avataaars-${player?.avatar}.svg`"
            alt=""
            class="w-[32px] mt-[-6px]"
          />
          <p class="text-[20px] text-white ml-[12px] font-bold pr-[12px]">
            {{ player?.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>
