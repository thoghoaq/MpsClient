<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import useVuelidate from '@vuelidate/core'
  import { required, email, minLength } from '@vuelidate/validators'
  import { useAuthStore } from '../../stores/auth'
  import { router } from 'src/router'
  import { useToastStore } from 'src/stores/toast'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const authStore = useAuthStore()
  const toast = useToastStore()
  const state = reactive({
    email: '',
    password: '',
    rememberMe: false,
  })

  const rules = {
    email: {
      required,
      email,
    },
    password: { required, minLength: minLength(8) },
    rememberMe: {},
  }

  const v$ = useVuelidate(rules, state)

  const submitForm = () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
      loading.value = true
      authStore.login(state.email, state.password).then((response) => {
        if (response.success) {
          router.push({ name: 'home' })
          toast.success(t('Logged in successfully'))
        } else {
          toast.error(response.content)
        }
        loading.value = false
      })
    }
  }

  const loading = ref(false);
</script>
<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1600 800"
      class="fixed left-0 top-0 min-h-screen min-w-screen"
      preserveAspectRatio="none"
    >
      <rect fill="var(--primary-500)" width="1600" height="800"></rect>
      <path
        fill="var(--primary-400)"
        d="M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2
        478.4 581z"
      ></path>
      <path
        fill="var(--primary-300)"
        d="M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z"
      ></path>
      <path
        fill="var(--primary-200)"
        d="M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z"
      ></path>
      <path
        fill="var(--primary-100)"
        d="M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z"
      ></path>
    </svg>
    <div
      class="px-5 min-h-screen flex justify-content-center align-items-center"
    >
      <div
        class="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1"
      >
        <div class="mb-4">
          <div class="text-900 text-xl font-bold mb-2">{{ $t('Log in') }}</div>
          <span class="text-600 font-medium">{{
            $t('Please enter your details')
          }}</span>
        </div>
        <form>
          <div class="flex flex-column">
            <div class="mb-4 text-right">
              <InputGroup>
                <InputGroupAddon>
                  <i class="pi pi-envelope"></i>
                </InputGroupAddon>
                <InputText
                  v-model="state.email"
                  placeholder="Email"
                  class="w-full"
                  autocomplete="username"
                  @blur="v$.email.$touch"
                  :invalid="v$.email.$error"
                />
              </InputGroup>
              <small class="p-error" v-if="v$.email.$error">{{
                $t(v$.email.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="mb-4 text-right">
              <InputGroup>
                <InputGroupAddon>
                  <i class="pi pi-lock"></i>
                </InputGroupAddon>
                <Password
                  v-model="state.password"
                  :placeholder="$t('Password')"
                  toggleMask
                  :feedback="false"
                  class="w-full"
                  v-bind:input-props="{ autocomplete: 'current-password' }"
                  @blur="v$.password.$touch"
                  :invalid="v$.password.$error"
                />
              </InputGroup>
              <small class="p-error" v-if="v$.password.$error">{{
                $t(v$.password.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="mb-4 flex flex-wrap gap-3">
              <div>
                <Checkbox
                  v-model="state.rememberMe"
                  input-id="rememberMe"
                  :binary="true"
                  class="mr-2"
                />
                <label for="rememberMe" class="text-900 font-medium mr-8">
                  {{ $t('Remember me') }}
                </label>
              </div>
              <router-link to="/password-reset">
                <Button
                  :label="$t('Reset password')"
                  link
                  class="p-0 text-600 text-primary"
                />
              </router-link>
            </div>
            <Button :label="$t('Log in')" :loading="loading" @click="submitForm" />
            <div class="mt-3">
              <span>{{ $t("Don't have an account? ") }}</span>
              <router-link to="/sign-up">
                <Button :label="$t('Sign up')" link class="p-0 text-primary" />
              </router-link>
            </div>
            <div class="mt-3">
              <router-link to="/ecommerce/products">
                <Button :label="$t('Home')" link class="p-0 text-primary" />
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
