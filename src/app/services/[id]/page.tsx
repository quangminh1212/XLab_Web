import { redirect } from 'next/navigation';

// Chuyển hướng từ /services/[id] sang /products/[id]
export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  // Chuyển hướng sang trang products với cùng ID
  redirect(`/products/${params.id}`);
}
