import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from 'src/stores/auth'
import TokenHelper from 'src/helpers/token-helper'

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const publicPages = [
    '/sign-in',
    '/sign-up',
    '/password-reset',
    '/',
    '/ecommerce/products',
    '/cart'
  ]

  const isPublicPage = (path: any) => {
    if (publicPages.includes(path)) {
      return true;
    }
    const dynamicRoutes = [
      /^\/ecommerce\/products\/\d+$/,
    ];
    return dynamicRoutes.some((regex) => regex.test(path));
  };

  const authRequired = !isPublicPage(to.path)
  const authStore = useAuthStore()
  const isTokenExpiredOrInvalid = TokenHelper.isTokenExpiredOrInvalid(
    authStore.auth?.accessToken,
  )
  if ((authRequired && !authStore.auth?.user) || isTokenExpiredOrInvalid) {
    if (isTokenExpiredOrInvalid && authStore.auth) {
      const result = await authStore.refresh()
      if (!result?.success) {
        authStore.logout()
        return '/sign-in'
      }
    } else {
      return '/sign-in'
    }
  }
})
