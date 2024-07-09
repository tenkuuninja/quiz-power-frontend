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
const selectedOptions = ref([] as any[]);
const startedAt = ref(dayjs().toISOString());
const submitted = ref(false);

const handlePink = async (option: any) => {
  if (submitted.value) {
    return;
  }
  console.log(selectedOptions?.value, option);
  if (selectedOptions.value.find((op) => op?.id === option?.id)) {
    selectedOptions.value = selectedOptions.value?.filter(
      (op) => op?.id !== option?.id
    );
  } else {
    selectedOptions.value = [...selectedOptions.value, option];
  }
};

const handleSubmit = async () => {
  if (submitted.value) {
    return;
  }
  try {
    submitted.value = true;

    await sleep(1000);
    await ContestApi.submitAnswer({
      contestId: props?.contestId,
      playerId: props?.playerId,
      contestQuestionId: props?.question?.id,
      optionIds: selectedOptions?.value?.map((op) => op?.id),
      content: null,
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
  selectedOptions.value = [];
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
    <div
      v-for="(option, i) of props?.question?.options || []"
      :key="i"
      :class="
        cn(
          'h-[100px] w-[calc(50%-8px)] flex justify-center items-center text-center rounded-[8px] text-white text-[24px] font-medium transition-all',
          backgroundColors[i % backgroundColors.length],
          !submitted &&
            selectedOptions?.find((sOption) => sOption?.id === option?.id)
            ? 'bg-green-500'
            : '',
          submitted &&
            selectedOptions?.find((sOption) => sOption?.id === option?.id)
              ?.isCorrect
            ? 'bg-green-500'
            : '',
          submitted &&
            selectedOptions?.find((sOption) => sOption?.id === option?.id) &&
            !selectedOptions?.find((sOption) => sOption?.id === option?.id)
              ?.isCorrect
            ? 'bg-red-500'
            : ''
        )
      "
      @click="handlePink(option)"
    >
      {{ option?.content }}
    </div>
  </div>
  <div class="mt-[16px]">
    <Button class="block mx-auto" @click="handleSubmit">Submit</Button>
  </div>
</template>
