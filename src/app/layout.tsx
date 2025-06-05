// Nội dung đã bị xóa để tránh xung đột với /src/app/[locale]/layout.tsx
export const dynamic = "force-static";
export { metadata, viewport } from './[locale]/layout';

export default function RootLayout() {
  return null; // Layout này sẽ không được sử dụng, nhưng giữ lại cho Next.js build
}
