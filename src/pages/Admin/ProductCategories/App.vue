<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useDataSourceStore } from 'src/stores/datasource'
  import { useToastStore } from 'src/stores/toast'
  import { useI18n } from 'vue-i18n'
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
</script>
<template>
  <Layout>
    <template #page-content>
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
                </div>
              </template>
            </Menubar>
          </template>
          <Column expander field="name" sortable class="flex align-items-center">
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
                  <span :class="(node.key.match(/-/g) || []).length < 1 ? 'font-semibold' : ''">{{ node.data.name }}</span>
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
            </template>
          </Column>
        </TreeTable>
      </div>
    </template>
  </Layout>
</template>
src/stores/datasource