<script setup lang="ts">
  import { ref } from 'vue'
  import TopBar from './TopBar/TopBar.vue'
  import NavigationBar from './NavigationBar/NavigationBar.vue'
  const visible = ref(true)
  const toggleMenu = () => {
    visible.value = !visible.value
  }
</script>
<template>
  <header></header>
  <main>
    <div class="flex">
      <NavigationBar :visible="visible" />
      <div class="flex flex-column w-full h-screen">
        <TopBar :on-toggle-menu="toggleMenu" />
        <div class="bg-primary-reverse h-full overflow-auto m-3 border-round">
          <slot name="page-content"></slot>
        </div>
      </div>
    </div>
  </main>
</template>
<style src="./Layout.css" scoped></style>
