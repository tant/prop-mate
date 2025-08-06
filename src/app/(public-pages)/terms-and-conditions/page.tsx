export default function TnCPage() {
  return (
    <main className="isolate flex min-h-dvh flex-col pt-14">
      <div className="grid flex-1 grid-rows-[1fr_auto] overflow-clip grid-cols-[1fr_var(--gutter-width)_minmax(0,var(--container-3xl))_var(--gutter-width)_1fr] [--gutter-width:--spacing(6)] lg:[--gutter-width:--spacing(10)]">
        <div className="col-start-2 row-span-full row-start-1 max-sm:hidden text-gray-950/5 border-x border-x-current bg-size-[10px_10px] bg-fixed bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]"></div>
        <div className="col-start-4 row-span-full row-start-1 max-sm:hidden text-gray-950/5 border-x border-x-current bg-size-[10px_10px] bg-fixed bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]"></div>
        <div className="col-start-3 row-start-1 max-sm:col-span-full max-sm:col-start-1 px-4 pt-12 sm:px-2 sm:pt-24">
          <h1 className="line-y py-2 text-5xl tracking-tight sm:text-6xl text-pretty">Thỏa thuận đồng hành cùng Propmate</h1>
          <div className="max-w-2xl py-12 grid grid-cols-1 gap-6 text-sm/7 text-gray-600 [&_strong]:font-semibold [&_strong]:text-gray-950 [&_h2]:text-base/7 [&_h2]:font-semibold [&_h2]:text-gray-950 [&_h3]:font-semibold [&_h3]:text-gray-950 [&_a]:font-semibold [&_a]:text-gray-950 [&_a]:underline [&_a]:decoration-sky-400 [&_a]:underline-offset-4 [&_a]:hover:text-sky-500 [&_li]:relative [&_li]:before:absolute [&_li]:before:-top-0.5 [&_li]:before:-left-6 [&_li]:before:text-gray-300 [&_li]:before:content-['▪'] [&_ul]:pl-9">
            <p>Chào bạn một lần nữa,</p>
            <p>Nếu "lời hứa về dữ liệu" của chúng tôi là nền tảng của sự tin tưởng, thì "thỏa thuận đồng hành" này giống như một bản hướng dẫn, một vài quy tắc chung để chuyến đi của chúng ta cùng Propmate luôn vui vẻ, hiệu quả và công bằng cho tất cả mọi người.</p>
            <p>Bằng việc tạo tài khoản và sử dụng Propmate, coi như chúng ta đã "bắt tay" đồng ý với những thỏa thuận chung này nhé.</p>
            <h2 className="line-y py-2">1. Người trợ lý Propmate của bạn</h2>
            <p>Propmate là một nền tảng phần mềm ("dịch vụ") được chúng tôi tạo ra để giúp bạn, các nhà môi giới bất động sản, quản lý công việc của mình một cách thông minh hơn. Dịch vụ này bao gồm ứng dụng di động và mọi tính năng được chúng tôi cung cấp. Chúng tôi sẽ luôn nỗ lực để người trợ lý này ngày càng giỏi giang hơn.</p>
            <h2 className="line-y py-2">2. "Ngôi nhà số" của bạn (tài khoản)</h2>
            <ul>
              <li><strong>Chìa khóa nhà:</strong> Khi đăng ký, bạn tạo ra một "ngôi nhà số" của riêng mình. Mật khẩu chính là chìa khóa. Bạn hãy giữ gìn chiếc chìa khóa này cẩn thận và đừng đưa nó cho người khác nhé. Mọi hoạt động diễn ra từ tài khoản của bạn sẽ được xem là do chính bạn thực hiện.</li>
              <li><strong>Thông tin chính xác:</strong> Để chúng tôi hỗ trợ tốt nhất, bạn vui lòng cung cấp thông tin đăng ký chính xác và cập nhật khi có thay đổi.</li>
            </ul>
            <h2 className="line-y py-2">3. Giữ cho "sân chơi" chung lành mạnh</h2>
            <p>Propmate là một công cụ chuyên nghiệp, và chúng tôi tin bạn cũng vậy. Để bảo vệ cộng đồng người dùng và uy tín của chính bạn, chúng ta cùng đồng ý sẽ không:</p>
            <ul>
              <li>Đăng tải bất kỳ nội dung nào vi phạm pháp luật Việt Nam, sai sự thật, lừa đảo, hoặc có tính xúc phạm.</li>
              <li>Sử dụng Propmate để phát tán virus hoặc các phần mềm độc hại.</li>
              <li>Cố gắng xâm nhập, can thiệp vào hệ thống của Propmate hoặc tài khoản của người dùng khác.</li>
              <li>Sử dụng thông tin của khách hàng (mà bạn lưu trong app) cho các mục đích bất hợp pháp hoặc chưa được sự cho phép của họ.</li>
              <li>Sao chép, "xào nấu" lại ứng dụng Propmate cho mục đích thương mại của riêng bạn.</li>
            </ul>
            <p>Nếu phát hiện các hành vi này, chúng tôi có thể sẽ phải tạm khóa hoặc ngừng cung cấp dịch vụ cho tài khoản của bạn để bảo vệ cộng đồng.</p>
            <h2 className="line-y py-2">4. Dữ liệu của bạn vẫn luôn là của bạn</h2>
            <p>Chúng tôi nhắc lại một lần nữa: Mọi thông tin về bất động sản và khách hàng mà bạn tải lên Propmate ("nội dung của bạn") đều thuộc sở hữu của bạn.</p>
            <p>Tuy nhiên, khi sử dụng dịch vụ, bạn cho phép chúng tôi một quyền cần thiết: đó là quyền được hiển thị, sắp xếp, sao lưu và phân phối "nội dung của bạn" trong khuôn khổ vận hành ứng dụng. Ví dụ, chúng tôi cần quyền này để có thể hiển thị danh sách bất động sản của bạn trên màn hình điện thoại của bạn.</p>
            <h2 className="line-y py-2">5. Còn "tài sản trí tuệ" của Propmate thì sao?</h2>
            <p>Toàn bộ ứng dụng Propmate – từ tên gọi, logo, mã nguồn, thiết kế cho đến cách hoạt động – là tài sản trí tuệ và công sức của chúng tôi, WitData. Bạn có quyền sử dụng nó như một công cụ, nhưng không có quyền sở hữu nó.</p>
            <h2 className="line-y py-2">6. Khi chúng ta tạm dừng cuộc hành trình (chấm dứt)</h2>
            <ul>
              <li><strong>Từ phía bạn:</strong> Bạn có thể ngừng sử dụng dịch vụ và xóa tài khoản của mình bất cứ lúc nào.</li>
              <li><strong>Từ phía chúng tôi:</strong> Chúng tôi có quyền tạm ngưng hoặc chấm dứt cung cấp dịch vụ nếu bạn vi phạm nghiêm trọng các thỏa thuận trong bản hướng dẫn này.</li>
            </ul>
            <h2 className="line-y py-2">7. Những điều Propmate không thể hứa chắc (giới hạn trách nhiệm)</h2>
            <p>Chúng tôi xây dựng Propmate bằng tất cả tâm huyết và sự chuyên nghiệp. Tuy nhiên, giống như mọi sản phẩm công nghệ khác, sẽ có lúc không thể tránh khỏi sự cố.</p>
            <ul>
              <li>Chúng tôi cung cấp dịch vụ "nguyên trạng như hiện có". Chúng tôi không thể đảm bảo ứng dụng sẽ luôn hoàn hảo 100%, không bao giờ bị gián đoạn hay không có lỗi.</li>
              <li>Chúng tôi sẽ không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp nào trong kinh doanh của bạn (ví dụ: mất một hợp đồng) phát sinh từ việc sử dụng hoặc không thể sử dụng ứng dụng. Trách nhiệm tối đa của chúng tôi, nếu có, sẽ không vượt quá số tiền bạn đã thanh toán cho chúng tôi (nếu có) trong vòng 3 tháng gần nhất.</li>
            </ul>
            <h2 className="line-y py-2">8. Khi cần một "trọng tài" (luật áp dụng)</h2>
            <p>Mọi tranh chấp, nếu có, giữa bạn và chúng tôi sẽ được giải quyết trước hết bằng thương lượng trên tinh thần hợp tác. Nếu không thể đi đến thỏa thuận chung, tranh chấp sẽ được giải quyết theo luật pháp nước Cộng hòa Xã hội Chủ nghĩa Việt Nam tại một tòa án có thẩm quyền ở thành phố Hồ Chí Minh.</p>
            <h2 className="line-y py-2">9. Cuộc trò chuyện luôn cởi mở</h2>
            <p>Thế giới công nghệ luôn thay đổi, và Propmate cũng vậy. Chúng tôi có thể cập nhật "thỏa thuận đồng hành" này theo thời gian. Khi có thay đổi lớn, chúng tôi sẽ thông báo cho bạn.</p>
            <p>Cảm ơn bạn đã dành thời gian đọc đến đây. Chúng tôi tin rằng khi mọi thứ rõ ràng, chúng ta sẽ có một hành trình hợp tác thật hiệu quả và bền vững.</p>
            <p className="font-semibold text-gray-950">Chúc bạn kinh doanh thành công!<br/>Đội ngũ Propmate<br/>WitData<br/>Quận 7, Thành phố Hồ Chí Minh</p>
          </div>
        </div>
      </div>
    </main>
  );
}