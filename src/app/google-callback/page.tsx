'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

export default function GoogleCallback() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Hàm xử lý callback từ Google OAuth
    async function processOAuthCallback() {
      try {
        setDebugInfo('=== Google Callback Page ===');
        setDebugInfo(prev => prev + `\nThời gian: ${new Date().toISOString()}`);
        setDebugInfo(prev => prev + `\nURL đầy đủ: ${window.location.href.substring(0, 50)}...`);
        
        // Kiểm tra xem có hash fragment không (#access_token=...)
        if (!window.location.hash) {
          setDebugInfo(prev => prev + '\nKhông có hash fragment trong URL');
          setDebugInfo(prev => prev + '\nCó thể là code flow hoặc không có token');
          
          // Nếu có search params (code flow), chuyển đến NextAuth callback
          if (window.location.search) {
            setDebugInfo(prev => prev + '\nCó search query, giả sử là code flow');
            setDebugInfo(prev => prev + '\nChuyển hướng đến NextAuth callback...');
            
            const origin = window.location.origin;
            router.push(`${origin}/api/auth/callback/google${window.location.search}`);
            return;
          }
          
          throw new Error('Không tìm thấy token hoặc code trong URL');
        }
        
        // Xử lý hash fragment để lấy access token
        setDebugInfo(prev => prev + '\nĐang xử lý hash fragment (#)');
        const hashFragment = window.location.hash.substring(1); // remove '#'
        const params = new URLSearchParams(hashFragment);
        
        // Lấy token và các thông tin khác
        const accessToken = params.get('access_token');
        const tokenType = params.get('token_type');
        const expiresIn = params.get('expires_in');
        
        setDebugInfo(prev => prev + `\nAccess token: ${accessToken ? '✓ (nhận được)' : '✗ (thiếu)'}`);
        setDebugInfo(prev => prev + `\nToken type: ${tokenType || 'không có'}`);
        setDebugInfo(prev => prev + `\nExpires in: ${expiresIn || 'không có'} giây`);
        
        if (!accessToken) {
          throw new Error('Không tìm thấy access token trong URL');
        }
        
        // Gọi Google API để lấy thông tin người dùng
        setDebugInfo(prev => prev + '\n\n=== Đang gọi Google API ===');
        
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        setDebugInfo(prev => prev + `\nAPI response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Google API trả về lỗi: ${response.status} - ${errorText}`);
        }
        
        // Xử lý dữ liệu người dùng nhận được
        const data = await response.json();
        setDebugInfo(prev => prev + `\nNhận được dữ liệu người dùng: ${JSON.stringify(data).substring(0, 100)}...`);
        setUserData(data);
        
        // Lưu thông tin người dùng vào localStorage
        const userInfo = {
          id: data.id,
          name: data.name,
          email: data.email,
          picture: data.picture,
          email_verified: data.verified_email
        };
        
        localStorage.setItem('user_profile', JSON.stringify(userInfo));
        localStorage.setItem('google_access_token', accessToken);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('login_time', new Date().toISOString());
        
        setDebugInfo(prev => prev + '\nĐã lưu thông tin người dùng vào localStorage');
        toast.success('Đăng nhập thành công!');
        
        // Chuyển hướng sau 1.5 giây
        setTimeout(() => {
          router.push('/account');
        }, 1500);
        
      } catch (err: any) {
        console.error('Lỗi xử lý OAuth callback:', err);
        setError(err.message || 'Lỗi không xác định');
        setDebugInfo(prev => prev + `\n\n=== LỖI ===\n${err.message || 'Lỗi không xác định'}`);
        toast.error('Đăng nhập thất bại');
      } finally {
        setLoading(false);
      }
    }
    
    processOAuthCallback();
  }, [router]);

  // Thử đăng nhập lại nếu có lỗi
  const handleRetry = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
            X
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {loading ? "Đang xử lý đăng nhập..." : 
           error ? "Đăng nhập thất bại" : 
           "Đăng nhập thành công"}
        </h2>
        
        {loading && (
          <div className="my-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang xử lý thông tin từ Google...</p>
          </div>
        )}

        {error && (
          <div className="my-8">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 text-left">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Lỗi đăng nhập</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Thử lại
              </button>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {userData && (
          <div className="my-8">
            <div className="flex justify-center mb-4">
              {userData.picture && (
                <Image
                  src={userData.picture}
                  alt={userData.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Xin chào, {userData.name}!
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn đã đăng nhập thành công và sẽ được chuyển hướng tự động...
            </p>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 text-left">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Đang chuyển hướng đến trang tài khoản của bạn...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Debug information */}
        {debugInfo && (
          <div className="mt-8 p-3 bg-gray-100 rounded text-left">
            <details open={!!error}>
              <summary className="text-sm font-medium cursor-pointer">Thông tin debug</summary>
              <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-60 p-2 bg-gray-50 rounded">{debugInfo}</pre>
            </details>
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
} 