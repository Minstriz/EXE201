"use client";
import { useEffect, useState } from "react";

// Dữ liệu danh mục mẫu
const mockCategories = ["Áo Thun", "Túi tote", "Sticker"];

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 500); // Giả lập delay tải dữ liệu
  }, []);

  return { categories, loading };
};
