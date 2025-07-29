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
  reviews?: {
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}
type UseProductsProps = {
  category?: string | null;
};
// Dữ liệu mẫu
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Áo Thun Sàigònese",
    price: 199000,
    category: "Áo Thun",
    slug: "ao-thun-saigonese",
    mainImage: "/images/default/aothung/1.png",
    images: [
      "/images/default/aothung/1.png",
      "/images/default/aothung/1.2png.png",
    ],
    description:
      "Áo thun Sàigònese basic, chất liệu cotton 100%, form rộng thoải mái, thoáng mát, phù hợp với mọi hoạt động hàng ngày. Thiết kế đơn giản, dễ phối đồ, là lựa chọn hoàn hảo cho tủ đồ của bạn.",
    colors: [
      { value: "#000000", label: "Đen" },
      { value: "#FFFFFF", label: "Trắng" },
    ],
    sizes: ["35 CM", "40 CM"],
    inStock: true,
    averageRating: 9.7,
    numOfReviews: 3,
    reviews: [
      {
        userId: "user1",
        rating: 10,
        comment: "Sản phẩm rất tốt!",
        createdAt: "2024-01-15T10:00:00Z",
      },
      {
        userId: "user2",
        rating: 9,
        comment: "Chất lượng ổn, giao hàng nhanh.",
        createdAt: "2024-02-20T11:30:00Z",
      },
      {
        userId: "user3",
        rating: 9,
        comment: "Đúng như mô tả.",
        createdAt: "2024-03-01T14:45:00Z",
      },
    ],
  },
  {
    id: 2,
    name: "ÁO THUN MÊ CƠM TẤM",
    price: 199000,
    category: "Áo Thun",
    slug: "ao-thun-me-com-tam",
    mainImage: "/images/default/aothung/2.png", 
    images: ["/images/default/aothung/2.png", "/images/default/aothung/2.2.png"],
    description:
      "Áo thun màu mê cơm tấm cho những người thích ăn cơm tấm, mát mẻ, đem đi ăn phở là hết bài vở, mang lại cảm giác dễ chịu khi mặc. Chất liệu vải mềm mại, không nhăn, phù hợp cho cả nam và nữ.",
    colors: [
      { value: "#000000", label: "Đen" },
      { value: "#FFFFFF", label: "Trắng" },
    ],
    sizes: ["35 CM", "40 CM"],
    inStock: true,
    averageRating: 8.5,
    numOfReviews: 5,
    reviews: [], 
  },
  {
    id: 3,
    name: "ÁO THUN BÁNH MÌ FULL TOPPING",
    price: 199000,
    category: "Áo Thun",
    slug: "ao-thun-banh-mi-fulltoping",
    mainImage: "/images/default/aothung/3.png", // ← thay bằng local
    images: ["/images/default/aothung/3.png", "/images/default/aothung/3.2.png"],
    description:
      "Áo thun cho cư dân nào nghiện bánh mì, giòn rụm, ngập nhân và đảm bảo ngon hẹ hẹ hẹ!",
    colors: [{ value: "#FFFFFF", label: "Trắng" }, {value:"#000000", label:"Đen"}],
    sizes: ["35 CM", "40 CM"],
    inStock: true,
    averageRating: 9.0,
    numOfReviews: 2,
    reviews: [],
  },
  {
    id: 4,
    name: "Túi Tote À Sài Gòn",
    price: 149000,
    category: "Túi tote",
    slug: "tui-tote-a-sai-gon",
    mainImage: "/images/default/tote/1.png",
    images: [
      "/images/default/tote/1.png",
    ],
    description:
      "Túi tote À Sài Gòn, tiện lợi, màu trẻ trung, không gian rộng rãi chứa nhiều đồ dùng cá nhân. Phù hợp đi học, đi làm, đi chơi.",
    colors: [
      { value: "#FFFFFF", label: "Trắng" },
    ],
    sizes: ["35 CM"],
    inStock: true,
    averageRating: 7.8,
    numOfReviews: 1,
    reviews: [],
  },
  {
    id: 5,
    name: "Túi Tote SGO-VN Since 1698",
    price: 149000,
    category: "Túi tote",
    slug: "tui-tote-sgo-vn",
    mainImage: "/images/default/tote/2.png", 
    images: ["/images/default/tote/2.png"],
    description:
      "SGO-VN Since 1698 sang trọng, cổ điển, thiết kế tối giản, dễ dàng phối hợp với mọi trang phục. Chất liệu canvas bền bỉ.",
    colors: [{ value: "#FFFFFF", label: "Trắng" }],
    sizes: ["40 CM"],
    inStock: true,
    averageRating: 9.2,
    numOfReviews: 4,
    reviews: [],
  },
  {
    id: 6,
    name: "Túi Tote Cà Phê phin Sữa Đá",
    price: 49000,
    category: "Túi tote",
    slug: "tui-tote-ca-phe-phin-sua-da",
    mainImage: "/images/default/tote/3.png", 
    images: ["/images/default/tote/3.png"],
    description:
      "Túi tote cà phê phin sữa đá, mang theo bên người giúp bạn luôn tỉnh táo",
    colors: [{ value: "#FFFFFF", label: "Trắng" }],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 8.0,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 8,
    name: "Túi Tote Bánh Mì Full",
    price: 49000,
    category: "Túi tote",
    slug: "tui-tote-banh-mi-full",
    mainImage: "/images/default/tote/4.png", // ← thay bằng local
    images: ["/images/default/tote/4.png"],
    description:
      "Túi tote bánh mì full.",
    colors: [{ value: "#FFFFFF", label: "Trắng" }],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 9.5,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 9,
    name: "Túi tote mê Cơm Tấm",
    price: 49000,
    category: "Túi tote",
    slug: "tui-tote-me-com-tam",
    mainImage: "/images/default/tote/5.png",
    images: ["/images/default/tote/5.png"],
    description:
      "Túi tote mê cơm tấm",
    colors: [{ value: "#FFFFFF", label: "Trắng" }],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 9.5,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 10,
    name: "Túi tote SàiGònese",
    price: 49000,
    category: "Túi tote",
    slug: "tui-tote-saigonese",
    mainImage: "/images/default/tote/5.png",
    images: ["/images/default/tote/5.png"],
    description:
      "Túi tote mang biểu tượng Sài Gòn được ưa chuộng",
    colors:[{ value: "#FFFFFF", label: "Trắng" }],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 11,
    name: "Bộ Sticker địa điểm du lịch Sài Gòn",
    price: 49000,
    category: "Sticker",
    slug: "sticker-dia-diem-du-lich-sai-gon",
    mainImage: "/images/default/sticker/STICKER1.png",
    images: ["/images/default/sticker/STICKER1.png"],
    description:
      "Sticker chứa nhiều địa điểm du lịch ở sài gòn, mang sài gòn đi khắp nơi!",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 13,
    name: "Bộ Sticker địa điểm du lịch Sài Gòn",
    price: 49000,
    category: "Sticker",
    slug: "sticker-sai-gon-text",
    mainImage: "/images/default/sticker/STICKER2.png",
    images: ["/images/default/sticker/STICKER2.png"],
    description:
      "Sticker gồm nhiều text của À Sài Gòn!",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
];

export const useProducts = ({ category }: UseProductsProps = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setTimeout(() => {
    let filtered = mockProducts;

    if (category) {
      const normalize = (str: string) =>
        str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      const normalizedCategory = normalize(category);

      filtered = mockProducts.filter(
        (product) => normalize(product.category) === normalizedCategory
      );
    }

    setProducts(filtered);
    setLoading(false);
  }, 1000);
}, [category]);


  return { products, loading };
};
