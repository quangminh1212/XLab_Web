'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from '@/i18n/useTranslation';

interface NavbarProps {
  session: any;
  setUserMenuOpen: (isOpen: boolean) => void;
  userMenuOpen: boolean;
}

export default function Navbar({ session, setUserMenuOpen, userMenuOpen }: NavbarProps) {
  const { locale } = useTranslation();
  
  return (
    session && (
      <div className="relative group">
        <button
          type="button"
          className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 lg:border-0 lg:p-0"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <span>{session.user?.name || 'Tài khoản'}</span>
          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
        </button>

        {userMenuOpen && (
          <div className="absolute z-10 right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Link href={`/${locale}/account`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Tài khoản của tôi
            </Link>
            <Link
              href={`/${locale}/orders/history`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Lịch sử đơn hàng
            </Link>
            <Link
              href={`/${locale}/account/deposit`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Nạp tiền
            </Link>
            <Link
              href={`/${locale}/vouchers/used`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Voucher đã dùng
            </Link>
            <Link
              href={`/${locale}/notifications`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Thông báo
            </Link>
            {session.user?.isAdmin && (
              <Link href={`/${locale}/admin`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Quản trị viên
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    )
  );
}
