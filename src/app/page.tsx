import { redirect } from 'next/navigation';

// Chuyển hướng đến locale mặc định (vi)
export default function RootPage() {
  redirect('/vi');
}
