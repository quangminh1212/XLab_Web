'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import withAdminAuth from '@/components/withAdminAuth';
import { Product } from '@/models/ProductModel';
import { useLanguage } from '@/contexts/LanguageContext';

function AdminProductsPage() {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/products');

        if (!response.ok) {
          throw new Error(t('admin.products.loadError') || 'Could not load products list');
        }

        const data = await response.json();
        setProductList(data);
      } catch (err) {
        setError((err as Error).message);
        console.error(t('admin.products.loadErrorLog') || 'Error loading products list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleDelete = async (productId: string) => {
    if (confirm(t('admin.products.confirmDelete') || 'Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(t('admin.products.deleteError') || 'Could not delete product');
        }

        // Remove the product from the list
        setProductList(productList.filter((product) => product.id !== productId));
        alert(t('admin.products.deleteSuccess') || 'Product deleted successfully!');
      } catch (err) {
        setError((err as Error).message);
        console.error(t('admin.products.deleteErrorLog') || 'Error deleting product:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? productList.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productList;

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Xử lý dịch mô tả ngắn cho sản phẩm
  const getProductShortDescription = (product: Product) => {
    // Nếu có mã định danh sản phẩm đặc biệt (chatgpt, grok), sử dụng bản dịch từ file
    if (product.id === 'chatgpt' || product.id === 'grok') {
      return t(`product.${product.id}.shortDescription`) || product.shortDescription;
    } else {
      return product.shortDescription;
    }
  };

  // Xử lý hiển thị trạng thái sản phẩm
  const getProductStatusText = (isPublished: boolean) => {
    return isPublished ? t('product.status.public') || t('admin.products.statusPublic') : t('product.status.draft') || t('admin.products.statusDraft');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.products.title')}</h1>
        <Link
          href="/admin"
          className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm"
        >
          <span>← {t('admin.products.backToDashboard') || 'Back to Dashboard'}</span>
        </Link>
      </div>

      <p className="text-gray-600">{t('admin.products.subtitle')}</p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder={t('admin.products.searchPlaceholder') || "Search products..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            {/* Add Product Button */}
            <button
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t('admin.products.addNew') || 'Add new product'}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500 text-xl">
              {t('admin.products.noProducts') || 'No products found'}
            </p>
            <p className="text-gray-400 mt-1 text-base">
              {t('admin.products.noProductsSubtext') || 'Add new products or change your search query'}
            </p>
          </div>
        ) :
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="w-16 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.products.image') || 'Image'}
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.products.name') || 'Product name'}
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.products.price') || 'Price'}
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.products.status') || 'Status'}
                  </th>
                  <th
                    scope="col"
                    className="w-20 px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.products.actions') || 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="relative h-14 w-14 border rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={
                            Array.isArray(product.images) && product.images.length > 0
                              ? typeof product.images[0] === 'string'
                                ? product.images[0]
                                : product.images[0]?.url || '/images/placeholder/product.png'
                              : '/images/placeholder/product.png'
                          }
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div
                        className="text-base font-medium text-gray-900 hover:text-primary-600 transition-colors cursor-pointer truncate"
                        onClick={() => handleEdit(product.id)}
                      >
                        {product.name}
                      </div>
                      <div
                        className="text-sm text-gray-500 truncate max-w-[250px]"
                        dangerouslySetInnerHTML={{ __html: getProductShortDescription(product) || '' }}
                      ></div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono truncate">{product.id}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.versions && product.versions.length > 0 ? product.versions[0].price : 0)}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${
                          product.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getProductStatusText(product.isPublished)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title={t('admin.products.edit')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                          title={t('admin.products.delete')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}

export default withAdminAuth(AdminProductsPage);
