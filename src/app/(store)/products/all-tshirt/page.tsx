"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const products = [
  {
    id: "aothun1",
    name: "ÁO THUN SÀIGÒNNESE",
    price: 199000,
    category: "ÁO THUN",
    image: "/images/default/aothung/1.png",
    slug: "saigonese",
  },
  {
    id: "aothun2",
    name: "ÁO THUN MÊ CƠM TẤM",
    price: 199000,
    category: "ÁO THUN",
    image: "/images/default/aothung/2.png",
    slug: "mecomtam",
  },
  {
    id: "aothun3",
    name: "ÁO THUN BÁNH MÌ FULL TOPPING",
    price: 199000,
    category: "ÁO THUN",
    image: "/images/default/aothung/3.png",
    slug: "banh-mi-full-topping",
  },
  {
    id: "aothun4",
    name: "ÁO THUN CÀ PHÊ PHIN SỮA ĐÁ",
    price: 199000,
    category: "ÁO THUN",
    image: "/images/default/aothung/4.png",
    slug: "ca-phe-sua-da",

  },
  {
    id: "aothun5",
    name: "ÁO THUN SGO-VN",
    price: 199000,
    category: "ÁO THUN",
    image: "/images/default/aothung/5.png",
    slug: "sgo-vn",
  },
  {
    id: "aothun6",
    name: "ÁO THUN À SÀI GÒN",
    price: 199000,
    category: "ÁO THUN",
    image: "/images/default/aothung/6.png",
    slug: "a-sai-gon",
  },
];

export default function AllTshirtPage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[number]) => {
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
        ÁO THUN TRẮNG
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative bg-white rounded-md transition transform hover:-translate-y-1 border shadow-sm"
          >
            {/* ✅ Sửa đường dẫn slug riêng cho áo thun */}
            <Link href={`/products/all-tshirt/${product.slug}`}>
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
