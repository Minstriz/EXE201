"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/context/CartContext";

const stickerProducts = [
  {
    id: "sticker1",
    name: "STICKER - Địa Điểm Sài Gòn",
    slug: "dia-diem-sai-gon",
    price: 39000,
    image: "/images/default/sticker/STICKER1.png",
  },
  {
    id: "sticker2",
    name: "STICKER - Câu Nói Dễ Thương",
    slug: "cau-noi-de-thuong",
    price: 39000,
    image: "/images/default/sticker/STICKER2.png",
  },
];

export default function StickerDetailPage() {
  const { slug } = useParams();
  const product = stickerProducts.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  if (!product)
    return <div className="pt-24 text-center">Không tìm thấy sản phẩm</div>;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: "STICKER",
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-md object-contain w-full max-w-sm mx-auto"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase mb-2">
            {product.name}
          </h1>
          <p className="text-lg font-semibold text-[#FB8501] mb-4">
            {product.price.toLocaleString()} VNĐ
          </p>

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
              Bộ sticker “{product.name.replace("STICKER - ", "")}” với thiết kế
              dễ thương, sắc nét và bám dính tốt. Dán lên laptop, sổ tay, bình
              nước hoặc trang trí mọi nơi bạn thích để thể hiện cá tính riêng.
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
