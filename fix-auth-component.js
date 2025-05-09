/**
 * Script to create the withAdminAuth component if it's missing
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn đến component withAdminAuth
const componentPath = path.join(__dirname, 'src', 'components', 'withAdminAuth.tsx');
const componentDir = path.join(__dirname, 'src', 'components');

// Kiểm tra xem component đã tồn tại chưa
if (!fs.existsSync(componentPath)) {
  console.log('Không tìm thấy component withAdminAuth, đang tạo...');

  // Tạo thư mục nếu chưa tồn tại
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
    console.log(`Đã tạo thư mục: ${componentDir}`);
  }

  // Nội dung của component
  const componentContent = `'use client';

import { useEffect, ComponentType } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Higher Order Component để bảo vệ các trang admin
function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAdminAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
      // Kiểm tra nếu người dùng đang tải
      if (status === 'loading') return;
      
      // Kiểm tra nếu không có session thì chuyển hướng về trang đăng nhập
      if (!session) {
        signIn();
        return;
      }
      
      // Kiểm tra nếu người dùng không phải admin thì chuyển hướng về trang chủ
      // Giả sử vai trò admin được lưu trong session.user.role
      if (session.user && (session.user as any).role !== 'admin') {
        router.push('/');
        return;
      }
    }, [session, status, router]);
    
    // Hiển thị màn hình loading trong khi kiểm tra xác thực
    if (status === 'loading' || !session) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    // Kiểm tra nếu không phải admin thì hiển thị thông báo
    if (session.user && (session.user as any).role !== 'admin') {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập vào trang này.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Quay về trang chủ
          </button>
        </div>
      );
    }
    
    // Nếu người dùng là admin, hiển thị component
    return <Component {...props} />;
  };
}

export default withAdminAuth;`;

  // Ghi nội dung vào file
  fs.writeFileSync(componentPath, componentContent);
  console.log(`✅ Đã tạo component withAdminAuth tại: ${componentPath}`);
} else {
  console.log('Component withAdminAuth đã tồn tại');
}

// Kiểm tra xem thư mục auth có tồn tại không
const authComponentDir = path.join(__dirname, 'src', 'components', 'auth');
if (!fs.existsSync(authComponentDir)) {
  fs.mkdirSync(authComponentDir, { recursive: true });
  console.log(`Đã tạo thư mục: ${authComponentDir}`);
}

// In thông báo kết thúc
console.log('Hoàn tất kiểm tra và sửa lỗi component withAdminAuth'); 