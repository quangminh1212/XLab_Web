export interface SiteSetting {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface PaymentSetting {
  enableMomo: boolean;
  enableZalopay: boolean;
  enableBankTransfer: boolean;
  enableCreditCard: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
}

export interface EmailSetting {
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  senderEmail: string;
  senderName: string;
  enableEmailNotification: boolean;
}

export interface SystemSettings {
  site: SiteSetting;
  payment: PaymentSetting;
  email: EmailSetting;
  maintenanceMode: boolean;
  disableRegistration: boolean;
  disableCheckout: boolean;
  lastUpdated: string;
  updatedBy: string;
}

// Giá trị mặc định cho cài đặt hệ thống
export const defaultSystemSettings: SystemSettings = {
  site: {
    siteName: 'XLab Shop',
    siteDescription: 'Cửa hàng bán sản phẩm công nghệ',
    logoUrl: '/images/logo.png',
    faviconUrl: '/images/favicon.ico',
    contactEmail: 'contact@xlabshop.vn',
    contactPhone: '0123456789',
    address: 'Số 1, Đường ABC, Phường XYZ, Quận 123, TP.HCM',
  },
  payment: {
    enableMomo: false,
    enableZalopay: false,
    enableBankTransfer: true,
    enableCreditCard: false,
    bankName: 'BIDV',
    bankAccountName: 'CÔNG TY TNHH XLAB',
    bankAccountNumber: '12345678901234',
    bankBranch: 'TP.HCM',
  },
  email: {
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    senderEmail: 'noreply@xlabshop.vn',
    senderName: 'XLab Shop',
    enableEmailNotification: false,
  },
  maintenanceMode: false,
  disableRegistration: false,
  disableCheckout: false,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system',
};

// Hàm kiểm tra email hợp lệ
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Hàm kiểm tra số điện thoại hợp lệ
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
}

// Xác thực cài đặt hệ thống
export function validateSystemSettings(settings: SystemSettings): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Kiểm tra cài đặt site
  if (!settings.site.siteName) {
    errors.push('Tên trang web không được để trống');
  }

  if (!isValidEmail(settings.site.contactEmail)) {
    errors.push('Email liên hệ không hợp lệ');
  }

  if (!isValidPhone(settings.site.contactPhone)) {
    errors.push('Số điện thoại liên hệ không hợp lệ');
  }

  // Kiểm tra cài đặt thanh toán
  if (settings.payment.enableBankTransfer) {
    if (!settings.payment.bankName) {
      errors.push('Tên ngân hàng không được để trống khi bật thanh toán chuyển khoản');
    }
    if (!settings.payment.bankAccountName) {
      errors.push('Tên tài khoản ngân hàng không được để trống khi bật thanh toán chuyển khoản');
    }
    if (!settings.payment.bankAccountNumber) {
      errors.push('Số tài khoản ngân hàng không được để trống khi bật thanh toán chuyển khoản');
    }
  }

  // Kiểm tra cài đặt email
  if (settings.email.enableEmailNotification) {
    if (!settings.email.smtpServer) {
      errors.push('Máy chủ SMTP không được để trống khi bật thông báo email');
    }
    if (!settings.email.smtpUsername) {
      errors.push('Tên đăng nhập SMTP không được để trống khi bật thông báo email');
    }
    if (!settings.email.smtpPassword) {
      errors.push('Mật khẩu SMTP không được để trống khi bật thông báo email');
    }
    if (!isValidEmail(settings.email.senderEmail)) {
      errors.push('Email người gửi không hợp lệ');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
