import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thanh toán | XLab - Phần mềm và Dịch vụ',
  description: 'Thanh toán an toàn và nhanh chóng cho các sản phẩm và dịch vụ của XLab.',
};

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Tùy chọn thanh toán</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Sản phẩm phần mềm</h2>
          <ul className="space-y-4">
            <li className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">XLab Business Suite</span>
                <span className="text-teal-600 font-bold">5.000.000 ₫</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Giải pháp quản lý doanh nghiệp toàn diện với các tính năng quản lý nhân sự, kế toán
                và quản lý khách hàng.
              </p>
              <Link
                href="/account/deposit?amount=5000000"
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Mua ngay
              </Link>
            </li>

            <li className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">XLab Analytics Pro</span>
                <span className="text-teal-600 font-bold">3.500.000 ₫</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Công cụ phân tích dữ liệu mạnh mẽ giúp doanh nghiệp đưa ra quyết định dựa trên dữ
                liệu.
              </p>
              <Link
                href="/account/deposit?amount=3500000"
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Mua ngay
              </Link>
            </li>

            <li>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">XLab CRM</span>
                <span className="text-teal-600 font-bold">2.800.000 ₫</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Hệ thống quản lý quan hệ khách hàng giúp doanh nghiệp tối ưu hóa quy trình bán hàng.
              </p>
              <Link
                href="/account/deposit?amount=2800000"
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Mua ngay
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Dịch vụ chuyên nghiệp</h2>
          <ul className="space-y-4">
            <li className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Tư vấn triển khai hệ thống</span>
                <span className="text-teal-600 font-bold">2.000.000 ₫</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Dịch vụ tư vấn chuyên nghiệp giúp doanh nghiệp lựa chọn và triển khai hệ thống phù
                hợp.
              </p>
              <Link
                href="/account/deposit?amount=2000000"
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Đăng ký
              </Link>
            </li>

            <li className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Đào tạo người dùng</span>
                <span className="text-teal-600 font-bold">1.500.000 ₫</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Khóa đào tạo người dùng cuối giúp nhân viên sử dụng hiệu quả các phần mềm của XLab.
              </p>
              <Link
                href="/account/deposit?amount=1500000"
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Đăng ký
              </Link>
            </li>

            <li>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Hỗ trợ kỹ thuật (1 năm)</span>
                <span className="text-teal-600 font-bold">3.200.000 ₫</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Gói hỗ trợ kỹ thuật 24/7 trong 1 năm, đảm bảo hệ thống của bạn luôn vận hành trơn
                tru.
              </p>
              <Link
                href="/account/deposit?amount=3200000"
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Đăng ký
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-teal-50 p-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-3">Thông tin thanh toán</h2>
        <p className="mb-3">
          XLab cung cấp phương thức thanh toán an toàn và tiện lợi cho khách hàng:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Thanh toán bằng số dư tài khoản (nhanh chóng và tiện lợi)</li>
          <li>Nạp tiền qua chuyển khoản ngân hàng</li>
          <li>Nạp tiền qua các ví điện tử (MoMo, ZaloPay, VNPay)</li>
        </ul>
        <p className="text-sm text-gray-600">
          Mọi giao dịch đều được bảo mật theo tiêu chuẩn quốc tế. Bạn có thể nạp tiền vào tài khoản
          và thanh toán ngay lập tức bằng số dư.
        </p>
      </div>
    </div>
  );
}
