<script setup lang="ts">
import { defineProps, ref } from 'vue'
interface IUpdateFormProps {
  image: File | string
}

interface IUpdateFormEmits {
  (eventName: 'change', file: File): void
}

const props = defineProps<IUpdateFormProps>()
const emit = defineEmits<IUpdateFormEmits>()
const image = ref('')

const handleChange = (e: any) => {
  const file = e.target.files?.[0]
  console.log(e, file)
  image.value = URL.createObjectURL(file)
  emit('change', file)
}

console.log(props?.image)

watchEffect(() => {
  if (props?.image instanceof File) {
    image.value = URL.createObjectURL(props?.image)
  } else {
    image.value = props?.image
  }
})
</script>

<template>
  <label
    class="group flex aspect-[16/9] cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-slate-400 p-[8px] text-neutral-600"
  >
    <img
      v-if="image"
      class="h-full w-full rounded-[8px] object-cover"
      :src="image"
      alt=""
    />
    <span
      v-if="!image"
      class="pi pi-image text-[56px] text-neutral-600 transition-all group-hover:text-neutral-800"
    />
    <input type="file" hidden id="" @change="handleChange" />
  </label>
</template>
