export interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  category: string;
  description?: string;
  colors: { value: string; label: string }[]; // ✅ Mảng object màu sắc
  sizes: string[];
  mainImage: string;
  images: string[];
  inStock: boolean;
  averageRating: number;
  numOfReviews: number;
  reviews?: { userId: string; rating: number; comment: string; createdAt: string }[];
}
