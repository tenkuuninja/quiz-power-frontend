<script setup lang="ts">
import { defineProps } from "vue";

interface IProps {
  value: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <div class="fixed inset-0 flex justify-center items-center bg-black/30">
    <div class="text-white font-bold text-[180px]">{{ props?.value }}</div>
  </div>
</template>
