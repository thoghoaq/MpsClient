<script setup lang="ts">
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { onBeforeMount } from 'vue'
  const primeVue = usePrimeVue()
  const settingStore = useSettingStore()

  onBeforeMount(() => {
    primeVue.changeTheme(
      'aura-light-indigo',
      settingStore.currentTheme,
      'theme-link',
      () => {},
    )
  })
</script>

<template>
  <Toast />
  <router-view />
</template>
