"use client";

import Link from "next/link";
import Image from "next/image";

const products = [
  {
    title: "Áo Thun",
    image: "/images/customize/f_white.png",
    link: "/design/shirt/customize",
  },
  {
    title: "Túi Tote",
    image: "/images/tote/2.png",
    link: "/design/tote/customize",
  },
  {
    title: "Tự vẽ",
    image:"/images/black_white/aotrang.png",
    link:"/design/drawing/"
  }
];

export default function DesignHomePage() {
  return (
    <div className="min-h-screen px-4 pt-20 py-10 bg-white">
      <h1 className="text-4xl font-extrabold text-center text-[#219EBC] mb-12">
        CHỌN SẢN PHẨM MUỐN THIẾT KẾ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {products.map((item) => (
          <Link
            href={item.link}
            key={item.title}
            className="group border-2 border-[#219EBC] rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:border-[#FB8501] p-6"
          >
            <div className="flex flex-col items-center">
              <Image
                src={item.image}
                alt={item.title}
                width={350}
                height={350}
                className="object-contain rounded-[5px] mb-6 transition-transform duration-300 group-hover:scale-105 h-[300px]"
              />

              <h2 className="text-2xl font-semibold text-[#219EBC] group-hover:text-[#FB8501] text-center">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
