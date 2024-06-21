<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useProductStore } from 'src/stores/seller/product'
  const productStore = useProductStore()
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
          route: '/shop/products'
        },
        {
          label: 'Deactivate',
          icon: 'pi pi-lock',
          class: 'text-red-500'
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
</script>
<template>
  <Layout>
    <template #page-content>
      <Menubar class="border-0 m-2 px-3">
        <template #start>
          <h3>{{ $t('Your Products') }}</h3>
        </template>
        <template #end>
          <div class="flex align-items-center gap-2">
            <router-link to="/shop/products/create">
              <Button
                icon="pi pi-plus"
                :label="$t('Add Product')"
                outlined
              ></Button>
            </router-link>
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
          paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column
            field="productCode"
            :header="$t('Product Code')"
            class="w-12rem"
            sortable
          ></Column>
          <Column
            field="productSKU"
            :header="$t('Product SKU')"
            class="w-20rem"
            sortable
          ></Column>
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
          <Column field="category.name" :header="$t('Category')" sortable></Column>
          <Column field="brand.name" :header="$t('Brand')" sortable></Column>
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
              <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
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
