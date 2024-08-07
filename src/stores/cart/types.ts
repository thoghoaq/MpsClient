export interface Cart {
    items: CartItem[];
}

export interface CartItem {
    id: number;
    quantity: number;
    stock: number;
    price: number;
    name: string;
    imageUrl: string | null;
    selected: boolean;
    shopId: number;
    shop: any;
}

export type CartItemsGroupedByShop = {
    [shopId: number]: CartItem[];
};

export interface CheckoutRequest {
    customerName:  string;
    address:       string;
    email:         string;
    phoneNumber:   string;
    note:          string;
    items:         CheckoutItem[];
    discount:      number;
    paymentMethod: number;
}

export interface CheckoutItem {
    productId:   number;
    productName: string;
    productImage: string;
    price:       number;
    quantity:    number;
    discount:    number;
    shopId: number;
}

export interface CheckoutResponse {
    orderId: number;
    paymentId: number;
    paymentUrl: string;
}