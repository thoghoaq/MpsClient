import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'

export const useToastStore = defineStore({
  id: 'toast',
  state: () => ({
    life: 2000,
    $toasts: useToast(),
  }),
  actions: {
    success(message: string) {
      const toast = this.$toasts
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: this.life,
      })
    },
    error(message: string) {
      const toast = this.$toasts
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: this.life,
      })
    },
    info(message: string) {
      const toast = this.$toasts
      toast.add({
        severity: 'info',
        summary: 'Info',
        detail: message,
        life: this.life,
      })
    },
    warning(message: string) {
      const toast = this.$toasts
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: message,
        life: this.life,
      })
    },
    custom(
      summary: string | undefined,
      detail: string | undefined,
      life: number | undefined,
    ) {
      const toast = this.$toasts
      toast.add({
        severity: 'info',
        summary: summary,
        detail: detail,
        life: life,
      })
    },
  },
})
