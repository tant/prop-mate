/**
 * Đại diện cho một người dùng trong collection 'users' trên Firestore.
 */

interface User {
  // --- Định danh & Thông tin cá nhân ---
  uid: string; // Firebase Auth UID
  firstName: string; // Họ
  lastName: string; // Tên
  phoneNumber: string; // Số điện thoại
  email: string; // Email (đồng bộ với Firebase Auth)
  emailVerified?: boolean; // Đã xác thực email
  phoneVerified?: boolean; // Đã xác thực số điện thoại
  address?: string; // Địa chỉ (tùy chọn)
  customerCode?: string; // Mã khách hàng nội bộ (tùy chọn)
  profileImage?: string; // Ảnh đại diện

  // --- Trạng thái tài khoản ---
  accountStatus?: 'ACTIVE' | 'SUSPENDED' | 'DELETED'; // Trạng thái tài khoản

  // --- Referral & giới thiệu ---
  referralCode?: string; // Mã giới thiệu của user
  referredBy?: string; // UID người giới thiệu

  // --- Thiết bị & thông báo ---
  deviceToken?: string; // Token thiết bị (push notification)
  notificationToken?: string; // Token thông báo (push notification)

  // --- Đăng ký dịch vụ hiện tại ---
  subscription?: {
    planName: string; // Tên gói ("Pro", "Basic", ...)
    type: 'MONTHLY' | 'YEARLY'; // Loại gói
    price: number; // Giá tiền (VND)
    autoRenew: boolean; // Tự động gia hạn
    startDate: firebase.firestore.Timestamp; // Ngày bắt đầu
    endDate: firebase.firestore.Timestamp; // Ngày hết hạn
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'TRIAL'; // Trạng thái
    lastPayment?: {
      transactionId: string;
      amount: number;
      paidAt: firebase.firestore.Timestamp;
      method: string; // Phương thức thanh toán
    }
  };

  // --- Lịch sử thanh toán ---
  paymentHistory?: Array<{
    transactionId: string;
    amount: number;
    paidAt: firebase.firestore.Timestamp;
    method: string; // Phương thức thanh toán
    status: 'SUCCESS' | 'FAILED' | 'PENDING'; // Trạng thái giao dịch
    note?: string; // Ghi chú
  }>;

  // --- Lịch sử & Ghi chú ---
  notes?: string; // Ghi chú nội bộ

  // --- Timestamps (Quản lý bởi Firestore Server) ---
  createdAt: firebase.firestore.Timestamp; // Ngày tạo tài khoản
  updatedAt: firebase.firestore.Timestamp; // Ngày cập nhật gần nhất
}
