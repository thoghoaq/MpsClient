<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { usePayoutStore } from 'src/stores/admin/shop'
  import NumberHelper from 'src/helpers/number-helper'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useToastStore } from 'src/stores/toast'
  import { Payout } from 'src/stores/admin/shop/types'
  const toast = useToastStore()
  const payoutStore = usePayoutStore()
  const now = new Date()
  const query = ref()
  const month = ref(now)
  const selectedRow = ref()
  const expandedRows = ref({})

  onMounted(() => {
    payoutStore.fetchShops(now)
  })

  const getStatusDisplay = (status: number) => {
    switch (status) {
      case 1:
        return {
          label: 'Pending',
          severity: 'warning',
        }
      case 2:
        return {
          label: 'Paid',
          severity: 'success',
        }
      case 3:
        return {
          label: 'Failed',
          severity: 'danger',
        }
      default:
        return {
          label: 'Unknown',
          severity: 'gray',
        }
    }
  }

  const requestAllPayout = () => {
    payoutStore.requestMonthlyPayout(month.value).then((response) => {
      if (response.success) {
        toast.success(response.content['message'])
      } else {
        toast.error(response.content)
      }
    })
  }

  const acceptPayout = (payoutId: number) => {
    payoutStore.acceptPayout(payoutId, month.value).then((response) => {
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
      <DataTable
        :value="payoutStore.shops"
        class="mx-4"
        selection-mode="single"
        v-model:selection="selectedRow"
        v-model:expandedRows="expandedRows"
        dataKey="id"
      >
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
                  @update:model-value="
                    () => {
                      month.setDate(month.getDate() + 1)
                      payoutStore.fetchShops(month)
                    }
                  "
                >
                </Calendar>
                <Button
                  outlined
                  :label="$t('Create Request')"
                  @click="requestAllPayout"
                ></Button>
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
        <Column expander class="w-3rem" />
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
        <Column field="expectPayout" :header="$t('Expect Payout')">
          <template #body="{ data }">
            <span>{{
              NumberHelper.formatCurrency(data.expectPayout ?? 0)
            }}</span>
          </template>
        </Column>
        <Column field="totalPayout" :header="$t('Paidout')">
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
        <template #expansion="slotProps">
          <div>
            <h4>{{ $t('Payout History') }}</h4>
            <DataTable :value="slotProps.data.payouts">
              <Column field="monthToDate" :header="$t('Month')" sortable>
                <template #body="{ data }">
                  <span>{{
                    DateTimeHelper.format(data.monthToDate, 'month')
                  }}</span>
                </template>
              </Column>
              <Column field="ExpectAmount" :header="$t('Expect Payout')" sortable>
                <template #body="{ data }">
                  <span>{{
                    NumberHelper.formatCurrency(data.expectAmount ?? 0)
                  }}</span>
                </template>
              </Column>
              <Column field="amount" :header="$t('Paidout')" sortable>
                <template #body="{ data }">
                  <span>{{
                    NumberHelper.formatCurrency(data.amount ?? 0)
                  }}</span>
                </template>
              </Column>
              <Column field="currency" :header="$t('Currency')" sortable>
              </Column>
              <Column field="batchId" :header="$t('Batch')" sortable> </Column>
              <Column field="payoutStatusId" :header="$t('Status')" sortable>
                <template #body="{ data }">
                  <Tag
                    :value="$t(getStatusDisplay(data.payoutStatusId).label)"
                    :severity="getStatusDisplay(data.payoutStatusId).severity"
                  >
                  </Tag>
                </template>
              </Column>
              <Column field="createdDate" :header="$t('Created At')" sortable>
                <template #body="{ data }">
                  <span>{{
                    DateTimeHelper.format(data.createdDate, 'datetime')
                  }}</span>
                </template>
              </Column>
              <Column field="updatedDate" :header="$t('Execute At')" sortable>
                <template #body="{ data }">
                  <span>{{
                    DateTimeHelper.format(data.updatedDate, 'datetime')
                  }}</span>
                </template>
              </Column>
              <Column field="id" :header="$t('Action')">
                <template #body="{ data }">
                  <Button
                    v-if="data.payoutStatusId != 2"
                    outlined
                    :label="$t('Payout')"
                    @click="acceptPayout(data.id)"
                  ></Button>
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </template>
  </Layout>
</template>
