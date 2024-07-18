<script setup lang="ts">
  import { computed } from 'vue'
  import { useCartStore } from 'src/stores/cart'
  import NumberHelper from 'src/helpers/number-helper'
  import { useToastStore } from 'src/stores/toast'
  import { isMobile } from 'src/stores'
  const cartStore = useCartStore()
  const isCartEmpty = computed(() => cartStore.items.length === 0)
  const toast = useToastStore()
</script>
<template>
  <ELayout :hide-category="true" :hide-scroll-top="true">
    <template #page-content>
      <div
        v-if="!isMobile"
        class="bg-primary-reverse grid grid-nogutter p-5 gap-5 border-round"
      >
        <div class="flex flex-column gap-5 col">
          <DataTable
            v-for="group in cartStore.groupCartItemsByShop(cartStore.items)"
            v-if="!isCartEmpty"
            :value="group"
          >
            <template #header>
              <div
                class="flex align-items-center justify-content-between gap-3"
              >
                <div>
                  <Avatar
                    :image="group[0]?.shop?.avatar"
                    shape="circle"
                    size="xlarge"
                  ></Avatar>
                </div>
                <div
                  class="grid grid-nogutter align-items-center justify-content-between w-full gap-2"
                >
                  <div class="flex gap-2 align-items-center">
                    <i class="pi pi-shop text-xl"></i>
                    <span class="font-bold text-xl">{{
                      group[0]?.shop?.shopName
                    }}</span>
                  </div>
                  <div>
                    {{
                      `${group[0]?.shop?.address}, ${group[0]?.shop?.district}, ${group[0]?.shop?.city}`
                    }}
                  </div>
                </div>
              </div>
            </template>
            <Column field="selected" class="w-3rem">
              <template #body="{ data }">
                <Checkbox
                  v-model="data.selected"
                  :binary="true"
                  @update:model-value="cartStore.updateCart"
                />
              </template>
            </Column>
            <Column field="name" :header="$t('PRODUCT')">
              <template #body="{ data }">
                <div class="flex gap-3 align-items-center">
                  <img
                    :src="data.imageUrl"
                    class="w-10rem"
                    style="object-fit: contain; max-height: 10rem"
                  />
                  <div>{{ data.name }}</div>
                </div>
              </template>
            </Column>
            <Column field="price" :header="$t('PRICE')">
              <template #body="{ data }">
                {{ NumberHelper.formatCurrency(data.price) }}
              </template>
            </Column>
            <Column field="quantity" :header="$t('QUANTITY')">
              <template #body="{ data }">
                <InputNumber
                  v-model="data.quantity"
                  showButtons
                  buttonLayout="horizontal"
                  :step="1"
                  :min="0"
                  :max="10"
                  class="w-5rem"
                  input-class="w-3rem"
                  :allow-empty="false"
                  @update:model-value="cartStore.updateQuantity()"
                >
                  <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                  </template>
                  <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                  </template>
                </InputNumber>
              </template>
            </Column>
            <Column :header="$t('TOTAL')">
              <template #body="{ data }">
                {{ NumberHelper.formatCurrency(data.price * data.quantity) }}
              </template>
            </Column>
          </DataTable>
          <div v-else>
            <div class="text-center">
              <h2>{{ $t('Your cart is empty') }}</h2>
              <p>{{ $t('Please add some products to continue') }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-arrow-left"
              :label="$t('Back to products')"
              outlined
              @click="$router.push('/ecommerce/products')"
            />
          </div>
        </div>
        <Divider v-if="!isCartEmpty" layout="vertical"></Divider>
        <div v-if="!isCartEmpty" class="flex flex-column gap-3 col-3">
          <DataTable :value="[{ label: 'Total' }]">
            <Column :header="$t('CART TOTAL')">
              <template #body="{ data }">
                {{ $t(data.label) }}
              </template>
            </Column>
            <Column class="text-right font-bold">
              <template #body>
                {{ NumberHelper.formatCurrency(cartStore.calculateTotal()) }}
              </template>
            </Column>
          </DataTable>
          <Button
            type="button"
            severity="contrast"
            :label="$t('CHECKOUT')"
            class="w-full mt-3"
            @click="
              () => {
                if (
                  cartStore.items.filter((item) => item.selected).length > 0
                ) {
                  $router.push({ name: 'checkout' })
                } else {
                  toast.warning($t('Please select at least one product'))
                }
              }
            "
          />
        </div>
      </div>
      <div v-else class="grid grid-nogutter gap-3 h-full">
        <div
          v-if="!isCartEmpty"
          v-for="group in cartStore.groupCartItemsByShop(cartStore.items)"
          class="bg-primary-reverse p-3 border-round w-full"
        >
          <div class="flex align-items-center justify-content-between gap-3">
            <div>
              <Avatar
                :image="group[0]?.shop?.avatar"
                shape="circle"
                size="large"
              ></Avatar>
            </div>
            <div
              class="grid grid-nogutter align-items-center justify-content-between w-full gap-2"
            >
              <div class="flex gap-2 align-items-center">
                <i class="pi pi-shop text-xl"></i>
                <span class="font-bold text-xl">{{
                  group[0]?.shop?.shopName
                }}</span>
              </div>
              <div>
                {{
                  `${group[0]?.shop?.address}, ${group[0]?.shop?.district}, ${group[0]?.shop?.city}`
                }}
              </div>
            </div>
          </div>
          <Divider></Divider>
          <div v-for="item in group" class="flex align-items-center gap-3 my-3">
            <Checkbox
              v-model="item.selected"
              :binary="true"
              @update:model-value="cartStore.updateCart"
            />
            <div class="flex gap-3 align-items-center w-full">
              <img
                :src="item.imageUrl ?? 'https://via.placeholder.com/150'"
                :title="item.name"
                class="w-5rem w-5rem"
                style="object-fit: contain"
              />
              <div
                class="flex w-full align-items-center justify-content-between"
              >
                <div class="flex flex-column gap-2">
                  <div>{{ item.name }}</div>
                  <div class="text-red-500 font-bold">
                    {{ NumberHelper.formatCurrency(item.price * item.quantity) }}
                  </div>
                </div>
                <div class="w-10rem">
                  <InputNumber
                    v-model="item.quantity"
                    showButtons
                    buttonLayout="horizontal"
                    :step="1"
                    :min="0"
                    :max="10"
                    class="w-5rem"
                    input-class="w-3rem"
                    :allow-empty="false"
                    @update:model-value="cartStore.updateQuantity()"
                  >
                    <template #incrementbuttonicon>
                      <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                      <span class="pi pi-minus" />
                    </template>
                  </InputNumber>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-primary-reverse w-full border-round p-4">
          <div class="text-center">
            <h2>{{ $t('Your cart is empty') }}</h2>
            <p>{{ $t('Please add some products to continue') }}</p>
          </div>
          <div class="flex gap-3 justify-content-center">
            <Button
              icon="pi pi-arrow-left"
              :label="$t('Back to products')"
              outlined
              @click="$router.push('/ecommerce/products')"
            />
          </div>
        </div>
      </div>
      <div class="h-7rem"></div>
      <div
        v-if="isMobile && !isCartEmpty"
        class="fixed bottom-0 left-0 w-full"
      >
        <div class="bg-primary-reverse font-bold border-round flex mt-3">
          <DataTable :value="[{ label: 'Total' }]" class="w-full border-round">
            <Column :header="$t('CART TOTAL')" class="border-round">
              <template #body="{ data }">
                {{ $t(data.label) }}
              </template>
            </Column>
            <Column class="text-right font-bold border-round">
              <template #body>
                {{ NumberHelper.formatCurrency(cartStore.calculateTotal()) }}
              </template>
            </Column>
          </DataTable>
          <Button
            type="button"
            severity="contrast"
            :label="$t('CHECKOUT')"
            class="w-10rem"
            @click="
              () => {
                if (cartStore.items.filter((item) => item.selected).length > 0) {
                  $router.push({ name: 'checkout' })
                } else {
                  toast.warning($t('Please select at least one product'))
                }
              }
            "
          />
        </div>
        <div class="h-5rem"></div>
      </div>
    </template>
  </ELayout>
</template>
