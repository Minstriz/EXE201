"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/context/CartContext";

const toteProducts = [
  {
    id: "tote1",
    name: "TÚI TOTE - À Sài Gòn",
    slug: "a-sai-gon",
    price: 199000,
    image: "/images/default/tote/1.png",
  },
  {
    id: "tote2",
    name: "TÚI TOTE - SGO - VN since 1698",
    slug: "sgo-vn",
    price: 199000,
    image: "/images/default/tote/2.png",
  },
  {
    id: "tote3",
    name: "TÚI TOTE - Cà Phê Phin Sữa Đá",
    slug: "ca-phe-sua-da",
    price: 199000,
    image: "/images/default/tote/3.png",
  },
  {
    id: "tote4",
    name: "TÚI TOTE - Bánh Mì Full Topping",
    slug: "banh-mi-full-topping",
    price: 199000,
    image: "/images/default/tote/4.png",
  },
  {
    id: "tote5",
    name: "TÚI TOTE - #MECƠM TẤM",
    slug: "mecomtam",
    price: 199000,
    image: "/images/default/tote/5.png",
  },
  {
    id: "tote6",
    name: "TÚI TOTE - SAIGONESE",
    slug: "saigonese",
    price: 199000,
    image: "/images/default/tote/6.png",
  },
];

export default function ToteDetailPage() {
  const { slug } = useParams();
  const product = toteProducts.find((p) => p.slug === slug);
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
      category: "TÚI TOTE",
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
            width={400} // 👈 nhỏ hơn
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

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-[#FB8501] hover:bg-[#e17600] text-white font-semibold px-6 py-2 rounded shadow"
            >
              Mua Ngay
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Về sản phẩm</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Mẫu túi “{product.name.replace("TÚI TOTE - ", "")}” mang đậm dấu ấn Sài Gòn. Thiết kế tinh
              tế, tiện lợi, phù hợp để đựng sách vở, laptop, hoặc dùng làm quà
              tặng đầy ý nghĩa.
            </p>
          </div>

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
