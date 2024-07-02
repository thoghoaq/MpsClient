import { defineStore } from 'pinia'
import { Product } from './types'
import { APIResponse } from 'src/stores/types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useEProductStore = defineStore({
  id: 'ecommerce-product',
  state: () => ({
    products: <Product[]>[]
  }),
  actions: {
    async fetchProducts() {
      return api
        .get(appConfig.api.ecommerce.products)
        .then((response: APIResponse<Product[]>) => {
          this.products = response.content
          return response
        })
    },
    async fetchProductDetails(id: string) {
      return api
        .get(`${appConfig.api.ecommerce.products}/${id}`)
        .then((response) => {
          return response
        })
    },
    async fetchProductsByCategory(categoryId: number[]) {
      return api
        .get(appConfig.appendUrl(appConfig.api.ecommerce.products, {
          categoriesId: categoryId
        }))
        .then((response: APIResponse<Product[]>) => {
          this.products = response.content
          return response
        })
    }
  },
})
