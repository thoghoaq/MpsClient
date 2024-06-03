<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import Layout from './common/layout/Layout.vue';
import SignIn from './pages/SignIn/App.vue';
import SignUp from './pages/SignUp/App.vue';
import AccessDenied from './pages/Error/AccessDenied.vue';
import Error from './pages/Error/Error.vue';
import NotFound from './pages/Error/NotFound.vue';

const text = ref();
const toast = useToast();
const greet = () => {
  toast.add({ severity: 'success', summary: 'PrimeTime', detail: `Hello ${text.value}`, life: 3000 });
}
</script>

<template>
    <Toast />
    <router-view />
</template>
