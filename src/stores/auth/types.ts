import { Shop } from '../seller/shop/types'

export type Auth = {
  accessToken: string
  refreshToken: string
  expiresIn: string
  user: User
}

export type User = {
  userId: number
  uid: string
  role: string[]
  isActive: boolean
  isAdminGroup: boolean
  isManagerGroup: boolean
  isCustomer: boolean
  isShopOwner: boolean
  isGuest: boolean
  data: Data
  shopManaging: Shop | undefined
}

type Data = {
  email: string
  displayName: string
  photoUrl: string
  phoneNumber: string | null
  customerAddress: string | null
}

export interface PayPalAuth {
  scope: string
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  nonce: string
}

export interface PayPalCustomer {
  user_id: string
  sub: string
  name: string
  email: string
  verified: string
  email_verified: boolean
}

export type UserDevice = {
  id: number
  userId: number
  deviceToken: string | null
  deviceName: string | null
  deviceLatitude: string | null
  deviceLongitude: string | null
  isLogged: boolean
  createdAt: Date
  updatedAt: Date | null
}
