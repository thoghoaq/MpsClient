import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'
import PrimeVue, { usePrimeVue } from 'primevue/config'

import Layout from './common/layout/Layout.vue'

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
import Badge from 'primevue/badge'
import RadioButton from 'primevue/radiobutton'
import Dropdown from 'primevue/dropdown'
import TreeTable from 'primevue/treetable'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Chip from 'primevue/chip'
import FileUpload from 'primevue/fileupload'
import Image from 'primevue/image'
import ConfirmDialog from 'primevue/confirmdialog'
import Breadcrumb from 'primevue/breadcrumb'
import Chart from 'primevue/chart'
import Tag from 'primevue/tag'
import Inplace from 'primevue/inplace'
import Dialog from 'primevue/dialog'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple';

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
app.use(ConfirmationService)
app.use(pinia)
app.use(router)
app.use(i18n)

app.component('Layout', Layout)

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
app.component('Badge', Badge)
app.component('RadioButton', RadioButton)
app.component('Dropdown', Dropdown)
app.component('TreeTable', TreeTable)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Chip', Chip)
app.component('FileUpload', FileUpload)
app.component('Image', Image)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Breadcrumb', Breadcrumb)
app.component('Chart', Chart)
app.component('Tag', Tag)
app.component('Inplace', Inplace)
app.component('Dialog', Dialog)

app.directive('ripple', Ripple)

app.mount('#app')
