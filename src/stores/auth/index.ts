import { defineStore } from 'pinia'
import { appConfig } from '../index'
import { Auth } from './types'
import { APIResponse } from '../types'
import axios, { AxiosError } from 'axios'
import { StaffData } from '../admin/staff/types'
import { useApi } from '../api'
import { ShopOwnerData } from '../admin/shopowner/types'
import { CustomerData } from '../admin/customer/types'
const api = useApi()

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    auth: <Auth | undefined>JSON.parse(localStorage.getItem('auth') || '{}'),
  }),
  actions: {
    async login(email: string, password: string): Promise<APIResponse<any>> {
      return axios
        .post(appConfig.api.account.login, {
          email: email,
          password: password,
        })
        .then((response) => {
          this.auth = {
            accessToken: response.data['accessToken'],
            user: response.data['user'],
          }
          //store token in local storage
          localStorage.setItem('auth', JSON.stringify(this.auth))
          axios.defaults.headers.common['Authorization'] =
            `Bearer ${this.auth?.accessToken}`
          return {
            success: true,
            content: response.data,
            status: response.status,
          }
        })
        .catch((error: AxiosError<any, any>) => {
          if (error.response) {
            return {
              success: false,
              content: error.response.data['reason'],
              status: error.response.status,
            }
          }
          return {
            success: false,
            content: error.message,
            status: error.status,
          }
        })
    },
    logout() {
      this.auth = undefined
      localStorage.removeItem('auth')
    },
    async register(
      email: string,
      password: string | undefined,
      fullName: string,
      role: string,
      avatarPath: string | undefined,
      staffData: StaffData | undefined,
      shopOwnerData: ShopOwnerData | undefined,
      customerData: CustomerData | undefined
    ): Promise<APIResponse<any>> {
      return api
        .post(appConfig.api.account.register, {
          email: email,
          password: password,
          fullName: fullName,
          role: role,
          avatarPath: avatarPath,
          staffData: staffData,
          shopOwnerData: shopOwnerData,
          customerData: customerData
        })
        .then((response) => {
          return response;
        })
    },
  },
})
