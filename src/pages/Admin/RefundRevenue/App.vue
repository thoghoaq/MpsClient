<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { usePayoutStore } from 'src/stores/admin/shop'
  import NumberHelper from 'src/helpers/number-helper'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  import { useToastStore } from 'src/stores/toast'
  import StringHelper from 'src/helpers/string-helper'
  import { PayoutDate } from 'src/stores/admin/shop/types'
  import { useI18n } from 'vue-i18n'
  import { useApi } from 'src/stores/api'
  import { appConfig } from 'src/stores'
  const api = useApi()
  const { t } = useI18n()
  const toast = useToastStore()
  const payoutStore = usePayoutStore()
  const now = new Date()
  const payoutDate = ref(PayoutDate.day8)
  const query = ref()
  const month = ref(now)
  const selectedRow = ref()
  const expandedRows = ref({})
  const loading = ref(false)
  const filteredShops = ref()

  const initPayoutDate = () => {
    const date = now.getDate()
    if (date <= 7) {
      payoutDate.value = PayoutDate.day8
    } else if (date <= 14) {
      payoutDate.value = PayoutDate.day15
    } else if (date <= 21) {
      payoutDate.value = PayoutDate.day22
    } else {
      payoutDate.value = PayoutDate.day1
    }
  }

  onMounted(() => {
    initPayoutDate()
    payoutStore.fetchShops(now, payoutDate.value).then(() => {
      filteredShops.value = payoutStore.shops
    })
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
    loading.value = true
    payoutStore
      .requestMonthlyPayout(month.value, payoutDate.value)
      .then((response) => {
        if (response.success) {
          toast.success(response.content['message'])
        } else {
          toast.error(response.content)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const acceptPayout = (payoutId: number) => {
    loading.value = true
    payoutStore
      .acceptPayout(payoutId, month.value, payoutDate.value)
      .then((response) => {
        if (response.success) {
          toast.success(response.content['message'])
        } else {
          toast.error(response.content)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  watch(query, (value) => {
    if (value) {
      payoutStore.shops = filteredShops.value.filter((shop: any) => {
        return StringHelper.searchIgnoreCase(shop.shopName, value)
      })
    } else {
      payoutStore.shops = filteredShops.value
    }
  })

  const payoutOptions = ref([
    { label: '01 - 07', value: PayoutDate.day8 },
    { label: '08 - 14', value: PayoutDate.day15 },
    { label: '15 - 21', value: PayoutDate.day22 },
    { label: t('22 - End'), value: PayoutDate.day1 },
  ])

  const getPayoutLabel = (value: PayoutDate, month: Date) => {
    var monthNumber = month.getMonth() + 1
    var lastDayofLastMonth = DateTimeHelper.getLastDayOfMonth(month)
    switch (value) {
      case PayoutDate.day8:
        return `1/${monthNumber} - 7/${monthNumber}`
      case PayoutDate.day15:
        return `8/${monthNumber} - 14/${monthNumber}`
      case PayoutDate.day22:
        return `15/${monthNumber} - 21/${monthNumber}`
      case PayoutDate.day1:
        return `22/${monthNumber} - ${lastDayofLastMonth.getDate()}/${monthNumber}`
      default:
        return ''
    }
  }

  const viewOrdersVisible = ref(false)

  const showOrders = (shopId: number) => {
    return getOrdersInPayoutDate(shopId)
  }

  const orders = ref([])

  const getOrdersInPayoutDate = (shopId: number) => {
    return api
      .get(
        appConfig.appendUrl(appConfig.api.shop.ordersInPayoutDate, {
          shopId,
          monthToDate: month.value.toISOString(),
          payoutDate: payoutDate.value,
        }),
      )
      .then((response) => {
        if (response.success) {
          orders.value = response.content
          viewOrdersVisible.value = true
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
        :loading="loading"
        removable-sort
      >
        <template #header>
          <Menubar class="border-0">
            <template #start>
              <div
                class="grid grid-nogutter align-items-center gap-2"
                style="width: 50rem"
              >
                <div class="col flex flex-column gap-2">
                  <div class="font-bold">
                    {{
                      `${$t('Expect Next Paid')}: ${NumberHelper.formatCurrency(payoutStore.totalExpectPayout)}`
                    }}
                  </div>
                  <div class="font-bold">
                    {{
                      `${$t('Total Paid')}: ${NumberHelper.formatCurrency(payoutStore.totalPaidout)}`
                    }}
                  </div>
                </div>
                <div class="col flex flex-column gap-2">
                  <div class="font-bold">
                    {{
                      `${$t('Total Revenue')}: ${NumberHelper.formatCurrency(payoutStore.totalRevenue)}`
                    }}
                  </div>
                  <div class="font-bold">
                    {{
                      `${$t('Expect Platform Earned')}: ${NumberHelper.formatCurrency(payoutStore.totalRevenue - payoutStore.totalExpectPayout - payoutStore.totalPaidout)}`
                    }}
                  </div>
                  <div class="font-bold">
                    {{
                      `${$t('Total Platform Earned')}: ${NumberHelper.formatCurrency(payoutStore.totalRevenue - payoutStore.totalPaidout)}`
                    }}
                  </div>
                </div>
              </div>
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
                      payoutStore.fetchShops(month, payoutDate)
                    }
                  "
                >
                </Calendar>
                <Dropdown
                  v-model="payoutDate"
                  :options="payoutOptions"
                  option-label="label"
                  option-value="value"
                  class="mx-3"
                  :placeholder="$t('Payout Date')"
                  @update:model-value="
                    () => {
                      payoutStore.fetchShops(month, payoutDate)
                    }
                  "
                >
                </Dropdown>
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
                <Button
                  icon="pi pi-refresh"
                  rounded
                  outlined
                  @click="
                    () =>
                      payoutStore.fetchShops(now, payoutDate).then(() => {
                        filteredShops.value = payoutStore.shops
                      })
                  "
                />
              </div>
            </template>
          </Menubar>
        </template>
        <Column expander class="w-3rem" />
        <Column field="shopName" :header="$t('Shop Name')" sortable></Column>
        <Column field="phoneNumber" :header="$t('Phone Number')" sortable>
        </Column>
        <Column field="address" :header="$t('Address')" sortable>
          <template #body="slotProps">
            <span>{{
              `${slotProps.data.address}, ${slotProps.data.district}, ${slotProps.data.city}`
            }}</span>
          </template>
        </Column>
        <Column field="payPalAccount" header="Paypal" sortable></Column>
        <Column field="isActive" :header="$t('Status')" sortable>
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
        <Column field="revenue" :header="$t('Revenue')" sortable>
          <template #body="{ data }">
            <span>{{ NumberHelper.formatCurrency(data.revenue ?? 0) }}</span>
          </template>
        </Column>
        <Column field="expectPayout" :header="$t('Expect Payout')" sortable>
          <template #body="{ data }">
            <span>{{
              NumberHelper.formatCurrency(data.expectPayout ?? 0)
            }}</span>
          </template>
        </Column>
        <Column field="totalPayout" :header="$t('Paidout')" sortable>
          <template #body="{ data }">
            <span>{{ NumberHelper.formatCurrency(data.totalPayout) }}</span>
          </template>
        </Column>
        <Column field="isCurrentMonthPaid" :header="$t('Paid')" sortable>
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
        <Column field="id">
          <template #body="{ data }">
            <Button
              outlined
              :label="$t('View Orders')"
              @click="showOrders(data.id)"
            ></Button>
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
              <Column field="payoutDate" :header="$t('Order Payout Date')">
                <template #body="{ data }">
                  <span>{{
                    getPayoutLabel(data.payoutDate, new Date(data.monthToDate))
                  }}</span>
                </template>
              </Column>
              <Column
                field="ExpectAmount"
                :header="$t('Expect Payout')"
                sortable
              >
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
      <Dialog v-model:visible="viewOrdersVisible" modal :header="$t('Orders')">
        <DataTable :value="orders">
          <Column field="id" :header="$t('Order ID')" sortable></Column>
          <Column field="orderDate" :header="$t('Order Date')" sortable>
            <template #body="{ data }">
              <span>{{
                DateTimeHelper.format(data.orderDate, 'datetime')
              }}</span>
            </template>
          </Column>
          <Column field="totalAmount" :header="$t('Total')" sortable>
            <template #body="{ data }">
              <span>{{ NumberHelper.formatCurrency(data.totalAmount) }}</span>
            </template>
          </Column>
        </DataTable>
      </Dialog>
    </template>
  </Layout>
</template>
