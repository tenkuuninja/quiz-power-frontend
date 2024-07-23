<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, defineProps } from 'vue'
import { AuthApi, QuizApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuestionType } from '~/common/enum/entity'

const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const validationSchema = yup.object({
  otp: yup.string().trim().required('Trường này là bắt buộc'),
  password: yup.string().trim().required('Trường này là bắt buộc'),
  confirmPassword: yup
    .string()
    .trim()
    .required('Trường này là bắt buộc')
    .oneOf([yup.ref('password')], 'Mật khẩu chưa khớp'),
})

interface IValidationSchema extends yup.Asserts<typeof validationSchema> {}

interface IProps {
  email?: string
}

interface IEmits {
  (eventName: 'back'): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const resetPasswordRequest = useMutation({
  mutationFn: AuthApi.forgotPasswordVerify,
})

const form = useForm<IValidationSchema>({
  validationSchema: validationSchema,
  initialValues: {},
})
const { errors, values, setFieldValue } = toRefs(form)

const handleSubmit = form.handleSubmit(async (values: IValidationSchema) => {
  try {
    await resetPasswordRequest.mutateAsync({
      email: props.email || '',
      otp: values?.otp,
      password: values?.password,
    })

    toast.add({
      severity: 'success',
      summary: 'Đổi mật khẩu thành công!',
      life: 3000,
    })

    router.push({ path: '/login' })
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
    <Field name="otp" v-slot="{ field, errorMessage }" class="456">
      <div class="space-y-[4px]">
        <label for="email1" class="text-900 block text-xl font-medium">
          Otp
        </label>
        <InputText
          v-bind="field"
          type="text"
          placeholder="Nhập otp"
          class="w-full"
        />
        <p v-if="errorMessage" class="text-[12px] text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </Field>

    <Field name="password" v-slot="{ field, errorMessage }">
      <div class="space-y-[4px]">
        <label class="text-900 block text-xl font-medium"> Mật khẩu </label>
        <Password
          v-bind="field"
          :modelValue="values?.password"
          @change="(e) => form.setFieldValue('password', e.target.value)"
          placeholder="Nhập mật khẩu của bạn"
          :toggleMask="true"
          inputClass="w-full"
          promptLabel="Nhập mật khẩu"
          weakLabel="Yếu"
          mediumLabel="Trung bình"
          strongLabel="Mạnh"
        />
        <p v-if="errorMessage" class="text-[12px] text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </Field>

    <Field name="confirmPassword" v-slot="{ field, errorMessage }">
      <div class="space-y-[4px]">
        <label class="text-900 block text-xl font-medium">
          Xác nhận mật khẩu
        </label>
        <Password
          v-bind="field"
          :modelValue="values?.confirmPassword"
          @change="(e) => form.setFieldValue('confirmPassword', e.target.value)"
          type="text"
          placeholder="Nhập lại mật khẩu của bạn"
          :toggleMask="true"
          inputClass="w-full"
          promptLabel="Nhập lại mật khẩu"
          weakLabel="Yếu"
          mediumLabel="Trung bình"
          strongLabel="Mạnh"
        />
        <p v-if="errorMessage" class="text-[12px] text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </Field>

    <div class="flex space-x-[16px]">
      <Button
        :disabled="resetPasswordRequest.isPending.value"
        type="button"
        label="Quay lại"
        class="w-[45%] text-xl"
        outlined
        @click="emit('back')"
      />
      <Button
        :loading="resetPasswordRequest.isPending.value"
        type="submit"
        label="Tiếp tục"
        class="w-[55%] text-xl"
      />
    </div>
  </form>
</template>
