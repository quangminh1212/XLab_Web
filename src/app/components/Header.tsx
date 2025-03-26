'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
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
                    {status === 'authenticated' && session?.user ? (
                        <div className="user-dropdown">
                            <button className="user-menu-btn" onClick={toggleMenu}>
                                {session.user.image ? (
                                    <img src={session.user.image} alt={session.user.name || 'User'} className="user-avatar-small" />
                                ) : (
                                    <div className="user-avatar-small">
                                        {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                                    </div>
                                )}
                                <span className="user-name-display">{session.user.name}</span>
                            </button>

                            <div className={`user-dropdown-menu ${menuOpen ? 'active' : ''}`}>
                                <ul>
                                    <li>
                                        <Link href="/profile">
                                            <span className="menu-icon">👤</span>
                                            <span>Hồ sơ của tôi</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/orders">
                                            <span className="menu-icon">🛒</span>
                                            <span>Đơn hàng của tôi</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/downloads">
                                            <span className="menu-icon">⬇️</span>
                                            <span>Tải xuống</span>
                                        </Link>
                                    </li>
                                    <div className="user-dropdown-divider"></div>
                                    <li>
                                        <button onClick={handleSignOut}>
                                            <span className="menu-icon">🚪</span>
                                            <span>Đăng xuất</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-light">Đăng nhập</Link>
                            <Link href="/register" className="btn btn-primary">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
} 