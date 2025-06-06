import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  preload: true,
  display: 'swap',
});

// Nội dung đã bị xóa để tránh xung đột với /src/app/[locale]/layout.tsx
export const dynamic = "force-static";
export { metadata, viewport } from './[locale]/layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
