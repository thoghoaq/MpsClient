import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';

import Button from 'primevue/button';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';

import ToastService from 'primevue/toastservice';

import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);

app.component('Button', Button);
app.component('Toast', Toast);
app.component('InputText', InputText);

app.mount('#app');