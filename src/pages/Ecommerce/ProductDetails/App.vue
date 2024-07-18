<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useEProductStore } from 'src/stores/ecommerce/product'
  import { useRoute } from 'vue-router'
  import { Feedback, Product } from 'src/stores/ecommerce/product/types'
  import { useToastStore } from 'src/stores/toast'
  import NumberHelper from 'src/helpers/number-helper'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useCartStore } from 'src/stores/cart'
  import { useI18n } from 'vue-i18n'
  import { useApi } from 'src/stores/api'
  import { appConfig, isMobile } from 'src/stores'
  const api = useApi()
  const { t } = useI18n()
  const route = useRoute()
  const id = route.params.id as string
  const toast = useToastStore()
  const eProductStore = useEProductStore()
  const cartStore = useCartStore()
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
  const feedback = ref<Feedback>()
  const similarProducts = ref<Product[]>([])

  onMounted(() => {
    window.scrollTo(0, 0)
    eProductStore.fetchProductDetails(id).then((res) => {
      if (res.success) {
        productDetails.value = res.content
        total.value = productDetails.value?.price ?? 0
      } else {
        toast.error(res.content)
      }
    })
    api.post(appConfig.api.ecommerce.trackingProduct, {
      productId: [id],
      action: 1,
    })
    eProductStore.fetchFeedbacks(id).then((res) => {
      if (res.success) {
        feedback.value = res.content
      } else {
        toast.error(res.content)
      }
    })
    eProductStore.getSimilarProducts(id).then((res) => {
      if (res.success) {
        similarProducts.value = res.content
      } else {
        toast.error(res.content)
      }
    })
  })

  const addToCart = function (product: Product, selected?: boolean) {
    cartStore.addProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0]?.imagePath,
      quantity: quantity.value,
      stock: product.stock,
      selected: selected ?? false,
      shopId: product.shopId,
      shop: product.shop,
    })
    toast.success(t('Add to cart successfully'))
  }

  watch(quantity, (value) => {
    total.value = (productDetails.value?.price ?? 0) * value
  })

  const responsiveOptions2 = ref([
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    }
  ])

  const reload = (id: string) => {
    window.scrollTo(0, 0)
    eProductStore.fetchProductDetails(id).then((res) => {
      if (res.success) {
        productDetails.value = res.content
        total.value = productDetails.value?.price ?? 0
      } else {
        toast.error(res.content)
      }
    })
    eProductStore.fetchFeedbacks(id).then((res) => {
      if (res.success) {
        feedback.value = res.content
      } else {
        toast.error(res.content)
      }
    })
    eProductStore.getSimilarProducts(id).then((res) => {
      if (res.success) {
        similarProducts.value = res.content
      } else {
        toast.error(res.content)
      }
    })
  }
</script>
<template>
  <ELayout :hide-category="true" :hide-navigation="true">
    <template #page-content>
      <div class="lg:flex grid">
        <div
          class="col-12 xl:col-4"
          v-if="productDetails?.images && productDetails?.images.length > 0"
        >
          <div class="p-3 bg-primary-reverse border-round">
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
                <Image :alt="slotProps.item.alt" preview class="w-full">
                  <template #image>
                    <img
                      :src="slotProps.item.itemImageSrc"
                      alt="image"
                      class="w-full"
                    />
                  </template>
                  <template #preview="pslotProps">
                    <img
                      :src="slotProps.item.itemImageSrc"
                      alt="preview"
                      :style="pslotProps.style"
                      @click="pslotProps.onClick"
                    />
                  </template>
                </Image>
              </template>
              <template #thumbnail="slotProps">
                <img
                  :src="slotProps.item.thumbnailImageSrc"
                  :alt="slotProps.item.alt"
                  height="100"
                  style="object-fit: cover"
                />
              </template>
            </Galleria>
          </div>
        </div>
        <div
          :class="
            productDetails?.images && productDetails?.images.length > 0
              ? 'col-12 xl:col-5'
              : 'col'
          "
          class="xl:flex xl:flex-auto gap-3"
        >
          <div
            class="p-0 overflow-y-auto flex flex-column gap-3 content col mb-3 xl:mb-0"
          >
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
            <div class="card p-4 bg-primary-reverse border-round" v-if="false">
              <div class="text-xl font-bold pb-2">
                {{ $t('Guarantee Information') }}
              </div>
              <div class="text-lg">
                {{ $t('Guarantee Guideline.') }}
                <a href="">{{ $t('View detail') }}</a>
              </div>
            </div>
            <div
              class="card p-4 bg-primary-reverse border-round flex flex-column gap-3"
            >
              <div class="text-xl font-bold pb-2">
                {{ $t('PRODUCT FEEDBACKS') }}
              </div>
              <div v-if="feedback" class="grid align-items-center">
                <div class="col-12 lg:col-4 flex justify-content-center">
                  <div>
                    <div class="flex align-items-center gap-2">
                      <div class="text-2xl font-bold">
                        {{ feedback?.averageRating }}
                      </div>
                      <Rating
                        :model-value="feedback?.averageRating"
                        :cancel="false"
                        readonly
                      />
                    </div>
                    <div class="flex">
                      {{ `(${feedback?.total} ${$t('feedbacks')})` }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-column gap-2 col-12 lg:col-8">
                  <div class="flex gap-2 w-full">
                    <Rating :model-value="5" :cancel="false" readonly />
                    <div class="w-full">
                      <ProgressBar
                        :value="(feedback?.fiveStar / feedback?.total) * 100"
                      >
                        {{ feedback?.fiveStar }}
                      </ProgressBar>
                    </div>
                  </div>
                  <div class="flex gap-2 w-full">
                    <Rating :model-value="4" :cancel="false" readonly />
                    <div class="w-full">
                      <ProgressBar
                        :value="(feedback?.fourStar / feedback?.total) * 100"
                      >
                        {{ feedback?.fourStar }}
                      </ProgressBar>
                    </div>
                  </div>
                  <div class="flex gap-2 w-full">
                    <Rating :model-value="3" :cancel="false" readonly />
                    <div class="w-full">
                      <ProgressBar
                        :value="(feedback?.threeStar / feedback?.total) * 100"
                      >
                        {{ feedback?.threeStar }}
                      </ProgressBar>
                    </div>
                  </div>
                  <div class="flex gap-2 w-full">
                    <Rating :model-value="2" :cancel="false" readonly />
                    <div class="w-full">
                      <ProgressBar
                        :value="(feedback?.twoStar / feedback?.total) * 100"
                      >
                        {{ feedback?.twoStar }}
                      </ProgressBar>
                    </div>
                  </div>
                  <div class="flex gap-2 w-full">
                    <Rating :model-value="1" :cancel="false" readonly />
                    <div class="w-full">
                      <ProgressBar
                        :value="(feedback?.oneStar / feedback?.total) * 100"
                      >
                        {{ feedback?.oneStar }}
                      </ProgressBar>
                    </div>
                  </div>
                </div>
              </div>
              <div v-for="post in feedback?.feedbacks">
                <div class="flex gap-2">
                  <Avatar
                    :image="
                      post.user.avatarPath ?? 'https://via.placeholder.com/250'
                    "
                    shape="circle"
                    size="large"
                  ></Avatar>
                  <div class="flex flex-column gap-2">
                    <div>{{ post.user.fullName }}</div>
                    <Rating
                      :model-value="post.rating"
                      :cancel="false"
                      readonly
                    />
                    <div class="text-400">
                      {{ DateTimeHelper.format(post.createdAt, 'datetime') }}
                    </div>
                    <div class="text-500">{{ post.feedback }}</div>
                  </div>
                </div>
                <Divider></Divider>
              </div>
            </div>
            <div
              class="card p-4 bg-primary-reverse border-round flex flex-column gap-3"
            >
              <div class="text-xl font-bold pb-2">
                {{ $t('SIMILAR PRODUCTS') }}
              </div>
              <Carousel
                :value="similarProducts"
                :numVisible="isMobile ? 2 : 3"
                :numScroll="isMobile ? 2 : 3"
              >
                <template #item="slotProps">
                  <div class="border-1 surface-border border-round m-2 p-3">
                    <div
                      class="cursor-pointer"
                      @click="reload(slotProps.data.id)"
                    >
                      <div class="mb-3">
                        <div class="relative mx-auto">
                          <img
                            :src="
                              slotProps.data.images[0]?.imagePath ??
                              'https://via.placeholder.com/200x250'
                            "
                            :alt="slotProps.data.name"
                            class="w-full h-10rem lg:h-16rem border-round"
                            style="object-fit: cover"
                          />
                        </div>
                      </div>
                      <div class="mb-3 font-medium text-2-line">
                        {{ slotProps.data.name }}
                      </div>
                      <div
                        class="flex justify-content-between align-items-center"
                      >
                        <div class="mt-0 font-semibold text-xl text-red-500">
                          {{
                            NumberHelper.formatCurrency(slotProps.data.price)
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </Carousel>
            </div>
          </div>
          <div class="xl:sticky top-0 xl:col-4 flex flex-column gap-3 p-0">
            <div class="p-3 bg-primary-reverse border-round">
              <div
                class="flex align-items-center justify-content-between gap-3"
              >
                <div>
                  <Avatar
                    :image="productDetails?.shop?.avatar"
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
                      productDetails?.shop?.shopName
                    }}</span>
                  </div>
                  <div>
                    {{
                      `${productDetails?.shop?.address}, ${productDetails?.shop?.district}, ${productDetails?.shop?.city}`
                    }}
                  </div>
                </div>
              </div>
              <div v-if="!isMobile">
                <Divider></Divider>
                <div class="flex flex-column mb-3">
                  <div class="flex gap-3">
                    <div class="font-semibold mb-2">{{ $t('Quantity') }}</div>
                    <div v-if="false" class="text-500">
                      {{ `(${productDetails?.stock} ${$t('items available')})` }}
                    </div>
                  </div>
                  <InputNumber
                    v-model="quantity"
                    showButtons
                    buttonLayout="horizontal"
                    :step="1"
                    :min="1"
                    :max="10"
                    class="w-5rem"
                    input-class="w-3rem"
                    :allow-empty="false"
                  >
                    <template #incrementbuttonicon>
                      <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                      <span class="pi pi-minus" />
                    </template>
                  </InputNumber>
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
                  @click="() => productDetails && addToCart(productDetails)"
                />
                <Button
                  type="button"
                  severity="danger"
                  :label="$t('BUY NOW')"
                  class="w-full mt-3"
                  @click="
                    () => {
                      productDetails && addToCart(productDetails, true)
                      $router.push({ name: 'checkout' })
                    }
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isMobile" class="fixed bottom-0 left-0 w-full shadow-4">
        <div
          class="flex justify-content-between align-items-center bg-primary-reverse h-4rem"
        >
          <div class="mx-4">
            <InputNumber
              v-model="quantity"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              :min="1"
              :max="10"
              class="w-5rem"
              input-class="w-3rem"
              :allow-empty="false"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus"></span>
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus"></span>
              </template>
            </InputNumber>
          </div>
          <div class="h-full flex">
            <Divider layout="vertical" class="p-0 m-0"></Divider>
            <Button
              icon="pi pi-shopping-cart"
              text
              class="h-full w-5rem"
              @click="() => productDetails && addToCart(productDetails)"
            ></Button>
            <Button
              class="h-full justify-content-center bg-red-500 border-0"
              @click="
                () => {
                  productDetails && addToCart(productDetails, true)
                  $router.push({ name: 'checkout' })
                }
              "
            >
              <div class="flex flex-column gap-2">
                <div>{{ $t('BUY NOW') }}</div>
                <div class="font-bold">
                  {{ NumberHelper.formatCurrency(total) }}
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </template>
  </ELayout>
</template>
<style scoped lang="css">
  .hide-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scroll::-webkit-scrollbar {
    display: none;
  }
</style>
