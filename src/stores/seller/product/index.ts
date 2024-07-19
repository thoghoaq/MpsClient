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
          if (response.success) this.products = response.content
          return response
        })
    },
    async activeOrDeactiveProduct(productId: number) {
      var product = this.products.find(p => p.id == productId)
      return api
        .put(appConfig.api.shop.productStatus, {
          id: product?.id,
          isActive: product?.isActive ? false : true,
        })
        .then((response: APIResponse<any>) => {
          if (response.success) {
            product!.isActive = product?.isActive ? false : true
          }
          return response
        })
    },
  },
})
