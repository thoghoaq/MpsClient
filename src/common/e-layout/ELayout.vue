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
    <div class="overflow-auto h-screen">
      <ETopBar :on-toggle-menu="toggleMenu" class="sticky top-0 z-1"/>
      <div>
          <slot name="page-content"></slot>
      </div>
    </div>
  </main>
</template>
