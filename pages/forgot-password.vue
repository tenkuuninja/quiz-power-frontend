<script setup lang="ts">
import { ref, computed } from 'vue'
import { AuthApi } from '~~/services/AuthApi'
const step = ref(0)
const email = ref('')
const checked = ref(false)

const handleSubmitEmail = (_email: string) => {
  console.log(_email)
  email.value = _email
  step.value = 1
}

const handleBack = () => {
  step.value = 0
}

definePageMeta({
  layout: 'user',
})
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] overflow-hidden bg-[#f8fafc] py-[160px]">
    <div
      class="mx-auto w-full max-w-[360px] rounded-[56px] p-[6px]"
      style="
        background: linear-gradient(
          180deg,
          var(--primary-color) 10%,
          rgba(33, 150, 243, 0) 30%
        );
      "
    >
      <div
        class="w-full bg-white px-5 py-8 sm:px-8"
        style="border-radius: 53px"
      >
        <div class="mb-5 text-center">
          <div class="text-900 mb-3 text-3xl font-medium">Quên mật khẩu</div>
          <span class="text-600 font-medium"
            >Làm theo các bước dưới đây để lấy lại mật khẩu của bạn</span
          >
        </div>

        <ForgotPasswordEmailInput
          v-if="step === 0"
          :email="email"
          @submit="handleSubmitEmail"
        />
        <ForgotPasswordOtpInput
          v-if="step === 1"
          :email="email"
          @back="handleBack"
        />
      </div>
    </div>
  </div>

  <AppConfig simple />
</template>

<style scoped></style>
