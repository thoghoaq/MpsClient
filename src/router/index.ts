import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from 'src/stores/auth';

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach(async (to) => {
    const publicPages = ['/sign-in', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();

    if (authRequired && !authStore.auth.user) {
        return '/sign-in';
    }
});
