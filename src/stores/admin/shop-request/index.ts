import { defineStore } from 'pinia'
import { Shop } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()
export const useShopRequestStore = defineStore({
  id: 'shopRequest',
  state: () => ({
    shops: [] as Shop[]
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
    async acceptRequest(id: number, isAccepted: boolean, reason: string | null) {
      return api
        .put(appConfig.api.staff.shop.accept, {
          id: id,
          isAccepted: isAccepted,
          comment: !isAccepted ? reason : null
        })
        .then((response) => {
          if (response.success) {
            var shop = this.shops.find((shop) => shop.id === id)
            shop!.isActive = isAccepted
            shop!.isAccepted = isAccepted
          }
          return response
        })
    },
  },
})
