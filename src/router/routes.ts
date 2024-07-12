import Home from '../pages/Home/App.vue'
import SignIn from '../pages/SignIn/App.vue'
import SignUp from '../pages/SignUp/App.vue'
import PasswordReset from '../pages/PasswordReset/App.vue'
import Profile from '../pages/Profile/App.vue'

/** Administrator */
import Staffs from '../pages/Admin/Staffs/App.vue'
import StaffEdit from '../pages/Admin/Staffs/Edit/App.vue'
import ShopOwners from '../pages/Admin/ShopOwners/App.vue'
import ShopOwnerEdit from '../pages/Admin/ShopOwners/Edit/App.vue'
import Customers from '../pages/Admin/Customers/App.vue'
import CustomerEdit from '../pages/Admin/Customers/Edit/App.vue'
import ProductCategories from '../pages/Admin/ProductCategories/App.vue'
import RefundRevenue from '../pages/Admin/RefundRevenue/App.vue'
import ShopRequest from '../pages/Admin/ShopRequest/App.vue'
import Setting from '../pages/Admin/Setting/App.vue'

/** Seller */
import Shops from '../pages/Seller/Shops/App.vue'
import Products from '../pages/Seller/Products/App.vue'
import ShopsCreate from '../pages/Seller/Shops/Edit/App.vue'
import ProductsCreate from '../pages/Seller/Products/Edit/App.vue'
import ProductEdit from '../pages/Seller/Products/Edit/App.vue'
import Orders from '../pages/Seller/Orders/App.vue'
import ShopOverview from '../pages/Seller/Shops/Overview/App.vue'

/** Ecommerce */
import EProducts from '../pages/Ecommerce/Products/App.vue'
import EProductDetails from '../pages/Ecommerce/ProductDetails/App.vue'
import Cart from '../pages/Cart/App.vue'
import Checkout from '../pages/Checkout/App.vue'
import VnPay from '../pages/VnPay/Redirect/App.vue'
import VnPayReturn from '../pages/VnPay/Return/App.vue'
import EOrders from '../pages/Order/App.vue'

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
      {
        path: 'shop-owners/create',
        name: 'shopOwnerCreate',
        component: ShopOwnerEdit,
      },
      {
        path: 'shop-owners/:id',
        name: 'shopOwnerEdit',
        component: ShopOwnerEdit,
      },
      {
        path: 'shop-request',
        name: 'shopRequest',
        component: ShopRequest,
      },
      { path: 'customers', name: 'customers', component: Customers },
      {
        path: 'customers/create',
        name: 'customerCreate',
        component: CustomerEdit,
      },
      { path: 'customers/:id', name: 'customerEdit', component: CustomerEdit },
      {
        path: 'product-categories',
        name: 'productCategories',
        component: ProductCategories,
      },
      {
        path: 'settings',
        name: 'settings',
        component: Setting,
      }
    ],
  },
  {
    path: '/business',
    name: 'business',
    children: [
      {
        path: 'refund',
        name: 'refund',
        component: RefundRevenue,
      },
    ],
  },
  {
    path: '/seller',
    name: 'seller',
    children: [
      { path: 'shops', name: 'shops', component: Shops },
      { path: 'shops/create', name: 'shopsCreate', component: ShopsCreate },
      { path: 'shops/:id', name: 'shopsUpdate', component: ShopsCreate },
      { path: 'shop-overview/:id', name: 'shopOverview', component: ShopOverview}
    ],
  },
  {
    path: '/shop',
    name: 'shop',
    children: [
      { path: 'products', name: 'products', component: Products },
      {
        path: 'products/create',
        name: 'productsCreate',
        component: ProductsCreate,
      },
      {
        path: 'products/:id',
        name: 'productEdit',
        component: ProductEdit,
      },
      {
        path: 'orders',
        name: 'orders',
        component: Orders,
      },
    ],
  },
  {
    path: '/ecommerce',
    name: 'ecommerce',
    children: [
      { path: 'products', name: 'eProducts', component: EProducts },
      {
        path: 'products/:id',
        name: 'eProductDetails',
        component: EProductDetails,
      },
    ],
  },
  { path: '/cart', name: 'cart', component: Cart },
  { path: '/cart/checkout', name: 'checkout', component: Checkout },
  { path: '/vnpay', name: 'vnPay', component: VnPay },
  { path: '/vnpay-return', name: 'vnPayReturn', component: VnPayReturn },
  {
    path: '/orders',
    name: 'eOrders',
    component: EOrders,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  }
]
