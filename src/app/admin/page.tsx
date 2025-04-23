'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import withAdminAuth from '@/components/withAdminAuth';

function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });

  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  // Tải danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  // Tải sản phẩm khi trang được tải
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts();
    }
  }, [status]);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.email !== 'xlab.rnd@gmail.com') {
        router.push('/');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const products = await response.json();
          setStats(prev => ({ ...prev, products: products.length }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Xử lý khi gửi form thêm sản phẩm mới
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Lấy dữ liệu form
      const form = event.currentTarget;
      const formData = new FormData(form);

      // Chuyển đổi FormData thành object
      const formValues: Record<string, any> = Object.fromEntries(formData.entries());

      // Xử lý checkbox cho isFeatured và isNew
      formValues.isFeatured = formData.has('isFeatured');
      formValues.isNew = formData.has('isNew');

      // Gọi API để tạo sản phẩm mới
      const response = await fetch('/api/products/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Sản phẩm đã được thêm thành công!');
        form.reset();
        setShowForm(false);
        // Tải lại danh sách sản phẩm
        fetchProducts();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tạo sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý sửa sản phẩm
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Lấy dữ liệu form
      const form = event.currentTarget;
      const formData = new FormData(form);

      // Chuyển đổi FormData thành object
      const formValues: Record<string, any> = Object.fromEntries(formData.entries());

      // Xử lý checkbox cho isFeatured và isNew
      formValues.isFeatured = formData.has('isFeatured');
      formValues.isNew = formData.has('isNew');

      // Gọi API để cập nhật sản phẩm
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Sản phẩm đã được cập nhật thành công!');
        setShowForm(false);
        setEditingProduct(null);
        // Tải lại danh sách sản phẩm
        fetchProducts();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi cập nhật sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý xóa sản phẩm
  const handleDeleteClick = (productId: string) => {
    setDeleteProductId(productId);
    setIsDeleting(true);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Gọi API để xóa sản phẩm
      const response = await fetch(`/api/products/${deleteProductId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Sản phẩm đã được xóa thành công!');
        // Tải lại danh sách sản phẩm
        fetchProducts();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsSubmitting(false);
      setIsDeleting(false);
      setDeleteProductId(null);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleting(false);
    setDeleteProductId(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  if (status === 'loading' || (status === 'authenticated' && session?.user?.email !== 'xlab.rnd@gmail.com')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primary-700 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
          <p className="mt-2">Xin chào, {session?.user?.name}!</p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm font-medium uppercase">Sản phẩm</h2>
            <p className="mt-2 text-3xl font-bold">{stats.products}</p>
            <div className="mt-1">
              <Link href="/admin/products" className="text-primary-600 hover:text-primary-800 text-sm">
                Quản lý sản phẩm →
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm font-medium uppercase">Người dùng</h2>
            <p className="mt-2 text-3xl font-bold">{stats.users}</p>
            <div className="mt-1">
              <span className="text-gray-500 text-sm">Đang phát triển...</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm font-medium uppercase">Đơn hàng</h2>
            <p className="mt-2 text-3xl font-bold">{stats.orders}</p>
            <div className="mt-1">
              <span className="text-gray-500 text-sm">Đang phát triển...</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm font-medium uppercase">Doanh thu</h2>
            <p className="mt-2 text-3xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
            </p>
            <div className="mt-1">
              <span className="text-gray-500 text-sm">Đang phát triển...</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Quản lý nội dung</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/products" className="text-primary-600 hover:text-primary-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Quản lý sản phẩm
                </Link>
              </li>
              <li>
                <span className="text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Quản lý danh mục (đang phát triển)
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Quản lý hệ thống</h2>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Quản lý người dùng (đang phát triển)
                </span>
              </li>
              <li>
                <span className="text-gray-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cài đặt hệ thống (đang phát triển)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Xác nhận xóa
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(AdminDashboard); 