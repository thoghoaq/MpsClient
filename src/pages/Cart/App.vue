<script setup lang="ts">
  import { computed } from 'vue'
  import { useCartStore } from 'src/stores/cart'
  import NumberHelper from 'src/helpers/number-helper'
  const cartStore = useCartStore()
  const isCartEmpty = computed(() => cartStore.items.length === 0)
</script>
<template>
  <ELayout :hide-category="true">
    <template #page-content>
      <div class="bg-primary-reverse grid grid-nogutter p-5 gap-5 border-round">
        <div class="flex flex-column gap-5 col">
          <DataTable v-if="!isCartEmpty" :value="cartStore.items">
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
                  :max="data.stock"
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
            @click=""
          />
        </div>
      </div>
    </template>
  </ELayout>
</template>
