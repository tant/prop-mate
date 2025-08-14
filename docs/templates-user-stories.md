### 1. Tạo landing page siêu nhanh
> Là một nhà môi giới, tôi muốn tạo landing page cho bất động sản chỉ với 3 trường (tiêu đề, đối tượng khách hàng, USP) để tiết kiệm thời gian nhập liệu và có nội dung marketing hấp dẫn nhờ AI.

**Mô tả chi tiết:** Người dùng chỉ cần nhập 3 trường cơ bản, hệ thống sẽ sử dụng AI để sinh toàn bộ nội dung landing page theo template đã chọn. Việc này giúp tiết kiệm thời gian, giảm thao tác thủ công và đảm bảo nội dung marketing chuyên nghiệp, hấp dẫn ngay cả với người không giỏi viết lách.

**Flow nghiệp vụ:**
1. Người dùng chọn "Tạo landing page mới" từ sidebar hoặc tab property.
2. Chọn property (nếu tạo từ sidebar).
3. Chọn template, audience, tone.
4. Nhập 3 trường: tiêu đề, đối tượng khách hàng, USP.
5. Nhấn "Tạo nhanh với AI".
6. Hệ thống gọi AI sinh nội dung, hiển thị preview.
7. Người dùng có thể publish ngay, chỉnh sửa tiếp hoặc xóa để tạo lại.

**Acceptance Criteria:**
- Có thể tạo landing page chỉ với 3 trường bắt buộc.
- Nội dung được sinh tự động bởi AI đúng schema template.
- Có thể xem preview trước khi publish.
- Có thể publish, chỉnh sửa tiếp hoặc xóa landing page vừa tạo.

---

### 2. Chỉnh sửa chi tiết landing page
> Là một nhà môi giới, tôi muốn chỉnh sửa từng section của landing page sau khi AI sinh nội dung để cá nhân hóa thông điệp phù hợp với từng nhóm khách hàng.

**Mô tả chi tiết:** Sau khi AI sinh nội dung, người dùng có thể chỉnh sửa từng phần (section) như tiêu đề, mô tả, hình ảnh, điểm nổi bật... để phù hợp hơn với thực tế, chiến dịch hoặc nhóm khách hàng mục tiêu. Việc chỉnh sửa này giúp tăng tính cá nhân hóa và hiệu quả chuyển đổi.

**Flow nghiệp vụ:**
1. Sau khi AI sinh nội dung, người dùng nhấn "Chỉnh sửa chi tiết".
2. Giao diện hiển thị từng section theo template.
3. Người dùng chỉnh sửa nội dung từng section, reorder, chọn ảnh, gắn nhãn AI/manual.
4. Lưu nháp hoặc publish.

**Acceptance Criteria:**
- Có thể chỉnh sửa từng section của landing page.
- Thay đổi được lưu lại (tự động hoặc thủ công).
- Có thể publish sau khi chỉnh sửa.

---

### 3. Quản lý landing page tập trung
> Là một nhà môi giới, tôi muốn xem, tìm kiếm, lọc, và thao tác hàng loạt với các landing page đã tạo từ sidebar để dễ dàng quản lý và theo dõi hiệu quả.

**Mô tả chi tiết:** Tất cả landing page được quản lý tập trung tại sidebar. Người dùng có thể xem danh sách, tìm kiếm theo từ khóa, lọc theo trạng thái (draft/published), thao tác hàng loạt như xóa, publish, unpublish... giúp tiết kiệm thời gian và kiểm soát tốt hơn.

**Flow nghiệp vụ:**
1. Người dùng truy cập sidebar "Landing Pages".
2. Xem danh sách landing page, tìm kiếm, lọc theo trạng thái, property, audience...
3. Chọn nhiều landing page để thao tác bulk (xóa, publish, unpublish).

**Acceptance Criteria:**
- Có thể xem danh sách, tìm kiếm, lọc landing page.
- Có thể thao tác hàng loạt (bulk action) với nhiều landing page.

---

### 4. Quản lý landing page theo từng bất động sản
> Là một nhà môi giới, tôi muốn xem và quản lý các landing page của từng bất động sản ngay trong trang chi tiết property để thuận tiện thao tác theo ngữ cảnh.

**Mô tả chi tiết:** Trong trang chi tiết của mỗi bất động sản, người dùng có thể xem, tạo mới hoặc chỉnh sửa các landing page liên quan đến property đó. Điều này giúp thao tác theo ngữ cảnh, dễ theo dõi và cập nhật nội dung phù hợp với từng tài sản.

**Flow nghiệp vụ:**
1. Người dùng vào trang chi tiết property.
2. Tab "Landing Pages" hiển thị danh sách landing page của property đó.
3. Có thể tạo mới, chỉnh sửa, xóa, publish/unpublish landing page ngay tại đây.

**Acceptance Criteria:**
- Có thể xem danh sách landing page theo từng property.
- Có thể thao tác đầy đủ (tạo, sửa, xóa, publish) trong tab property.

---

### 5. Chọn template và audience/tone
> Là một nhà môi giới, tôi muốn chọn template, audience và tone (enum hoặc custom) khi tạo landing page để phù hợp với từng chiến dịch marketing.

**Mô tả chi tiết:** Khi tạo landing page, người dùng được chọn mẫu giao diện (template), đối tượng khách hàng (audience) và tone (giọng điệu) phù hợp (có thể chọn enum hoặc nhập custom). Điều này giúp cá nhân hóa nội dung, tăng hiệu quả marketing và phù hợp với từng chiến dịch cụ thể.

**Flow nghiệp vụ:**
1. Khi tạo landing page, người dùng chọn template từ danh sách có preview.
2. Chọn audience và tone từ enum hoặc nhập custom.

**Acceptance Criteria:**
- Có thể chọn template, audience, tone khi tạo landing page.
- Thông tin này được truyền vào prompt AI và lưu vào landing page.

---

### 6. Preview & xuất bản landing page
> Là một nhà môi giới, tôi muốn xem trước landing page theo đúng template và xuất bản (public/unlisted) với slug tự sinh, đảm bảo không lộ thông tin nhạy cảm.

**Mô tả chi tiết:** Sau khi hoàn thiện nội dung, người dùng có thể xem trước landing page đúng theo template, kiểm tra lại toàn bộ thông tin trước khi xuất bản. Slug được sinh tự động, đảm bảo không lộ thông tin nhạy cảm, có thể chọn chế độ public hoặc unlisted.

**Flow nghiệp vụ:**
1. Sau khi tạo hoặc chỉnh sửa, người dùng nhấn "Preview" để xem landing page.
2. Kiểm tra lại nội dung, chọn chế độ public/unlisted.
3. Nhấn "Xuất bản" để publish landing page.

**Acceptance Criteria:**
- Có thể xem preview landing page đúng template.
- Có thể chọn chế độ public/unlisted khi publish.
- Slug được sinh tự động, không chứa PII.

---

### 7. Copy link & chia sẻ landing page
> Là một nhà môi giới, tôi muốn copy link landing page đã xuất bản để gửi cho khách hàng hoặc chia sẻ trên các kênh marketing.

**Mô tả chi tiết:** Sau khi xuất bản, hệ thống cung cấp link landing page để người dùng dễ dàng copy và chia sẻ qua email, mạng xã hội, tin nhắn... giúp tăng khả năng tiếp cận khách hàng tiềm năng.

**Flow nghiệp vụ:**
1. Sau khi publish, hệ thống hiển thị link landing page.
2. Người dùng nhấn "Copy link" để sao chép URL.
3. Chia sẻ link qua các kênh marketing.

**Acceptance Criteria:**
- Sau khi publish, luôn hiển thị/copy được link landing page.
- Link hoạt động đúng, truy cập được landing page public/unlisted.

---

### 8. Xóa hoặc unpublish landing page
> Là một nhà môi giới, tôi muốn xóa hoặc unpublish landing page khi không còn sử dụng để đảm bảo chỉ những trang phù hợp mới được công khai.

**Mô tả chi tiết:** Người dùng có thể xóa vĩnh viễn hoặc chuyển landing page về trạng thái nháp (unpublish) khi không còn sử dụng, đảm bảo chỉ những trang phù hợp, còn giá trị mới được công khai tới khách hàng.

**Flow nghiệp vụ:**
1. Trong danh sách hoặc chi tiết landing page, người dùng chọn "Xóa" hoặc "Unpublish".
2. Landing page bị xóa vĩnh viễn hoặc chuyển về draft, không còn public.

**Acceptance Criteria:**
- Có thể xóa hoặc unpublish landing page bất kỳ lúc nào.
- Landing page unpublish không còn truy cập public.

---

### 9. Xử lý lỗi AI & nhập tay
> Là một nhà môi giới, tôi muốn được thông báo khi AI sinh nội dung lỗi và có thể tự nhập tay để vẫn xuất bản được landing page.

**Mô tả chi tiết:** Nếu AI sinh nội dung lỗi, thiếu hoặc không đúng schema, hệ thống sẽ thông báo rõ ràng và cho phép người dùng tự nhập tay hoặc chỉnh sửa lại để vẫn có thể xuất bản landing page mà không bị gián đoạn công việc.

**Flow nghiệp vụ:**
1. Sau khi gọi AI, nếu lỗi hoặc thiếu dữ liệu, hệ thống hiển thị thông báo lỗi rõ ràng.
2. Người dùng có thể chỉnh sửa thủ công các trường bị lỗi hoặc nhập lại toàn bộ nội dung.
3. Lưu nháp hoặc publish như bình thường.

**Acceptance Criteria:**
- Nếu AI lỗi, luôn có thông báo rõ ràng.
- Có thể nhập tay và publish landing page mà không bị chặn.

---

### 10. Đảm bảo SEO & responsive
> Là một nhà môi giới, tôi muốn landing page được tối ưu SEO, hiển thị tốt trên mọi thiết bị để tăng hiệu quả tiếp cận khách hàng.

**Mô tả chi tiết:** Landing page được tối ưu các yếu tố SEO (title, description, canonical, noindex...), hiển thị tốt trên mọi thiết bị (desktop, mobile, tablet), giúp tăng hiệu quả tiếp cận khách hàng và nâng cao thứ hạng tìm kiếm trên Google.

**Flow nghiệp vụ:**
1. Khi publish, hệ thống tự động sinh metadata SEO (title, description, canonical, og:image...).
2. Trang landing page public luôn responsive, kiểm tra trên nhiều thiết bị.

**Acceptance Criteria:**
- Landing page có metadata SEO đúng chuẩn.
- Trang hiển thị tốt trên desktop, mobile, tablet.

---

### 12. Tùy chỉnh đường dẫn (slug)
> Là một nhà môi giới, tôi muốn có thể tùy chỉnh đường dẫn (slug) cho landing page của mình (ví dụ: /p/biet-thu-vinhomes) để tối ưu SEO và dễ nhớ, bên cạnh việc sử dụng slug tự động.

**Mô tả chi tiết:** Ngoài slug tự động, người dùng có thể tùy chỉnh đường dẫn landing page để tối ưu SEO, dễ nhớ, thuận tiện cho việc chia sẻ và tăng nhận diện thương hiệu cá nhân hoặc dự án.

**Flow nghiệp vụ:**
1. Khi tạo hoặc chỉnh sửa landing page, người dùng có thể nhập slug tùy chỉnh.
2. Hệ thống kiểm tra trùng lặp, không cho phép slug chứa PII.

**Acceptance Criteria:**
- Có thể nhập slug tùy chỉnh khi tạo/sửa landing page.
- Slug luôn unique, không chứa thông tin nhạy cảm.

---

### 13. Tự động lưu bản nháp
> Là một nhà môi giới, tôi muốn các thay đổi của mình trên landing page được tự động lưu thành bản nháp để không bị mất công việc khi tôi bận hoặc vô tình đóng trình duyệt.

**Mô tả chi tiết:** Mọi thay đổi trên landing page sẽ được tự động lưu thành bản nháp, giúp người dùng không bị mất dữ liệu khi bận việc khác, mất kết nối hoặc vô tình đóng trình duyệt.

**Flow nghiệp vụ:**
1. Khi chỉnh sửa landing page, hệ thống tự động lưu nháp định kỳ hoặc khi có thay đổi.
2. Khi quay lại, người dùng tiếp tục từ bản nháp gần nhất.

**Acceptance Criteria:**
- Mọi thay đổi đều được tự động lưu nháp.
- Không bị mất dữ liệu khi reload hoặc đóng trình duyệt.

---

### 15. Xem trước các mẫu template
> Là một nhà môi giới, trước khi bắt đầu tạo, tôi muốn xem trước giao diện của các template có sẵn để có thể chọn được mẫu thiết kế phù hợp nhất với bất động sản và chiến dịch của mình.

**Mô tả chi tiết:** Trước khi tạo landing page, người dùng có thể xem trước giao diện các template có sẵn (preview), giúp lựa chọn mẫu phù hợp nhất với bất động sản và mục tiêu marketing.

**Flow nghiệp vụ:**
1. Trước khi tạo landing page, người dùng xem danh sách template với hình ảnh preview.
2. Chọn template phù hợp để bắt đầu tạo landing page.

**Acceptance Criteria:**
- Có thể xem preview tất cả template trước khi tạo landing page.
- Preview hiển thị đúng giao diện thực tế của template.

---

### 16. Chỉ định trang chính (Canonical) cho SEO
> Là một nhà môi giới, khi tạo nhiều biến thể landing page cho cùng một bất động sản, tôi muốn chỉ định một trang làm trang chính (canonical) để tập trung sức mạnh SEO và tránh bị Google phạt vì trùng lặp nội dung.

**Mô tả chi tiết:** Khi có nhiều biến thể landing page cho cùng một property, người dùng có thể chỉ định một trang làm canonical để tập trung sức mạnh SEO, tránh bị Google đánh giá trùng lặp nội dung và đảm bảo thứ hạng tìm kiếm tốt nhất cho trang chính.

**Flow nghiệp vụ:**
1. Khi có nhiều landing page cho một property, người dùng chọn một trang làm canonical.
2. Hệ thống cập nhật metadata canonical cho trang đó.

**Acceptance Criteria:**
- Có thể chỉ định/cập nhật canonical cho mỗi property.
- Metadata canonical được sinh đúng trên trang public.