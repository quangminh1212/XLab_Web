import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>XLab - Trang chủ</title>
        <meta name="description" content="XLab - Sản phẩm và dịch vụ công nghệ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          {session ? (
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h1 className="text-3xl font-bold text-gray-900">Xin chào, {session.user?.name}!</h1>
              <p className="mt-2 text-lg text-gray-600">
                Bạn đã đăng nhập thành công với tài khoản Google.
              </p>
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800">Thông tin tài khoản</h2>
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {session.user?.email}
                  </p>
                  {session.user?.image && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Ảnh đại diện:</span>
                      <div className="mt-1">
                        <img 
                          src={session.user.image} 
                          alt="Avatar" 
                          className="h-20 w-20 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                Chào mừng đến với XLab
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                Giải pháp công nghệ tốt nhất cho doanh nghiệp của bạn
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10"
                  >
                    Bắt đầu ngay
                  </a>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a
                    href="/dich-vu"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Tìm hiểu thêm
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 