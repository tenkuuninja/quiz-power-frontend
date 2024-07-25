<script setup>
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { ContestApi, QuizApi, UserApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import dayjs from 'dayjs'

const confirm = useConfirm()

const search = ref('')
const page = ref(1)

// Query
const getListUserRequest = useQuery({
  queryKey: ['users', search, page],
  queryFn: () =>
    UserApi.getListUser({
      search: search.value,
      page: page.value,
    }),
})

const users = computed(() => getListUserRequest?.data?.value?.data)
const total = computed(() => getListUserRequest?.data?.value?.total)

watchEffect(() => {
  console.log(getListUserRequest?.isPending?.value)
})

const router = useRouter()

const handleConfirmDelete = async (id) => {
  confirm.require({
    message: 'Bạn có muốn xóa người dùng này không?',
    header: 'Xác nhận xóa',
    rejectProps: {
      label: 'Hủy',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Xóa',
    },
    accept: async () => {
      await UserApi.deleteUser({ id })
      getListUserRequest?.refetch()
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
      <h2 class="text-[40px] font-bold">Người dùng</h2>
    </div>
    <span v-if="getListUserRequest.isPending?.value">Loading...</span>
    <div v-if="!getListUserRequest.isPending?.value" class="card mt-[32px]">
      <div class="flex justify-end">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search"> </InputIcon>
          <InputText
            icon="pi-search"
            placeholder="Tìm kiếm"
            @input="(e) => debounce(() => (search = e.target?.value))"
          />
        </IconField>
      </div>
      <DataTable
        :value="users || []"
        tableStyle="min-width: 50rem"
        class="mt-[20px]"
      >
        <!-- <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl text-surface-900 dark:text-surface-0 font-bold"
            >Products</span
          >
          <Button icon="pi pi-refresh" rounded raised />
        </div>
      </template> -->
        <Column field="name" header="Tên">
          <template #body="slotProps">
            <p class="line-clamp-2">
              {{ slotProps.data.name }}
            </p>
          </template>
        </Column>
        <Column field="name" header="Email">
          <template #body="slotProps">
            <p class="line-clamp-2">
              {{ slotProps.data.email || 'abc@gmail.com' }}
            </p>
          </template>
        </Column>
        <Column field="name" header="Số lượng quiz">
          <template #body="slotProps">
            <p class="line-clamp-2">
              {{ slotProps.data.quizzes?.length }}
            </p>
          </template>
        </Column>
        <Column
          field="rating"
          header="Action"
          class="space-x-[16px] whitespace-nowrap text-right"
        >
          <template #body="slotProps">
            <span
              class="pi pi-trash cursor-pointer text-[20px] text-red-500"
              @click="handleConfirmDelete(slotProps?.data?.id)"
            ></span>
          </template>
        </Column>
      </DataTable>
      <Paginator
        :alwaysShow="false"
        :rows="10"
        :totalRecords="total"
        class="mt-[24px]"
        @page="(e) => (page = e.page + 1)"
      />
    </div>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>
