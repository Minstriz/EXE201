import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUtensils,
  FaStar,
  FaHeart,
  FaSearch,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import FeedbackSection from "./FeedbackSection";

function ExplorePage() {
  return (
    <div className="pt-[120px] min-h-screen w-full bg-white">
      <div className="container mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-orange-500 text-4xl font-bold">
            Ở SÀI GÒN ĐI ĐÂU?
          </h1>
        </div>
        <div className="flex flex-wrap w-full mb-8 items-center">
          <div className="flex flex-wrap gap-2 w-full md:w-2/5 items-center">
            <Button
              variant="outline"
              className="border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC]/10 hover:text-[#219EBC] px-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h18M3 10h18M3 16h18"
                />
              </svg>
            </Button>

            <Button
              variant="outline"
              className="border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC]/10 hover:text-[#219EBC]"
            >
              <FaMapMarkerAlt className="mr-1" /> Địa điểm
            </Button>
            <Button
              variant="outline"
              className="border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC]/10 hover:text-[#219EBC]"
            >
              <FaUtensils className="mr-1" /> Ẩm thực
            </Button>
            <Button
              variant="outline"
              className="border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC]/10 hover:text-[#219EBC]"
            >
              <FaStar className="mr-1" /> Đánh giá
            </Button>
            <Button
              variant="outline"
              className="border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC]/10 hover:text-[#219EBC]"
            >
              <FaHeart className="mr-1" /> Yêu thích
            </Button>
          </div>

          {/* khoảng trống 10% */}
          <div className="hidden md:block md:w-1/10"></div>

          <div className="flex items-center border border-[#219EBC] rounded-full px-4 py-2 w-full md:w-1/2 mt-2 md:mt-0 md:justify-end">
            <FaSearch className="text-[#219EBC] mr-2" />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="outline-none bg-transparent text-[#219EBC] placeholder-[#219EBC] w-full"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center mb-30">
          <div className="md:w-1/2">
            <h1 className="text-orange-500 text-3xl font-bold">ĐỊA ĐIỂM</h1>
            <h2 className="text-xl font-bold mt-2" style={{ color: "#219EBC" }}>
              Lý tưởng dành cho mùa hè 2025
            </h2>
            <p className="mt-4 text-justify">
              Giữa cái nóng oi ả của mùa hè Sài Gòn, Công viên Bến Bạch Đằng là
              một điểm đến lý tưởng để tận hưởng không gian mát mẻ và làn gió
              sông Sài Gòn trong lành. Nằm ngay trung tâm thành phố, công viên
              không chỉ là nơi thư giãn mà còn mang đến nhiều trải nghiệm thú vị
              như đi dạo ven sông, đạp xe, hay nghỉ chân tại các quán cà phê
              ngoài trời với view cực đẹp. Đặc biệt, vào buổi chiều tối, bạn có
              thể thưởng thức hoàng hôn lãng mạn trên sông hoặc tham gia các
              tour du thuyền ngắm nhìn thành phố rực rỡ về đêm. Mùa hè 2025, nơi
              đây hứa hẹn sẽ là sân chơi sôi động với các sự kiện ngoài trời,
              các phiên chợ và không gian nghệ thuật đường phố, biến Bến Bạch
              Đằng thành điểm đến không thể bỏ lỡ cho giới trẻ Sài Gòn.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            <Image
              alt="Aerial view of a city with a river and tall buildings"
              className="rounded-lg w-full lg:max-h-[300px] object-cover"
              src="/images/5.png"
              width={400}
              height={300}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center md:flex-row-reverse gap-8 mt-8">
          <div className="md:w-1/2">
            <h1 className="text-orange-500 text-3xl font-bold">ẨM THỰC</h1>
            <p className="mt-4 text-justify">
              Mùa hè Sài Gòn mà không ghé chợ Hồ Thị Kỷ thì thật là thiếu sót!
              Đây là một trong những thiên đường ẩm thực đường phố sôi động nhất
              thành phố, nơi bạn có thể thưởng thức vô vàn món ngon với giá cả
              phải chăng. Từ những ly trà đào mát lạnh, kem bơ béo ngậy cho đến
              các món hải sản nướng thơm lừng, tất cả đều là lựa chọn hoàn hảo
              để giải nhiệt mùa hè. Đặc biệt, chợ còn nổi tiếng với các món ăn
              mang phong cách Campuchia như hủ tiếu Nam Vang, chè thốt nốt, mang
              đến trải nghiệm ẩm thực độc đáo. Vào mùa hè 2025, dự kiến khu chợ
              này sẽ càng nhộn nhịp hơn với các gian hàng mới, những món ăn sáng
              tạo và không gian trang trí bắt mắt, trở thành điểm check-in lý
              tưởng cho những tín đồ ẩm thực.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            <Image
              alt="Street view with colorful lanterns and people walking"
              className="rounded-lg w-full lg:max-h-[300px] object-cover"
              src="/images/6.png"
              width={400}
              height={300}
            />
          </div>
        </div>

        <h3 className="text-orange-500 text-3xl font-bold my-6">
          <br></br>
        </h3>

        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          {/* Cục box 1 */}
          <div className="w-full md:w-1/2 max-w-[900px] flex rounded-lg bg-white shadow-md overflow-hidden">
            <Image
              alt="Nhà thờ Đức Bà"
              className="w-[150px] h-[150px] object-cover rounded-lg"
              src="/images/7.png"
              width={150}
              height={150}
            />
            <div className="p-4 flex flex-col justify-between">
              <div>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <FaCalendarAlt />
                  07/02/2023 10:26:00 -07:00
                </p>
                <h2 className="text-md font-bold text-blue-700 mt-2">
                  &quot;Nhờ đọc các bài viết trên Tuổi Trẻ, tôi càng yêu Sài Gòn -
                  TP.HCM&quot;
                </h2>
                <p className="text-gray-700 mt-1 text-sm">
                  &quot;Nhờ đọc rất nhiều bài viết trên báo Tuổi Trẻ - giới thiệu về
                  đất Sài Gòn, về đường phố Sài Gòn, để rồi tôi yêu thương thêm
                  mảnh đất phương Nam nắng như rót mật này&quot;.
                </p>
              </div>
              <Link
                className="text-blue-500 hover:underline mt-2 text-sm font-semibold"
                href="#"
              >
                Đọc thêm
              </Link>
            </div>
          </div>

          {/* Cục box 2 */}
          <div className="w-full md:w-1/2 max-w-[900px] flex rounded-lg bg-white shadow-md overflow-hidden">
            <Image
              alt="Bitexco Sài Gòn"
              className="w-[150px] h-[150px] object-cover rounded-lg"
              src="/images/8.png"
              width={150}
              height={150}
            />
            <div className="p-4 flex flex-col justify-between">
              <div>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <FaCalendarAlt />
                  12/06/2024 12:48:00 -07:00
                </p>
                <h2 className="text-md font-bold text-blue-700 mt-2">
                  Kinh nghiệm du lịch Sài Gòn siêu chi tiết từ A - Z
                </h2>
                <p className="text-gray-700 mt-1 text-sm">
                  Sài Gòn được mệnh danh là &quot;thành phố không ngủ&quot; với nhịp sống
                  sôi động, hiện đại. Nơi đây thu hút du khách bởi những di tích
                  lịch sử, văn hóa lâu đời...
                </p>
              </div>
              <Link
                className="text-blue-500 hover:underline mt-2 text-sm font-semibold"
                href="#"
              >
                Đọc thêm
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#219EBC] mb-4 mt-30">
          BÀI VIẾT MỚI NHẤT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title:
                "Chuyến food tour 24h ở Sài Gòn: Ăn gì, đi đâu để no căng bụng?",
              img: "/images/9.png",
            },
            {
              title: "Khu Hà Tôn Quyền – Thiên đường sủi cảo chuẩn vị!",
              img: "/images/10.png",
            },
            {
              title: "Nên ăn cơm tấm với nước tương hay nước mắm?",
              img: "/images/11.png",
            },
            {
              title:
                "Truy lùng 7 khu chợ đêm Sài Gòn – Thiên đường ẩm thực ngon quên lối về!",
              img: "/images/12.png",
            },
          ].map((post, index) => (
            <div key={index} className="flex items-start space-x-4">
              <Image
                alt={post.title}
                className="w-24 h-24 object-cover rounded-xl"
                src={post.img}
                width={100}
                height={100}
              />
              <div className="flex flex-col justify-between">
                <h3 className="text-base font-semibold text-gray-800">
                  {post.title}
                </h3>
                <div className="text-gray-500 text-sm flex items-center space-x-1 mt-2">
                  <FaCalendarAlt />
                  <span>07 Th3 2025</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="#">
            <Button className="cursor-pointer bg-white border border-[#219EBC] text-[#219EBC] hover:bg-[#f0f8fb] font-semibold">
              Đọc thêm
            </Button>
          </Link>
        </div>
        <div className="mt-10 flex justify-center">
          <Image
            alt="Bữa ăn đa dạng với nhiều món ngon"
            className="rounded-[30px] w-[100%] h-auto max-h-[400px] object-cover"
            src="/images/13.png"
            width={1280}
            height={300}
          />
        </div>
        <br></br>
      </div>
      <FeedbackSection />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default ExplorePage;
