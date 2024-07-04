<script setup lang="ts">
  import { ref } from 'vue'
  import ETopBar from './TopBar/ETopBar.vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useEProductStore } from 'src/stores/ecommerce/product'
  const eProductStore = useEProductStore()
  const router = useRouter()
  const { t } = useI18n()
  const props = defineProps({
    hideCategory: Boolean,
    viewProducts: Boolean,
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
</script>
<template>
  <header></header>
  <main>
    <div>
      <ETopBar :on-toggle-menu="toggleMenu" />
      <div class="flex justify-content-center">
        <Category v-if="!props.hideCategory"></Category>
        <div
          class="flex flex-column m-3 w-full"
          :class="props.viewProducts ? 'max-width-min-content' : ''"
        >
          <div class="bg-primary-reverse border-round mb-3">
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
            <div v-if="props.viewProducts">
              <Divider class="m-0"></Divider>
              <div class="flex justify-content-between align-items-center m-3">
                <div class="font-bold text-lg">{{ $t('All products') }}</div>
                <div class="flex gap-5">
                  <div class="flex gap-2 align-items-center">
                    <span>{{ $t('Search by') }}</span>
                    <Button :label="$t('Nearest Shop')" :outlined="true" />
                  </div>
                  <div class="flex gap-2 align-items-center">
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
    </div>
  </main>
</template>
<style src="./ELayout.css" lang="css" scoped></style>
