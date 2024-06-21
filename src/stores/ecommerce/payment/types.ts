export interface PaymentDetails {
    orders: Order[];
}

export interface Order {
    id:              number;
    customerId:      number;
    shopId:          number;
    customerName:    string;
    address:         string;
    email:           string;
    phoneNumber:     string;
    orderDate:       Date;
    deliveryDate:    Date;
    orderStatusId:   number;
    paymentStatusId: number;
    paymentMethodId: number;
    totalAmount:     number;
    discount:        number;
    note:            string;
    customer:        null;
    shop:            Shop;
    orderStatus:     OrderStatus;
    paymentStatus:   OrderStatus;
    paymentMethod:   OrderStatus;
    orderDetails:    OrderDetail[];
    progresses:      Progress[];
}

export interface OrderDetail {
    id:          number;
    orderId:     number;
    productId:   number;
    productName: string;
    quantity:    number;
    price:       number;
    discount:    number;
    total:       number;
}

export interface OrderStatus {
    id:   number;
    name: string;
}

export interface Progress {
    id:          number;
    name:        string;
    orderId:     number;
    createdDate: Date;
    updatedDate: Date;
}

export interface Shop {
    id:          number;
    shopOwnerId: number;
    shopName:    string;
    phoneNumber: string;
    address:     string;
    city:        string;
    district:    string;
    latitude:    number;
    longitude:   number;
    description: string;
    avatar:      string;
    cover:       string;
    isActive:    boolean;
    createdAt:   Date;
    updatedAt:   Date;
}
