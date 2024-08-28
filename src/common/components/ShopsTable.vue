<script setup lang="ts">
  import { ref, PropType } from 'vue'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { Shop } from 'src/stores/admin/shop-manage/types'
  import { appConfig } from 'src/stores'
  const selectedKey = ref()

  const props = defineProps({
    shops: {
      type: Array as PropType<Shop[]>,
      required: true,
    },
    showShopOwner: {
      type: Boolean,
      default: false,
    },
  })
</script>
<template>
  <DataTable
    v-model:selection="selectedKey"
    data-key="id"
    :value="props.shops"
    :loading="false"
    removableSort
    selectionMode="single"
    paginator
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 50rem"
    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    :currentPageReportTemplate="`{first} ${$t('to')} {last} ${$t('of')} {totalRecords}`"
  >
    <template #empty> {{ $t('No shop found.') }} </template>
    <Column field="shopName" sortable :header="$t('Shop Name')"> </Column>
    <Column
      field="shopOwner.user.fullName"
      sortable
      :header="$t('Shop Owner')"
      v-if="$props.showShopOwner"
    >
      <template #body="{ data }">
        {{ data.shopOwner.user.fullName }}
      </template>
    </Column>
    <Column field="phoneNumber" sortable :header="$t('Phone Number')"></Column>
    <Column field="address" sortable :header="$t('Address')">
      <template #body="{ data }">
        {{ `${data.address}, ${data.district}, ${data.city}` }}
      </template>
    </Column>
    <Column field="payPalAccount" sortable :header="$t('Paypal')"> </Column>
    <Column field="businessLicenseImage" :header="$t('Business License')">
      <template #body="slotProps">
        <Image
          v-if="slotProps.data.businessLicenseImage"
          :src="slotProps.data.businessLicenseImage"
          :alt="`BusinessLicenseImage ${slotProps.data.id}`"
          height="50"
          preview
        />
      </template>
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
    <Column :header="$t('Action')" field="id" v-if="appConfig.loggedUser.isAdminGroup">
      <template #body="{ data }">
        <router-link
          :to="{
            path: `/admin/shop-setting/${data.id}`,
            query: data,
          }"
        >
          <Button icon="pi pi-cog" text />
        </router-link>
      </template>
    </Column>
  </DataTable>
</template>
