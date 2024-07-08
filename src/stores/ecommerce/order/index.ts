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
    async feedback(
      productId: number,
      orderId: number,
      feedback: string | null,
      rating: number,
    ) {
      return api
        .post(appConfig.api.ecommerce.feedback, {
          productId,
          orderId,
          feedback,
          rating,
        })
        .then((response) => {
          if (response.success) {
            const order = this.orders.find((o) => o.id === orderId)
            if (order) {
              const orderDetail = order.orderDetails.find(
                (o) => o.productId === productId,
              )
              if (orderDetail) {
                orderDetail.isFeedbacked = true
              }
            }
          }
          return response
        })
    },
  },
})
