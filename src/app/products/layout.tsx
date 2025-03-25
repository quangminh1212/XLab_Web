import './products.css';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="products-layout">
      {children}
    </div>
  );
} 