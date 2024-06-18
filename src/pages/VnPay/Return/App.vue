<script setup lang="ts">
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const queryParams = route.query
  const success = queryParams.success == 'True' ? true : false
  const paymentId = queryParams.paymentId
  const reason = queryParams.reason
</script>
<template>
  <ELayout :hide-category="true">
    <template #page-content>
      <div class="bg-primary-reverse grid grid-nogutter p-5 gap-5 border-round">
        <div class="card w-full">
          <span class="text-700 text-xl">Thanks!</span>
          <div v-if="success" class="text-900 font-bold text-4xl my-2">
            Successful Order 🚀
          </div>
          <div v-else class="text-900 font-bold text-4xl my-2">
            Failed Order 😢
          </div>
          <p v-if="success" class="text-700 text-xl mt-0 mb-4 p-0">
            Your order is on the way. It'll be shipped today. We'll inform you.
            PaymentId: {{ paymentId }}
          </p>
          <p v-else class="text-700 text-xl mt-0 mb-4 p-0">
            Your order is failed. Please try again. Reason: {{ reason }}
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
              <span class="font-medium text-xl text-900 mr-2"
                >Order number:</span
              ><span class="font-medium text-xl text-blue-500">451234</span>
            </div>
            <div>
              <button
                pbutton=""
                pripple=""
                label="Details"
                icon="pi pi-list"
                class="p-element p-ripple p-button-outlined p-button-primary mr-2 p-button p-component"
              >
                <span
                  class="p-button-icon p-button-icon-left pi pi-list"
                  aria-hidden="true"
                ></span
                ><span class="p-button-label">Details</span
                ><span
                  class="p-ink"
                  aria-hidden="true"
                  role="presentation"
                ></span></button
              ><button
                pbutton=""
                pripple=""
                label="Print"
                icon="pi pi-print"
                class="p-element p-ripple p-button-outlined p-button-primary p-button p-component"
              >
                <span
                  class="p-button-icon p-button-icon-left pi pi-print"
                  aria-hidden="true"
                ></span
                ><span class="p-button-label">Print</span
                ><span
                  class="p-ink"
                  aria-hidden="true"
                  role="presentation"
                ></span>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap mt-5 pb-3">
            <div class="w-full lg:w-6 pl-3">
              <span class="font-medium text-900">Shipping Address</span>
              <div class="flex flex-column text-900 mt-3 mb-5">
                <span class="mb-1">Celeste Slater</span
                ><span class="mb-1"
                  >606-3727 Ullamcorper. Roseville NH 11523</span
                ><span>(786) 713-8616</span>
              </div>
              <span class="font-medium text-900">Payment</span>
              <div class="flex align-items-center mt-3">
                <div class="flex flex-column">
                  <span class="text-900 mb-1">Visa Debit Card</span
                  ><span class="text-900 font-medium">**** **** **** 1234</span>
                </div>
              </div>
            </div>
            <div
              class="w-full lg:w-6 pl-3 lg:pl-0 lg:pr-3 flex align-items-end mt-5 lg:mt-0"
            >
              <ul class="list-none p-0 m-0 w-full">
                <li class="mb-3">
                  <span class="font-medium text-900">Summary</span>
                </li>
                <li class="flex justify-content-between mb-3">
                  <span class="text-900">Subtotal</span
                  ><span class="text-900 font-medium text-lg">$36.00</span>
                </li>
                <li class="flex justify-content-between mb-3">
                  <span class="text-900">Shipping</span
                  ><span class="text-900 font-medium text-lg">$5.00</span>
                </li>
                <li class="flex justify-content-between mb-3">
                  <span class="text-900">Tax</span
                  ><span class="text-900 font-medium text-lg">$4.00</span>
                </li>
                <li
                  class="flex justify-content-between border-top-1 surface-border py-3"
                >
                  <span class="text-900 font-medium">Total</span
                  ><span class="text-900 font-bold text-lg">$41.00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ELayout>
</template>
