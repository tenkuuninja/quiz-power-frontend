<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, defineProps } from "vue";
import { ContestApi, QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";
import { EQuestionType } from "~/common/enum/entity";
import { useContestStore } from "~/stores";
import dayjs from "dayjs";

const contestStore = useContestStore();

const validationSchema = yup.object({
  name: yup.string().trim().required("Đây là trường bắt buộc"),
});

interface IProps {
  contestId: string;
  playerId: string;
  question: any;
}

interface IEmits {
  (eventName: "next"): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const form = useForm({
  validationSchema: validationSchema,
});

const { contestId } = toRefs(props);
const questionId = computed(() => props.question);
const content = ref("");
const startedAt = ref(dayjs().toISOString());
const submitted = ref(false);

const handleSubmit = async () => {
  if (submitted.value) {
    return;
  }
  if (!content.value) {
    return;
  }
  try {
    submitted.value = true;

    await sleep(1000);
    await ContestApi.submitAnswer({
      contestId: props?.contestId,
      playerId: props?.playerId,
      contestQuestionId: props?.question?.id,
      optionIds: null,
      content: content.value,
      startedAt: startedAt.value,
    });
    await sleep(2000), emit("next");
  } catch (error) {
    //
    console.log(error);
  }
};

watch([questionId], () => {
  startedAt.value = dayjs().toISOString();
  submitted.value = false;
  content.value = '';
});

const backgroundColors = [
  "bg-teal-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-cyan-500",
];
</script>

<template>
  <div class="flex flex-wrap gap-[16px] mt-[24px]">
    <InputText
      id="email1"
      v-model="content"
      type="text"
      placeholder="Your answer"
      class="w-full md:w-30rem mb-5 max-w-[500px] mx-auto"
    />
  </div>

  <div class="mt-[16px]">
    <Button class="block mx-auto" @click="handleSubmit">Submit</Button>
  </div>
</template>
