export type Product = {
  id: number
  name: string
  price: number
  stock: number
  productCode: string
  productSKU: string
  description: string | null
  categoryId: number
  brandId: number | null
  shopId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  category: any
  brand: any
  shop: any
  images: any[]
}

export type Filter = {
  categoriesId: string[] | null
  brandsId: number[] | null
  shopsId: number[] | null
  query: string | null
}
