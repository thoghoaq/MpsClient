import { defineStore } from 'pinia'
import { PaymentDetails } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const usePaymentStore = defineStore({
  id: 'payment',
  state: () => ({
    paymentDetails: null as PaymentDetails | null,
  }),
  actions: {
    async fetchPaymentDetails(paymentId: any) {
      api
        .get(
          appConfig.appendUrl(appConfig.api.payment.details, {
            paymentId: paymentId,
          }),
        )
        .then((response) => {
          this.paymentDetails = response.content
          return response
        })
    },
  },
})
