/**
 * Đại diện cho một bất động sản trong collection 'properties' trên Firestore.
 */
 
interface Property {
  // --- Định danh & Phân loại ---
  id: string; // Firestore Document ID
  memorableName: string; // Tên gợi nhớ để tìm kiếm, ví dụ: "Căn hộ The Sun Avenue 2PN"
  propertyType: 'APARTMENT' | 'HOUSE' | 'LAND' | 'VILLA' | 'OFFICE'; // Loại BĐS (chuẩn hóa)
  listingType: 'sale' | 'rent'; // Loại hình tin đăng (chuẩn hóa)
  status: 'DRAFT' | 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED'; // Trạng thái (chuẩn hóa)

  // --- Thông tin Vị trí (Chi tiết hóa để lọc) ---
  location: {
    city?: string;       // Tỉnh/Thành phố (tùy chọn)
    district?: string;   // Quận/Huyện (tùy chọn)
    ward?: string;       // Phường/Xã (tùy chọn)
    street?: string;     // Tên đường (tùy chọn)
    fullAddress: string; // Địa chỉ đầy đủ để hiển thị
    gps?: { lat: number; lng: number }; // Tọa độ (tùy chọn)
  };
  projectId?: string; // ID tham chiếu đến collection 'projects' (tùy chọn)
  projectName?: string; // Tên dự án/tòa nhà (tùy chọn)

  // --- Đặc điểm Vật lý ---
  area: number; // Diện tích (m2)
  frontage?: number; // Mặt tiền (m)
  direction?: string; // Hướng nhà (ví dụ: "Đông Nam")
  floor?: number; // Số tầng
  bedrooms?: number; // Số phòng ngủ
  bathrooms?: number; // Số phòng tắm
  interiorStatus?: 'FURNISHED' | 'UNFURNISHED' | 'PARTIALLY_FURNISHED'; // Tình trạng nội thất
  amenities?: string[]; // Danh sách các tiện ích khác

  // --- Thông tin Giá & Hoa hồng ---
  price: {
    value: number; // Giá tiền vnd(trên giao diện luôn dùng đơn vị triệu đồng)
    pricePerSqm?: number; // Đơn giá / m2 (có thể tự động tính toán)
  };
  commission?: { // Thông tin hoa hồng cho môi giới
    rate?: number; // Tỷ lệ %
    value?: number; // Số tiền cố định
  };
  
  // --- Pháp lý ---
  legalStatus?: 'PINK_BOOK' | 'RED_BOOK' | 'SALE_CONTRACT'; // Tình trạng pháp lý (chuẩn hóa)
  documents?: { name: string; url: string }[]; // Mảng các tài liệu (tên và URL)

  // --- Media ---
  imageUrls: string[]; // Mảng URL hình ảnh (ảnh đầu tiên là ảnh bìa)
  images360?: string[]; // Mảng URL ảnh 360 độ
  videoUrls?: string[]; // Mảng URL video

  // --- Quản lý & Liên hệ ---
  agentId: string; // ID của môi giới phụ trách (Firebase Auth UID - Rất quan trọng)
  ownerId?: string; // ID tham chiếu đến collection 'owners' (tùy chọn)
  
  // --- Lịch sử & Ghi chú ---
  notes?: string; // Ghi chú nội bộ của môi giới

  // --- Timestamps (Quản lý bởi Firestore Server) ---
  postedAt?: firebase.firestore.Timestamp; // Ngày đăng tin
  expiredAt?: firebase.firestore.Timestamp; // Ngày hết hạn
  createdAt: firebase.firestore.Timestamp; // Ngày tạo record
  updatedAt: firebase.firestore.Timestamp; // Ngày cập nhật record gần nhất
}
