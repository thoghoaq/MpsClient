import { defineStore } from 'pinia'
import { CartItem, CheckoutItem, CheckoutRequest, CheckoutResponse } from './types'
import { useApi } from '../api'
import { appConfig } from '..'
const api = useApi()

const savedCart = localStorage.getItem('cart')
  ? (JSON.parse(localStorage.getItem('cart') as string) as CartItem[])
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
    clearCart(includeSelected: boolean = false) {
      this.items = this.items.filter(
        (item) => !includeSelected || !item.selected,
      )
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    calculateTotal() {
      return this.items
        .filter((item) => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0)
    },
    updateQuantity() {
      this.items = this.items.filter((item) => item.quantity > 0)
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    updateCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    async checkout(
      address: string,
      customerName: string,
      email: string,
      phoneNumber: string,
      note: string | null,
      paymentMethodId: number,
      discount: number,
    ) {
      const selectedItems = this.items.filter((item) => item.selected)
      return api
        .post(appConfig.api.ecommerce.checkout, <CheckoutRequest>{
          address: address,
          customerName: customerName,
          discount: discount,
          email: email,
          note: note,
          paymentMethod: paymentMethodId,
          phoneNumber: phoneNumber,
          items: selectedItems.map(
            (item) =>
              <CheckoutItem>{
                shopId: item.shopId,
                productId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity,
                discount: 0,
              },
          ),
        })
        .then((response) => {
          return response
        })
    },
  },
})
