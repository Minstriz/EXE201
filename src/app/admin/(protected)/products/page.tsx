"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "inStock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStock, setFilterStock] = useState<"all" | "inStock" | "outStock">("all");

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    let url = "/api/products";
    if (search) url += `?search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
  };

  const handleSort = (field: "name" | "price" | "inStock") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterStock === "inStock") return p.inStock;
    if (filterStock === "outStock") return !p.inStock;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valA: any = a[sortBy];
    let valB: any = b[sortBy];
    if (sortBy === "name") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý sản phẩm</h1>
      <div className="flex gap-2 mb-4 justify-between items-center flex-wrap">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <select
          value={filterStock}
          onChange={e => setFilterStock(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="all">Tất cả</option>
          <option value="inStock">Còn hàng</option>
          <option value="outStock">Hết hàng</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3">Ảnh</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("name")}>Tên sản phẩm</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("price")}>Giá</th>
              <th className="p-3">Mã hàng</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("inStock")}>Tình trạng</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((p, idx) => (
              <tr key={p.id || idx} className="border-b hover:bg-gray-50 transition">
                <td className="p-2 text-center">
                  <Image
                    src={p.mainImage || "/images/placeholder.png"}
                    alt={p.name}
                    width={60}
                    height={60}
                    className="object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2">{p.price.toLocaleString()}₫</td>
                <td className="p-2">{p.slug}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">
                  {p.inStock ? (
                    <span className="text-green-600 font-semibold">Còn hàng</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Hết hàng</span>
                  )}
                </td>
                <td className="p-2 flex gap-2 justify-center">
                  <Link href={`/admin/(protected)/products/edit/${p.id}`}>
                    <Button size="sm" variant="outline">Sửa</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => alert('Xoá sản phẩm chưa được hỗ trợ!')}>Xoá</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductPage;
