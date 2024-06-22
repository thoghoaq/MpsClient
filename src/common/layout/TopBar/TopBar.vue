<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useSettingStore } from 'src/stores/setting'
  import { usePrimeVue } from 'primevue/config'
  import { Theme } from 'src/stores/setting/types'
  import { appConfig } from 'src/stores'
  import { useAuthStore } from 'src/stores/auth'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  const primeVue = usePrimeVue()
  const settingStore = useSettingStore()
  const authStore = useAuthStore()
  const router = useRouter()
  const { t } = useI18n()

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
      case 'products':
        return {
          label: t('Manage Products'),
          route: '/shop/products',
          class: 'm-0',
        }
      case 'shop':
        return {
          label: t('Manage Shop'),
          class: 'm-0',
        }
      case 'orders':
        return {
          label: t('Orders'),
          route: '/shop/orders',
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

  watch(scale, (value) => {
    settingStore.changeScale(value);
  })
</script>
<template>
  <div class="card w-full">
    <Menubar :model="items" class="border-0 border-noround md:h-6rem">
      <template #start>
        <div class="flex align-items-center gap-2">
          <Button
            icon="pi pi-bars"
            class="p-button-rounded p-button-text"
            @click="props.onToggleMenu"
          />
          <Breadcrumb :model="getBreadcrum(router.currentRoute.value.fullPath)">
            <template #item="{ item, props }">
              <router-link
                v-if="item.route"
                :to="item.route"
                v-slot="{ href, navigate }"
                custom
              >
                <a v-ripple v-bind="props.action" @click="navigate">
                  <span class="font-semibold">{{ item.label }}</span>
                </a>
              </router-link>
              <a v-else v-ripple :target="item.target" v-bind="props.action">
                <span class="font-semibold">{{ item.label }}</span>
              </a>
            </template>
            <template #separator>
              <span class="font-semibold">/</span>
            </template>
          </Breadcrumb>
        </div>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <Badge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <span
            v-if="item.shortcut"
            class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down',
              { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
            ]"
          ></i>
        </a>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2 mx-2">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search"> </InputIcon>
            <InputText :placeholder="$t('Search')" />
          </IconField>
          <Button
            icon="pi pi-cog"
            class="p-button-rounded p-button-text"
            @click="showSettings = true"
          />
          <Avatar
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
        </div>
      </template>
    </Menubar>
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
          <Button icon="pi pi-minus font-bold" link @click="() => {if (scale > 12) scale = scale - 1}"></Button>
          <Slider v-model="scale" :min="12" :max="16" :step="1" class="w-10rem" />
          <Button icon="pi pi-plus font-bold" link @click="() => {if (scale < 16) scale = scale + 1}"></Button>
          </div>
      </div>
      <div>
        <h3 class="mb-3">{{ $t('Language') }}</h3>
        <Dropdown
          :options="$i18n.availableLocales"
          v-model="$i18n.locale"
          :placeholder="$t('Select a language')"
          class="w-full"
          @change="settingStore.changeLanguage($i18n.locale)"
        ></Dropdown>
      </div>
    </Sidebar>
    <Sidebar v-model:visible="showProfile" header=" " position="right">
      <div>
        <div class="font-bold text-lg mb-2">{{ $t('Hello') }}</div>
        <div class="mb-4">{{ appConfig.loggedUser.data.displayName }}</div>
        <Button severity="danger" class="w-full" outlined @click="logout">
          <i class="pi pi-power-off px-2"></i>
          <div class="flex flex-column text-left m-3">
            <span>{{ $t('Sign Out') }}</span>
          </div>
        </Button>
      </div>
    </Sidebar>
  </div>
</template>
