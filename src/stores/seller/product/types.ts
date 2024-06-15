export interface Product {
    id:          number;
    name:        string;
    price:       number;
    stock:       number;
    productCode: string;
    productSKU:  string;
    description: string | null;
    categoryId:  number;
    brandId:     number | null;
    shopId:      number;
    isActive:    boolean;
    createdAt:   Date;
    updatedAt:   Date;
    category:    null;
    brand:       null;
    shop:        null;
    images:      any[];
}
