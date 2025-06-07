import { redirect } from 'next/navigation';

interface LocaleServiceDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

// Chuyển hướng từ /[locale]/services/[id] sang /[locale]/products/[id]
export default function LocaleServiceDetailPage({ params }: LocaleServiceDetailPageProps) {
  // Chuyển hướng sang trang products với cùng ID và giữ nguyên locale
  redirect(`/${params.locale}/products/${params.id}`);
} 