/**
 * Đại diện cho một người dùng trong collection 'users' trên Firestore.
 *
 * Lưu ý:
 * - Lịch sử thanh toán (paymentHistory) được tách thành sub-collection: users/{uid}/payments
 * - Trạng thái xóa mềm (soft delete) chỉ dựa vào deletedAt: Nếu deletedAt khác null nghĩa là đã xóa, không còn dùng accountStatus.
 * - Token thông báo push notification chỉ dùng deviceTokens (mỗi thiết bị 1 token), không còn notificationToken.
 * - Ngôn ngữ giao diện mặc định là tiếng Việt, không còn trường language trong settings.
 * - subscription.lastPayment là một trường denormalization để truy vấn nhanh giao dịch thanh toán gần nhất mà không cần đọc sub-collection payments. Khi triển khai thực tế, cần đảm bảo luôn đồng bộ lastPayment với payment mới nhất (nên dùng Cloud Function để tự động cập nhật khi có payment mới).
 */
export interface User {
  // --- Định danh & Thông tin cá nhân ---
  uid: string; // Firebase Auth UID
  firstName: string; // Họ
  lastName?: string; // Tên
  phoneNumber?: string; // Số điện thoại
  email: string; // Email (đồng bộ với Firebase Auth)
  emailVerified?: boolean; // Đã xác thực email
  phoneVerified?: boolean; // Đã xác thực số điện thoại
  address?: string; // Địa chỉ (tùy chọn)
  profileImage?: string; // Ảnh đại diện

  // --- Trạng thái tài khoản (Soft Delete) ---
  /**
   * Nếu deletedAt có giá trị (khác null) thì tài khoản được xem là đã bị xóa mềm (soft delete).
   * Nếu undefined hoặc null thì tài khoản còn hoạt động.
   */
  deletedAt?: Date; // Thời điểm xóa mềm tài khoản (nếu có)

  // --- Referral & giới thiệu ---
  referralCode?: string; // Mã giới thiệu của user (dùng để mời người khác)
  referredBy?: string; // UID người giới thiệu (nếu có)

  // --- Thiết bị & thông báo ---
  /**
   * Danh sách token thiết bị dùng cho push notification (1 user có thể đăng nhập nhiều thiết bị).
   * Nếu cần tracking chi tiết hơn, có thể tạo collection phụ devices.
   */
  deviceTokens?: string[];

  // --- Đăng ký dịch vụ hiện tại ---
  subscription?: {
    planName: string; // Tên gói dịch vụ ("Pro", "Basic", ...)
    type: 'MONTHLY' | 'YEARLY'; // Loại gói (theo tháng/năm)
    price: number; // Giá tiền (VND)
    autoRenew: boolean; // Có tự động gia hạn không
    startDate: Date; // Ngày bắt đầu sử dụng gói
    endDate: Date; // Ngày hết hạn gói
    /**
     * Trạng thái gói dịch vụ:
     * - 'TRIAL': Người dùng mới đăng ký, đang dùng thử miễn phí (thường là gói cao nhất). Có toàn quyền truy cập tính năng trả phí. Khi endDate qua đi sẽ chuyển thành 'EXPIRED'.
     * - 'ACTIVE': Đã thanh toán, gói còn hiệu lực. Có đầy đủ quyền theo planName. Nếu autoRenew=true, hệ thống sẽ tự động gia hạn khi đến hạn. Nếu gia hạn thất bại sẽ chuyển thành 'EXPIRED'.
     * - 'CANCELLED': Người dùng chủ động hủy gói (tắt autoRenew). Vẫn được dùng đến hết endDate, sau đó chuyển thành 'EXPIRED'.
     *   Trạng thái này giúp phân biệt người dùng chủ động rời đi với người dùng quên/thất bại khi gia hạn.
     * - 'EXPIRED': Gói đã hết hạn, không còn quyền truy cập tính năng trả phí. Đây là điểm cuối của 'TRIAL', 'ACTIVE' (khi gia hạn thất bại), hoặc 'CANCELLED' (khi hết thời gian đã trả tiền).
     */
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'TRIAL'; // Trạng thái gói dịch vụ
    lastPayment?: {
      transactionId: string; // Mã giao dịch thanh toán gần nhất
      amount: number; // Số tiền thanh toán
      paidAt: Date; // Thời điểm thanh toán
      method: string; // Phương thức thanh toán (momo, vnpay, ...)
    }
  };

  // --- Cài đặt cá nhân ---
  settings?: {
    theme?: 'light' | 'dark' | 'system'; // Chủ đề giao diện người dùng
    notificationEnabled?: boolean; // Bật/tắt nhận thông báo
    // [key: string]: any; // Cho phép mở rộng các tuỳ chọn khác trong tương lai
  };

  // --- Trạng thái Onboarding ---
  onboarding?: {
    completed?: boolean; // Đã hoàn thành onboarding chưa
    steps?: string[]; // Danh sách các bước đã hoàn thành (nếu muốn tracking chi tiết)
    lastStep?: string; // Bước cuối cùng đã dừng
  };

  // --- Lịch sử & Ghi chú ---
  notes?: string; // Ghi chú nội bộ cho user (chỉ admin thấy)

  // --- Timestamps (Quản lý bởi Firestore Server) ---
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date; // Thời điểm đăng nhập gần nhất
}

/**
 * Sub-collection: users/{uid}/payments
 * Lưu lịch sử thanh toán của user (mỗi document là 1 lần thanh toán)
 */
export interface Payment {
  transactionId: string; // Mã giao dịch
  amount: number; // Số tiền thanh toán
  paidAt: Date; // Thời điểm thanh toán
  method: string; // Phương thức thanh toán (momo, vnpay, ...)
  status: 'SUCCESS' | 'FAILED' | 'PENDING'; // Trạng thái giao dịch
  note?: string; // Ghi chú thêm (nếu có)
}
