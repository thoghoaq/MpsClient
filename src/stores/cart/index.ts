import { defineStore } from 'pinia'
import { CartItem } from './types'

const savedCart = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart') as string) as CartItem[]
  : null

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    items: savedCart ?? ([] as CartItem[]),
  }),
  actions: {
    addProduct(product: CartItem) {
      const item = this.items.find((item) => item.id === product.id)
      if (item) {
        item.quantity += product.quantity
      } else {
        this.items.push(product)
      }
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    removeProduct(productId: number) {
      this.items = this.items.filter((item) => item.id !== productId)
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    clearCart() {
      this.items = []
      localStorage.removeItem('cart')
    },
    calculateTotal() {
      return this.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    updateQuantity() {
      this.items = this.items.filter((item) => item.quantity > 0)
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  },
})
