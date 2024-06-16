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
}