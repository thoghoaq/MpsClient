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
    <h1>CHÍNH SÁCH ĐĂNG KÝ KHÁCH HÀNG</h1>

    <h2>1. Đối tượng áp dụng</h2>
    <ul>
      <li>
        Chính sách này áp dụng cho tất cả người dùng muốn đăng ký làm khách hàng
        của Motor Part Center (MPC).
      </li>
    </ul>

    <h2>2. Điều kiện đăng ký</h2>
    <ul>
      <li>
        Người dùng phải cung cấp đầy đủ và chính xác thông tin cá nhân bao gồm
        họ tên, địa chỉ, số điện thoại, và email hợp lệ.
      </li>
      <li>
        Người dùng phải đủ 18 tuổi trở lên hoặc có sự đồng ý của người giám hộ
        hợp pháp.
      </li>
      <li>
        Người dùng phải đồng ý với các điều khoản và điều kiện của nền tảng MPC.
      </li>
    </ul>

    <h2>3. Quyền lợi của khách hàng</h2>
    <ul>
      <li>
        Khách hàng sẽ được truy cập vào hệ thống mua sắm trực tuyến với hàng
        ngàn sản phẩm từ nhiều nhà cung cấp khác nhau.
      </li>
      <li>
        Khách hàng có quyền đánh giá, nhận xét sản phẩm và trải nghiệm mua sắm
        của mình.
      </li>
    </ul>

    <h2>4. Bảo mật thông tin</h2>
    <ul>
      <li>
        Nền tảng MPC cam kết bảo mật thông tin cá nhân của khách hàng và không
        tiết lộ cho bên thứ ba mà không có sự đồng ý của khách hàng, trừ khi
        được yêu cầu bởi pháp luật.
      </li>
      <li>
        Thông tin khách hàng chỉ được sử dụng cho mục đích cung cấp dịch vụ, hỗ
        trợ khách hàng và cải thiện trải nghiệm mua sắm.
      </li>
    </ul>

    <h2>5. Trách nhiệm của khách hàng</h2>
    <ul>
      <li>
        Khách hàng có trách nhiệm cung cấp thông tin chính xác và cập nhật kịp
        thời trong quá trình đăng ký và sử dụng tài khoản.
      </li>
      <li>
        Khách hàng phải tuân thủ các quy định về mua sắm, thanh toán, và các quy
        định khác của nền tảng MPC.
      </li>
      <li>
        Khách hàng cần bảo mật thông tin tài khoản và mật khẩu, không chia sẻ
        với bất kỳ ai.
      </li>
    </ul>

    <h2>6. Quản lý tài khoản</h2>
    <ul>
      <li>
        Khách hàng có thể truy cập, cập nhật, hoặc thay đổi thông tin tài khoản
        bất kỳ lúc nào trên hệ thống của nền tảng MPC.
      </li>
      <li>
        Khách hàng có thể yêu cầu khôi phục tài khoản nếu bị mất hoặc quên thông
        tin đăng nhập.
      </li>
    </ul>

    <h2>7. Hủy đăng ký tài khoản</h2>
    <ul>
      <li>
        Khách hàng có thể yêu cầu hủy đăng ký tài khoản bất kỳ lúc nào bằng cách
        liên hệ với bộ phận chăm sóc khách hàng.
      </li>
      <li>
        Sau khi hủy tài khoản, mọi quyền lợi và thông tin liên quan sẽ bị xóa bỏ
        khỏi hệ thống của nền tảng MPC.
      </li>
    </ul>

    <h2>8. Chính sách mua sắm</h2>
    <ul>
      <li>
        Khách hàng phải tuân thủ các chính sách mua sắm, thanh toán và giao nhận
        hàng hóa của nền tảng MPC.
      </li>
      <li>
        Mọi giao dịch phải tuân thủ theo pháp luật và các quy định của nền tảng
        MPC.
      </li>
      <li>
        Khách hàng phải chấp nhận thanh toán cho hóa đơn trước khi nhận hàng.
      </li>
      <li>
        Khách hàng phải cân nhắc cẩn thận trước khi bấm xác nhận thanh toán. Vì
        MPC không hỗ trợ hủy đơn và hoàn tiền cho khách hàng.
      </li>
      <li>
        Nền tảng MPC sẽ không chịu trách nhiệm về việc đổi trả hàng hóa. Nếu có
        thắc mắc và nhu cầu đổi trả hàng hóa xin vui lòng liên hệ với cửa hàng
        mà khách hàng đã đặt mua.
      </li>
      <li>
        Sau khi nhận được hàng, khách hàng vui lòng bấm xác nhận đã nhận được
        hàng. Nếu khách không xác nhận thì hệ thống sẽ tự động xác nhận sau 7
        ngày kể từ ngày mua hàng.
      </li>
    </ul>

    <h2>9. Thay đổi chính sách</h2>
    <ul>
      <li>
        Nền tảng MPC có quyền thay đổi, bổ sung các điều khoản và điều kiện đăng
        ký bất kỳ lúc nào mà không cần thông báo trước.
      </li>
      <li>
        Những thay đổi sẽ được cập nhật trên trang web chính thức của nền tảng
        MPC.
      </li>
    </ul>

    <h2>10. Liên hệ hỗ trợ</h2>
    <ul>
      <li>
        Mọi thắc mắc hoặc yêu cầu hỗ trợ, vui lòng liên hệ với bộ phận chăm sóc
        khách hàng của Nền tảng Motor Part Center qua email: [Email của Sàn
        TMĐT] hoặc số điện thoại: [Số điện thoại của Sàn TMĐT].
      </li>
    </ul>
  </div>
</template>
