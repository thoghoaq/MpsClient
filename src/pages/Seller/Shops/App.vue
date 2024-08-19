<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useShopStore } from 'src/stores/seller/shop'
  import { Shop } from 'src/stores/seller/shop/types'
  import { useRouter } from 'vue-router'
  const shopStore = useShopStore()
  const router = useRouter()

  onMounted(() => {
    shopStore.fetchShops()
  })

  const getFullAddress = function (shop: Shop) {
    const parts: string[] = [shop.address, shop.district, shop.city].filter(
      (part): part is string => part != null && part.trim() !== '',
    )
    return parts.join(', ')
  }

  const getStatus = function (shop: Shop) {
    return shop.isActive ? 'Openning' : 'Closing'
  }

  const initShopManagement = function (shop: Shop) {
    shopStore.initShopManagement(shop.id)
    router.push(`/seller/shop-overview/${shop.id}`)
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <Menubar class="border-0 m-2 px-3">
        <template #start>
          <h3>{{ $t('Your Shops') }}</h3>
        </template>
        <template #end>
          <div class="flex align-items-center gap-2">
            <router-link to="/seller/shops/create">
              <Button
                icon="pi pi-plus"
                :label="$t('Request New Shop')"
                outlined
              ></Button>
            </router-link>
            <Button
                icon="pi pi-refresh"
                rounded
                outlined
                @click="shopStore.fetchShops()"
              />
          </div>
        </template>
      </Menubar>
      <div
        v-for="shop in shopStore.shops"
        class="border-1 border-round-md mx-4 p-1 mb-4"
      >
        <div class="flex justify-content-between align-items-center px-4 py-5 md:px-6 lg:px-8">
          <div>
            <div
              class="list-none p-0 m-0 flex align-items-center font-medium mb-3"
            >
              <i class="pi pi-map-marker mr-2"></i>
              <span>{{ getFullAddress(shop) }}</span>
            </div>
            <div
              class="flex align-items-start flex-column lg:justify-content-between lg:flex-row"
            >
              <div>
                <div class="font-medium text-3xl text-900">
                  {{ shop.shopName }}
                </div>
                <div class="flex align-items-center text-700 flex-wrap">
                  <div class="mr-5 flex align-items-center mt-3">
                    <i
                      v-if="shop.isActive"
                      class="pi pi-check text-green-500 mr-2"
                    ></i>
                    <i v-else class="pi pi-times text-red-500 mr-2"></i>
                    <span
                      :class="shop.isActive ? 'text-green-500' : 'text-red-500'"
                      >{{ $t(getStatus(shop)) }}</span
                    >
                  </div>
                  <div class="mr-5 flex align-items-center mt-3">
                    <i class="pi pi-phone mr-2"></i>
                    <span>{{ shop.phoneNumber }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div v-if="shop.isActive" class="mt-3 lg:mt-0 flex gap-2">
              <SplitButton
                :label="$t('Manage')"
                icon="pi pi-cog"
                :model="[
                  {
                    label: $t('Update'),
                    command: () => {
                      $router.push({name: 'shopsUpdate', params: {id: shop.id}})
                    },
                  },
                ]"
                @click="initShopManagement(shop)"
              ></SplitButton>
            </div>
            <div v-else-if="!shop.isAccepted">
              <div class="flex gap-3 align-items-center">
                <h4 class="text-red-500">{{ $t('Rejected') }}</h4>
                <Button :label="$t('Update')" outlined @click="$router.push({name: 'shopsUpdate', params: {id: shop.id}})" class="h-3rem w-8rem"></Button>
              </div>
            </div>
            <div v-else>
              <Button :label="$t('Update')" outlined @click="$router.push({name: 'shopsUpdate', params: {id: shop.id}})"></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
