import React from "react";
import Image from "next/image";

export default function FeedbackSection() {
  const feedbacks = [
    {
      name: "Phạm Quốc Thiên",
      avatar: "/images/16.png",
      comment: "Công nhận website rất tiện ích cho việc tìm kiếm của tôi",
    },
    {
      name: "Trần Hiền Anh",
      avatar: "/images/17.png",
      comment: "Sao đồ custom ở đây đáng iu dễ sợ ^^",
    },
    {
      name: "Trần Nhật Bảo",
      avatar: "/images/18.png",
      comment: "Tôi chưa từng nghĩ Sài Gòn có nhiều thứ như vầy lun, amazing good job!",
    },
  ];

  return (
    <div className="mt-10 w-full flex justify-center">
      <div className="w-full md:w-[80%]">
        <h2 className="text-center text-3xl font-bold text-[#219EBC] mb-8">
          PHẢN HỒI CỦA KHÁCH DU LỊCH
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-12 mb-10">
          {/* Feedback 1 */}
          <div className="text-center max-w-sm">
            <Image
              alt="Avatar khách 1"
              src="/images/14.png"
              width={120}
              height={120}
              className="mx-auto rounded-full"
            />
            <h3 className="mt-4 font-semibold uppercase">Trương Thị Hoa Hồng</h3>
            <p className="text-orange-400 text-sm mb-2">★★★★★</p>
            <p className="text-sm text-justify">
              Dự án Ẩm Sài Gòn mang đến trải nghiệm sống động, hấp dẫn và hứa hẹn nhiều giá trị cho thị trường du lịch.
            </p>
          </div>

          {/* Feedback 2 */}
          <div className="text-center max-w-sm">
            <Image
              alt="Avatar khách 2"
              src="/images/15.png"
              width={120}
              height={120}
              className="mx-auto rounded-full"
            />
            <h3 className="mt-4 font-semibold uppercase">Nguyễn Trung Hồng Phúc</h3>
            <p className="text-orange-400 text-sm mb-2">★★★★★</p>
            <p className="text-sm text-justify">
              Sài Gòn là nền tảng trải nghiệm đầy cảm hứng, sáng tạo, mang lại giá trị khác biệt và tiềm năng.
            </p>
          </div>
        </div>

        {/* Danh sách bình luận */}
        <div className="space-y-4 mb-6">
          {feedbacks.map((item, index) => (
            <div
              key={index}
              className="flex items-center border border-[#219EBC] rounded-lg p-3"
            >
              <Image
                alt={`Avatar ${item.name}`}
                src={item.avatar}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="ml-4">
                <p className="font-semibold text-[#219EBC]">{item.name}</p>
                <p className="text-sm">{item.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form để lại bình luận */}
        <div className="border border-[#219EBC] rounded-lg p-4">
          <textarea
            className="w-full border-none outline-none resize-none mb-4"
            rows={4}
            placeholder="Để lại bình luận của bạn tại đây"
          ></textarea>

          <div className="flex items-center space-x-2 mb-2 flex-wrap">
            <label className="flex items-center space-x-1">
              <input type="radio" name="gender" value="Anh" />
              <span>Anh</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="radio" name="gender" value="Chị" />
              <span>Chị</span>
            </label>

            <input
              type="text"
              placeholder="Họ và tên"
              className="border border-[#219EBC] rounded px-2 py-1 w-[150px]"
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-[#219EBC] rounded px-2 py-1 w-[200px]"
            />

            <button className="bg-[#FB8501] text-white font-semibold px-4 py-1 rounded">
              Gửi thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
