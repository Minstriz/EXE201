"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

const reviews = [
  {
    title: "BÁNH MÌ, CÀ PHÊ GÌ CHƯA NGƯỜI ĐẸP? ^^",
    content:
      "Sáng dậy sớm ngồi cà phê bệt ở nhà thờ Đức Bà, tay trái ổ bánh mì tay phải ly cà phê, ngon lành :))",
    img: "/images/banhmi.png",
    date: "10.02.25",
    author: "minhsapoche",
  },
  {
    title: "DINH ĐỘC LẬP ĐẸP HƠN TUI TƯỞNG Á MẤY NÍ",
    content:
      "Lần đầu tiên đi Dinh Độc Lập, đó giờ tưởng chỉ có bên ngoài đẹp, thì ra bên trong còn nhiều thứ hay hơn nữa á mấy ní...",
    img: "/images/dinhdoclap.png",
    date: "06.03.25",
    author: "diemphucne",
  },
];

export default function Review() {
  return (
    <section className="w-full ">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row"
          >
            {/* Hình ảnh luôn vuông */}
            <div className="relative w-full md:w-1/2 aspect-square">
              <Image src={r.img} alt={r.title} fill className="object-cover" />
            </div>

            {/* Nội dung */}
            <div className="flex flex-col justify-between p-6 w-full md:w-1/2">
              <div>
                <h3 className="text-xl font-bold text-[#219EBC]">{r.title}</h3>
                <p className="mt-3 text-base text-gray-800 leading-relaxed">
                  {r.content}
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="#"
                  className="text-[#FB8501] font-semibold hover:underline"
                >
                  XEM THÊM
                </Link>
                <div className="flex items-center text-sm text-gray-500 mt-4 gap-1">
                  <HeartIcon className="w-5 h-5 text-[#FB8501]" />
                  <span>
                    {r.date}, bởi{" "}
                    <span className="font-medium">{r.author}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ảnh nền phía dưới với gradient overlay */}
      <div className="relative w-full mt-12">
        <Image
          src="/images/hero-background.png"
          alt="Saigon cityscape"
          width={1920}
          height={700}
          className="w-full h-80 lg:h-[1200px] object-cover"
        />

        {/* Gradient phía trên */}
        <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-white via-transparent to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
