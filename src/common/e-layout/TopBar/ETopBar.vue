<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { Theme } from 'src/stores/setting/types'
  import { appConfig } from 'src/stores'
  import { useAuthStore } from 'src/stores/auth'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useCartStore } from 'src/stores/cart'
  import { useEProductStore } from 'src/stores/ecommerce/product'
  import LanguageHelper from 'src/helpers/language-helper'
  import axios from 'axios'
  import { getLocale } from 'src/locales/prime'
  import { getMessage } from 'src/locales'
  const i18n = useI18n()
  const t = i18n.t
  const eProductStore = useEProductStore()
  const cartStore = useCartStore()
  const primeVue = usePrimeVue()
  const settingStore = useSettingStore()
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const props = defineProps({
    onToggleMenu: Function,
  })
  const items = ref([])

  const showSettings = ref(false)
  const showProfile = ref(false)

  const changeTheme = function (nextTheme: string, scheme?: string) {
    primeVue.changeTheme(
      settingStore.currentTheme,
      nextTheme,
      'theme-link',
      () => {},
    )
    settingStore.changeTheme(nextTheme, scheme)
  }

  const changeScheme = function (scheme: string) {
    if (settingStore.currentScheme === scheme) return
    const isDark = scheme === 'Dark'
    const nextTheme = settingStore.collection.find(
      (theme: Theme) =>
        theme.light === settingStore.currentTheme ||
        theme.dark === settingStore.currentTheme,
    )
    if (nextTheme)
      isDark
        ? changeTheme(nextTheme.dark, scheme)
        : changeTheme(nextTheme.light, scheme)
  }

  const logout = function () {
    authStore.logout()
    router.push({
      name: 'signIn',
    })
  }

  const home = ref<any>({
    icon: 'pi pi-home',
  })

  const getBreadcrum = function (path: string): any[] {
    const items = path.split('/').filter((item) => item !== '')
    return items.map((item) => {
      return getMenuItem(item)
    })
  }

  const getMenuItem = function (item: string): any {
    switch (item) {
      case 'admin':
        return {
          label: t('Administrator'),
          class: 'm-0',
        }
      case 'staffs':
        return {
          label: t('Manage Staffs'),
          route: '/admin/staffs',
          class: 'm-0',
        }
      case 'customers':
        return {
          label: t('Manage Customers'),
          route: '/admin/customers',
          class: 'm-0',
        }
      case 'shop-owners':
        return {
          label: t('Manage Shop Owners'),
          route: '/admin/shop-owners',
          class: 'm-0',
        }
      case 'create':
        return {
          label: t('Create'),
          class: 'm-0',
        }
      case 'seller':
        return {
          label: t('Seller Channel'),
          class: 'm-0',
        }
      case 'shops':
        return {
          label: t('Manage Shops'),
          route: '/seller/shops',
          class: 'm-0',
        }
      case 'product-categories':
        return {
          label: t('Manage Product Categories'),
          route: '/admin/product-categories',
          class: 'm-0',
        }
      default:
        return {
          label: item,
          class: 'm-0',
        }
    }
  }

  const scale = ref(settingStore.scale)
  const query = ref()

  watch(scale, (value) => {
    settingStore.changeScale(value)
  })

  onMounted(() => {
    query.value = eProductStore.filter.query
  })

  const changeLanguage = (language: string) => {
    var accept =
      LanguageHelper.getAcceptLanguage(language)?.toString() ?? 'vi-VN'
    localStorage.setItem('language', language)
    axios.defaults.headers.common['Accept-Language'] = accept
    appConfig.language = accept
    primeVue.config.locale = getLocale(language)
    i18n.locale.value = language
    i18n.setLocaleMessage(language, getMessage(language))
  }
</script>
<template>
  <div class="card w-full bg-primary-reverse">
    <div
      class="grid align-items-center justify-content-between mx-3 p-3 py-5 gap-3"
    >
      <router-link to="/" style="text-decoration: none">
        <div class="flex align-items-center gap-3">
          <Button link label="MPC" class="text-lg">
            <div class="text-5xl font-bold">MPC</div>
          </Button>
        </div>
      </router-link>
      <div class="col">
        <IconField iconPosition="right">
          <InputIcon class="pi pi-search"> </InputIcon>
          <InputText
            :placeholder="$t('Search Product')"
            class="w-full"
            v-model="query"
            @change="
              () => {
                eProductStore.filter.query = query
                eProductStore.filterProducts()
                if (route.name != 'eProducts') {
                  router.push({ name: 'eProducts' })
                }
              }
            "
          />
        </IconField>
      </div>
      <div class="flex align-items-center gap-3">
        <Button
          icon="pi pi-shopping-cart"
          class="p-button-rounded p-button-text"
          @click="$router.push({ name: 'cart' })"
          :badge="
            cartStore.items.length > 0 ? `${cartStore.items.length}` : undefined
          "
          badge-class="p-badge-danger p-badge-rounded p-badge-no-gutter"
        />
        <Button
          icon="pi pi-cog"
          class="p-button-rounded p-button-text"
          @click="showSettings = true"
        />
        <Avatar
          v-if="!appConfig.loggedUser.isGuest"
          :image="appConfig.loggedUser.data.photoUrl"
          :label="
            appConfig.loggedUser.data.photoUrl
              ? undefined
              : appConfig.loggedUser.data.displayName[0]
          "
          class="cursor-pointer bg-primary-200 font-bold"
          shape="circle"
          @click="showProfile = true"
        />
        <Button
          v-else
          icon="pi pi-user"
          class="p-button-rounded p-button-text w-10rem"
          :label="$t('Log in')"
          @click="router.push({ name: 'signIn' })"
        />
      </div>
    </div>
    <Sidebar
      v-model:visible="showSettings"
      :header="$t('Settings')"
      position="right"
    >
      <div class="mb-5">
        <h3 class="mb-3">{{ $t('Themes') }}</h3>
        <Button
          v-for="theme in settingStore.collection"
          :class="`p-button-rounded m-1 ${theme.color} ${settingStore.currentTheme == theme.light || settingStore.currentTheme == theme.dark ? 'border-3' : 'border-0'}`"
          @click="
            changeTheme(
              settingStore.currentScheme === 'Light' ? theme.light : theme.dark,
            )
          "
        ></Button>
      </div>
      <div class="mb-5">
        <h3 class="mb-3">{{ $t('Color Scheme') }}</h3>
        <div
          v-for="scheme in settingStore.colorSchemes"
          :key="settingStore.colorSchemes.indexOf(scheme)"
          class="flex align-items-center mb-2"
        >
          <RadioButton
            v-model="settingStore.currentScheme"
            :inputId="scheme"
            name="dynamic"
            :value="scheme"
            @click="changeScheme(scheme)"
          />
          <label :for="scheme" class="ml-2">{{ $t(scheme) }}</label>
        </div>
      </div>
      <div class="mb-5">
        <h3 class="mb-3">{{ $t('Scale') }}</h3>
        <div class="flex align-items-center justify-content-between">
          <Button
            icon="pi pi-minus font-bold"
            link
            @click="
              () => {
                if (scale > 12) scale = scale - 1
              }
            "
          ></Button>
          <Slider
            v-model="scale"
            :min="12"
            :max="16"
            :step="1"
            class="w-10rem"
          />
          <Button
            icon="pi pi-plus font-bold"
            link
            @click="
              () => {
                if (scale < 16) scale = scale + 1
              }
            "
          ></Button>
        </div>
      </div>
      <div>
        <h3 class="mb-3">{{ $t('Language') }}</h3>
        <Dropdown
          :options="$i18n.availableLocales"
          v-model="$i18n.locale"
          :placeholder="$t('Select a language')"
          class="w-full"
          @change="changeLanguage($i18n.locale)"
        ></Dropdown>
      </div>
    </Sidebar>
    <Sidebar v-model:visible="showProfile" header=" " position="right">
      <div>
        <div class="font-bold text-lg mb-2">{{ $t('Hello') }}</div>
        <div class="mb-4">{{ appConfig.loggedUser.data.displayName }}</div>
        <div class="flex flex-column gap-3">
          <router-link to="/orders">
            <Button severity="primary" class="w-full" outlined>
              <i class="pi pi-shopping-bag px-2"></i>
              <div class="flex flex-column text-left m-3">
                <span>{{ $t('Your Orders') }}</span>
              </div>
            </Button>
          </router-link>
          <Button severity="danger" class="w-full" outlined @click="logout">
            <i class="pi pi-power-off px-2"></i>
            <div class="flex flex-column text-left m-3">
              <span>{{ $t('Sign Out') }}</span>
            </div>
          </Button>
        </div>
      </div>
    </Sidebar>
  </div>
</template>
src/stores/cart
