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
  name: yup.string().trim().required('Tên không được bỏ trống'),
  email: yup.string().trim().required('Tên không được bỏ trống'),
  avatar: yup.mixed(),
})

const profile = computed(() => authStore?.profile)

// const route = useRoute();
// const quizId = +route?.params?.id;

const form = useForm({
  initialValues: authStore?.profile,
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
    if (values?.avatar instanceof File) {
      const uploadResponse = await UploadApi.uploadImage({
        file: values?.avatar,
        path: 'user/avatar/',
      })
      values.avatar = uploadResponse?.url
    }
    await AuthApi.updateProfile({
      name: values?.name,
      avatar: values?.avatar,
    })

    const profileResponse = await AuthApi.getProfile()
    authStore.setAuthProfile(profileResponse?.data)
    form.resetForm({
      values: profileResponse?.data
    })

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

watch([profile], ([newProfile]) => {
  console.log(newProfile)
  form.resetForm({
    values: newProfile,
  })
})
</script>

<template>
  <form class="" @submit.prevent="onSubmit">
    <h3 class="text-[24px] font-bold">Thông tin cá nhân</h3>
    <div class="mt-[20px] justify-between">
      <div class="mx-auto w-[200px]">
        <ProfileUploadImage
          :image="form?.values?.avatar"
          @change="(file) => form.setFieldValue('avatar', file)"
        />

        <Field name="image" v-slot="{ errorMessage }">
          <p v-if="errorMessage" class="text-[12px] text-red-600">
            {{ errorMessage }}
          </p>
        </Field>
      </div>
      <div class="mt-[20px] space-y-[16px]">
        <div class="space-y-[4px]">
          <Field name="name" v-slot="{ field, errorMessage }">
            <label class="font-semibold">Tên hiển thị</label>
            <InputText type="text" class="block w-full" v-bind="field" />
            <p v-if="errorMessage" class="text-[12px] text-red-600">
              {{ errorMessage }}
            </p>
          </Field>
        </div>
        <div class="space-y-[4px]">
          <label class="font-semibold">Tên đăng nhập</label>
          <InputText
            disabled
            type="text"
            class="block w-full"
            :modelValue="authStore?.profile?.username"
          />
        </div>
        <div class="space-y-[4px]">
          <label class="font-semibold">Email</label>
          <InputText
            disabled
            type="text"
            class="block w-full"
            :modelValue="authStore?.profile?.email"
          />
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
