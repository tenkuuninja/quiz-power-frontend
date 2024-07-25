<script setup>
const route = useRoute();
const quizId = +route?.params?.id;

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="bg-white rounded-[8px] p-[16px]">
    <div class="flex justify-between items-center">
      <h2 class="text-[40px] font-bold">Sửa Quiz</h2>
      <NuxtLink to="/dashboard/quiz">
        <Button label="Quay lại" />
      </NuxtLink>
    </div>
    <div class="mt-[32px]">
      <QuizUpdateForm :quizId="quizId" />
    </div>
  </div>
</template>
