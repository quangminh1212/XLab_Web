'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types'; // Import Product type

// Simple Input component for reuse (could be moved to its own file)
const InputField = ({ id, label, type = 'text', value, onChange, required = false, ...props }: any) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...props}
        />
    </div>
);

// Simple Textarea component
const TextareaField = ({ id, label, value, onChange, required = false, rows = 4, ...props }: any) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}{required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...props}
        />
    </div>
);

const ProductForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        longDescription: '',
        price: 0,
        salePrice: 0,
        categoryId: '', // Assuming categories will be fetched or predefined
        storeId: '', // Assuming storeId will be fetched or predefined
        imageUrl: '',
        version: '',
        size: '',
        licenseType: 'Thương mại',
        isFeatured: false,
        isNew: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic client-side validation (enhance as needed)
        if (!formData.name || !formData.price || !formData.description || !formData.categoryId || !formData.storeId) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc (*).');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Thêm sản phẩm thất bại');
            }

            // Optionally, redirect to the product page or homepage after successful submission
            // const newProduct = await response.json();
            alert('Thêm sản phẩm thành công!');
            router.push('/'); // Redirect to homepage

        } catch (err: any) {
            console.error("Submission error:", err);
            setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    // TODO: Fetch categories and stores to populate select dropdowns
    // For now, using simple text inputs

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Thêm Sản Phẩm Mới</h2>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

            <InputField id="name" label="Tên sản phẩm" value={formData.name} onChange={handleChange} required />
            <TextareaField id="description" label="Mô tả ngắn" value={formData.description} onChange={handleChange} required />
            <TextareaField id="longDescription" label="Mô tả chi tiết" value={formData.longDescription} onChange={handleChange} rows={6} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="price" label="Giá (VND)" type="number" value={formData.price} onChange={handleChange} required min="0" />
                <InputField id="salePrice" label="Giá khuyến mãi (VND)" type="number" value={formData.salePrice} onChange={handleChange} min="0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Replace these with Select dropdowns populated with actual data */}
                <InputField id="categoryId" label="ID Danh mục" value={formData.categoryId} onChange={handleChange} required placeholder="vd: cat-1" />
                <InputField id="storeId" label="ID Cửa hàng" value={formData.storeId} onChange={handleChange} required placeholder="vd: 1" />
            </div>

            <InputField id="imageUrl" label="URL Hình ảnh" value={formData.imageUrl} onChange={handleChange} placeholder="vd: /images/products/my-product.png" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField id="version" label="Phiên bản" value={formData.version} onChange={handleChange} placeholder="vd: 1.0.0" />
                <InputField id="size" label="Kích thước" value={formData.size} onChange={handleChange} placeholder="vd: 150MB" />
                <InputField id="licenseType" label="Loại giấy phép" value={formData.licenseType} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <input
                        id="isFeatured"
                        name="isFeatured"
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Nổi bật?</label>
                </div>
                <div className="flex items-center">
                    <input
                        id="isNew"
                        name="isNew"
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isNew" className="ml-2 block text-sm text-gray-900">Mới?</label>
                </div>
            </div>


            <div className="pt-5">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                    {isLoading ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm; 