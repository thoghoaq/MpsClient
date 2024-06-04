import Home from '../pages/Home/App.vue'
import SignIn from '../pages/SignIn/App.vue'
import Staffs from '../pages/Administrator/Staffs/App.vue'
import ShopOwners from '../pages/Administrator/ShopOwners/App.vue'
import Customers from '../pages/Administrator/Customers/App.vue'

export const routes = [
  { path: '/sign-in', name: 'signIn', component: SignIn },
  { path: '/', name: 'home', component: Home },
  {
    path: '/admin',
    name: 'admin',
    children: [
      { path: 'staffs', name: 'staffs', component: Staffs },
      { path: 'shop-owners', name: 'shopOwners', component: ShopOwners },
      { path: 'customers', name: 'customers', component: Customers },
    ],
  },
]
