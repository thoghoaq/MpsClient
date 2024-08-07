<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useOrderStore } from 'src/stores/seller/order'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useI18n } from 'vue-i18n'
  import { useToastStore } from 'src/stores/toast'
  import { Order } from 'src/stores/seller/order/types'
  import NumberHelper from 'src/helpers/number-helper'
  import { OrderStatus } from 'src/stores/types'
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
    // {
    //   label: t('Pending'),
    //   command: () => {
    //     orderStore.filterOrders(1)
    //   },
    // },
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
      label: t('Received'),
      command: () => {
        orderStore.filterOrders(8)
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

  const onUpdateStatus = (orderId: number ,status: number) => {
    orderStore.updateOrderStatus(orderId, status).then((res) => {
      if (res.success) {
        toast.success(res.content['message'])
      } else {
        toast.error(res.content)
      }
    })
  }

  const getStatusDisplay = (status: any) => {
    switch (status.id) {
      case 1:
        return {
          label: 'Pending',
          severity: 'warn',
        }
      case 2:
        return {
          label: 'Processing',
          severity: 'warn',
        }
      case 3:
        return {
          label: 'Delivered',
          severity: 'info',
        }
      case 4:
        return {
          label: 'Cancelled',
          severity: 'danger',
        }
      case 5:
        return {
          label: 'Returned',
          severity: 'warn',
        }
      case 6:
        return {
          label: 'Refunded',
          severity: 'success',
        }
      case 7:
        return {
          label: 'Completed',
          severity: 'success',
        }
      case 8:
        return {
          label: 'Received',
          severity: 'success',
        }
      default:
        return {
          label: 'Unknown',
          severity: 'gray',
        }
    }
  }

  const menu = ref()
  const menuId = ref()
  const toggle = (event: any) => {
    menuId.value = event.currentTarget.id.replace('menu_', '')
    menu.value.toggle(event)
  }

  const showOrderDetails = (event: any) => {
    console.log(event.currentTarget.id)
    const orderId = event.currentTarget.id.replace('order_', '')
    selectedOrder.value = orderStore.orders.find(
      (order) => order.id === parseInt(orderId),
    )
    op.value.toggle(event)
  }

  const op = ref()
  const selectedOrder = ref<Order>()
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
          <Column field="orderStatusId" :header="$t('Status')" sortable>
            <template #body="{ data }">
              <!-- <Button :id="`menu_${data.id}`" text class="p-0" @click="toggle"> -->
                <Tag class="text-center"
                  :severity="getStatusDisplay(data.orderStatus).severity"
                  :value="$t(getStatusDisplay(data.orderStatus).label)"
                ></Tag>
              <!-- </Button> -->
            </template>
          </Column>
          <Column :header="$t('Detail')">
            <template #body="slotProps">
              <Button
                icon="pi pi-info"
                text
                :id="slotProps.data.id"
                @click="showOrderDetails"
              ></Button>
            </template>
          </Column>
          <Column :header="$t('Action')">
            <template #body="slotProps">
              <Button
                v-if="slotProps.data.orderStatusId === OrderStatus.Processing"
                :label="$t('Delivery')"
                icon="pi pi-truck"
                :id="slotProps.data.id"
                @click="onUpdateStatus(slotProps.data.id, OrderStatus.Delivered)"
              ></Button>
              <Button
                v-else-if="
                  slotProps.data.orderStatusId === OrderStatus.Delivered
                "
                :label="$t('Return')"
                icon="pi pi-undo"
                severity="warning"
                :id="slotProps.data.id"
                @click="onUpdateStatus(slotProps.data.id, OrderStatus.Returned)"
              ></Button>
            </template>
          </Column>
        </DataTable>
        <OverlayPanel ref="op" appendTo="body">
          <DataTable
            :value="selectedOrder?.orderDetails"
            showGridlines
            tableStyle="min-width: 50rem"
            removable-sort
          >
            <Column field="productName" :header="$t('Product Name')"></Column>
            <Column field="quantity" :header="$t('Quantity')"></Column>
            <Column field="total" :header="$t('Total')">
              <template #body="slotProps">
                {{ NumberHelper.formatCurrency(slotProps.data.total) }}
              </template>
            </Column>
          </DataTable>
        </OverlayPanel>
      </div>
    </template>
  </Layout>
</template>
