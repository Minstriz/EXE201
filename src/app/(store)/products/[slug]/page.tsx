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
import toast from "react-hot-toast";
import { useWishlistStore } from "@/store/useWhistlist";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleFavorite, items: favorites } = useWishlistStore();
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const router = useRouter();

  // Di chuyển các useState và logic tính toán lên đầu
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Logic tính toán này cũng nên nằm ở đây hoặc trong useEffect/useMemo
  const descriptionPreview =
    product?.description &&
    product.description.length > 200 &&
    !showFullDescription
      ? product.description.substring(0, 200) + "..."
      : product?.description || "";

  // Tính toán ratingCounts cũng nên ở đây
  const ratingCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  product?.reviews?.forEach((review) => {
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

    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: 1,
      category: product.category,
      size: selectedSize,
    });
    toast.success("Thêm sản phẩm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Vui lòng chọn kích thước và màu sắc!");
      return;
    }
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: 1,
      category: product.category,
      size: selectedSize,
    });
    router.push("/cart");
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
    <div className="container mx-auto pt-[50px] px-4 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-5 md:mb-10 px-4 lg:px-0">
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
      <div className="flex flex-col-reverse items-start lg:flex-row justify-center lg:gap-20">
        {/* Chi tiết sản phẩm */}
        <div className="lg:w-[460px] w-full py-5 lg:py-0">
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
              {product.colors?.map((color) => (
                <div
                  key={color.value}
                  className={`w-6 h-6 rounded-full border cursor-pointer ${
                    selectedColor === color.value ? "ring-2 ring-black" : ""
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
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded cursor-pointer ${
                    selectedSize === size
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

          {/* Mô tả sản phẩm */}
          <div className="mt-4">
            <span className="block text-sm text-gray-600">Mô tả:</span>
            <p className="text-base text-gray-800">
              {descriptionPreview}
              {product?.description && product.description.length > 200 && (
                <button
                  type="button"
                  className="ml-2 text-[#219EBC] underline text-sm"
                  onClick={() => setShowFullDescription((prev) => !prev)}
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </p>
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
              <Button className="cursor-pointer" onClick={handleBuyNow}>
                <ShoppingBagIcon className="w-6 h-6" />
                <span>Mua ngay</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Hình ảnh sản phẩm */}
        <div className="lg:w-[440px] lg:pl-10 mt-8 lg:mt-0 relative">
          <div className="relative w-[400px] h-[400px] mx-auto">
            <Image
              alt={product.name}
              className="w-full h-full rounded-4xl object-contain"
              src={product.mainImage}
              width={400}
              height={400}
            />
            <HeartIcon
              className={`w-8 h-8 absolute top-4 right-4 cursor-pointer transition ${
                favorites.some((fav) => fav.id === product.id)
                  ? "text-red-500 fill-red-500"
                  : "text-white"
              }`}
              onClick={handleToggleFavorite}
            />
          </div>

          {/* Gallery */}
          {product.images?.length > 0 && (
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

      {/* Container chung */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[80%]">
          {/* Tiêu đề Đánh giá */}
          <div className="mt-10 w-full">
            <h2 className="text-xl font-bold text-[#219EBC] mb-6">Đánh giá</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-10 w-full">
              {/* Trái: điểm trung bình */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#D9D9D9"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#219EBC"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="283"
                      strokeDashoffset={
                        283 - (283 * product.averageRating) / 10
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-bold text-[#FB8501]">
                      {product.averageRating.toFixed(1)}
                      <span className="text-base font-normal text-black">
                        /10
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">Xuất sắc</p>
                    <p className="text-xs text-gray-500">
                      {product.numOfReviews} đánh giá
                    </p>
                  </div>
                </div>
              </div>

              {/* Phải: biểu đồ thang điểm */}
              <div className="flex-grow w-full">
                <div className="flex flex-col gap-3 text-sm">
                  {[
                    { label: "9-10", value: 100 },
                    { label: "7-8", value: 60 },
                    { label: "5-6", value: 60 },
                    { label: "3-4", value: 60 },
                    { label: "1-2", value: 60 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-[45px] text-right text-[#1A1A1A]">
                        {item.label}
                      </div>
                      <div className="flex-1 bg-[#D9D9D9] h-[10px] rounded-full">
                        <div
                          className="h-[10px] rounded-full bg-[#219EBC]"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú + Viết đánh giá + Textarea */}
          <div className="mt-10">
            {/* Ghi chú */}
            <p className="text-sm text-gray-500">
              Chỉ những khách đã mua sản phẩm qua À Sài Gòn mới có thể để lại
              đánh giá.
            </p>

            {/* Tiêu đề */}
            <h3 className="mt-4 text-base font-semibold text-[#1A1A1A]">
              Đánh giá từ khách hàng thực tế
            </h3>

            {/* Nút Viết đánh giá */}
            <div className="w-full flex justify-start mt-4">
              <button className="bg-[#219EBC] text-white font-semibold py-2 px-4 rounded-full text-sm">
                Viết đánh giá
              </button>
            </div>

            {/* Nút Xem toàn bộ đánh giá ở giữa */}
            <div className="w-full flex justify-center mt-4">
              <button className="border border-[#219EBC] text-[#219EBC] font-bold py-3 px-6 rounded-[8px] text-sm hover:bg-[#219EBC] hover:text-white transition">
                XEM TOÀN BỘ ĐÁNH GIÁ
              </button>
            </div>

            {/* Textarea */}
            <div className="mt-6">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#219EBC]"
                rows={4}
                placeholder="Viết đánh giá của bạn..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <br></br>
    </div>
  );
}

export default ProductPage;
