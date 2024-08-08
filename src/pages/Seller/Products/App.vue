<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useProductStore } from 'src/stores/seller/product'
  import { useConfirm } from 'primevue/useconfirm'
  import { useI18n } from 'vue-i18n'
  import { useToastStore } from 'src/stores/toast'
  import { useApi } from 'src/stores/api'
  import { appConfig } from 'src/stores'
  import { ImportResponse } from 'src/stores/types'
  const api = useApi()
  const toast = useToastStore()
  const { t } = useI18n()
  const productStore = useProductStore()
  const confirm = useConfirm()
  onMounted(() => {
    productStore.fetchProducts()
  })

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  const items = ref([
    {
      class: 'p-0',
      items: [
        {
          label: 'Detail',
          icon: 'pi pi-box',
          route: '/shop/products',
        },
        {
          label: 'Start/Stop selling',
          icon: 'pi pi-lock',
          class: 'text-red-500',
          command: () => confirmDeactive(),
        },
      ],
    },
  ])

  const menu = ref()
  const menuId = ref()
  const toggle = (event: any) => {
    menuId.value = event.currentTarget.id.replace('menu_', '')
    menu.value.toggle(event)
  }

  const query = ref()

  const confirmDeactive = () => {
    confirm.require({
      header: t('Confirm'),
      icon: 'pi pi-exclamation-triangle',
      message: t('Are you sure you want to active/deactive this product?'),
      rejectClass: 'p-button-secondary p-button-outlined',
      rejectLabel: t('No'),
      acceptLabel: t('Yes'),
      acceptClass: 'p-button-danger',
      accept: () => {
        productStore.activeOrDeactiveProduct(menuId.value).then((response) => {
          if (response.success) {
            toast.success(response.content['message'])
          } else {
            toast.error(response.content)
          }
        })
      },
    })
  }

  const exportLoading = ref(false)
  const exportProducts = () => {
    exportLoading.value = true
    api
      .getFile(
        appConfig.appendUrl(appConfig.api.shop.exportProducts, {
          shopId: appConfig.loggedUser.shopManaging?.id,
        }),
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.content]))
        const link = document.createElement('a')
        link.href
        link.setAttribute('href', url)
        link.setAttribute('download', 'products.xlsx')
        link.click()
      })
      .finally(() => {
        exportLoading.value = false
      })
  }

  const importLoading = ref(false)
  const importProducts = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx'
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files
      const file = files ? files[0] : null
      if (file) {
        importLoading.value = true
        const formData = new FormData()
        formData.append('file', file)
        formData.append('shopId', appConfig.loggedUser.shopManaging?.id.toString() || '')
        api
          .post(appConfig.api.shop.importProducts, formData)
          .then((response) => {
            if (response.success) {
              importResult.value = response.content
              isShowImportResult.value = true
              productStore.fetchProducts()
            } else {
              toast.error(response.content)
            }
          })
          .finally(() => {
            importLoading.value = false
          })
      }
    }
    input.click()
  }

  const importResult = ref<ImportResponse>()
  const isShowImportResult = ref(false)
</script>
<template>
  <Layout>
    <template #page-content>
      <ConfirmDialog></ConfirmDialog>
      <Menubar class="border-0 m-2 px-3">
        <template #start>
          <h3>{{ $t('Your Products') }}</h3>
        </template>
        <template #end>
          <div class="flex align-items-center gap-2">
            <Button
                icon="pi pi-download"
                aria-label="Download"
                outlined
                v-tooltip.top="$t('Export Products')"
                :loading="exportLoading"
                @click="exportProducts"
              />
              <Button
                icon="pi pi-upload"
                aria-label="Upload"
                outlined
                v-tooltip.top="$t('Import Products')"
                :loading="importLoading"
                @click="importProducts"
              />
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search"> </InputIcon>
              <InputText
                v-model="query"
                :placeholder="$t('Search')"
                type="text"
                class="w-8rem sm:w-auto"
                @change="
                  () => {
                    productStore.fetchProducts(query)
                  }
                "
              />
            </IconField>
            <router-link to="/shop/products/create">
              <Button
                icon="pi pi-plus"
                :label="$t('Add Product')"
                outlined
              ></Button>
            </router-link>
            <Button
              icon="pi pi-refresh"
              rounded
              outlined
              @click="productStore.fetchProducts()"
            />
          </div>
        </template>
      </Menubar>
      <div class="card m-3">
        <DataTable
          :value="productStore.products"
          stripedRows
          showGridlines
          tableStyle="min-width: 50rem"
          removable-sort
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column field="name" :header="$t('Name')" sortable></Column>
          <Column :header="$t('Image')">
            <template #body="slotProps">
              <Image
                v-if="slotProps.data.images.length > 0"
                :src="slotProps.data.images[0].imagePath"
                :alt="`Image ${slotProps.data.id}`"
                height="50"
                preview
              />
            </template>
          </Column>
          <Column
            field="category.name"
            :header="$t('Category')"
            sortable
          ></Column>
          <Column
            field="brand.name"
            :header="$t('Brand')"
            sortable
            v-if="false"
          ></Column>
          <Column field="price" :header="$t('Price')" sortable>
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.price) }}
            </template>
          </Column>
          <Column field="stock" :header="$t('Stock')" sortable></Column>
          <Column field="isActive" :header="$t('Status')" sortable>
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-green-500': data.isActive,
                  'pi-times-circle text-red-400': !data.isActive,
                }"
              ></i>
            </template>
          </Column>
          <Column field="id">
            <template #body="{ data }">
              <Button
                type="button"
                text
                icon="pi pi-ellipsis-v"
                @click="toggle"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                :id="`menu_${data.id}`"
              />
              <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" >
                <template #item="{ item, props }">
                  <router-link
                    v-if="item.route"
                    v-slot="{ href, navigate }"
                    :to="`${item.route}/${menuId}`"
                    custom
                  >
                    <a
                      v-ripple
                      :href="href"
                      v-bind="props.action"
                      @click="navigate"
                    >
                      <span :class="`${item.icon} ${item.class}`" />
                      <span :class="`ml-2 ${item.class}`">{{
                        item.label ? $t(item.label?.toString()) : ''
                      }}</span>
                      <Badge
                        v-if="item.badge"
                        class="ml-auto"
                        :value="item.badge"
                      />
                      <span
                        v-if="item.shortcut"
                        class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
                        >{{ item.shortcut }}
                      </span>
                    </a>
                  </router-link>
                  <a
                    v-else
                    v-ripple
                    class="flex align-items-center"
                    :target="item.target"
                    v-bind="props.action"
                  >
                    <span :class="`${item.icon} ${item.class}`" />
                    <span :class="`ml-2 ${item.class}`">{{
                      item.label ? $t(item.label?.toString()) : ''
                    }}</span>
                    <Badge
                      v-if="item.badge"
                      class="ml-auto"
                      :value="item.badge"
                    />
                    <span
                      v-if="item.shortcut"
                      class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
                      >{{ item.shortcut }}
                    </span>
                  </a>
                </template>
              </Menu>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Layout>
</template>
