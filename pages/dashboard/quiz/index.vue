<script setup>
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";

const confirm = useConfirm();

// Query
const { isPending, isSuccess, isError, data, error, refetch } = useQuery({
  queryKey: ["todos"],
  queryFn: () => QuizApi.getListQuiz(),
});

watchEffect(() => {
  console.log(isPending, isError, data, error);
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
      <h2 class="text-[40px] font-bold">Quiz</h2>
      <Button label="Add" @click="handleCreateQuiz()" />
    </div>
    <span v-if="isPending">Loading...</span>
    <div v-if="isSuccess" class="card mt-[32px]">
      <DataTable :value="data?.data || []" tableStyle="min-width: 50rem">
        <!-- <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl text-surface-900 dark:text-surface-0 font-bold"
            >Products</span
          >
          <Button icon="pi pi-refresh" rounded raised />
        </div>
      </template> -->
        <Column field="name" header="Name">
          <template #body="slotProps">
            <p class="line-clamp-2">
              {{ slotProps.data.name || "Untitle" }}
            </p>
          </template>
        </Column>
        <Column field="rating" header="Status">
          <template #body="slotProps">
            <Badge
              :value="slotProps?.data?.status === 1 ? 'Published' : 'Draft'"
            ></Badge>
          </template>
        </Column>
        <Column
          field="rating"
          header="Action"
          class="space-x-[16px] whitespace-nowrap"
        >
          <template #body="slotProps">
            <NuxtLink :to="`/dashboard/quiz/${slotProps?.data?.id}`">
              <span class="pi pi-eye text-primary cursor-pointer"></span>
            </NuxtLink>
            <NuxtLink :to="`/dashboard/quiz/${slotProps?.data?.id}/edit`">
              <span class="pi pi-pencil text-yellow-500 cursor-pointer"></span>
            </NuxtLink>
            <span
              class="pi pi-trash text-red-500 cursor-pointer"
              @click="handleConfirmDelete(slotProps?.data?.id)"
            ></span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>
