<script setup lang="ts">
import { useQuery, useMutation } from '@tanstack/vue-query'
import { ref } from 'vue'
import { QuizApi, CategoryApi, UploadApi, AuthApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '~/stores'

const toast = useToast()
const authStore = useAuthStore()

const updateQuestionSchema = yup.object({
  oldPassword: yup.string().trim().required('Trường này là bắt buộc'),
  newPassword: yup.string().trim().required('Trường này là bắt buộc'),
  reNewPassword: yup
    .string()
    .trim()
    .required('Trường này là bắt buộc')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu chưa khớp'),
})

// const route = useRoute();
// const quizId = +route?.params?.id;

const form = useForm({
  validationSchema: updateQuestionSchema,
})

const listCategoryRequest = useMutation({
  mutationFn: AuthApi.updateProfile,
})

const categories = computed(() => listCategoryRequest?.data?.value?.data || [])
const questions = computed(() => form?.values?.questions || [])

const selectedCountry = ref()

const router = useRouter()

const onSubmit = form.handleSubmit(async ({ ...values }) => {
  try {
    await AuthApi.changePassword({
      oldPassword: values?.oldPassword,
      newPassword: values?.newPassword,
    })

    form.resetForm()

    toast.add({
      severity: 'success',
      summary: 'Đổi thông thành công!',
      life: 3000,
    })
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
  <form class="" @submit.prevent="onSubmit">
    <h3 class="text-[24px] font-bold">Đổi mật khẩu</h3>
    <div class="mt-[20px] justify-between">
      <div class="mt-[20px] space-y-[16px]">
        <div class="space-y-[4px]">
          <Field name="oldPassword" v-slot="{ field, errorMessage }">
            <label class="font-semibold">Mật khẩu cũ</label>
            <InputText type="password" class="block w-full" v-bind="field" />
            <p v-if="errorMessage" class="text-[12px] text-red-600">
              {{ errorMessage }}
            </p>
          </Field>
        </div>
        <div class="space-y-[4px]">
          <Field name="newPassword" v-slot="{ field, errorMessage }">
            <label class="font-semibold">Mật khẩu mới</label>
            <InputText type="password" class="block w-full" v-bind="field" />
            <p v-if="errorMessage" class="text-[12px] text-red-600">
              {{ errorMessage }}
            </p>
          </Field>
        </div>
        <div class="space-y-[4px]">
          <Field name="reNewPassword" v-slot="{ field, errorMessage }">
            <label class="font-semibold">Nhập lại mật khẩu mới</label>
            <InputText type="password" class="block w-full" v-bind="field" />
            <p v-if="errorMessage" class="text-[12px] text-red-600">
              {{ errorMessage }}
            </p>
          </Field>
        </div>
      </div>
    </div>
    <div class="mt-[24px] flex justify-end">
      <Button :loading="form?.isSubmitting?.value" label="Submit" type="submit">
        {{ form?.isSubmitting?.value ? 'Đang lưu...' : 'Lưu' }}
      </Button>
    </div>
  </form>
</template>
