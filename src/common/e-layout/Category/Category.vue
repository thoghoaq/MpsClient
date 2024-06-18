<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useDataSourceStore } from 'src/stores/datasource'
  const dataSourceStore = useDataSourceStore()

  onMounted(() => {
    dataSourceStore.fetchProductCategories()
  })
  const selectedKey = ref()
</script>
<template>
  <TreeTable
  :value="dataSourceStore.productCategoryTree"
    v-model:selectionKeys="selectedKey"
    selection-mode="single"
    class="w-16rem overflow-auto border-round my-3 ml-3"
  >
    <Column
      field="name"
      :header="$t('PARTS & ACCESSORIES')"
      header-class="bg-primary"
      expander
    ></Column>
  </TreeTable>
</template>
