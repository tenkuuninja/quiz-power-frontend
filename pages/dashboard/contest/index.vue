<script setup>
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import dayjs from 'dayjs'

const confirm = useConfirm()

const search = ref('')
const page = ref(1)

// Query
const getListContestRequest = useQuery({
  queryKey: ['contests', search, page],
  queryFn: () =>
    ContestApi.getListContest({
      search: search.value,
      page: page.value,
    }),
})

const contests = computed(() => getListContestRequest?.data?.value?.data)
const total = computed(() => getListContestRequest?.data?.value?.total)

watchEffect(() => {
  console.log(getListContestRequest?.isPending?.value)
})

const router = useRouter()

definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <div class="min-h-[600px] rounded-[8px] bg-white p-[16px]">
    <div class="flex items-center justify-between">
      <h2 class="text-[40px] font-bold">Danh sách cuộc thi</h2>
    </div>
    <div class="mt-[32px] flex justify-end">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search"> </InputIcon>
        <InputText
          @input="(e) => debounce(() => (search = e.target.value))"
          icon="pi-search"
          placeholder="Tìm kiếm"
        />
      </IconField>
    </div>
    <span v-if="getListContestRequest?.isPending?.value">Loading...</span>
    <div v-if="getListContestRequest?.isSuccess?.value" class="mt-[32px]">
      <div class="divide-y divide-slate-200">
        <div
          v-for="contest of contests || []"
          :key="contest?.id"
          class="mt-[20px] flex justify-between py-[16px]"
        >
          <img
            src="https://picsum.photos/400/400?random=1"
            alt=""
            class="w-[100px]"
          />
          <div class="flex w-[calc(100%-100px-100px-16px*2)] flex-col">
            <h3
              v-tooltip.top="contest?.name"
              class="line-clamp-1 max-w-[500px] font-semibold"
            >
              {{ contest?.name }}
            </h3>
            <div
              class="mt-[4px] line-clamp-1 max-w-[400px] text-[14px] text-slate-600"
            >
              <span>{{ contest?.contestQuiz?.name }}</span>
            </div>
            <div class="mt-[4px] text-[14px] text-slate-600">
              <span>{{ contest?.players?.length || 0 }} người tham gia</span>
            </div>
            <div class="flex-grow"></div>
            <p class="text-[14px] text-slate-600">
              Kết thúc lúc {{ dayjs(contest?.endedAt).locale('vi').fromNow() }}
            </p>
          </div>
          <div class="flex w-[100px] items-end justify-end whitespace-nowrap">
            <NuxtLink :to="`/dashboard/contest/${contest?.id}`">
              <span
                class="pi pi-eye cursor-pointer text-[20px] text-primary"
              ></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <Paginator
      :alwaysShow="false"
      :rows="10"
      :totalRecords="total"
      class="mt-[24px]"
      @page="(e) => (page = e.page + 1)"
    />
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>
