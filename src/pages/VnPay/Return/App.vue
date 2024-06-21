<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { usePaymentStore } from 'src/stores/ecommerce/payment'
  import { useCartStore } from 'src/stores/cart'
  import NumberHelper from 'src/helpers/number-helper'
  const cartStore = useCartStore()
  const paymentStore = usePaymentStore()
  const route = useRoute()
  const queryParams = route.query
  const success = queryParams.success == 'True' ? true : false
  const paymentId = queryParams.paymentId
  const reason = queryParams.reason

  onMounted(() => {
    if (success) {
      cartStore.clearCart(true)
      paymentStore.fetchPaymentDetails(paymentId)
    }
  })
</script>
<template>
  <ELayout :hide-category="true">
    <template #page-content>
      <div v-if="success"
        v-for="order in paymentStore.paymentDetails?.orders"
        class="bg-primary-reverse p-5 mb-3 border-round"
      >
        <div class="card w-full">
          <span class="text-700 text-xl">{{ $t('Thanks!') }}</span>
          <div class="text-900 font-bold text-4xl my-2">
            {{ $t('Successful Order') }} 🚀
          </div>
          <p class="text-700 text-xl mt-0 mb-4 p-0">
            {{
              $t(
                "Your order is on the way. It'll be shipped. We'll inform you.",
              )
            }}
          </p>
          <div
            style="
              height: 3px;
              background: linear-gradient(
                90deg,
                var(--primary-color) 0%,
                rgba(33, 150, 243, 0) 50%
              );
            "
          ></div>
          <div
            class="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between py-5"
          >
            <div class="mb-3 sm:mb-0">
              <span class="font-medium text-xl text-900 mr-2">{{
                $t('Order number:')
              }}</span
              ><span class="font-medium text-xl text-blue-500">{{
                order.id
              }}</span>
            </div>
            <div class="text-right">
              <span class="font-medium text-900">{{ $t('Shop') }}</span>
              <div class="flex flex-column text-900 mt-3">
                <span class="mb-1 font-bold">{{ order.shop.shopName }}</span
                ><span>{{ order.shop.address }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap mt-5 pb-3">
            <div class="w-full lg:w-6 pl-3">
              <span class="font-medium text-900">{{
                $t('Shipping Address')
              }}</span>
              <div class="flex flex-column text-900 mt-3 mb-5">
                <span class="mb-1">{{ order.customerName }}</span
                ><span class="mb-1">{{ order.address }}</span
                ><span>{{ order.phoneNumber }}</span>
              </div>
              <span class="font-medium text-900">{{ $t('Status') }}</span>
              <div class="flex align-items-center mt-3">
                <div class="flex flex-column">
                  <span class="mb-1">
                    <Tag
                      severity="warn"
                      :value="$t(order.orderStatus.name)"
                    ></Tag>
                  </span>
                </div>
              </div>
            </div>
            <div
              class="w-full lg:w-6 pl-3 lg:pl-0 lg:pr-3 flex align-items-end mt-5 lg:mt-0"
            >
              <ul class="list-none p-0 m-0 w-full">
                <li class="mb-3">
                  <span class="font-medium text-900">{{ $t('Summary') }}</span>
                </li>
                <li
                  v-for="detail in order.orderDetails"
                  class="flex justify-content-between mb-3"
                >
                  <span class="text-900"
                    >{{ detail.productName }} x{{ detail.quantity }}</span
                  ><span class="text-900 font-medium text-lg">{{
                    NumberHelper.formatCurrency(detail.total)
                  }}</span>
                </li>
                <li
                  class="flex justify-content-between border-top-1 surface-border py-3"
                >
                  <span class="text-900 font-medium">{{ $t('Total') }}</span
                  ><span class="text-900 font-bold text-lg">{{
                    NumberHelper.formatCurrency(order.totalAmount)
                  }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-primary-reverse p-5 mb-3 border-round">
        <div class="card w-full">
          <span class="text-700 text-xl">{{ $t('Sorry!') }}</span>
          <div class="text-900 font-bold text-4xl my-2">
            {{ $t('Failed Order') }} 😢
          </div>
          <p class="text-700 text-xl mt-0 mb-4 p-0">
            {{ $t('Your order is failed. Please try again. Reason: ') }}
            {{ reason }}
          </p>
          <div
            style="
              height: 3px;
              background: linear-gradient(
                90deg,
                var(--primary-color) 0%,
                rgba(33, 150, 243, 0) 50%
              );
            "
          ></div>
        </div>
      </div>
    </template>
  </ELayout>
</template>
