<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { AuthApi } from '~~/services/AuthApi'

const email = ref('')
const password = ref('')
const router = useRouter()

const loginRequest = useMutation({
  mutationFn: AuthApi.login,
})

const handleLogin = async () => {
  try {
    const loginResponse = await loginRequest.mutateAsync({
      username: email.value,
      password: password.value,
    })

    const token = loginResponse?.access_token

    localStorage.setItem('quiz-token', token)

    router.push({ path: '/dashboard/profile' })
  } catch (error) {
    //
  }
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
      <div class="w-full rounded-[52px] bg-white px-5 py-8 sm:px-8">
        <div class="mb-5 text-center">
          <div class="text-900 mb-3 text-3xl font-medium">Chào mừng bạn!</div>
          <span class="text-600 font-medium">Đăng nhập để tiếp tục</span>
        </div>

        <div>
          <label for="email1" class="text-900 mb-2 block text-xl font-medium">
            Tên đăng nhập
          </label>
          <InputText
            id="email1"
            v-model="email"
            type="text"
            placeholder="Email address"
            class="md:w-30rem mb-5 w-full"
            style="padding: 1rem"
          />

          <label
            for="password1"
            class="text-900 mb-2 block text-xl font-medium"
          >
            Mật khẩu
          </label>
          <Password
            id="password1"
            v-model="password"
            placeholder="Password"
            :toggleMask="true"
            class="mb-3 w-full"
            inputClass="w-full"
            :inputStyle="{ padding: '1rem' }"
          ></Password>

          <div class="mb-5 flex justify-between">
            <NuxtLink
              class="cursor-pointer text-right text-[12px] font-medium text-primary no-underline"
              href="/register"
            >
              Chưa có tài khoản?
            </NuxtLink>
            <NuxtLink
              class="cursor-pointer text-right text-[12px] font-medium text-primary no-underline"
              href="/forgot-password"
            >
              Quên mật khẩu??
            </NuxtLink>
          </div>
          <Button
            :loading="loginRequest.isPending?.value"
            label="Đăng nhập"
            class="w-full text-center text-xl"
            @click="handleLogin()"
          />
        </div>
      </div>
    </div>
  </div>

  <AppConfig simple />
</template>

<style scoped></style>
