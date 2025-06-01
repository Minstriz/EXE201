"use client";
import { useState, useEffect } from "react";

// Dữ liệu mẫu
const mockProducts = [
  {
    id: 1,
    name: "Áo Thun Đen",
    price: 200_000, // dùng dấu _ để dễ đọc, không ảnh hưởng giá trị
    category: "Áo Thun",
    slug: "ao-thun-den",
    image: "/images/19.png", // local trong thư mục /public/images
    description:
      "Áo thun đen basic, chất liệu cotton 100%, form rộng thoải mái.",
    colors: [
      { value: "red", label: "Đỏ" },
      { value: "black", label: "Đen" },
      { value: "blue", label: "Xanh dương" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 100, // thêm tồn kho
    isHot: true, // đánh dấu sản phẩm nổi bật
  },
  {
    id: 2,
    name: "Áo Thun Xanh",
    price: 450000,
    category: "Áo Thun",
    slug: "ao-thun-xanh",
    image: "/images/20.png", // ← thay bằng local
    colors: [
      { value: "red", label: "đỏ" },
      { value: "black", label: "đen" },
      { value: "blue", label: "xanh dương" },
    ],
    sizes: ["S", "M", "L"],
  },
  {
    id: 3,
    name: "Áo Thun Trắng",
    price: 450000,
    category: "Áo Thun",
    slug: "ao-thun-trang",
    image: "/images/21.png", // ← thay bằng local
    colors: [
      { value: "red", label: "đỏ" },
      { value: "black", label: "đen" },
      { value: "blue", label: "xanh dương" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Túi Tote Xanh",
    price: 500000,
    category: "Túi tote",
    slug: "tui-tote-xanh",
    image: "/images/23.png", // ← thay bằng local
    colors: [
      { value: "red", label: "đỏ" },
      { value: "black", label: "đen" },
      { value: "blue", label: "xanh dương" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "Túi Tote Đen",
    price: 210000,
    category: "Túi tote",
    slug: "tui-tote-den",
    image: "/images/23.png", // ← thay bằng local
    colors: [
      { value: "red", label: "đỏ" },
      { value: "black", label: "đen" },
      { value: "blue", label: "xanh dương" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 6,
    name: "Sticker Trái Tim",
    price: 400000,
    category: "Sticker",
    slug: "sticker-trai-tim",
    image: "/images/25.png", // ← thay bằng local
    colors: [
      { value: "red", label: "đỏ" },
      { value: "black", label: "đen" },
      { value: "blue", label: "xanh dương" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 7,
    name: "Sticker Ngôi Sao",
    price: 300000,
    category: "Sticker",
    slug: "sticker-ngoi-sao",
    image: "/images/25.png", // ← thay bằng local
    colors: [
      { value: "red", label: "đỏ" },
      { value: "black", label: "đen" },
      { value: "blue", label: "xanh dương" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 8,
    name: "Sticker Hoa Hồng",
    price: 350000,
    category: "Sticker",
    slug: "sticker-hoa-hong",
    image: "/images/25.png", // ← thay bằng local
    colors: [
      { value: "red", label: "đỏ" },
      { value: "black", label: "đen" },
      { value: "blue", label: "xanh dương" },
    ],
    sizes: ["S", "M", "L", "XL"],
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
