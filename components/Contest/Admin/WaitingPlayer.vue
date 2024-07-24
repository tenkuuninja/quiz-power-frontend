<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useContestStore } from '~/stores'
import copy from 'copy-to-clipboard'
import { useToast } from 'primevue/usetoast'

const validationSchema = yup.object({
  name: yup.string().trim().required('Đây là trường bắt buộc'),
})

interface IQuestionEditFormProps {
  contestId: string
}

interface IQuestionEditFormEmits {
  (eventName: 'submit', question: any): void
}

const props = defineProps<IQuestionEditFormProps>()
const emit = defineEmits<IQuestionEditFormEmits>()

const form = useForm({
  validationSchema: validationSchema,
})
const contestStore = useContestStore()

const toast = useToast()

const { contestId } = toRefs(props)

const contest = computed(() => contestStore?.getContest(contestId.value))

const handleSubmit = async () => {
  try {
    await ContestApi.startContest({
      contestId: props?.contestId,
    })
  } catch (error) {
    //
    console.log(error)
  }
}

const handleCopyLink = async () => {
  const origin = window.location.origin
  copy(`${origin}/contest/${contest?.value?.id}/join`, {
    message: 'copied',
  })

  // toast.info("Copied");

  toast.add({
    severity: 'info',
    summary: 'Copied',
    life: 3000,
  })
}

const handleCopyCode = async () => {
  copy(contest?.value?.joinCode, {
    message: 'copied',
  })

  // toast.info("Copied");

  toast.add({
    severity: 'info',
    summary: 'Copied',
    life: 3000,
  })
}
</script>

<template>
  <div class="py-4">
    <h2 class="mt-[20px] text-center text-[40px] font-medium">
      {{ contest?.name }}
    </h2>
    <div
      class="mx-auto mt-[32px] max-w-[500px] rounded-[8px] border border-slate-700 bg-black/80 p-[16px] text-slate-50"
    >
      <div class="flex items-center justify-between space-x-[16px]">
        <span class="w-[80px]">Join link</span>
        <span class="text-[32px] font-bold">quizpower.com/join</span>
        <button
          class="pi pi-clone text-[20px] text-white"
          @click="handleCopyLink"
        ></button>
      </div>
      <div class="mt-[20px] flex items-center justify-between space-x-[16px]">
        <span class="w-[80px]">Enter code</span>
        <span class="text-[52px] font-bold tracking-wider">
          {{ contest?.joinCode }}
        </span>
        <button
          class="pi pi-clone text-[20px] text-white"
          @click="handleCopyCode"
        ></button>
      </div>
    </div>
    <div
      class="mx-auto w-[80%] max-w-[400px] rounded-b-[8px] border border-t-0 border-slate-700 bg-black/80 p-[16px] text-slate-50"
    >
      <Button
        label="Start"
        size="large"
        @click="handleSubmit()"
        class="block w-full"
      />
    </div>

    <div class="mt-[32px] text-center">
      <div
        class="mx-auto inline-flex items-center rounded-full border border-slate-800 bg-black/80 px-[32px] py-[12px] text-[24px] font-bold text-white"
      >
        {{ contest?.players?.length || 0 }} Member Joined
      </div>
      <div class="mt-[20px] flex flex-wrap justify-center gap-[16px]">
        <div
          class="flex items-center rounded-full border border-slate-800 bg-black/80 p-[12px]"
          v-for="player of contest?.players || []"
          :key="player?.id"
        >
          <img
            :src="`/assets/contest/avatar/avataaars-${player?.avatar}.svg`"
            alt=""
            class="mt-[-6px] w-[32px]"
          />
          <p class="ml-[12px] pr-[12px] text-[20px] font-bold text-white">
            {{ player?.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>
