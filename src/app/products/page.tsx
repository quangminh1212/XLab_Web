import { products, categories } from '@/data/mockData'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import CategoryList from '@/components/CategoryList'
import Image from 'next/image'

export default function ProductsPage() {
  // Lấy sản phẩm nổi bật để hiển thị riêng
  const featuredProducts = products.filter(product => product.featured)
  // Sản phẩm mới nhất
  const newestProducts = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 4)

  // Sản phẩm phổ biến nhất (theo lượt tải)
  const popularProducts = [...products].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 4)

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-primary-300 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8 md:max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm</h1>
              <p className="text-xl text-primary-100">
                Khám phá các sản phẩm phần mềm hiện đại được thiết kế riêng cho doanh nghiệp của bạn.
              </p>
              <div className="mt-6">
                <div className="relative max-w-lg w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="block w-full bg-white bg-opacity-10 border border-primary-400 border-opacity-30 rounded-full py-3 pl-10 pr-4 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <Image
                src="/images/hero-image.svg"
                alt="Product Hero"
                width={400}
                height={300}
                className="w-auto h-auto max-w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:border-primary-200 transition-all hover:shadow">
              <p className="text-3xl font-bold text-primary-600">{products.length}</p>
              <p className="text-gray-600">Tổng sản phẩm</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:border-primary-200 transition-all hover:shadow">
              <p className="text-3xl font-bold text-primary-600">{categories.length}</p>
              <p className="text-gray-600">Danh mục</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:border-primary-200 transition-all hover:shadow">
              <p className="text-3xl font-bold text-primary-600">{products.reduce((sum, product) => sum + product.downloadCount, 0).toLocaleString()}</p>
              <p className="text-gray-600">Lượt tải</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:border-primary-200 transition-all hover:shadow">
              <p className="text-3xl font-bold text-primary-600">{(products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)}</p>
              <p className="text-gray-600">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Danh mục sản phẩm</h2>
            <Link href="/categories" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
              Xem tất cả
            </Link>
          </div>
          <CategoryList categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
              <p className="text-gray-600 mt-1">Những sản phẩm phổ biến và được đánh giá cao</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Hot
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all relative"
              >
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  Nổi bật
                </div>
                <div className="relative h-48 bg-gray-100 flex items-center justify-center p-6">
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-auto h-auto max-h-32 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-500">({product.rating})</span>
                    </div>
                    <span className="text-primary-600 font-semibold">
                      {product.salePrice 
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)
                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Phổ biến nhất</h2>
              <p className="text-gray-600 mt-1">Sản phẩm có lượt tải cao nhất</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Link 
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="relative h-40 bg-gray-100 flex items-center justify-center p-6">
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="w-auto h-auto max-h-24"
                    />
                  )}
                  <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full">
                    {product.downloadCount.toLocaleString()} tải
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newest Products */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mới cập nhật</h2>
              <p className="text-gray-600 mt-1">Sản phẩm mới cập nhật gần đây</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {newestProducts.map((product) => (
              <Link 
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="relative h-40 bg-gray-100 flex items-center justify-center p-6">
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="w-auto h-auto max-h-24"
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Mới
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
                      v{product.version}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tất cả sản phẩm</h2>
              <p className="text-gray-600 mt-1">Khám phá toàn bộ sản phẩm của chúng tôi</p>
            </div>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-primary-300 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Bạn cần một giải pháp riêng biệt?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Chúng tôi cung cấp dịch vụ phát triển phần mềm theo yêu cầu. Hãy liên hệ với chúng tôi để được tư vấn giải pháp phù hợp nhất.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-md transition-colors">
                Liên hệ ngay
              </Link>
              <Link href="/services" className="bg-primary-700 hover:bg-primary-800 text-white font-medium px-6 py-3 rounded-md transition-colors">
                Khám phá dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 