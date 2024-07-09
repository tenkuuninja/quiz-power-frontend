<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { QuizApi, CategoryApi, ContestApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";

const updateQuestionSchema = yup.object({
  id: yup.number().nullable().optional(),
  name: yup.string().trim().required("This field is required"),
  status: yup.boolean().nullable().optional(),
  visibility: yup.boolean().nullable().optional(),
  categories: yup.array().min(1, "Tối thiểu 1 danh mục").optional(),
});

interface IUpdateFormProps {
  quizId: number;
}

interface IUpdateFormEmits {
  (eventName: "submit"): void;
}

const props = defineProps<IUpdateFormProps>();
const emit = defineEmits<IUpdateFormEmits>();

const { quizId } = props;

const router = useRouter();

const loading = ref(false);

const quizDetailRequest = useQuery({
  queryKey: ["quiz-detail", ["quiz-detail", quizId].join("-")],
  queryFn: async () => {
    const response = await QuizApi.getDetailQuiz({ id: quizId });

    return response;
  },
});

const quiz = computed(() => quizDetailRequest?.data?.value?.data);

const handleCreateContest = async () => {
  loading.value = true;
  try {
    const createQuizResponse = await ContestApi.createContest({
      quizId: +quizId,
    });
    const contestId = createQuizResponse?.data?.id;
    window.open(`/contest/${contestId}/admin`);
  } catch (error) {
    //
  }
  loading.value = false;
};
</script>

<template>
  <span v-if="quizDetailRequest.isPending?.value" class="">Loading...</span>
  <div v-if="quizDetailRequest.isSuccess?.value" class="">
    <h1>{{ quiz?.name }}</h1>
    <div class="flex flex-wrap gap-[4px]">
      <Chip
        v-for="(category, i) in quiz?.categories"
        :key="category?.id || i"
        :label="category?.name"
      />
    </div>
    <div>
      <Button @click="handleCreateContest()">Create a game</Button>
    </div>
    <div class="space-y-[16px]">
      <div
        v-for="(question, i) in quiz?.questions"
        :key="question?.id || i"
        class="p-[16px] shadow rounded-[8px]"
      >
        <div>{{ question?.content }}</div>
        <div class="flex flex-wrap gap-[16px] mt-[16px]">
          <div
            v-for="(option, j) in question?.options"
            :key="option?.id || j"
            class="w-[calc(50%-8px)] flex items-center space-x-[16px]"
          >
            <div
              :class="
                cn(
                  'w-[12px] h-[12px] rounded-full',
                  option?.isCorrect ? 'bg-green-500' : 'bg-red-500'
                )
              "
            ></div>
            <span>
              {{ option?.content }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
