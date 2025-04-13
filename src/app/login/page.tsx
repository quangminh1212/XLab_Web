'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý các error từ callback
  useEffect(() => {
    const error = searchParams.get("error");
    const callbackUrl = searchParams.get("callbackUrl");
    const errorDescription = searchParams.get("error_description");

    // Thu thập thông tin debug
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    setDebugInfo(JSON.stringify(paramsObj, null, 2));
    
    if (error) {
      console.error("Login error:", error, "Description:", errorDescription);
      switch (error) {
        case "CredentialsSignin":
          setErrorMessage("Email hoặc mật khẩu không đúng.");
          break;
        case "OAuthSignin":
          setErrorMessage("Lỗi khi khởi tạo đăng nhập OAuth. Vui lòng thử lại sau.");
          break;
        case "OAuthCallback":
          setErrorMessage("Lỗi trong quá trình xử lý callback từ nhà cung cấp OAuth.");
          break;
        case "OAuthCreateAccount":
          setErrorMessage("Không thể tạo tài khoản OAuth. Tài khoản có thể đã tồn tại.");
          break;
        case "EmailCreateAccount":
          setErrorMessage("Không thể tạo tài khoản đăng nhập bằng email. Email có thể đã được sử dụng.");
          break;
        case "Callback":
          setErrorMessage("Lỗi trong quá trình xử lý callback. Vui lòng thử lại sau.");
          break;
        case "AccessDenied":
          setErrorMessage("Bạn không có quyền truy cập tài nguyên này.");
          break;
        case "google":
          setErrorMessage("Lỗi khi đăng nhập với Google. Vui lòng thử lại.");
          break;
        default:
          setErrorMessage(`Lỗi đăng nhập: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
      }
    }

    if (callbackUrl) {
      console.log("Callback URL:", callbackUrl);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      console.log("Google sign-in with callback URL:", callbackUrl);

      // Thử đăng nhập Google với redirect thay vì gọi trực tiếp
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
      
      // Lưu ý: Không cần xử lý kết quả ở đây vì redirect:true
      // đã chuyển hướng người dùng đi rồi
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMessage("Lỗi khi đăng nhập với Google. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const result = await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
        callbackUrl,
      });

      console.log("Credentials sign-in result:", result);

      if (result?.error) {
        setErrorMessage("Email hoặc mật khẩu không đúng.");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Lỗi đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Địa chỉ email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={loginData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={loginData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Image 
                src="/google.svg" 
                alt="Google" 
                width={20} 
                height={20} 
                className="mr-2" 
              />
              Google
            </button>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && debugInfo && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h3>
            <pre className="text-xs overflow-auto max-h-40">{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 