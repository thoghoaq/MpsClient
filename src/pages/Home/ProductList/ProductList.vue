<script setup lang="ts">
  import { onMounted } from 'vue'
  import ProductItem from './ProductItem/ProductItem.vue'
  import { useEProductStore } from '../../../stores/ecommerce/product'
  const eProductStore = useEProductStore()

  onMounted(() => {
    eProductStore.fetchProducts()
  })
</script>
<template>
  <div class="grid gap-5 m-5">
    <ProductItem
      v-for="product in eProductStore.products"
      :product="product"
    ></ProductItem>
  </div>
</template>
