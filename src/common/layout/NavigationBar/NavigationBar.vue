<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    visible: Boolean,
    onVisibleChange: Function,
  })

  const { t } = useI18n()

  const items = ref([
    {
      separator: false,
    },
    {
      label: t('Administrator'),
      items: [
        {
          label: t('Manage Staffs'),
          icon: 'pi pi-users',
          route: '/admin/staffs',
        },
        {
          label: t('Manage Shop Owners'),
          icon: 'pi pi-shopping-bag',
          route: '/admin/shop-owners',
        },
        {
          label: t('Manage Customers'),
          icon: 'pi pi-shopping-cart',
          route: '/admin/customers',
        },
      ],
    },
    {
      label: t('Shop'),
      items: [
        {
          label: t('Manage Products'),
          icon: 'pi pi-table',
        },
        {
          label: t('Information'),
          icon: 'pi pi-user-edit',
        },
        {
          label: t('Report'),
          icon: 'pi pi-chart-bar',
        },
      ],
    },
    {
      separator: false,
    },
  ])
</script>
<template>
  <div v-if="props.visible" class="card flex justify-content-center h-screen">
    <Menu :model="items" class="w-full md:w-15rem border-0 border-noround">
      <template #start>
        <span class="inline-flex align-items-center gap-1 px-2 py-4">
          <span class="font-medium text-xl font-semibold"
            >SMPS<span class="text-primary">Admin</span></span
          >
        </span>
      </template>
      <template #submenuheader="{ item }">
        <span class="text-primary font-bold">{{ item.label }}</span>
      </template>
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
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
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
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
