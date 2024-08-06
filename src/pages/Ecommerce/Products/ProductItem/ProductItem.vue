<script setup lang="ts">
  import { Product } from '../../../../stores/ecommerce/product/types'
  import NumberHelper from 'src/helpers/number-helper'
  import { isMobile } from 'src/stores';
  const props = defineProps({
    product: {
      type: Object as () => Product,
      required: true,
    },
  })
</script>
<template>
  <div class="bg-primary-reverse">
    <router-link
      :to="`/ecommerce/products/${props.product.id}`"
      class="no-underline"
    >
      <Card
        v-ripple
        class="w-full overflow-hidden border-0 border-round shadow-none cursor-pointer"
      >
        <template #header>
          <Image alt="image">
            <template #image>
              <img
                :src="
                  props.product.images[0]?.imagePath ??
                  'https://via.placeholder.com/200'
                "
                class="h-12rem md:h-20rem w-full"
                style="object-fit: cover"
              />
            </template>
          </Image>
        </template>
        <template #content>
          <div class="grid justify-content-between h-6rem">
            <div class="font-medium text-lg white-space-nowrap overflow-hidden text-overflow-ellipsis w-22rem">{{ props.product.name }}</div>
            <div class="grid grid-nogutter w-full justify-content-between align-items-center">
              <h3 class="text-red-500 mr-2">
                {{ NumberHelper.formatCurrency(props.product.price) }}
              </h3>
              <div class="text-gray-500">
                {{ `${$t('Sold')} ${props.product.soldCount}` }}
              </div>
            </div>
            <div class="flex gap-2">
              <i class="pi pi-map-marker"></i>
              <div>
                {{ props.product.shop.city }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </router-link>
  </div>
</template>
