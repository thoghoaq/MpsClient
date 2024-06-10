<script setup lang="ts">
  import { appConfig } from 'src/stores'
</script>
<template>
  <Layout
    v-if="
      appConfig.loggedUser.isManagerGroup || appConfig.loggedUser.isShopOwner
    "
  >
    <template #page-content>
      <div></div>
    </template>
  </Layout>
  <ELayout>
    <template #page-content>
      <div></div>
    </template>
  </ELayout>
</template>
