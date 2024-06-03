import { defineStore } from 'pinia'
import { appConfig } from '../index'
import { Auth } from './types'
import { APIResponse } from '../types'
import axios, { AxiosError } from 'axios'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    auth: <Auth>JSON.parse(localStorage.getItem('auth') || '{}'),
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
          //store token in local storage
          localStorage.setItem("auth", JSON.stringify(this.auth));
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
              content: error.response.data["reason"],
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
    logout() {},
  },
})
