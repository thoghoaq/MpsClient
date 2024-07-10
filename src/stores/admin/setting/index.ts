import { defineStore } from 'pinia'
import { Setting } from './types'
import { useApi } from 'src/stores/api'
import { appConfig } from 'src/stores'
const api = useApi()

export const useSystemSettingStore = defineStore({
  id: 'system-setting',
  state: () => ({
    settings: <Setting[]>[],
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
  },
})
