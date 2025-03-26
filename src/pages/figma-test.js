import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FigmaTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/figma-test');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Kiểm tra kết nối Figma - XLab</title>
        <meta name="description" content="Trang kiểm tra kết nối Figma API" />
      </Head>

      <Header />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Kiểm tra kết nối Figma API</h1>
            
            <div className="mb-6">
              <button
                onClick={testConnection}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
                <h3 className="font-semibold">Lỗi:</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Kết quả kiểm tra:</h3>
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="mb-2">
                    <span className="font-medium">Trạng thái:</span>{' '}
                    <span className={result.status >= 200 && result.status < 300 ? 'text-green-600' : 'text-red-600'}>
                      {result.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">API Key:</span> {result.apiKeyFirstChars}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">File Key:</span> {result.fileKey}
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Phản hồi từ Figma:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
                      {JSON.stringify(result.figmaResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 