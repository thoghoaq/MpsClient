import { defineStore } from 'pinia'
import { Order } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
import { OrderStatus } from 'src/stores/types'
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
    async receivedOrder(orderId: number) {
      return api.put(appConfig.api.ecommerce.receiveOrder, {
        orderId: orderId,
      }).then((response) => {
        if (response.success) {
          const order = this.orders.find((o) => o.id === orderId)
          if (order) {
            order.orderStatusId = OrderStatus.Received
          }
        }
        return response
      })
    }
  },
})
