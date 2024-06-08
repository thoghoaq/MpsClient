import Home from '../pages/Home/App.vue'
import SignIn from '../pages/SignIn/App.vue'
import Staffs from '../pages/Admin/Staffs/App.vue'
import StaffEdit from '../pages/Admin/Staffs/Edit/App.vue'
import ShopOwners from '../pages/Admin/ShopOwners/App.vue'
import ShopOwnerEdit from '../pages/Admin/ShopOwners/Edit/App.vue'
import Customers from '../pages/Admin/Customers/App.vue'
import CustomerEdit from '../pages/Admin/Customers/Edit/App.vue'

export const routes = [
  { path: '/sign-in', name: 'signIn', component: SignIn },
  { path: '/', name: 'home', component: Home },
  {
    path: '/admin',
    name: 'admin',
    children: [
      { path: 'staffs', name: 'staffs', component: Staffs },
      { path: 'staffs/create', name: 'staffCreate', component: StaffEdit },
      { path: 'staffs/:id', name: 'staffEdit', component: StaffEdit },
      { path: 'shop-owners', name: 'shopOwners', component: ShopOwners },
      { path: 'shop-owners/create', name: 'shopOwnerCreate', component: ShopOwnerEdit },
      { path: 'shop-owners/:id', name: 'shopOwnerEdit', component: ShopOwnerEdit },
      { path: 'customers', name: 'customers', component: Customers },
      { path: 'customers/create', name: 'customerCreate', component: CustomerEdit },
      { path: 'customers/:id', name: 'customerEdit', component: CustomerEdit },
    ],
  },
]
