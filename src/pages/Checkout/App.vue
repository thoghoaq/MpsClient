<script setup lang="ts">
  import { reactive, ref, onMounted } from 'vue'
  import useVuelidate from '@vuelidate/core'
  import { required, email } from '@vuelidate/validators'
  import { useCartStore } from 'src/stores/cart'
  import { CartItem } from 'src/stores/cart/types'
  import NumberHelper from 'src/helpers/number-helper'
  import { useI18n } from 'vue-i18n'
  import { useToastStore } from 'src/stores/toast'
  import { appConfig, isMobile } from 'src/stores'
  import { EPaymentMethod } from 'src/stores/types'
  import { useRouter } from 'vue-router'
  const toast = useToastStore()
  const { t } = useI18n()
  const cartStore = useCartStore()
  const router = useRouter()
  const state = reactive({
    fullName: appConfig.loggedUser.data.displayName,
    address: appConfig.loggedUser.data.customerAddress ?? '',
    phoneNumber: appConfig.loggedUser.data.phoneNumber ?? '',
    email: appConfig.loggedUser.data.email,
    note: '',
    paymentMethod: { label: 'VnPay', value: EPaymentMethod.VnPay },
    voucherCode: '',
  })

  const rules = {
    fullName: { required: required },
    address: { required: required },
    phoneNumber: { required: required },
    email: { required: required, email: email },
    note: {},
    paymentMethod: { required: required },
    voucherCode: {},
  }

  const v$ = useVuelidate(rules, state)

  const orderItems = ref(<any>[])

  onMounted(() => {
    orderItems.value = cartStore.items
      .filter((item) => item.selected)
      .map((item: CartItem) => {
        return {
          product: `${item.name} x${item.quantity}`,
          provisional: NumberHelper.formatCurrency(item.quantity * item.price),
          productClass: '',
          provisionalClass: 'font-semibold',
        }
      })
    orderItems.value = orderItems.value.concat([
      // {
      //   product: t('Discount'),
      //   provisional: '',
      //   productClass: 'font-semibold',
      //   provisionalClass: 'font-semibold',
      // },
      // {
      //   product: t('VAT'),
      //   provisional: '',
      //   productClass: 'font-semibold',
      //   provisionalClass: 'font-semibold',
      // },
      {
        product: t('Total'),
        provisional: NumberHelper.formatCurrency(cartStore.calculateTotal()),
        productClass: 'font-semibold',
        provisionalClass: 'font-semibold',
      },
    ])
  })

  const paymentMethods = ref([{ label: 'VnPay', value: EPaymentMethod.VnPay }])

  const submitOrder = function () {
    v$.value.$touch()
    if (!v$.value.$error) {
      cartStore
        .checkout(
          state.address,
          state.fullName,
          state.email,
          state.phoneNumber,
          state.note,
          state.paymentMethod.value,
          0,
        )
        .then((response) => {
          if (response.success) {
            router.push({
              name: 'vnPay',
              query: { paymentUrl: response.content['paymentUrl'] },
            })
          } else {
            toast.error(response.content)
          }
        })
    }
  }
</script>
<template>
  <ELayout :hide-category="true">
    <template #page-content>
      <div
        class="bg-primary-reverse w-full grid grid-nogutter p-4 lg:p-6 gap-4 lg:gap-6 border-round"
      >
        <div class="flex flex-column w-full gap-4 lg:gap-6 col">
          <div class="flex flex-column gap-3">
            <div class="text-lg font-bold">
              {{ $t('CHECK OUT INFORMATION') }}
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="fullName">{{
                $t('Full Name')
              }}</label>
              <InputText
                v-model="state.fullName"
                :invalid="v$.fullName.$error"
                :placeholder="$t('Enter your full name')"
                @blur="v$.fullName.$touch"
              />
              <small class="p-error" v-if="v$.fullName.$error">{{
                $t(v$.fullName.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="address">{{ $t('Address') }}</label>
              <InputText
                v-model="state.address"
                :invalid="v$.address.$error"
                :placeholder="$t('Enter your address')"
                @blur="v$.address.$touch"
              />
              <small class="p-error" v-if="v$.address.$error">{{
                $t(v$.address.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="phoneNumber">{{
                $t('Phone Number')
              }}</label>
              <InputText
                v-model="state.phoneNumber"
                :invalid="v$.phoneNumber.$error"
                :placeholder="$t('Enter your phone number')"
                @blur="v$.phoneNumber.$touch"
              />
              <small class="p-error" v-if="v$.phoneNumber.$error">{{
                $t(v$.phoneNumber.$errors[0]?.$message?.toString())
              }}</small>
            </div>
            <div class="flex flex-column gap-2">
              <label class="required" for="email">{{ $t('Email') }}</label>
              <InputText
                v-model="state.email"
                :invalid="v$.email.$error"
                :placeholder="$t('Enter your email')"
                @blur="v$.email.$touch"
              />
              <small class="p-error" v-if="v$.email.$error">{{
                $t(v$.email.$errors[0]?.$message?.toString())
              }}</small>
            </div>
          </div>
          <div class="flex flex-column gap-3">
            <div class="text-lg font-bold">
              {{ $t('ADDITIONAL INFOMATION') }}
            </div>
            <div class="flex flex-column gap-2">
              <label for="note">{{ $t('Order note (optional)') }}</label>
              <Textarea
                v-model="state.note"
                rows="4"
                :placeholder="$t('Enter your note')"
              />
            </div>
          </div>
          <router-link to="/cart" v-if="!isMobile">
            <Button
              :label="$t('Back to cart')"
              icon="pi pi-arrow-left"
              outlined
            />
          </router-link>
        </div>
        <div
          class="col-12 lg:col-4 border-round border-1 border-200 p-4 flex flex-column gap-3"
        >
          <div class="text-lg font-bold mx-3">{{ $t('YOUR ORDER') }}</div>
          <DataTable :value="orderItems">
            <Column field="product" :header="$t('PRODUCT')">
              <template #body="{ data }">
                <span :class="data.productClass">{{ data.product }}</span>
              </template>
            </Column>
            <Column field="provisional" class="text-right">
              <template #header>
                <div class="w-full text-right">
                  <div>{{ $t('PROVISIONAL') }}</div>
                </div>
              </template>
              <template #body="{ data }">
                <span :class="data.provisionalClass">{{
                  data.provisional
                }}</span>
              </template>
            </Column>
          </DataTable>
          <Dropdown
            v-model="state.paymentMethod"
            :options="paymentMethods"
            option-label="label"
            class="mx-3"
            :placeholder="$t('Payment method')"
            :invalid="v$.paymentMethod.$error"
            @blur="v$.paymentMethod.$touch"
          >
          </Dropdown>
          <DataTable :value="[{ row: 1 }]" v-if="false">
            <Column>
              <template #header>
                <div class="flex gap-3 align-items-center">
                  <i class="pi pi-tags"></i>
                  <span>{{ $t('Voucher code') }}</span>
                </div>
              </template>
              <template #body="{ data }">
                <div class="flex flex-column gap-3">
                  <InputText
                    v-model="state.voucherCode"
                    :placeholder="$t('Enter your voucher code')"
                  />
                  <Button :label="$t('Apply')" class="w-full" outlined />
                </div>
              </template>
            </Column>
          </DataTable>
          <Button
            :label="$t('PLACE ORDER')"
            class="mx-3"
            @click="submitOrder"
          />
          <div class="mx-3">
            <small>{{ $t('Your order are not included shipping fee') }}</small>
          </div>
        </div>
        <router-link to="/cart" v-if="isMobile">
          <Button
            :label="$t('Back to cart')"
            icon="pi pi-arrow-left"
            outlined
          />
        </router-link>
      </div>
    </template>
  </ELayout>
</template>
