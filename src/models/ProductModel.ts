export interface ProductImage {
    url: string;
    alt: string;
    isFeatured?: boolean;
}

export interface ProductFeature {
    title: string;
    description: string;
    icon?: string;
}

export interface ProductRequirement {
    type: 'system' | 'software' | 'hardware';
    description: string;
}

export interface ProductVersion {
    name: string;
    description?: string;
    price: number;
    originalPrice: number;
    features: string[];
}

export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    images: ProductImage[];
    features: ProductFeature[];
    requirements: ProductRequirement[];
    versions: ProductVersion[];
    categories: ProductCategory[];
    createdAt: string;
    updatedAt: string;
    isPublished: boolean;
}

export interface ProductFormData {
    id?: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    images: ProductImage[];
    features: ProductFeature[];
    requirements: ProductRequirement[];
    versions: ProductVersion[];
    categories: string[]; // Chỉ lưu ID của categories
    isPublished: boolean;
} 