export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  description?: string;
  colors: { value: string; label: string }[]; // ✅ Mảng object màu sắc
  sizes: string[];
}
