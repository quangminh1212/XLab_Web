'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';

export default function GoogleCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Function to get token from URL or localStorage
  const getToken = (): string | null => {
    try {
      // Check if we're in the browser
      if (typeof window !== 'undefined') {
        // Parse the URL hash or search params (handles both # and ? formats)
        const parsedHash = queryString.parse(window.location.hash);
        const parsedSearch = queryString.parse(window.location.search);
        
        // Get token from hash (prioritize this as it's more common with implicit flow)
        const accessToken = parsedHash.access_token || parsedSearch.access_token;
        
        if (accessToken) {
          // Store token in localStorage for future use
          localStorage.setItem('googleAccessToken', String(accessToken));
          setDebugInfo((prev: any) => ({ ...prev, tokenSource: 'URL', token: String(accessToken) }));
          return String(accessToken);
        }
        
        // If not in URL, try localStorage
        const storedToken = localStorage.getItem('googleAccessToken');
        if (storedToken) {
          setDebugInfo((prev: any) => ({ ...prev, tokenSource: 'localStorage', token: storedToken }));
          return storedToken;
        }
      }
      
      setError('Không tìm thấy token đăng nhập');
      return null;
    } catch (err) {
      setError(`Lỗi khi lấy token: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  // Function to get user information from Google API
  const getUserInfo = async (token: string) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setUserInfo(data);
      setDebugInfo((prev: any) => ({ ...prev, userData: data }));
      
      // Store user data in localStorage
      localStorage.setItem('googleUserInfo', JSON.stringify(data));
      
      return data;
    } catch (err) {
      setError(`Lỗi khi lấy thông tin người dùng: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  // Render user information
  const renderUserInfo = () => {
    if (!userInfo) return null;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Thông tin người dùng</h2>
        {userInfo.picture && (
          <img 
            src={userInfo.picture} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full mb-4"
          />
        )}
        <p><strong>Tên:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Email đã xác thực:</strong> {userInfo.email_verified ? "Có" : "Không"}</p>
        
        <div className="mt-6">
          <Link href="/account" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Đi đến trang tài khoản
          </Link>
        </div>
      </div>
    );
  };

  // Process OAuth callback
  useEffect(() => {
    const processCallback = async () => {
      try {
        setLoading(true);
        
        // Get token from URL or localStorage
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Get user information
        const userData = await getUserInfo(token);
        if (userData) {
          // Automatically redirect to account page after 2 seconds
          setTimeout(() => {
            router.push('/account');
          }, 2000);
        }
        
        setLoading(false);
      } catch (err) {
        setError(`Lỗi xử lý callback: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };

    processCallback();
  }, [router]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Đăng nhập Google</h1>
      
      {loading && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Đang xử lý đăng nhập...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Lỗi:</strong> {error}</p>
        </div>
      )}
      
      {!loading && !error && userInfo && renderUserInfo()}
      
      {/* Debug information (for development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
          <pre className="whitespace-pre-wrap bg-gray-200 p-2 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 