<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { QuizApi, CategoryApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";

const updateQuestionSchema = yup.object({
  id: yup.number().nullable().optional(),
  name: yup.string().trim().required("This field is required"),
  status: yup.boolean().nullable().optional(),
  visibility: yup.boolean().nullable().optional(),
  categories: yup.array().min(1, "Tối thiểu 1 danh mục").optional(),
});

interface IUpdateFormProps {
  quizId: number;
}

interface IUpdateFormEmits {
  (eventName: "submit"): void;
}

const props = defineProps<IUpdateFormProps>();
const emit = defineEmits<IUpdateFormEmits>();

const { quizId } = props;

const openQuestion = ref(false);
const questionToUpdate = ref<any>(null);

console.log(quizId, openQuestion, questionToUpdate);
// const route = useRoute();
// const quizId = +route?.params?.id;

const form = useForm({
  validationSchema: updateQuestionSchema,
});

const [name, nameAttrs] = form.defineField("name");
const [visibility, visibilityAttrs] = form.defineField("visibility");
const [status, statusAttrs] = form.defineField("status");

const listCategoryRequest = useQuery({
  queryKey: ["category"],
  queryFn: () => CategoryApi.getListCategory({}),
});

const quizDetailRequest = useQuery({
  queryKey: ["quiz-detail", ["quiz-detail", quizId].join("-")],
  queryFn: async () => {
    const response = await QuizApi.getDetailQuiz({ id: quizId });

    return response;
  },
});

const categories = computed(() => listCategoryRequest?.data?.value?.data || []);

const selectedCountry = ref();

const router = useRouter();

const loading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
  // Simulates a 2 second delay
  console.log("Submitted", values);
  try {
    const updateQuizResponse = await QuizApi.updateQuiz({
      id: quizId,
      name: values?.name,
      questions: values?.questions,
      categories: values?.categories,
      visibility: values?.visibility ? 1 : 0,
      status: values?.status ? 1 : 0,
    });
  } catch (error) {
    console.log("updateQuiz", error);
    //
  }
});

const handleSubmitQuestionFormDialog = (question: any) => {
  const questions = toRaw(form.values?.questions) || [];
  if (question?.id) {
    const index = questions?.findIndex((q: any) => q?.id === question?.id);
    if (questions[index]) {
      questions[index] = question;
    }
  } else {
    questions.push(question);
  }
  console.log("questions", questions, question);
  form.setFieldValue("questions", questions);
  openQuestion.value = false;
};

const handleSelectCategory = (categoryId: any) => {
  const currentCategories = form.values?.categories || [];
  const category = categories.value?.find((cate) => cate.id === categoryId);
  if (category) {
    form.setFieldValue("categories", [
      ...currentCategories?.filter((cate: any) => cate?.id !== categoryId),
      category,
    ]);
  }
};

const handleRemoveCategory = (categoryId: any) => {
  const currentCategories = form.values?.categories || [];
  const category = categories.value?.find((cate) => cate.id === categoryId);
  if (category) {
    form.setFieldValue(
      "categories",
      currentCategories?.filter((cate: any) => cate?.id !== categoryId)
    );
  }
};

watch([quizDetailRequest.data], () => {
  if (quizDetailRequest.data.value) {
    const quiz = quizDetailRequest.data.value?.data;
    form.resetForm({
      values: {
        ...quiz,
        visibility: quiz?.visibility === 1,
        status: quiz?.status === 1,
      },
    });
  }
});

watchEffect(() => {
  console.log("categories", categories?.value);
});
</script>

<template>
  <span v-if="quizDetailRequest.isPending?.value" class="">Loading...</span>
  <div v-if="quizDetailRequest.isSuccess?.value" class="">
    <form class="space-y-[16px]" @submit.prevent="onSubmit">
      <div class="space-y-[4px]">
        <Field name="name" v-slot="{ field, errorMessage }" class="456">
          <label class="font-semibold">Name</label>
          <InputText type="text" class="block w-full" v-bind="field" />
          <p v-if="errorMessage">{{ errorMessage }}</p>
        </Field>
      </div>
      <div class="space-y-[4px]">
        <Field name="categories" v-slot="{ errorMessage }" class="456">
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
              class="shadow rounded-full"
              :label="category?.name"
              removable
              @remove="handleRemoveCategory(category?.id)"
            />
          </div>
          <p v-if="errorMessage">{{ errorMessage }}</p>
        </Field>
      </div>
      <div class="flex items-center">
        <Field name="status" v-slot="{ field, errorMessage }" class="456">
          <label class="font-semibold">Public</label>
          <InputSwitch
            v-model:modelValue="field.value"
            @update:modelValue="
              (checked) => form.setFieldValue('status', checked)
            "
          />
          <p v-if="errorMessage">{{ errorMessage }}</p>
        </Field>
      </div>
      <div class="flex items-center">
        <Field name="visibility" v-slot="{ field, errorMessage }" class="456">
          <label class="font-semibold">Visible</label>
          <InputSwitch
            v-model:modelValue="field.value"
            @update:modelValue="
              (checked) => form.setFieldValue('visibility', checked)
            "
          />
          <p v-if="errorMessage">{{ errorMessage }}</p>
        </Field>
      </div>
      <div>
        <span
          class="pi pi-plus"
          @click="
            () => {
              openQuestion = true;
              questionToUpdate = null;
            }
          "
        ></span>
      </div>
      <div class="space-y-[16px]">
        <QuizQuestionCard
          v-for="(question, i) in form?.values?.questions"
          :question="question"
          :key="question?.id || i"
          @click="
            () => {
              openQuestion = true;
              questionToUpdate = question;
            }
          "
        />
      </div>
      <div class="flex justify-end">
        <Button label="Submit" type="submit">
          {{ form?.isSubmitting?.value ? "Submitting..." : "Submit" }}
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
        openQuestion = false;
      }
    "
    @submit="handleSubmitQuestionFormDialog"
  />
</template>
