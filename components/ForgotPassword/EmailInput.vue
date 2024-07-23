<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { AuthApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'

const confirm = useConfirm()
const toast = useToast()

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Email không hợp lệ')
    .required('Trường này là bắt buộc'),
})

interface IValidationSchema extends yup.Asserts<typeof validationSchema> {}

interface IProps {
  email?: string
}

interface IEmits {
  (eventName: 'submit', email: string): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const sendOtpRequest = useMutation({
  mutationFn: AuthApi.forgotPassword,
})

const form = useForm<IValidationSchema>({
  validationSchema: validationSchema,
  initialValues: {
    email: props?.email || '',
  },
})
const { errors, values, setFieldValue } = toRefs(form)

const handleSubmit = form.handleSubmit(async (values: IValidationSchema) => {
  try {
    const loginResponse = await sendOtpRequest.mutateAsync({
      email: values.email,
    })

    const token = loginResponse?.access_token

    localStorage.setItem('quiz-token', token)

    emit('submit', values?.email)
  } catch (error: any) {
    if (error?.message) {
      toast.add({
        severity: 'error',
        summary: error?.message,
        life: 3000,
      })
    }
  }
})
</script>

<template>
  <form class="space-y-[24px]" @submit.prevent="handleSubmit()">
    <Field name="email" v-slot="{ field, errorMessage }" class="456">
      <div class="space-y-[4px]">
        <label for="email1" class="text-900 block text-xl font-medium">
          Email
        </label>
        <InputText
          v-bind="field"
          type="text"
          placeholder="Nhập email của bạn"
          class="w-full"
        />
        <p v-if="errorMessage" class="text-[12px] text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </Field>

    <Button
      :loading="sendOtpRequest.isPending.value"
      type="submit"
      label="Tiếp tục"
      class="w-full text-xl"
    />
  </form>
</template>
