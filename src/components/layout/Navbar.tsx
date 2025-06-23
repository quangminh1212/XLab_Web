import Link from 'next/link';
import { Fragment, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar({ session }: { session: any }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 lg:border-0 lg:p-0"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        <span>{session.user?.name || t('account.account')}</span>
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {userMenuOpen && (
        <div className="absolute z-10 right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            {t('account.myAccount')}
          </Link>
          <Link
            href="/orders/history"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('account.orderHistory')}
          </Link>
          <Link
            href="/account/deposit"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('account.deposit')}
          </Link>
          <Link
            href="/vouchers/used"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('account.usedVouchers')}
          </Link>
          <Link
            href="/notifications"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('account.notifications')}
          </Link>
          <Link
            href="/support"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('account.support')}
          </Link>
          {session.user?.isAdmin && (
            <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {t('account.adminPanel')}
            </Link>
          )}
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('account.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
