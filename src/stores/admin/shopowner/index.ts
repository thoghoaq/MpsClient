import { useApi } from 'src/stores/api'
import { defineStore } from 'pinia'
import { appConfig } from 'src/stores'
import { ShopOwner, ShopOwnerData, ShopOwnerEdit } from './types'
import { APIResponse, ERole } from 'src/stores/types'
const api = useApi()

export const useShopOwnerStore = defineStore({
  id: 'shopOwner',
  state: () => ({
    shopOwners: <ShopOwner[]>[],
    shopOwner: <ShopOwner & ShopOwnerData | undefined>undefined,
  }),
  actions: {
    async fetchShopOwners() {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.account.all, { role: ERole.ShopOwner }),
        )
        .then((response: APIResponse<ShopOwner[]>) => {
          this.shopOwners = response.content
        })
    },
    async searchShopOwners(query: string | null) {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.account.all, {
            query: query,
            role: ERole.ShopOwner,
          }),
        )
        .then((response: APIResponse<ShopOwner[]>) => {
          this.shopOwners = response.content
        })
    },
    async fetchShopOwner(userId: string) : Promise<ShopOwner & ShopOwnerData> {
      return api.get(`${appConfig.api.account.details}/${userId}`)
      .then((response: APIResponse<any>) => {
        return <ShopOwner & ShopOwnerData>{
          ...response.content,
        }
      })
    },
    async activeOrDeactive(userId: number) {
      var shopOwner = this.shopOwners.find(s => s.userId == userId);
      return api.put(appConfig.api.account.status, {
        userId: shopOwner?.userId,
        isActive: !shopOwner?.isActive,
      }).then((response) => {
        if (response.success) {
          shopOwner!.isActive = !shopOwner?.isActive
        }
        return response
      })
    }
  },
})
