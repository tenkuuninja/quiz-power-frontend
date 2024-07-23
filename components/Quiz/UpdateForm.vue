<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { QuizApi, CategoryApi, UploadApi } from '~/services'
import { IoEyeOutline } from 'oh-vue-icons/icons'
import { useForm, Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { EQuizStatus } from '~/common/enum/entity'

const toast = useToast()

const updateQuestionSchema = yup.object({
  id: yup.number().nullable().optional(),
  name: yup.string().trim().required('Tên không được bỏ trống'),
  image: yup.mixed(),
  status: yup.boolean().nullable().optional(),
  visibility: yup.boolean().nullable().optional(),
  categories: yup.array().min(1, 'Tối thiểu 1 danh mục').optional(),
})

interface IUpdateFormProps {
  quizId: number
}

interface IUpdateFormEmits {
  (eventName: 'submit'): void
}

const props = defineProps<IUpdateFormProps>()
const emit = defineEmits<IUpdateFormEmits>()

const { quizId } = toRefs(props)

const openSuggestQuestion = ref(false)
const openQuestion = ref(false)
const questionToUpdate = ref<any>(null)

console.log(props.quizId, openQuestion, questionToUpdate)
// const route = useRoute();
// const quizId = +route?.params?.id;

const form = useForm({
  validationSchema: updateQuestionSchema,
})

const listCategoryRequest = useQuery({
  queryKey: ['category'],
  queryFn: () => CategoryApi.getListCategory({}),
})

const quizDetailRequest = useQuery({
  queryKey: ['quiz-detail', ['quiz-detail', props.quizId].join('-')],
  queryFn: async () => {
    const response = await QuizApi.getDetailQuiz({ id: props.quizId })

    const quiz = response?.data
    if (quiz) {
      form.resetForm({
        values: {
          ...quiz,
          visibility: quiz?.visibility === 1,
          status: quiz?.status === 1,
        },
      })
    }

    return response
  },
})

const categories = computed(() => listCategoryRequest?.data?.value?.data || [])
const questions = computed(() => form?.values?.questions || [])

const selectedCountry = ref()

const router = useRouter()

const loading = ref(false)

const onSubmit = form.handleSubmit(async ({ ...values }) => {
  if (values?.image instanceof File) {
    const uploadResponse = await UploadApi.uploadImage({
      file: values?.image,
      path: 'user/quiz/',
    })
    values.image = uploadResponse?.url
  }
  try {
    const updateQuizResponse = await QuizApi.updateQuiz({
      id: props.quizId,
      name: values?.name,
      image: values?.image,
      questions: values?.questions,
      categories: values?.categories,
      visibility: values?.visibility ? 1 : 0,
      status: EQuizStatus.Published,
    })

    toast.add({
      severity: 'success',
      summary: 'Đã lưu quiz!',
      life: 3000,
    })

  } catch (error: any) {
    console.log('updateQuiz', error)
    if (error?.message) {
      toast.add({
        severity: 'error',
        summary: error?.message,
        life: 3000,
      })
    }
  }
})

const onSubmitAsDraft = async ({ ...values }) => {
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
      id: props.quizId,
      name: values?.name,
      image: values?.image,
      questions: values?.questions || [],
      categories: values?.categories || [],
      visibility: values?.visibility ? 1 : 0,
      status: EQuizStatus.Draft,
    })

    toast.add({
      severity: 'success',
      summary: 'Đã lưu quiz!',
      life: 3000,
    })

  } catch (error: any) {
    console.log('updateQuiz', error)
    if (error?.message) {
      toast.add({
        severity: 'error',
        summary: error?.message,
        life: 3000,
      })
    }
  }
}

const handleSubmitQuestionFormDialog = (question: any) => {
  const questions = toRaw(form.values?.questions) || []
  if (question?.id) {
    const index = questions?.findIndex((q: any) => q?.id === question?.id)
    console.log('index', index, !!questions[index])
    if (questions[index]) {
      questions[index] = toRaw(question)
    }
  } else {
    questions.push(question)
  }
  console.log('questions', questions, toRaw(question))
  form.setFieldValue('questions', questions)
  openQuestion.value = false
}

const handleGetSuggestQuestion = (newQuestions: any[]) => {
  const questions = toRaw(form.values?.questions) || []
  form.setFieldValue('questions', [...questions, ...newQuestions])
  openSuggestQuestion.value = false
}

const handleSelectCategory = (categoryId: any) => {
  const currentCategories = form.values?.categories || []
  const category = categories.value?.find((cate) => cate.id === categoryId)
  if (category) {
    form.setFieldValue('categories', [
      ...currentCategories?.filter((cate: any) => cate?.id !== categoryId),
      category,
    ])
  }
}

const handleRemoveCategory = (categoryId: any) => {
  const currentCategories = form.values?.categories || []
  const category = categories.value?.find((cate) => cate.id === categoryId)
  if (category) {
    form.setFieldValue(
      'categories',
      currentCategories?.filter((cate: any) => cate?.id !== categoryId),
    )
  }
}
</script>

<template>
  <span v-if="quizDetailRequest.isPending?.value" class="">Loading...</span>
  <div v-if="quizDetailRequest.isSuccess?.value" class="">
    <form class="" @submit.prevent="onSubmit">
      <div class="flex justify-between">
        <div class="w-[45%]">
          <QuizUploadImage
            :image="form?.values?.image"
            @change="(file) => form.setFieldValue('image', file)"
          />

          <Field name="image" v-slot="{ errorMessage }">
            <p v-if="errorMessage" class="text-[12px] text-red-600">
              {{ errorMessage }}
            </p>
          </Field>
        </div>
        <div class="w-[50%] space-y-[16px]">
          <div class="space-y-[4px]">
            <Field name="name" v-slot="{ field, errorMessage }">
              <label class="font-semibold">Name</label>
              <InputText type="text" class="block w-full" v-bind="field" />
              <p v-if="errorMessage" class="text-[12px] text-red-600">
                {{ errorMessage }}
              </p>
            </Field>
          </div>
          <div class="space-y-[4px]">
            <Field name="categories" v-slot="{ errorMessage }">
              <label class="font-semibold">Category</label>
              <Dropdown
                :options="categories"
                optionLabel="name"
                optionValue="id"
                placeholder="Select a City"
                class="w-full"
                @change="(e) => handleSelectCategory(e.value)"
              />
              <div class="flex flex-wrap gap-[4px]">
                <Chip
                  v-for="(category, i) in form.values?.categories"
                  :key="category?.id || i"
                  class="rounded-full shadow"
                  :label="category?.name"
                  removable
                  @remove="handleRemoveCategory(category?.id)"
                />
              </div>
              <p v-if="errorMessage" class="text-[12px] text-red-600">
                {{ errorMessage }}
              </p>
            </Field>
          </div>
          <div class="flex items-center justify-between">
            <Field name="visibility" v-slot="{ field, errorMessage }">
              <label class="font-semibold">Công khai</label>
              <InputSwitch
                v-model:modelValue="field.value"
                @update:modelValue="
                  (checked) => form.setFieldValue('visibility', checked)
                "
              />
              <p v-if="errorMessage" class="text-[12px] text-red-600">
                {{ errorMessage }}
              </p>
            </Field>
          </div>
        </div>
      </div>
      <div class="mt-[32px] flex justify-center space-x-[16px]">
        <button
          type="button"
          class="flex cursor-pointer items-center space-x-[4px] rounded-full bg-primary-300 px-[16px] py-[4px] transition-all hover:bg-primary-400"
          @click="
            () => {
              openQuestion = true
              questionToUpdate = null
            }
          "
        >
          <span class="pi pi-plus"></span>
          <span>Thêm câu hỏi</span>
        </button>
        <button
          type="button"
          class="flex cursor-pointer items-center space-x-[4px] rounded-full bg-primary-300 px-[16px] py-[4px] transition-all hover:bg-primary-400"
          @click="
            () => {
              openSuggestQuestion = true
            }
          "
        >
          <span class="pi pi-plus"></span>
          <span>Gợi ý câu hỏi</span>
        </button>
      </div>
      <div class="mt-[24px] space-y-[16px]">
        <QuizQuestionCard
          v-for="(question, i) in questions"
          :question="question"
          :key="question?.id || i"
          @click="
            () => {
              openQuestion = true
              questionToUpdate = question
            }
          "
        />
      </div>
      <div class="mt-[24px] flex justify-end space-x-[16px]">
        <Button label="Submit" type="button" outlined @click="onSubmitAsDraft">
          {{ form?.isSubmitting?.value ? 'Đang lưu...' : 'Lưu dạng nháp' }}
        </Button>
        <Button label="Submit" type="submit">
          {{ form?.isSubmitting?.value ? 'Đang lưu...' : 'Lưu' }}
        </Button>
      </div>
    </form>
  </div>
  <QuizQuestionEditForm
    :open="openQuestion"
    :question="questionToUpdate"
    :quizId="quizId"
    :onClose="
      () => {
        openQuestion = false
      }
    "
    @submit="handleSubmitQuestionFormDialog"
  />
  <QuizQuestionSuggestionDialog
    :open="openSuggestQuestion"
    :onClose="
      () => {
        openSuggestQuestion = false
      }
    "
    @submit="handleGetSuggestQuestion"
  />
</template>
