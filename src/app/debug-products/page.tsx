'use client';

import React, { useState, useEffect } from 'react';

export default function DebugProducts() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<string>('check'); // 'check', 'fix', or 'health'

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      let endpoint = '';
      
      switch(action) {
        case 'check':
          endpoint = '/api/products';
          break;
        case 'fix':
          endpoint = '/api/products/fix-data';
          break;
        case 'health':
          endpoint = '/api/products/check-health';
          break;
        default:
          endpoint = '/api/products';
      }
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setApiResponse(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug Products</h1>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button 
            className={`px-4 py-2 rounded ${action === 'check' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setAction('check')}
          >
            Check Products API
          </button>
          <button 
            className={`px-4 py-2 rounded ${action === 'fix' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setAction('fix')}
          >
            Fix Products Data
          </button>
          <button 
            className={`px-4 py-2 rounded ${action === 'health' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setAction('health')}
          >
            API Health Check
          </button>
        </div>
        
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Run Selected Action'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {apiResponse && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">API Response</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap break-words overflow-auto max-h-[500px]">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              These tools help diagnose product data issues. Use the Health Check to analyze the product data structure, 
              and the Fix Data option to attempt automatic repairs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 