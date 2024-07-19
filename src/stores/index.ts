import { ref } from 'vue'
import { User } from './auth/types'
import { AppConfig } from './types'

const getAppPath = function () {
  return import.meta.env.VITE_API_ENDPOINT
}

const paypalUrl = import.meta.env.VITE_PAYPAL_API_ENDPOINT

const getUrl = function (url: string, params?: any): string {
  return getAppPath() + appendUrl(url, params)
}

const appendUrl = function (url: string, params?: any) {
  if (params) {
    var urlParams = new URLSearchParams()
    for (var key in params) {
      let value = params[key]
      if (value) urlParams.set(key, value)
    }
    var paramStr = urlParams.toString()
    if (paramStr) url += (url.indexOf('?') == -1 ? '?' : '&') + paramStr
  }
  return url
}

const getControllerUrl = function (action: string, controller: string) {
  return getUrl(controller + '/' + action)
}

const controllers = {
  account: '/account',
  image: '/image',
  datasource: '/datasource',
  seller: '/seller',
  shop: '/shop',
  ecommerce: '/ecommerce',
  payment: '/payment',
  setting: '/setting',
  staff: '/staff',
}

const getLoggedUser = function () {
  var auth = localStorage.getItem('auth')
  if (auth) {
    return JSON.parse(auth)['user']
  }
  return <User>{
    isManagerGroup: false,
    isAdminGroup: false,
    isShopOwner: false,
    isCustomer: false,
    isGuest: true,
  }
}

export const windowSize = ref(window.innerWidth)
export const isMobile = ref(window.innerWidth <= 768)

window.addEventListener('resize', () => {
  windowSize.value = window.innerWidth
  isMobile.value = window.innerWidth <= 768
})

export const appConfig: AppConfig = {
  apiEndpoint: getAppPath(),
  language: 'vi-VN',
  api: {
    account: {
      login: getControllerUrl('login', controllers.account),
      refresh: getControllerUrl('refresh', controllers.account),
      all: getControllerUrl('all', controllers.account),
      loggedUser: getControllerUrl('logged-user', controllers.account),
      register: getControllerUrl('register', controllers.account),
      details: getControllerUrl('details', controllers.account),
      update: getControllerUrl('update', controllers.account),
      status: getControllerUrl('status', controllers.account),
      sendPasswordResetEmail: getControllerUrl(
        'send-password-reset-email',
        controllers.account,
      ),
      staffs: {
        export: getControllerUrl('staffs/export', controllers.account),
        import: getControllerUrl('staffs/import', controllers.account),
      },
      devices: getControllerUrl('devices', controllers.account),
    },
    image: {
      upload: getControllerUrl('upload', controllers.image),
    },
    datasource: {
      categories: getControllerUrl('categories', controllers.datasource),
      category: getControllerUrl('category', controllers.datasource),
      brands: getControllerUrl('brands', controllers.datasource),
    },
    seller: {
      shops: getControllerUrl('shops', controllers.seller),
      shop: getControllerUrl('shop', controllers.seller),
      shopOverview: getControllerUrl('shop-overview', controllers.seller),
    },
    shop: {
      base: getUrl(controllers.shop),
      product: getControllerUrl('product', controllers.shop),
      products: getControllerUrl('products', controllers.shop),
      orders: getControllerUrl('orders', controllers.shop),
      order: {
        status: getControllerUrl('order/status', controllers.shop),
      },
      request: getControllerUrl('request', controllers.shop),
      acceptRequest: getControllerUrl('accept-request', controllers.shop),
      ordersInPayoutDate: getControllerUrl(
        'orders-in-payout-date',
        controllers.shop,
      ),
      productStatus: getControllerUrl('product/status', controllers.shop),
    },
    ecommerce: {
      products: getControllerUrl('products', controllers.ecommerce),
      checkout: getControllerUrl('checkout', controllers.ecommerce),
      orders: getControllerUrl('orders', controllers.ecommerce),
      trackingProduct: getControllerUrl(
        'tracking-product',
        controllers.ecommerce,
      ),
      feedback: getControllerUrl('feedback', controllers.ecommerce),
      feedbacks: getControllerUrl('feedbacks', controllers.ecommerce),
      similar: getControllerUrl('similar', controllers.ecommerce),
    },
    payment: {
      details: getControllerUrl('details', controllers.payment),
      requestMonthlyPayout: getControllerUrl(
        'request-monthly-payout',
        controllers.payment,
      ),
      acceptPayout: getControllerUrl('accept-payout', controllers.payment),
      customRequestPayout: getControllerUrl(
        'custom-request-payout',
        controllers.payment,
      ),
    },
    external: {
      payPal: {
        auth: `${paypalUrl}/oauth2/token`,
        customerInfo: `${paypalUrl}/identity/oauth2/userinfo`,
      },
    },
    setting: {
      base: getUrl(controllers.setting),
      shop: getControllerUrl('shop', controllers.setting),
      shopRefresh: getControllerUrl('shop/refresh', controllers.setting)
    },
    staff: {
      shop: {
        accept: getControllerUrl('shop/accept', controllers.staff),
      },
      shops: getControllerUrl('shops', controllers.staff)
    }
  },
  loggedUser: getLoggedUser(),
  appendUrl: appendUrl,
}