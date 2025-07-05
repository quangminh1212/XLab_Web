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
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/products');

        if (!response.ok) {
          throw new Error(language === 'vi' ? 'Không thể tải danh sách sản phẩm' : 'Could not load products list');
        }

        const data = await response.json();
        setProductList(data);
      } catch (err) {
        setError((err as Error).message);
        console.error(language === 'vi' ? 'Lỗi khi tải danh sách sản phẩm:' : 'Error loading products list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleDelete = async (productId: string) => {
    if (confirm(language === 'vi' ? 'Bạn có chắc chắn muốn xóa sản phẩm này?' : 'Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(language === 'vi' ? 'Không thể xóa sản phẩm' : 'Could not delete product');
        }

        // Remove the product from the list
        setProductList(productList.filter((product) => product.id !== productId));
        alert(language === 'vi' ? 'Đã xóa sản phẩm thành công!' : 'Product deleted successfully!');
      } catch (err) {
        setError((err as Error).message);
        console.error(language === 'vi' ? 'Lỗi khi xóa sản phẩm:' : 'Error deleting product:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = productList.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {language === 'vi' ? 'Quản lý sản phẩm' : 'Product Management'}
          </h1>
          <p className="text-gray-500 text-base mt-1">
            {language === 'vi' ? 'Quản lý danh sách sản phẩm của cửa hàng' : 'Manage your store products list'}
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {language === 'vi' ? 'Quay lại Dashboard' : 'Back to Dashboard'}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder={language === 'vi' ? "Tìm kiếm sản phẩm..." : "Search products..."}
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

            <Link
              href="/admin/products/new"
              className="bg-primary-600 text-white px-4 py-2.5 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center shadow-sm font-medium text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {language === 'vi' ? 'Thêm sản phẩm mới' : 'Add new product'}
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded">
            <div className="flex">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-base">{error}</span>
            </div>
          </div>
        )}

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
              {language === 'vi' ? 'Không tìm thấy sản phẩm nào' : 'No products found'}
            </p>
            <p className="text-gray-400 mt-1 text-base">
              {language === 'vi' 
                ? 'Hãy thêm sản phẩm mới hoặc thay đổi từ khóa tìm kiếm' 
                : 'Add new products or change your search query'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="w-16 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Hình ảnh' : 'Image'}
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Tên sản phẩm' : 'Product name'}
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
                    {language === 'vi' ? 'Giá' : 'Price'}
                  </th>
                  <th
                    scope="col"
                    className="w-1/6 px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Trạng thái' : 'Status'}
                  </th>
                  <th
                    scope="col"
                    className="w-20 px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Tùy chọn' : 'Actions'}
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
                        dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }}
                      ></div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono truncate">{product.id}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-base font-medium text-gray-900">
                        {(() => {
                          // Tìm giá thấp nhất từ tất cả các nguồn
                          let minPrice = Infinity;
                          let minPriceOption = '';

                          // Kiểm tra giá cơ bản của phiên bản đầu tiên (nếu có)
                          if (product.versions && product.versions.length > 0) {
                            product.versions.forEach((version) => {
                              // Bỏ qua giá 0
                              if (version.price > 0 && version.price < minPrice) {
                                minPrice = version.price;
                                minPriceOption = version.name || (language === 'vi' ? 'Phiên bản mặc định' : 'Default version');
                              }
                            });
                          }

                          // Kiểm tra các tùy chọn sản phẩm
                          if (
                            product.optionPrices &&
                            Object.keys(product.optionPrices).length > 0
                          ) {
                            Object.entries(product.optionPrices).forEach(([option, priceData]) => {
                              // Bỏ qua giá 0
                              if (priceData.price > 0 && priceData.price < minPrice) {
                                minPrice = priceData.price;
                                minPriceOption = option;
                              }
                            });
                          }

                          // Kiểm tra salePrice trước (nếu có và hợp lệ)
                          if (
                            product.salePrice &&
                            product.salePrice > 0 &&
                            product.salePrice < minPrice
                          ) {
                            minPrice = product.salePrice;
                            minPriceOption = language === 'vi' ? 'Giá khuyến mãi' : 'Sale price';
                          }

                          // Kiểm tra giá gốc của sản phẩm (nếu có)
                          if (product.price && product.price > 0 && product.price < minPrice) {
                            minPrice = product.price;
                            minPriceOption = language === 'vi' ? 'Giá gốc' : 'Original price';
                          }

                          // Nếu không có giá nào hợp lệ (khác 0) hoặc giá vẫn là Infinity
                          if (minPrice === Infinity) {
                            return language === 'vi' ? 'Chưa có giá' : 'No price set';
                          }

                          // Format giá tiền
                          const formattedPrice = new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(minPrice);

                          return (
                            <div>
                              <div className="font-medium text-primary-600">{formattedPrice}</div>
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {product.isPublished ? (
                        <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-green-100 text-green-800 inline-flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-1.5"></span>
                          {language === 'vi' ? 'Công khai' : 'Public'}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-800 inline-flex items-center">
                          <span className="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></span>
                          {language === 'vi' ? 'Nháp' : 'Draft'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors focus:outline-none p-1.5"
                          onClick={() => handleEdit(product.id)}
                          title={language === 'vi' ? "Sửa sản phẩm" : "Edit product"}
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
                          className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors focus:outline-none p-1.5"
                          onClick={() => handleDelete(product.id)}
                          title={language === 'vi' ? "Xóa sản phẩm" : "Delete product"}
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
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(AdminProductsPage);
