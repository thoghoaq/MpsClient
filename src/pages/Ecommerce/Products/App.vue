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
      <div class="border-round overflow-auto bg-primary-reverse p-3">
        <div
          class="grid grid-nogutter justify-content-start"
        >
          <div v-if="eProductStore.products.length <= 0" class="w-full">
            <div class="bg-primary-reverse p-4 text-center">
              {{ $t('No products found.') }}
            </div>
          </div>
          <ProductItem
            v-else
            v-for="product in eProductStore.products"
            :product="product"
            class="col-6 md:col-6 lg:col-4 xl:col-3 p-3"
          ></ProductItem>
        </div>
        <div
          v-if="eProductStore.products.length > 0 && eProductStore.products.length >= eProductStore.pageSize"
          class="grid grid-nogutter align-items-center justify-content-center my-3"
        >
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
