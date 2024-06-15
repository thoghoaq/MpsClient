export interface ProductCategory {
    id:       number;
    name:     string;
    parentId: number | null;
    children: ProductCategory[];
}

export interface ProductBrand {
    id:   number;
    name: string;
}
