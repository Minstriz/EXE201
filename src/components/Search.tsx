"use client";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
function SearchSection() {
  return (
    <section className="w-full">
      <div className="pt-10 w-full flex flex-col items-center">
        {/* Ô tìm kiếm */}
        <div className="relative w-3/4 md:w-1/2 lg:max-w-[900px] flex rounded-full border border-gray-300 overflow-hidden">
          <div className="flex items-center px-3 transition-transform duration-300 transform hover:scale-125">
            <MagnifyingGlassIcon className="h-5 w-5 text-[#FB8501]" />
          </div>

          <input
            className="w-full py-2 px-2 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 caret-orange-500"
            type="text"
          />

          <button className="bg-[#FB8501] text-white px-4 py-2 rounded-r-full transition-transform duration-300 transform hover:scale-110">
            Tìm
          </button>
        </div>
        {/* Tìm kiếm phổ biến */}
        <h2 className="mt-6 text-xl font-bold text-[#219EBC]">
          Tìm kiếm phổ biến
        </h2>
        <div className="m-4 flex flex-wrap justify-center gap-3">
          {[
            "Quán ăn",
            "Mua sắm",
            "Lịch sử",
            "Triển lãm",
            "Âm nhạc",
            "Quán nước",
            "Phương tiện",
            "Kiến trúc",
          ].map((item, index) => (
            <span
              key={index}
              className="px-4 py-2 border border-[#219EBC] rounded-full text-[#219EBC] font-semibold hover:bg-[#219EBC] hover:text-white transition"
            >
              {item}
            </span>
          ))}
        </div>
        {/* Danh sách địa điểm trượt ngang */}
        <div className="w-full overflow-hidden">
          <div className="flex gap-10 p-6 overflow-x-auto scrollbar-hide justify-start lg:justify-center">
            {[
              {
                title: "NHÀ THỜ TÂN ĐỊNH",
                img: "/images/nhathotandinh.png",
              },
              {
                title: "BƯU ĐIỆN THÀNH PHỐ",
                img: "/images/buudienthanhpho.png",
              },
              {
                title: "CHỢ BẾN THÀNH",
                img: "/images/chobenthanh.png",
              },
              {
                title: "BẢO TÀNG MỸ THUẬT",
                img: "/images/baotangmythuat.png",
              },
            ].map((place, index) => (
              <div key={index} className="text-center flex-shrink-0 w-64">
                <Image
                  src={place.img}
                  alt={place.title}
                  className="w-full rounded-lg h-96 object-cover"
                  width={256}
                  height={384}
                />
                <h3 className="mt-2 text-lg font-bold text-gray-800">
    <span className="mt-7 text-lg font-bold text-[#023048]"></span>
    {place.title}
</h3>

              </div>
            ))}
          </div>
        </div>
        {/* Nút “Tìm hiểu thêm” */}
        <div className="mt-6  flex justify-start w-full px-48">
          <Link
            href="#"
            className="group bg-[#219EBC] text-white py-2 px-4 rounded-xl flex items-center gap-2 border border-[#219EBC] hover:bg-[#1b89a1] transition"
          >
            <p className="text-base">Tìm hiểu thêm</p>
            <ArrowRightIcon className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
             {/* kẻ sọc */}
          <div className="flex items-center w-full mt-6 px-48 gap-100">
            <div className="flex-1 h-0.5 bg-[#023048]" />
            <div className="flex-1 h-0.5 bg-[#023048]" />
          </div>
    
        {/* Sản phẩm mới */}
        <div className="mt-10 w-full flex flex-col items-center">
          {/* 3 sản phẩm */}
          <div className="flex gap-8 overflow-x-auto scrollbar-hide p-4 justify-start lg:justify-center">
            {[
              {
                title: "(TÚI TOTE) CHỢ BẾN THÀNH",
                price: "149.000 VNĐ",
                img: "/images/tote-chobenthanh.png",
              },
              {
                title: "(ÁO THUN) ĐỊNH ĐỘC LẬP",
                price: "199.000 VNĐ",
                img: "/images/ao-dinhdoclap.png",
              },
              {
                title: "(NHẪN DÁN) ĐỊA ĐIỂM DU LỊCH",
                price: "49.000 VNĐ",
                img: "/images/nhan-diadiemdulich.png",
              },
            ].map((prod, i) => (
              <div key={i} className="text-center flex-shrink-0 w-64">
                <Image
                  src={prod.img}
                  alt={prod.title}
                  width={256}
                  height={256}
                  className="mx-auto rounded-lg object-cover h-64"
                />
                <p className="mt-4 font-bold text-[#023048]">{prod.title}</p>
                <p className="mt-1 text-sm text-gray-700">{prod.price}</p>
              </div>
            ))}
          </div>

          {/* nút và chữ HOẶC */}
          <div className="flex items-center gap-6 mt-6">
            <Link
              href="#"
          
              className="bg-[#219EBC] text-white border border-[#219EBC] py-2 px-4 rounded-xl flex items-center gap-2 transition hover:bg-white hover:text-[#219EBC]"
            >
              Xem thêm sản phẩm
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <span className="font-bold">HOẶC</span>
            <Link
              href="#"
      
              className="bg-[#219EBC] text-white border border-[#219EBC] py-2 px-4 rounded-xl flex items-center gap-2 transition hover:bg-white hover:text-[#219EBC]"
            >
              Tự thiết kế sản phẩm của bạn
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

         
        </div>
      </div>
    </section>
  );
}

export default SearchSection;
