<script setup lang="ts">
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { onBeforeMount, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getLocale } from 'src/locales/prime'
  import { useI18n } from 'vue-i18n'
  import { getMessage } from 'src/locales'
  import { useShopStore } from './stores/seller/shop'
  import { appConfig } from './stores'
  import { initFirebaseMessaging } from './stores/firebase'
  import { getDeviceInfo } from 'src/helpers/device-helper'
  import { useAuthStore } from './stores/auth'
  import { onMessage } from 'firebase/messaging'
  import { messaging } from './stores/firebase'
  import { useToastStore } from './stores/toast'
  import { useNotificationStore } from './stores/notification'
  const notificationStore = useNotificationStore()
  const toast = useToastStore()
  const authStore = useAuthStore()
  const shopStore = useShopStore()
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
    const queryParams = new URLSearchParams(window.location.search)

    if (path.startsWith('/')) {
      switch (path) {
        case '/shop-request':
          const redirectId = localStorage.getItem('shopRedirectId')
          const code = queryParams.get('code')
          if (redirectId) {
            router.push({
              path: `/seller/shops/${redirectId}`,
              query: { code: code },
            })
          } else {
            router.push({
              path: `/seller/shops/create`,
              query: { code: code },
            })
          }
          break
      }
    }

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

    if (!appConfig.loggedUser.isGuest) {
      initFirebaseMessaging().then((token) => {
        if (token) {
          var deviceInfo = getDeviceInfo()
          authStore.updateDevice(token, deviceInfo?.browserName)
        }
      })
    }
  })

  // onMessage(messaging, (payload) => {
  //   console.log('Message received. ', payload)
  //   // Show a notification or update the UI with the message payload
  //   toast.custom(payload.notification?.title, payload.notification?.body, 5000)
  //   notificationStore.getNotifications()
  // })
</script>

<template>
  <Toast />
  <router-view />
</template>
