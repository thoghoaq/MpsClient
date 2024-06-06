import { useApi } from 'src/stores/api'
import { defineStore } from 'pinia'
import { appConfig } from 'src/stores';
import { Staff } from './type';
import { APIResponse } from 'src/stores/types';
const api = useApi()

export const useStaffStore = defineStore({
  id: 'staff',
  state: () => ({
    staffs: <Staff[]>[],
  }),
  actions: {
    async fetchStaffs() {
      return api.get(appConfig.api.account.all).then((response : APIResponse<Staff[]>) => {
        this.staffs = response.content;
      });
    },
  },
})
