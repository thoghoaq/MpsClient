<script setup lang="ts">
  import { onMounted } from 'vue'
  import ProductItem from './ProductItem/ProductItem.vue'
  import { useEProductStore } from '../../../stores/ecommerce/product'
  const eProductStore = useEProductStore()

  onMounted(() => {
    eProductStore.filterProducts()
  })
</script>
<template>
  <ELayout :view-products="true">
    <template #page-content>
      <div class="border-round grid-container overflow-auto">
        <ProductItem
          v-for="product in eProductStore.products"
          :product="product"
        ></ProductItem>
      </div>
    </template>
  </ELayout>
</template>
<style src="./App.css" lang="css" scoped></style>