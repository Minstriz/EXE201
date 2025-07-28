import { Blog } from "../blog";

const blog: Blog = {
  slug: "bao-tang-my-thuat",
  title: "BẢO TÀNG MỸ THUẬT",
  date: "2024-07-22",
  views: 75,
  image: "/images/baotangmythuat.png",
  content: (
  <>
    <img
      src="/images/t1.jpg"
      alt="Toàn cảnh Bảo tàng Mỹ thuật TP.HCM"
      className="w-full max-w-4xl mx-auto rounded shadow-lg my-6"
    />
    <p className="text-center text-sm italic mb-6">
      Một trong những bảo tàng nghệ thuật cổ kính và quyến rũ nhất giữa lòng Sài Gòn
    </p>

    <h2 className="text-2xl font-bold mt-8 mb-4 text-center text-rose-800"> Hành trình khám phá Bảo tàng Mỹ thuật TP.HCM</h2>

    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2">🏛️ 1. Đôi nét đầu tiên</h3>
      <p>
        Nằm tại <strong>97A Phó Đức Chính, phường Nguyễn Thái Bình, Quận 1</strong>, bảo tàng được xây dựng từ thời Pháp (1929)
        và hiện là nơi trưng bày các tác phẩm mỹ thuật có giá trị bậc nhất Việt Nam.
      </p>
      <p>
        Tòa nhà mang đậm dấu ấn kiến trúc Art Deco, pha trộn phong cách Đông – Tây hài hòa, từng là dinh thự của Hứa Bổn Hòa – một thương gia giàu có người Hoa.
      </p>
    </section>

    <img
      src="/images/t2.jpg"
      alt="Kiến trúc mặt trước bảo tàng"
      className="w-full max-w-3xl mx-auto rounded shadow-md my-6"
    />

    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2"> 2. Ấn tượng từ kiến trúc</h3>
      <p>
        Ngay từ cổng vào, bạn sẽ bị thu hút bởi tông vàng cổ kính, mái ngói đỏ và các ô cửa sổ gỗ tinh xảo. Bên trong, sàn đá hoa cương,
        cầu thang xoắn và hành lang ban công đều mang nét nghệ thuật riêng biệt.
      </p>
    </section>

    <img
      src="/images/t3.jpg"
      alt="Bên trong bảo tàng với cầu thang cổ"
      className="w-full max-w-3xl mx-auto rounded shadow-md my-6"
    />

    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2"> 3. Không gian trưng bày</h3>
      <p>
        Bảo tàng gồm 3 tầng, mỗi tầng là một thế giới nghệ thuật riêng:
      </p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><strong>Tầng 1:</strong> Mỹ thuật đương đại – các tác phẩm điêu khắc, tranh lụa, sơn dầu hiện đại</li>
        <li><strong>Tầng 2:</strong> Mỹ thuật cổ truyền – tượng Phật, gốm sứ, đồ thủ công</li>
        <li><strong>Tầng 3:</strong> Tranh dân gian, tranh khắc gỗ, trưng bày cá nhân theo thời vụ</li>
      </ul>
    </section>

    <img
      src="/images/t4.jpg"
      alt="Không gian trưng bày tranh tầng 2"
      className="w-full max-w-3xl mx-auto rounded shadow-md my-6"
    />

    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2"> 4. Những tác phẩm nổi bật</h3>
      <p>
        Nơi đây lưu giữ hàng trăm kiệt tác từ các họa sĩ tên tuổi như Nguyễn Gia Trí, Tô Ngọc Vân, Trần Văn Cẩn…
        Một số bức tranh sơn mài và điêu khắc Phật giáo có niên đại từ thế kỷ 17 cũng được bảo quản kỹ lưỡng.
      </p>
    </section>

    <img
      src="/images/t5.jpg"
      alt="Tác phẩm tranh sơn dầu trưng bày"
      className="w-full max-w-3xl mx-auto rounded shadow-md my-6"
    />

    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2"> 5. Mẹo nhỏ khi tham quan</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Giờ mở cửa: <strong>8h00 - 17h00</strong> từ thứ 3 đến Chủ nhật (đóng cửa thứ 2)</li>
        <li>Giá vé: Người lớn ~30.000đ, sinh viên ~15.000đ (có thể thay đổi theo thời điểm)</li>
        <li>Không chụp ảnh bằng flash và không sờ vào hiện vật</li>
        <li>Nếu bạn yêu thích nhiếp ảnh, ban công tầng 2 có góc máy cực đẹp</li>
      </ul>
    </section>

    <img
      src="/images/t6.jpg"
      alt="Cầu thang xoắn cổ điển tại bảo tàng"
      className="w-full max-w-3xl mx-auto rounded shadow-md my-6"
    />

    <section className="mb-8">
      <h3 className="text-xl font-semibold mt-8 mb-2 text-center text-rose-800"> Kết lại một ngày nghệ thuật</h3>
      <p className="text-center max-w-3xl mx-auto">
        Bảo tàng Mỹ thuật TP.HCM không chỉ đơn thuần là nơi trưng bày hiện vật,
        mà còn là không gian lắng đọng để bạn kết nối với vẻ đẹp nghệ thuật Việt Nam qua nhiều thế hệ.
        Hãy dành vài tiếng ghé thăm nơi này và lưu lại thật nhiều cảm xúc nhé!
      </p>
    </section>

    <img
      src="/images/t7.jpg"
      alt="Check-in ban công bảo tàng"
      className="w-full max-w-3xl mx-auto rounded shadow-md my-6"
    />
  </>
),
};

export default blog;
