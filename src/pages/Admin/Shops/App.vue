<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useShopManageStore } from 'src/stores/admin/shop-manage'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useConfirm } from 'primevue/useconfirm'
  import { useI18n } from 'vue-i18n'
  import { useToastStore } from 'src/stores/toast'
  import ShopsTable from 'src/common/components/ShopsTable.vue'
  const toast = useToastStore()
  const { t } = useI18n()
  const confirm = useConfirm()
  const shopManageStore = useShopManageStore()

  const query = ref(null)
  const selectedKey = ref()

  onMounted(() => {
    shopManageStore.fetchShops()
  })
</script>
<template>
  <Layout>
    <template #page-content>
      <div class="mx-3">
        <Menubar class="border-0 mt-3 px-3">
          <template #start>
            <h4>{{ $t('List of Shops') }}</h4>
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
                  @change="() => {
                    shopManageStore.searchShops(query)
                  }"
                />
              </IconField>
              <Button
                icon="pi pi-refresh"
                rounded
                outlined
                @click="shopManageStore.fetchShops()"
              />
            </div>
          </template>
        </Menubar>
        <div class="card mt-1">
          <ShopsTable :shops="shopManageStore.shops" :show-shop-owner="true"></ShopsTable>
        </div>
      </div>
    </template>
  </Layout>
</template>