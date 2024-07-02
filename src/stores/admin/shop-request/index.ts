import { defineStore } from 'pinia'
import { Shop } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()
export const useShopRequestStore = defineStore({
  id: 'shopRequest',
  state: () => ({
    shops: [] as Shop[],
  }),
  actions: {
    async fetchShops() {
      return api.get(appConfig.api.shop.request).then((response) => {
        if (response.success) {
          this.shops = response.content
        }
        return response
      })
    },
    async acceptRequest(id: number) {
      return api
        .post(appConfig.api.shop.acceptRequest, {
          shopId: id,
        })
        .then((response) => {
          this.shops.find((shop) => shop.id === id)!.isActive = true
          return response
        })
    },
  },
})
