import Home from '../pages/Home/App.vue'
import SignIn from '../pages/SignIn/App.vue'
import SignUp from '../pages/SignUp/App.vue'
import PasswordReset from '../pages/PasswordReset/App.vue'

/** Administrator */
import Staffs from '../pages/Admin/Staffs/App.vue'
import StaffEdit from '../pages/Admin/Staffs/Edit/App.vue'
import ShopOwners from '../pages/Admin/ShopOwners/App.vue'
import ShopOwnerEdit from '../pages/Admin/ShopOwners/Edit/App.vue'
import Customers from '../pages/Admin/Customers/App.vue'
import CustomerEdit from '../pages/Admin/Customers/Edit/App.vue'
import ProductCategories from '../pages/Admin/ProductCategories/App.vue'

/** Seller */
import Shops from '../pages/Seller/Shops/App.vue'
import Products from '../pages/Seller/Products/App.vue'
import ShopsCreate from '../pages/Seller/Shops/Edit/App.vue'
import ProductsCreate from '../pages/Seller/Products/Edit/App.vue'

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/sign-in', name: 'signIn', component: SignIn },
  { path: '/sign-up', name: 'signUp', component: SignUp },
  { path: '/password-reset', name: 'signOut', component: PasswordReset },
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
      { path: 'product-categories', name: 'productCategories', component: ProductCategories },
    ],
  },
  {
    path: '/seller',
    name: 'seller',
    children: [
      { path: 'shops', name: 'shops', component: Shops }, 
      { path: 'shops/create', name: 'shopsCreate', component: ShopsCreate },
    ]
  },
  {
    path: '/shop',
    name: 'shop',
    children: [
      { path: 'products', name: 'products', component: Products },
      { path: 'products/create', name: 'productsCreate', component: ProductsCreate }
    ]
  }
]
