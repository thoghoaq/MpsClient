<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useOrderStore } from 'src/stores/seller/order'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useI18n } from 'vue-i18n'
  import { useToastStore } from 'src/stores/toast'
  const toast = useToastStore()
  const { t } = useI18n()
  const orderStore = useOrderStore()
  onMounted(() => {
    orderStore.fetchOrders()
  })

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  const items = ref([
    {
      label: t('All'),
      command: () => {
        orderStore.fetchOrders()
      },
    },
    {
      label: t('Pending'),
      command: () => {
        orderStore.filterOrders(1)
      },
    },
    {
      label: t('Processing'),
      command: () => {
        orderStore.filterOrders(2)
      },
    },
    {
      label: t('Delivered'),
      command: () => {
        orderStore.filterOrders(3)
      },
    },
    {
      label: t('Cancelled'),
      command: () => {
        orderStore.filterOrders(4)
      },
    },
    {
      label: t('Returned'),
      command: () => {
        orderStore.filterOrders(5)
      },
    },
    {
      label: t('Refunded'),
      command: () => {
        orderStore.filterOrders(6)
      },
    },
    {
      label: t('Completed'),
      command: () => {
        orderStore.filterOrders(7)
      },
    },
  ])

  const onUpdateStatus = (status: number) => {
    const orderId = parseInt(menuId.value)
    orderStore.updateOrderStatus(orderId, status).then((res) => {
      if (res.success) {
        toast.success(res.content['message'])
      } else {
        toast.error(res.content)
      }
    })
  }

  const actionItems = ref([
    {
      label: t('Pending'),
      command: () => onUpdateStatus(1),
    },
    {
      label: t('Processing'),
      command: () => onUpdateStatus(2),
    },
    {
      label: t('Delivered'),
      command: () => onUpdateStatus(3),
    },
    {
      label: t('Cancelled'),
      command: () => onUpdateStatus(4),
    },
    {
      label: t('Returned'),
      command: () => onUpdateStatus(5),
    },
    {
      label: t('Refunded'),
      command: () => onUpdateStatus(6),
    },
    {
      label: t('Completed'),
      command: () => onUpdateStatus(7),
    },
  ])

  const getStatusDisplay = (status: any) => {
    switch (status.id) {
      case 1:
        return {
          severity: 'warning',
          label: status.name,
        }
      case 2:
        return {
          severity: 'info',
          label: status.name,
        }
      case 4:
        return {
          severity: 'danger',
          label: status.name,
        }
      default:
        return {
          severity: 'secondary',
          label: status.name,
        }
    }
  }

  const menu = ref()
  const menuId = ref()
  const toggle = (event: any) => {
    menuId.value = event.currentTarget.id.replace('menu_', '')
    menu.value.toggle(event)
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <Menubar class="border-0 m-2 px-3">
        <template #start>
          <h3>{{ $t('Your Orders') }}</h3>
        </template>
      </Menubar>
      <TabMenu :model="items" />
      <div class="card m-3">
        <DataTable
          :value="orderStore.orders"
          stripedRows
          showGridlines
          tableStyle="min-width: 50rem"
          removable-sort
          paginator
          :rows="20"
          :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column
            field="id"
            :header="$t('Number')"
            sortable
            class="w-5rem"
          ></Column>
          <Column
            field="customerName"
            :header="$t('Customer')"
            sortable
          ></Column>
          <Column
            field="phoneNumber"
            :header="$t('Phone Number')"
            sortable
          ></Column>
          <Column field="email" :header="$t('Email')" sortable></Column>
          <Column field="address" :header="$t('Address')" sortable></Column>
          <Column field="totalAmount" :header="$t('Total')" sortable>
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.totalAmount) }}
            </template>
          </Column>
          <Column field="orderDate" :header="$t('Order Date')" sortable>
            <template #body="slotProps">
              {{ DateTimeHelper.format(slotProps.data.orderDate) }}
            </template>
          </Column>
          <Column
            field="paymentMethod.name"
            :header="$t('Payment Method')"
            sortable
          ></Column>
          <Column field="note" :header="$t('Note')" sortable></Column>
          <Column field="id" :header="$t('Status')">
            <template #body="{ data }">
              <Button :id="`menu_${data.id}`" text class="p-0" @click="toggle">
                <Tag
                  :severity="getStatusDisplay(data.orderStatus).severity"
                  :value="$t(getStatusDisplay(data.orderStatus).label)"
                ></Tag>
              </Button>
              <Menu
                ref="menu"
                id="overlay_menu"
                :model="actionItems"
                :popup="true"
              >
                <template #item="{ item, props }">
                  <router-link
                    v-if="item.route"
                    v-slot="{ href, navigate }"
                    :to="`${item.route}/${menuId}`"
                    custom
                  >
                    <a
                      v-ripple
                      :href="href"
                      v-bind="props.action"
                      @click="navigate"
                    >
                      <span :class="`${item.icon} ${item.class}`" />
                      <span :class="`ml-2 ${item.class}`">{{
                        item.label ? $t(item.label?.toString()) : ''
                      }}</span>
                      <Badge
                        v-if="item.badge"
                        class="ml-auto"
                        :value="item.badge"
                      />
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
                    <span :class="`${item.icon} ${item.class}`" />
                    <span :class="`ml-2 ${item.class}`">{{
                      item.label ? $t(item.label?.toString()) : ''
                    }}</span>
                    <Badge
                      v-if="item.badge"
                      class="ml-auto"
                      :value="item.badge"
                    />
                    <span
                      v-if="item.shortcut"
                      class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
                      >{{ item.shortcut }}
                    </span>
                  </a>
                </template>
              </Menu>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Layout>
</template>
