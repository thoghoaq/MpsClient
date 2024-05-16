<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const text = ref();
const toast = useToast();
const greet = () => {
  toast.add({ severity: 'success', summary: 'PrimeTime', detail: `Hello ${text.value}` });
}
</script>

<template>
  <Toast></Toast>
  <div class="container">
    <span class="p-float-label">
      <InputText id="txt" type="text" v-model="text"></InputText>
      <label for="txt">Text</label>
    </span>
    <Button label="Greet" @click="greet" icon="pi pi-user"></Button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
