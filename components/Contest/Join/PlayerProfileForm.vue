<script setup lang="ts">
import { useForm, Field } from "vee-validate";
import { defineProps } from "vue";
import * as yup from "yup";
import { ContestApi } from "~/services";
import { useContestStore } from "~/stores";

const contestStore = useContestStore();

const validationSchema = yup.object({
  name: yup.string().trim().required("Đây là trường bắt buộc"),
  avatar: yup.number(),
});

interface IProps {
  contestId: string;
}

interface IEmits {
  (eventName: "submit", question: any): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const form = useForm({
  validationSchema: validationSchema,
  initialValues: {
    name: "",
    avatar: 1,
  },
});

const { contestId } = toRefs(props);

const handleSubmit = form.handleSubmit(async () => {
  try {
    const joinResponse = await ContestApi.joinContest({
      contestId: props?.contestId,
      ...form.values,
    });

    contestStore.setPlayerIdByContestId(
      props?.contestId,
      joinResponse?.data?.id
    );
  } catch (error) {
    //
    console.log(error);
  }
});
</script>

<template>
  <div class="p-4 flex items-center justify-center min-h-screen bg-primary-50">
    <form
      class="max-w-[500px] w-full bg-slate-700 rounded-[8px] p-[16px]"
      @submit.prevent="handleSubmit"
    >
      <Field name="name" v-slot="{ field }" class="456">
        <input
          v-bind="field"
          type="text"
          class="h-[60px] w-full rounded-[8px] bg-white p-[16px] text-[32px] text-center"
          placeholder="Your name"
        />
        <!-- <span>{{ errorMessage }}</span> -->
      </Field>
      <div class="flex flex-wrap justify-between">
        <div
          v-for="(_, i) of [...Array(12)]"
          :key="i"
          class="w-[calc(16.66%-8px)] mt-[16px] relative cursor-pointer"
          @click="form.setFieldValue('avatar', i + 1)"
        >
          <img :src="`/assets/contest/avatar/avataaars-${i + 1}.svg`" alt="" />
          <div
            v-if="form.values?.avatar === i + 1"
            class="flex justify-center items-center absolute bottom-0 right-0 bg-primary w-[28px] h-[28px] rounded-full"
          >
            <span class="pi pi-check text-white"></span>
          </div>
        </div>
      </div>
      <Button
        size="large"
        label="Join"
        type="submit"
        class="w-full mt-[24px]"
      />
    </form>
  </div>
</template>
