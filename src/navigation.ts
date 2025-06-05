import {usePathname as useNextPathname, useRouter as useNextRouter} from 'next/navigation';
import Link from 'next/link';
import {useLocale} from 'next-intl';
import {locales} from './i18n/request';

export function usePathname() {
  const pathname = useNextPathname();
  const locale = useLocale();
  
  // Remove locale prefix from pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
  return pathnameWithoutLocale;
}

export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();
  
  return {
    push: (path: string) => {
      router.push(`/${locale}${path}`);
    },
    replace: (path: string) => {
      router.replace(`/${locale}${path}`);
    },
    back: () => {
      router.back();
    }
  };
}

export function LocalizedLink({href, children, ...props}: any) {
  const locale = useLocale();
  const path = `/${locale}${href}`;
  
  return (
    <Link href={path} {...props}>
      {children}
    </Link>
  );
}

export function redirect(path: string) {
  const locale = useLocale();
  return `/${locale}${path}`;
} 