<script setup lang="ts">
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { onBeforeMount, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const primeVue = usePrimeVue()
  const settingStore = useSettingStore()
  const router = useRouter()

  onBeforeMount(() => {
    primeVue.changeTheme(
      'aura-light-indigo',
      settingStore.currentTheme,
      'theme-link',
      () => {},
    )
  })

  onMounted(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const redirect = queryParams.get('redirect')
    if (redirect) {
      switch (redirect) {
        case 'vnpay-return':
          router.push({
            name: 'vnPayReturn',
            query: {
              success: queryParams.get('success'),
              paymentId: queryParams.get('paymentId'),
              reason: queryParams.get('reason'),
            },
          })
          window.history.pushState({}, document.title, window.location.pathname)
          break

        default:
          break
      }
    }
  })
</script>

<template>
  <Toast />
  <router-view />
</template>
