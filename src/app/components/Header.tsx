'use client';

import Link from 'next/link';
// Tạm thời comment phần import next-auth
// import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

// Tạo type session để tạm thời thay thế
type MockUser = {
    name?: string;
    image?: string;
};

type MockSession = {
    user?: MockUser;
};

export default function Header() {
    // Tạm thời mock session
    const session: MockSession | null = null;
    const status = 'unauthenticated';
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOut = () => {
        // signOut({ callbackUrl: '/' });
        console.log('Sign out clicked');
        // TODO: Xử lý đăng xuất sau khi cấu hình next-auth
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <Link href="/">XLab</Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link href="/products">Sản phẩm</Link></li>
                        <li><Link href="/pricing">Bảng giá</Link></li>
                        <li><Link href="/support">Hỗ trợ</Link></li>
                        <li><Link href="/about">Giới thiệu</Link></li>
                        <li><Link href="/contact">Liên hệ</Link></li>
                    </ul>
                </nav>

                <div className="user-actions">
                    {/* Tạm thời chỉ hiển thị nút đăng nhập và đăng ký */}
                    <Link href="/login" className="btn btn-light">Đăng nhập</Link>
                    <Link href="/register" className="btn btn-primary">Đăng ký</Link>
                </div>
            </div>
        </header>
    );
} 