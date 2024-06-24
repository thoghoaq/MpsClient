import { defineStore } from 'pinia'
import { Order } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useEOrderStore = defineStore({
  id: 'eOrder',
  state: () => ({
    orders: <Order[]>[],
  }),
  actions: {
    async fetchOrders() {
      return api.get(appConfig.api.ecommerce.orders).then((response) => {
        this.orders = response.content
        return response
      })
    },
  },
})
