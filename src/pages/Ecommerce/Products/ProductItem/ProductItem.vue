<script setup lang="ts">
  import { Product } from '../../../../stores/ecommerce/product/types'
  import NumberHelper from 'src/helpers/number-helper'
  const props = defineProps({
    product: {
      type: Object as () => Product,
      required: true,
    },
  })
</script>
<template>
  <div class="bg-primary-reverse col">
    <router-link
      :to="`/ecommerce/products/${props.product.id}`"
      class="no-underline"
    >
      <Card
        v-ripple
        class="w-ful overflow-hidden border-0 border-round shadow-none cursor-pointer"
        style="min-width: 18rem"
      >
        <template #header>
          <Image alt="image">
            <template #image>
              <img
                :src="
                  props.product.images[0]?.imagePath ??
                  'https://via.placeholder.com/200x250'
                "
                class="h-20rem w-full"
                style="object-fit: cover"
              />
            </template>
          </Image>
        </template>
        <template #content>
          <div class="flex flex-column justify-content-between h-5rem">
            <div class="font-medium text-lg white-space-nowrap overflow-hidden text-overflow-ellipsis w-22rem">{{ props.product.name }}</div>
            <div class="flex justify-content-between align-items-center">
              <h3 class="text-red-500">
                {{ NumberHelper.formatCurrency(props.product.price) }}
              </h3>
              <div class="text-gray-500 ml-2">
                {{ `${$t('Sold')} ${props.product.soldCount}` }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </router-link>
  </div>
</template>
