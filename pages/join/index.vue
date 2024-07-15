<script setup lang="ts">
import { useForm, Field } from 'vee-validate'
import { defineProps } from 'vue'
import * as yup from 'yup'
import { ContestApi } from '~/services'
import { useContestStore } from '~/stores'

const contestStore = useContestStore()

const code = ref('')

const handleSubmit = async () => {
  try {
    // const joinResponse = await ContestApi.joinContest({
    //   contestId: props?.contestId,
    //   ...form.values,
    // })
    // contestStore.setPlayerIdByContestId(
    //   props?.contestId,
    //   joinResponse?.data?.id,
    // )
  } catch (error) {
    //
    console.log(error)
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
