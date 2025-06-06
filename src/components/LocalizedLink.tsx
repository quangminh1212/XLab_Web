import Link from 'next/link';
import {useLocale} from 'next-intl';

interface LocalizedLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function LocalizedLink({href, children, ...props}: LocalizedLinkProps) {
  const locale = useLocale();
  const path = `/${locale}${href}`;
  
  return (
    <Link href={path} {...props}>
      {children}
    </Link>
  );
} 