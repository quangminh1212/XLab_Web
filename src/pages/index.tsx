'use client';

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HomePage() {
  const { translate, isLoaded } = useLanguage()

  return (
    <Layout>
      <Head>
        <title>XLab - Phần mềm chất lượng cao</title>
        <meta name="description" content="XLab cung cấp các giải pháp phần mềm chất lượng cao và dịch vụ công nghệ cho doanh nghiệp của bạn" />
      </Head>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            home.heroTitle
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto">
            High-quality software solutions and technology services for your business
          </p>

          {/* Search Box */}
          <div className="max-w-lg mx-auto flex">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
            />
            <button className="bg-teal-500 text-white px-6 py-2 rounded-r hover:bg-teal-600">
              Search...
            </button>
          </div>
        </div>

        {/* Featured Products */}
        <div className="py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link href="/products" className="text-teal-600 hover:text-teal-700 flex items-center">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="text-center py-8">
            <p className="text-gray-600">System is being updated. Please check back later.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
} 