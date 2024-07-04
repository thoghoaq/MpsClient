<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { useOverviewStore } from 'src/stores/seller/shop-overview'
  import NumberHelper from 'src/helpers/number-helper'
  import RevenueChart from './RevenueChart/RevenueChart.vue'
  import CategoryChart from './CategoryChart/CategoryChart.vue'
  const overviewStore = useOverviewStore()
  const routes = useRoute()
  const shopId = routes.params.id as string

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
      </div>
    </template>
  </Layout>
</template>
