'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryList from '@/components/CategoryList';
import ProductGrid from '@/components/ProductGrid';
import { products, categories } from '@/data/mockData';
import dynamic from 'next/dynamic';

// Use dynamic import for components that depend on browser APIs
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

// Define proper types to avoid linter errors
interface DebugInfo {
  // Environment info
  nextVersion: string;
  nodeEnv: string | undefined;
  debugCalls: string | undefined;
  
  // Runtime checks
  windowDefined: boolean;
  documentDefined: boolean;
  
  // Function prototype tests
  functionPrototype: {
    call: boolean;
    apply: boolean;
    bind: boolean;
  };
  
  // Error status
  hasErrors: boolean;
  errorMessages: string[];
  
  // Optional properties for call test results
  callTestResult?: string;
  callTestError?: string;
}

export default function Home() {
  const [functionInfo, setFunctionInfo] = useState<any>({
    loaded: false,
    functionCallExists: false,
    functionCallType: 'unknown',
    functionPrototypeInfo: [],
    error: null
  });

  useEffect(() => {
    try {
      console.log('Page component mounting - checking Function.prototype.call');
      
      // Check if Function.prototype.call exists
      const callExists = Function.prototype.hasOwnProperty('call');
      const callType = typeof Function.prototype.call;
      
      // Get all Function.prototype methods
      const protoInfo = Object.getOwnPropertyNames(Function.prototype).map(name => {
        return {
          name,
          type: typeof (Function.prototype as any)[name]
        };
      });
      
      console.log('Function.prototype.call check result:', { 
        exists: callExists, 
        type: callType,
        protoInfo
      });

      // Test Function.prototype.call
      let testResult = 'not tested';
      if (callExists && callType === 'function') {
        try {
          const testFn = function(this: any, arg: string) { 
            return 'Test: ' + arg + (this ? ' with this: ' + this : ''); 
          };
          testResult = Function.prototype.call.call(testFn, null, 'test arg');
          console.log('Function.prototype.call test result:', testResult);
        } catch (testError) {
          testResult = 'error: ' + (testError as Error).message;
          console.error('Function.prototype.call test error:', testError);
        }
      }

      setFunctionInfo({
        loaded: true,
        functionCallExists: callExists,
        functionCallType: callType,
        functionPrototypeInfo: protoInfo,
        testResult,
        error: null
      });
    } catch (err) {
      console.error('Error checking Function.prototype.call:', err);
      setFunctionInfo({
        loaded: true,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }, []);

  // Get featured products for the homepage
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="flex flex-col min-h-screen">      
      <Header />
      
      <main className="flex-grow">
        {/* Debug information */}
        <div className="bg-blue-50 p-4 mb-6 border border-blue-200 rounded">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          {functionInfo.loaded ? (
            <div>
              <p><strong>Function.prototype.call exists:</strong> {functionInfo.functionCallExists ? 'Yes' : 'No'}</p>
              <p><strong>Function.prototype.call type:</strong> {functionInfo.functionCallType}</p>
              <p><strong>Test result:</strong> {functionInfo.testResult || 'N/A'}</p>
              {functionInfo.error && (
                <p className="text-red-500"><strong>Error:</strong> {functionInfo.error}</p>
              )}
              <details>
                <summary className="cursor-pointer text-blue-600">Function.prototype methods</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
                  {JSON.stringify(functionInfo.functionPrototypeInfo, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <p>Loading debug information...</p>
          )}
        </div>

        <section className="py-10 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to XLab Software</h1>
            <p className="text-lg mb-8">Discover the best software solutions for your needs</p>
            <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
              Browse All Products
            </Link>
          </div>
        </section>

        <CategoryList categories={categories} />
        
        <section className="py-10 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose XLab Software?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">High Quality</h3>
                <p>Our software is built to the highest standards of quality and performance.</p>
              </div>
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Customer Support</h3>
                <p>We provide exceptional customer support to ensure your success.</p>
              </div>
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Regular Updates</h3>
                <p>Our products are regularly updated with new features and improvements.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 