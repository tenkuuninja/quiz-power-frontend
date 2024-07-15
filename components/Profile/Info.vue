<script setup lang="ts">
import { useQuery, useMutation } from '@tanstack/vue-query'
import { ref } from 'vue'
import { QuizApi, CategoryApi, UploadApi, AuthApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '~/stores'

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

const loading = ref(false)

const onSubmit = form.handleSubmit(async ({ ...values }) => {
  // Simulates a 2 second delay
  console.log('Submitted', values)
  if (values?.image instanceof File) {
    const uploadResponse = await UploadApi.uploadImage({
      file: values?.image,
      path: 'user/quiz/',
    })
    values.image = uploadResponse?.url
  }
  try {
    const updateQuizResponse = await QuizApi.updateQuiz({
      name: values?.name,
      image: values?.image,
      questions: values?.questions,
      categories: values?.categories,
      visibility: values?.visibility ? 1 : 0,
      status: values?.status ? 1 : 0,
    })
  } catch (error) {
    console.log('updateQuiz', error)
    //
  }
})

console.log('1', authStore?.profile)
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
          @change="(file) => form.setFieldValue('image', file)"
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
            :modelValue="authStore?.profile?.username"
          />
        </div>
      </div>
    </div>
    <div class="mt-[24px] flex justify-end">
      <Button label="Submit" type="submit">
        {{ form?.isSubmitting?.value ? 'Đang lưu...' : 'Lưu' }}
      </Button>
    </div>
  </form>
</template>
