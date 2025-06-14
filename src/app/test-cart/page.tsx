'use client';

import { useCart } from '@/components/cart/CartContext';
import { useState } from 'react';

export default function TestCartPage() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAddSameProduct = () => {
    const product = {
      id: 'test-product-1',
      name: 'Test Product',
      price: 100000,
      quantity: 1,
      image: '/images/placeholder/product-placeholder.svg',
    };

    addItem(product);
    addLog('Thêm sản phẩm lần 1');

    setTimeout(() => {
      addItem(product);
      addLog('Thêm sản phẩm lần 2 (cùng sản phẩm)');
    }, 1000);
  };

  const testAddDifferentVersions = () => {
    const product1 = {
      id: 'test-product-2',
      name: 'Test Product với Version',
      price: 150000,
      quantity: 1,
      version: 'Basic',
      image: '/images/placeholder/product-placeholder.svg',
    };

    const product2 = {
      id: 'test-product-2',
      name: 'Test Product với Version',
      price: 200000,
      quantity: 1,
      version: 'Premium',
      image: '/images/placeholder/product-placeholder.svg',
    };

    addItem(product1);
    addLog('Thêm sản phẩm version Basic');

    setTimeout(() => {
      addItem(product2);
      addLog('Thêm sản phẩm version Premium (cùng ID nhưng khác version)');
    }, 1000);
  };

  const testAddWithOptions = () => {
    const product1 = {
      id: 'test-product-3',
      name: 'Test Product với Options',
      price: 300000,
      quantity: 1,
      options: ['Size L', 'Color Red'],
      image: '/images/placeholder/product-placeholder.svg',
    };

    const product2 = {
      id: 'test-product-3',
      name: 'Test Product với Options',
      price: 300000,
      quantity: 1,
      options: ['Size M', 'Color Blue'],
      image: '/images/placeholder/product-placeholder.svg',
    };

    addItem(product1);
    addLog('Thêm sản phẩm với options [Size L, Color Red]');

    setTimeout(() => {
      addItem(product2);
      addLog('Thêm sản phẩm với options [Size M, Color Blue]');
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Cart Logic - Gộp Sản Phẩm</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Test Controls</h2>
          <div className="space-y-3">
            <button
              onClick={testAddSameProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Test: Thêm cùng sản phẩm 2 lần
            </button>
            <button
              onClick={testAddDifferentVersions}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              Test: Thêm cùng ID nhưng khác version
            </button>
            <button
              onClick={testAddWithOptions}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
            >
              Test: Thêm cùng ID nhưng khác options
            </button>
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Giỏ hàng ({items.length} items)</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng trống</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.uniqueKey || item.id} className="border p-3 rounded">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    ID: {item.id} | Quantity: {item.quantity}
                  </div>
                  {item.version && (
                    <div className="text-sm text-blue-600">Version: {item.version}</div>
                  )}
                  {item.options && item.options.length > 0 && (
                    <div className="text-sm text-green-600">Options: {item.options.join(', ')}</div>
                  )}
                  <div className="text-sm text-purple-600">UniqueKey: {item.uniqueKey}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => updateQuantity(item.uniqueKey || item.id, item.quantity + 1)}
                      className="bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                      +1
                    </button>
                    <button
                      onClick={() =>
                        updateQuantity(item.uniqueKey || item.id, Math.max(1, item.quantity - 1))
                      }
                      className="bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => removeItem(item.uniqueKey || item.id)}
                      className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log */}
      <div className="mt-6 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Test Log</h2>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-gray-500">Chưa có action nào</p>
          ) : (
            log.map((entry, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                {entry}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setLog([])}
          className="mt-3 bg-gray-600 text-white px-3 py-1 rounded text-sm"
        >
          Clear Log
        </button>
      </div>
    </div>
  );
}
