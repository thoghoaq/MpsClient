import { defineStore } from 'pinia'
import { ProductCategory } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
import { TreeNode } from 'primevue/treenode'
const api = useApi()

export const useDataSourceStore = defineStore({
  id: 'dataSourceStore',
  state: () => ({
    productCategories: <ProductCategory[]>[],
  }),
  actions: {
    async fetchProductCategories() {
      return api.get(appConfig.api.datasource.categories).then((response) => {
        if (response.success) {
          this.productCategories = response.content
        }
        return response;
      })
    },
    getProductCategoryTree() {
      return this.productCategories.map((category) => {
        return <TreeNode>{
          data: {
            id: category.id,
            name: category.name,
            parentId: category.parentId,
          },
          children: category.children.map((child) => {
            return <TreeNode>{
              data: {
                id: child.id,
                name: child.name,
                parentId: child.parentId,
              },
            }
          }),
        }
      })
    },
    async saveProductCategory(data: any) {
      return api.post(appConfig.api.datasource.category, data)
    }
  },
})
