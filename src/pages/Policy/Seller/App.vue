<template>
  <div class="m-5 mx-8 overflow-auto">
    <div class="flex justify-start align-items-center">
      <Button
        icon="pi pi-angle-left"
        class="w-3rem h-3rem"
        text
        @click="() => $router.back()"
      ></Button>
      <div class="text-primary text-xl font-bold">Quay lại</div>
    </div>
    <h1>CHÍNH SÁCH ĐĂNG KÝ CỬA HÀNG</h1>
    <p>
      <strong>Giới thiệu:</strong> Chào mừng bạn đến với nền tảng mua sắm phụ
      kiện, phụ tùng xe máy Motor Part Center (MPC). Khi đăng ký cửa hàng của
      bạn trên nền tảng của chúng tôi, bạn đồng ý tuân thủ các chính sách và
      hướng dẫn dưới đây. Những chính sách này được thiết kế để duy trì tiêu
      chuẩn dịch vụ cao và đảm bảo trải nghiệm tích cực cho tất cả người dùng.
    </p>

    <h2>1. Yêu cầu đăng ký</h2>
    <ul>
      <li>
        <strong>Đủ điều kiện:</strong> Chỉ các doanh nghiệp đã đăng ký mới được
        phép tạo cửa hàng trên nền tảng của chúng tôi. Bạn phải cung cấp thông
        tin chứng nhận doanh nghiệp hợp lệ, bao gồm giấy phép kinh doanh và mã
        số thuế, để xác minh tính hợp pháp của bạn.
      </li>
      <li>
        <strong>Độ chính xác của thông tin:</strong> Tất cả thông tin cung cấp
        trong quá trình đăng ký phải chính xác và cập nhật. Điều này bao gồm tên
        cửa hàng, địa chỉ, tài khoản PayPal và hình ảnh cửa hàng.
      </li>
    </ul>

    <h2>2. Quản lý cửa hàng</h2>
    <ul>
      <li>
        <strong>Danh sách sản phẩm:</strong>
        <ul>
          <li>
            <strong>Tuân thủ:</strong> Đảm bảo tất cả các danh sách sản phẩm
            tuân thủ các luật và quy định hiện hành, bao gồm các tiêu chuẩn an
            toàn.
          </li>
          <li>
            <strong>Độ chính xác:</strong> Cung cấp mô tả, hình ảnh và giá cả
            chính xác cho tất cả các sản phẩm. Thông tin gây hiểu lầm hoặc sai
            lệch là hoàn toàn bị cấm.
          </li>
        </ul>
      </li>
      <li>
        <strong>Quản lý hàng tồn kho:</strong>
        <ul>
          <li>
            <strong>Mức tồn kho:</strong> Giữ mức tồn kho cập nhật để tránh bán
            các sản phẩm hết hàng. Xem xét và cập nhật hàng tồn kho của bạn
            thường xuyên để phản ánh tình trạng hiện tại.
          </li>
        </ul>
      </li>
      <li>
        <strong>Chính sách giá cả:</strong>
        <ul>
          <li>
            <strong>Minh bạch:</strong> Hiển thị giá cả rõ ràng và chính xác,
            bao gồm bất kỳ thuế hoặc khoản phí bổ sung nào. Mọi thay đổi về giá
            cả nên được cập nhật kịp thời.
          </li>
        </ul>
      </li>
      <li>
        <strong>Vận chuyển và giao hàng:</strong>
        <ul>
          <li>
            <strong>Tự thực hiện vận chuyển:</strong> Cửa hàng phải tự thực hiện
            việc vận chuyển cho tất cả các đơn hàng. Điều này bao gồm việc đóng
            gói, giao hàng đến khách hàng, và xử lý mọi vấn đề liên quan đến vận
            chuyển.
          </li>
        </ul>
      </li>
    </ul>

    <h2>3. Dịch vụ khách hàng</h2>
    <ul>
      <li>
        <strong>Thời gian Phản hồi:</strong> Phản hồi các câu hỏi và khiếu nại
        của khách hàng kịp thời. Chúng tôi khuyến nghị thời gian phản hồi trong
        vòng 24 giờ vào các ngày làm việc.
      </li>
    </ul>

    <h2>4. Tuân thủ và hành vi</h2>
    <ul>
      <li>
        <strong>Tuân thủ pháp luật:</strong> Tuân thủ tất cả các luật và quy
        định địa phương, quốc gia liên quan. Điều này bao gồm các luật bảo vệ
        người tiêu dùng, quy định về quyền riêng tư dữ liệu, và bất kỳ yêu cầu
        pháp lý nào khác.
      </li>
      <li>
        <strong>Quy tắc ứng xử:</strong> Duy trì hành vi chuyên nghiệp trong tất
        cả các tương tác với khách hàng và các người dùng khác trên nền tảng.
        Mọi hình thức quấy rối, phân biệt đối xử, hoặc hành vi vi phạm đạo đức
        đều bị cấm.
      </li>
    </ul>

    <h2>5. Sử dụng nền tảng</h2>
    <ul>
      <li>
        <strong>Truy cập và bảo mật:</strong> Bảo vệ thông tin đăng nhập tài
        khoản của bạn và thông báo ngay cho chúng tôi nếu bạn nghi ngờ có sự
        truy cập trái phép. Đảm bảo rằng dữ liệu của cửa hàng và thông tin khách
        hàng của bạn được bảo vệ.
      </li>
      <li>
        <strong>Hướng dẫn nội dung:</strong> Tất cả nội dung, bao gồm mô tả sản
        phẩm và tài liệu quảng cáo, phải phù hợp và tuân thủ các chính sách nội
        dung của chúng tôi. Nội dung xúc phạm, gây hiểu lầm hoặc bất hợp pháp
        không được phép.
      </li>
    </ul>

    <h2>6. Chấm dứt và tạm ngưng</h2>
    <ul>
      <li>
        <strong>Vi phạm chính sách:</strong> Chúng tôi có quyền tạm ngừng hoặc
        chấm dứt đăng ký cửa hàng của bạn nếu bạn vi phạm các chính sách của
        chúng tôi. Điều này bao gồm việc vi phạm chính sách nhiều lần hoặc không
        tuân thủ các tiêu chuẩn của nền tảng.
      </li>
      <li>
        <strong>Chấm dứt tự nguyện:</strong> Nếu bạn muốn đóng cửa hàng của
        mình, hãy cung cấp thông báo bằng văn bản cho đội ngũ hỗ trợ của chúng
        tôi. Đảm bảo rằng tất cả các đơn hàng đang chờ được thực hiện và các vấn
        đề của khách hàng được giải quyết trước khi chấm dứt.
      </li>
    </ul>

    <h2>7. Phần trăm hoa hồng</h2>
    <ul>
      <li>
        <strong>Đơn_0_10:</strong> 15% phần trăm nền tảng sẽ nhận được cho hóa
        đơn từ 0 đến 10 triệu đồng.
      </li>
      <li>
        <strong>Đơn_10_30:</strong> 13% phần trăm nền tảng sẽ nhận được cho hóa
        đơn từ 10 đến 30 triệu đồng.
      </li>
      <li>
        <strong>Đơn_30_50:</strong> 10% phần trăm nền tảng sẽ nhận được cho hóa
        đơn từ 30 đến 50 triệu đồng.
      </li>
      <li>
        <strong>Đơn_50_100:</strong> 12% phần trăm nền tảng sẽ nhận được cho hóa
        đơn từ 50 đến 100 triệu đồng.
      </li>
      <li>
        <strong>Đơn_100_MAX:</strong> 6% phần trăm nền tảng sẽ nhận được cho hóa
        đơn trên 100 triệu đồng.
      </li>
    </ul>

    <h2>8. Thanh toán</h2>
    <ul>
      <li>
        <strong>Thời gian thanh toán Lại:</strong> Sau khi trừ hoa hồng, chúng
        tôi sẽ thực hiện thanh toán lại cho cửa hàng vào ngày 2, 9, 16 và 23
        hàng tháng. Đảm bảo rằng thông tin tài khoản của bạn chính xác để nhận
        thanh toán đúng hạn.
      </li>
    </ul>

    <h2>9. Thay đổi chính sách</h2>
    <ul>
      <li>
        <strong>Cập nhật:</strong> Chúng tôi có thể cập nhật chính sách đăng ký
        cửa hàng của mình theo thời gian. Các cửa hàng đã đăng ký sẽ được thông
        báo về bất kỳ thay đổi quan trọng nào. Việc tiếp tục sử dụng nền tảng
        của chúng tôi có nghĩa là bạn chấp nhận các chính sách đã được cập nhật.
      </li>
    </ul>
  </div>
</template>
