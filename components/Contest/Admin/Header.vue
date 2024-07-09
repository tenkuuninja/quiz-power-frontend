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

const { contestId } = toRefs(props);

const contest = computed(() => contestStore?.getContest(contestId.value));

const handleSubmit = async () => {
  try {
    await ContestApi.endContest({
      contestId: props?.contestId,
    });
  } catch (error) {
    //
    console.log(error);
  }
};
</script>

<template>
  <div class="fixed top-0 left-0 w-full bg-black/70 backdrop-blur z-[10]">
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
      <div
        class="border-primary border text-white font-medium text-[18px] rounded-[8px] leading-[36px] px-[16px]"
      >
        {{ contest?.joinCode }}
      </div>
      <Button label="End" severity="danger" @click="handleSubmit()" />
    </div>
  </div>
  <div class="h-[72px]"></div>
</template>
