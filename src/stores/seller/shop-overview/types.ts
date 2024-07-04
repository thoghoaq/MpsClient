export interface ShopInfo {
    overview:                Overview;
    dailyRevenues:           DailyRevenue[];
    productSoldByCategories: ProductSoldByCategory[];
    recentOrders:            RecentOrder[];
    topProducts:             TopProduct[];
}

export interface DailyRevenue {
    date:  number;
    total: number;
}

export interface Overview {
    totalSales:                      number;
    salePercentageWithLastMonth:     number;
    totalRevenue:                    number;
    revenuePercentageWithLastMonth:  number;
    totalCustomers:                  number;
    customerPercentageWithLastMonth: number;
}

export interface RecentOrder {
    orderId: number;
    orderDate: number;
    total: number;
}

export interface ProductSoldByCategory {
    categoryName: string;
    total:        number;
}

export interface TopProduct {
    productId:    number;
    productName:  string;
    productImage: string | null;
    price:        number;
}
