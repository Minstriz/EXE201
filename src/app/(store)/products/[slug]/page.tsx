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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "@/types/product";

function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { products } = useProducts();
  const { addItem } = useCartStore();
  const { toggleFavorite, items: favorites } = useWishlistStore();
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);

  // Di chuyển các useState và logic tính toán lên đầu
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Logic tính toán này cũng nên nằm ở đây hoặc trong useEffect/useMemo
  const descriptionPreview = product?.description && product.description.length > 200 && !showFullDescription
    ? product.description.substring(0, 200) + '...'
    : product?.description || '';

  // Tính toán ratingCounts cũng nên ở đây
  const ratingCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  product?.reviews?.forEach(review => {
    if (review.rating >= 1 && review.rating <= 10) {
      ratingCounts[review.rating]++;
    }
  });

  // useEffect này đã đúng vị trí
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.value || null);
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container mx-auto pt-[50px]">
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
      <div className="flex flex-col-reverse items-start lg:flex-row">
        {/* Chi tiết sản phẩm */}
        <div className="lg:w-1/2 py-5 lg:py-0">
          <div className="flex items-start gap-5">
            <h1 className="text-2xl font-bold mb-2">
              {product.name.toUpperCase()}
            </h1>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              {product.inStock ? "ĐANG CÓ HÀNG" : "HẾT HÀNG"}
            </span>
          </div>

          {/* Màu sắc */}
          <div className="mt-4">
            <span className="block text-sm text-gray-600">Màu sắc:</span>
            <div className="flex space-x-2 mt-2">
              {product.colors && product.colors.map((color) => (
                <div
                  key={color.value}
                  className={`w-6 h-6 rounded-full border cursor-pointer ${selectedColor === color.value ? "ring-2 ring-black" : ""
                    }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.label}
                ></div>
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div className="mt-4">
            <span className="block text-sm text-gray-600">Kích thước:</span>
            <div className="flex space-x-2 mt-2">
              {product.sizes && product.sizes.map((size) => (
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
              className="w-full h-full rounded-4xl object-contain"
              src={product.mainImage}
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
          {/* Product Image Gallery (Slider) */}
          {product.images && product.images.length > 0 && (
            <div className="mt-6 w-[400px] mx-auto">
              <Slider {...sliderSettings}>
                {product.images.map((img, index) => (
                  <div key={index} className="px-1 cursor-pointer">
                    <Image
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-auto object-fit rounded-md border border-gray-300"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
      {/* Product Description */}
      <div className="mt-10 px-5 lg:px-0">
        <h2 className="text-xl font-bold text-[#219EBC] mb-4">Về sản phẩm</h2>
        <p className="text-gray-700 leading-relaxed">
          {descriptionPreview}
        </p>
        {product.description && product.description.length > 200 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-[#219EBC] font-semibold mt-3 hover:underline"
          >
            {showFullDescription ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-10 ">
        {/* Product Reviews Section */}
        <div className="mt-10 px-5 lg:px-0 w-full flex flex-col">
          <h2 className="text-xl font-bold text-[#219EBC] mb-4">Đánh giá</h2>
          <div className="flex flex-col md:flex-col items-center md:items-start gap-8">
            <div className="w-full flex justify-center items-center">
              {/* Average Rating Circle */}
              <div className="flex flex-col pd-20 items-center justify-center p-6 bg-white rounded-full shadow-lg w-32 h-32 flex-shrink-0">
                <p className="text-4xl font-bold text-[#FB8501]">{product.averageRating.toFixed(1)}/10</p>
                <p className="text-sm text-gray-600 mt-1">Xuất sắc</p>
                <p className="text-xs text-gray-500">{product.numOfReviews} đánh giá</p>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="flex-grow w-full max-w-md">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => {
                  const count = product.reviews ? ratingCounts[rating] || 0 : 0;
                  const percentage = product.numOfReviews > 0 ? (count / product.numOfReviews) * 100 : 0;
                  return (
                    <React.Fragment key={rating}>
                      <div className="text-gray-600 text-right pr-2">{rating} / 10</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#219EBC] h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="bg-[#219EBC] text-white font-bold py-2 px-6 rounded-[7px] hover:bg-[#197ba3]">
            XEM TOÀN BỘ ĐÁNH GIÁ
          </button>
        </div>
        <div className="mt-4 flex justify-start mb-2 flex-col">
          <textarea
            className="w-full max-w-2xl p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#219EBC]"
            rows={4}
            placeholder="Viết đánh giá của bạn..."
          ></textarea>
          <div className="mt-8 text-start">
            <button className="bg-[#219EBC] text-white font-bold py-2 px-6 rounded-[7px] hover:bg-[#197ba3]">
              Đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
