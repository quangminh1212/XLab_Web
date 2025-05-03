<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import withAdminAuth from '@/components/withAdminAuth';
import { Product } from '@/models/ProductModel';

function ProductsManagement() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/admin/products');

                if (!response.ok) {
                    throw new Error('Không thể tải danh sách sản phẩm');
                }

                const data = await response.json();
                setProducts(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Đã xảy ra lỗi khi tải danh sách sản phẩm');
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle edit product
    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingProduct(null);
        setShowForm(false);
    };

    // Handle submit new product
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData(e.currentTarget);

            // Build feature array
            const featuresText = formData.get('features') as string;
            const featuresArray = featuresText
                ? featuresText.split('\n').filter(line => line.trim() !== '')
                : [];

            // Build product object
            const productData = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                shortDescription: formData.get('shortDescription') as string,
                images: [
                    {
                        url: formData.get('imageUrl') as string,
                        alt: `${formData.get('name')} - Ảnh chính`,
                        isFeatured: true
                    }
                ],
                features: [
                    {
                        title: 'Tính năng chính',
                        description: formData.get('mainFeature') as string,
                        icon: 'feature'
                    }
                ],
                requirements: [
                    {
                        type: 'system',
                        description: formData.get('requirements') as string || 'Windows 10/11, macOS 10.15+, Linux'
                    }
                ],
                versions: [
                    {
                        name: 'Tiêu chuẩn',
                        description: 'Phiên bản tiêu chuẩn',
                        price: Number(formData.get('price')) || 0,
                        originalPrice: Number(formData.get('originalPrice')) || 0,
                        features: featuresArray
                    }
                ],
                categories: formData.getAll('categories') as string[],
                isPublished: formData.get('isPublished') === 'on'
            };

            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Không thể thêm sản phẩm');
            }

            const result = await response.json();

            setProducts(prev => [...prev, result]);
            setSuccess('Thêm sản phẩm thành công!');
            setShowForm(false);
            e.currentTarget.reset();
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Đã xảy ra lỗi khi thêm sản phẩm');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle update product
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingProduct) return;

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData(e.currentTarget);

            // Build feature array
            const featuresText = formData.get('features') as string;
            const featuresArray = featuresText
                ? featuresText.split('\n').filter(line => line.trim() !== '')
                : [];

            // Build product object
            const productData = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                shortDescription: formData.get('shortDescription') as string,
                images: [
                    {
                        url: formData.get('imageUrl') as string,
                        alt: `${formData.get('name')} - Ảnh chính`,
                        isFeatured: true
                    }
                ],
                features: [
                    {
                        title: 'Tính năng chính',
                        description: formData.get('mainFeature') as string,
                        icon: 'feature'
                    }
                ],
                requirements: [
                    {
                        type: 'system',
                        description: formData.get('requirements') as string || 'Windows 10/11, macOS 10.15+, Linux'
                    }
                ],
                versions: [
                    {
                        name: 'Tiêu chuẩn',
                        description: 'Phiên bản tiêu chuẩn',
                        price: Number(formData.get('price')) || 0,
                        originalPrice: Number(formData.get('originalPrice')) || 0,
                        features: featuresArray
                    }
                ],
                categories: formData.getAll('categories') as string[],
                isPublished: formData.get('isPublished') === 'on'
            };

            const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật sản phẩm');
            }

            const updatedProduct = await response.json();

            // Update products state
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === editingProduct.id ? updatedProduct : product
                )
            );

            setSuccess('Cập nhật sản phẩm thành công!');
            setEditingProduct(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating product:', error);
            setError('Đã xảy ra lỗi khi cập nhật sản phẩm');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete click
    const handleDeleteClick = (productId: string) => {
        setDeleteProductId(productId);
        setIsDeleting(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!deleteProductId) return;

        try {
            const response = await fetch(`/api/admin/products/${deleteProductId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Không thể xóa sản phẩm');
            }

            // Remove product from state
            setProducts(prevProducts =>
                prevProducts.filter(product => product.id !== deleteProductId)
            );

            setSuccess('Xóa sản phẩm thành công!');
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Đã xảy ra lỗi khi xóa sản phẩm');
        } finally {
            setDeleteProductId(null);
            setIsDeleting(false);
        }
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setDeleteProductId(null);
        setIsDeleting(false);
    };

    // Hàm xử lý xóa sản phẩm
    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Không thể xóa sản phẩm');
            }

            // Cập nhật danh sách sản phẩm
            setProducts(products.filter(p => p.id !== id));
            setSuccess('Đã xóa sản phẩm thành công');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error: any) {
            setError(error.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý chỉnh sửa sản phẩm
    const handleEditProduct = (id: string) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setSelectedProductId(id);
            setShowForm(true);

            // Đặt giá trị cho form
            const formElement = document.getElementById('productForm') as HTMLFormElement;
            if (formElement) {
                (formElement.elements.namedItem('name') as HTMLInputElement).value = product.name;
                (formElement.elements.namedItem('price') as HTMLInputElement).value = product.versions?.[0]?.price.toString() || '';

                // Kiểm tra xem sản phẩm có trường discount không
                const discountField = formElement.elements.namedItem('discount') as HTMLInputElement;
                if (discountField && product.versions?.[0]?.hasOwnProperty('discount')) {
                    discountField.value = (product.versions[0] as any).discount.toString();
                }

                const mainFeatureField = formElement.elements.namedItem('mainFeature') as HTMLInputElement;
                if (mainFeatureField && product.features?.[0]?.description) {
                    mainFeatureField.value = product.features[0].description;
                }

                // Xử lý danh sách tính năng
                const featuresTextarea = document.getElementById('features') as HTMLTextAreaElement;
                if (featuresTextarea && product.versions?.[0]?.features) {
                    featuresTextarea.value = product.versions[0].features.join('\n');
                }

                // Xử lý danh mục
                if (product.categories) {
                    const categoryIds = Array.isArray(product.categories)
                        ? product.categories.map(cat => typeof cat === 'string' ? cat : cat.id)
                        : [product.categories];

                    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="categories"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = categoryIds.includes(checkbox.value);
                    });
                }

                // Hiển thị ảnh hiện tại
                if (product.images && product.images[0] && product.images[0].url) {
                    const previewImage = document.getElementById('imagePreview') as HTMLImageElement;
                    if (previewImage) {
                        previewImage.src = product.images[0].url;
                        previewImage.style.display = 'block';
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-primary-700 text-white p-6">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
                        <Link href="/admin" className="bg-white text-primary-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                            ← Quay lại Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4">
                {/* Thông báo */}
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Lỗi! </strong>
                        <span className="block sm:inline">{error}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setError('')}
                        >
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Đóng</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Thành công! </strong>
                        <span className="block sm:inline">{success}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setSuccess('')}
                        >
                            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Đóng</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Nút thêm sản phẩm */}
                <div className="mb-6">
                    <button
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                        onClick={() => {
                            setSelectedProductId(null);
                            setShowForm(!showForm);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showForm ? 'Đóng form' : 'Thêm sản phẩm mới'}
                    </button>
                </div>

                {/* Form thêm/sửa sản phẩm */}
                {showForm && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {selectedProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm Sản phẩm mới'}
                        </h3>

                        <form id="productForm" onSubmit={selectedProductId ? handleUpdate : handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                                        Tên sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="slug" className="block mb-2 font-medium text-gray-700">
                                        Slug <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                        placeholder="ten-san-pham"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="shortDescription" className="block mb-2 font-medium text-gray-700">
                                        Mô tả ngắn <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="shortDescription"
                                        name="shortDescription"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="imageUrl" className="block mb-2 font-medium text-gray-700">
                                        URL Hình ảnh <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="imageUrl"
                                        name="imageUrl"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                        placeholder="/images/products/ten-san-pham.jpg"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block mb-2 font-medium text-gray-700">
                                        Giá <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="originalPrice" className="block mb-2 font-medium text-gray-700">
                                        Giá gốc
                                    </label>
                                    <input
                                        type="number"
                                        id="originalPrice"
                                        name="originalPrice"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="discount" className="block mb-2 font-medium text-gray-700">
                                        Giảm giá (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="discount"
                                        name="discount"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="mainFeature" className="block mb-2 font-medium text-gray-700">
                                        Tính năng chính
                                    </label>
                                    <input
                                        type="text"
                                        id="mainFeature"
                                        name="mainFeature"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Mô tả tính năng chính của sản phẩm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categories" className="block mb-2 font-medium text-gray-700">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="categories"
                                        name="categories"
                                        multiple
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="office-software">Phần mềm văn phòng</option>
                                        <option value="business-solutions">Giải pháp doanh nghiệp</option>
                                        <option value="security-software">Phần mềm bảo mật</option>
                                        <option value="data-protection">Bảo vệ dữ liệu</option>
                                        <option value="design-software">Phần mềm thiết kế</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Giữ Ctrl để chọn nhiều danh mục</p>
                                </div>

                                <div>
                                    <label htmlFor="requirements" className="block mb-2 font-medium text-gray-700">
                                        Yêu cầu hệ thống
                                    </label>
                                    <input
                                        type="text"
                                        id="requirements"
                                        name="requirements"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Windows 10/11, macOS 10.15+, Linux"
                                    />
                                </div>

                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        name="isPublished"
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                                        Xuất bản sản phẩm
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                                        Mô tả chi tiết <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="features" className="block mb-2 font-medium text-gray-700">
                                        Tính năng nổi bật
                                    </label>
                                    <textarea
                                        id="features"
                                        name="features"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Mỗi tính năng một dòng"
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Mỗi dòng là một tính năng</p>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-4">
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            {selectedProductId ? 'Cập nhật' : 'Thêm sản phẩm'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    onClick={handleCancelEdit}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Danh sách sản phẩm */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">Danh sách sản phẩm</h2>

                    {isLoading ? (
                        <div className="p-4 flex justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
                            <p className="mb-4">Hãy thêm sản phẩm mới để bắt đầu quản lý.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Danh mục
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giá
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                                                        {product.images && product.images[0] && (
                                                            <Image
                                                                width={40}
                                                                height={40}
                                                                src={product.images[0].url}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500">{product.shortDescription}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {product.categories?.map(cat => typeof cat === 'string' ? cat : cat.name).join(', ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.versions && product.versions[0] && (
                                                    <div>
                                                        <span className="text-gray-900 font-medium">
                                                            {formatCurrency(product.versions[0].price)}
                                                        </span>
                                                        {product.versions[0].originalPrice > product.versions[0].price && (
                                                            <span className="text-xs text-gray-500 line-through ml-2">
                                                                {formatCurrency(product.versions[0].originalPrice)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.isPublished ? (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Công khai
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        Nháp
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <span className="text-gray-300">|</span>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal xác nhận xóa */}
            {isDeleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

=======
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import withAdminAuth from '@/components/withAdminAuth';
import { Product } from '@/models/ProductModel';

function ProductsManagement() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/admin/products');

                if (!response.ok) {
                    throw new Error('Không thể tải danh sách sản phẩm');
                }

                const data = await response.json();
                setProducts(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Đã xảy ra lỗi khi tải danh sách sản phẩm');
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle edit product
    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingProduct(null);
        setShowForm(false);
    };

    // Handle submit new product
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData(e.currentTarget);

            // Build feature array
            const featuresText = formData.get('features') as string;
            const featuresArray = featuresText
                ? featuresText.split('\n').filter(line => line.trim() !== '')
                : [];

            // Build product object
            const productData = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                shortDescription: formData.get('shortDescription') as string,
                images: [
                    {
                        url: formData.get('imageUrl') as string,
                        alt: `${formData.get('name')} - Ảnh chính`,
                        isFeatured: true
                    }
                ],
                features: [
                    {
                        title: 'Tính năng chính',
                        description: formData.get('mainFeature') as string,
                        icon: 'feature'
                    }
                ],
                requirements: [
                    {
                        type: 'system',
                        description: formData.get('requirements') as string || 'Windows 10/11, macOS 10.15+, Linux'
                    }
                ],
                versions: [
                    {
                        name: 'Tiêu chuẩn',
                        description: 'Phiên bản tiêu chuẩn',
                        price: Number(formData.get('price')) || 0,
                        originalPrice: Number(formData.get('originalPrice')) || 0,
                        features: featuresArray
                    }
                ],
                categories: formData.getAll('categories') as string[],
                isPublished: formData.get('isPublished') === 'on'
            };

            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Không thể thêm sản phẩm');
            }

            const result = await response.json();

            setProducts(prev => [...prev, result]);
            setSuccess('Thêm sản phẩm thành công!');
            setShowForm(false);
            e.currentTarget.reset();
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Đã xảy ra lỗi khi thêm sản phẩm');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle update product
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingProduct) return;

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData(e.currentTarget);

            // Build feature array
            const featuresText = formData.get('features') as string;
            const featuresArray = featuresText
                ? featuresText.split('\n').filter(line => line.trim() !== '')
                : [];

            // Build product object
            const productData = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                shortDescription: formData.get('shortDescription') as string,
                images: [
                    {
                        url: formData.get('imageUrl') as string,
                        alt: `${formData.get('name')} - Ảnh chính`,
                        isFeatured: true
                    }
                ],
                features: [
                    {
                        title: 'Tính năng chính',
                        description: formData.get('mainFeature') as string,
                        icon: 'feature'
                    }
                ],
                requirements: [
                    {
                        type: 'system',
                        description: formData.get('requirements') as string || 'Windows 10/11, macOS 10.15+, Linux'
                    }
                ],
                versions: [
                    {
                        name: 'Tiêu chuẩn',
                        description: 'Phiên bản tiêu chuẩn',
                        price: Number(formData.get('price')) || 0,
                        originalPrice: Number(formData.get('originalPrice')) || 0,
                        features: featuresArray
                    }
                ],
                categories: formData.getAll('categories') as string[],
                isPublished: formData.get('isPublished') === 'on'
            };

            const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật sản phẩm');
            }

            const updatedProduct = await response.json();

            // Update products state
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === editingProduct.id ? updatedProduct : product
                )
            );

            setSuccess('Cập nhật sản phẩm thành công!');
            setEditingProduct(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating product:', error);
            setError('Đã xảy ra lỗi khi cập nhật sản phẩm');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete click
    const handleDeleteClick = (productId: string) => {
        setDeleteProductId(productId);
        setIsDeleting(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!deleteProductId) return;

        try {
            const response = await fetch(`/api/admin/products/${deleteProductId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Không thể xóa sản phẩm');
            }

            // Remove product from state
            setProducts(prevProducts =>
                prevProducts.filter(product => product.id !== deleteProductId)
            );

            setSuccess('Xóa sản phẩm thành công!');
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Đã xảy ra lỗi khi xóa sản phẩm');
        } finally {
            setDeleteProductId(null);
            setIsDeleting(false);
        }
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setDeleteProductId(null);
        setIsDeleting(false);
    };

    // Hàm xử lý xóa sản phẩm
    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Không thể xóa sản phẩm');
            }

            // Cập nhật danh sách sản phẩm
            setProducts(products.filter(p => p.id !== id));
            setSuccess('Đã xóa sản phẩm thành công');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error: any) {
            setError(error.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý chỉnh sửa sản phẩm
    const handleEditProduct = (id: string) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setSelectedProductId(id);
            setShowForm(true);

            // Đặt giá trị cho form
            const formElement = document.getElementById('productForm') as HTMLFormElement;
            if (formElement) {
                (formElement.elements.namedItem('name') as HTMLInputElement).value = product.name || '';
                (formElement.elements.namedItem('price') as HTMLInputElement).value = 
                    product.versions?.[0]?.price?.toString() || '';

                // Kiểm tra xem sản phẩm có trường discount không
                const discountField = formElement.elements.namedItem('discount') as HTMLInputElement;
                if (discountField && product.versions?.[0]?.hasOwnProperty('discount')) {
                    discountField.value = (product.versions[0] as any).discount?.toString() || '';
                }

                const mainFeatureField = formElement.elements.namedItem('mainFeature') as HTMLInputElement;
                if (mainFeatureField && product.features?.[0]?.description) {
                    mainFeatureField.value = product.features[0].description || '';
                }

                // Xử lý danh sách tính năng
                const featuresTextarea = document.getElementById('features') as HTMLTextAreaElement;
                if (featuresTextarea && product.versions?.[0]?.features) {
                    const features = product.versions[0].features;
                    featuresTextarea.value = Array.isArray(features) ? features.join('\n') : '';
                }

                // Xử lý danh mục
                if (product.categories) {
                    const categoryIds = Array.isArray(product.categories)
                        ? product.categories.map(cat => typeof cat === 'string' ? cat : cat.id)
                        : [product.categories];

                    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="categories"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = categoryIds.includes(checkbox.value);
                    });
                }

                // Hiển thị ảnh hiện tại
                if (product.images && product.images[0] && product.images[0].url) {
                    const previewImage = document.getElementById('imagePreview') as HTMLImageElement;
                    if (previewImage) {
                        previewImage.src = product.images[0].url;
                        previewImage.style.display = 'block';
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-primary-700 text-white p-6">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
                        <Link href="/admin" className="bg-white text-primary-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                            ← Quay lại Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4">
                {/* Thông báo */}
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Lỗi! </strong>
                        <span className="block sm:inline">{error}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setError('')}
                        >
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Đóng</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Thành công! </strong>
                        <span className="block sm:inline">{success}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setSuccess('')}
                        >
                            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Đóng</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Nút thêm sản phẩm */}
                <div className="mb-6">
                    <button
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                        onClick={() => {
                            setSelectedProductId(null);
                            setShowForm(!showForm);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showForm ? 'Đóng form' : 'Thêm sản phẩm mới'}
                    </button>
                </div>

                {/* Form thêm/sửa sản phẩm */}
                {showForm && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {selectedProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm Sản phẩm mới'}
                        </h3>

                        <form id="productForm" onSubmit={selectedProductId ? handleUpdate : handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                                        Tên sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="slug" className="block mb-2 font-medium text-gray-700">
                                        Slug <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                        placeholder="ten-san-pham"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="shortDescription" className="block mb-2 font-medium text-gray-700">
                                        Mô tả ngắn <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="shortDescription"
                                        name="shortDescription"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="imageUrl" className="block mb-2 font-medium text-gray-700">
                                        URL Hình ảnh <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="imageUrl"
                                        name="imageUrl"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                        placeholder="/images/products/ten-san-pham.jpg"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block mb-2 font-medium text-gray-700">
                                        Giá <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="originalPrice" className="block mb-2 font-medium text-gray-700">
                                        Giá gốc
                                    </label>
                                    <input
                                        type="number"
                                        id="originalPrice"
                                        name="originalPrice"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="discount" className="block mb-2 font-medium text-gray-700">
                                        Giảm giá (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="discount"
                                        name="discount"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categories" className="block mb-2 font-medium text-gray-700">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="categories"
                                        name="categories"
                                        multiple
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="office-software">Phần mềm văn phòng</option>
                                        <option value="business-solutions">Giải pháp doanh nghiệp</option>
                                        <option value="security-software">Phần mềm bảo mật</option>
                                        <option value="data-protection">Bảo vệ dữ liệu</option>
                                        <option value="design-software">Phần mềm thiết kế</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Giữ Ctrl để chọn nhiều danh mục</p>
                                </div>

                                <div>
                                    <label htmlFor="requirements" className="block mb-2 font-medium text-gray-700">
                                        Yêu cầu hệ thống
                                    </label>
                                    <input
                                        type="text"
                                        id="requirements"
                                        name="requirements"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Windows 10/11, macOS 10.15+, Linux"
                                    />
                                </div>

                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        name="isPublished"
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                                        Xuất bản sản phẩm
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
                                        Mô tả chi tiết <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="features" className="block mb-2 font-medium text-gray-700">
                                        Tính năng nổi bật
                                    </label>
                                    <textarea
                                        id="features"
                                        name="features"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Mỗi tính năng một dòng"
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Mỗi dòng là một tính năng</p>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-4">
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            {selectedProductId ? 'Cập nhật' : 'Thêm sản phẩm'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    onClick={handleCancelEdit}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Danh sách sản phẩm */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">Danh sách sản phẩm</h2>

                    {isLoading ? (
                        <div className="p-4 flex justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
                            <p className="mb-4">Hãy thêm sản phẩm mới để bắt đầu quản lý.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Danh mục
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giá
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                                                        {product.images && product.images[0] && (
                                                            <Image
                                                                width={40}
                                                                height={40}
                                                                src={product.images[0].url}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500">{product.shortDescription}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {product.categories && Array.isArray(product.categories) 
                                                        ? product.categories.map(cat => cat?.name || '').join(', ')
                                                        : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.versions && product.versions.length > 0 && product.versions[0] ? (
                                                    <div>
                                                        <span className="text-gray-900 font-medium">
                                                            {formatCurrency(product.versions[0].price || 0)}
                                                        </span>
                                                        {product.versions[0].originalPrice && product.versions[0].price && 
                                                         product.versions[0].originalPrice > product.versions[0].price && (
                                                            <span className="text-xs text-gray-500 line-through ml-2">
                                                                {formatCurrency(product.versions[0].originalPrice || 0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.isPublished ? (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Công khai
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        Nháp
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <span className="text-gray-300">|</span>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal xác nhận xóa */}
            {isDeleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

>>>>>>> 2aea817a
export default withAdminAuth(ProductsManagement); 