import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image'; // Nếu bạn dùng Image component của Next.js

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/account' }); // Chuyển hướng đến /account sau khi đăng nhập thành công
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Triển khai logic đăng nhập bằng email/password nếu cần
    console.log('Login with email:', email, password);
    // signIn('credentials', { email, password, callbackUrl: '/account' }); // Ví dụ nếu dùng credentials provider
  };

  return (
    <>
      <Head>
        <title>Đăng nhập - XLab</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
          {/* Logo và Tiêu đề */} 
          <div className="mb-8">
            {/* Thay bằng component Logo của bạn nếu có */}
            <div className="mx-auto h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xl mb-4">
              X
            </div>
            <h1 className="text-2xl font-bold mb-2">Chào mừng trở lại!</h1>
            <p className="text-gray-600">Đăng nhập để tiếp tục sử dụng các dịch vụ của XLab</p>
          </div>

          {/* Form Đăng nhập */} 
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
            {/* Nút Google Sign In */}
            <button 
              onClick={handleGoogleSignIn}
              className="w-full border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center mb-6 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              {/* Thay bằng icon Google SVG hoặc Image */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg"><path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4"/><path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"/><path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04"/><path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 340.6 0 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335"/></svg>
              <span>Tiếp tục với Google</span>
            </button>

            {/* Đường phân cách */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng email</span>
              </div>
            </div>

            {/* Form Email/Password */}
            <form onSubmit={handleEmailSignIn}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="email">
                  Email
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  id="email" 
                  type="email" 
                  placeholder="ten@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="password">
                  Mật khẩu
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
              </div>
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-600">
                  <input className="mr-2 leading-tight" type="checkbox" />
                  <span className="text-sm">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="inline-block align-baseline font-bold text-sm text-teal-500 hover:text-teal-800">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="flex items-center justify-center">
                <button 
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out"
                  type="submit"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
             {/* Link đăng ký */}
             <p className="text-center text-gray-500 text-xs mt-6">
               Chưa có tài khoản? 
               <a href="/register" className="text-teal-500 hover:text-teal-800 font-bold"> Đăng ký ngay</a>
             </p>
          </div>
        </main>
      </div>
    </>
  );
} 