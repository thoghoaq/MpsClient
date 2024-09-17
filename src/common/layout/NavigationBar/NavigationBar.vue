<script setup lang="ts">
  import { appConfig } from 'src/stores'
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useShopRequestStore } from 'src/stores/admin/shop-request'
  const shopRequestStore = useShopRequestStore()
  const router = useRouter()
  const props = defineProps({
    visible: Boolean,
    onVisibleChange: Function,
    fetchShopsRequest: Boolean,
  })

  const items = ref<any[]>([
    {
      label: 'Administrator',
      visible: appConfig.loggedUser.isManagerGroup,
      items: [
        {
          label: 'Manage Staffs',
          icon: 'pi pi-users',
          route: '/admin/staffs',
          visible: appConfig.loggedUser.isAdminGroup,
        },
        {
          label: 'Manage Shop Owners',
          icon: 'pi pi-shopping-bag',
          route: '/admin/shop-owners',
          visible: appConfig.loggedUser.isManagerGroup,
        },
        {
          label: 'New Shop Request',
          icon: 'pi pi-envelope',
          route: '/admin/shop-request',
          visible: appConfig.loggedUser.isManagerGroup,
          badge: shopRequestStore.shops.filter(x => x.isAccepted).length,
        },
        {
          label: 'Manage Shops',
          icon: 'pi pi-shop',
          route: '/admin/shops',
          visible: appConfig.loggedUser.isManagerGroup,
        },
        {
          label: 'Manage Customers',
          icon: 'pi pi-shopping-cart',
          route: '/admin/customers',
          visible: appConfig.loggedUser.isAdminGroup,
        },
        {
          label: 'Manage Product Categories',
          icon: 'pi pi-folder',
          route: '/admin/product-categories',
          visible: appConfig.loggedUser.isManagerGroup,
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          route: '/admin/settings',
          visible: appConfig.loggedUser.isAdminGroup,
        },
      ],
    },
    {
      label: 'Business',
      visible: appConfig.loggedUser.isManagerGroup,
      items: [
        {
          label: 'Payout Revenue',
          icon: 'pi pi-paypal',
          route: '/business/refund',
          visible: appConfig.loggedUser.isManagerGroup,
        },
      ],
    },
    {
      label: 'Seller Channel',
      visible: appConfig.loggedUser.isShopOwner,
      items: [
        {
          label: 'Manage Shops',
          icon: 'pi pi-shop',
          route: '/seller/shops',
          visible: appConfig.loggedUser.isShopOwner,
        },
      ],
    },
  ])

  const sellerItems = ref<any[]>([
    {
      label: 'Manage Shop',
      visible: appConfig.loggedUser.isShopOwner,
      items: [
        {
          label: 'Overview',
          icon: 'pi pi-chart-bar',
          route: `/seller/shop-overview/${appConfig.loggedUser.shopManaging?.id}`,
          visible: appConfig.loggedUser.isShopOwner,
        },
        {
          label: 'Orders',
          icon: 'pi pi-shopping-bag',
          route: '/shop/orders',
          visible: appConfig.loggedUser.isShopOwner,
        },
        {
          label: 'Manage Products',
          icon: 'pi pi-table',
          route: '/shop/products',
          visible: appConfig.loggedUser.isShopOwner,
        },
      ],
    },
  ])

  const backToHome = function () {
    appConfig.loggedUser.shopManaging = undefined
    router.push('/')
  }

  onMounted(() => {
    if (appConfig.loggedUser.isManagerGroup && props.fetchShopsRequest) {
      var parent = items.value.find(
        (item) => item.label === 'Administrator',
      ).items
      var item = parent.find((i: any) => i.label === 'New Shop Request')
      if (item) {
        shopRequestStore.fetchShops().then(() => {
          item.badge = shopRequestStore.shops.filter(x => x.isAccepted).length
        })
      }
    }
  })

  const getLogoDisplay = () => {
    if (appConfig.loggedUser.isAdminGroup) {
      return 'Admin'
    }
    if (appConfig.loggedUser.isManagerGroup) {
      return 'Staff'
    }
    if (appConfig.loggedUser.isShopOwner) {
      return 'ShopOwner'
    }
  }
</script>
<template>
  <div v-if="props.visible" class="card flex justify-content-center h-screen">
    <Menu
      :model="appConfig.loggedUser.shopManaging ? sellerItems : items"
      class="w-full md:w-16rem border-0 border-noround"
    >
      <template #start>
        <span class="flex align-items-center">
          <Button
            v-if="appConfig.loggedUser.shopManaging"
            class="h-2rem mx-2"
            outlined
            @click="backToHome"
          >
            <i class="pi pi-home"></i>
          </Button>
          <span
            class="inline-flex align-items-center gap-1 px-2 py-4"
            v-if="appConfig.loggedUser.shopManaging"
          >
            <span class="font-medium text-xl font-semibold">{{
              appConfig.loggedUser.shopManaging.shopName
            }}</span>
          </span>
          <router-link v-else to="/">
            <span class="inline-flex align-items-center gap-1 px-2 py-4">
              <span class="font-medium text-xl font-semibold"
                >MPC<span class="text-primary">{{ getLogoDisplay() }}</span></span
              >
            </span>
          </router-link>
        </span>
      </template>
      <template #submenuheader="{ item }">
        <div class="text-primary font-bold pt-2 mx-1">
          {{ item.label ? $t(item.label?.toString()) : '' }}
        </div>
      </template>
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a
            v-ripple
            :href="href"
            v-bind="props.action"
            @click="navigate"
            :class="
              router.currentRoute.value.path.match(item.route)
                ? 'bg-primary text-0'
                : ''
            "
          >
            <span :class="item.icon" class="pl-1" />
            <span class="ml-2">{{
              item.label ? $t(item.label?.toString()) : ''
            }}</span>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            <span
              v-if="item.shortcut"
              class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
              >{{ item.shortcut }}
            </span>
          </a>
        </router-link>
        <a
          v-else
          v-ripple
          class="flex align-items-center"
          :target="item.target"
          v-bind="props.action"
          :class="item.class"
        >
          <span :class="item.icon" class="pl-1" />
          <span class="ml-2">{{
            item.label ? $t(item.label?.toString()) : ''
          }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          <span
            v-if="item.shortcut"
            class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
            >{{ item.shortcut }}
          </span>
        </a>
      </template>
      <template #end> </template>
    </Menu>
  </div>
</template>
