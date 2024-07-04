import { defineStore } from 'pinia'
import { ShopInfo } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useOverviewStore = defineStore({
  id: 'overview',
  state: () => ({
    shopInfo: <ShopInfo>{},
  }),
  actions: {
    async fetchOverview(shopId: string, monthToDate: Date) {
      api
        .get(
          appConfig.appendUrl(appConfig.api.seller.shopOverview, {
            shopId,
            monthToDate: monthToDate.toISOString(),
          }),
        )
        .then((response) => {
          this.shopInfo = response.content
          return response
        })
    },
  },
})
