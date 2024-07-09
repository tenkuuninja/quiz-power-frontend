<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { QuizApi, CategoryApi, ContestApi } from "~/services";
import { IoEyeOutline } from "oh-vue-icons/icons";
import { useForm, Form, Field } from "vee-validate";
import * as yup from "yup";
import dayjs from "dayjs";

interface IProps {
  contestId: number;
}

const props = defineProps<IProps>();

const { contestId } = props;

const router = useRouter();

const loading = ref(false);

const contestDetailRequest = useQuery({
  queryKey: ["contest-detail", ["contest-detail", contestId].join("-")],
  queryFn: () => ContestApi.getDetailContest({ id: contestId }),
});

const contest = computed(() => contestDetailRequest?.data?.value?.data);
const sortedPlayers = computed(() => {
  const players = contest?.value?.players || [];
  players.sort((a: any, b: any) => b?.score - a?.score);
  return players;
});
const questions = computed(() => {
  const players = contest?.value?.players || [];
  const questions = (contest?.value?.contestQuiz?.questions || [])?.map(
    (question: any) => {
      const totalCorrect = players?.filter?.((player: any) =>
        player?.answers?.find(
          (ans: any) =>
            ans?.contestQuestion?.id === question?.id && ans?.isCorrect
        )
      );
      const totalIncorrect = players?.filter?.((player: any) =>
        player?.answers?.find(
          (ans: any) =>
            ans?.contestQuestion?.id === question?.id && !ans?.isCorrect
        )
      );

      console.log(players)
      return { ...question, totalCorrect: totalCorrect?.length, totalIncorrect: totalIncorrect?.length };
    }
  );
  return questions;
});

</script>

<template>
  <span v-if="contestDetailRequest.isPending?.value" class="">Loading...</span>
  <div v-if="contestDetailRequest.isSuccess?.value" class="">
    <h1>{{ contest?.contestQuiz.name }}</h1>
    <div class="flex flex-wrap gap-[4px]">
      <Chip
        v-for="(category, i) in contest?.contestQuiz?.categories"
        :key="category?.id || i"
        :label="category?.name"
      />
    </div>
    <TabView>
      <TabPanel header="Người chơi">
        <DataTable :value="sortedPlayers || []">
          <Column field="name" header="Tên">
            <template #body="slotProps">
              <p class="line-clamp-2">
                {{ slotProps.data.name || "Untitle" }}
              </p>
            </template>
          </Column>
          <Column field="rating" header="Kết thúc">
            <template #body="slotProps">
              {{ dayjs(slotProps?.data?.endAt).format("YYYY-MM-DD HH:mm") }}
            </template>
          </Column>
          <Column header="Điểm số">
            <template #body="slotProps">
              {{ slotProps?.data?.score }}
            </template>
          </Column>
        </DataTable>
      </TabPanel>
      <TabPanel header="Câu hỏi">
        <DataTable :value="questions || []">
          <Column field="name" header="Tên">
            <template #body="slotProps">
              <p class="line-clamp-2">
                {{ slotProps.data.content || "Untitle" }}
              </p>
            </template>
          </Column>
          <Column header="Trả lời đúng" class="text-center">
            <template #body="slotProps">
              {{ slotProps?.data?.totalCorrect }}
            </template>
          </Column>
          <Column header="Trả lời sai" class="text-center">
            <template #body="slotProps">
              {{ slotProps?.data?.totalCorrect }}
            </template>
          </Column>
        </DataTable>
      </TabPanel>
    </TabView>
  </div>
</template>
