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
  soldCount: number
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
  filterBy: number | null
  latitude: number | null
  longitude: number | null
  pageSize: 20
  pageNumber: number | null
}

export interface Feedback {
  averageRating: number;
  total:         number;
  fiveStar:      number;
  fourStar:      number;
  threeStar:     number;
  twoStar:       number;
  oneStar:       number;
  feedbacks:     ProductFeedback[];
}

export interface ProductFeedback {
  id: number;
  productId: number;
  userId: number;
  orderId: number;
  feedback: string | null;
  rating: number;
  createdAt: Date;
  updatedAt: Date | null;
  user: any;
}