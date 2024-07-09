<script setup lang="ts">
import { useField, useForm, type FormContext } from "vee-validate";

interface IFormProviderProps {
  methods: FormContext;
}

interface IFormProviderEmits {
  (eventName: "submit"): void;
  (eventName: "reset"): void;
}

const props = defineProps<IFormProviderProps>();
const emit = defineEmits<IFormProviderEmits>();

const methods = props?.methods;
</script>

<template>
  <ValidationObserver>
    <form @submit.prevent="emit('submit')" @reset.prevent="emit('reset')">
      <slot />
      {{ props?.methods?.handleSubmit }}
    </form>
  </ValidationObserver>
</template>
