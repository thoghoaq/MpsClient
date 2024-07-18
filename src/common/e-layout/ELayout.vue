<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import ETopBar from './TopBar/ETopBar.vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useEProductStore } from 'src/stores/ecommerce/product'
  import { isMobile } from 'src/stores'
  const eProductStore = useEProductStore()
  const router = useRouter()
  const { t } = useI18n()
  const props = defineProps({
    hideCategory: Boolean,
    viewProducts: Boolean,
    hideNavigation: Boolean,
    hideScrollTop: Boolean,
    hideTopBar: Boolean,
  })

  const visible = ref(true)
  const toggleMenu = () => {
    visible.value = !visible.value
  }

  const getBreadcrum = function (path: string): any[] {
    const items = path.split('/').filter((item) => item !== '')
    return items.map((item) => {
      if (item.startsWith('vnpay-return')) {
        return {
          label: t('PAYMENT RESULT'),
          class: 'm-0',
        }
      }
      return getMenuItem(item)
    })
  }

  const getMenuItem = function (item: string): any {
    switch (item) {
      case 'ecommerce':
        return {
          label: t('HOME'),
          class: 'm-0',
        }
      case 'products':
        return {
          label: t('PARTS & ACCESSORIES'),
          route: '/ecommerce/products',
          class: 'm-0',
        }
      case 'cart':
        return {
          label: t('CART'),
          route: '/cart',
          class: 'm-0',
        }
      case 'checkout': {
        return {
          label: t('CHECKOUT'),
          class: 'm-0',
          route: '/cart/checkout',
        }
      }
      case 'orders': {
        return {
          label: t('ORDERS'),
          class: 'm-0',
        }
      }
      case 'profile': {
        return {
          label: t('Profile'),
          class: 'm-0',
        }
      }
      default:
        return {
          label: item,
          class: 'm-0',
        }
    }
  }

  const selectedFilter = ref({ name: t('New'), id: 1 })
  const filters = ref([
    { name: t('New'), id: 1 },
    { name: t('Popular'), id: 2 },
    { name: t('Best Seller'), id: 3 },
    { name: t('Low Price'), id: 4 },
    { name: t('High Price'), id: 5 },
  ])

  const onSelectFilter = (value: any) => {
    eProductStore.filter.filterBy = value.id
    eProductStore.filterProducts()
  }
  const location = ref<{ latitude: number; longitude: number } | null>(null)
  const error = ref<string | null>(null)
  const loadingFilterByNearest = ref(false)
  const isFilterByNearest = ref(false)
  const getCurrentLocation = () => {
    loadingFilterByNearest.value = true
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          eProductStore.filter.latitude = location.value?.latitude as number
          eProductStore.filter.longitude = location.value?.longitude as number
          eProductStore.filterProducts().then(() => {
            loadingFilterByNearest.value = false
            isFilterByNearest.value = !isFilterByNearest.value
          })
          error.value = null
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              error.value = 'User denied the request for Geolocation.'
              break
            case err.POSITION_UNAVAILABLE:
              error.value = 'Location information is unavailable.'
              break
            case err.TIMEOUT:
              error.value = 'The request to get user location timed out.'
              break
            default:
              error.value = 'An unknown error occurred.'
              break
          }
        },
      )
    } else {
      error.value = 'Geolocation is not supported by this browser.'
    }
  }

  const onSearchNearest = () => {
    if (!isFilterByNearest.value) {
      getCurrentLocation()
    } else {
      eProductStore.filter.latitude = null
      eProductStore.filter.longitude = null
      eProductStore.filterProducts().then(() => {
        isFilterByNearest.value = !isFilterByNearest.value
      })
    }
  }

  onMounted(() => {
    isFilterByNearest.value = !(
      !eProductStore.filter.latitude || !eProductStore.filter.longitude
    )
    selectedFilter.value =
      filters.value.find((f) => eProductStore.filter.filterBy === f.id) ||
      filters.value[0]
    eProductStore.filter.categoriesId = null
  })

  const cateVisible = ref(false)
</script>
<template>
  <header></header>
  <main>
    <div>
      <ETopBar :on-toggle-menu="toggleMenu" v-if="!$props.hideTopBar"/>
      <div v-else class="h-4rem"></div>
      <div class="grid grid-nogutter justify-content-center gap-3 p-3">
        <Sidebar v-if="isMobile" v-model:visible="cateVisible" class="w-25rem">
          <Category
            class="col-12 md:col-3 xl:col-2"
            v-if="!props.hideCategory"
          ></Category>
        </Sidebar>
        <Category
          class="col-12 md:col-3 xl:col-2"
          v-else
          v-if="!props.hideCategory"
        ></Category>
        <div class="flex flex-column w-full col-12 md:col xl:col">
          <div class="bg-primary-reverse border-round mb-3">
            <div class="flex align-items-center">
              <Button icon="pi pi-angle-left" class="w-3rem h-3rem" text @click="() => $router.back()"></Button>
              <Breadcrumb :model="getBreadcrum(router.currentRoute.value.path)">
                <template #item="{ item, props }">
                  <router-link
                    v-if="item.route"
                    :to="item.route"
                    v-slot="{ href, navigate }"
                    custom
                  >
                    <a v-ripple v-bind="props.action" @click="navigate">
                      <span class="font-semibold cursor-pointer">{{
                        item.label
                      }}</span>
                    </a>
                  </router-link>
                  <a v-else v-ripple :target="item.target" v-bind="props.action">
                    <span class="font-semibold cursor-pointer">{{
                      item.label
                    }}</span>
                  </a>
                </template>
                <template #separator>
                  <span class="font-semibold">/</span>
                </template>
              </Breadcrumb>
            </div>
            <div v-if="props.viewProducts">
              <Divider class="m-0"></Divider>
              <div
                class="grid grid-nogutter justify-content-between align-items-center m-3 gap-3"
              >
                <div class="flex align-items-center gap-3">
                  <Button
                    v-if="isMobile"
                    icon="pi pi-bars"
                    @click="cateVisible = true"
                  />
                  <div class="font-bold text-lg">{{ $t('All products') }}</div>
                </div>
                <div class="grid grid-nogutter gap-3">
                  <div
                    class="flex gap-2 sm:justify-content-between align-items-center"
                  >
                    <span>{{ $t('Search by') }}</span>
                    <Button
                      :label="$t('Nearest Shop')"
                      :outlined="!isFilterByNearest"
                      :loading="loadingFilterByNearest"
                      :icon="isFilterByNearest ? 'pi pi-check' : ''"
                      @click="onSearchNearest"
                    />
                  </div>
                  <div
                    class="flex gap-2 sm:justify-content-between align-items-center"
                  >
                    <span>{{ $t('Accordion') }}</span>
                    <Dropdown
                      v-model="selectedFilter"
                      :options="filters"
                      optionLabel="name"
                      :placeholder="$t('Select a Filter')"
                      checkmark
                      class="w-auto"
                      @update:model-value="onSelectFilter"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <slot name="page-content"></slot>
        </div>
      </div>
      <ScrollTop v-if="!$props.hideScrollTop"
        :pt="{
          root: isMobile ? 'mb-8' : '',
        }"
      />
    </div>
    <div v-if="isMobile" class="h-5rem"></div>
  </main>
  <footer v-if="isMobile && !$props.hideNavigation" class="fixed bottom-0 w-full h-5rem" style="z-index: 9999;">
    <div class="bg-primary-reverse p-1 h-full shadow-4">
      <div class="flex gap-3 justify-content-evenly align-items-center">
        <router-link to="/" style="text-decoration: none"
          ><div class="flex flex-column align-items-center">
            <Button icon="pi pi-home" class="p-button-rounded p-button-text" />
            <div class="text-primary">{{ $t('Home') }}</div>
          </div></router-link
        >
        <router-link to="/cart" style="text-decoration: none">
          <div class="flex flex-column align-items-center">
            <Button
              icon="pi pi-shopping-cart"
              class="p-button-rounded p-button-text"
            />
            <div class="text-primary">{{ $t('Cart') }}</div>
          </div>
        </router-link>
        <router-link to="/profile" style="text-decoration: none">
          <div class="flex flex-column align-items-center">
            <Button icon="pi pi-user" class="p-button-rounded p-button-text" />
            <div class="text-primary">{{ $t('Profile') }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </footer>
</template>
<style src="./ELayout.css" lang="css" scoped></style>
