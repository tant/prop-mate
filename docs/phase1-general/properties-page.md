Tôi mô tả luồng ở đây
- Trang /properties 
  xem được tất cả bất động sản user đang quản lý. 
  mỗi bất động sản display trong 1 card và có 2 lựa chọn là xem chi tiết hoặc sửa thông tin
  nếu bấm xem thì vào trang /properties[id] với editmode =false, tab=details
  nếu bấm sửa thì vào trang /properties[id] với editmode =true, tab=details

- Trang /properties/[id] có tổng cộng 3 mode
    Edit mode = false: (chế độ chỉ xem),  tab=details
      Hiện option cho phép xem các trang sản phẩm, khi check vào thì chuyển sang trang /properties/[id]?tab=product-pages
      Hiện nút sửa khi bấm vào thì editmode = true, tab=details
      Hiện các thông tin bất động sản theo kiểu disable không thể cập nhật được
    Edit mode = true (chế độ edit),  tab=details
      Giấu nút Sửa
      Hiện nút Lưu và nút Hủy ở trên (header) và dưới trang (cuối cùng của phần content)
      Khi bấm Hủy thì chỉ tắt edit mode không làm gì hết
      Khi bấm Lưu thì lưu dữ liệu mới vào trong db, hiện toast báo thành công hay thất bại khoảng 1s, sau đó tắt edit mode
      Các subcomponent phải trở thành chế độ bình thường edit được
    tab=product-pages (chế độ xem trang)
      Hiện các trang sản phẩm của bất động sản này trong các card
      Mỗi card có button chỉnh sửa và xóa
      Bấm xóa thì xóa luôn trang đó
      Bấm chỉnh sửa thì mở page edit bên /property-pages/[id]/edit
      Hiện nút tạo thêm trang sẽ tích hợp tính năng tạo thêm trang