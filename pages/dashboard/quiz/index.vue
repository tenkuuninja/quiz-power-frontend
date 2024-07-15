<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import dayjs from 'dayjs'
import { EUserRole } from '~/common/enum/entity'
import { useAuthStore } from '~/stores'

const confirm = useConfirm()
const authStore = useAuthStore()

const profile = computed(() => authStore?.profile)

// Query
const getQuizListRequest = useQuery({
  queryKey: ['quiz-list'],
  queryFn: () => QuizApi.getListQuiz({}),
})

const createQuizRequest = useMutation({
  mutationFn: () => QuizApi.createQuiz({}),
})

const quizzes = computed(() => getQuizListRequest?.data?.value?.data || [])
const total = computed(() => getQuizListRequest?.data?.value?.total || 0)
const { isPending, isSuccess, isError, data, error, refetch } =
  toRefs(getQuizListRequest)

watchEffect(() => {
  console.log(isPending, isError, data, error)
})

const router = useRouter()

const loading = ref(false)

const handleCreateQuiz = async () => {
  loading.value = true
  try {
    const createQuizResponse = await createQuizRequest.mutateAsync()
    const quizId = createQuizResponse?.data?.id
    router.push({ path: `/dashboard/quiz/${quizId}/edit` })
  } catch (error) {
    //
  }
  loading.value = false
}

const handleConfirmDelete = async (id: number) => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    rejectLabel: 'Hủy bỏ',
    acceptLabel: 'Xóa',
    accept: async () => {
      await QuizApi.deleteQuiz({ id })
      getQuizListRequest.refetch()
    },
    reject: () => {},
  })
}

definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <div class="rounded-[8px] bg-white p-[16px]">
    <div class="flex items-center justify-between">
      <h2 class="text-[40px] font-bold">Danh sách Quiz</h2>
      <Button
        :loading="createQuizRequest?.isPending?.value"
        label="Thêm"
        v-if="profile?.role === EUserRole.User"
        @click="handleCreateQuiz()"
      />
    </div>
    <span v-if="isPending">Loading...</span>
    <div v-if="isSuccess" class="mt-[32px]">
      <div class="flex justify-end">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search"> </InputIcon>
          <InputText icon="pi-search" placeholder="Tìm kiếm" />
        </IconField>
      </div>
      <div class="divide-y divide-slate-200">
        <div
          v-for="quiz of quizzes || []"
          :key="quiz?.id"
          class="mt-[20px] flex justify-between py-[16px]"
        >
          <img
            src="https://picsum.photos/400/400?random=1"
            alt=""
            class="w-[100px]"
          />
          <div class="flex w-[calc(100%-100px-100px-16px*2)] flex-col">
            <h3
              v-tooltip.top="quiz?.name"
              class="line-clamp-1 max-w-[500px] font-semibold"
            >
              {{ quiz?.name }}
            </h3>
            <div class="mt-[4px] text-[14px] text-slate-600">
              <span>{{ quiz?.questions?.length || 0 }} câu hỏi</span>
            </div>
            <div class="flex-grow"></div>
            <p class="text-[14px] text-slate-600">
              Cập nhật lúc {{ dayjs(quiz?.updatedAt).locale('vi').fromNow() }}
            </p>
          </div>
          <div
            v-if="profile?.role === EUserRole.User"
            class="flex w-[100px] items-end justify-end space-x-[16px] whitespace-nowrap"
          >
            <NuxtLink :to="`/dashboard/quiz/${quiz?.id}`">
              <span
                class="pi pi-eye cursor-pointer text-[20px] text-primary"
              ></span>
            </NuxtLink>
            <NuxtLink :to="`/dashboard/quiz/${quiz?.id}/edit`">
              <span
                class="pi pi-pencil cursor-pointer text-[20px] text-yellow-500"
              ></span>
            </NuxtLink>
            <span
              class="pi pi-trash cursor-pointer text-[20px] text-red-500"
              @click="handleConfirmDelete(quiz?.id)"
            ></span>
          </div>
          <div
            v-if="profile?.role === EUserRole.Admin"
            class="flex w-[100px] items-end justify-end space-x-[16px] whitespace-nowrap"
          >
            <NuxtLink :to="`/dashboard/quiz/${quiz?.id}`">
              <span
                class="pi pi-eye cursor-pointer text-[20px] text-primary"
              ></span>
            </NuxtLink>
            <span
              class="pi pi-trash cursor-pointer text-[20px] text-red-500"
              @click="handleConfirmDelete(quiz?.id)"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <Paginator
      v-if="!!total"
      :rows="10"
      :totalRecords="total"
      class="mt-[24px]"
    />
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>
