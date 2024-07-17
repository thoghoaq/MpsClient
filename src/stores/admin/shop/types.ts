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
  discount: number | null
  expectPayout: number | null
  totalPayout: number
  payouts: Payout[]
}

export interface Payout {
  id: number
  shopId: number
  expectAmount: number | null
  amount: number | null
  currency: string | null
  monthToDate: Date
  payoutDate: number
  batchId: string | null
  payoutStatusId: number
  createdDate: Date
  updatedDate: Date | null
}

export enum PayoutDate {
  day1 = 1,
  day8 = 8,
  day15 = 15,
  day22 = 22,
}
