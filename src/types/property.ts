// Đại diện cho một bất động sản trong collection 'properties' trên Firestore.
export interface Property {
  // --- Định danh & Phân loại ---
  id: string; // Firestore Document ID
  memorableName: string; // Tên gợi nhớ để tìm kiếm
  propertyType: 'APARTMENT' | 'HOUSE' | 'LAND' | 'VILLA' | 'OFFICE'; // Loại BĐS
  listingType: 'sale' | 'rent'; // Loại hình tin đăng
  /**
   * Trạng thái hiện tại của bất động sản:
   * - 'DRAFT': Tin đăng ở trạng thái nháp, chưa công khai. Agent/owner có thể chỉnh sửa, chưa hiển thị cho khách hàng.
   * - 'AVAILABLE': BĐS đang sẵn sàng giao dịch (bán/cho thuê), đã được duyệt và hiển thị công khai.
   * - 'PENDING': Đang chờ xử lý, ví dụ: chờ duyệt, chờ xác nhận giao dịch, hoặc có khách đặt cọc nhưng chưa hoàn tất thủ tục.
   * - 'SOLD': BĐS đã bán xong, không còn giao dịch nữa. Tin đăng sẽ được ẩn hoặc đánh dấu đã bán.
   * - 'RENTED': BĐS đã cho thuê thành công, không còn giao dịch nữa. Tin đăng sẽ được ẩn hoặc đánh dấu đã cho thuê.
   */
  status: 'DRAFT' | 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED'; // Trạng thái

  // --- Thông tin Vị trí ---
  location: {
    city?: string; // Thành phố (tùy chọn, có thể không có nếu ở vùng sâu xa)
    district?: string; // Quận/huyện (tùy chọn)
    ward?: string; // Phường/xã (tùy chọn)
    street?: string; // Đường/phố (tùy chọn)
    fullAddress: string;
    gps?: { lat: number; lng: number }; // Tọa độ GPS (tùy chọn)
  };
  projectId?: string; // Mã dự án liên quan (nếu có)
  projectName?: string; // Tên dự án (nếu có)

  // --- Đặc điểm Vật lý ---
  area: number;
  frontage?: number; // Mặt tiền (tùy chọn)
  direction?: string; // Hướng nhà (tùy chọn)
  floor?: number; // Số tầng hiện tại (tùy chọn)
  bedrooms?: number; // Số phòng ngủ (tùy chọn)
  bathrooms?: number; // Số phòng tắm (tùy chọn)
  interiorStatus?: 'FURNISHED' | 'UNFURNISHED' | 'PARTIALLY_FURNISHED'; // Tình trạng nội thất (tùy chọn)
  amenities?: string[]; // Tiện ích đi kèm (tùy chọn)
  totalFloors?: number; // Tổng số tầng (nếu là nhà phố, biệt thự, tùy chọn)
  unitsPerFloor?: number; // Số căn hộ mỗi tầng (nếu là chung cư, tùy chọn)
  handoverDate?: Date; // Ngày sẵn sàng bàn giao (tùy chọn)
  currentStatus?: 'VACANT' | 'OCCUPIED' | 'RENTED_OUT'; // Tình trạng hiện tại (tùy chọn)

  // --- Thông tin Giá & Hoa hồng ---
  price: {
    value: number;
    pricePerSqm?: number; // Giá trên mỗi m2 (tùy chọn)
  };
  commission?: {
    rate?: number; // Tỷ lệ hoa hồng (tùy chọn)
    value?: number; // Giá trị hoa hồng (tùy chọn)
  };
  serviceFee?: number; // Phí dịch vụ (nếu có)

  // --- Pháp lý ---
  legalStatus?: 'PINK_BOOK' | 'RED_BOOK' | 'SALE_CONTRACT'; // Tình trạng pháp lý (tùy chọn)
  legalNote?: string; // Ghi chú pháp lý chi tiết (tùy chọn)
  documents?: { name: string; url: string }[]; // Danh sách tài liệu pháp lý (tùy chọn)

  // --- Media ---
  imageUrls: string[];
  images360?: string[]; // Ảnh 360 độ (tùy chọn)
  videoUrls?: string[]; // Video giới thiệu (tùy chọn)

  // --- Quản lý & Liên hệ ---
  /**
   * Thông tin liên hệ chính của bất động sản này.
   * contactName: tên người liên hệ (có thể là chủ nhà, đại lý, v.v.)
   * contactPhone: số điện thoại liên hệ
   * contactEmail: email liên hệ
   * contactRole: vai trò (OWNER, AGENT, REPRESENTATIVE, ...)
   */
  contactName?: string; // Tên người liên hệ (tùy chọn)
  contactPhone?: string; // Số điện thoại liên hệ (tùy chọn)
  contactEmail?: string; // Email liên hệ (tùy chọn)
  /**
   * Vai trò người liên hệ (contactRole):
   * - 'OWNER': Người liên hệ là chủ sở hữu bất động sản. Thường dùng khi chủ nhà trực tiếp giao dịch hoặc cung cấp thông tin.
   * - 'AGENT': Người liên hệ là môi giới, đại lý bất động sản. Họ đại diện cho chủ nhà hoặc công ty môi giới để giao dịch.
   * - 'REPRESENTATIVE': Người đại diện hợp pháp khác, có thể là người thân, quản lý tài sản, hoặc người được ủy quyền.
   * - 'OTHER': Trường hợp đặc biệt khác, ví dụ: bạn bè, đồng sở hữu, hoặc không xác định rõ vai trò.
   */
  contactRole?: 'OWNER' | 'AGENT' | 'REPRESENTATIVE' | 'OTHER'; // Vai trò người liên hệ (tùy chọn)
  /**
   * Loại hình sở hữu (ownershipType):
   * - 'OWNER': Bất động sản do chính chủ sở hữu đăng tin và giao dịch.
   * - 'AGENT': Đại lý hoặc môi giới đăng tin, có thể không phải là chủ sở hữu thực sự.
   * - 'EXCLUSIVE': Đại lý/môi giới có quyền phân phối độc quyền bất động sản này (chỉ một đơn vị được phép giao dịch).
   * - 'CONSIGNMENT': Bất động sản được ký gửi cho đại lý/môi giới bán hoặc cho thuê, không độc quyền (có thể nhiều bên cùng phân phối).
   */
  ownershipType?: 'OWNER' | 'AGENT' | 'EXCLUSIVE' | 'CONSIGNMENT'; // Loại hình sở hữu (tùy chọn)

  // --- Lịch sử & Ghi chú ---
  /**
   * Danh sách các ghi chú liên quan đến bất động sản này.
   * Mỗi ghi chú gồm nội dung, thời gian tạo và người tạo.
   */
  notes?: Array<{
    content: string;
    createdAt: Date;
    createdBy: string; // uid agent hoặc user tạo ghi chú
  }>;
  
  // --- Timestamps ---
  postedAt?: Date; // Ngày đăng tin (tùy chọn)
  expiredAt?: Date; // Ngày hết hạn tin (tùy chọn)
  createdAt: Date;
  updatedAt: Date;
  listingDuration?: number; // Số ngày tin sẽ hiển thị (tùy chọn, phục vụ tự động ẩn khi hết hạn)
}
