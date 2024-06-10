<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useShopStore } from 'src/stores/seller/shop'
  import { Shop } from 'src/stores/seller/shop/types';
  const shopStore = useShopStore()

  onMounted(() => {
    shopStore.fetchShops()
  })

  const getFullAddress = function(shop: Shop) {
    const parts: string[] = [shop.address, shop.district, shop.city].filter((part): part is string => part != null && part.trim() !== "");
    return parts.join(", ")
  }

  const getStatus = function(shop: Shop) {
    return shop.isActive ? 'Openning' : 'Closing'
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <div v-for="shop in shopStore.shops" class="border-1 border-round-md m-4 p-1">
          <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
            <div class="list-none p-0 m-0 flex align-items-center font-medium mb-3">
              <i class="pi pi-map-marker mr-2"></i>
              <span>{{ getFullAddress(shop) }}</span>
            </div>
            <div
              class="flex align-items-start flex-column lg:justify-content-between lg:flex-row"
            >
              <div>
                <div class="font-medium text-3xl text-900">
                  
                  {{ shop.shopName }}</div>
                <div class="flex align-items-center text-700 flex-wrap">
                  <div class="mr-5 flex align-items-center mt-3">
                    <i v-if="shop.isActive" class="pi pi-check text-green-500 mr-2"></i>
                    <i v-else class="pi pi-times text-red-500 mr-2"></i>
                    <span :class=" shop.isActive ? 'text-green-500' : 'text-red-500'">{{ $t(getStatus(shop)) }}</span>
                  </div>
                  <div class="mr-5 flex align-items-center mt-3">
                    <i class="pi pi-phone mr-2"></i>
                    <span>{{ shop.phoneNumber }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-3 lg:mt-0">
                <Button :label="$t('Manage')" icon="pi pi-cog"></Button>
              </div>
            </div>
          </div>
      </div>
    </template>
  </Layout>
</template>
