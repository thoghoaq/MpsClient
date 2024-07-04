<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps({
    productSoldByCategories: Array,
  })

  watch(
    () => props.productSoldByCategories,
    () => {
      loadChart()
    },
  )

  const loadChart = () => {
    chartData.value = setChartData()
    chartOptions.value = setChartOptions()
  }

  const chartData = ref()
  const chartOptions = ref()

  const setChartData = () => {
    const documentStyle = getComputedStyle(document.body)
    const labels = props.productSoldByCategories?.map(
      (item: any) => item.categoryName,
    )
    const data = props.productSoldByCategories?.map((item: any) => item.total)
    const colors = [
      '--primary-900',
      '--primary-800',
      '--primary-700',
      '--primary-600',
      '--primary-500',
      '--primary-400',
      '--primary-300',
      '--primary-200',
      '--primary-100',
      '--primary-50',
    ]
    const backgroundColors = props.productSoldByCategories?.map(
      (item: any, index: number) =>
        documentStyle.getPropertyValue(colors[index] ?? colors[0]),
    )
    const hoverBackgroundColor = props.productSoldByCategories?.map(
      (item: any, index: number) =>
        documentStyle.getPropertyValue(colors[index + 2] ?? colors[0]),
    )
    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColor,
        },
      ],
    }
  }

  const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')

    return {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    }
  }
</script>

<template>
  <div class="card flex justify-content-center">
    <Chart
      type="pie"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-30rem"
    />
  </div>
</template>
