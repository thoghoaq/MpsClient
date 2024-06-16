<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useEProductStore } from 'src/stores/ecommerce/product'
  import { useRoute } from 'vue-router'
  import { Product } from 'src/stores/ecommerce/product/types'
  import { useToastStore } from 'src/stores/toast'
  import NumberHelper from 'src/helpers/number-helper'
  const route = useRoute()
  const id = route.params.id as string
  const toast = useToastStore()
  const eProductStore = useEProductStore()
  const responsiveOptions = ref([
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ])

  const quantity = ref(1)
  const total = ref()

  const productDetails = ref<Product>()

  onMounted(() => {
    eProductStore.fetchProductDetails(id).then((res) => {
      if (res.success) {
        productDetails.value = res.content
        total.value = productDetails.value?.price ?? 0
      } else {
        toast.error(res.content)
      }
    })
  })

  watch(quantity, (value) => {
    total.value = (productDetails.value?.price ?? 0) * value
  })
</script>
<template>
  <ELayout>
    <template #page-content>
      <div class="grid grid-nogutter gap-3">
        <div class="col">
          <div class="card p-3 bg-primary-reverse border-round">
            <Galleria
              :value="
                productDetails?.images.map((image, index) => ({
                  itemImageSrc: image.imagePath,
                  thumbnailImageSrc: image.imagePath,
                  alt: 'Image ' + index,
                  title: 'Product Image' + index,
                }))
              "
              :responsiveOptions="responsiveOptions"
              :numVisible="5"
              thumbnailsPosition="bottom"
            >
              <template #item="slotProps">
                <Image
                  :src="slotProps.item.itemImageSrc"
                  :alt="slotProps.item.alt"
                  width="500"
                  class="overflow-hidden"
                  preview
                />
              </template>
              <template #thumbnail="slotProps">
                <img
                  :src="slotProps.item.thumbnailImageSrc"
                  :alt="slotProps.item.alt"
                  width="100"
                />
              </template>
            </Galleria>
          </div>
        </div>
        <div class="col">
          <div class="flex flex-column gap-3" style="width: 50rem;">
            <div class="card px-4 bg-primary-reverse border-round">
              <h2>{{ productDetails?.name }}</h2>
              <h2 class="text-red-500">
                {{ NumberHelper.formatCurrency(productDetails?.price) }}
              </h2>
            </div>
            <div class="card p-4 bg-primary-reverse border-round">
              <div class="text-xl font-bold pb-2">
                {{ $t('Product Description') }}
              </div>
              <div
                v-html="productDetails?.description"
                class="overflow-auto"
              ></div>
            </div>
            <div class="card p-4 bg-primary-reverse border-round">
              <div class="text-xl font-bold pb-2">
                {{ $t('Guarantee Information') }}
              </div>
              <div class="text-lg">
                {{ $t('Guarantee Guideline.') }}
                <a href="">{{ $t('View detail') }}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="flex flex-column w-full gap-3">
            <div class="card p-3 bg-primary-reverse border-round">
              <div class="flex align-items-center gap-3">
                <Avatar
                  :image="productDetails?.shop?.avatar"
                  shape="circle"
                ></Avatar>
                <span>{{ productDetails?.shop?.shopName }}</span>
              </div>
              <Divider></Divider>
              <div class="flex flex-column mb-3">
                <div class="font-semibold mb-2">{{ $t('Quantity') }}</div>
                <InputNumber
                  v-model="quantity"
                  showButtons
                  buttonLayout="horizontal"
                  :step="1"
                  :min="1"
                  :max="productDetails?.stock"
                  class="w-5rem"
                  input-class="w-5rem"
                ></InputNumber>
              </div>
              <div class="flex flex-column">
                <div class="font-semibold mb-2">{{ $t('Provisional') }}</div>
                <div class="text-red-500 text-xl font-bold">
                  {{ NumberHelper.formatCurrency(total) }}
                </div>
              </div>
              <Button
                type="button"
                severity="contrast"
                :label="$t('ADD TO CART')"
                class="w-full mt-3"
                @click="() => toast.success('Add to cart successfully')"
              />
              <Button
                type="button"
                severity="danger"
                :label="$t('BUY NOW')"
                class="w-full mt-3"
                @click="() => toast.success('Add to cart successfully')"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </ELayout>
</template>
