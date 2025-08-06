export default function PrivacyPage() {
  return (
    <main className="isolate flex min-h-dvh flex-col pt-14">
      <div className="grid flex-1 grid-rows-[1fr_auto] overflow-clip grid-cols-[1fr_var(--gutter-width)_minmax(0,var(--container-3xl))_var(--gutter-width)_1fr] [--gutter-width:--spacing(6)] lg:[--gutter-width:--spacing(10)]">
        <div className="col-start-2 row-span-full row-start-1 max-sm:hidden text-gray-950/5 border-x border-x-current bg-size-[10px_10px] bg-fixed bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]"></div>
        <div className="col-start-4 row-span-full row-start-1 max-sm:hidden text-gray-950/5 border-x border-x-current bg-size-[10px_10px] bg-fixed bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]"></div>
        <div className="col-start-3 row-start-1 max-sm:col-span-full max-sm:col-start-1 px-4 pt-12 sm:px-2 sm:pt-24">
          <h1 className="line-y py-2 text-5xl tracking-tight sm:text-6xl text-pretty">LỜI HỨA VỀ DỮ LIỆU TỪ PROPMATE</h1>
          <div className="max-w-2xl py-12 grid grid-cols-1 gap-6 text-sm/7 text-gray-600 [&_strong]:font-semibold [&_strong]:text-gray-950 [&_h2]:text-base/7 [&_h2]:font-semibold [&_h2]:text-gray-950 [&_h3]:font-semibold [&_h3]:text-gray-950 [&_a]:font-semibold [&_a]:text-gray-950 [&_a]:underline [&_a]:decoration-sky-400 [&_a]:underline-offset-4 [&_a]:hover:text-sky-500 [&_li]:relative [&_li]:before:absolute [&_li]:before:-top-0.5 [&_li]:before:-left-6 [&_li]:before:text-gray-300 [&_li]:before:content-['▪'] [&_ul]:pl-9">
            <p>Chào bạn, người đồng nghiệp trong lĩnh vực bất động sản,</p>
            <p>Khi bắt đầu xây dựng Propmate, chúng tôi không chỉ nghĩ đến việc tạo ra một ứng dụng. Chúng tôi mong muốn tạo ra một người trợ lý số tin cậy, một "cánh tay phải" thực thụ cho công việc kinh doanh đầy thử thách của bạn.</p>
            <p>Chúng tôi hiểu rằng, tài sản lớn nhất của một nhà môi giới không chỉ là các bất động sản bạn đang nắm giữ, mà còn là thông tin, là dữ liệu về khách hàng và thị trường. Đó là công sức, là chất xám của bạn.</p>
            <p>Vì vậy, chúng tôi muốn dành chút thời gian để trò chuyện cởi mở với bạn về cách Propmate "chăm sóc" cho khối tài sản quý giá này. Đây không phải là một điều khoản pháp lý phức tạp, mà là lời hứa của chúng tôi.</p>
            <p><strong>Quy tắc vàng của chúng tôi rất đơn giản: Dữ liệu của bạn là của bạn. Chúng tôi chỉ là người giữ gìn nó.</strong></p>
            <h2 className="line-y py-2">Propmate cần gì để trở thành trợ lý đắc lực?</h2>
            <p>Để ứng dụng hoạt động, chúng tôi cần một vài thông tin. Hãy coi nó như việc bạn giao cho người trợ lý một cuốn sổ để ghi chép vậy.</p>
            <ul>
              <li><strong>Để biết bạn là ai:</strong> Chúng tôi cần tên, email, số điện thoại để tạo một "ngăn tủ" riêng cho bạn trong hệ thống.</li>
              <li><strong>Để quản lý "kho hàng" của bạn:</strong> Dĩ nhiên rồi, đây là trái tim của Propmate. Bạn sẽ tải lên hình ảnh, địa chỉ, giá bán, và mọi mô tả chi tiết về các bất động sản. Tất cả sẽ được sắp xếp gọn gàng trong tài khoản của bạn.</li>
              <li><strong>Để ứng dụng ngày một tốt hơn:</strong> Thỉnh thoảng, chúng tôi sẽ xem xét cách bạn và những nhà môi giới khác sử dụng ứng dụng (ví dụ: tính năng nào được yêu thích nhất) để cải tiến Propmate thông minh và tiện lợi hơn. Việc này hoàn toàn ẩn danh và không soi vào dữ liệu kinh doanh cụ thể của bạn.</li>
            </ul>
            <h2 className="line-y py-2">Lời hứa về sự riêng tư</h2>
            <p>Công việc của người trợ lý là giữ bí mật. Và chúng tôi rất nghiêm túc về điều đó.</p>
            <ul>
              <li><strong>Chúng tôi tuyệt đối KHÔNG BAO GIỜ bán dữ liệu của bạn.</strong> Danh sách bất động sản hay thông tin khách hàng của bạn không phải là một món hàng để trao đổi. Chấm hết.</li>
              <li><strong>Chúng tôi không chia sẻ lung tung.</strong> Hãy hình dung chúng tôi thuê những dịch vụ tốt nhất thế giới (như kho lưu trữ đám mây của Google hay Amazon) để canh giữ "ngôi nhà dữ liệu" của bạn. Họ chỉ có nhiệm vụ bảo vệ, chứ không được phép vào xem bên trong. Chúng tôi chỉ mở cửa khi có yêu cầu chính thức từ pháp luật.</li>
            </ul>
            <h2 className="line-y py-2">"Ngôi nhà dữ liệu" của bạn được bảo vệ ra sao?</h2>
            <p>Chúng tôi đã xây một "két sắt số" vô cùng kiên cố cho dữ liệu của bạn. Nó được khóa bằng nhiều lớp bảo mật công nghệ cao, được mã hóa cẩn thận để không ai có thể nhòm ngó. Đội ngũ kỹ sư của chúng tôi luôn túc trực để đảm bảo chiếc két sắt này an toàn trước mọi nguy cơ.</p>
            <h2 className="line-y py-2">Bạn luôn là người cầm lái</h2>
            <p>Đây là ứng dụng của bạn, và bạn toàn quyền quyết định.</p>
            <ul>
              <li>Bạn có thể xem, sửa, xóa bất kỳ thông tin bất động sản nào bất cứ lúc nào.</li>
              <li>Khi bạn không còn cần đến Propmate nữa, bạn có thể "dọn dẹp" và xóa toàn bộ tài khoản. Khi đó, người trợ lý này sẽ trả lại toàn bộ "sổ sách" và chúng tôi sẽ xóa sạch mọi thứ thuộc về bạn.</li>
            </ul>
            <h2 className="line-y py-2">Hãy cùng nhau phát triển</h2>
            <p>Propmate sẽ luôn phát triển, và lời hứa này cũng vậy. Nếu có bất kỳ thay đổi nào quan trọng, chúng tôi sẽ trò chuyện với bạn một cách minh bạch, giống như hôm nay.</p>
            <p>Cảm ơn bạn đã tin tưởng và chọn Propmate làm người bạn đồng hành. Nếu có bất kỳ câu hỏi nào, đừng ngần ngại trò chuyện với chúng tôi nhé.</p>
            <p className="font-semibold text-gray-950">Thân ái,<br/>Đội ngũ Propmate.</p>
          </div>
        </div>
      </div>
    </main>
  );
}