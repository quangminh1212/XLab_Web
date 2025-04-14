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
    async function fetchUserData() {
      try {
        setDebugInfo('Đang khởi tạo xử lý Google Callback...');
        const urlParams = new URL(window.location.href);
        setDebugInfo(prev => prev + `\nURL đầy đủ: ${urlParams.toString().substring(0, 50)}...`);
        
        // Kiểm tra hash fragment (sử dụng trong implicit flow)
        let accessToken = '';
        
        // Hiển thị thông tin debug
        setDebugInfo(prev => prev + '\n----------');
        setDebugInfo(prev => prev + `\nCó hash fragment: ${window.location.hash ? 'Có' : 'Không'}`);
        setDebugInfo(prev => prev + `\nCó search query: ${window.location.search ? 'Có' : 'Không'}`);
        
        // Xử lý theo hash fragment (implicit flow)
        if (window.location.hash) {
          setDebugInfo(prev => prev + '\nĐang xử lý theo implicit flow (hash fragment)');
          
          try {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            accessToken = hashParams.get('access_token') || '';
            const expiresIn = hashParams.get('expires_in') || '';
            const tokenType = hashParams.get('token_type') || '';
            
            setDebugInfo(prev => prev + `\nAccess token: ${accessToken ? accessToken.substring(0, 10) + '...' : 'Không có'}`);
            setDebugInfo(prev => prev + `\nExpires in: ${expiresIn}`);
            setDebugInfo(prev => prev + `\nToken type: ${tokenType}`);
            
            if (!accessToken) {
              throw new Error('Không tìm thấy access token trong hash fragment');
            }
          } catch (err) {
            setDebugInfo(prev => prev + `\nLỗi khi phân tích hash fragment: ${err}`);
            throw new Error('Lỗi khi xử lý hash fragment từ Google');
          }
        }
        // Xử lý theo query parameters (authorization code flow)
        else if (window.location.search) {
          setDebugInfo(prev => prev + '\nĐang xử lý theo authorization code flow (search query)');
          
          const searchParams = new URLSearchParams(window.location.search);
          const code = searchParams.get('code');
          const error = searchParams.get('error');
          
          setDebugInfo(prev => prev + `\nCode: ${code ? 'Có (độ dài ' + code.length + ')' : 'Không có'}`);
          setDebugInfo(prev => prev + `\nError: ${error || 'Không có'}`);
          
          if (error) {
            throw new Error(`Google trả về lỗi: ${error}`);
          }
          
          if (code) {
            // Thường cần backend để đổi code lấy token
            setDebugInfo(prev => prev + '\nCần backend để đổi code lấy token');
            setDebugInfo(prev => prev + '\nĐang chuyển hướng sang NextAuth để xử lý code...');
            
            // Chuyển hướng đến NextAuth callback
            const origin = window.location.origin;
            router.push(`${origin}/api/auth/callback/google${window.location.search}`);
            return;
          } else {
            throw new Error('Không tìm thấy code trong URL query parameters');
          }
        } else {
          setDebugInfo(prev => prev + '\nKhông tìm thấy thông tin xác thực trong URL');
          throw new Error('Không tìm thấy thông tin xác thực trong URL');
        }

        // Từ đây chỉ xử lý cho implicit flow với accessToken
        if (!accessToken) {
          setDebugInfo(prev => prev + '\nKhông có access token để tiếp tục');
          throw new Error('Không tìm thấy access token');
        }

        setDebugInfo(prev => prev + '\n----------');
        setDebugInfo(prev => prev + '\nĐang gọi Google API để lấy thông tin người dùng...');
        
        try {
          // Gọi API của Google để lấy thông tin người dùng
          const response = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
            }
          );
          
          setDebugInfo(prev => prev + `\nGoogle API response status: ${response.status}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            setDebugInfo(prev => prev + `\nLỗi từ Google API: ${errorText}`);
            throw new Error(`Google API trả về lỗi: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          setDebugInfo(prev => prev + `\nĐã nhận dữ liệu người dùng: email=${data.email}, id=${data.id}`);
          setUserData(data);

          // Lưu thông tin người dùng vào localStorage
          const userToStore = {
            id: data.id,
            name: data.name,
            email: data.email,
            picture: data.picture,
            email_verified: data.verified_email
          };
          
          localStorage.setItem('user_profile', JSON.stringify(userToStore));
          localStorage.setItem('google_access_token', accessToken);
          localStorage.setItem('isLoggedIn', 'true');
          
          setDebugInfo(prev => prev + '\nĐã lưu thông tin người dùng vào localStorage');
          toast.success('Đăng nhập thành công!');

          // Chuyển hướng sau 2 giây
          setDebugInfo(prev => prev + '\nSẽ chuyển hướng đến /account sau 2 giây...');
          setTimeout(() => {
            router.push('/account');
          }, 2000);
        } catch (apiError: any) {
          setDebugInfo(prev => prev + `\nLỗi khi gọi Google API: ${apiError.message}`);
          throw apiError;
        }
      } catch (err: any) {
        console.error('Lỗi xử lý Google callback:', err);
        setError(err.message || 'Đã xảy ra lỗi khi xử lý đăng nhập Google');
        setDebugInfo(prev => prev + `\n\nLỗI CHÍNH: ${err.message}`);
        toast.error(err.message || 'Lỗi xử lý đăng nhập');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
            X
          </div>
        </div>
        
        {loading && (
          <div className="my-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang xử lý đăng nhập...</p>
          </div>
        )}

        {error && (
          <div className="my-8">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 text-left">
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
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Quay lại trang đăng nhập
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Xin chào, {userData.name}!
            </h2>
            <p className="text-gray-600 mb-6">
              Đăng nhập thành công, bạn sẽ được chuyển hướng tự động...
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
                    Đăng nhập thành công. Đang chuyển hướng đến tài khoản của bạn...
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