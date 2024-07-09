<script setup lang="ts">
interface IProps {
  question: any;
  classWrapper?: string;
}

interface IEmits {
  (eventName: "click"): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { question, classWrapper } = toRefs(props);
</script>

<template>
  <div
    :key="question?.id || i"
    :class="cn('p-[16px] shadow rounded-[8px]', classWrapper)"
    @click="emit('click')"
  >
    <div>{{ question?.content }}</div>
    <div class="flex flex-wrap gap-[16px] mt-[16px]">
      <div
        v-for="(option, j) in question?.options"
        :key="option?.id || j"
        class="w-[calc(50%-8px)] flex items-center space-x-[16px]"
      >
        <div
          :class="
            cn(
              'w-[12px] h-[12px] rounded-full',
              option?.isCorrect ? 'bg-green-500' : 'bg-red-500'
            )
          "
        ></div>
        <span>
          {{ option?.content }}
        </span>
      </div>
    </div>
  </div>
</template>
