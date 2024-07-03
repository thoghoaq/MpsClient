<script setup lang="ts">
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { onBeforeMount, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getLocale } from 'src/locales/prime'
  import { useI18n } from 'vue-i18n'
  import { getMessage } from 'src/locales'
  const primeVue = usePrimeVue()
  const i18n = useI18n()
  const settingStore = useSettingStore()
  const router = useRouter()
  const language = localStorage.getItem('language') || 'vi'

  onBeforeMount(() => {
    primeVue.changeTheme(
      'aura-light-indigo',
      settingStore.currentTheme,
      'theme-link',
      () => {},
    )
    primeVue.config.locale = getLocale(language)
    i18n.locale.value = language
    i18n.setLocaleMessage(language, getMessage(language))
  })

  onMounted(() => {
    const path = new URL(window.location.href).pathname
    if (path.startsWith('/')) {
      switch (path) {
        case '/shop-request':
          router.push('/seller/shops/create')
          break
      }
    }
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
          break

        default:
          break
      }
    }
    window.history.pushState({}, document.title, '/')
  })
</script>

<template>
  <Toast />
  <router-view />
</template>
