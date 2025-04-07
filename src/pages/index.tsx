import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>XLab Web</title>
        <meta name="description" content="XLab Web Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">XLab Web</h1>
          <p className="text-gray-600 text-center mb-4">Trang được tải thành công!</p>
          <div className="text-center">
            <button 
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              onClick={() => alert('JavaScript hoạt động!')}
            >
              Kiểm tra
            </button>
          </div>
        </div>
      </main>
    </>
  )
} 