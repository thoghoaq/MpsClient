import { defineStore } from 'pinia'
import { Order } from './types'
import { APIResponse, OrderStatus } from 'src/stores/types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useOrderStore = defineStore({
  id: 'order',
  state: () => ({
    orders: <Order[]>[],
  }),
  actions: {
    async fetchOrders() {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.shop.orders, {
            shopId: appConfig.loggedUser.shopManaging?.id,
          }),
        )
        .then((response: APIResponse<Order[]>) => {
          this.orders = response.content
          return response
        })
    },
    async filterOrders(statusId: number) {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.shop.orders, {
            shopId: appConfig.loggedUser.shopManaging?.id,
            statusId: statusId,
          }),
        )
        .then((response: APIResponse<Order[]>) => {
          this.orders = response.content
          return response
        })
    },
    async updateOrderStatus(orderId: any, statusId: number) {
      return api
        .post(appConfig.api.shop.order.status, {
          orderId: orderId,
          status: statusId,
        })
        .then((response: APIResponse<any>) => {
          // update value of status
          const order = this.orders.find((o) => o.id === orderId)
          if (order) {
            order.orderStatusId = statusId
            order.orderStatus = {
              id: statusId,
              name: OrderStatus[statusId].toString(),
            }
          }
          return response
        })
    },
  },
})
