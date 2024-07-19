import { defineStore } from 'pinia'
import { Product } from './types'
import { APIResponse } from 'src/stores/types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useProductStore = defineStore({
  id: 'product',
  state: () => ({
    products: <Product[]>[],
  }),
  actions: {
    async fetchProducts(query?: string | null) {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.shop.products, {
            shopId: appConfig.loggedUser.shopManaging?.id,
            filter: query,
          }),
        )
        .then((response: APIResponse<Product[]>) => {
          this.products = response.content
          return response
        })
    },
  },
})
