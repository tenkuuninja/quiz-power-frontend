<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, defineProps } from "vue";
import { ContestApi, QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";
import { EQuestionType } from "~/common/enum/entity";

const validationSchema = yup.object({
  name: yup.string().trim().required("Đây là trường bắt buộc"),
});

interface IQuestionEditFormProps {
  contestId: string;
  player: any;
}

const props = defineProps<IQuestionEditFormProps>();

const form = useForm({
  validationSchema: validationSchema,
});

const { contestId, player } = toRefs(props);

const handleSubmit = async () => {
  try {
    await ContestApi.joinContest({
      contestId: props?.contestId,
      ...form.values,
    });
  } catch (error) {
    //
    console.log(error);
  }
};
</script>

<template>
  <div
    class="p-4 flex flex-col items-center justify-center min-h-screen bg-slate-950"
  >
    <div
      class="max-w-[500px] w-full items-center bg-slate-800 rounded-[8px] p-[16px] flex"
    >
      <img
        :src="`/assets/contest/avatar/avataaars-${player?.avatar}.svg`"
        alt=""
        class="w-[100px]"
      />
      <div class="text-white ml-[16px]">
        <p class="text-[24px] font-bold">{{ player?.name }}</p>
        <p class="text-[18px] mt-[12px]">Waiting host start...</p>
      </div>
    </div>
  </div>
</template>
