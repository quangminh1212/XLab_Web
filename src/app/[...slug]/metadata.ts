import type { Metadata } from 'next';

// Danh sách các trang đang phát triển
const validSlugs = ['pricing', 'about', 'contact', 'support', 'terms', 'privacy', 'login', 'signup'];

type Props = {
    params: { slug: string[] }
};

// Tạo metadata động dựa trên slug
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = params.slug[0];

    if (!validSlugs.includes(slug)) {
        return {
            title: 'Trang không tồn tại | XLab',
        };
    }

    // Chuyển đổi slug thành title (vd: about -> Giới thiệu)
    const slugToTitle: Record<string, string> = {
        pricing: 'Bảng giá',
        about: 'Giới thiệu',
        contact: 'Liên hệ',
        support: 'Hỗ trợ',
        terms: 'Điều khoản sử dụng',
        privacy: 'Chính sách bảo mật',
        login: 'Đăng nhập',
        signup: 'Đăng ký',
    };

    return {
        title: `${slugToTitle[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)} | XLab`,
        description: `Trang ${slugToTitle[slug]} của XLab - Phần mềm chất lượng cao`,
    };
} 