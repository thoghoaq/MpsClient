<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useDataSourceStore } from 'src/stores/datasource'
  import { useEProductStore } from 'src/stores/ecommerce/product'
  const dataSourceStore = useDataSourceStore()
  const eProductStore = useEProductStore()

  onMounted(() => {
    dataSourceStore.fetchProductCategories()
  })
  const selectedKey = ref()

  watch(selectedKey, (newVal) => {
    var key = Object.keys(newVal)[0]
    if (key) {
      var node = dataSourceStore.getNodeFromKey(key)
      eProductStore.filter.categoriesId = [node.data.id]
    } else {
      eProductStore.filter.categoriesId = null
    }
    eProductStore.filterProducts()
  })
</script>
<template>
  <div style="min-width: 20rem;">
    <TreeTable
      :value="dataSourceStore.productCategoryTree"
      v-model:selectionKeys="selectedKey"
      selection-mode="single"
      class="overflow-auto border-round"
    >
      <Column
        field="name"
        :header="$t('PARTS & ACCESSORIES')"
        header-class="bg-primary"
        expander
      >
      </Column>
    </TreeTable>
  </div>
</template>
