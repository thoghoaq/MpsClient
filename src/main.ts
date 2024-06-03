import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import Button from 'primevue/button'
import Toast from 'primevue/toast'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import Sidebar from 'primevue/sidebar'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Password from 'primevue/password'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Checkbox from 'primevue/checkbox'
import Menu from 'primevue/menu'

import ToastService from 'primevue/toastservice'

import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { router } from './router'
import { createI18n } from 'vue-i18n'
import { messages, defaultLocale } from './locales'

const app = createApp(App)
const pinia = createPinia()
const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: defaultLocale,
    fallbackLocale: "en",
    availableLocales: ["en", "vi"],
    messages: messages,
})

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.common['Accept-Language'] = 'vi-VN'

app.use(PrimeVue)
app.use(ToastService)
app.use(pinia)
app.use(router)
app.use(i18n)

app.component('Button', Button)
app.component('Toast', Toast)
app.component('InputText', InputText)
app.component('Menubar', Menubar)
app.component('Avatar', Avatar)
app.component('Sidebar', Sidebar)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('Password', Password)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.component('Checkbox', Checkbox)
app.component('Menu', Menu)

app.mount('#app')
