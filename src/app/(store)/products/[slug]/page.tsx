"use client";
import { useProducts } from "@/app/hooks/useProducts";
import React, { useState, useEffect, use } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  HeartIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/store/useWhistlist";
import Image from "next/image";

function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { products } = useProducts();
  const { addItem } = useCartStore();
  const { toggleFavorite, items: favorites } = useWishlistStore();
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.value || null); // ✅ Chỉ lấy `value`
      setSelectedSize(product.sizes[0] || null);
    }
  }, [product]);

  if (!product) {
    return <div className="pt-[120px] mx-auto">Đang tải...</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Vui lòng chọn kích thước và màu sắc!");
      return;
    }
    addItem(product, selectedSize, selectedColor);
    toast.success("Thêm sản phẩm vào giỏ hàng!");
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    toast.success(
      isFavorite ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích"
    );
  };

  return (
    <div className="container mx-auto pt-[120px]">
      {/* Breadcrumb */}
      <div className="mb-5 md:mb-10 ml-5 lg:ml-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/?category=${product.category}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-gray-800">{product.name}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Nội dung sản phẩm */}
      <div className="flex flex-col-reverse items-center lg:flex-row">
        {/* Chi tiết sản phẩm */}
        <div className="lg:w-1/2 py-5 lg:py-0">
          <div className="flex items-start gap-5">
            <h1 className="text-2xl font-bold mb-2">
              {product.name.toUpperCase()}
            </h1>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              ĐANG CÓ HÀNG
            </span>
          </div>

          {/* Màu sắc */}
          <div className="mt-4">
            <span className="block text-sm text-gray-600">Màu sắc:</span>
            <div className="flex space-x-2 mt-2">
              {product.colors.map((color) => (
                <div
                  key={color.value} // ✅ Dùng giá trị màu làm key
                  className={`w-6 h-6 rounded-full border cursor-pointer ${selectedColor === color.value ? "ring-2 ring-black" : ""
                    }`}
                  style={{ backgroundColor: color.value }} // ✅ Lấy `value` làm màu nền
                  onClick={() => setSelectedColor(color.value)}
                  title={color.label} // ✅ Hiển thị tên màu khi hover
                ></div>
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div className="mt-4">
            <span className="block text-sm text-gray-600">Kích thước:</span>
            <div className="flex space-x-2 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded cursor-pointer ${selectedSize === size
                    ? "bg-black text-white border-black"
                    : "border-gray-400"
                    }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Giá sản phẩm */}
          <div className="mt-4">
            <span className="block text-sm text-gray-600">Giá:</span>
            <p className="text-lg font-bold">
              {product.price.toLocaleString()} VND
            </p>
          </div>

          {/* Nút thêm vào giỏ hàng & mua ngay */}
          <div className="mt-4">
            <div className="flex gap-2">
              <Button className="cursor-pointer" onClick={handleAddToCart}>
                <ShoppingCartIcon className="w-6 h-6" />
                <span>Thêm vào giỏ hàng</span>
              </Button>
              <Button className="cursor-pointer">
                <ShoppingBagIcon className="w-6 h-6" />
                <span>Mua ngay</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Hình ảnh sản phẩm */}
        <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0 relative">
          <div className="relative w-[400px] h-[400px] mx-auto">
            <Image
              alt={product.name}
              className="w-full h-full rounded-4xl object-cover"
              src={product.image}
              width={400}
              height={400}
            />
            {/* Nút yêu thích */}
            <HeartIcon
              className={`w-8 h-8 absolute top-4 right-4 cursor-pointer transition ${favorites.some((fav) => fav.id === product.id)
                ? "text-red-500 fill-red-500"
                : "text-white"
                }`}
              onClick={handleToggleFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
