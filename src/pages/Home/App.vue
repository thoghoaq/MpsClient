<script setup lang="ts">
  import { onMounted } from 'vue'
  import { appConfig } from 'src/stores'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  onMounted(() => {
    if (
      appConfig.loggedUser.isShopOwner &&
      !appConfig.loggedUser.shopManaging
    ) {
      router.push({ name: 'shops' })
    } else if (appConfig.loggedUser.isAdminGroup) {
      router.push({ name: 'staffs' })
    } else if (appConfig.loggedUser.isManagerGroup) {
      router.push({ name: 'shopOwners' })
    } else {
      router.push({ name: 'eProducts' })
    }
  })
</script>
<template>
  <Layout
    v-if="
      appConfig.loggedUser.isManagerGroup || appConfig.loggedUser.isShopOwner
    "
    :fetchShopsRequest="appConfig.loggedUser.isManagerGroup"
    :getNotifications="true"
  >
    <template #page-content>
      <div></div>
    </template>
  </Layout>
  <ELayout v-else>
    <template #page-content>
      <div></div>
    </template>
  </ELayout>
</template>
