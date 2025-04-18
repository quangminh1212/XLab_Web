export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Sản phẩm: {params.id}</h1>
      <p className="mb-4">Đây là trang chi tiết sản phẩm đơn giản.</p>
      <a href="/products" className="text-blue-500 hover:underline">Quay lại</a>
    </div>
  );
} 