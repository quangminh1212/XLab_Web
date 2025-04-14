'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProductBySlug, incrementDownloadCount, incrementViewCount } from '@/lib/utils';
import { ProductImage } from '@/components/ProductImage';
import { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!params || !params.id) {
          setError('Mã sản phẩm không hợp lệ');
          setLoading(false);
          return;
        }

        const foundProduct = getProductBySlug(params.id);
        
        if (!foundProduct) {
          setError('Không tìm thấy sản phẩm');
          setLoading(false);
          return;
        }
        
        // Tăng lượt xem sản phẩm
        incrementViewCount(params.id);
        
        // Lấy sản phẩm sau khi đã tăng lượt xem
        const updatedProduct = getProductBySlug(params.id);
        // Xử lý kiểu dữ liệu để đảm bảo tính nhất quán
        setProduct(updatedProduct || null);
        
        // Cập nhật title cho trang
        document.title = `${updatedProduct?.name || 'Sản phẩm'} | XLab - Phần mềm và Dịch vụ`;
        setLoading(false);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-600 mb-4">{error || 'Đã xảy ra lỗi'}</h1>
            <p className="text-gray-600 mb-6">
              Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. 
              Vui lòng thêm sản phẩm mới hoặc kiểm tra lại đường dẫn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="text-primary-600 hover:text-primary-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại danh sách sản phẩm
              </Link>
              <Link 
                href="/admin" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm sản phẩm mới
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Đoạn code bên dưới sẽ không được thực thi vì luôn đi vào trường hợp error ở trên
  // Giữ lại code để tham khảo cho sau này khi có sản phẩm thực tế
  const productImage = product.imageUrl || '/placeholder-product.jpg';
  
  const handleDownload = () => {
    if (!product.slug) return;
    
    try {
      // Tăng số lượt tải
      incrementDownloadCount(product.slug);
      
      // Mô phỏng tải xuống
      console.log(`Tải xuống sản phẩm: ${product.slug}`);
      
      // Tạo tệp trống để tải xuống
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,Đây là file demo cho sản phẩm ${product.slug}`);
      element.setAttribute('download', `${product.slug}-demo.txt`);
      
      element.style.display = 'none';
      document.body.appendChild(element);
      
      element.click();
      
      document.body.removeChild(element);
    } catch (error) {
      console.error('Lỗi khi tải xuống:', error);
    }
  };
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4 mb-6 md:mb-0">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 flex items-center justify-center h-80">
                  <ProductImage 
                    src={productImage}
                    alt={product.name || 'Product image'}
                    width={300}
                    height={300}
                    className="max-h-64 max-w-full object-contain"
                  />
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {product.viewCount || 0} lượt xem
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {product.downloadCount || 0} lượt tải
                  </div>
                </div>
              </div>
              
              <div className="md:flex-1 px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 text-sm mb-4">
                  Phiên bản {product.version || '1.0'} | Cập nhật: {new Date(product.updatedAt || new Date()).toLocaleDateString('vi-VN')}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rating || 0})</span>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h2>
                  <div className="text-gray-600 prose">{product.description || 'Chưa có mô tả cho sản phẩm này.'}</div>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-3xl font-bold text-primary-600">
                    {product.salePrice 
                      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)
                      : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                  </div>
                  {product.salePrice && product.price && (
                    <div className="text-gray-400 line-through">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  {product.slug && (
                    <button
                      onClick={handleDownload}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Tải xuống
                    </button>
                  )}
                  
                  <Button variant="outline" className="px-6 py-3">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Thêm vào giỏ hàng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thêm phần tương tác xã hội và chia sẻ */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chia sẻ sản phẩm</h2>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                Facebook
              </button>
              <button className="bg-blue-400 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Twitter
              </button>
              <button className="bg-green-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-green-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.846 6.886c.03-.295.144-.586.33-.814.188-.227.428-.383.695-.418.597-.066 1.198.164 1.79.266.786.148 1.682.03 2.295.636.279.266.438.66.463 1.072.027.396-.03.917.248 1.187.34.324.888.148 1.237.43.267.22.34.562.368.858.016.27 0 .54-.08.787-.076.246-.236.424-.384.623-.195.274-.594.42-.633.715-.042.283.37.494.407.78.242.84.2 1.617-.097 2.403-.21.57-.452 1.133-.844 1.58-.724.825-1.933 1.527-3.3 1.79-.798.153-1.657.284-2.435.06-.545-.154-1.055-.477-1.34-.972-.21-.35-.273-.82-.08-1.212.192-.388.563-.652.936-.81.34-.145.408-.74.163-1.02-.213-.24-.632-.318-.945-.225-.496.154-.975.484-1.13.98-.21.527-.08 1.095.236 1.55.467.678 1.196 1.107 2.09 1.254 1.047.17 2.203-.02 3.15-.412 1.223-.493 2.232-1.356 2.94-2.46.47-.74.693-1.554.834-2.338.192-1.436-.591-2.73-1.955-3.295-.3-.123-.672-.2-.89-.436-.376-.4-.248-1.05-.448-1.523-.273-.647-.937-1.023-1.597-1.106-.694-.09-1.344.182-2.027.297-1.066.178-2.018-.283-2.76-1-.45-.432-.757-.97-.757-1.605 0-1.27 1.19-2.33 2.65-2.28.648.025 1.254.32 1.677.78.153.167.266.37.35.598.128.337.294.683.615.87.343.214.877.2 1.203-.136.213-.213.242-.538.183-.82-.09-.424-.412-.782-.683-1.112-.606-.74-1.424-1.356-2.397-1.605-.978-.254-2.02-.09-2.955.315-1.9.82-3.156 2.702-3.156 4.73 0 .738.248 1.13.53 1.73.37.79.838 1.477 1.376 2.173.344.433.695.86.853 1.363.213.684.07 1.485-.128 2.122-.748 2.402-3.156 4.006-5.926 3.948-1.126-.023-2.295-.4-3.223-1.01-.75-.494-1.45-1.178-1.75-2.07-.058-.177-.118-.4-.06-.602.19-.495.4-.395.767-.556.465-.196.83-.48 1.133-.888.304-.418.376-.938.33-1.436-.228-2.432-3.495-3.937-5.94-3.312-.587.154-1.21.472-1.655.888-1.066.99-1.285 2.35-.78 3.54.163.385.345.75.595 1.064.41.517.88.954 1.328 1.42 1.446 1.52 3.02 3.053 3.196 5.206.06.775-.117 1.53-.472 2.21-.55 1.064-1.495 1.84-2.61 2.226-.785.27-1.683.296-2.474.023-.732-.256-1.424-.73-1.804-1.424-.344-.62-.422-1.423-.177-2.104.15-.435.422-.83.773-1.134.227-.196.47-.36.72-.52.225-.13.456-.266.617-.44.285-.303.376-.713.248-1.072-.33-.917-1.714-1.165-2.112-2.28-.254-.715-.073-1.47.248-2.133.304-.632.7-1.213 1.204-1.695.936-.894 2.07-1.617 3.32-1.984 1.033-.303 2.155-.34 3.23-.167 1.358.227 2.752.746 3.955 1.493.44.272.856.57 1.24.894.27.22.303.196.422-.05.44-.888 1.023-1.685 1.824-2.284.8-.6 1.728-1.013 2.657-1.295 1.682-.517 3.58-.588 5.25.023.542.202 1.048.47 1.51.813.532.392 1.023.86 1.437 1.372.418.52.773 1.1 1.014 1.716.25.607.377 1.25.42 1.896.016.25.016.512.016.762 0 .576-.058 1.31.06 1.88.177.796.7 1.493 1.485 1.733.467.143.97.112 1.403-.066.433-.178.805-.473 1.158-.764.832-.685 1.624-1.5 2.066-2.465.513-1.135.683-2.432.437-3.66-.248-1.284-.94-2.402-1.954-3.224-.347-.283-.737-.53-1.148-.723-.256-.12-.515-.224-.766-.337-.25-.107-.496-.237-.67-.43-.227-.262-.266-.627-.118-.94.148-.315.44-.52.757-.635 1.4-.517 3.076-.48 4.386.384.68.442 1.232 1.076 1.624 1.792.317.582.528 1.218.683 1.872.462 1.928.195 4.102-.888 5.764-.443.685-.983 1.312-1.607 1.84-.637.54-1.36.986-2.127 1.33-1.06.473-2.226.814-3.383.97-1.316.178-2.667.13-3.955-.178-1.03-.248-2.018-.65-2.92-1.2-.605-.362-1.177-.79-1.677-1.26-.906-.865-1.683-1.9-2.143-3.05-.238-.603-.4-1.235-.46-1.88-.03-.315-.026-.64.016-.95.042-.306.124-.602.237-.888.19-.47.513-.85.97-1.042.467-.19.97-.13 1.403.09.433.226.766.596.936 1.042.073.196.103.41.088.628-.015.22-.083.43-.195.62-.1.166-.24.307-.402.42-.736.52-.39 1.43.44 1.56.54.086 1.153.007 1.524-.387.353-.378.467-.924.403-1.424-.06-.455-.27-.88-.563-1.23-.295-.347-.655-.64-1.048-.873-.853-.517-1.91-.713-2.885-.56-.943.154-1.865.603-2.474 1.372-.53.672-.876 1.485-.95 2.344-.104 1.274.234 2.556.843 3.66.303.544.673 1.052 1.088 1.523.73.822 1.593 1.54 2.53 2.122 2.245 1.4 5 2.172 7.685 2.172 1.894 0 3.857-.34 5.53-1.177.967-.486 1.85-1.106 2.652-1.806 1.445-1.25 2.67-2.74 3.634-4.406 1.106-1.955 1.866-4.136 2.112-6.388.13-1.254.13-2.507-.032-3.75-.076-.584-.21-1.154-.377-1.722z" />
                </svg>
                WhatsApp
              </button>
              <button className="bg-red-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-red-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
        
        {/* Phần bình luận và đánh giá */}
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Đánh giá và bình luận</h2>
            
            {/* Form đánh giá */}
            <div className="mb-8 border-b pb-8">
              <h3 className="text-lg font-semibold mb-4">Gửi đánh giá của bạn</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="mr-3 text-gray-700">Xếp hạng:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="p-1">
                        <svg className="w-6 h-6 text-gray-300 hover:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review-title" className="block mb-2 text-sm font-medium text-gray-700">
                    Tiêu đề đánh giá
                  </label>
                  <input
                    type="text"
                    id="review-title"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Tiêu đề ngắn gọn về trải nghiệm của bạn"
                  />
                </div>
                <div>
                  <label htmlFor="review-content" className="block mb-2 text-sm font-medium text-gray-700">
                    Nội dung đánh giá
                  </label>
                  <textarea
                    id="review-content"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Chia sẻ chi tiết trải nghiệm của bạn với sản phẩm này"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            </div>
            
            {/* Danh sách bình luận */}
            <h3 className="text-lg font-semibold mb-4">Bình luận gần đây</h3>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3">
                    NT
                  </div>
                  <div>
                    <h4 className="font-semibold">Nguyễn Thành</h4>
                    <div className="flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">13 tháng 6, 2023</span>
                    </div>
                  </div>
                </div>
                <h5 className="font-medium mb-1">Sản phẩm tuyệt vời, đáng đồng tiền</h5>
                <p className="text-gray-600">Tôi đã sử dụng phần mềm này được vài tháng và thấy rất hài lòng. Giao diện đẹp, dễ sử dụng và nhiều tính năng hữu ích. Hỗ trợ kỹ thuật cũng rất nhanh và hiệu quả.</p>
                <div className="mt-3 flex items-center text-sm">
                  <button className="text-gray-500 hover:text-primary-600 flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Hữu ích (12)
                  </button>
                  <button className="text-gray-500 hover:text-primary-600">
                    Trả lời
                  </button>
                </div>
              </div>
              
              <div className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                    TH
                  </div>
                  <div>
                    <h4 className="font-semibold">Trần Hương</h4>
                    <div className="flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">28 tháng 5, 2023</span>
                    </div>
                  </div>
                </div>
                <h5 className="font-medium mb-1">Xứng đáng 5 sao!</h5>
                <p className="text-gray-600">Tôi rất thích phiên bản mới nhất này. Tính năng phân tích dữ liệu được cải tiến đáng kể so với các phiên bản trước. Đặc biệt, tính năng xuất báo cáo rất tiện lợi cho công việc của tôi.</p>
                <div className="mt-3 flex items-center text-sm">
                  <button className="text-gray-500 hover:text-primary-600 flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Hữu ích (8)
                  </button>
                  <button className="text-gray-500 hover:text-primary-600">
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
            
            {/* Nút xem thêm */}
            <div className="mt-6 text-center">
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Xem thêm bình luận
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/products" 
            className="text-primary-600 hover:text-primary-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
} 