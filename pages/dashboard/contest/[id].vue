<script setup>

const route = useRoute();
const contestId = +route?.params?.id;


definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="bg-white rounded-[8px] p-[16px]">
    <div class="flex justify-between items-center">
      <h2 class="text-[40px] font-bold">Chi tiết cuộc thi</h2>
      <NuxtLink to="/dashboard/quiz">
        <Button label="Back" />
      </NuxtLink>
    </div>
    <div class="mt-[32px]">
      <ContestDetailRoot :contestId="contestId" />
    </div>
  </div>
</template>
