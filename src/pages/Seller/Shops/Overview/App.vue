<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { useOverviewStore } from 'src/stores/seller/shop-overview'
  import NumberHelper from 'src/helpers/number-helper'
  import RevenueChart from './RevenueChart/RevenueChart.vue'
  import CategoryChart from './CategoryChart/CategoryChart.vue'
  import DateTimeHelper from 'src/helpers/datetime-helper'
  const overviewStore = useOverviewStore()
  const routes = useRoute()
  const shopId = routes.params.id as string
  const selectedTime = ref(new Date())

  onMounted(() => {
    if (shopId) {
      const now = new Date()
      overviewStore.fetchOverview(shopId, now)
    }
  })

  const displayPercent = (value: number) => {
    if (value <= 0) {
      return {
        class: 'text-red-500',
        display: (value * 100).toFixed(0) + '%',
        up: false,
      }
    }
    return {
      class: 'text-green-500',
      display: (value * 100).toFixed(0) + '%',
      up: true,
    }
  }

  const getStatusDisplay = (status: number) => {
    switch (status) {
      case 1:
        return {
          label: 'Pending',
          severity: 'warn',
        }
      case 2:
        return {
          label: 'Processing',
          severity: 'warn',
        }
      case 3:
        return {
          label: 'Delivered',
          severity: 'info',
        }
      case 4:
        return {
          label: 'Cancelled',
          severity: 'danger',
        }
      case 5:
        return {
          label: 'Returned',
          severity: 'warn',
        }
      case 6:
        return {
          label: 'Refunded',
          severity: 'success',
        }
      case 7:
        return {
          label: 'Completed',
          severity: 'success',
        }
      default:
        return {
          label: 'Unknown',
          severity: 'gray',
        }
    }
  }
</script>
<template>
  <Layout :hideBackground="true">
    <template #page-content>
      <div class="grid">
        <div class="col-12 md:col-6 xl:col-4">
          <div class="card h-full bg-primary-reverse p-5 border-round">
            <span class="font-semibold text-lg">{{ $t('Sales') }}</span>
            <div class="flex justify-content-between align-items-start mt-3">
              <div class="w-6rem">
                <span class="text-4xl font-bold text-900">{{
                  overviewStore.shopInfo?.overview?.totalSales
                }}</span>
                <div
                  class="mt-2"
                  :class="
                    displayPercent(
                      overviewStore.shopInfo?.overview
                        ?.salePercentageWithLastMonth,
                    ).class
                  "
                >
                  <span class="font-medium">{{
                    displayPercent(
                      overviewStore.shopInfo?.overview
                        ?.salePercentageWithLastMonth,
                    ).display
                  }}</span
                  ><i
                    class="pi text-xs ml-2"
                    :class="
                      displayPercent(
                        overviewStore.shopInfo?.overview
                          ?.salePercentageWithLastMonth,
                      ).up
                        ? 'pi-arrow-up'
                        : 'pi-arrow-down'
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 md:col-6 xl:col-4">
          <div class="card h-full bg-primary-reverse p-5 border-round">
            <span class="font-semibold text-lg">{{ $t('Revenue') }}</span>
            <div class="flex justify-content-between align-items-start mt-3">
              <div class="w-6rem">
                <span class="text-4xl font-bold text-900">{{
                  NumberHelper.formatCurrency(
                    overviewStore.shopInfo?.overview?.totalRevenue,
                  )
                }}</span>
                <div
                  class="mt-2"
                  :class="
                    displayPercent(
                      overviewStore.shopInfo?.overview
                        ?.revenuePercentageWithLastMonth,
                    ).class
                  "
                >
                  <span class="font-medium">{{
                    displayPercent(
                      overviewStore.shopInfo?.overview
                        ?.revenuePercentageWithLastMonth,
                    ).display
                  }}</span
                  ><i
                    class="pi text-xs ml-2"
                    :class="
                      displayPercent(
                        overviewStore.shopInfo?.overview
                          ?.revenuePercentageWithLastMonth,
                      ).up
                        ? 'pi-arrow-up'
                        : 'pi-arrow-down'
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 md:col-6 xl:col-4">
          <div class="card h-full bg-primary-reverse p-5 border-round">
            <span class="font-semibold text-lg">{{ $t('Customers') }}</span>
            <div class="flex justify-content-between align-items-start mt-3">
              <div class="w-6rem">
                <span class="text-4xl font-bold text-900">{{
                  overviewStore.shopInfo?.overview?.totalCustomers
                }}</span>
                <div
                  class="mt-2"
                  :class="
                    displayPercent(
                      overviewStore.shopInfo?.overview
                        ?.customerPercentageWithLastMonth,
                    ).class
                  "
                >
                  <span class="font-medium">{{
                    displayPercent(
                      overviewStore.shopInfo?.overview
                        ?.customerPercentageWithLastMonth,
                    ).display
                  }}</span
                  ><i
                    class="pi text-xs ml-2"
                    :class="
                      displayPercent(
                        overviewStore.shopInfo?.overview
                          ?.customerPercentageWithLastMonth,
                      ).up
                        ? 'pi-arrow-up'
                        : 'pi-arrow-down'
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 xl:col-8">
          <div class="card h-full bg-primary-reverse p-5 border-round">
            <div class="flex align-items-start justify-content-between mb-6">
              <span class="text-900 text-xl font-semibold">{{
                $t('Revenue Overview')
              }}</span>
              <Calendar
                v-model="selectedTime"
                view="month"
                dateFormat="mm/yy"
                inputId="month"
                input-class="w-8rem"
                panel-class="w-20rem"
                @update:model-value="
                  () => {
                    selectedTime.setDate(selectedTime.getDate() + 1)
                    overviewStore.fetchOverview(shopId, selectedTime)
                  }
                "
              >
              </Calendar>
            </div>
            <RevenueChart
              :dailyRevenues="overviewStore.shopInfo?.dailyRevenues"
              ref="revenueChart"
            ></RevenueChart>
          </div>
        </div>
        <div class="col-12 xl:col-4">
          <div class="card h-full bg-primary-reverse p-5 border-round">
            <div class="text-900 text-xl font-semibold mb-6">
              {{ $t('Sales by Category') }}
            </div>
            <CategoryChart
              :productSoldByCategories="
                overviewStore.shopInfo?.productSoldByCategories
              "
            ></CategoryChart>
          </div>
        </div>
        <div class="col-12 xl:col-7">
          <div class="card h-full bg-primary-reverse p-5 border-round">
            <div class="text-900 text-xl font-semibold mb-6">
              {{ $t('Recent Orders') }}
            </div>
            <DataTable
              v-if="overviewStore.shopInfo?.recentOrders?.length > 0"
              :value="overviewStore.shopInfo?.recentOrders"
              removable-sort
              :paginator="true"
              :rows="5"
              :rowsPerPageOptions="[5, 10, 20, 50]"
            >
              <Column field="orderId" :header="$t('Number')" sortable></Column>
              <Column field="orderDate" :header="$t('Order Date')" sortable>
                <template #body="slotProps">
                  {{
                    DateTimeHelper.format(slotProps.data.orderDate, 'datetime')
                  }}
                </template>
              </Column>
              <Column field="total" :header="$t('Total')" sortable>
                <template #body="slotProps">
                  {{ NumberHelper.formatCurrency(slotProps.data.total) }}
                </template>
              </Column>
              <Column field="orderStatus" :header="$t('Status')" sortable>
                <template #body="slotProps">
                  <Tag
                    :severity="
                      getStatusDisplay(slotProps.data.orderStatus).severity
                    "
                    :value="
                      $t(getStatusDisplay(slotProps.data.orderStatus).label)
                    "
                  ></Tag>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <div class="col-12 xl:col-5">
          <div class="card h-full bg-primary-reverse p-5 border-round">
            <div class="text-900 text-xl font-semibold mb-6">
              {{ $t('Top Products') }}
            </div>
            <div class="flex flex-column gap-2">
              <div
                v-for="product in overviewStore.shopInfo?.topProducts"
                class="flex justify-content-between align-items-center"
              >
                <div class="flex align-items-center">
                  <img
                    :src="
                      product.productImage ?? 'https://via.placeholder.com/150'
                    "
                    alt="product"
                    class="w-5rem h-5rem object-cover rounded-lg"
                    style="object-fit: cover"
                  />
                  <div class="ml-3">
                    <span class="text-900 font-semibold">{{
                      product.productName
                    }}</span>
                  </div>
                </div>
                <div class="text-900 font-semibold">
                  {{ `${$t('Sold')} ${product.soldCount}` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
