<script setup lang="ts">
  import { ref } from 'vue'
  import TopBar from './TopBar/TopBar.vue'
  import NavigationBar from './NavigationBar/NavigationBar.vue'
  const visible = ref(true)
  const toggleMenu = () => {
    visible.value = !visible.value
  }

  const props = defineProps({
    hideBackground: Boolean,
  })
</script>
<template>
  <header></header>
  <main>
    <div class="flex">
      <NavigationBar :visible="visible" />
      <div class="flex flex-column w-full h-screen">
        <TopBar :on-toggle-menu="toggleMenu" />
        <div class="h-full overflow-x-hidden m-3 border-round" :class="hideBackground ? '' : 'bg-primary-reverse'">
          <slot name="page-content"></slot>
        </div>
      </div>
    </div>
  </main>
</template>
<style src="./Layout.css" scoped></style>
