import { Blog } from "../blog";

const blog: Blog = {
  slug: "cho-ben-thanh",
  title: "CHỢ BẾN THÀNH",
  date: "2024-07-22",
  views: 110,
  image: "/images/chobenthanh.png",
  content: (
  <>
    <img
      src="/images/c1.jpg"
      alt="Chợ Bến Thành nhìn từ bên ngoài"
      className="w-full max-w-4xl mx-auto rounded shadow-lg my-6"
    />
    <p className="text-center text-sm italic mb-6">
      Chợ Bến Thành – Biểu tượng thương mại và văn hoá lâu đời của Sài Gòn
    </p>

    <p className="mb-4">
      Nếu bạn đang tìm kiếm một địa điểm đậm chất Sài Gòn, nơi kết hợp giữa lịch sử, mua sắm và ẩm thực đường phố – 
      thì <strong>Chợ Bến Thành</strong> chính là điểm đến không thể bỏ lỡ trong hành trình khám phá thành phố.
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-2">1. Giới thiệu về Chợ Bến Thành</h2>
    <p>
      <strong>Chợ Bến Thành</strong> là một trong những khu chợ lâu đời và nổi tiếng nhất tại TP.HCM, được xây dựng từ đầu thế kỷ 20 
      với kiến trúc đặc trưng và tháp đồng hồ biểu tượng. Đây là nơi giao thoa giữa truyền thống và hiện đại, 
      thu hút đông đảo du khách trong và ngoài nước.
    </p>

    <img
      src="/images/c2.jpg"
      alt="Bên trong chợ Bến Thành"
      className="w-full max-w-3xl mx-auto rounded shadow-lg my-6"
    />

    <h2 className="text-xl font-semibold mt-8 mb-2">2. Lịch sử hình thành</h2>
    <p>
      Chợ Bến Thành bắt đầu hoạt động từ năm 1914 và đã trở thành một trong những biểu tượng thương mại quan trọng nhất của Sài Gòn xưa. 
      Trải qua hơn 100 năm, khu chợ này không chỉ là nơi buôn bán mà còn là điểm lưu giữ ký ức, dấu ấn văn hoá đặc sắc của người dân thành phố.
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-2">3. Vị trí và cách di chuyển</h2>
    <p>
      Chợ nằm tại <strong>Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM</strong>, ngay trung tâm thành phố nên cực kỳ thuận tiện 
      để di chuyển bằng taxi, xe máy, xe buýt hoặc đi bộ từ phố đi bộ Nguyễn Huệ, Bưu điện thành phố, hoặc Nhà thờ Đức Bà.
    </p>

    <h2 className="text-xl font-semibold mt-8 mb-2">4. Trải nghiệm tại chợ Bến Thành</h2>
    <ul className="list-disc list-inside space-y-1 mb-4">
      <li><strong>Mua sắm:</strong> từ quần áo, vải vóc, đồ thủ công mỹ nghệ đến đặc sản địa phương</li>
      <li><strong>Ẩm thực:</strong> thưởng thức các món ăn trứ danh như bún riêu, bánh cuốn, chè, nước mía...</li>
      <li><strong>Chụp ảnh:</strong> với cổng chợ mang phong cách kiến trúc Pháp cổ và khu bán hàng sầm uất bên trong</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">5. Lưu ý khi tham quan</h2>
    <ul className="list-disc list-inside space-y-1 mb-4">
      <li>Chợ mở cửa từ khoảng 6h sáng đến 19h hàng ngày (khu ẩm thực đêm mở đến khoảng 22h)</li>
      <li>Nên trả giá khéo léo khi mua hàng để có được giá hợp lý</li>
      <li>Bảo quản đồ dùng cá nhân cẩn thận khi đi vào các khu đông người</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">6. Các địa điểm gần chợ Bến Thành</h2>
    <ul className="list-disc list-inside space-y-1 mb-4">
      <li><strong>Phố đi bộ Nguyễn Huệ:</strong> nơi lý tưởng để dạo mát buổi tối</li>
      <li><strong>Bưu điện Thành phố và Nhà thờ Đức Bà:</strong> chỉ cách vài phút đi bộ</li>
      <li><strong>Takashimaya, Saigon Centre:</strong> trung tâm thương mại sầm uất gần đó</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">7. Tổng kết</h2>
    <p>
      <strong>Chợ Bến Thành</strong> không chỉ là điểm mua sắm, mà còn là nơi gói trọn tinh hoa văn hóa, ẩm thực và phong cách sống 
      của người Sài Gòn. Dù bạn là khách du lịch hay người dân địa phương, một lần ghé thăm chợ sẽ để lại ấn tượng khó quên.
    </p>
  </>
)
};

export default blog;
