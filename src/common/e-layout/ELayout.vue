<script setup lang="ts">
  import { ref } from 'vue'
  import ETopBar from './TopBar/ETopBar.vue'
  import ENavigationBar from './NavigationBar/ENavigationBar.vue'
  const visible = ref(true)
  const toggleMenu = () => {
    visible.value = !visible.value
  }
</script>
<template>
  <header></header>
  <main>
    <div class="flex flex-column w-full h-screen">
      <ETopBar :on-toggle-menu="toggleMenu" />
      <div class="flex h-full">
        <ENavigationBar :visible="visible" />
        <div class="bg-primary-reverse overflow-auto w-full m-3 border-round">
          <slot name="page-content"></slot>
        </div>
      </div>
    </div>
  </main>
</template>
