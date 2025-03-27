import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { getProductBySlug, incrementViewCount } from '@/lib/utils'
import { products } from '@/data/mockData'
import { DownloadButton } from './client'
import { unstable_cache } from 'next/cache'

// Cache product data retrieval to optimize performance
const getCachedProduct = unstable_cache(
  async (slug: string) => {
    return getProductBySlug(slug);
  },
  ['product-detail'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['products']
  }
);

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = await getCachedProduct(params.id);
  return {
    title: `${product?.name || 'Sản phẩm'} | XLab - Phần mềm và Dịch vụ`,
    description: product?.description || 'Chi tiết sản phẩm phần mềm từ XLab',
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getCachedProduct(params.id)
  
  if (!product) {
    return notFound()
  }
  
  // Increment view count when viewing the product
  incrementViewCount(product.slug)
  
  // Mặc định placeholder image nếu không có imageUrl
  const productImage = product.imageUrl || '/placeholder-product.jpg'
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4 mb-6 md:mb-0">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 flex items-center justify-center h-80">
                  <Image
                    src={productImage}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="max-h-64 max-w-full object-contain"
                    onError={(e) => {
                      // Fallback nếu ảnh không tải được
                      e.currentTarget.src = '/placeholder-product.jpg'
                    }}
                  />
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {product.viewCount} lượt xem
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {product.downloadCount} lượt tải
                  </div>
                </div>
              </div>
              
              <div className="md:flex-1 px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 text-sm mb-4">
                  Phiên bản {product.version} | Cập nhật: {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rating})</span>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h2>
                  <div className="text-gray-600 prose">{product.description}</div>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-3xl font-bold text-primary-600">
                    {product.salePrice 
                      ? Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)
                      : Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </div>
                  {product.salePrice && (
                    <div className="text-gray-400 line-through">
                      {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <DownloadButton 
                    slug={product.slug} 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải xuống
                  </DownloadButton>
                  
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
  )
} 