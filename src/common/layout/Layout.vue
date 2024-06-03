<script setup lang="ts">
  import { ref } from 'vue'
  import TopBar from './TopBar/TopBar.vue'
  import NavigationBar from './NavigationBar/NavigationBar.vue'
  const visible = ref(true)
  const toggleMMenu = () => {
    visible.value = !visible.value
  }
</script>
<template>
    <div class="flex">
      <NavigationBar :visible="visible"/>
      <TopBar :on-toggle-menu="toggleMMenu" />
      <div class="flex-1">
        <slot></slot>
      </div>
    </div>
</template>
<style src="./Layout.css" scoped></style>
