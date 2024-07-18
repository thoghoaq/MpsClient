<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useDataSourceStore } from 'src/stores/datasource'
  import { useToastStore } from 'src/stores/toast'
  import { useI18n } from 'vue-i18n'
  import { useConfirm } from 'primevue/useconfirm'

  const confirm = useConfirm()
  const dataSourceStore = useDataSourceStore()
  const toast = useToastStore()
  const { t } = useI18n()

  onMounted(() => {
    dataSourceStore.fetchProductCategories()
  })

  const query = ref()

  const updateProductCategory = function (data: any) {
    dataSourceStore.saveProductCategory(data).then((response) => {
      if (response.success) {
        toast.success(t('Update successfully'))
      } else {
        toast.error(t('Update failed'))
      }
    })
  }
  const selectedKey = ref()

  const expandedKeys = ref<any>({})
  const toggleExpand = (key: string) => {
    let _expandedKeys = { ...expandedKeys.value }
    _expandedKeys[key] = true
    expandedKeys.value = _expandedKeys
  }

  watch(query, (value) => {
    dataSourceStore.searchProductCategories(value)
  })

  const confirmDelete = (event: any, id: number | null, node?: any) => {
    confirm.require({
      target: event.currentTarget,
      message: t('Are you sure you want to delete this category?'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('Yes'),
      rejectLabel: t('No'),
      acceptClass: 'p-button-danger',
      rejectClass: 'p-button-text',
      accept: () => {
        if (id == null && node != null) {
          dataSourceStore.removeChildFromTree(node)
          return
        }
        dataSourceStore.deleteProductCategory(id!).then((response) => {
          if (response.success) {
            toast.success(response.content['message'])
          } else {
            toast.error(response.content)
          }
        })
      },
    })
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <ConfirmPopup></ConfirmPopup>
      <div class="mx-3">
        <TreeTable
          v-model:selectionKeys="selectedKey"
          v-model:expandedKeys="expandedKeys"
          selection-mode="single"
          :value="dataSourceStore.productCategoryTree"
          :resizableColumns="true"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 25]"
          :tableProps="{ style: { minWidth: '50rem' } }"
          removableSort
        >
          <template #header>
            <Menubar class="border-0">
              <template #start>
                <h4>{{ $t('List of Product Categories') }}</h4>
              </template>
              <template #end>
                <div class="flex align-items-center gap-2">
                  <IconField iconPosition="left">
                    <InputIcon class="pi pi-search"> </InputIcon>
                    <InputText
                      v-model="query"
                      :placeholder="$t('Search')"
                      type="text"
                      class="w-8rem sm:w-auto"
                    />
                  </IconField>
                  <Button
                    icon="pi pi-refresh"
                    rounded
                    outlined
                    @click="dataSourceStore.fetchProductCategories()"
                  />
                </div>
              </template>
            </Menubar>
          </template>
          <Column
            expander
            field="name"
            sortable
            class="flex align-items-center"
          >
            <template #header>
              <span class="ml-6">{{ $t('Name') }}</span>
            </template>
            <template #body="{ node }">
              <Inplace
                :closable="true"
                close-icon="pi pi-check"
                @close="updateProductCategory(node.data)"
              >
                <template #display>
                  <span
                    :class="
                      (node.key.match(/-/g) || []).length < 1
                        ? 'font-semibold'
                        : ''
                    "
                    >{{ node.data.name }}</span
                  >
                </template>
                <template #content>
                  <InputText v-model="node.data.name" autofocus />
                </template>
              </Inplace>
            </template>
          </Column>
          <Column class="w-5rem">
            <template #header>
              <Button
                icon="pi pi-plus"
                class="w-1rem h-1rem"
                link
                rounded
                @click="
                  dataSourceStore.appendChildToTree(
                    `${dataSourceStore.productCategoryTree.length}`,
                    {
                      key: `${dataSourceStore.productCategoryTree.length}`,
                      data: {
                        id: null,
                        name: $t('New Category'),
                        parentId: null,
                      },
                      children: [],
                    },
                    true,
                  )
                "
              ></Button>
            </template>
            <template #body="{ node }">
              <div class="flex gap-3 justify-content-end">
                <Button
                  v-if="(node.key.match(/-/g) || []).length < 2 && node.data.id"
                  icon="pi pi-plus"
                  class="w-1rem h-1rem"
                  link
                  rounded
                  @click="
                    () => {
                      dataSourceStore.appendChildToTree(node.key, {
                        key: `${node.key}-${node.children.length}`,
                        data: {
                          id: null,
                          name: $t('New Category'),
                          parentId: node.data.id,
                          children: [],
                        },
                      })
                      toggleExpand(node.key)
                    }
                  "
                ></Button>
                <Button
                  icon="pi pi-times text-red-500"
                  class="w-1rem h-1rem"
                  link
                  rounded
                  @click="confirmDelete($event, node.data.id, node)"
                ></Button>
              </div>
            </template>
          </Column>
        </TreeTable>
      </div>
    </template>
  </Layout>
</template>
src/stores/datasource
