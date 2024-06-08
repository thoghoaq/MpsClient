<script setup lang="ts">
  import { MenuItem } from 'primevue/menuitem';
  import { appConfig } from 'src/stores';
  import { ref } from 'vue'

  const props = defineProps({
    visible: Boolean,
    onVisibleChange: Function,
  })

  const items = ref<MenuItem[]>([
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
          label: 'Manage Customers',
          icon: 'pi pi-shopping-cart',
          route: '/admin/customers',
          visible: appConfig.loggedUser.isAdminGroup,
        },
      ],
    },
    {
      label: 'Shop',
      visible: appConfig.loggedUser.isShopOwner,
      items: [
        {
          label: 'Manage Products',
          icon: 'pi pi-table',
          visible: appConfig.loggedUser.isShopOwner,
        },
        {
          label: 'Information',
          icon: 'pi pi-user-edit',
          visible: appConfig.loggedUser.isShopOwner,
        },
        {
          label: 'Report',
          icon: 'pi pi-chart-bar',
          visible: appConfig.loggedUser.isShopOwner,
        },
      ],
    },
  ])
</script>
<template>
  <div v-if="props.visible" class="card flex justify-content-center h-screen">
    <Menu :model="items" class="w-full md:w-16rem border-0 border-noround">
      <template #start>
        <router-link to="/">
          <span class="inline-flex align-items-center gap-1 px-2 py-4">
            <span class="font-medium text-xl font-semibold"
              >SMPS<span class="text-primary">Admin</span></span
            >
          </span>
        </router-link>
      </template>
      <template #submenuheader="{ item }">
        <div class="text-primary font-bold pt-2 mx-1">{{ item.label ? $t(item.label?.toString()) : '' }}</div>
      </template>
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" class="pl-1" />
            <span class="ml-2">{{ item.label ? $t(item.label?.toString()) : '' }}</span>
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
        >
          <span :class="item.icon" class="pl-1" />
          <span class="ml-2">{{ item.label ? $t(item.label?.toString()) : '' }}</span>
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
