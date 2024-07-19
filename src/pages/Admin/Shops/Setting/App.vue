<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useSystemSettingStore } from 'src/stores/admin/setting'
  import { useToastStore } from 'src/stores/toast'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const toast = useToastStore()
  const systemSettingStore = useSystemSettingStore()
  const shopId = route.params.id as string

  onMounted(() => {
    systemSettingStore.loadShopSettings(shopId)
  })
  const saveSetting = () => {
    systemSettingStore.saveShopSettings(shopId).then((response) => {
      if (response.success) {
        toast.success(response.content['message'])
      } else {
        toast.error(response.content)
      }
    })
  }
</script>
<template>
  <Layout>
    <template #page-content>
      <div class="m-3">
        <DataTable :value="systemSettingStore.shopSettings" row-hover>
          <template #header>
            <div class="flex justify-content-between align-items-center gap-3 pb-3">
              <div class="flex align-items-center">
                <Button icon="pi pi-arrow-left" text @click="$router.back()"></Button>
                <div class="text-lg font-bold">{{ `${$route.query.shopName}` }}</div>
              </div>
              <div class="flex gap-3">
                <Button
                  :label="$t('Save')"
                  class="w-8rem"
                  @click="saveSetting"
                ></Button>
                <Button
                  :label="$t('Reset to default')"
                  outlined
                  @click="systemSettingStore.refreshShopSettings(shopId).then((res) => {
                    if (res.success) {
                      toast.success(res.content['message'])
                    } else {
                      toast.error(res.content)
                    }
                  })"
                ></Button>
              </div>
            </div>
          </template>
          <Column field="key" header="Key"></Column>
          <Column field="value" header="Value">
            <template #body="slotProps">
              <Inplace :closable="true">
                <template #display>
                  {{ slotProps.data.value || $t('Click to Edit') }}
                </template>
                <template #content>
                  <InputText v-model="slotProps.data.value" autofocus />
                </template>
              </Inplace>
            </template>
          </Column>
          <Column field="description" :header="$t('Description')">
            <template #body="slotProps">
              <Inplace :closable="true">
                <template #display>
                  {{ slotProps.data.description || $t('Click to Edit') }}
                </template>
                <template #content>
                  <InputText v-model="slotProps.data.description" autofocus />
                </template>
              </Inplace>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Layout>
</template>
