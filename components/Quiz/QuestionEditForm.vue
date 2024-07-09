<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, defineProps } from "vue";
import { QuizApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";
import { EQuestionType } from "~/common/enum/entity";

const confirm = useConfirm();
const toast = useToast();

const updateQuestionSchema = yup.object({
  id: yup.number().nullable().optional(),
  content: yup.string().trim().required("This field is required"),
  questionType: yup
    .string()
    .trim()
    .required("This field is required")
    .default(EQuestionType.SingleChoice),
  answerLength: yup.number().nullable().optional(),
  options: yup
    .array(
      yup.object({
        id: yup.number().nullable().optional(),
        content: yup.string().trim().required("This field is required"),
        isCorrect: yup.boolean().default(false),
      })
    )
    .required(),
});

interface IQuestionSchema extends yup.Asserts<typeof updateQuestionSchema> {}

interface IQuestionEditFormProps {
  open: boolean;
  question: any;
  quizId: number;
  onClose: VoidFunction;
}

interface IQuestionEditFormEmits {
  (eventName: "submit", question: any): void;
}

const props = defineProps<IQuestionEditFormProps>();
const emit = defineEmits<IQuestionEditFormEmits>();

const form = useForm<IQuestionSchema>({
  validationSchema: updateQuestionSchema,
});
const { values, defineField, isSubmitting, resetForm } = toRefs(form);

const suggestAnswerRequest = useMutation({
  mutationFn: QuizApi.suggestionAnswer,
});

const { open, question, onClose } = toRefs(props);

console.log("props", props?.open, props?.question);

const questionType = computed(() => values?.value?.questionType);
const optionArray = computed(() => {
  if (values?.value?.questionType === EQuestionType.TextEntryWithLength) {
    return [null];
  }
  return [
    ...new Array(
      (values?.value?.options?.length || 0) >= 4
        ? values?.value?.options?.length
        : 4
    ),
  ];
});

const questionTypeOptions = [
  {
    label: "Single Answer",
    value: EQuestionType.SingleChoice,
  },
  {
    label: "Multiple Answer",
    value: EQuestionType.MultipleChoice,
  },
  // {
  //   label: "Text Entry",
  //   value: EQuestionType.TextEntry,
  // },
  {
    label: "Text Entry Length",
    value: EQuestionType.TextEntryWithLength,
  },
];

const handleSetIsCorrect = (index: number) => {
  let options =
    form.values?.options?.map((option: any) => ({ ...option })) || [];
  if (form.values?.questionType === EQuestionType.SingleChoice) {
    options = options?.map((option: any) => ({ ...option, isCorrect: false }));
    options[index].isCorrect = true;
    form.setFieldValue("options", options);
  }
  if (form.values?.questionType === EQuestionType.MultipleChoice) {
    console.log(options[index].isCorrect, !options[index].isCorrect);
    options[index].isCorrect = !options[index].isCorrect;
    console.log(options[index].isCorrect);
    form.setFieldValue("options", [...options]);
  }
};

const handleRemoveOption = (index: number) => {
  let options =
    form.values?.options?.map((option: any) => ({ ...option })) || [];
  options[index].content = "";
  form.setFieldValue("options", options);
};

const handleSuggestAnswer = async () => {
  if (!form.values?.content) {
    toast.add({
      severity: "info",
      summary: "Please enter question content!",
      life: 3000,
    });
    return;
  }
  const handleGet = async () => {
    try {
      const response = await suggestAnswerRequest.mutateAsync({
        message: form.values?.content,
        type: form.values?.questionType,
      });
      form.setFieldValue("options", response?.data);
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Please try again!",
        life: 3000,
      });
    }
  };
  const options = form.values?.options?.filter(
    (option: any) => !!option?.content
  );
  if (options?.length) {
    confirm.require({
      header: "You've some options",
      message: "All your options will be replaced",
      rejectLabel: "Cancel",
      acceptLabel: "Replace",
      accept: handleGet,
      reject: () => {},
    });
  } else {
    handleGet();
  }
};

const handleSubmit = () => {
  const options = form.values?.options?.filter(
    (option: any) => !!option?.content
  );
  emit("submit", { ...form.values, options });
};

watch([open, question], () => {
  if (props?.question) {
    const question = props?.question;
    form.resetForm({
      values: {
        questionType: EQuestionType.SingleChoice,
        ...question,
      },
    });
  } else {
    form.resetForm({
      values: {
        content: "",
        questionType: EQuestionType.SingleChoice,
        options: [],
      },
    });
  }
});

watch([questionType], ([newQuestionType], [oldQuestionType]) => {
  if (newQuestionType === EQuestionType.TextEntryWithLength) {
    form.setFieldValue("options", [
      {
        isCorrect: true,
        content: "",
      },
    ]);
  } else {
    form.setFieldValue(
      "options",
      values?.value?.options?.map((option: any) => ({
        ...option,
        isCorrect: false,
      }))
    );
  }
});

const backgroundColors = [
  "bg-teal-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-cyan-500",
];
</script>

<template>
  <Dialog
    :visible="props?.open"
    @update:visible="props?.onClose"
    modal
    dismissableMask
    blockScroll
    pt:mask:class="overflow-y-auto !block py-[40px]"
    pt:root:class="p-0 !max-h-auto"
    class="w-[90%] max-w-screen-md bg-primary text-white mx-auto !max-h-max"
  >
    <template #container="{ closeCallback }">
      <div class="p-4 rounded-[8px] bg-white">
        <Field name="content" v-slot="{ field, errorMessage }" class="456">
          <input
            v-bind="field"
            type="text"
            class="w-full h-[200px] rounded-[8px] bg-primary p-[16px] text-white placeholder:text-white/70 text-[32px] text-center"
            placeholder="Type question here"
          />
          <span>{{ errorMessage }}</span>
        </Field>
        <div class="flex flex-wrap gap-[16px] mt-[24px]">
          <div
            class="flex border flex-wrap border-primary p-[4px] rounded-[8px] gap-[4px] max-w-full overflow-x-auto"
          >
            <div
              v-for="type in questionTypeOptions"
              :key="type?.value"
              :class="
                cn(
                  `rounded-[4px] w-[calc(50%-2px)] text-center md:w-auto transition-all px-[8px] py-[2px] cursor-pointer`,
                  type?.value === values?.questionType
                    ? 'bg-primary/80'
                    : ' text-primary'
                )
              "
              @click="form.setFieldValue('questionType', type.value)"
            >
              {{ type?.label }}
            </div>
          </div>
          <button
            :disabled="suggestAnswerRequest.isPending.value"
            class="w-[32px] h-[32px] text-primary cursor-pointer flex justify-center items-center"
            type="button"
            v-if="
              form.values.questionType === EQuestionType.SingleChoice ||
              form.values.questionType === EQuestionType.MultipleChoice
            "
            @click="handleSuggestAnswer"
          >
            <span
              class="pi pi-sparkles"
              v-if="!suggestAnswerRequest.isPending.value"
            ></span>
            <span
              class="pi pi-spinner animate-spin"
              v-if="suggestAnswerRequest.isPending.value"
            ></span>
          </button>
        </div>
        <div class="space-y-[16px] mt-[24px]">
          <div
            v-for="(_, i) in optionArray"
            :key="i"
            :class="
              cn(
                'rounded-[8px] flex justify-between items-center p-[16px]',
                backgroundColors[i % backgroundColors.length]
              )
            "
          >
            <div
              :class="
                cn(
                  'border border-neutral-200 w-[24px] h-[24px] flex justify-center items-center cursor-pointer',
                  values?.questionType === EQuestionType.MultipleChoice
                    ? 'rounded-[4px]'
                    : 'rounded-full',
                  values?.options[i]?.isCorrect ? 'bg-primary text-white' : ''
                )
              "
              @click="handleSetIsCorrect(i)"
            >
              <span class="pi pi-check"></span>
            </div>
            <Field :name="`options.${i}.content`" v-slot="{ field }">
              <input
                v-bind="field"
                type="text"
                class="min-h-[60px] p-[16px] text-[20px] text-white w-[calc(100%-20px-20px-16px*2)] placeholder:text-white/70"
                placeholder="Type answer option here"
              />
            </Field>
            <div
              class="w-[20px] h-[20px] flex justify-center items-center cursor-pointer"
              @click="handleRemoveOption(i)"
            >
              <span class="pi pi-trash"></span>
            </div>
          </div>
        </div>
        {{ question }}
        abc
        <div class="flex items-center gap-4">
          <Button
            label="Cancel"
            @click="closeCallback"
            text
            class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"
          ></Button>
          <Button
            label="Save"
            @click="handleSubmit()"
            text
            class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"
          ></Button>
        </div>
      </div>
    </template>
  </Dialog>
  <ConfirmDialog></ConfirmDialog>
</template>
