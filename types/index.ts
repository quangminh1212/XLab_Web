export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    price: number;
    salePrice: number;
    categoryId: string;
    imageUrl: string;
    isFeatured: boolean;
    isNew: boolean;
    downloadCount: number;
    viewCount: number;
    rating: number;
    version: string;
    size: string;
    licenseType: string;
    createdAt: string;
    updatedAt: string;
}

export interface Store {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
}
