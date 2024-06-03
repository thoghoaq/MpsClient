import Home from '../pages/Home/App.vue'
import SignIn from '../pages/SignIn/App.vue'

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/sign-in', name: 'signIn', component: SignIn },
]
