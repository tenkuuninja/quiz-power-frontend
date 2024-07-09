<script setup>
import { ref, computed } from "vue";
import { AuthApi } from "~~/services/AuthApi";

const email = ref("");
const password = ref("");
const checked = ref(false);
const router = useRouter();

const handleLogin = async () => {
  try {
    const loginResponse = await AuthApi.login({
      username: email.value,
      password: password.value,
    });

    const token = loginResponse?.access_token;

    localStorage.setItem("quiz-token", token);

    router.push({ path: "/dashboard/quiz" });
  } catch (error) {
    //
  }
};

definePageMeta({
  layout: false,
});
</script>

<template>
  <div
    class="flex items-center bg-[#f8fafc] justify-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
      <div
        class=""
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            var(--primary-color) 10%,
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="w-full bg-white py-8 px-5 sm:px-8"
          style="border-radius: 53px"
        >
          <div class="text-center mb-5">
            <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
            <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2"
              >Username</label
            >
            <InputText
              id="email1"
              v-model="email"
              type="text"
              placeholder="Email address"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
            />

            <label
              for="password1"
              class="block text-900 font-medium text-xl mb-2"
              >Password</label
            >
            <Password
              id="password1"
              v-model="password"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-3"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
            ></Password>

            <div class="flex items-center justify-between mb-5 gap-5">
              <div class="flex items-center">
                <Checkbox
                  id="rememberme1"
                  v-model="checked"
                  binary
                  class="mr-2"
                ></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div>
              <a
                class="font-medium no-underline ml-2 text-right cursor-pointer"
                style="color: var(--primary-color)"
                >Forgot password?</a
              >
            </div>
            <Button
              label="Sign In"
              class="w-full p-3 text-xl"
              @click="handleLogin()"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AppConfig simple />
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}
.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
