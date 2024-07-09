<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import ProductItem from './ProductItem/ProductItem.vue'
  import { useEProductStore } from '../../../stores/ecommerce/product'
  const eProductStore = useEProductStore()
  const loadingMore = ref(false)
  onMounted(() => {
    eProductStore.filterProducts()
  })
</script>
<template>
  <ELayout :view-products="true">
    <template #page-content>
      <div
        class="grid grid-nogutter gap-5 w-full border-round overflow-auto bg-primary-reverse p-5 justify-content-center align-items-center"
      >
        <div v-if="eProductStore.products.length <= 0" style="width: 60rem">
          <div class="bg-primary-reverse p-4 text-center">
            {{ $t('No products found.') }}
          </div>
        </div>
        <ProductItem
          v-else
          v-for="product in eProductStore.products"
          :product="product"
        ></ProductItem>
        <div v-if="eProductStore.products.length > 0">
          <Button
            :label="$t('Load more')"
            class="w-12rem"
            outlined
            @click="
              () => {
                loadingMore = true
                eProductStore.loadMoreProducts().finally(() => {
                  loadingMore = false
                })
              }
            "
            :loading="loadingMore"
          ></Button>
        </div>
      </div>
    </template>
  </ELayout>
</template>
<style src="./App.css" lang="css" scoped></style>
