<script setup>
import { useQuery } from "@tanstack/vue-query";
import Carousel from "primevue/carousel";
import { ref, computed } from "vue";
import { QuizApi } from "~/services";
import { AuthApi } from "~~/services/AuthApi";

definePageMeta({
  layout: "user",
});

const router = useRouter();

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 4,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);

const getListQuizRequest = useQuery({
  queryKey: ["quizasd"],
  queryFn: () => QuizApi.getListQuiz(),
});

const quizzes = computed(() => getListQuizRequest.data?.value?.data || []);

watchEffect(() => {
  console.log(quizzes);
});
</script>

<template>
  <div class="container py-[100px]">
    <input
      v-bind="field"
      type="text"
      class="h-[60px] block w-full rounded-[8px] bg-white p-[16px] text-[32px] text-center border border-slate-200 max-w-[400px] mx-auto"
      placeholder="Enter Code"
    />
  </div>
  <div class="container">
    <div>
      <Carousel
        :value="quizzes"
        :numVisible="4"
        :numScroll="4"
        :responsiveOptions="responsiveOptions"
        circular
      >
        <template #item="slotProps">
          <div class="border-1 surface-border border-round m-2 p-3">
            <div class="mb-3">
              <div
                class="relative mx-auto bg-primary-200 rounded-[8px] h-[100px]"
              ></div>
            </div>
            <div class="mb-3 font-medium line-clamp-2">
              {{ slotProps.data?.name }}
            </div>
            <div class="flex justify-content-between align-items-center">
              <span>
                <Button icon="pi pi-heart" severity="secondary" outlined />
              </span>
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>
