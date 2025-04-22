'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Định nghĩa các kiểu dữ liệu
interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface Order {
  id: number;
  total: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin');
    } else if (status === 'authenticated') {
      // Trong thực tế, cần thêm kiểm tra role của user
      // Ví dụ: if (session.user.role !== 'admin') { router.push('/'); }
      setIsLoading(false);
    }
  }, [status, router]);
  
  // Giả lập fetch dữ liệu
  useEffect(() => {
    if (status === 'authenticated') {
      // Trong thực tế sẽ gọi API
      setTimeout(() => {
        setUsers([{ id: 1, name: 'User A' }, { id: 2, name: 'User B' }]);
        setProducts([{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }]);
        setOrders([{ id: 1, total: 100 }, { id: 2, total: 200 }]);
      }, 1000);
    }
  }, [status]);
  
  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Xử lý đăng xuất
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nội dung trang admin
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-8">Trang Quản Trị</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Người dùng</h2>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/users" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
              Quản lý người dùng
            </Link>
            <Link href="/admin/products" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
              Quản lý sản phẩm
            </Link>
            <Link href="/admin/orders" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
              Quản lý đơn hàng
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600">Chưa có hoạt động nào gần đây.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 