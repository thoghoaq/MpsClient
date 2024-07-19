import { defineStore } from 'pinia'
import { Setting } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useSystemSettingStore = defineStore({
  id: 'system-setting',
  state: () => ({
    settings: <Setting[]>[],
    shopSettings: <Setting[]>[],
  }),
  actions: {
    async loadSettings() {
      return api.get(appConfig.api.setting.base).then((response) => {
        if (response.success) {
          this.settings = response.content
        }
        return response
      })
    },
    async saveSettings() {
      return api
        .post(appConfig.api.setting.base, {
          settings: this.settings,
        })
        .then((response) => {
          return response
        })
    },
    async loadShopSettings(shopId: string) {
      return api.get(appConfig.appendUrl(appConfig.api.setting.shop, {
        shopId: shopId
      })).then((response) => {
        if (response.success) {
          this.shopSettings = response.content
        }
        return response
      })
    },
    async refreshShopSettings(shopId: string) {
      return api.post(appConfig.api.setting.shopRefresh, {
        shopId: shopId
      }).then((response) => {
        if (response.success) {
          this.loadShopSettings(shopId)
        }
        return response
      })
    },
    async saveShopSettings(shopId: string) {
      return api
        .post(appConfig.api.setting.shop, {
          shopId: shopId,
          settings: this.shopSettings,
        })
        .then((response) => {
          return response
        })
    },
  },
})
