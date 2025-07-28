"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/context/CartContext";

const tshirtProducts = [
  {
    id: "aothun1",
    name: "SAIGONESE",
    slug: "saigonese",
    price: 199000,
    images: {
      white: "/images/default/aothung/1.png",
      black: "/images/default/aothung/1.2.png",
    },
  },
  {
    id: "aothun2",
    name: "#MECƠM TẤM",
    slug: "mecomtam",
    price: 199000,
    images: {
      white: "/images/default/aothung/2.png",
      black: "/images/default/aothung/2.2.png",
    },
  },
  {
    id: "aothun3",
    name: "BÁNH MÌ FULL TOPPING",
    slug: "banh-mi-full-topping",
    price: 199000,
    images: {
      white: "/images/default/aothung/3.png",
      black: "/images/default/aothung/3.2.png",
    },
  },
  {
    id: "aothun4",
    name: "CÀ PHÊ SỮA ĐÁ",
    slug: "ca-phe-sua-da",
    price: 199000,
    images: {
      white: "/images/default/aothung/4.png",
      black: "/images/default/aothung/4.2.png",
    },
  },
  {
    id: "aothun5",
    name: "SGO - VN since 1698",
    slug: "sgo-vn",
    price: 199000,
    images: {
      white: "/images/default/aothung/5.png",
      black: "/images/default/aothung/5.2.png",
    },
  },
  {
    id: "aothun6",
    name: "À SÀI GÒN",
    slug: "a-sai-gon",
    price: 199000,
    images: {
      white: "/images/default/aothung/6.png",
      black: "/images/default/aothung/6.2.png",
    },
  },
];

const COLORS = [
  { value: "white", hex: "#f5f5f5", label: "Trắng" },
  { value: "black", hex: "#333333", label: "Đen" },
];

export default function TshirtDetailPage() {
  const { slug } = useParams();
  const product = tshirtProducts.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<"white" | "black">("white");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  if (!product)
    return <div className="pt-24 text-center">Không tìm thấy sản phẩm</div>;

  const colorLabel = selectedColor === "white" ? "Trắng" : "Đen";
  const uniqueId = `${product.id}_${selectedColor}_${selectedSize}`;

  const handleAddToCart = () => {
    addToCart({
      id: uniqueId,
      name: `${product.name} (${colorLabel} - ${selectedSize})`,
      price: product.price,
      image: product.images[selectedColor],
      quantity,
      category: "ÁO THUN",
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Ảnh sản phẩm */}
        <div>
          <Image
            src={product.images[selectedColor]}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-md object-contain w-full"
          />
        </div>

        {/* Chi tiết */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase mb-2">
            {product.name}
          </h1>
          <p className="text-lg font-semibold text-[#FB8501] mb-4">
            {product.price.toLocaleString()} VNĐ
          </p>

          {/* Màu sắc */}
          <div className="mb-4">
            <p className="font-medium mb-1">Màu sắc:</p>
            <div className="flex gap-4">
              {COLORS.map((color) => (
                <div
                  key={color.value}
                  onClick={() => setSelectedColor(color.value as "white" | "black")}
                  className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-transform hover:scale-105 ${
                    selectedColor === color.value ? "ring-4 ring-[#FB8501]" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-4">
            <p className="font-medium mb-1">Kích thước:</p>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  className={`border px-4 py-1 rounded ${
                    selectedSize === size ? "bg-[#219EBC] text-white" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng */}
          <div className="mb-6">
            <p className="font-medium mb-1">Số lượng:</p>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border w-20 px-2 py-1 rounded"
            />
          </div>

          {/* Nút mua */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-[#FB8501] hover:bg-[#e17600] text-white font-semibold px-6 py-2 rounded shadow"
            >
              Mua Ngay
            </button>
          </div>

          {/* Mô tả */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Về sản phẩm</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Mẫu áo thun “{product.name}” thể hiện cá tính độc đáo, mang đậm văn hóa Sài Gòn.
              Chất liệu cotton thoáng mát, phù hợp mặc hàng ngày hoặc làm quà tặng.
            </p>
          </div>

          {/* Đánh giá */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Đánh giá</h2>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-[#219EBC]">9.7</div>
              <div className="text-sm text-gray-600">3 đánh giá · Xuất sắc</div>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full mt-3">
              <div className="h-1 bg-[#219EBC] w-[95%] rounded-full" />
            </div>
            <button className="mt-3 text-[#219EBC] text-sm underline">
              Xem toàn bộ đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
