<script setup>
import { ref, computed } from 'vue'
import { AuthApi } from '~~/services/AuthApi'
const email = ref('')
const password = ref('')
const checked = ref(false)

const handleRegister = () => {
  AuthApi.register({
    username: email.value,
    password: password.value,
  })
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

        <ForgotPasswordEmailInput />
      </div>
    </div>
  </div>

  <AppConfig simple />
</template>

<style scoped></style>
