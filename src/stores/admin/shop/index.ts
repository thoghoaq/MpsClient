import { defineStore } from 'pinia'
import { Shop } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
import { APIResponse } from 'src/stores/types'
const api = useApi()

export const usePayoutStore = defineStore({
  id: 'payout',
  state: () => ({
    shops: <Shop[]>[],
  }),
  actions: {
    async fetchShops(monthToDate: Date) {
      return api
        .get(appConfig.appendUrl(appConfig.api.shop.base, { monthToDate: monthToDate.toISOString() }))
        .then((response: APIResponse<Shop[]>) => {
          this.shops = response.content
          return response
        })
    },
  },
})
