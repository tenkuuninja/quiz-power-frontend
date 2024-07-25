<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { QuizApi } from "~/services";

const route = useRoute();
const quizId = computed(() => +route?.params?.id);

const router = useRouter()

const loading = ref(false)

const quizDetailRequest = useQuery({
  queryKey: ['quiz-detail', quizId],
  queryFn: async () => {
    const response = await QuizApi.getDetailQuiz({ id: quizId.value })
    return response
  },
})

const quiz = computed(() => quizDetailRequest?.data?.value?.data)

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="bg-white rounded-[8px] p-[16px]">
    <div class="flex justify-between items-center">
      <h2 class="text-[40px] font-bold">Chi tiết Quiz</h2>
      <NuxtLink to="/dashboard/quiz">
        <Button label="Quay lại" />
      </NuxtLink>
    </div>
    <div class="mt-[32px]">
      <QuizDetail :quiz="quiz" />
    </div>
  </div>
</template>
