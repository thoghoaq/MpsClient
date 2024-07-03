<script setup lang="ts">
  import { ref } from 'vue'
  import ETopBar from './TopBar/ETopBar.vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const { t } = useI18n()
  const props = defineProps({
    hideCategory: Boolean,
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
</script>
<template>
  <header></header>
  <main>
    <div>
      <ETopBar :on-toggle-menu="toggleMenu" />
      <div class="flex">
        <Category v-if="!props.hideCategory"></Category>
        <div class="flex flex-column m-3 w-full">
          <div class="bg-primary-reverse border-round mb-3">
            <Breadcrumb
              :model="getBreadcrum(router.currentRoute.value.path)"
            >
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
          <slot name="page-content"></slot>
        </div>
      </div>
    </div>
  </main>
</template>
