import Image from "next/image";
import { IconFileText, IconCalendar, IconAlertTriangle, IconCloudOff } from "@tabler/icons-react";

import StoryButton from "@/components/page-home/story-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 py-16 max-w-6xl mx-auto">
        <div className="flex-1 mb-10 md:mb-0 md:mr-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
            App quản lý bất động sản dành cho môi giới
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Tập trung toàn bộ giỏ hàng, khách hàng và lịch hẹn vào một nơi duy nhất.<br />
            Làm việc hiệu quả ngay trên điện thoại, kể cả khi không có mạng.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition text-lg font-semibold mb-2"
          >
            Vào App
          </a>
          <StoryButton />
          <div className="text-sm text-gray-500 mt-2">
            Sử dụng thử 1 tháng miễn phí. Không cần thẻ tín dụng.
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/globe.svg"
            alt="App Dashboard Mockup"
            width={350}
            height={350}
            className="rounded-xl shadow-lg border"
            priority
          />
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-blue-800 mb-10">
            Công việc của bạn có đang bị phân mảnh?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <IconFileText className="w-12 h-12 text-blue-500" />
              <h3 className="font-bold mt-4 mb-2">Dữ liệu phân mảnh?</h3>
              <p className="text-gray-600 text-sm">
                Lưu thông tin khách hàng trên Zalo, giỏ hàng trên Excel, lịch hẹn trong sổ tay?
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <IconCalendar className="w-12 h-12 text-blue-500" />
              <h3 className="font-bold mt-4 mb-2">Mất thời gian?</h3>
              <p className="text-gray-600 text-sm">
                Phải tìm kiếm, đối chiếu thông tin từ nhiều nguồn khác nhau khi khách hàng cần gấp?
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <IconAlertTriangle className="w-12 h-12 text-blue-500" />
              <h3 className="font-bold mt-4 mb-2">Công việc gián đoạn?</h3>
              <p className="text-gray-600 text-sm">
                Không thể truy cập dữ liệu quan trọng khi ở khu vực sóng yếu hoặc không có Internet?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution & Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-blue-800 mb-12">
            PropMate - trợ lý ảo &quot;tất cả trong một&quot; của bạn
          </h2>
          <div className="space-y-12">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 flex justify-center">
                <Image src="/page-home/products.png" alt="Quản lý giỏ hàng" width={320} height={200} className="rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col justify-center items-start">
                <h3 className="text-xl font-bold mb-2">Quản lý giỏ hàng bất động sản chuyên nghiệp</h3>
                <p className="text-gray-700 mb-2">
                  Tạo và quản lý hồ sơ bất động sản chi tiết chỉ trong vài phút. Đính kèm hình ảnh, ghi chú vị trí, trạng thái (còn hàng, đã bán). Tìm kiếm và lọc thông tin sản phẩm tức thì.
                </p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1 flex justify-center">
                <Image src="/page-home/crm.png" alt="CRM" width={320} height={200} className="rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col justify-center items-start">
                <h3 className="text-xl font-bold mb-2">Xây dựng & chăm sóc khách hàng (CRM)</h3>
                <p className="text-gray-700 mb-2">
                  Lưu trữ thông tin khách hàng tập trung, theo dõi lịch sử tư vấn và nhu cầu của từng người. Không bao giờ bỏ quên một khách hàng tiềm năng nào.
                </p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 flex justify-center">
                <Image src="/page-home/appointment.png" alt="Lịch hẹn" width={320} height={200} className="rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col justify-center items-start">
                <h3 className="text-xl font-bold mb-2">Sắp xếp lịch hẹn thông minh</h3>
                <p className="text-gray-700 mb-2">
                  Tạo lịch hẹn xem nhà chỉ với vài cú nhấp, liên kết trực tiếp khách hàng với bất động sản tương ứng. Nhận thông báo nhắc nhở để không bỏ lỡ cuộc gặp quan trọng.
                </p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center bg-blue-100 rounded-lg p-8">
              <IconCloudOff size={64} strokeWidth={2} className="text-blue-500 mb-2" />
              <h3 className="text-xl font-bold mt-4 mb-2">Làm việc không gián đoạn dù không có internet</h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                <span className="font-semibold">Điểm khác biệt lớn nhất:</span> Xem, thêm, và chỉnh sửa dữ liệu ngay cả khi mất kết nối. <br/> Ứng dụng sẽ tự động đồng bộ mọi thứ ngay khi có mạng trở lại. Hoàn hảo cho các chuyến đi xem đất nền hoặc vào tầng hầm các dự án.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-blue-800 mb-8">
            Các câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded shadow p-4">
              <summary className="font-semibold cursor-pointer">Ứng dụng này có thực sự miễn phí không?</summary>
              <div className="mt-2 text-gray-600">Bạn có thể sử dụng miễn phí 1 tháng. Không cần thẻ tín dụng.</div>
            </details>
            <details className="bg-white rounded shadow p-4">
              <summary className="font-semibold cursor-pointer">Dữ liệu của tôi có được bảo mật an toàn không?</summary>
              <div className="mt-2 text-gray-600">Dữ liệu của bạn được mã hóa và bảo vệ theo tiêu chuẩn cao nhất.</div>
            </details>
            <details className="bg-white rounded shadow p-4">
              <summary className="font-semibold cursor-pointer">Chế độ offline hoạt động như thế nào?</summary>
              <div className="mt-2 text-gray-600">Bạn có thể xem, thêm, chỉnh sửa dữ liệu ngay cả khi mất kết nối. Khi có Internet, mọi thay đổi sẽ tự động đồng bộ.</div>
            </details>
            <details className="bg-white rounded shadow p-4">
              <summary className="font-semibold cursor-pointer">Tôi có thể sử dụng ứng dụng trên cả máy tính và điện thoại không?</summary>
              <div className="mt-2 text-gray-600">Bạn có thể sử dụng trên cả máy tính và điện thoại với trải nghiệm tối ưu.</div>
            </details>
            <details className="bg-white rounded shadow p-4">
              <summary className="font-semibold cursor-pointer">Việc nhập dữ liệu từ Excel vào có dễ dàng không?</summary>
              <div className="mt-2 text-gray-600">Chúng tôi sẽ bổ sung các tính năng import trong thời gian sớm nhất.</div>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sẵn sàng để tối ưu hóa công việc của bạn?
          </h2>
          <p className="text-lg text-blue-100 mb-6">
            Ngừng lãng phí thời gian vào các công việc thủ công. Bắt đầu quản lý chuyên nghiệp ngay hôm nay.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 bg-white text-blue-700 rounded shadow hover:bg-blue-100 transition text-lg font-semibold"
          >
            Vào App Ngay
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 flex flex-col items-start">
            <div className="flex items-center mb-2">
              <Image src="/globe.svg" alt="WitData Logo" width={32} height={32} />
              <span className="ml-2 font-bold text-lg">WitData</span>
            </div>
            <span className="text-sm">Nền tảng công nghệ cho môi giới bất động sản hiện đại.</span>
          </div>
          <div className="col-span-1">
            <h4 className="font-semibold mb-2">Liên kết</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="/contact" className="hover:underline">Liên hệ</a></li>
              <li><a href="/about" className="hover:underline">Về chúng tôi</a></li>
              <li><a href="/privacy" className="hover:underline">Chính sách bảo mật</a></li>
              <li><a href="/terms-of-use" className="hover:underline">Điều khoản dịch vụ</a></li>
            </ul>
          </div>
          <div className="col-span-2 flex items-end justify-end md:justify-end">
            <span className="text-xs text-gray-400">© 2025 PropMate - phát triển bởi WitData.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Thêm animation CSS vào file global nếu chưa có */
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 1s;
}
*/
