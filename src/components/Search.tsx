"use client";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useProducts } from "@/app/hooks/useProducts";
import { useState, useMemo, useEffect } from "react";

function SearchSection() {
  const { products } = useProducts();
  const [keyword, setKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [placeholder, setPlaceholder] = useState("Tìm sản phẩm...");

  const suggestions = useMemo(() => ["Tìm áo thun của À Sài Gòn",
    "Tìm Sticker của À Sài Gòn",
    "Tìm Túi tote của À Sài Gòn"], []
  );

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % suggestions.length;
      setPlaceholder(suggestions[index]);
    }, 1000);

    return () => clearInterval(interval);
  }, [suggestions]);
  // Normalize function for Vietnamese search
  const normalize = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

  const filteredProducts = useMemo(() => {
    if (!keyword.trim()) return [];

    const normalizedKeyword = normalize(keyword);
    const keywordParts = normalizedKeyword.split(" ").filter(Boolean); // tách từ

    return products.filter((p) => {
      const normalizedName = normalize(p.name);
      return keywordParts.every((part) => normalizedName.includes(part));
    });
  }, [keyword, products]);

  return (
    <section className="w-full">
      <div className="pt-10 w-full flex flex-col items-center">
        {/* Ô tìm kiếm */}
        <div className="relative w-3/4 md:w-1/2 lg:max-w-[900px] flex rounded-full border border-gray-300">
          <div className="flex items-center px-3 transition-transform duration-300 transform hover:scale-125">
            <MagnifyingGlassIcon className="h-5 w-5 text-[#FB8501]" />
          </div>

          <input
            className="w-full py-2 px-2 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 caret-orange-500"
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholder}
          />

          <button className="bg-[#FB8501] text-white px-4 py-2 rounded-r-full transition-transform duration-300 transform hover:scale-110">
            Tìm
          </button>

          {showDropdown && filteredProducts.length > 0 && (
            <div className="absolute left-0 top-full w-full bg-white border border-gray-200 shadow-lg z-20 rounded-b-xl max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-4 p-3 hover:bg-gray-100 transition"
                >
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.price.toLocaleString()} VNĐ</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
                slug: "nha-tho-tan-dinh",
              },
              {
                title: "BUU ĐIỆN THÀNH PHỐ",
                img: "/images/buudienthanhpho.png",
                slug: "buu-dien-thanh-pho",
              },
              {
                title: "CHỢ BẾN THÀNH",
                img: "/images/chobenthanh.png",
                slug: "cho-ben-thanh",
              },
              {
                title: "BẢO TÀNG MỸ THUẬT",
                img: "/images/baotangmythuat.png",
                slug: "bao-tang-my-thuat",
              },
            ].map((place, index) => (
              <Link
                href={`/blog/${place.slug}`}
                key={index}
                className="group text-center flex-shrink-0 w-64 mr-6 last:mr-0 transform transition-transform duration-300 hover:scale-105 animate-shake"
              >
                <div className="shimmer-effect rounded-lg overflow-hidden">
                  <Image
                    src={place.img}
                    alt={place.title}
                    className="w-full h-96 object-cover transition duration-300 group-hover:brightness-110 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-[#023048]"
                    width={256}
                    height={384}
                  />
                </div>
                <h3 className="mt-4 text-center text-base lg:text-lg font-semibold tracking-tight text-[#023048] uppercase group-hover:text-[#02537a] transition-colors duration-300">
                  {place.title}
                </h3>
              </Link>
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
                title: "(ÁO THUN) DINH ĐỘC LẬP",
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
              href="products"
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
