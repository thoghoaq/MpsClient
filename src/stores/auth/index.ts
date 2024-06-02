import { defineStore } from 'pinia'
import { appConfig } from '../index'
import { Auth } from './types'
import { APIResponse } from '../types'
import axios, { AxiosError } from 'axios'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    auth: <Auth>{},
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
            accessToken: response.data["accessToken"],
            user: response.data["user"],
          }
          return {
            success: true,
            content: response.data,
            status: response.status,
          }
        })
        .catch((error: AxiosError) => {
          return {
            success: false,
            content: error.message,
            status: error.status,
          }
        })
    },
    logout() {},
  },
})
