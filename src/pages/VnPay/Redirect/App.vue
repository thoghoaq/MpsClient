<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const paymentUrl = route.query.paymentUrl as string

  onMounted(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl
    }
  })
</script>
<template>
    <div class="align-items-center h-screen justify-content-center">
        <div class="text-center">
            <div class="text-2xl font-semibold mb-4">{{ $t('Redirecting to VnPay...') }}</div>
            <ProgressSpinner />
        </div>
    </div>
</template>
