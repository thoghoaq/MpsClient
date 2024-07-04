<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  const {t} = useI18n()
  const chartData = ref()
  const chartOptions = ref()

  const props = defineProps({
    dailyRevenues: Array,
  })

  watch(
    () => props.dailyRevenues,
    () => {
      loadChart()
    },
  )

  const loadChart = () => {
    chartData.value = setChartData()
    chartOptions.value = setChartOptions()
  }

  const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement)
    const labels = props.dailyRevenues?.map((item: any) => item.date)
    const data = props.dailyRevenues?.map((item: any) => item.total)
    return {
      labels: labels,
      datasets: [
        {
          label: t('Revenue'),
          backgroundColor: documentStyle.getPropertyValue('--primary-color'),
          borderColor: documentStyle.getPropertyValue('--primary-color'),
          data: data,
        },
      ],
    }
  }
  const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    )
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    }
  }
</script>
<template>
  <Chart type="bar" :data="chartData" :options="chartOptions" class="h-30rem" />
</template>
