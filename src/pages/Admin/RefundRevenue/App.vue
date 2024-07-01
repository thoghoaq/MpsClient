<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { usePayoutStore } from 'src/stores/admin/shop'
  import NumberHelper from 'src/helpers/number-helper';
  const payoutStore = usePayoutStore()
  const now = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth()))
  const query = ref()
  const month = ref(now)

  onMounted(() => {
    payoutStore.fetchShops(now)
  })

</script>
<template>
  <Layout>
    <template #page-content>
      <DataTable :value="payoutStore.shops" class="mx-4">
        <template #header>
          <Menubar class="border-0">
            <template #start>
              <h4>{{ $t('Revenue') }}</h4>
            </template>
            <template #end>
              <div class="flex align-items-center gap-2">
                <Calendar
                  v-model="month"
                  view="month"
                  dateFormat="mm/yy"
                  inputId="month"
                  input-class="w-8rem"
                  panel-class="w-20rem"
                  @update:model-value="payoutStore.fetchShops(month)"
                >
                </Calendar>
                <Button outlined :label="$t('Create Request')"></Button>
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
        <Column field="shopName" :header="$t('Shop Name')"> </Column>
        <Column field="phoneNumber" :header="$t('Phone Number')"> </Column>
        <Column field="address" :header="$t('Address')">
          <template #body="slotProps">
            <span>{{
              `${slotProps.data.address}, ${slotProps.data.district}, ${slotProps.data.city}`
            }}</span>
          </template>
        </Column>
        <Column field="payPalAccount" header="Paypal"></Column>
        <Column field="isActive" :header="$t('Status')">
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
        <Column field="revenue" :header="$t('Revenue')">
          <template #body="{ data }">
            <span>{{ NumberHelper.formatCurrency(data.revenue ?? 0) }}</span>
          </template>
        </Column>
        <Column field="totalPayout" :header="$t('Payout')">
          <template #body="{ data }">
            <span>{{ NumberHelper.formatCurrency(data.totalPayout) }}</span>
          </template>
        </Column>
        <Column field="isCurrentMonthPaid" :header="$t('Paid')">
          <template #body="{ data }">
            <i
              class="pi"
              :class="{
                'pi-check-circle text-green-500': data.isCurrentMonthPaid,
                'pi-times-circle text-red-400': !data.isCurrentMonthPaid,
              }"
            ></i>
          </template>
        </Column>
      </DataTable>
    </template>
  </Layout>
</template>
