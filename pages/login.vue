<script setup lang="ts">
import * as yup from 'yup'
import { useForm, Form, Field } from 'vee-validate'
import { AuthApi } from '~~/services/AuthApi'
import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '~/stores'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const validationSchema = yup.object({
  username: yup.string().trim().required('Trường này là bắt buộc'),
  password: yup.string().trim().required('Trường này là bắt buộc'),
})

interface IValidationSchema extends yup.Asserts<typeof validationSchema> {}

const loginRequest = useMutation({
  mutationFn: AuthApi.login,
})

const form = useForm<IValidationSchema>({
  validationSchema: validationSchema,
})
const { errors, values } = toRefs(form)

const handleSubmit = form.handleSubmit(async (values: IValidationSchema) => {
  try {
    const loginResponse = await loginRequest.mutateAsync({
      username: values.username,
      password: values.password,
    })

    const token = loginResponse?.access_token

    localStorage.setItem('quiz-token', token)

    router.push({ path: '/dashboard/profile' })
    authStore.setAuthProfile(loginResponse?.user)

    toast.add({
      severity: 'success',
      summary: 'Đăng nhập thành công!',
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

definePageMeta({
  layout: 'user',
})
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] overflow-hidden bg-[#f8fafc] py-[160px]">
    <div
      class="mx-auto w-full max-w-[360px] rounded-[56px] p-[6px]"
      style="
        background: linear-gradient(
          180deg,
          var(--primary-color) 10%,
          rgba(33, 150, 243, 0) 30%
        );
      "
    >
      <div
        class="w-full bg-white px-5 py-8 sm:px-8"
        style="border-radius: 53px"
      >
        <div class="mb-5 text-center">
          <div class="text-900 mb-3 text-3xl font-medium">Chào mừng bạn!</div>
          <span class="text-600 font-medium">Đăng nhập để tiếp tục</span>
        </div>
        <form class="space-y-[24px]" @submit.prevent="handleSubmit()">
          <Field name="username" v-slot="{ field, errorMessage }">
            <div class="space-y-[4px]">
              <label class="text-900 block text-xl font-medium">
                Tên đăng nhập
              </label>
              <InputText
                v-bind="field"
                type="text"
                placeholder="Nhập tên đăng nhập của bạn"
                class="w-full"
              />
              <p v-if="errorMessage" class="text-[12px] text-red-600">
                {{ errorMessage }}
              </p>
            </div>
          </Field>

          <Field name="password" v-slot="{ field, errorMessage }">
            <div class="space-y-[4px]">
              <label class="text-900 block text-xl font-medium">
                Mật khẩu
              </label>
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

              <div class="mt-[12px] flex justify-between">
                <NuxtLink
                  class="cursor-pointer text-right text-[12px] font-medium text-primary no-underline"
                  href="/register"
                >
                  Chưa có tài khoản?
                </NuxtLink>
                <NuxtLink
                  class="cursor-pointer text-right text-[12px] font-medium text-primary no-underline"
                  href="/forgot-password"
                >
                  Quên mật khẩu??
                </NuxtLink>
              </div>
            </div>
          </Field>

          <Button
            :loading="loginRequest.isPending.value"
            type="submit"
            label="Đăng nhập"
            class="w-full text-xl"
          />
        </form>
      </div>
    </div>
  </div>

  <AppConfig simple />
</template>

<style scoped></style>
