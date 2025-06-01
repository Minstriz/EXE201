"use client";
import { useCategories } from "@/app/hooks/useCategories";
import { useProducts } from "@/app/hooks/useProducts";
import { useRouter } from "next/navigation"; // Import useRouter
import React, { useState } from "react";

function ProductList() {
  const { categories } = useCategories();
  const { products } = useProducts();
  const router = useRouter(); // Khai báo useRouter
  const [selectedCategory] = useState<string | null>(null);

  const uniqueCategories = Array.from(new Set(categories));

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="p-4">
      {/* Đường kẻ dưới */}
      <div className="max-w-screen-xl mx-auto px-4 my-4">
  <div className="h-[1px] bg-black w-full" />
</div>

    </div>
  );
}

export default ProductList;
