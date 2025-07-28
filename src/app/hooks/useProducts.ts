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
    name: "Áo Thun Trắng",
    price: 199000,
    category: "Áo Thun",
    slug: "ao-thun-trang",
    mainImage: "/images/19.png",
    images: [
      "/images/19.png",
      "/images/anh_phu/NHÀ HÁT THÀNH PHỐ.png",
      "/images/anh_phu/CHỢ BẾN THÀNH.png",
    ],
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
    name: "Áo Thun Đen",
    price: 199000,
    category: "Áo Thun",
    slug: "ao-thun-den",
    mainImage: "/images/20.png", // ← thay bằng local
    images: ["/images/20.png", "/images/ao-thun-xanh-2.png"],
    description:
      "Áo thun màu đen tươi mát, mang lại cảm giác dễ chịu khi mặc. Chất liệu vải mềm mại, không nhăn, phù hợp cho cả nam và nữ.",
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
    description:
      "Áo thun trắng tinh khôi, dễ dàng kết hợp với nhiều phong cách. Chất liệu bền đẹp, giữ form sau nhiều lần giặt.",
    colors: [{ value: "#FFFFFF", label: "Trắng" }],
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
    images: [
      "/images/anh_phu/NHÀ THỜ ĐỨC BÀ copy.png",
      "/images/anh_phu/NHÀ THỜ ĐỨC BÀ copy.png",
    ],
    description:
      "Túi tote tiện lợi, màu trẻ trung, không gian rộng rãi chứa nhiều đồ dùng cá nhân. Phù hợp đi học, đi làm, đi chơi.",
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
    description:
      "Túi tote màu đen sang trọng, thiết kế tối giản, dễ dàng phối hợp với mọi trang phục. Chất liệu canvas bền bỉ.",
    colors: [{ value: "#000000", label: "Đen" }],
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
    description:
      "Sticker hình trái tim dễ thương, dùng để trang trí laptop, sổ tay, hoặc bất kỳ bề mặt phẳng nào. Keo dán chắc chắn, không để lại vết.",
    colors: [{ value: "#FF0000", label: "Đỏ" }],
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
    description:
      "Sticker hình ngôi sao lấp lánh, thêm điểm nhấn cá tính cho đồ dùng của bạn. Chất liệu chống nước, bền màu.",
    colors: [{ value: "#FFFF00", label: "Vàng" }],
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
    description:
      "Sticker hình hoa hồng nghệ thuật, thích hợp cho những ai yêu thích vẻ đẹp lãng mạn. Dễ dàng bóc dán, không gây hư hại bề mặt.",
    colors: [{ value: "#FFC0CB", label: "Hồng" }],
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
    category: "Túi tote",
    slug: "tui-tote-dinh-doc-lap",
    mainImage: "/images/anh_phu/DINH ĐỘC LẬP copy.png",
    images: ["/images/anh_phu/DINH ĐỘC LẬP copy.png"],
    description:
      "Túi tote Dinh Độc Lập, phong cách trẻ trung, dễ dàng phối hợp với nhiều trang phục. Chất liệu canvas bền bỉ.",
    colors: [{ value: "#FFC0CB", label: "Hồng" }],
    sizes: ["One Size"],
    inStock: true,
    averageRating: 9.5,
    numOfReviews: 0,
    reviews: [],
  },
  // --- Thêm 7 sản phẩm áo thun ---
  {
    id: 10,
    name: "Áo Thun - Bảo Tàng Lịch Sử",
    price: 199000,
    category: "Áo Thun",
    slug: "bao-tang-lich-su",
    mainImage: "/images/products/bao-tang-lich-su.png",
    images: [],
    description:
      "Áo Thun - Bảo Tàng Lịch Sử in hình nổi bật, chất liệu cotton thoáng mát.",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 11,
    name: "Áo Thun - Bitexco",
    price: 199000,
    category: "Áo Thun",
    slug: "bitexco",
    mainImage: "/images/products/bitexco.png",
    images: [],
    description:
      "Áo Thun - Bitexco in hình nổi bật, chất liệu cotton thoáng mát.",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 12,
    name: "Áo Thun - Bưu Điện Thành Phố",
    price: 199000,
    category: "Áo Thun",
    slug: "buu-dien",
    mainImage: "/images/products/buu-dien.png",
    images: [],
    description:
      "Áo Thun - Bưu Điện Thành Phố in hình nổi bật, chất liệu cotton thoáng mát.",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 13,
    name: "Áo Thun - Chợ Bến Thành",
    price: 199000,
    category: "Áo Thun",
    slug: "cho-ben-thanh",
    mainImage: "/images/products/cho-ben-thanh.png",
    images: [],
    description:
      "Áo Thun - Chợ Bến Thành in hình nổi bật, chất liệu cotton thoáng mát.",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 14,
    name: "Áo Thun - Dinh Độc Lập",
    price: 199000,
    category: "Áo Thun",
    slug: "dinh-doc-lap",
    mainImage: "/images/products/dinh-doc-lap.png",
    images: [],
    description:
      "Áo Thun - Dinh Độc Lập in hình nổi bật, chất liệu cotton thoáng mát.",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 15,
    name: "Áo Thun - Nhà Hát Thành Phố",
    price: 199000,
    category: "Áo Thun",
    slug: "nha-hat-thanh-pho",
    mainImage: "/images/products/nha-hat-thanh-pho.png",
    images: [],
    description:
      "Áo Thun - Nhà Hát Thành Phố in hình nổi bật, chất liệu cotton thoáng mát.",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
    id: 16,
    name: "Áo Thun - Nhà Thờ Đức Bà",
    price: 199000,
    category: "Áo Thun",
    slug: "nha-tho-duc-ba",
    mainImage: "/images/products/nha-tho-duc-ba.png",
    images: [],
    description:
      "Áo Thun - Nhà Thờ Đức Bà in hình nổi bật, chất liệu cotton thoáng mát.",
    colors: [],
    sizes: [],
    inStock: true,
    averageRating: 4.7,
    numOfReviews: 0,
    reviews: [],
  },
  {
  id: 17,
  name: "Túi Tote Nhà Thờ Đức Bà",
  price: 149000,
  category: "Túi tote",
  slug: "tote-nha-tho-duc-ba",
  mainImage: "/images/tote/nha-tho-duc-ba.png",
  images: [],
  description: "Túi tote vải bố in hình Nhà Thờ Đức Bà – TP.HCM",
  colors: [],
  sizes: [],
  inStock: true,
  averageRating: 4.8,
  numOfReviews: 9,
  reviews: [],
},
{
  id: 18,
  name: "Túi Tote Bưu Điện Thành Phố",
  price: 149000,
  category: "Túi tote",
  slug: "tote-buu-dien",
  mainImage: "/images/tote/buu-dien-thanh-pho.png",
  images: [],
  description: "Túi tote in hình Bưu Điện Thành Phố cổ kính, đậm chất Sài Gòn xưa.",
  colors: [],
  sizes: [],
  inStock: true,
  averageRating: 4.6,
  numOfReviews: 6,
  reviews: [],
},
{
  id: 19,
  name: "Túi Tote Bitexco",
  price: 149000,
  category: "Túi tote",
  slug: "tote-bitexco",
  mainImage: "/images/tote/bitexco.png",
  images: [],
  description: "Túi tote Bitexco hiện đại, phù hợp với giới trẻ thành thị.",
  colors: [],
  sizes: [],
  inStock: true,
  averageRating: 4.5,
  numOfReviews: 5,
  reviews: [],
},
{
  id: 20,
  name: "Túi Tote Bảo Tàng Lịch Sử",
  price: 149000,
  category: "Túi tote",
  slug: "tote-lich-su",
  mainImage: "/images/tote/bao-tang-lich-su.png",
  images: [],
  description: "Túi tote in hình Bảo Tàng Lịch Sử với màu sắc cổ kính.",
  colors: [],
  sizes: [],
  inStock: true,
  averageRating: 4.9,
  numOfReviews: 10,
  reviews: [],
},
{
  id: 21,
  name: "Túi Tote Chợ Bến Thành",
  price: 149000,
  category: "Túi tote",
  slug: "tote-ben-thanh",
  mainImage: "/images/tote/cho-ben-thanh.png",
  images: [],
  description: "Túi tote in hình Chợ Bến Thành – điểm đến nổi bật của TP.HCM.",
  colors: [],
  sizes: [],
  inStock: true,
  averageRating: 4.6,
  numOfReviews: 9,
  reviews: [],
},
{
  id: 22,
  name: "Túi Tote Dinh Độc Lập",
  price: 149000,
  category: "Túi tote",
  slug: "tote-dinh-doc-lap",
  mainImage: "/images/tote/dinh-doc-lap.png",
  images: [],
  description: "Túi tote vải bố in hình Dinh Độc Lập – biểu tượng lịch sử Việt Nam.",
  colors: [],
  sizes: [],
  inStock: true,
  averageRating: 4.7,
  numOfReviews: 7,
  reviews: [],
},
{
  id: 23,
  name: "Túi Tote Nhà Hát Thành Phố",
  price: 149000,
  category: "Túi tote",
  slug: "tote-nha-hat",
  mainImage: "/images/tote/nha-hat-thanh-pho.png",
  images: [],
  description: "Túi tote in hình Nhà Hát Thành Phố – biểu tượng kiến trúc Pháp cổ điển.",
  colors: [],
  sizes: [],
  inStock: true,
  averageRating: 4.8,
  numOfReviews: 8,
  reviews: [],
}

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
