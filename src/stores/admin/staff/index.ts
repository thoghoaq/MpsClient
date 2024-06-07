import { useApi } from 'src/stores/api'
import { defineStore } from 'pinia'
import { appConfig } from 'src/stores'
import { Staff } from './types'
import { APIResponse, ERole } from 'src/stores/types'
const api = useApi()

export const useStaffStore = defineStore({
  id: 'staff',
  state: () => ({
    staffs: <Staff[]>[],
  }),
  actions: {
    async fetchStaffs() {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.account.all, { role: ERole.Staff }),
        )
        .then((response: APIResponse<Staff[]>) => {
          this.staffs = response.content
        })
    },
    async searchStaffs(query: string | null) {
      return api
        .get(
          appConfig.appendUrl(appConfig.api.account.all, {
            query: query,
            role: ERole.Staff,
          }),
        )
        .then((response: APIResponse<Staff[]>) => {
          this.staffs = response.content
        })
    },
  },
})
