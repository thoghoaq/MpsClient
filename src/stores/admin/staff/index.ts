import { useApi } from 'src/stores/api'
import { defineStore } from 'pinia'
import { appConfig } from 'src/stores'
import { Staff, StaffData, StaffEdit } from './types'
import { APIResponse, ERole } from 'src/stores/types'
const api = useApi()

export const useStaffStore = defineStore({
  id: 'staff',
  state: () => ({
    staffs: <Staff[]>[],
    staff: <Staff & StaffData | undefined>undefined,
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
    async fetchStaff(userId: string) : Promise<Staff & StaffData> {
      return api.get(`${appConfig.api.account.details}/${userId}`)
      .then((response: APIResponse<any>) => {
        return <Staff & StaffData>{
          ...response.content,
          identityCard: response.content?.staffData?.identityCard || '',
          address: response.content?.staffData?.address || '',
          identityCardFrontPath: response.content?.staffData?.identityCardFrontPath || '',
          identityCardBackPath: response.content?.staffData?.identityCardBackPath || '',
          certificatePath: response.content?.staffData?.certificatePath || '',
        }
      })
    },
    async activeOrDeactive(userId: number) {
      var staff = this.staffs.find(staff => staff.userId == userId);
      return api.put(appConfig.api.account.status, {
        userId: staff?.userId,
        isActive: !staff?.isActive,
      }).then((response) => {
        if (response.success) {
          staff!.isActive = !staff?.isActive
        }
        return response
      })
    }
  },
})
