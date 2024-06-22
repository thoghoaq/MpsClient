<script setup lang="ts">
  import { reactive, ref, onMounted } from 'vue'
  import useVuelidate from '@vuelidate/core'
  import { required, minLength } from '@vuelidate/validators'
  import { useToastStore } from 'src/stores/toast'
  import { useApi } from 'src/stores/api'
  import { appConfig } from 'src/stores/index'
  import { EFileType } from 'src/stores/types'
  import { useDataSourceStore } from 'src/stores/datasource'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { Product } from 'src/stores/seller/product/types'
  const route = useRoute()
  const { t } = useI18n()
  const productId = route.params.id as string | undefined
  const state = reactive({
    productName: '',
    price: <any>null,
    productCode: '',
    productSKU: '',
    description: <any>'<p>Hello</p>',
    productImages: <string[]>[],
    category: <any>null,
    stock: 0,
    brand: <any>null,
  })
  const rules = {
    productName: { required },
    price: { required },
    productCode: { required },
    productSKU: { required },
    description: {},
    productImages: {},
    category: { required },
    stock: { required },
    brand: {},
  }
  const $v = useVuelidate(rules, state)
  const toast = useToastStore()
  const api = useApi()
  const dataSourceStore = useDataSourceStore()

  onMounted(() => {
    dataSourceStore.fetchProductBrands()
    dataSourceStore.fetchProductCategories().then(() => {
      if (productId) {
        api
          .get(
            appConfig.appendUrl(appConfig.api.shop.product, {
              id: productId,
              shopId: appConfig.loggedUser.shopManaging?.id,
            }),
          )
          .then((res) => {
            if (res.success) {
              const product = res.content as Product
              state.productName = product.name
              state.price = product.price
              state.productCode = product.productCode
              state.productSKU = product.productSKU
              state.description = product.description
              state.productImages = product.images.map(
                (image: any) => image.imagePath,
              )
              const categoryKey = dataSourceStore.getCategoryFromTree(
                product.categoryId,
              )?.key
              state.category = {
                [categoryKey as string]: true,
              }
              state.stock = product.stock
              state.brand = dataSourceStore.productBrands.find(
                (item) => item.id == product.brandId,
              )
            } else {
              toast.error(res.content)
            }
          })
      }
    })
  })

  const onUpload = async (event: any) => {
    const data = new FormData()
    for (let i = 0; i < event.files.length; i++) {
      data.append('files', event.files[i])
    }
    return api
      .post(
        appConfig.appendUrl(appConfig.api.image.upload, {
          type: EFileType.ProductImages,
        }),
        data,
      )
      .then((res) => {
        if (res.success) {
          return res.content
        } else {
          toast.error(res.content)
        }
      })
  }

  const onTemplatedUpload = async (event: any) => {
    await onUpload(event).then((res: any) => {
      if (res) state.productImages.push(...res)
    })
  }

  const removeImages = (index?: number) => {
    if (index != null && index != undefined) {
      state.productImages.splice(index, 1)
    } else {
      state.productImages = []
    }
  }

  const getCategoryNode = (key: string) => {
    var keyTree = key.split('-')
    const parent = dataSourceStore.productCategoryTree.find(
      (item) => item.key == keyTree[0],
    )
    if (keyTree.length == 1) {
      return parent
    }
    const child = parent?.children?.find(
      (item) => item.key == `${keyTree[0]}-${keyTree[1]}`,
    )
    if (keyTree.length == 2) {
      return child
    }

    if (keyTree.length == 3) {
      return child?.children?.find((item) => item.key == key)
    }
  }

  const loading = ref(false)
  const publish = function () {
    $v.value.$touch()
    if ($v.value.$invalid) {
      toast.warning(t('Please check your input'))
      return
    }
    loading.value = true
    const categoryId = getCategoryNode(Object.keys(state.category)[0])?.data.id
    const data = {
      id: productId,
      shopId: appConfig.loggedUser.shopManaging?.id,
      name: state.productName,
      price: state.price,
      productCode: state.productCode,
      productSKU: state.productSKU,
      description: state.description,
      images: state.productImages.map((image) => {
        return { imagePath: image }
      }),
      categoryId: categoryId,
      brandId: state.brand?.id,
      stock: state.stock,
    }
    if (productId) {
      api
        .put(appConfig.api.shop.product, data)
        .then((res) => {
          if (res.success) {
            toast.success(res.content['message'])
          } else {
            toast.error(res.content)
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      api
        .post(appConfig.api.shop.product, data)
        .then((res) => {
          if (res.success) {
            toast.success(res.content['message'])
          } else {
            toast.error(res.content)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <div class="card p-4">
        <div class="flex gap-3 align-items-center mb-6">
          <span class="text-900 font-bold text-xl">{{
            productId ? state.productName : $t('Create Product')
          }}</span>
          <Button
            icon="pi pi-arrow-left"
            text
            :label="$t('Back')"
            @click="$router.back()"
          ></Button>
        </div>
        <div class="grid grid-nogutter flex-wrap gap-3 p-fluid">
          <div class="col-12 lg:col-8">
            <div class="grid formgrid">
              <div class="col-12 field mb-5">
                <div class="flex flex-column gap-2">
                  <FloatLabel>
                    <InputText
                      class="w-full"
                      id="productName"
                      v-model="state.productName"
                      :invalid="$v.productName.$error"
                      @blur="$v.productName.$touch"
                    />
                    <label for="productName">{{ $t('Product Name') }}</label>
                  </FloatLabel>
                  <small class="p-error" v-if="$v.productName.$error">{{
                    $t($v.productName.$errors[0]?.$message?.toString())
                  }}</small>
                </div>
              </div>
              <div class="col-12 lg:col-12 field mb-5">
                <div class="flex flex-column gap-2">
                  <FloatLabel>
                    <InputNumber
                      class="w-full"
                      id="price"
                      v-model="state.price"
                      :minFractionDigits="2"
                      mode="currency"
                      currency="VND"
                      locale="vi-VN"
                      :invalid="$v.price.$error"
                      @blur="$v.price.$touch"
                    />
                    <label for="price">{{ $t('Price') }}</label>
                  </FloatLabel>
                  <small class="p-error" v-if="$v.price.$error">{{
                    $t($v.price.$errors[0]?.$message?.toString())
                  }}</small>
                </div>
              </div>
              <div class="col-12 mb-5">
                <Editor
                  v-model="state.description"
                  editorStyle="height: 320px"
                />
              </div>
              <div class="col-12 mb-5">
                <FileUpload
                  name="demo[]"
                  :multiple="true"
                  accept="image/*"
                  :maxFileSize="2000000"
                  :custom-upload="true"
                  :auto="true"
                  choose-icon="pi pi-images"
                  @uploader="onTemplatedUpload"
                >
                  <template #header="{ chooseCallback }">
                    <div class="flex gap-2 w-full">
                      <Button
                        @click="chooseCallback()"
                        icon="pi pi-images"
                        class="w-3rem h-3rem"
                        rounded
                        outlined
                      ></Button>
                      <Button
                        icon="pi pi-times"
                        class="w-3rem h-3rem"
                        rounded
                        outlined
                        severity="danger"
                        :disabled="
                          !state.productImages ||
                          state.productImages.length === 0
                        "
                        @click="removeImages()"
                      ></Button>
                    </div>
                  </template>
                  <template #content>
                    <div v-if="state.productImages.length > 0">
                      <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div
                          v-for="(image, index) in state.productImages"
                          :key="index"
                          class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
                        >
                          <div>
                            <Image
                              role="presentation"
                              :alt="`Image ${index}`"
                              :src="image"
                              width="100"
                              height="50"
                            />
                          </div>
                          <Button
                            icon="pi pi-times p-2 m-1"
                            @click="removeImages(index)"
                            outlined
                            rounded
                            severity="danger"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template #empty>
                    <div
                      v-if="state.productImages.length === 0"
                      class="flex align-items-center justify-content-center flex-column"
                    >
                      <i
                        class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400"
                      />
                      <p class="mt-4 mb-4">
                        {{ $t('Drag and drop files to here to upload.') }}
                      </p>
                    </div>
                  </template>
                </FileUpload>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full lg:w-3 xl:w-4 flex flex-column row-gap-5">
            <div class="border-1 surface-border border-round">
              <span
                class="text-900 font-bold block border-bottom-1 surface-border p-3"
                >{{ $t('Category') }}</span
              >
              <div class="p-3 flex flex-column gap-2">
                <TreeSelect
                  v-model="state.category"
                  :options="dataSourceStore.productCategoryTree"
                  :placeholder="$t('Select a category')"
                  class="w-full"
                  :invalid="$v.category.$error"
                  v-on:update:model-value="console.log(state.category)"
                />
                <small class="p-error" v-if="$v.category.$error">{{
                  $t($v.category.$errors[0]?.$message?.toString())
                }}</small>
              </div>
            </div>
            <div class="border-1 surface-border border-round">
              <span
                class="text-900 font-bold block border-bottom-1 surface-border p-3"
                >{{ $t('Brand') }}</span
              >
              <div class="p-3 flex flex-column gap-2">
                <Dropdown
                  v-model="state.brand"
                  :options="dataSourceStore.productBrands"
                  :placeholder="$t('Select a brand')"
                  filter
                  showClear
                  optionLabel="name"
                  class="w-full"
                  :invalid="$v.brand.$error"
                />
                <small class="p-error" v-if="$v.brand.$error">{{
                  $t($v.brand.$errors[0]?.$message?.toString())
                }}</small>
              </div>
            </div>
            <div class="border-1 surface-border border-round">
              <span
                class="text-900 font-bold block border-bottom-1 surface-border p-3"
                >{{ $t('Stock') }}</span
              >
              <div class="p-3 flex flex-column gap-2">
                <InputNumber
                  v-model="state.stock"
                  inputId="minmax"
                  :min="0"
                  :invalid="$v.stock.$error"
                  @blur="$v.stock.$touch"
                />
                <small class="p-error" v-if="$v.stock.$error">{{
                  $t($v.stock.$errors[0]?.$message?.toString())
                }}</small>
              </div>
            </div>
            <div class="flex justify-content-between gap-3">
              <Button
                icon="pi pi-plus"
                :label="productId ? $t('Update') : $t('Publish')"
                :loading="loading"
                @click="publish"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
