<script setup lang="ts">
  import { onMounted, ref, reactive } from 'vue'
  import { useEOrderStore } from 'src/stores/ecommerce/order'
  import useVuelidate from '@vuelidate/core'
  import { required } from '@vuelidate/validators'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import NumberHelper from 'src/helpers/number-helper'
  import { useToastStore } from 'src/stores/toast'
  import { useI18n } from 'vue-i18n'
  import { OrderStatus } from 'src/stores/types'
  const { t } = useI18n()
  const toast = useToastStore()
  const eOrderStore = useEOrderStore()

  onMounted(() => {
    eOrderStore.fetchOrders()
  })

  const getStatusDisplay = (status: number) => {
    switch (status) {
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
      default:
        return {
          label: 'Unknown',
          severity: 'gray',
        }
    }
  }

  const visible = ref(false)
  const selectedItem = ref<SelectedItem>()
  type SelectedItem = {
    productId: number
    orderId: number
    productName: string
  }

  const state = reactive({
    rating: <any>null,
    feedback: <any>null,
  })

  const rules = {
    rating: {
      required,
    },
  }
  const showFeedback = (
    productId: number,
    orderId: number,
    productName: string,
  ) => {
    selectedItem.value = {
      productId,
      orderId,
      productName,
    }
    state.rating = null
    state.feedback = null
    visible.value = true
  }

  const $v = useVuelidate(rules, state)

  const postFeedback = () => {
    $v.value.$touch()
    if (!$v.value.$invalid) {
      eOrderStore
        .feedback(
          selectedItem.value!.productId!,
          selectedItem.value!.orderId!,
          state.feedback,
          state.rating,
        )
        .then((res) => {
          if (res.success) {
            toast.success(res.content['message'])
            visible.value = false
          } else {
            toast.error(res.content)
          }
        })
    } else {
      toast.warning(t('Please select a rating'))
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
            <span class="text-900 text-2xl mb-2 font-bold">{{
              $t('Your Orders')
            }}</span>
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
          class="surface-card grid grid-nogutter border-round shadow-1 mb-6 ng-star-inserted"
        >
          <div class="col-12 flex p-2 bg-primary-50 border-round-top">
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
              <router-link style="text-decoration: none;"
                :to="{
                  name: 'eProductDetails',
                  params: {
                    id: item.productId,
                  },
                }"
              >
                <div
                  class="flex flex-column lg:flex-row justify-content-center align-items-center px-2"
                >
                  <img
                    alt="product"
                    class="w-8rem h-8rem mr-3 flex-shrink-0"
                    :src="
                      item.productImage ?? 'https://via.placeholder.com/200x250'
                    "
                  />
                  <div
                    class="flex flex-column my-auto text-center md:text-left"
                  >
                    <span class="text-900 font-medium mb-3 mt-3 lg:mt-0"
                      >{{ item.productName }} x {{ item.quantity }}</span
                    ><span class="text-700 text-sm mb-3"
                      >{{ NumberHelper.formatCurrency(item.total) }}
                    </span>
                    <Button
                      v-if="
                        !item.isFeedbacked &&
                        order.orderStatusId === OrderStatus.Completed
                      "
                      :label="$t('Write a Review')"
                      outlined
                      class="w-10rem mx-auto lg:mx-0 border-round font-medium text-center border-1 border-primary text-primary"
                      @click="
                        showFeedback(
                          item.productId,
                          item.orderId,
                          item.productName,
                        )
                      "
                    ></Button>
                  </div>
                </div>
              </router-link>
              <Tag
                class="m-3"
                :severity="getStatusDisplay(order.orderStatus.id).severity"
                :value="$t(getStatusDisplay(order.orderStatus.id).label)"
              >
              </Tag>
            </div>
          </div>
          <div class="col-12 p-0 flex border-top-1 surface-border">
            <!-- <a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              style="border-bottom-left-radius: 6px"
              ><i class="pi pi-folder mr-2 mb-2 md:mb-1"></i
              >{{ $t('Archive Order') }}</a
            > -->
            <!-- <a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              ><i class="pi pi-refresh mr-2 mb-2 md:mb-1"></i
              >{{ $t('Return') }}</a
            > -->
            <a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              ><i class="pi pi-file mr-2 mb-2 md:mb-1"></i
              >{{ $t('View Invoice') }}</a
            >
            <!-- <a
              tabindex="0"
              class="cursor-pointer py-4 flex flex-column md:flex-row text-center justify-content-center align-items-center text-primary hover:bg-primary hover:text-0 transition-duration-150 w-full"
              style="border-bottom-right-radius: 6px"
              ><i class="pi pi-comment mr-2 mb-2 md:mb-1"></i
              >{{ $t('Write a Review') }}</a
            > -->
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
      <Dialog
        v-model:visible="visible"
        modal
        :header="$t('Write a Review')"
        class="mx-3"
        :style="{ width: '50rem' }"
      >
        <div class="text-2xl text-center font-bold mb-4">
          {{ selectedItem?.productName }}
        </div>
        <div class="flex items-center justify-content-center gap-4 mb-4">
          <Rating v-model="state.rating" :cancel="false">
            <template #onicon>
              <i class="pi pi-star-fill text-5xl text-primary"></i>
            </template>
            <template #officon>
              <i class="pi pi-star text-5xl text-primary"></i>
            </template>
          </Rating>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <Textarea
            id="feedback"
            class="flex-auto"
            rows="5"
            auto-resize
            :placeholder="$t('Write your feedback')"
            v-model="state.feedback"
          />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            :label="$t('Cancel')"
            severity="secondary"
            @click="visible = false"
          ></Button>
          <Button
            type="button"
            :label="$t('Save')"
            @click="postFeedback"
          ></Button>
        </div>
      </Dialog>
    </template>
  </ELayout>
</template>
