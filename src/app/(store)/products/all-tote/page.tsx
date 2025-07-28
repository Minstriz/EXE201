"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const toteProducts = [
  {
    id: "tote1",
    name: "À Sài Gòn",
    price: 199000,
    category: "TÚI TOTE",
    image: "/images/default/tote/1.png",
    slug: "a-sai-gon",
  },
  {
    id: "tote2",
    name: "SGO - VN since 1698",
    price: 199000,
    category: "TÚI TOTE",
    image: "/images/default/tote/2.png",
    slug: "sgo-vn",
  },
  {
    id: "tote3",
    name: "Cà Phê Phin Sữa Đá",
    price: 199000,
    category: "TÚI TOTE",
    image: "/images/default/tote/3.png",
    slug: "ca-phe-sua-da",
  },
  {
    id: "tote4",
    name: "Bánh Mì Full Topping",
    price: 199000,
    category: "TÚI TOTE",
    image: "/images/default/tote/4.png",
    slug: "banh-mi-full-topping",
  },
  {
    id: "tote5",
    name: "#MECƠM TẤM",
    price: 199000,
    category: "TÚI TOTE",
    image: "/images/default/tote/5.png",
    slug: "mecomtam",
  },
  {
    id: "tote6",
    name: "SAIGONESE",
    price: 199000,
    category: "TÚI TOTE",
    image: "/images/default/tote/6.png",
    slug: "saigonese",
  },
];

export default function AllTotePage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof toteProducts[number]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-[#219EBC] uppercase mb-10">
        TÚI TOTE
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {toteProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white rounded-md transition transform hover:-translate-y-1 border shadow-sm"
          >
            <Link href={`/products/all-tote/${product.slug}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={348}
                height={381}
                className="rounded-md object-contain w-full h-[381px]"
              />
            </Link>

            <div
              className="absolute bottom-3 right-3 bg-white p-1 rounded-full shadow hover:bg-[#FB8501] cursor-pointer"
              onClick={() => handleAddToCart(product)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-[#FB8501] hover:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>

            <div className="mt-3 px-4 pb-4">
              <p className="text-sm text-gray-700 font-medium uppercase">
                [{product.category}] {product.name}
              </p>
              <p className="text-sm font-semibold text-black mt-1">
                {product.price.toLocaleString()} VNĐ
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
