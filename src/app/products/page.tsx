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
  ).slice(0, 8)

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="block w-full bg-white bg-opacity-10 border border-primary-400 border-opacity-30 rounded-full py-3 pl-10 pr-4 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
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
      
      {/* Categories Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Danh mục sản phẩm</h2>
          </div>
          <CategoryList categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* All Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tất cả sản phẩm</h2>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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