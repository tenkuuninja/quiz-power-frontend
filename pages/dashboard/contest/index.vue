<script setup>
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { ContestApi, QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import dayjs from "dayjs";

const confirm = useConfirm();

// Query
const getListContestRequest = useQuery({
  queryKey: ["contests"],
  queryFn: () => ContestApi.getListContest(),
});

const contests = computed(() => getListContestRequest?.data?.value?.data);

watchEffect(() => {
  console.log(getListContestRequest?.isPending?.value);
});

const router = useRouter();

const loading = ref(false);

const handleCreateQuiz = async () => {
  loading.value = true;
  try {
    const createQuizResponse = await QuizApi.createQuiz();
    const quizId = createQuizResponse?.data?.id;
    router.push({ path: `/dashboard/quiz/${quizId}/edit` });
  } catch (error) {
    //
  }
  loading.value = false;
};

const handleConfirmDelete = async (id) => {
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Confirmation",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: async () => {
      await QuizApi.deleteQuiz({ id });
      refetch();
    },
    reject: () => {},
  });
};

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="bg-white rounded-[8px] p-[16px]">
    <div class="flex justify-between items-center">
      <h2 class="text-[40px] font-bold">Cuộc thi</h2>
      <Button label="Add" @click="handleCreateQuiz()" />
    </div>
    <span v-if="getListContestRequest.isPending?.value">Loading...</span>
    <div v-if="!getListContestRequest.isPending?.value" class="card mt-[32px]">
      <DataTable :value="contests || []" tableStyle="min-width: 50rem">
        <!-- <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl text-surface-900 dark:text-surface-0 font-bold"
            >Products</span
          >
          <Button icon="pi pi-refresh" rounded raised />
        </div>
      </template> -->
        <Column field="name" header="Quiz Name">
          <template #body="slotProps">
            <p class="line-clamp-2">
              {{ slotProps.data.contestQuiz.name || "Untitle" }}
            </p>
          </template>
        </Column>
        <Column field="rating" header="End At">
          <template #body="slotProps">
            {{ dayjs(slotProps?.data?.endAt).format("YYYY-MM-DD HH:mm") }}
          </template>
        </Column>
        <Column
          field="rating"
          header="Action"
          class="space-x-[16px] whitespace-nowrap text-right"
        >
          <template #body="slotProps">
            <NuxtLink :to="`/dashboard/contest/${slotProps?.data?.id}`">
              <span class="pi pi-eye text-primary cursor-pointer"></span>
            </NuxtLink>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>
