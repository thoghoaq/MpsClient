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
    totalRevenue: 0,
    totalExpectPayout: 0,
    totalPaidout: 0,
  }),
  actions: {
    async fetchShops(monthToDate: Date) {
      return api
        .get(appConfig.appendUrl(appConfig.api.shop.base, { monthToDate: monthToDate.toISOString() }))
        .then((response: APIResponse<Shop[]>) => {
          this.shops = response.content
          this.calculateOverview()
          return response
        })
    },
    async requestMonthlyPayout(monthToDate: Date) {
      return api
        .post(appConfig.api.payment.requestMonthlyPayout, { monthToDate: monthToDate.toISOString() })
        .then((response: APIResponse<any>) => {
          this.fetchShops(monthToDate)
          return response
        })
    },
    async acceptPayout(payoutId: number, monthToDate: Date) {
      return api
        .post(appConfig.api.payment.acceptPayout, { payoutId: payoutId })
        .then((response: APIResponse<any>) => {
          this.fetchShops(monthToDate)
          return response
        })
    },
    calculateOverview() {
      this.totalRevenue = this.shops.reduce((acc, shop) => acc + (shop.revenue || 0), 0)
      this.totalExpectPayout = this.shops.reduce((acc, shop) => acc + (shop.expectPayout || 0), 0)
      this.totalPaidout = this.shops.reduce((acc, shop) => acc + (shop.totalPayout || 0), 0)
    }
  },
})
