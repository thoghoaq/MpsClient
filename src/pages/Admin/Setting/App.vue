<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useSystemSettingStore } from 'src/stores/admin/setting'
  import { useToastStore } from 'src/stores/toast'
  const toast = useToastStore()
  const systemSettingStore = useSystemSettingStore()
  onMounted(() => {
    systemSettingStore.loadSettings()
  })
  const saveSetting = () => {
    systemSettingStore.saveSettings().then((response) => {
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
        <DataTable :value="systemSettingStore.settings" row-hover>
          <template #header>
            <div class="flex justify-content-between align-items-center gap-3">
              <h3>{{ $t('System Settings') }}</h3>
              <div>
                <Button
                  :label="$t('Save')"
                  class="w-8rem"
                  @click="saveSetting"
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
