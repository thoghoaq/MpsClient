<script setup lang="ts">
  import { onMounted } from 'vue'
  import { appConfig } from 'src/stores'
  import { useRouter } from 'vue-router'
  import ProductList from './ProductList/ProductList.vue'
  const router = useRouter()
  onMounted(() => {
    if (
      appConfig.loggedUser.isShopOwner &&
      !appConfig.loggedUser.shopManaging
    ) {
      router.push({ name: 'shops' })
    } else if (appConfig.loggedUser.isManagerGroup) {
      router.push({ name: 'staffs' })
    }
  })
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
  <ELayout :hide-category="true" v-else>
    <template #page-content>
      <ProductList></ProductList>
    </template>
  </ELayout>
</template>
