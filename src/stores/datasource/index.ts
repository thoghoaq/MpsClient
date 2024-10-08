import { defineStore } from 'pinia'
import { GoongPlaceResponse, ProductBrand, ProductCategory } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
import { TreeNode } from 'primevue/treenode'
import { APIResponse } from '../types'
const api = useApi()

export const useDataSourceStore = defineStore({
  id: 'data-source',
  state: () => ({
    productCategories: <ProductCategory[]>[],
    productCategoryTree: <TreeNode[]>[],
    productBrands: <ProductBrand[]>[],
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
      return api
        .get(
          appConfig.appendUrl(appConfig.api.datasource.categories, { filter }),
        )
        .then((response) => {
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
          label: category.name,
          data: {
            id: category.id,
            name: category.name,
            parentId: category.parentId,
          },
          children: category.children.map((child, i) => {
            return <TreeNode>{
              key: `${index}-${i}`,
              label: child.name,
              data: {
                id: child.id,
                name: child.name,
                parentId: child.parentId,
              },
              children: child.children.map((child2, i2) => {
                return <TreeNode>{
                  key: `${index}-${i}-${i2}`,
                  label: child2.name,
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
      return api
        .post(appConfig.api.datasource.category, data)
        .then((response) => {
          if (response.success) {
            this.fetchProductCategories()
          }
          return response
        })
    },
    getCategoryFromTree(id: number) {
      const findCategory = (node: TreeNode): TreeNode | undefined => {
        if (node.data.id === id) {
          return node
        }
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            const found = findCategory(node.children[i])
            if (found) {
              return found
            }
          }
        }
      }
      for (let i = 0; i < this.productCategoryTree.length; i++) {
        const found = findCategory(this.productCategoryTree[i])
        if (found) {
          return found
        }
      }
    },
    getNodeFromKey(key: string) {
      const keys = key.split('-')
      let node = this.productCategoryTree[parseInt(keys[0])]
      for (let i = 1; i < keys.length; i++) {
        node = node.children![parseInt(keys[i])]
      }
      return node
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
    removeChildFromTree(node: TreeNode) {
      const keys = node.key!.split('-')
      let parent = this.productCategoryTree[parseInt(keys[0])]
      if (keys.length === 1) {
        this.productCategoryTree.splice(parseInt(keys[0]), 1)
        return
      }
      for (let i = 1; i < keys.length - 1; i++) {
        parent = parent.children![parseInt(keys[i])]
      }
      parent.children!.splice(parseInt(keys[keys.length - 1]), 1)
    },
    async deleteProductCategory(id: number | null) {
      if (!id) {
        return { success: false, content: 'Invalid ID' }
      }
      return api
        .delete(`${appConfig.api.datasource.category}/${id}`)
        .then((response) => {
          if (response.success) {
            const node = this.getCategoryFromTree(id!)
            if (node) {
              this.removeChildFromTree(node)
            }
          }
          return response
        })
    },
    async fetchProductBrands() {
      return api.get(appConfig.api.datasource.brands).then((response) => {
        if (response.success) {
          this.productBrands = response.content
        }
        return response
      })
    },
    async getPlaceAutocomplete(place: string) {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.external.goong.place.autoComplete, {
            api_key: import.meta.env.VITE_GOONG_API_KEY,
            input: place,
          }),
          {
            'Content-Type': 'application/json',
          },
        )
        .then((response: APIResponse<GoongPlaceResponse>) => {
          return response
        })
    },
  },
})
