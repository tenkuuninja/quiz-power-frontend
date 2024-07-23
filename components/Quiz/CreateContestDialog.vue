<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { ContestApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'

const confirm = useConfirm()
const toast = useToast()

interface IProps {
  open: boolean
  onClose: VoidFunction
  quizId: number
}

const props = defineProps<IProps>()

const questions = ref([] as any[])
const contestName = ref('')

const createContestRequest = useMutation({
  mutationFn: ContestApi.createContest,
})

const handleCreateContest = async () => {
  if (!contestName.value) {
    toast.add({
      severity: 'error',
      summary: 'Hãy nhập nội dung chủ đề !',
      life: 3000,
    })
    return
  }

  try {
    const createQuizResponse = await createContestRequest.mutateAsync({
      quizId: +props?.quizId,
      name: contestName?.value,
    })
    const contestId = createQuizResponse?.data?.id
    window.open(`/contest/${contestId}/admin`)
    props?.onClose()
  } catch (error) {
    //
  }
}
</script>

<template>
  <Dialog
    :visible="props?.open"
    @update:visible="props?.onClose"
    modal
    dismissableMask
    blockScroll
    class="mx-auto !max-h-max w-[90%] max-w-[400px] bg-primary text-white"
  >
    <template #container="">
      <div class="rounded-[8px] bg-white p-4">
        <InputText
          v-model="contestName"
          type="text"
          placeholder="Nhập Tên cuộc thi"
          class="w-full"
        />
        <Button
          :loading="createContestRequest?.isPending?.value"
          label="Tạo cuộc thi"
          @click="handleCreateContest()"
          class="mt-[16px] w-full"
        />
      </div>
    </template>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
</template>
