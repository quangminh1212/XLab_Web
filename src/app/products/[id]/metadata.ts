import type { Metadata } from 'next';

// Dữ liệu mẫu cho sản phẩm (giống trang products, sẽ được thay bằng dữ liệu thực tế từ API/DB)
const products = [
    {
        id: 'analytics',
        name: 'XLab Analytics',
        description: 'Giải pháp phân tích dữ liệu hiện đại giúp doanh nghiệp ra quyết định thông minh.',
        // Các thông tin khác...
    },
    {
        id: 'security',
        name: 'XLab Security',
        description: 'Bảo vệ dữ liệu quan trọng của bạn với giải pháp bảo mật toàn diện.',
        // Các thông tin khác...
    },
    {
        id: 'developer',
        name: 'XLab Developer',
        description: 'Bộ công cụ phát triển phần mềm cao cấp cho các lập trình viên chuyên nghiệp.',
        // Các thông tin khác...
    },
];

type Props = {
    params: { id: string }
};

// Tạo metadata động dựa trên tham số sản phẩm
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = products.find(p => p.id === params.id);

    if (!product) {
        return {
            title: 'Sản phẩm không tồn tại | XLab',
        };
    }

    return {
        title: `${product.name} | XLab - Phần mềm chất lượng cao`,
        description: product.description,
        openGraph: {
            title: `${product.name} | XLab`,
            description: product.description,
            type: 'website',
        },
    };
} 