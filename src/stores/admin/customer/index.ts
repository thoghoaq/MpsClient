import { useApi } from 'src/stores/api'
import { defineStore } from 'pinia'
import { appConfig } from 'src/stores'
import { Customer, CustomerData, CustomerEdit } from './types'
import { APIResponse, ERole } from 'src/stores/types'
const api = useApi()

export const useCustomerStore = defineStore({
  id: 'customer',
  state: () => ({
    customers: <Customer[]>[],
    customer: <Customer & CustomerData | undefined>undefined,
  }),
  actions: {
    async fetchCustomers() {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.account.all, { role: ERole.Customer }),
        )
        .then((response: APIResponse<Customer[]>) => {
          this.customers = response.content
        })
    },
    async searchCustomers(query: string | null) {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.account.all, {
            query: query,
            role: ERole.Customer,
          }),
        )
        .then((response: APIResponse<Customer[]>) => {
          this.customers = response.content
        })
    },
    async fetchCustomer(userId: string) : Promise<Customer & CustomerData> {
      return api.get(`${appConfig.api.account.details}/${userId}`)
      .then((response: APIResponse<any>) => {
        return <Customer & CustomerData>{
          ...response.content,
        }
      })
    },
    async activeOrDeactive(userId: number) {
      var customer = this.customers.find(c => c.userId == userId);
      return api.put(appConfig.api.account.status, {
        userId: customer?.userId,
        isActive: !customer?.isActive,
      }).then((response) => {
        if (response.success) {
          customer!.isActive = !customer?.isActive
        }
        return response
      })
    }
  },
})
