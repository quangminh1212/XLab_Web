import Link from 'next/link';

interface Crumb { name: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-6">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:text-primary-600">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-gray-900 font-medium">{item.name}</span>
            )}
            {i < items.length - 1 && <span className="mx-2 text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

