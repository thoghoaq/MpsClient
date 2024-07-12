import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import Layout from './common/layout/Layout.vue'
import ELayout from './common/e-layout/ELayout.vue'
import Category from './common/e-layout/Category/Category.vue'

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
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'
import FloatLabel from 'primevue/floatlabel'
import Editor from 'primevue/editor'
import TreeSelect from 'primevue/treeselect'
import SpeedDial from 'primevue/speeddial'
import Card from 'primevue/card'
import Galleria from 'primevue/galleria'
import Divider from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmPopup from 'primevue/confirmpopup'
import TabMenu from 'primevue/tabmenu'
import Calendar from 'primevue/calendar'
import SplitButton from 'primevue/splitbutton'
import OverlayPanel from 'primevue/overlaypanel'
import Rating from 'primevue/rating'
import ProgressBar from 'primevue/progressbar'
import Carousel from 'primevue/carousel'
import ScrollTop from 'primevue/scrolltop'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';

import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { router } from './router'
import { createI18n } from 'vue-i18n'
import { messages, defaultLocale } from './locales'
import vi from 'src/locales/prime/vi.json'

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

app.use(PrimeVue, {
    locale: vi,
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(pinia)
app.use(router)
app.use(i18n)

app.component('Layout', Layout)
app.component('ELayout', ELayout)
app.component('Category', Category)

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
app.component('Textarea', Textarea)
app.component('InputNumber', InputNumber)
app.component('Slider', Slider)
app.component('FloatLabel', FloatLabel)
app.component('Editor', Editor)
app.component('TreeSelect', TreeSelect)
app.component('SpeedDial', SpeedDial)
app.component('Card', Card)
app.component('Galleria', Galleria)
app.component('Divider', Divider)
app.component('ProgressSpinner', ProgressSpinner)
app.component('ConfirmPopup', ConfirmPopup)
app.component('TabMenu', TabMenu)
app.component('Calendar', Calendar)
app.component('SplitButton', SplitButton)
app.component('OverlayPanel', OverlayPanel)
app.component('Rating', Rating)
app.component('ProgressBar', ProgressBar)
app.component('Carousel', Carousel)
app.component('ScrollTop', ScrollTop)

app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)

app.mount('#app')
