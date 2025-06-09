"use client";
import React from "react";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/app/hooks/useCategories";
import { useProducts } from "@/app/hooks/useProducts";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { toast } from "sonner";

interface Product {
  id: number; // Assuming id is number for now based on previous JSON data
  name: string;
  price: number;
  image: string;
  category: string;
  // Add other fields as needed
}

function ProductPage() {
  const { categories } = useCategories();
  const { products, loading: loadingProducts } = useProducts();
  const { addToCart } = useCart();

  const groupedProducts = categories.reduce((acc: { [key: string]: Product[] }, category: string) => {
    acc[category] = products.filter((p: Product) => p.category === category);
    return acc;
  }, {});

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // đồng bộ 3 item
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="pt-20 max-w-7xl mt-20 mx-auto px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-400 mb-8">
        À SÀI GÒN CÓ GÌ?
      </h1>

      <div className="flex flex-wrap justify-start gap-2 mb-8">
        <Button
          variant="outline"
          className="border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC] hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18M3 10h18M3 16h18"
            />
          </svg>
        </Button>

        <Button
          variant="outline"
          className="border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC] hover:text-white"
        >
          Tất cả
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC] hover:text-white"
          >
            {category}
          </Button>
        ))}

        <Button
          variant="outline"
          className="border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC] hover:text-white"
        >
          Tự thiết kế
        </Button>
      </div>

      {loadingProducts ? (
        <p className="text-center">Đang tải sản phẩm...</p>
      ) : (
        Object.keys(groupedProducts).map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-bold text-[#219EBC] uppercase mb-6">
              {category}
            </h2>

            <div className="w-full flex justify-center">
              <div className="max-w-[1200px] w-full">
                <Slider {...sliderSettings}>
                  {groupedProducts[category].map((product: Product) => (
                    <div key={product.id} className="px-2">
                      <div className="relative bg-white rounded-md transition transform hover:-translate-y-1">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={348}
                          height={381}
                          className="rounded-md object-contain w-[348px] h-[381px]"
                        />

                        {/* Icon túi sách góc dưới bên phải */}
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

                        <div className="mt-3 px-2">
                          <p className="text-sm text-gray-700 font-medium uppercase">
                            [{product.category}] {product.name}
                          </p>
                          <p className="text-sm font-semibold text-black mt-1">
                            {product.price.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button className="bg-[#219EBC] text-white font-bold border border-white w-[135px] h-[40px] rounded-[7px] hover:bg-[#197ba3] flex items-center justify-center gap-2">
                Xem tất cả{" "}
                <span className="inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductPage;
