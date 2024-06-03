import { useToast } from 'primevue/usetoast';
const life = 2000;

export const toast = {
  success: (message: string) => {
    const toast = useToast();
    toast.add({ severity: 'success', summary: 'Success', detail: message, life: life });
  },
  error: (message: string) => {
    const toast = useToast();
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: life });
  },
  info: (message: string) => {
    const toast = useToast();
    toast.add({ severity: 'info', summary: 'Info', detail: message, life: life });
  },
  warning: (message: string) => {
    const toast = useToast();
    toast.add({ severity: 'warn', summary: 'Warning', detail: message, life: life });
  },
};
