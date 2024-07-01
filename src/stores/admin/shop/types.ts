export interface Shop {
  id: number
  shopOwnerId: number
  shopName: string
  phoneNumber: string
  address: string | null
  city: string | null
  district: string | null
  latitude: number | null
  longitude: number | null
  description: string | null
  avatar: string | null
  cover: string | null
  isActive: boolean
  payPalAccount: string | null
  createdAt: Date
  updatedAt: Date | null
  isCurrentMonthPaid: boolean
  revenue: number | null
  totalPayout: number
  payouts: Payout[]
}

export interface Payout {
  id: number
  shopId: number
  amount: number | null
  currency: string | null
  monthToDate: Date
  batchId: string | null
  payoutStatusId: number
  createdDate: Date
  updatedDate: Date | null
}
