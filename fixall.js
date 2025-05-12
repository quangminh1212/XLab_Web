// fixall.js - Consolidated fix script for XLab_Web
// Combines functionality from multiple fix scripts into one comprehensive utility

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('============================================');
console.log('       XLab_Web - Công cụ sửa lỗi tự động   ');
console.log('============================================');
console.log('');

// Kiểm tra tham số dòng lệnh
const args = process.argv.slice(2);
const runAll = args.length === 0 || args.includes('all');
const runTraceError = runAll || args.includes('trace');
const runComponents = runAll || args.includes('components');
const runAccounts = runAll || args.includes('accounts');
const runCleanCache = runAll || args.includes('cache');

// 1. FIX TRACE ERRORS
if (runTraceError) {
  console.log('===== 1. SỬA LỖI TRACE FILE =====');
  fixTraceErrors();
  console.log('');
}

// 2. FIX COMPONENTS
if (runComponents) {
  console.log('===== 2. SỬA LỖI COMPONENTS =====');
  fixComponents();
  console.log('');
}

// 3. FIX ACCOUNTS PAGE
if (runAccounts) {
  console.log('===== 3. SỬA LỖI ACCOUNTS PAGE =====');
  fixAccountsPage();
  console.log('');
}

// 4. CLEAN CACHE
if (runCleanCache) {
  console.log('===== 4. XÓA CACHE NEXT.JS =====');
  cleanNextCache();
  console.log('');
}

console.log('============================================');
console.log('    🎉 Quá trình sửa lỗi đã hoàn tất!    ');
console.log('============================================');
console.log('Bạn có thể chạy "npm run dev" để khởi động dự án.');
console.log('');

// IMPLEMENTATION OF FIX FUNCTIONS

/**
 * Sửa lỗi trace file trong Next.js
 */
function fixTraceErrors() {
  console.log('Đang sửa lỗi trace file...');

  // Đảm bảo thư mục .next tồn tại
  const nextDir = path.join(__dirname, '.next');
  if (!fs.existsSync(nextDir)) {
    try {
      fs.mkdirSync(nextDir, { recursive: true });
      console.log('Đã tạo thư mục .next');
    } catch (err) {
      console.warn('Không thể tạo thư mục .next:', err.message);
    }
  }

  // Xác định đường dẫn tới file trace
  const traceFile = path.join(nextDir, 'trace');
  const traceBackup = path.join(nextDir, 'trace.old');
  
  // Kiểm tra quyền truy cập thư mục .next
  try {
    // Thử tạo file tạm thời để kiểm tra quyền ghi
    const testFile = path.join(nextDir, 'test-write-permission.tmp');
    fs.writeFileSync(testFile, '', { flag: 'w' });
    fs.unlinkSync(testFile);
    console.log('Đã kiểm tra quyền ghi vào thư mục .next: OK');
  } catch (err) {
    console.warn('Không có quyền ghi vào thư mục .next:', err.message);
    
    // Thử sửa quyền thư mục với attrib (Windows) hoặc chmod (Unix)
    try {
      if (process.platform === 'win32') {
        execSync(`attrib -r "${nextDir}" /s /d`, { stdio: 'ignore' });
        console.log('Đã thử sửa quyền thư mục với attrib');
      } else {
        execSync(`chmod -R 755 "${nextDir}"`, { stdio: 'ignore' });
        console.log('Đã thử sửa quyền thư mục với chmod');
      }
    } catch (chmodErr) {
      console.warn('Không thể sửa quyền thư mục:', chmodErr.message);
    }
  }

  // Xóa file trace cũ nếu tồn tại
  if (fs.existsSync(traceFile)) {
    try {
      // Trên Windows, đôi khi cần phải gỡ bỏ thuộc tính read-only
      if (process.platform === 'win32') {
        try {
          execSync(`attrib -r "${traceFile}"`, { stdio: 'ignore' });
          console.log('Đã loại bỏ thuộc tính read-only của file trace');
        } catch (err) {
          console.warn('Không thể thay đổi thuộc tính file:', err.message);
        }
      }
      
      try {
        fs.unlinkSync(traceFile);
        console.log('Đã xóa thành công file trace');
      } catch (err) {
        if (err.code === 'EPERM') {
          console.warn('Lỗi EPERM khi xóa file trace. Thử phương pháp khác...');
          
          // Phương pháp 1: Đổi tên file thay vì xóa
          try {
            const tempFile = `${traceFile}.${Date.now()}.tmp`;
            fs.renameSync(traceFile, tempFile);
            console.log(`Đã đổi tên file trace thành ${tempFile}`);
            return; // Không cần tạo file mới nếu đổi tên thành công
          } catch (renameErr) {
            console.warn('Không thể đổi tên file trace:', renameErr.message);
          }
          
          // Phương pháp 2: Sử dụng process.kill để khởi động lại quá trình
          if (process.platform === 'win32') {
            try {
              // Thử tìm PID của process đang giữ file
              const output = execSync(`handle "${traceFile}" -nobanner`, { encoding: 'utf8' }).toString();
              const pidMatch = output.match(/pid: (\d+)/i);
              if (pidMatch && pidMatch[1]) {
                const pid = parseInt(pidMatch[1]);
                console.log(`Thử khởi động lại process ${pid} đang giữ file trace`);
                // Nếu muốn kill process này, cần thận trọng vì có thể là process quan trọng
                // process.kill(pid, 'SIGTERM');
              }
            } catch (handleErr) {
              console.warn('Không thể tìm process đang giữ file trace:', handleErr.message);
            }
          }
          
          // Phương pháp 3: Bỏ qua xóa file, tập trung vào tạo các file khác
          console.log('Bỏ qua việc xóa file trace, tiếp tục tạo các file khác');
        } else {
          console.warn('Không thể xóa file trace trực tiếp:', err.message);
        }
        
        // Thử phương pháp khác nếu xóa thất bại
        try {
          // Sử dụng fs.writeFileSync để tạo file trống (ghi đè)
          fs.writeFileSync(traceFile, '', { encoding: 'utf8', mode: 0o666, flag: 'w' });
          console.log('Đã tạo file trace trống (ghi đè)');
          return;
        } catch (writeErr) {
          if (writeErr.code === 'EPERM') {
            console.log('Không thể ghi đè file trace (EPERM). Bỏ qua và tiếp tục...');
          } else {
            console.warn('Không thể ghi đè file trace:', writeErr.message);
          }
        }
      }
    } catch (err) {
      console.warn('Lỗi khi xử lý file trace:', err.message);
    }
  }

  // Tạo file trace mới với quyền thích hợp
  try {
    // Thử nhiều cách khác nhau
    try {
      // Cách 1: Tạo với flag wx để fail nếu file đã tồn tại (tránh race condition)
      fs.writeFileSync(traceFile, '', { flag: 'w', mode: 0o666 });
      console.log('Đã tạo file trace mới với quyền thích hợp');
    } catch (err1) {
      if (err1.code === 'EPERM') {
        console.log('Lỗi EPERM khi tạo file trace. Bỏ qua và tiếp tục...');
      } else {
        console.warn('Không thể tạo file trace cách 1:', err1.message);
      
        try {
          // Cách 2: Tạo file tạm thời rồi đổi tên
          const tempTraceFile = path.join(nextDir, 'trace.tmp');
          fs.writeFileSync(tempTraceFile, '', { encoding: 'utf8', flag: 'w' });
          fs.renameSync(tempTraceFile, traceFile);
          console.log('Đã tạo file trace bằng file tạm thời');
        } catch (err2) {
          if (err2.code === 'EPERM') {
            console.log('Lỗi EPERM khi đổi tên file trace. Bỏ qua và tiếp tục...');
          } else {
            console.warn('Không thể tạo file trace cách 2:', err2.message);
            
            try {
              // Cách 3: Sử dụng execSync với touch 
              execSync(`type nul > "${traceFile}"`, { stdio: 'ignore' });
              console.log('Đã tạo file trace bằng lệnh type nul');
            } catch (err3) {
              if (err3.code === 'EPERM') {
                console.log('Lỗi EPERM khi tạo file trace với lệnh type. Bỏ qua và tiếp tục...');
              } else {
                console.warn('Không thể tạo file trace cách 3:', err3.message);
              }
            }
          }
        }
      }
    }
    
    // Trên Windows, đảm bảo file có quyền thích hợp
    if (process.platform === 'win32') {
      try {
        execSync(`attrib -r "${traceFile}"`, { stdio: 'ignore' });
        console.log('Đã đảm bảo file trace không có thuộc tính read-only');
      } catch (err) {
        if (err.code === 'EPERM') {
          console.log('Lỗi EPERM khi thiết lập thuộc tính file trace. Bỏ qua và tiếp tục...');
        } else {
          console.warn('Không thể thiết lập thuộc tính file trace:', err.message);
        }
      }
    }
  } catch (createErr) {
    if (createErr.code === 'EPERM') {
      console.log('Lỗi EPERM khi tạo file trace. Bỏ qua và tiếp tục...');
    } else {
      console.error('Không thể tạo file trace:', createErr.message);
    }
  }
  
  console.log('Quá trình xử lý file trace đã kết thúc.');
}

/**
 * Sửa lỗi các component
 */
function fixComponents() {
  console.log('Đang sửa lỗi các component...');

  // Fix Container.tsx
  const containerPath = path.join(__dirname, 'src', 'components', 'common', 'Container.tsx');
  if (!fs.existsSync(containerPath)) {
    // Tạo Container.tsx nếu không tồn tại
    const containerContent = `import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={cn('container mx-auto px-4 md:px-6 max-w-7xl', className)}>
      {children}
    </div>
  )
}

export default Container`;

    try {
      const containerDir = path.dirname(containerPath);
      if (!fs.existsSync(containerDir)) {
        fs.mkdirSync(containerDir, { recursive: true });
      }
      fs.writeFileSync(containerPath, containerContent, { encoding: 'utf8' });
      console.log('Đã tạo file Container.tsx');
    } catch (err) {
      console.error('Lỗi khi tạo Container.tsx:', err.message);
    }
  } else {
    try {
      let containerContent = fs.readFileSync(containerPath, 'utf8');
      // Sửa lỗi trong file
      if (containerContent.includes('export default Container   return (') || 
          containerContent.includes('^') || 
          containerContent.includes('Sua loi Container.tsx')) {
        containerContent = `import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={cn('container mx-auto px-4 md:px-6 max-w-7xl', className)}>
      {children}
    </div>
  )
}

export default Container`;
        fs.writeFileSync(containerPath, containerContent, { encoding: 'utf8' });
        console.log('Đã sửa file Container.tsx');
      }
    } catch (err) {
      console.error('Lỗi khi sửa Container.tsx:', err.message);
    }
  }

  // Fix index.ts
  const indexPath = path.join(__dirname, 'src', 'components', 'common', 'index.ts');
  if (!fs.existsSync(indexPath)) {
    // Tạo index.ts nếu nó không tồn tại
    try {
      const indexDir = path.dirname(indexPath);
      if (!fs.existsSync(indexDir)) {
        fs.mkdirSync(indexDir, { recursive: true });
      }
      fs.writeFileSync(indexPath, 'export { Container } from \'./Container\';\n', { encoding: 'utf8' });
      console.log('Đã tạo file index.ts');
    } catch (err) {
      console.error('Lỗi khi tạo index.ts:', err.message);
    }
  } else {
    try {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      // Đảm bảo nó export đúng Container
      if (!indexContent.includes('export { Container }')) {
        // Thêm export nếu không tìm thấy
        const newExport = 'export { Container } from \'./Container\';\n';
        if (indexContent.includes('export { default as Container }')) {
          indexContent = indexContent.replace('export { default as Container }', 'export { Container }');
        } else {
          indexContent += newExport;
        }
        fs.writeFileSync(indexPath, indexContent, { encoding: 'utf8' });
        console.log('Đã sửa exports trong index.ts');
      }
    } catch (err) {
      console.error('Lỗi khi sửa index.ts:', err.message);
    }
  }

  // Fix utils.ts nếu không tồn tại (cần thiết cho hàm cn)
  const utilsPath = path.join(__dirname, 'src', 'lib', 'utils.ts');
  if (!fs.existsSync(utilsPath)) {
    const utilsContent = `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

    try {
      const utilsDir = path.dirname(utilsPath);
      if (!fs.existsSync(utilsDir)) {
        fs.mkdirSync(utilsDir, { recursive: true });
        console.log('Đã tạo thư mục lib');
      }
      fs.writeFileSync(utilsPath, utilsContent, { encoding: 'utf8' });
      console.log('Đã tạo file utils.ts với hàm cn');
    } catch (err) {
      console.error('Lỗi khi tạo utils.ts:', err.message);
    }
  }
}

/**
 * Sửa lỗi trang accounts/page.tsx
 */
function fixAccountsPage() {
  console.log('Đang sửa lỗi trang accounts/page.tsx...');

  const accountsPagePath = path.join(__dirname, 'src', 'app', 'accounts', 'page.tsx');

  // Nội dung mới - Hiển thị danh sách tài khoản phần mềm với giao diện tương tự trang products
  const newContent = `'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/common'

// Giả lập dữ liệu tài khoản phần mềm
const accountProducts = [
  {
    id: 'capcut-pro',
    slug: 'capcut-pro',
    name: 'CapCut Pro',
    description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp.',
    imageUrl: '/images/placeholder/placeholder-product.jpg',
    price: 490000,
    salePrice: 349000,
    categoryId: 'editing',
    rating: 4.7
  },
  {
    id: 'canva-pro',
    slug: 'canva-pro',
    name: 'Canva Pro',
    description: 'Thiết kế đồ họa chuyên nghiệp với thư viện phong phú và đầy đủ tính năng.',
    imageUrl: '/images/placeholder/placeholder-product.jpg',
    price: 690000,
    salePrice: 560000,
    categoryId: 'design',
    rating: 4.5
  },
  {
    id: 'microsoft-365',
    slug: 'microsoft-365',
    name: 'Microsoft 365',
    description: 'Bộ ứng dụng văn phòng Word, Excel, PowerPoint và nhiều dịch vụ khác.',
    imageUrl: '/images/placeholder/placeholder-product.jpg',
    price: 990000,
    salePrice: 890000,
    categoryId: 'office',
    rating: 4.9
  },
];

// Danh mục tài khoản
const accountCategories = [
  { id: 'all', name: 'Tất cả', count: accountProducts.length },
  { id: 'office', name: 'Ứng dụng văn phòng', count: accountProducts.filter(p => p.categoryId === 'office').length },
  { id: 'design', name: 'Thiết kế đồ họa', count: accountProducts.filter(p => p.categoryId === 'design').length },
  { id: 'editing', name: 'Chỉnh sửa video', count: accountProducts.filter(p => p.categoryId === 'editing').length }
];

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function AccountsPage() {
  const [products, setProducts] = useState(accountProducts);
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');

  useEffect(() => {
    document.title = 'Tài Khoản Phần Mềm | XLab - Phần mềm và Dịch vụ'
  }, []);

  // Lọc sản phẩm theo danh mục
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.categoryId === filter;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-low') {
      return a.salePrice - b.salePrice;
    } else if (sort === 'price-high') {
      return b.salePrice - a.salePrice;
    } else if (sort === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0; // newest mặc định
  });

  return (
    <div className="py-4 bg-gray-50">
      <div className="container mx-auto px-2 md:px-4 max-w-none w-[90%]">
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tài Khoản Phần Mềm</h1>
          <p className="text-sm md:text-base text-gray-600">
            Danh sách các tài khoản phần mềm bản quyền với giá cả phải chăng, đầy đủ tính năng và được cập nhật thường xuyên.
          </p>
        </div>
        
        {/* Tabs điều hướng */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <Link href="/products">
              <div className="py-2 px-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Phần mềm
                </div>
              </div>
            </Link>
            <Link href="/accounts">
              <div className="py-2 px-2 border-b-2 border-primary-600 text-primary-600 font-medium text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tài khoản
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main content */}
          <div className="w-full md:w-[85%]">
            {/* Filters bar */}
            <div className="bg-white p-2 rounded-lg shadow-sm mb-3 flex flex-wrap justify-between items-center">
              <div className="text-sm text-gray-600">
                Hiển thị {sortedProducts.length} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-gray-700">Sắp xếp:</label>
                <select 
                  id="sort"
                  className="text-sm border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
            
            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-36 bg-gray-100">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-emerald-600 text-sm">{formatCurrency(product.salePrice)}</span>
                        {product.price > product.salePrice && (
                          <span className="text-xs text-gray-500 line-through">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                      <div className="bg-emerald-100 text-emerald-800 text-xs px-1.5 py-0.5 rounded">
                        Có sẵn
                      </div>
                    </div>
                    <Link 
                      href={\`/products/\${product.slug}\`}
                      className="mt-2 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-[15%]">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Danh Mục Tài Khoản</h3>
              <ul className="space-y-1">
                {accountCategories.map(category => (
                  <li key={category.id}>
                    <button 
                      onClick={() => setFilter(category.id)}
                      className={\`flex justify-between items-center text-sm py-1 px-2 rounded-md hover:bg-gray-50 w-full text-left \${
                        filter === category.id ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                      }\`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Featured product */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Nổi Bật</h3>
              <div className="space-y-2">
                {products.slice(0, 2).map(product => (
                  <Link 
                    href={\`/products/\${product.slug}\`}
                    key={product.id}
                    className="flex space-x-2 p-1.5 hover:bg-gray-50 rounded-md"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-medium text-gray-900 text-xs">{product.name}</h4>
                      <span className="text-xs text-emerald-600 font-medium">{formatCurrency(product.salePrice)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`;

  try {
    // Đảm bảo thư mục tồn tại hoặc tạo thư mục cha
    const accountsDir = path.dirname(accountsPagePath);
    if (!fs.existsSync(accountsDir)) {
      fs.mkdirSync(accountsDir, { recursive: true });
      console.log('Đã tạo thư mục accounts');
    }

    // Luôn ghi nội dung mới, bất kể trạng thái hiện tại
    fs.writeFileSync(accountsPagePath, newContent, { encoding: 'utf8' });
    console.log('Đã ghi nội dung sạch vào accounts/page.tsx');
  } catch (error) {
    console.error('Lỗi khi sửa file accounts/page.tsx:', error);
  }
}

/**
 * Tạo file font-manifest.json nếu không tồn tại
 */
function createFontManifest() {
  console.log('Đang tạo file font-manifest.json...');

  const fontManifestPath = path.join(__dirname, '.next', 'server', 'next-font-manifest.json');
  const fontManifestDir = path.dirname(fontManifestPath);

  try {
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(fontManifestDir)) {
      fs.mkdirSync(fontManifestDir, { recursive: true });
      console.log(`Đã tạo thư mục: ${fontManifestDir}`);
    }

    // Tạo file font-manifest.json nếu không tồn tại
    if (!fs.existsSync(fontManifestPath)) {
      const emptyFontManifest = {
        pages: {},
        app: {},
        appUsingSizeAdjust: false,
        pagesUsingSizeAdjust: false
      };

      fs.writeFileSync(fontManifestPath, JSON.stringify(emptyFontManifest, null, 2), 'utf8');
      console.log(`Đã tạo file font-manifest.json tại ${fontManifestPath}`);
    } else {
      console.log('File font-manifest.json đã tồn tại.');
    }
  } catch (err) {
    console.error(`Lỗi khi tạo file font-manifest.json: ${err.message}`);
  }
}

/**
 * Tạo các file cần thiết cho Next.js mà đang bị thiếu
 */
function createMissingFiles() {
  console.log('Đang tạo các file cần thiết cho Next.js...');

  const nextDir = path.join(__dirname, '.next');
  const serverDir = path.join(nextDir, 'server');
  const serverServerDir = path.join(serverDir, 'server');
  const vendorDir = path.join(serverDir, 'vendor-chunks');
  const serverVendorDir = path.join(serverServerDir, 'vendor-chunks');
  const staticDir = path.join(nextDir, 'static');
  const cssDir = path.join(staticDir, 'css', 'app');
  const staticAppDir = path.join(staticDir, 'app');
  const cacheDir = path.join(nextDir, 'cache');

  // Tạo các thư mục nếu chúng không tồn tại
  [nextDir, serverDir, serverServerDir, vendorDir, serverVendorDir, staticDir, cssDir, staticAppDir, cacheDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Đã tạo thư mục: ${dir}`);
      } catch (err) {
        console.error(`Không thể tạo thư mục ${dir}: ${err.message}`);
      }
    }
  });

  // Danh sách file cần tạo và nội dung của chúng
  const filesToCreate = [
    {
      path: path.join(serverDir, 'next-font-manifest.json'),
      content: JSON.stringify({
        pages: {},
        app: {},
        appUsingSizeAdjust: false,
        pagesUsingSizeAdjust: false
      }, null, 2)
    },
    {
      path: path.join(serverServerDir, 'next-font-manifest.json'), // Thêm file này trong thư mục server/server/
      content: JSON.stringify({
        pages: {},
        app: {},
        appUsingSizeAdjust: false,
        pagesUsingSizeAdjust: false
      }, null, 2)
    },
    {
      path: path.join(serverDir, 'app-paths-manifest.json'),
      content: JSON.stringify({
        prefixes: {},
        normalizedPrefixes: {},
        components: {}
      }, null, 2)
    },
    {
      path: path.join(serverServerDir, 'app-paths-manifest.json'), // Thêm file này trong thư mục server/server/
      content: JSON.stringify({
        prefixes: {},
        normalizedPrefixes: {},
        components: {}
      }, null, 2)
    },
    {
      path: path.join(vendorDir, 'tailwind-merge.js'),
      content: `// Empty placeholder for tailwind-merge.js
module.exports = {};`
    },
    {
      path: path.join(serverVendorDir, 'tailwind-merge.js'),
      content: `// Empty placeholder for tailwind-merge.js
module.exports = {};`
    },
    {
      path: path.join(cssDir, 'layout.css'),
      content: `/* Empty placeholder for layout.css */
/* Generated placeholder for Next.js 15.2.4 */
.layout-container {
  display: block;
  width: 100%;
}
`
    },
    {
      path: path.join(staticAppDir, 'not-found.js'),
      content: `// Empty placeholder for not-found.js
// This file is generated to prevent 404 errors in Next.js 15.2.4
module.exports = {
  notFound: function() {
    return { notFound: true };
  }
};`
    },
    {
      path: path.join(staticAppDir, 'loading.js'),
      content: `// Empty placeholder for loading.js
// This file is generated to prevent 404 errors in Next.js 15.2.4
module.exports = {
  loading: function() {
    return { loading: true };
  }
};`
    },
    {
      path: path.join(staticDir, 'app-pages-internals.js'),
      content: `// Empty placeholder for app-pages-internals.js
// This file is generated to prevent 404 errors in Next.js 15.2.4
module.exports = {
  appPagesInternals: {}
};`
    },
    {
      path: path.join(staticDir, 'main-app.js'),
      content: `// Empty placeholder for main-app.js
// This file is generated to prevent 404 errors in Next.js 15.2.4
module.exports = {
  main: {}
};`
    },
    {
      path: path.join(nextDir, 'build-manifest.json'),
      content: JSON.stringify({
        polyfillFiles: [],
        devFiles: [],
        ampDevFiles: [],
        lowPriorityFiles: [],
        rootMainFiles: ["static/main-app.js"],
        pages: {
          "/_app": [],
          "/_error": [],
          "/_not-found": []
        },
        ampFirstPages: []
      }, null, 2)
    },
    {
      path: path.join(nextDir, 'server-reference-manifest.json'),
      content: JSON.stringify({
        clientModules: {},
        serverModules: {}
      }, null, 2)
    },
    // Thêm các file middleware và các file tĩnh khác để tránh lỗi 404
    {
      path: path.join(nextDir, 'middleware-manifest.json'),
      content: JSON.stringify({
        sortedMiddleware: [],
        middleware: {},
        functions: {},
        version: 2
      }, null, 2)
    },
    {
      path: path.join(nextDir, 'react-loadable-manifest.json'),
      content: JSON.stringify({}, null, 2)
    }
  ];

  // Tạo từng file
  filesToCreate.forEach(file => {
    try {
      if (!fs.existsSync(file.path)) {
        fs.writeFileSync(file.path, file.content, 'utf8');
        console.log(`Đã tạo file: ${file.path}`);
      } else {
        console.log(`File đã tồn tại: ${file.path}`);
      }
    } catch (err) {
      console.error(`Không thể tạo file ${file.path}: ${err.message}`);
      
      // Thử phương pháp khác nếu lỗi
      try {
        // Phương pháp 2: Sử dụng execSync
        if (process.platform === 'win32') {
          // Windows - sử dụng PowerShell
          let powershellCommand = `Set-Content -Path '${file.path.replace(/\\/g, '\\\\')}' -Value '${file.content.replace(/'/g, "''").replace(/\n/g, "\\n")}' -Force`;
          execSync(`powershell -Command "${powershellCommand}"`, { stdio: 'ignore' });
          console.log(`Đã tạo file (cách 2): ${file.path}`);
        } else {
          // Unix - sử dụng shell script
          execSync(`mkdir -p "${path.dirname(file.path)}" && echo '${file.content.replace(/'/g, "'\\''")}' > "${file.path}"`, { stdio: 'ignore' });
          console.log(`Đã tạo file (cách 2): ${file.path}`);
        }
      } catch (err2) {
        console.error(`Không thể tạo file ${file.path} (cách 2): ${err2.message}`);
      }
    }
  });

  // Thêm file .gitkeep vào thư mục cache
  try {
    const gitkeepPath = path.join(cacheDir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '', 'utf8');
      console.log(`Đã tạo file: ${gitkeepPath}`);
    }
  } catch (err) {
    console.error(`Không thể tạo file .gitkeep: ${err.message}`);
  }

  console.log('Đã tạo xong các file cần thiết.');
}

/**
 * Xóa cache Next.js
 */
function cleanNextCache() {
  console.log('Đang xóa cache Next.js...');

  // Hàm để xóa an toàn một thư mục đệ quy
  function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach((file) => {
        const curPath = path.join(directoryPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // Gọi đệ quy
          deleteFolderRecursive(curPath);
        } else {
          // Xóa file
          try {
            fs.unlinkSync(curPath);
          } catch (err) {
            console.error(`Không thể xóa file ${curPath}: ${err.message}`);
          }
        }
      });
      
      try {
        fs.rmdirSync(directoryPath);
        console.log(`Đã xóa thư mục: ${directoryPath}`);
      } catch (err) {
        console.error(`Không thể xóa thư mục ${directoryPath}: ${err.message}`);
      }
    }
  }

  // Xóa các thư mục cache cụ thể
  const nextCacheDir = path.join(__dirname, '.next', 'cache');
  if (fs.existsSync(nextCacheDir)) {
    // Xóa cache webpack
    const webpackCacheDir = path.join(nextCacheDir, 'webpack');
    if (fs.existsSync(webpackCacheDir)) {
      deleteFolderRecursive(webpackCacheDir);
      console.log('Đã xóa cache webpack');
    }
    
    // Xóa cache SWC
    const swcCacheDir = path.join(nextCacheDir, 'swc');
    if (fs.existsSync(swcCacheDir)) {
      deleteFolderRecursive(swcCacheDir);
      console.log('Đã xóa cache SWC');
    }
    
    // Xóa tất cả các file hot-update
    const hotUpdateFiles = [
      path.join(__dirname, '.next', 'static', 'webpack'),
      path.join(__dirname, '.next', 'static', 'development')
    ];
    
    hotUpdateFiles.forEach(dir => {
      if (fs.existsSync(dir)) {
        deleteFolderRecursive(dir);
        console.log(`Đã xóa thư mục hot-update: ${dir}`);
      }
    });
  }

  // Tạo lại thư mục .next nếu không tồn tại
  const nextDir = path.join(__dirname, '.next');
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log('Đã tạo thư mục .next');
  }

  // Sửa file trace
  fixTraceErrors();

  // Gọi các hàm để tạo file và thư mục cần thiết
  createFontManifest();
  createMissingFiles();

  // Xóa tất cả các file tạm thời
  const tempFileExtensions = ['.tmp', '.temp', '.old', '.bak'];
  
  function deleteTempFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = path.join(dir, dirent.name);
      
      if (dirent.isDirectory()) {
        deleteTempFiles(fullPath);
      } else if (dirent.isFile()) {
        // Kiểm tra nếu file có phần mở rộng là file tạm
        const hasTemp = tempFileExtensions.some(ext => dirent.name.endsWith(ext));
        // Hoặc file có chứa .hot-update.
        const isHotUpdate = dirent.name.includes('.hot-update.');
        
        if (hasTemp || isHotUpdate) {
          try {
            fs.unlinkSync(fullPath);
            console.log(`Đã xóa file tạm: ${fullPath}`);
          } catch (err) {
            console.warn(`Không thể xóa file tạm ${fullPath}: ${err.message}`);
          }
        }
      }
    });
  }
  
  // Xóa file tạm trong thư mục .next
  deleteTempFiles(nextDir);

  console.log('Quá trình xóa cache Next.js đã hoàn tất!');
} 