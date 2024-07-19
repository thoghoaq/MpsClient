import { defineStore } from 'pinia'
import { Notification } from './types'
import { useApi } from '../api'
import { appConfig } from '..'

const api = useApi()

export const useNotificationStore = defineStore({
  id: 'notification',
  state: () => ({
    notifications: <Notification[]>[],
  }),
  actions: {
    async getNotifications() {
      return api.get(appConfig.appendUrl(appConfig.api.notification.base, {
        userId: appConfig.loggedUser.userId,
      })).then((response) => {
        if (response.success) {
          this.notifications = response.content
        }
        return response
      })
    }
  },
})
