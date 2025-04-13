import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Hiển thị trạng thái đang tải khi đang kiểm tra session
  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Đang tải... - XLab</title>
        </Head>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </>
    );
  }
  
  // Nếu người dùng đã đăng nhập, hiển thị trang tài khoản
  return (
    <>
      <Head>
        <title>Tài khoản của tôi - XLab</title>
      </Head>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Thông tin tài khoản</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Chi tiết về tài khoản của bạn.</p>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Họ tên</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session?.user?.name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session?.user?.email}</dd>
              </div>
              {session?.user?.image && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ảnh đại diện</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <img 
                      src={session.user.image} 
                      alt="Avatar" 
                      className="h-20 w-20 rounded-full"
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Các hoạt động mới nhất của bạn.</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="text-center py-10">
                <p className="text-gray-500">Chưa có hoạt động nào gần đây.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 