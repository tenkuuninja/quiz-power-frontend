<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { useForm, Field } from 'vee-validate'
import { defineProps } from 'vue'
import * as yup from 'yup'
import { ContestApi } from '~/services'
import { useContestStore } from '~/stores'

const contestStore = useContestStore()
const router = useRouter()
const toast = useToast()

const code = ref('')

const findContestRequest = useMutation({
  mutationFn: ContestApi.findContest,
})

const handleSubmit = async () => {
  if (!code.value) {
    return
  }
  try {
    const contestResponse = await findContestRequest.mutateAsync({
      code: code.value,
    })
    const contestId = contestResponse?.data?.id

    if (contestId) {
      router.push({ path: `/contest/${contestId}/join` })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Không tim thấy cuộc thi!',
        life: 3000,
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Không tim thấy cuộc thi!',
      life: 3000,
    })
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 p-4">
    <form
      class="w-full max-w-[500px] rounded-[8px] bg-slate-700 p-[16px]"
      @submit.prevent="handleSubmit"
    >
      <input
        v-model="code"
        type="text"
        class="h-[60px] w-full rounded-[8px] bg-white p-[16px] text-center text-[32px]"
        placeholder="Code"
      />

      <Button
        size="large"
        label="Tham gia"
        type="submit"
        class="mt-[24px] w-full"
      />
    </form>
  </div>
</template>
