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
    productCategoryTree: <TreeNode[]>[],
  }),
  actions: {
    async fetchProductCategories() {
      return api.get(appConfig.api.datasource.categories).then((response) => {
        if (response.success) {
          this.productCategories = response.content
          this.productCategoryTree = this.getProductCategoryTree()
        }
        return response
      })
    },
    async searchProductCategories(filter: string | undefined) {
      return api.get(appConfig.appendUrl(appConfig.api.datasource.categories, { filter })).then((response) => {
        if (response.success) {
          this.productCategories = response.content
          this.productCategoryTree = this.getProductCategoryTree()
        }
        return response
      })
    },
    getProductCategoryTree() {
      return this.productCategories.map((category, index) => {
        return <TreeNode>{
          key: `${index}`,
          data: {
            id: category.id,
            name: category.name,
            parentId: category.parentId,
          },
          children: category.children.map((child, i) => {
            return <TreeNode>{
              key: `${index}-${i}`,
              data: {
                id: child.id,
                name: child.name,
                parentId: child.parentId,
              },
              children: child.children.map((child2, i2) => {
                return <TreeNode>{
                  key: `${index}-${i}-${i2}`,
                  data: {
                    id: child2.id,
                    name: child2.name,
                    parentId: child2.parentId,
                  },
                  children: [],
                }
              }),
            }
          }),
        }
      })
    },
    async saveProductCategory(data: any) {
      return api.post(appConfig.api.datasource.category, data).then((response) => {
        if (response.success) {
          this.fetchProductCategories()
        }
        return response
      })
    },
    appendChildToTree(key: string, child: TreeNode, root?: boolean) {
      if (!root) {
        const keys = key.split('-')
        let node = this.productCategoryTree[parseInt(keys[0])]
        for (let i = 1; i < keys.length; i++) {
          node = node.children![parseInt(keys[i])]
        }
        node.children!.push(child)
      } else {
        this.productCategoryTree.push(child)
      }
    },
  },
})
