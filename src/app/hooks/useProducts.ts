"use client";
import { useState, useEffect } from "react";

// Define a consistent Product interface that matches IProduct from the model and the one used in product detail page
interface Product {
  id: number; // Assuming mock products still use number for id, will be string in actual DB fetch
  name: string;
  price: number;
  category: string;
  slug: string;
  mainImage: string; // Corresponds to 'image' in old mock, now explicitly mainImage
  images: string[]; // Additional images for gallery
  description: string;
  colors: { value: string; label: string }[];
  sizes: string[];
  inStock: boolean;
  averageRating: number;
  numOfReviews: number;
  reviews?: { userId: string; rating: number; comment: string; createdAt: string }[];
}

// Dữ liệu mẫu
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Áo Thun Trắng",
    price: 199000, 
    category: "Áo Thun",
    slug: "ao-thun-trang",
    mainImage: "/images/19.png", 
    images: ["/images/19.png", "/images/anh_phu/NHÀ HÁT THÀNH PHỐ.png", "/images/anh_phu/CHỢ BẾN THÀNH.png"],
    description:
      "Áo thun trắng basic, chất liệu cotton 100%, form rộng thoải mái, thoáng mát, phù hợp với mọi hoạt động hàng ngày. Thiết kế đơn giản, dễ phối đồ, là lựa chọn hoàn hảo cho tủ đồ của bạn.",
    colors: [
      { value: "#000000", label: "Đen" }, 
      { value: "#CCCCCC", label: "Xám be" },
      { value: "#219EBC", label: "Xanh ngọc" },
    ],
    sizes: ["35 CM", "40 CM"], 
    inStock: true,
    averageRating: 9.7,
    numOfReviews: 3,
    reviews: [
      { userId: "user1", rating: 10, comment: "Sản phẩm rất tốt!", createdAt: "2024-01-15T10:00:00Z" },
      { userId: "user2", rating: 9, comment: "Chất lượng ổn, giao hàng nhanh.", createdAt: "2024-02-20T11:30:00Z" },
      { userId: "user3", rating: 9, comment: "Đúng như mô tả.", createdAt: "2024-03-01T14:45:00Z" },
    ],
  },
  {
    id: 2,
    name: "Áo Thun Đen",
    price: 199000,
    category: "Áo Thun",
    slug: "ao-thun-den",
    mainImage: "/images/20.png", // ← thay bằng local
    images: ["/images/20.png", "/images/ao-thun-xanh-2.png"],
    description: "Áo thun màu đen tươi mát, mang lại cảm giác dễ chịu khi mặc. Chất liệu vải mềm mại, không nhăn, phù hợp cho cả nam và nữ.",
    colors: [
      { value: "#0000FF", label: "Xanh dương" },
      { value: "#008000", label: "Xanh lá" },
    ],
    sizes: ["35 CM", "40 CM"],
    inStock: true,
    averageRating: 8.5,
    numOfReviews: 5,
    reviews: [], // Example: no reviews yet
  },
  {
    id: 3,
    name: "Áo Thun Trắng",
    price: 199000,
    category: "Áo Thun",
    slug: "ao-thun-trang",
    mainImage: "/images/21.png", // ← thay bằng local
    images: ["/images/21.png", "/images/ao-thun-trang-2.png"],
    description: "Áo thun trắng tinh khôi, dễ dàng kết hợp với nhiều phong cách. Chất liệu bền đẹp, giữ form sau nhiều lần giặt.",
    colors: [
      { value: "#FFFFFF", label: "Trắng" },
    ],
    sizes: ["35 CM", "40 CM"],
    inStock: true,
    averageRating: 9.0,
    numOfReviews: 2,
    reviews: [],
  },
  {
    id: 4,
    name: "Túi Tote Nhà Thờ Đức Bà",
    price: 149000,
    category: "Túi tote",
    slug: "tui-tote-nha-tho-duc-ba",
    mainImage: "/images/anh_phu/NHÀ THỜ ĐỨC BÀ copy.png",
    images: ["/images/anh_phu/NHÀ THỜ ĐỨC BÀ copy.png", "/images/anh_phu/NHÀ THỜ ĐỨC BÀ copy.png"],
    description: "Túi tote tiện lợi, màu trẻ trung, không gian rộng rãi chứa nhiều đồ dùng cá nhân. Phù hợp đi học, đi làm, đi chơi.",
    colors: [
      { value: "#00FFFF", label: "Xanh ngọc" },
      { value: "#0000FF", label: "Xanh dương" },
    ],
    sizes: ["35 CM"],
    inStock: true,
    averageRating: 7.8,
    numOfReviews: 1,
    reviews: [],
  },
  {
    id: 5,
    name: "Túi Tote Chợ Bình Tây",
    price: 149000,
    category: "Túi tote",
    slug: "tui-tote-den",
    mainImage: "/images/23.png", // ← thay bằng local
    images: ["/images/23.png", "/images/tui-tote-den-2.png"],
    description: "Túi tote màu đen sang trọng, thiết kế tối giản, dễ dàng phối hợp với mọi trang phục. Chất liệu canvas bền bỉ.",
    colors: [
      { value: "#000000", label: "Đen" },
    ],
    sizes: ["40 CM"],
    inStock: true,
    averageRating: 9.2,
    numOfReviews: 4,
    reviews: [],
  },
  {
    id: 6,
    name: "Sticker Trái Tim",
    price: 49000,
    category: "Sticker",
    slug: "sticker-trai-tim",
    mainImage: "/images/25.png", // ← thay bằng local
    images: ["/images/25.png"],
    description: "Sticker hình trái tim dễ thương, dùng để trang trí laptop, sổ tay, hoặc bất kỳ bề mặt phẳng nào. Keo dán chắc chắn, không để lại vết.",
    colors: [
      { value: "#FF0000", label: "Đỏ" },
    ],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 8.0,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 7,
    name: "Sticker Ngôi Sao",
    price: 49000,
    category: "Sticker",
    slug: "sticker-ngoi-sao",
    mainImage: "/images/25.png", // ← thay bằng local
    images: ["/images/25.png"],
    description: "Sticker hình ngôi sao lấp lánh, thêm điểm nhấn cá tính cho đồ dùng của bạn. Chất liệu chống nước, bền màu.",
    colors: [
      { value: "#FFFF00", label: "Vàng" },
    ],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 7.5,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 8,
    name: "Sticker Mới",
    price: 49000,
    category: "Sticker",
    slug: "sticker-hoa-hong",
    mainImage: "/images/anh_phu/STICKER.png", // ← thay bằng local
    images: ["/images/anh_phu/STICKER.png"],
    description: "Sticker hình hoa hồng nghệ thuật, thích hợp cho những ai yêu thích vẻ đẹp lãng mạn. Dễ dàng bóc dán, không gây hư hại bề mặt.",
    colors: [
      { value: "#FFC0CB", label: "Hồng" },
    ],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 9.5,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 9,
    name: "Túi tote Dinh Độc Lập",
    price: 49000,
    category: "Sticker",
    slug: "tui-tote-dinh-doc-lap",
    mainImage: "/images/anh_phu/DINH ĐỘC LẬP copy.png",
    images: ["/images/anh_phu/DINH ĐỘC LẬP copy.png"],
    description: "Túi tote Dinh Độc Lập, phong cách trẻ trung, dễ dàng phối hợp với nhiều trang phục. Chất liệu canvas bền bỉ.",
    colors: [
      { value: "#FFC0CB", label: "Hồng" },
    ],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 9.5,
    numOfReviews: 0,
    reviews: [],
  },
];

export const useProducts = () => {
  const [products, setProducts] = useState<typeof mockProducts>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000); // Giả lập delay tải dữ liệu
  }, []);

  return { products, loading };
};
