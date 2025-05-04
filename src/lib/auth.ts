import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Hook kiểm tra và đảm bảo trạng thái xác thực chính xác
 * Giải quyết vấn đề về hydration và server-side rendering
 */
export function useAuthStatus() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Không trả về kết quả không chính xác khi đang ở server-side
  if (!isClient) {
    return {
      isAuthenticated: false,
      isLoading: true,
      session: null,
    };
  }
  
  return {
    isAuthenticated: status === 'authenticated' && !!session,
    isLoading: status === 'loading',
    session,
  };
}

// Hàm tiện ích để kiểm tra session
export function isValidSession(session: any): boolean {
  return (
    !!session && 
    !!session.user && 
    typeof session.user === 'object' &&
    (!!session.user.email || !!session.user.name)
  );
} 