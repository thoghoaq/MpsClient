<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useEOrderStore } from 'src/stores/ecommerce/order'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import NumberHelper from 'src/helpers/number-helper'
  const eOrderStore = useEOrderStore()

  onMounted(() => {
    eOrderStore.fetchOrders()
  })

  const getStatusDisplay = (status: any) => {
    switch (status.id) {
      case 1:
        return {
          severity: 'warning',
          label: status.name,
          class: 'text-yellow-500',
        }
      case 2:
        return {
          severity: 'info',
          label: status.name,
          class: 'text-primary-500',
        }
      case 4:
        return {
          severity: 'danger',
          label: status.name,
          class: 'text-red-500',
        }
      default:
        return {
          severity: 'secondary',
          label: status.name,
          class: 'bg-secondary',
        }
    }
  }
</script>
<template>
  <ELayout :hide-category="true">
    <template #page-content>
      <div class="bg-primary-reverse overflow-auto border-round p-5">
        <div
          class="flex flex-column md:flex-row justify-content-between align-items-center mb-4"
        >
          <div class="flex flex-column text-center md:text-left">
            <span class="text-900 text-2xl mb-2 font-bold">{{ $t('Your Orders') }}</span>
          </div>
          <span
            class="p-input-icon-right mt-5 mb-2 md:mt-0 md:mb-0 w-full lg:w-25rem"
            ><input
              type="text"
              :placeholder="$t('Search')"
              class="p-inputtext w-full lg:w-25rem surface-50"
          /></span>
        </div>
        <div
          v-if="eOrderStore.orders.length > 0"
          v-for="order in eOrderStore.orders"
          :key="order.id"
          class="surface-card grid grid-nogutter border-round shadow-2 mb-6 ng-star-inserted"
        >
          <div class="col-12 flex p-2 surface-100 border-round-top">
            <div class="p-2 flex-auto text-center md:text-left">
              <span class="text-700 block">{{ $t('Order Number') }}</span
              ><span class="text-900 font-medium block mt-2">{{
                order.id
              }}</span>
            </div>
            <p-divider
              align="center"
              layout="vertical"
              styleclass="h-full  mx-0 lg:mx-3 surface-border"
              class="p-element"
              ><div
                role="separator"
                aria-orientation="vertical"
                data-pc-name="divider"
                class="h-full mx-0 lg:mx-3 surface-border p-divider p-component p-divider-vertical p-divider-solid p-divider-center"
              >
                <div class="p-divider-content"></div></div
            ></p-divider>
            <div class="p-2 flex-auto text-center md:text-left">
              <span class="text-700 block">{{ $t('Order Date') }}</span
              ><span class="text-900 font-medium block mt-2">{{
                DateTimeHelper.format(order.orderDate)
              }}</span>
            </div>
            <p-divider
              align="center"
              layout="vertical"
              styleclass="h-full  mx-0 lg:mx-3 surface-border"
              class="p-element"
              ><div
                role="separator"
                aria-orientation="vertical"
                data-pc-name="divider"
                class="h-full mx-0 lg:mx-3 surface-border p-divider p-component p-divider-vertical p-divider-solid p-divider-center"
              >
                <div class="p-divider-content"></div></div
            ></p-divider>
            <div class="p-2 flex-auto text-center md:text-left">
              <span class="text-700 block">{{ $t('Total') }}</span
              ><span class="text-900 font-medium block mt-2">{{
                NumberHelper.formatCurrency(order.totalAmount)
              }}</span>
            </div>
          </div>
          <div class="col-12">
            <div
              v-for="item in order.orderDetails"
              :key="item.id"
              class="p-2 my-4 flex flex-column lg:flex-row justify-content-between align-items-center ng-star-inserted"
            >
              <div
                class="flex flex-column lg:flex-row justify-content-center align-items-center px-2"
              >
                <img
                  alt="product"
                  class="w-8rem h-8rem mr-3 flex-shrink-0"
                  src="https://via.placeholder.com/200x250"
                />
                <div class="flex flex-column my-auto text-center md:text-left">
                  <span class="text-900 font-medium mb-3 mt-3 lg:mt-0"
                    >{{ item.productName }} x {{ item.quantity }}</span
                  ><span class="text-700 text-sm mb-3">{{
                    NumberHelper.formatCurrency(item.total)
                  }}</span
                  ><a
                    pripple=""
                    tabindex="0"
                    class="p-ripple p-element p-2 select-none cursor-pointer w-10rem mx-auto lg:mx-0 border-round font-medium text-center border-1 border-primary text-primary transition-duration-150"
                    >Buy Again <span class="font-light"></span
                    ><span
                      class="p-ink"
                      aria-hidden="true"
                      role="presentation"
                    ></span
                  ></a>
                </div>
              </div>
              <div
                class="mr-0 lg:mr-3 mt-4 lg:mt-0 p-2 flex align-items-center"
                style="
                  background-color: rgba(76, 175, 80, 0.1);
                  border-radius: 2.5rem;
                "
              >
                <span
                  :class="`p-2 ${getStatusDisplay(order.orderStatus).class}`"
                  >{{ $t(getStatusDisplay(order.orderStatus).label) }}</span
                >
              </div>
              <p-divider
                class="p-element w-full block lg:hidden surface-border ng-star-inserted"
                ><div
                  role="separator"
                  aria-orientation="horizontal"
                  data-pc-name="divider"
                  class="p-divider p-component p-divider-horizontal p-divider-solid p-divider-left"
                >
                  <div class="p-divider-content"></div></div
              ></p-divider>
            </div>
          </div>
          <div class="col-12 p-0 flex border-top-1 surface-border">
            <a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              style="border-bottom-left-radius: 6px"
              ><i class="pi pi-folder mr-2 mb-2 md:mb-1"></i
              >{{ $t('Archive Order') }}</a
            ><a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              ><i class="pi pi-refresh mr-2 mb-2 md:mb-1"></i
              >{{ $t('Return') }}</a
            ><a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              ><i class="pi pi-file mr-2 mb-2 md:mb-1"></i
              >{{ $t('View Invoice') }}</a
            ><a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              style="border-bottom-right-radius: 6px"
              ><i class="pi pi-comment mr-2 mb-2 md:mb-1"></i
              >{{ $t('Write a Review') }}</a
            >
          </div>
        </div>
        <div v-else>
          <div class="text-center">
            <h2>{{ $t('Your order is empty') }}</h2>
            <p>{{ $t('Please buy some products to continue') }}</p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-arrow-left"
              :label="$t('View products')"
              outlined
              @click="$router.push('/ecommerce/products')"
            />
          </div>
        </div>
      </div>
    </template>
  </ELayout>
</template>
