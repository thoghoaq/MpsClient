import { defineStore } from 'pinia'
import { Shop } from './types'
import { APIResponse } from 'src/stores/types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useShopStore = defineStore({
  id: 'shop',
  state: () => ({
    shops: <Shop[]>[],
    redirectId: <any>undefined,
  }),
  actions: {
    async fetchShops() {
      return api
        .get(appConfig.api.seller.shops)
        .then((response: APIResponse<Shop[]>) => {
          this.shops = response.content
          return response
        })
    },
    initShopManagement(shopId: number) {
      appConfig.loggedUser.shopManaging = this.shops.find((shop) => shop.id === shopId)
    }
  },
})
