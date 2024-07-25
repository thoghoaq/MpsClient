import { defineStore } from 'pinia'
import { appConfig } from '../index'
import { Auth, PayPalAuth, PayPalCustomer, User, UserDevice } from './types'
import { APIResponse } from '../types'
import axios, { AxiosError } from 'axios'
import { StaffData } from '../admin/staff/types'
import { useApi } from '../api'
import { ShopOwnerData } from '../admin/shopowner/types'
import { CustomerData } from '../admin/customer/types'
import { initFirebaseMessaging } from '../firebase'
import { getDeviceInfo } from 'src/helpers/device-helper'
const api = useApi()

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    auth: <Auth | undefined>JSON.parse(localStorage.getItem('auth') || '{}'),
    userDevice: <UserDevice | undefined>(
      JSON.parse(localStorage.getItem('userDevice') || '{}')
    ),
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
            refreshToken: response.data['refreshToken'],
            expiresIn: response.data['expiresIn'],
            user: response.data['user'],
          }
          //store token in local storage
          localStorage.setItem('auth', JSON.stringify(this.auth))
          appConfig.loggedUser = this.auth.user
          axios.defaults.headers.common['Authorization'] =
            `Bearer ${this.auth?.accessToken}`

          // register device
          // initFirebaseMessaging().then((token) => {
          //   if (token) {
          //     const deviceInfo = getDeviceInfo()
          //     this.updateDevice(token, deviceInfo?.browserName)
          //   }
          // })
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
              content:
                error.response.data['reason'] ||
                error.response.data['message'] ||
                error.response.data ||
                error.response.status,
              status: error.response.status,
            }
          }
          return {
            success: false,
            content: error.message || 'Internal Server Error',
            status: error.status,
          }
        })
    },
    logout() {
      api
        .put(appConfig.api.account.devices, {
          id: this.userDevice?.id,
          isLogged: false,
        })
        .then((response) => {
          if (response.success) {
            var device = response.content['device']
            if (device) {
              localStorage.setItem('userDevice', JSON.stringify(device))
              this.userDevice = response.content['device']
            }
          }
          return response
        })
        .finally(() => {
          this.auth = undefined
          localStorage.removeItem('auth')
          appConfig.loggedUser = <User>{
            isManagerGroup: false,
            isAdminGroup: false,
            isShopOwner: false,
            isCustomer: false,
            isGuest: true,
          }
        })
    },
    async register(
      email: string,
      password: string | undefined,
      fullName: string,
      role: string,
      avatarPath: string | undefined,
      staffData: StaffData | undefined,
      shopOwnerData: ShopOwnerData | undefined,
      customerData: CustomerData | undefined,
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
          customerData: customerData,
        })
        .then((response) => {
          return response
        })
    },
    async refresh() {
      if (!this.auth) return
      return api
        .post(appConfig.api.account.refresh, {
          refreshToken: this.auth?.refreshToken,
        })
        .then((response) => {
          this.auth!.accessToken = response.content['accessToken']
          this.auth!.refreshToken = response.content['refreshToken']
          this.auth!.expiresIn = response.content['expiresIn']
          localStorage.setItem('auth', JSON.stringify(this.auth))
          axios.defaults.headers.common['Authorization'] =
            `Bearer ${this.auth?.accessToken}`
          return response
        })
        .catch((error: AxiosError<any, any>) => {
          if (error.response) {
            return {
              success: false,
              content:
                error.response.data['reason'] ||
                error.response.data['message'] ||
                error.response.data ||
                error.response.status,
              status: error.response.status,
            }
          }
          return {
            success: false,
            content: error.message || 'Internal Server Error',
            status: error.status,
          }
        })
    },
    async authPayPal(code: string) {
      return axios
        .post(
          appConfig.api.external.payPal.auth,
          {
            grant_type: 'authorization_code',
            code: code,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
              username: import.meta.env.VITE_PAYPAL_CLIENT_ID,
              password: import.meta.env.VITE_PAYPAL_CLIENT_SECRET,
            },
          },
        )
        .then((response) => {
          return {
            success: true,
            content: response.data,
            status: response.status,
          }
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error)
          if (error.response) {
            return {
              success: false,
              content:
                error.response.data['reason'] ||
                error.response.data['message'] ||
                error.response.data ||
                error.response.status,
              status: error.response.status,
            }
          }
          return {
            success: false,
            content: error.message || error.status,
            status: error.status,
          }
        })
    },
    async getPayPalCustomer(accessToken: string) {
      return api
        .get(appConfig.api.external.payPal.customerInfo, {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        })
        .then((response: APIResponse<PayPalCustomer>) => {
          return response
        })
        .catch((error: AxiosError<any, any>) => {
          if (error.response) {
            return {
              success: false,
              content:
                error.response.data['reason'] ||
                error.response.data['message'] ||
                error.response.data ||
                error.response.status,
              status: error.response.status,
            }
          }
          return {
            success: false,
            content: error.message || 'Internal Server Error',
            status: error.status,
          }
        })
    },
    async getLoggedUser() {
      return api
        .get(appConfig.api.account.loggedUser)
        .then((response) => {
          this.auth!.user = response.content
          localStorage.setItem('auth', JSON.stringify(this.auth))
          return response
        })
        .catch((error: AxiosError<any, any>) => {
          if (error.response) {
            return {
              success: false,
              content:
                error.response.data['reason'] ||
                error.response.data['message'] ||
                error.response.data ||
                error.response.status,
              status: error.response.status,
            }
          }
          return {
            success: false,
            content: error.message || 'Internal Server Error',
            status: error.status,
          }
        })
    },
    async updateDevice(deviceToken: string, deviceName: string) {
      return api
        .put(appConfig.api.account.devices, {
          id: this.userDevice?.id,
          deviceToken: deviceToken,
          deviceName: deviceName,
          isLogged: true,
        })
        .then((response) => {
          if (response.success) {
            var device = response.content['device']
            if (device) {
              localStorage.setItem('userDevice', JSON.stringify(device))
              this.userDevice = response.content['device']
            }
          }
          return response
        })
    },
  },
})
