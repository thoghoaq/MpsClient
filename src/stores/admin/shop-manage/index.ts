import { defineStore } from 'pinia'
import { Shop } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()
export const useShopManageStore = defineStore({
  id: 'shopManagement',
  state: () => ({
    shops: [] as Shop[]
  }),
  actions: {
    async fetchShops() {
      return api.get(appConfig.api.staff.shops).then((response) => {
        if (response.success) {
          this.shops = response.content
        }
        return response
      })
    },
    async searchShops(filter: string | null) {
      return api.get(appConfig.appendUrl(appConfig.api.staff.shops, {
        filter: filter
      })).then((response) => {
        if (response.success) {
          this.shops = response.content
        }
        return response
      })
    }
  },
})
