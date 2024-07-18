<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useShopRequestStore } from 'src/stores/admin/shop-request'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useConfirm } from 'primevue/useconfirm'
  import { useI18n } from 'vue-i18n'
  import { useToastStore } from 'src/stores/toast'
  const toast = useToastStore()
  const { t } = useI18n()
  const confirm = useConfirm()
  const shopRequestStore = useShopRequestStore()
  const confirmDeactive = (id: number, isAccepted: boolean) => {
    confirm.require({
      header: t('Confirm'),
      icon: 'pi pi-exclamation-triangle',
      message: t(`Are you sure you want to ${isAccepted ? 'open' : 'reject'} this shop?`),
      rejectClass: 'p-button-secondary p-button-outlined',
      rejectLabel: t('No'),
      acceptLabel: t('Yes'),
      acceptClass: 'p-button-primary',
      accept: () => {
        shopRequestStore.acceptRequest(id, isAccepted)
        .then((response) => {
          if (response.success) {
            toast.success(response.content["message"])
          } else {
            toast.error(response.content)
          }
        })
      },
    })
  }

  const query = ref(null)
  const selectedKey = ref()

  onMounted(() => {
    shopRequestStore.fetchShops()
  })
</script>
<template>
  <Layout>
    <template #page-content>
      <ConfirmDialog></ConfirmDialog>
      <div class="mx-3">
        <Menubar class="border-0 mt-3 px-3">
          <template #start>
            <h4>{{ $t('List of Shop Request') }}</h4>
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
                @click="shopRequestStore.fetchShops()"
              />
            </div>
          </template>
        </Menubar>
        <div class="card mt-1">
          <DataTable
            v-model:selection="selectedKey"
            data-key="id"
            :value="shopRequestStore.shops"
            :loading="false"
            removableSort
            selectionMode="single"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            :currentPageReportTemplate="`{first} ${$t('to')} {last} ${$t('of')} {totalRecords}`"
          >
            <template #empty> {{ $t('No shop request found.') }} </template>
            <Column field="shopName" sortable :header="$t('Shop Name')">
            </Column>
            <Column
              field="phoneNumber"
              sortable
              :header="$t('Phone Number')"
            ></Column>
            <Column field="address" sortable :header="$t('Address')">
              <template #body="{ data }">
                {{ `${data.address}, ${data.district}, ${data.city}` }}
              </template>
            </Column>
            <Column field="payPalAccount" sortable :header="$t('Paypal')">
            </Column>
            <Column field="createdAt" sortable :header="$t('Created At')">
              <template #body="{ data }">
                {{ DateTimeHelper.format(data.createdAt, 'datetime') }}
              </template>
            </Column>
            <Column field="updatedAt" sortable :header="$t('Updated At')">
              <template #body="{ data }">
                {{ DateTimeHelper.format(data.updatedAt, 'datetime') }}
              </template>
            </Column>
            <Column field="isActive" sortable :header="$t('Status')">
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
            <Column field="id" :header="$t('Action')">
              <template #body="{ data }">
                <div class="flex gap-2">
                  <Button v-if="!data.isActive"
                    type="button"
                    :label="$t('Open')"
                    outlined
                    @click="confirmDeactive(data.id, true)"
                  />
                  <Button v-if="data.isAccepted"
                    type="button"
                    :label="$t('Reject')"
                    severity="danger"
                    outlined
                    @click="confirmDeactive(data.id, false)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </template>
  </Layout>
</template>
