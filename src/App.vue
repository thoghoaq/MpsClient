<script setup lang="ts">
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { onBeforeMount, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  const primeVue = usePrimeVue()
  const settingStore = useSettingStore()
  const router = useRouter()
  const route = useRoute()

  onBeforeMount(() => {
    primeVue.changeTheme(
      'aura-light-indigo',
      settingStore.currentTheme,
      'theme-link',
      () => {},
    )
  })

  onMounted(() => {
    const queryParams = route.query
    if (queryParams.redirect) {
      switch (queryParams.redirect) {
        case 'vnpay-return':
          router.push({
            name: 'vnPayReturn',
            query: {
              success: queryParams.success,
              paymentId: queryParams.paymentId,
              reason: queryParams.reason
            },
          })
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
