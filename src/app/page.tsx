import Image from 'next/image'
import Link from 'next/link'
import { products, categories, stores } from '@/data/mockData'
import CategoryList from '@/components/CategoryList'
import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Chào mừng đến với XLab</h1>
        <p className="text-lg text-center max-w-2xl mx-auto">
          Website đang được phát triển. Vui lòng quay lại sau.
        </p>
      </div>
    </div>
  )
} 